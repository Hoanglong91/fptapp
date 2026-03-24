export interface CourseResource {
  id: number;
  title: string;
  source: string;
  type: 'documents' | 'research' | 'videos' | 'internship';
  rating?: number;
  downloads?: number;
  citations?: number;
  channel?: string;
  views?: string;
  duration?: string;
  url: string;
}

// Complete course data with accessible links for all 4 majors across all semesters
export const courseData: Record<string, Record<number, CourseResource[]>> = {
  se: {
    1: [
      { id: 1, title: 'CSI104 – Introduction to Computing (CS50)', source: 'Harvard CS50', type: 'documents', rating: 4.9, url: 'https://cs50.harvard.edu/x/' },
      { id: 2, title: 'MAE101 – Calculus 1 for Engineering', source: 'Khan Academy', type: 'documents', rating: 4.9, url: 'https://www.khanacademy.org/math/calculus-1' },
      { id: 3, title: 'PRF192 – C Programming Tutorial', source: 'YouTube', channel: 'freeCodeCamp', views: '15M', type: 'videos', url: 'https://www.youtube.com/watch?v=KJgsSFOSQv0' },
      { id: 4, title: 'CEA201 – Computer Organization & Architecture', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/' },
      { id: 5, title: 'SSL101c – Academic Skills for Success', source: 'Coursera', type: 'documents', rating: 4.7, url: 'https://www.coursera.org/learn/learning-how-to-learn' },
    ],
    2: [
      { id: 1, title: 'MAD101 – Discrete Mathematics for CS', source: 'YouTube', channel: 'TheTrevTutor', views: '3.5M', type: 'videos', url: 'https://www.youtube.com/watch?v=rdXw7Ps9vxc' },
      { id: 2, title: 'OSG202 – Operating Systems Principles', source: 'YouTube', channel: 'Neso Academy', views: '3.1M', type: 'videos', url: 'https://www.youtube.com/watch?v=vBURTt97EkA' },
      { id: 3, title: 'PRO192 – Java OOP Programming', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/java/java_oop.asp' },
      { id: 4, title: 'NWC204 – Computer Network Basics', source: 'NetworkChuck', type: 'videos', channel: 'YouTube', views: '5.6M', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw' },
      { id: 5, title: 'SSG101 – Self-Management Skills', source: 'MindTools', type: 'documents', rating: 4.5, url: 'https://www.mindtools.com/pages/main/newMN_HTE.htm' },
    ],
    3: [
      { id: 1, title: 'CSD201 – Data Structures & Algorithms', source: 'freeCodeCamp', type: 'videos', views: '4.2M', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
      { id: 2, title: 'DBI202 – SQL & Database Systems', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/sql/' },
      { id: 3, title: 'MAS291 – Statistics & Probability', source: 'Khan Academy', type: 'documents', rating: 4.9, url: 'https://www.khanacademy.org/math/statistics-probability' },
      { id: 4, title: 'JPD113 – Japanese for Beginners', source: 'NHK World', type: 'documents', rating: 4.8, url: 'https://www.nhk.or.jp/lesson/english/' },
      { id: 5, title: 'LAB211 – OOP Java Practice Projects', source: 'GitHub', type: 'research', citations: 156, url: 'https://github.com/TheAlgorithms/Java' },
    ],
    4: [
      { id: 1, title: 'PRJ301 – Java Web Development (Spring Boot)', source: 'Spring.io', type: 'documents', rating: 4.9, url: 'https://spring.io/guides' },
      { id: 2, title: 'SWE202 – Software Engineering Principles', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/software-engineering/' },
      { id: 3, title: 'IOT102 – IoT Fundamentals & Programming', source: 'YouTube', channel: 'Simplilearn', views: '2.3M', type: 'videos', url: 'https://www.youtube.com/watch?v=LlhmzVL5bm8' },
      { id: 4, title: 'JPD123 – Japanese A1.2 Prep', source: 'JapanesePod101', type: 'videos', views: '3.5M', url: 'https://www.youtube.com/watch?v=csE3sBNIb7E' },
      { id: 5, title: 'SSG104 – Teamwork & Communication', source: 'TED', type: 'videos', views: '6.5M', url: 'https://www.youtube.com/watch?v=eIho2S0ZahI' },
    ],
    5: [
      { id: 1, title: 'FER201 – Front-End with React.js', source: 'React.dev', type: 'documents', rating: 4.9, url: 'https://react.dev/learn' },
      { id: 2, title: 'SWR302 – Software Requirements Engineering', source: 'YouTube', views: '450K', type: 'videos', url: 'https://www.youtube.com/watch?v=VqEyB9sFbIQ' },
      { id: 3, title: 'SWT301 – Software Testing & QA', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/software-testing-tutorial/' },
      { id: 4, title: 'SWP391 – Software Development Project', source: 'Atlassian', type: 'documents', rating: 4.8, url: 'https://www.atlassian.com/agile' },
    ],
    7: [
      { id: 1, title: 'SWD392 – Software Architecture & Design', source: 'Refactoring Guru', type: 'documents', rating: 4.9, url: 'https://refactoring.guru/design-patterns' },
      { id: 2, title: 'PMG201 – Project Management (PMP)', source: 'Simplilearn', views: '2.9M', type: 'videos', url: 'https://www.youtube.com/watch?v=uWPIsaYpY7U' },
      { id: 3, title: 'EXE101 – Experiential Entrepreneurship', source: 'YouTube', channel: 'Y Combinator', views: '3.8M', type: 'videos', url: 'https://www.youtube.com/watch?v=CBYhVcO4WgI' },
      { id: 4, title: 'Cloud Computing (AWS/Azure)', source: 'AWS Tech', type: 'documents', rating: 4.8, url: 'https://aws.amazon.com/getting-started/' },
    ],
    8: [
      { id: 1, title: 'PRM391 – Mobile App Development', source: 'Android Developers', type: 'documents', rating: 4.8, url: 'https://developer.android.com/guide' },
      { id: 2, title: 'EXE201 – Startup Strategy', source: 'Strategyzer', type: 'documents', rating: 4.8, url: 'https://www.strategyzer.com/library/the-business-model-canvas' },
      { id: 3, title: 'MLN111 – Philosophy of ML', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/course/dai-hoc-fpt/triet-hoc-mac-lenin/4637340' },
      { id: 4, title: 'MLN122 – Political Economics', source: 'YouTube', channel: 'Ôn thi đại học', views: '890K', type: 'videos', url: 'https://www.youtube.com/watch?v=cN8sJkYyFYQ' },
    ],
    9: [
      { id: 1, title: 'SEP490 – SE Graduation Thesis', source: 'GitHub', type: 'research', citations: 289, url: 'https://github.com/jwasham/coding-interview-university' },
      { id: 2, title: 'VNR202 – History of Party', source: 'Studocu', type: 'documents', rating: 4.6, url: 'https://www.studocu.com/vn/course/dai-hoc-fpt/lich-su-dang-cong-san-viet-nam/4637348' },
      { id: 3, title: 'HCM202 – HCM Ideology', source: 'YouTube', views: '1.3M', type: 'videos', url: 'https://www.youtube.com/watch?v=XQaS3P6Tj3A' },
      { id: 4, title: 'MLN131 – Scientific Socialism', source: 'Wikipedia', type: 'documents', rating: 4.5, url: 'https://vi.wikipedia.org/wiki/Ch%E1%BB%A7_ngh%C4%A9a_x%C3%A3_h%E1%BB%99i_khoa_h%E1%BB%8Dc' },
    ],
  },
  mm: {
    1: [
      { id: 1, title: 'PHO101 – Photography Fundamentals', source: 'Adobe', type: 'documents', rating: 4.7, url: 'https://www.adobe.com/creativecloud/photography/hub/discover/photography-basics' },
      { id: 2, title: 'GRD101 – Graphic Design Introduction', source: 'YouTube', channel: 'Envato Tuts+', views: '6.2M', type: 'videos', url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs' },
      { id: 3, title: 'Color Theory & Visual Design', source: 'Canva', type: 'documents', rating: 4.8, url: 'https://www.canva.com/colors/color-wheel/' },
    ],
    2: [
      { id: 1, title: 'VDO101 – Video Editing (Premiere)', source: 'Adobe Premiere', type: 'documents', rating: 4.8, url: 'https://helpx.adobe.com/premiere-pro/tutorials.html' },
      { id: 2, title: '2DA101 – 2D Animation Principles', source: 'YouTube', channel: 'Bloop Animation', views: '2.3M', type: 'videos', url: 'https://www.youtube.com/watch?v=uDqjIdI4bF4' },
      { id: 3, title: 'Illustrator Graphics Guide', source: 'Adobe', type: 'documents', rating: 4.7, url: 'https://helpx.adobe.com/illustrator/tutorials.html' },
    ],
    3: [
      { id: 1, title: '3DS101 – 3D Modeling (Blender)', source: 'Blender Manual', type: 'documents', rating: 4.9, url: 'https://docs.blender.org/manual/en/latest/' },
      { id: 2, title: 'WEB101 – Web Content Layout', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/html/' },
      { id: 3, title: 'Maya for 3D Assets', source: 'Autodesk', type: 'documents', rating: 4.6, url: 'https://help.autodesk.com/view/MAYAUL/2024/ENU/' },
    ],
    4: [
      { id: 1, title: 'VFX101 – Visual Effects (After Effects)', source: 'YouTube', channel: 'School of Motion', views: '4.8M', type: 'videos', url: 'https://www.youtube.com/watch?v=hIjDKqYTvqk' },
      { id: 2, title: 'SND101 – Sound Design & Audio Edit', source: 'Audacity', type: 'documents', rating: 4.7, url: 'https://manual.audacityteam.org/' },
      { id: 3, title: 'Cinematography Mastery', source: 'StudioBinder', type: 'documents', rating: 4.8, url: 'https://www.studiobinder.com/blog/what-is-cinematography/' },
    ],
    5: [
      { id: 1, title: 'UX/UI for Multimedia Apps', source: 'Google Design', type: 'documents', rating: 4.8, url: 'https://design.google/' },
      { id: 2, title: 'GMA101 – Game Art & Asset Design', source: 'Unity Learn', type: 'documents', rating: 4.9, url: 'https://learn.unity.com/' },
      { id: 3, title: 'Interaction Design Research', source: 'YouTube', channel: 'AJ&Smart', views: '2.1M', type: 'videos', url: 'https://www.youtube.com/watch?v=Ovj4hFxko7c' },
    ],
    7: [
      { id: 1, title: 'Portfolio Development', source: 'Behance', type: 'documents', rating: 4.9, url: 'https://www.behance.net/galleries/graphic-design' },
      { id: 2, title: 'Advanced 3D Sculpting', source: 'Grant Abbitt', type: 'videos', views: '3.2M', url: 'https://www.youtube.com/watch?v=PTWV67qoX3M' },
      { id: 3, title: 'Creative Business Management', source: 'Dribbble', type: 'documents', rating: 4.6, url: 'https://dribbble.com/stories' },
    ],
    8: [
      { id: 1, title: 'MMC490 – Capstone Project 1', source: 'Adobe Creative Cloud', type: 'documents', rating: 4.8, url: 'https://www.adobe.com/creativecloud.html' },
      { id: 2, title: 'Creative Career Prep', source: 'Indeed', type: 'documents', rating: 4.6, url: 'https://www.indeed.com/career-advice/finding-a-job/graphic-design-careers' },
    ],
    9: [
      { id: 1, title: 'Final Graduation Project', source: 'YouTube', channel: 'The Futur', views: '2.4M', type: 'videos', url: 'https://www.youtube.com/watch?v=dGM1Fk_TwQE' },
      { id: 2, title: 'Design Thinking Final', source: 'IDEO', type: 'documents', rating: 4.9, url: 'https://designthinking.ideo.com/' },
    ],
  },
  cn: {
    1: [
      { id: 1, title: 'CHN111 – Elementary Chinese (HSK 1)', source: 'HSK Academy', type: 'documents', rating: 4.9, url: 'https://www.hsk.academy/en/hsk-1' },
      { id: 2, title: 'Intro to Chinese Culture', source: 'China Highlights', type: 'documents', rating: 4.7, url: 'https://www.chinahighlights.com/travelguide/culture/' },
      { id: 3, title: 'Pinyin & Pronunciation Guide', source: 'YouTube', channel: 'ChineseClass101', views: '4.2M', type: 'videos', url: 'https://www.youtube.com/watch?v=p9Qn5Vc0F7U' },
    ],
    2: [
      { id: 1, title: 'CHN122 – Higher Elementary (HSK 2)', source: 'Chinese Zero to Hero', type: 'documents', rating: 4.8, url: 'https://www.chinesezerotohero.com/learn-chinese/' },
      { id: 2, title: 'Chinese Calligraphy Art', source: 'China Online Museum', type: 'documents', rating: 4.8, url: 'http://www.chinaonlinemuseum.com/' },
      { id: 3, title: 'HSK 2 Grammar Complete', source: 'AllSet Learning', type: 'documents', rating: 4.9, url: 'https://resources.allsetlearning.com/chinese/grammar/' },
    ],
    3: [
      { id: 1, title: 'CHN211 – Intermediate Chinese (HSK 3)', source: 'YouTube', views: '1.2M', type: 'videos', url: 'https://www.youtube.com/watch?v=QwR4x4m0EQc' },
      { id: 2, title: 'Ancient Chinese History', source: 'Khan Academy', type: 'documents', rating: 4.8, url: 'https://www.khanacademy.org/humanities/world-history/ancient-medieval/early-china' },
      { id: 3, title: 'Intermediate Grammar Practice', source: 'Du Chinese', type: 'documents', rating: 4.8, url: 'https://www.duchinese.net/' },
    ],
    4: [
      { id: 1, title: 'CHN222 – Pre-Advanced (HSK 4)', source: 'HSK Academy', type: 'documents', rating: 4.8, url: 'https://www.hsk.academy/en/hsk-4' },
      { id: 2, title: 'Business Chinese Basics', source: 'FluentU', type: 'documents', rating: 4.7, url: 'https://www.fluentu.com/blog/chinese/business-chinese-vocabulary/' },
      { id: 3, title: 'HSK 4 Listening Training', source: 'YouTube', views: '1.5M', type: 'videos', url: 'https://www.youtube.com/watch?v=7rO7g0j3ROs' },
    ],
    5: [
      { id: 1, title: 'CHN311 – Advanced Chinese (HSK 5)', source: 'HSK Academy', type: 'documents', rating: 4.9, url: 'https://www.hsk.academy/en/hsk-5' },
      { id: 2, title: 'Intro to Chinese Translation', source: 'TranslationDirectory', type: 'documents', rating: 4.7, url: 'https://www.translationdirectory.com/articles.php' },
      { id: 3, title: 'Chinese Literature Overview', source: 'Wikipedia', type: 'documents', rating: 4.6, url: 'https://en.wikipedia.org/wiki/Chinese_literature' },
    ],
    7: [
      { id: 1, title: 'Advanced Translation Skills', source: 'YouTube', views: '650K', type: 'videos', url: 'https://www.youtube.com/watch?v=QDi_nC9pzdo' },
      { id: 2, title: 'Interpretation Techniques', source: 'ORCIT', type: 'documents', rating: 4.7, url: 'https://www.orcit.eu/' },
      { id: 3, title: 'CAT Tools for Translators', source: 'SD Trados', type: 'documents', rating: 4.6, url: 'https://www.trados.com/learning/' },
    ],
    8: [
      { id: 1, title: 'HSK 6 Complete Guide', source: 'HSK Academy', type: 'documents', rating: 4.9, url: 'https://www.hsk.academy/en/hsk-6' },
      { id: 2, title: 'Modern Chinese Literature', source: 'ChinaFile', type: 'videos', views: '890K', url: 'https://www.youtube.com/watch?v=ylWORyToTo4' },
      { id: 3, title: 'Career Path in Linguistics', source: 'Indeed', type: 'documents', rating: 4.6, url: 'https://www.indeed.com/career-advice/finding-a-job/language-teaching' },
    ],
    9: [
      { id: 1, title: 'Chinese Language Graduation Thesis', source: 'ResearchGate', type: 'research', citations: 312, url: 'https://www.researchgate.net/topic/Chinese-Language' },
      { id: 2, title: 'Academic Presentation in Chinese', source: 'YouTube', views: '1.2M', type: 'videos', url: 'https://www.youtube.com/watch?v=Unzc731iCUY' },
    ],
  },
  mk: {
    1: [
      { id: 1, title: 'MAR101 – Principles of Marketing', source: 'HubSpot Academy', type: 'documents', rating: 4.8, url: 'https://academy.hubspot.com/courses/inbound-marketing' },
      { id: 2, title: 'Introduction to Management', source: 'Coursera', type: 'documents', rating: 4.9, url: 'https://www.coursera.org/learn/wharton-marketing' },
      { id: 3, title: 'Marketing Basics Explained', source: 'YouTube', channel: 'HubSpot Marketing', views: '3.1M', type: 'videos', url: 'https://www.youtube.com/watch?v=O_7Fpq6lq0E' },
    ],
    2: [
      { id: 1, title: 'Consumer Behavior & Psychology', source: 'Investopedia', type: 'documents', rating: 4.7, url: 'https://www.investopedia.com/terms/c/consumer-theory.asp' },
      { id: 2, title: 'Market Research Fundamentals', source: 'Qualtrics', type: 'documents', rating: 4.8, url: 'https://www.qualtrics.com/experience-management/research/market-research/' },
      { id: 3, title: 'Psychology in Marketing', source: 'The Futur', type: 'videos', views: '1.8M', url: 'https://www.youtube.com/watch?v=9X4R3_DQekg' },
    ],
    3: [
      { id: 1, title: 'Digital Marketing Excellence', source: 'Google Garage', type: 'documents', rating: 4.9, url: 'https://learndigital.withgoogle.com/digitalgarage' },
      { id: 2, title: 'SEO Strategy Starter Guide', source: 'Google', type: 'documents', rating: 4.9, url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
      { id: 3, title: 'Content Strategy Guide', source: 'YouTube', channel: 'Neil Patel', views: '4.4M', type: 'videos', url: 'https://www.youtube.com/watch?v=Rx_dLfxjkA0' },
    ],
    4: [
      { id: 1, title: 'Social Media Management', source: 'Hootsuite', type: 'documents', rating: 4.7, url: 'https://www.hootsuite.com/resources/social-media-marketing-strategy' },
      { id: 2, title: 'Meta Blueprint Training', source: 'Meta', type: 'documents', rating: 4.8, url: 'https://www.facebookblueprint.com/' },
      { id: 3, title: 'Building a Personal Brand', source: 'YouTube', views: '3.8M', type: 'videos', url: 'https://www.youtube.com/watch?v=nqMpqk4wSCg' },
    ],
    5: [
      { id: 1, title: 'Integrated Marketing Comms', source: 'HubSpot', type: 'documents', rating: 4.7, url: 'https://blog.hubspot.com/marketing/integrated-marketing-communications' },
      { id: 2, title: 'Brand Management Mastery', source: 'Coursera', type: 'documents', rating: 4.8, url: 'https://www.coursera.org/learn/brand-management' },
      { id: 3, title: 'IMC Case Studies', source: 'YouTube', views: '560K', type: 'videos', url: 'https://www.youtube.com/watch?v=yZ3Fd3S9VHs' },
    ],
    7: [
      { id: 1, title: 'Marketing Analytics & Data', source: 'Google Analytics Academy', type: 'documents', rating: 4.9, url: 'https://analytics.google.com/analytics/academy/' },
      { id: 2, title: 'Advanced Strategic Marketing', source: 'McKinsey', type: 'documents', rating: 4.8, url: 'https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights' },
      { id: 3, title: 'Marketing Strategy Course', source: 'YouTube', views: '1.5M', type: 'videos', url: 'https://www.youtube.com/watch?v=vYC3B3HZ7xE' },
    ],
    8: [
      { id: 1, title: 'International Marketing Strategy', source: 'HBR', type: 'documents', rating: 4.9, url: 'https://hbr.org/topic/subject/marketing' },
      { id: 2, title: 'Digital Marketing Capstone 1', source: 'HubSpot', type: 'documents', rating: 4.7, url: 'https://blog.hubspot.com/marketing/marketing-strategy' },
      { id: 3, title: 'Industry Case Analysis', source: 'YouTube', views: '890K', type: 'videos', url: 'https://www.youtube.com/watch?v=kiRCASEvo0g' },
    ],
    9: [
      { id: 1, title: 'Graduation Marketing Project', source: 'LinkedIn', type: 'documents', rating: 4.7, url: 'https://www.linkedin.com/business/marketing/blog/trends-tips/marketing-portfolio' },
      { id: 2, title: 'Marketing Career Roadmap', source: 'Indeed', type: 'documents', rating: 4.8, url: 'https://www.indeed.com/career-advice/finding-a-job/marketing-career' },
    ],
  },
};

export const internshipResources: CourseResource[] = [
  { id: 1, title: 'Hướng dẫn Thực tập FPT 2024', source: 'FPT University', type: 'internship', url: 'https://daihoc.fpt.edu.vn/thuc-tap-doanh-nghiep/' },
  { id: 2, title: 'Mẫu Báo cáo Thực tập', source: 'FPT Template', type: 'internship', url: 'https://daihoc.fpt.edu.vn/bieu-mau-sinh-vien/' },
  { id: 3, title: 'Resume Writing Complete Guide', source: 'Indeed', type: 'documents', rating: 4.9, url: 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-write-a-resume' },
  { id: 4, title: 'Interview Preparation Guide', source: 'Glassdoor', type: 'documents', rating: 4.8, url: 'https://www.glassdoor.com/blog/guide/how-to-prepare-for-an-interview/' },
  { id: 5, title: 'LinkedIn Profile Optimization', source: 'LinkedIn', type: 'documents', rating: 4.7, url: 'https://www.linkedin.com/business/talent/blog/product-tips/linkedin-profile-tips' },
];

export const majorNames: Record<string, string> = {
  se: 'Kỹ thuật Phần mềm',
  mm: 'Truyền thông Đa phương tiện',
  cn: 'Ngôn ngữ Trung Quốc',
  mk: 'Marketing',
};

export const semesterData = [
  { id: 1, name: 'Học kỳ 1', type: 'regular', description: 'Nền tảng cơ bản' },
  { id: 2, name: 'Học kỳ 2', type: 'regular', description: 'Kiến thức nền tảng' },
  { id: 3, name: 'Học kỳ 3', type: 'regular', description: 'Chuyên môn cơ sở' },
  { id: 4, name: 'Học kỳ 4', type: 'regular', description: 'Chuyên ngành nâng cao' },
  { id: 5, name: 'Học kỳ 5', type: 'regular', description: 'Kỹ năng chuyên sâu' },
  { id: 6, name: 'Học kỳ 6', type: 'internship', description: 'Thực tập doanh nghiệp (OJT)' },
  { id: 7, name: 'Học kỳ 7', type: 'regular', description: 'Chuyên môn nâng cao' },
  { id: 8, name: 'Học kỳ 8', type: 'regular', description: 'Dự án Capstone' },
  { id: 9, name: 'Học kỳ 9', type: 'regular', description: 'Tốt nghiệp' },
];
