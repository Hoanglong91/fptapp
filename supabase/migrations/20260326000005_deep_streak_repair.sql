-- Deep Historical Streak Repair
-- This script calculates the ACTUAL current and longest streaks 
-- by analyzing every user's entire visit history in visit_logs.

DO $$
DECLARE
    r RECORD;
    v_date DATE;
    v_curr_streak INTEGER;
    v_long_streak INTEGER;
    v_last_date DATE;
    v_total_visits INTEGER;
BEGIN
    FOR r IN SELECT user_id FROM public.profiles LOOP
        v_curr_streak := 0;
        v_long_streak := 0;
        v_last_date := NULL;
        v_total_visits := 0;
        
        -- Get all unique visit dates for this user, sorted
        FOR v_date IN 
            SELECT DISTINCT visit_date 
            FROM public.visit_logs 
            WHERE user_id = r.user_id 
            ORDER BY visit_date ASC 
        LOOP
            v_total_visits := v_total_visits + 1;
            
            IF v_last_date IS NULL THEN
                -- First visit ever
                v_curr_streak := 1;
            ELSIF v_date = v_last_date + INTERVAL '1 day' THEN
                -- Consecutive day
                v_curr_streak := v_curr_streak + 1;
            ELSIF v_date = v_last_date THEN
                -- Same day, skip (redundant count check)
                CONTINUE;
            ELSE
                -- Gap found, reset current streak
                v_curr_streak := 1;
            END IF;
            
            -- Update longest streak
            IF v_curr_streak > v_long_streak THEN
                v_long_streak := v_curr_streak;
            END IF;
            
            v_last_date := v_date;
        END LOOP;
        
        -- After processing the whole history, check if the current streak is still active
        -- An active streak means the last visit was today or yesterday.
        -- If the last visit was older than yesterday, the "current_streak" in the DB should be 0.
        -- But for the sake of the repair, we'll store the "current streak" they had as of their last visit,
        -- BUT the app logic usually expects it to be 0 if they broke it today.
        
        IF v_last_date < CURRENT_DATE - INTERVAL '1 day' THEN
            v_curr_streak := 0;
        END IF;

        -- Final update to learning_streaks
        UPDATE public.learning_streaks
        SET total_visits = v_total_visits,
            current_streak = v_curr_streak,
            longest_streak = v_long_streak,
            last_visit_date = v_last_date,
            updated_at = now()
        WHERE user_id = r.user_id;
        
        -- If no record was updated (user has no streak record), insert it
        IF NOT FOUND AND v_total_visits > 0 THEN
            INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, total_visits, last_visit_date)
            VALUES (r.user_id, v_curr_streak, v_long_streak, v_total_visits, v_last_date);
        END IF;
    END LOOP;
END $$;
