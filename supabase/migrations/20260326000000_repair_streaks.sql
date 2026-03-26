-- 1. Create a temporary view/CTE to calculate stats for each user
WITH UserVisitStats AS (
    SELECT 
        user_id,
        COUNT(*) as calculated_total_visits,
        MAX(visit_date) as last_v_date
    FROM public.visit_logs
    GROUP BY user_id
),
StreakCalculations AS (
    -- Simple approximation for current streak: 
    -- If they visited today or yesterday, count how many consecutive days back
    -- For simplicity in a repair script, we'll set total_visits and last_visit accurately
    -- We can set current_streak to 1 if they visited today/yesterday as a baseline
    SELECT 
        user_id,
        calculated_total_visits,
        last_v_date,
        CASE 
            WHEN last_v_date >= CURRENT_DATE - INTERVAL '1 day' THEN 1
            ELSE 0
        END as base_streak
    FROM UserVisitStats
)
INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, total_visits, last_visit_date)
SELECT 
    p.user_id, 
    COALESCE(s.base_streak, 0), 
    COALESCE(s.base_streak, 0), 
    COALESCE(s.calculated_total_visits, 0),
    s.last_v_date
FROM public.profiles p
LEFT JOIN StreakCalculations s ON p.user_id = s.user_id
ON CONFLICT (user_id) DO UPDATE SET
    total_visits = EXCLUDED.total_visits,
    last_visit_date = EXCLUDED.last_visit_date,
    current_streak = GREATEST(learning_streaks.current_streak, EXCLUDED.current_streak),
    longest_streak = GREATEST(learning_streaks.longest_streak, EXCLUDED.longest_streak);

-- 2. Add comment for documentation
COMMENT ON TABLE public.learning_streaks IS 'Maintains daily login/visit streaks for students. Repaired on 2026-03-26.';
