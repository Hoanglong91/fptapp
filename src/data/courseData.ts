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
      // CSI106 – Introduction to Computer Science
      { id: 1, title: 'CSI106 – Intro to Computer Science (CS50)', source: 'Harvard CS50', type: 'documents', rating: 4.9, url: 'https://cs50.harvard.edu/x/' },
      { id: 2, title: 'CSI106 – Computer Science Basics', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/introduction-to-computer-science/' },
      { id: 3, title: 'CSI106 – CS50 Full Course 2024', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '20M', url: 'https://www.youtube.com/watch?v=8mAITcNt710' },
      // MAE101 – Mathematics for Engineering
      { id: 4, title: 'MAE101 – Calculus 1', source: 'Khan Academy', type: 'documents', rating: 4.9, url: 'https://www.khanacademy.org/math/calculus-1' },
      { id: 5, title: 'MAE101 – Linear Algebra', source: 'Khan Academy', type: 'documents', rating: 4.8, url: 'https://www.khanacademy.org/math/linear-algebra' },
      { id: 6, title: 'MAE101 – Engineering Math Full Course', source: 'YouTube', type: 'videos', channel: 'Professor Leonard', views: '8M', url: 'https://www.youtube.com/watch?v=fYyARMqiaag' },
      { id: 7, title: 'MAE101 – Mathematics for CS', source: 'MIT OCW', type: 'research', citations: 89, url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/' },
      // PRF192 – Programming Fundamentals
      { id: 8, title: 'PRF192 – C Programming Tutorial', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/c/' },
      { id: 9, title: 'PRF192 – Learn C Programming', source: 'Programiz', type: 'documents', rating: 4.6, url: 'https://www.programiz.com/c-programming' },
      { id: 10, title: 'PRF192 – C Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '15M', url: 'https://www.youtube.com/watch?v=KJgsSFOSQv0' },
      { id: 11, title: 'PRF192 – C Programming Tutorial', source: 'YouTube', type: 'videos', channel: 'Bro Code', views: '5.2M', url: 'https://www.youtube.com/watch?v=87SH2Cn0s9A' },
      // CEA201 – Computer Organization and Architecture
      { id: 12, title: 'CEA201 – Computer Organization', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/' },
      { id: 13, title: 'CEA201 – Computer Architecture Course', source: 'YouTube', type: 'videos', channel: 'Neso Academy', views: '4.5M', url: 'https://www.youtube.com/watch?v=Ol8D69VKX2k' },
      { id: 14, title: 'CEA201 – Computation Structures', source: 'MIT OCW', type: 'research', citations: 120, url: 'https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/' },
      // SSL101c – Academic Skills for University Success
      { id: 15, title: 'SSL101c – Study Skills Guide', source: 'Coursera', type: 'documents', rating: 4.7, url: 'https://www.coursera.org/learn/learning-how-to-learn' },
      { id: 16, title: 'SSL101c – Academic Writing Basics', source: 'YouTube', type: 'videos', channel: 'Scribbr', views: '2.1M', url: 'https://www.youtube.com/watch?v=ue3mANux-3E' },
    ],
    2: [
      // MAD101 – Discrete Mathematics
      { id: 1, title: 'MAD101 – Discrete Mathematics', source: 'Khan Academy', type: 'documents', rating: 4.8, url: 'https://www.khanacademy.org/computing/computer-science/algorithms' },
      { id: 2, title: 'MAD101 – Discrete Math Tutorial', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/discrete-mathematics-tutorial/' },
      { id: 3, title: 'MAD101 – Discrete Math Full Course', source: 'YouTube', type: 'videos', channel: 'TrevTutor', views: '3.5M', url: 'https://www.youtube.com/watch?v=rdXw7Ps9vxc' },
      // OSG202 – Operating System
      { id: 4, title: 'OSG202 – Operating Systems', source: 'GeeksforGeeks', type: 'documents', rating: 4.6, url: 'https://www.geeksforgeeks.org/operating-systems/' },
      { id: 5, title: 'OSG202 – OS Concepts', source: 'YouTube', type: 'videos', channel: 'Neso Academy', views: '3.1M', url: 'https://www.youtube.com/watch?v=vBURTt97EkA' },
      { id: 6, title: 'OSG202 – Operating Systems Course', source: 'MIT OCW', type: 'research', citations: 145, url: 'https://ocw.mit.edu/courses/6-828-operating-system-engineering-fall-2012/' },
      // PRO192 – Object-Oriented Programming
      { id: 7, title: 'PRO192 – Java OOP Tutorial', source: 'W3Schools', type: 'documents', rating: 4.7, url: 'https://www.w3schools.com/java/java_oop.asp' },
      { id: 8, title: 'PRO192 – Java Programming', source: 'Programiz', type: 'documents', rating: 4.7, url: 'https://www.programiz.com/java-programming' },
      { id: 9, title: 'PRO192 – Java Full Course', source: 'YouTube', type: 'videos', channel: 'Programming with Mosh', views: '8.5M', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
      // WED201c – Web Design
      { id: 10, title: 'WED201c – HTML CSS Guide', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/html/' },
      { id: 11, title: 'WED201c – Responsive Web Design', source: 'freeCodeCamp', type: 'documents', rating: 4.9, url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
      { id: 12, title: 'WED201c – Web Design Full Course', source: 'YouTube', type: 'videos', channel: 'Traversy Media', views: '6.8M', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c' },
      // NWC204 – Computer Networking
      { id: 13, title: 'NWC204 – Computer Networks', source: 'GeeksforGeeks', type: 'documents', rating: 4.6, url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
      { id: 14, title: 'NWC204 – Networking Full Course', source: 'YouTube', type: 'videos', channel: 'NetworkChuck', views: '5.6M', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw' },
      { id: 15, title: 'NWC204 – Computer Networks Course', source: 'Stanford', type: 'research', citations: 178, url: 'https://www.scs.stanford.edu/10au-cs144/' },
    ],
    3: [
      // JPD113 – Elementary Japanese 1-A1.1
      { id: 1, title: 'JPD113 – Japanese for Beginners', source: 'NHK World', type: 'documents', rating: 4.8, url: 'https://www.nhk.or.jp/lesson/english/' },
      { id: 2, title: 'JPD113 – Learn Hiragana & Katakana', source: 'YouTube', type: 'videos', channel: 'JapanesePod101', views: '8.2M', url: 'https://www.youtube.com/watch?v=6p9Il_j0zjc' },
      // MAS291 – Statistics & Probability
      { id: 3, title: 'MAS291 – Statistics & Probability', source: 'Khan Academy', type: 'documents', rating: 4.9, url: 'https://www.khanacademy.org/math/statistics-probability' },
      { id: 4, title: 'MAS291 – Statistics Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '4.2M', url: 'https://www.youtube.com/watch?v=xxpc-HPKN28' },
      // DBI202 – Database Systems
      { id: 5, title: 'DBI202 – SQL Tutorial', source: 'W3Schools', type: 'documents', rating: 4.8, url: 'https://www.w3schools.com/sql/' },
      { id: 6, title: 'DBI202 – Database Systems', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/database-management-system/' },
      { id: 7, title: 'DBI202 – SQL Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '12M', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      // CSD201 – Data Structures and Algorithm
      { id: 8, title: 'CSD201 – Data Structures', source: 'GeeksforGeeks', type: 'documents', rating: 4.9, url: 'https://www.geeksforgeeks.org/data-structures/' },
      { id: 9, title: 'CSD201 – DSA Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '4.2M', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
      { id: 10, title: 'CSD201 – Algorithms Repository', source: 'GitHub', type: 'research', citations: 156, url: 'https://github.com/TheAlgorithms/Java' },
      // LAB211 – OOP with Java Lab
      { id: 11, title: 'LAB211 – Java OOP Practice', source: 'Programiz', type: 'documents', rating: 4.7, url: 'https://www.programiz.com/java-programming/examples' },
      { id: 12, title: 'LAB211 – Java Projects for Beginners', source: 'YouTube', type: 'videos', channel: 'Coding with John', views: '1.8M', url: 'https://www.youtube.com/watch?v=GoXwIVyNvX0' },
    ],
    4: [
      // JPD123 – Japanese Elementary 1-A1.2
      { id: 1, title: 'JPD123 – Japanese A1.2 Lessons', source: 'NHK World', type: 'documents', rating: 4.8, url: 'https://www.nhk.or.jp/lesson/english/' },
      { id: 2, title: 'JPD123 – JLPT N5 Preparation', source: 'YouTube', type: 'videos', channel: 'JapanesePod101', views: '3.5M', url: 'https://www.youtube.com/watch?v=csE3sBNIb7E' },
      // IOT102 – Internet of Things
      { id: 3, title: 'IOT102 – IoT Fundamentals', source: 'GeeksforGeeks', type: 'documents', rating: 4.6, url: 'https://www.geeksforgeeks.org/introduction-to-internet-of-things-iot/' },
      { id: 4, title: 'IOT102 – IoT Full Course', source: 'YouTube', type: 'videos', channel: 'Simplilearn', views: '2.3M', url: 'https://www.youtube.com/watch?v=LlhmzVL5bm8' },
      // PRJ301 – Java Web Application Development
      { id: 5, title: 'PRJ301 – Java Servlets & JSP', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/introduction-java-servlets/' },
      { id: 6, title: 'PRJ301 – Spring Boot Guide', source: 'Spring.io', type: 'documents', rating: 4.9, url: 'https://spring.io/guides' },
      { id: 7, title: 'PRJ301 – Java Web App Full Course', source: 'YouTube', type: 'videos', channel: 'Amigoscode', views: '4.1M', url: 'https://www.youtube.com/watch?v=9SGDpanrc8U' },
      // SSG104 – Communication and In-Group Working Skills
      { id: 8, title: 'SSG104 – Teamwork & Communication', source: 'Coursera', type: 'documents', rating: 4.7, url: 'https://www.coursera.org/learn/teamwork-skills' },
      { id: 9, title: 'SSG104 – Communication Skills', source: 'YouTube', type: 'videos', channel: 'TED', views: '6.5M', url: 'https://www.youtube.com/watch?v=eIho2S0ZahI' },
      // SWE202c – Introduction to Software Engineering
      { id: 10, title: 'SWE202c – Software Engineering', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/software-engineering/' },
      { id: 11, title: 'SWE202c – SE Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '1.9M', url: 'https://www.youtube.com/watch?v=uoMOA5fgTCA' },
      { id: 12, title: 'SWE202c – SE Research', source: 'IEEE', type: 'research', citations: 134, url: 'https://www.computer.org/csdl/magazine/so' },
    ],
    5: [
      // FER202 – Front-End Web Development with React
      { id: 1, title: 'FER202 – React Documentation', source: 'React.dev', type: 'documents', rating: 4.9, url: 'https://react.dev/learn' },
      { id: 2, title: 'FER202 – React Tutorial', source: 'W3Schools', type: 'documents', rating: 4.7, url: 'https://www.w3schools.com/react/' },
      { id: 3, title: 'FER202 – React Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '7.5M', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
      // WDU203c – UI/UX Design
      { id: 4, title: 'WDU203c – UI/UX Design Guide', source: 'Google Design', type: 'documents', rating: 4.8, url: 'https://design.google/' },
      { id: 5, title: 'WDU203c – Figma Tutorial', source: 'Figma', type: 'documents', rating: 4.9, url: 'https://help.figma.com/hc/en-us' },
      { id: 6, title: 'WDU203c – UI/UX Full Course', source: 'YouTube', type: 'videos', channel: 'DesignCourse', views: '3.3M', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8' },
      // SWP391 – Software Development Project
      { id: 7, title: 'SWP391 – Agile Project Guide', source: 'Atlassian', type: 'documents', rating: 4.8, url: 'https://www.atlassian.com/agile' },
      { id: 8, title: 'SWP391 – Full Stack Project Course', source: 'YouTube', type: 'videos', channel: 'Traversy Media', views: '2.1M', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
      // SWR302 – Software Requirement
      { id: 9, title: 'SWR302 – Software Requirements', source: 'GeeksforGeeks', type: 'documents', rating: 4.6, url: 'https://www.geeksforgeeks.org/software-engineering-requirements-engineering-process/' },
      { id: 10, title: 'SWR302 – Requirements Engineering', source: 'YouTube', type: 'videos', channel: 'Arden University', views: '450K', url: 'https://www.youtube.com/watch?v=VqEyB9sFbIQ' },
      // SWT301 – Software Testing
      { id: 11, title: 'SWT301 – Software Testing Guide', source: 'GeeksforGeeks', type: 'documents', rating: 4.7, url: 'https://www.geeksforgeeks.org/software-testing-tutorial/' },
      { id: 12, title: 'SWT301 – Software Testing Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '1.6M', url: 'https://www.youtube.com/watch?v=u6QfIXgjwGQ' },
      { id: 13, title: 'SWT301 – Testing Best Practices', source: 'Martin Fowler', type: 'research', citations: 210, url: 'https://martinfowler.com/testing/' },
    ],
    7: [
      // SWD392 – Software Architecture and Design
      { id: 1, title: 'SWD392 – Software Architecture', source: 'Microsoft Docs', type: 'documents', rating: 4.8, url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/' },
      { id: 2, title: 'SWD392 – Design Patterns', source: 'Refactoring Guru', type: 'documents', rating: 4.9, url: 'https://refactoring.guru/design-patterns' },
      { id: 3, title: 'SWD392 – System Design Primer', source: 'GitHub', type: 'research', citations: 456, url: 'https://github.com/donnemartin/system-design-primer' },
      { id: 4, title: 'SWD392 – System Design Course', source: 'YouTube', type: 'videos', channel: 'Gaurav Sen', views: '2.5M', url: 'https://www.youtube.com/watch?v=xpDnVSmNFX0' },
      // EXE101 – Experiential Entrepreneurship 1
      { id: 5, title: 'EXE101 – Startup & Entrepreneurship', source: 'Coursera', type: 'documents', rating: 4.7, url: 'https://www.coursera.org/learn/wharton-entrepreneurship' },
      { id: 6, title: 'EXE101 – How to Start a Startup', source: 'YouTube', type: 'videos', channel: 'Y Combinator', views: '3.8M', url: 'https://www.youtube.com/watch?v=CBYhVcO4WgI' },
      // PMG201c – Project Management
      { id: 7, title: 'PMG201c – Project Management Guide', source: 'Atlassian', type: 'documents', rating: 4.8, url: 'https://www.atlassian.com/work-management/project-management' },
      { id: 8, title: 'PMG201c – PMP Certification Course', source: 'YouTube', type: 'videos', channel: 'Simplilearn', views: '2.9M', url: 'https://www.youtube.com/watch?v=uWPIsaYpY7U' },
      // SE_COM – Combo Subjects
      { id: 9, title: 'SE Combo – Cloud Computing (AWS)', source: 'AWS Docs', type: 'documents', rating: 4.8, url: 'https://aws.amazon.com/getting-started/' },
      { id: 10, title: 'SE Combo – Docker & Kubernetes', source: 'Docker Docs', type: 'documents', rating: 4.7, url: 'https://docs.docker.com/' },
      { id: 11, title: 'SE Combo – DevOps Full Course', source: 'YouTube', type: 'videos', channel: 'TechWorld with Nana', views: '3.1M', url: 'https://www.youtube.com/watch?v=j5Zsa_eOXeY' },
      { id: 12, title: 'SE Combo – Microservices', source: 'Microsoft Docs', type: 'research', citations: 189, url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices' },
    ],
    8: [
      // ITE302c – Ethics in IT
      { id: 1, title: 'ITE302c – IT Ethics Guide', source: 'ACM', type: 'documents', rating: 4.6, url: 'https://www.acm.org/code-of-ethics' },
      { id: 2, title: 'ITE302c – Ethics in Technology', source: 'YouTube', type: 'videos', channel: 'CrashCourse', views: '1.8M', url: 'https://www.youtube.com/watch?v=AUhLPCh0JuI' },
      // EXE201 – Experiential Entrepreneurship 2
      { id: 3, title: 'EXE201 – Business Model Canvas', source: 'Strategyzer', type: 'documents', rating: 4.8, url: 'https://www.strategyzer.com/library/the-business-model-canvas' },
      { id: 4, title: 'EXE201 – Startup Pitching', source: 'YouTube', type: 'videos', channel: 'Y Combinator', views: '2.4M', url: 'https://www.youtube.com/watch?v=17XZGUX_9iM' },
      // MLN111 – Philosophy of Marxism–Leninism
      { id: 5, title: 'MLN111 – Triết học Mác-Lênin', source: 'Tài liệu FPT', type: 'documents', rating: 4.5, url: 'https://daihoc.fpt.edu.vn/' },
      // MLN122 – Political Economics of Marxism–Leninism
      { id: 6, title: 'MLN122 – Kinh tế Chính trị Mác-Lênin', source: 'Tài liệu FPT', type: 'documents', rating: 4.5, url: 'https://daihoc.fpt.edu.vn/' },
      // PRM393 – Mobile Programming
      { id: 7, title: 'PRM393 – Android Development', source: 'Android Docs', type: 'documents', rating: 4.8, url: 'https://developer.android.com/guide' },
      { id: 8, title: 'PRM393 – React Native Guide', source: 'React Native', type: 'documents', rating: 4.7, url: 'https://reactnative.dev/docs/getting-started' },
      { id: 9, title: 'PRM393 – Android Full Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '3.8M', url: 'https://www.youtube.com/watch?v=fis26HvvDII' },
      { id: 10, title: 'PRM393 – Flutter Full Course', source: 'YouTube', type: 'videos', channel: 'The Net Ninja', views: '2.8M', url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU' },
      // SE_COM*4
      { id: 11, title: 'SE Combo – Machine Learning', source: 'GeeksforGeeks', type: 'documents', rating: 4.9, url: 'https://www.geeksforgeeks.org/machine-learning/' },
      { id: 12, title: 'SE Combo – ML Course', source: 'YouTube', type: 'videos', channel: 'freeCodeCamp', views: '7.5M', url: 'https://www.youtube.com/watch?v=NWONeJKn6kc' },
    ],
    9: [
      // VNR202 – History of Vietnam Communist Party
      { id: 1, title: 'VNR202 – Lịch sử Đảng CSVN', source: 'Tài liệu FPT', type: 'documents', rating: 4.5, url: 'https://daihoc.fpt.edu.vn/' },
      // SEP490 – SE Capstone Project
      { id: 2, title: 'SEP490 – Capstone Project Ideas', source: 'GitHub', type: 'documents', rating: 4.9, url: 'https://github.com/florinpop17/app-ideas' },
      { id: 3, title: 'SEP490 – Clean Code Guide', source: 'GitHub', type: 'documents', rating: 4.8, url: 'https://github.com/ryanmcdermott/clean-code-javascript' },
      { id: 4, title: 'SEP490 – Full Stack Project', source: 'YouTube', type: 'videos', channel: 'Tech With Tim', views: '890K', url: 'https://www.youtube.com/watch?v=erEgovG9WBs' },
      { id: 5, title: 'SEP490 – Coding Interview University', source: 'GitHub', type: 'research', citations: 289, url: 'https://github.com/jwasham/coding-interview-university' },
      // MLN131 – Scientific Socialism
      { id: 6, title: 'MLN131 – CNXH Khoa học', source: 'Tài liệu FPT', type: 'documents', rating: 4.5, url: 'https://daihoc.fpt.edu.vn/' },
      // HCM202 – Ho Chi Minh Ideology
      { id: 7, title: 'HCM202 – Tư tưởng Hồ Chí Minh', source: 'Tài liệu FPT', type: 'documents', rating: 4.5, url: 'https://daihoc.fpt.edu.vn/' },
      // Technical Writing & Career
      { id: 8, title: 'Technical Writing Guide', source: 'Google Developers', type: 'documents', rating: 4.8, url: 'https://developers.google.com/tech-writing' },
      { id: 9, title: 'Resume & Portfolio Tips', source: 'Indeed', type: 'documents', rating: 4.7, url: 'https://www.indeed.com/career-advice/resumes-cover-letters' },
      { id: 10, title: 'Technical Interview Prep', source: 'YouTube', type: 'videos', channel: 'NeetCode', views: '1.8M', url: 'https://www.youtube.com/watch?v=aa2nLrBpFxE' },
    ],
  },
  mm: {
    1: [
      { id: 1, title: 'Digital Art Fundamentals', source: 'Adobe', type: 'documents', rating: 4.7, url: 'https://www.adobe.com/creativecloud/illustration/discover/digital-art.html' },
      { id: 2, title: 'Color Theory Complete Guide', source: 'Canva', type: 'documents', rating: 4.8, url: 'https://www.canva.com/colors/color-wheel/' },
      { id: 3, title: 'Design Principles', source: 'Interaction Design', type: 'documents', rating: 4.6, url: 'https://www.interaction-design.org/literature/topics/design-principles' },
      { id: 4, title: 'Photoshop for Beginners', source: 'YouTube', type: 'videos', channel: 'Envato Tuts+', views: '6.2M', url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs' },
      { id: 5, title: 'Digital Art Tutorial', source: 'YouTube', type: 'videos', channel: 'Proko', views: '4.1M', url: 'https://www.youtube.com/watch?v=6MBSFY-02bk' },
      { id: 6, title: 'Visual Design Fundamentals', source: 'Google', type: 'research', citations: 78, url: 'https://material.io/design/introduction' },
    ],
    2: [
      { id: 1, title: '2D Animation Guide', source: 'Adobe', type: 'documents', rating: 4.8, url: 'https://helpx.adobe.com/animate/tutorials.html' },
      { id: 2, title: 'Illustrator Complete Guide', source: 'Adobe', type: 'documents', rating: 4.7, url: 'https://helpx.adobe.com/illustrator/tutorials.html' },
      { id: 3, title: 'Animation Principles', source: 'Disney', type: 'documents', rating: 4.9, url: 'https://www.creativebloq.com/advice/understand-the-12-principles-of-animation' },
      { id: 4, title: 'After Effects Tutorial', source: 'YouTube', type: 'videos', channel: 'School of Motion', views: '4.8M', url: 'https://www.youtube.com/watch?v=hIjDKqYTvqk' },
      { id: 5, title: '2D Animation Course', source: 'YouTube', type: 'videos', channel: 'Bloop Animation', views: '2.3M', url: 'https://www.youtube.com/watch?v=uDqjIdI4bF4' },
      { id: 6, title: 'Animation Research Papers', source: 'ACM SIGGRAPH', type: 'research', citations: 156, url: 'https://dl.acm.org/conference/siggraph' },
    ],
    3: [
      { id: 1, title: 'Blender Complete Manual', source: 'Blender', type: 'documents', rating: 4.9, url: 'https://docs.blender.org/manual/en/latest/' },
      { id: 2, title: '3D Modeling Basics', source: 'CG Cookie', type: 'documents', rating: 4.7, url: 'https://cgcookie.com/courses' },
      { id: 3, title: 'Maya Documentation', source: 'Autodesk', type: 'documents', rating: 4.6, url: 'https://help.autodesk.com/view/MAYAUL/2024/ENU/' },
      { id: 4, title: 'Blender Beginner Tutorial', source: 'YouTube', type: 'videos', channel: 'Blender Guru', views: '15M', url: 'https://www.youtube.com/watch?v=nIoXOplUvAw' },
      { id: 5, title: '3D Character Modeling', source: 'YouTube', type: 'videos', channel: 'Grant Abbitt', views: '3.2M', url: 'https://www.youtube.com/watch?v=PTWV67qoX3M' },
      { id: 6, title: '3D Graphics Research', source: 'ACM TOG', type: 'research', citations: 234, url: 'https://dl.acm.org/journal/tog' },
    ],
    4: [
      { id: 1, title: 'Video Production Guide', source: 'Adobe', type: 'documents', rating: 4.7, url: 'https://helpx.adobe.com/premiere-pro/tutorials.html' },
      { id: 2, title: 'Cinematography Basics', source: 'StudioBinder', type: 'documents', rating: 4.8, url: 'https://www.studiobinder.com/blog/what-is-cinematography/' },
      { id: 3, title: 'DaVinci Resolve Guide', source: 'Blackmagic', type: 'documents', rating: 4.8, url: 'https://www.blackmagicdesign.com/products/davinciresolve/training' },
      { id: 4, title: 'Premiere Pro Full Course', source: 'YouTube', type: 'videos', channel: 'Justin Odisho', views: '5.5M', url: 'https://www.youtube.com/watch?v=Hls3Tp7JS8E' },
      { id: 5, title: 'Film Making Masterclass', source: 'YouTube', type: 'videos', channel: 'Peter McKinnon', views: '8.9M', url: 'https://www.youtube.com/watch?v=5qXDAMNc2nM' },
      { id: 6, title: 'Video Production Standards', source: 'SMPTE', type: 'research', citations: 89, url: 'https://www.smpte.org/standards' },
    ],
    5: [
      { id: 1, title: 'Unity Learn Platform', source: 'Unity', type: 'documents', rating: 4.9, url: 'https://learn.unity.com/' },
      { id: 2, title: 'Game Design Document Template', source: 'GitHub', type: 'documents', rating: 4.8, url: 'https://github.com/game-development/game-design-document' },
      { id: 3, title: 'Unreal Engine Docs', source: 'Epic Games', type: 'documents', rating: 4.8, url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/' },
      { id: 4, title: 'Unity Game Development', source: 'YouTube', type: 'videos', channel: 'Brackeys', views: '12M', url: 'https://www.youtube.com/watch?v=IlKaB1etrik' },
      { id: 5, title: 'Game Design Fundamentals', source: 'YouTube', type: 'videos', channel: 'Game Maker\'s Toolkit', views: '5.6M', url: 'https://www.youtube.com/watch?v=iNEe3KhMvXM' },
      { id: 6, title: 'Game Development Research', source: 'IEEE', type: 'research', citations: 167, url: 'https://www.ieee.org/publications/proceedings/index.html' },
    ],
    7: [
      { id: 1, title: 'UI/UX Design Guide', source: 'Google Design', type: 'documents', rating: 4.8, url: 'https://design.google/' },
      { id: 2, title: 'Figma Learn', source: 'Figma', type: 'documents', rating: 4.9, url: 'https://help.figma.com/hc/en-us' },
      { id: 3, title: 'Web Design Principles', source: 'Nielsen Norman', type: 'documents', rating: 4.8, url: 'https://www.nngroup.com/articles/' },
      { id: 4, title: 'Figma UI Design Course', source: 'YouTube', type: 'videos', channel: 'DesignCourse', views: '3.3M', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8' },
      { id: 5, title: 'UX Design Process', source: 'YouTube', type: 'videos', channel: 'AJ&Smart', views: '2.1M', url: 'https://www.youtube.com/watch?v=Ovj4hFxko7c' },
      { id: 6, title: 'UX Research Methods', source: 'Nielsen Norman', type: 'research', citations: 245, url: 'https://www.nngroup.com/articles/which-ux-research-methods/' },
    ],
    8: [
      { id: 1, title: 'Portfolio Best Practices', source: 'Behance', type: 'documents', rating: 4.9, url: 'https://www.behance.net/galleries/graphic-design' },
      { id: 2, title: 'Portfolio Website Templates', source: 'GitHub', type: 'documents', rating: 4.7, url: 'https://github.com/topics/portfolio-template' },
      { id: 3, title: 'Creative Industry Insights', source: 'Dribbble', type: 'documents', rating: 4.6, url: 'https://dribbble.com/stories' },
      { id: 4, title: 'Building Design Portfolio', source: 'YouTube', type: 'videos', channel: 'The Futur', views: '1.8M', url: 'https://www.youtube.com/watch?v=_8gG7GXqSdY' },
      { id: 5, title: 'Showreel Creation', source: 'YouTube', type: 'videos', channel: 'Motion Design School', views: '890K', url: 'https://www.youtube.com/watch?v=Q7Z6M6ld_Kg' },
      { id: 6, title: 'Design Portfolio Research', source: 'AIGA', type: 'research', citations: 67, url: 'https://www.aiga.org/resources' },
    ],
    9: [
      { id: 1, title: 'Thesis Writing for Designers', source: 'AIGA', type: 'documents', rating: 4.8, url: 'https://www.aiga.org/resources/thesis-guidelines' },
      { id: 2, title: 'Design Thinking Process', source: 'IDEO', type: 'documents', rating: 4.9, url: 'https://designthinking.ideo.com/' },
      { id: 3, title: 'Creative Career Guide', source: 'Indeed', type: 'documents', rating: 4.6, url: 'https://www.indeed.com/career-advice/finding-a-job/graphic-design-careers' },
      { id: 4, title: 'Design Career Advice', source: 'YouTube', type: 'videos', channel: 'The Futur', views: '2.4M', url: 'https://www.youtube.com/watch?v=dGM1Fk_TwQE' },
      { id: 5, title: 'Getting Hired as Designer', source: 'YouTube', type: 'videos', channel: 'Flux Academy', views: '1.2M', url: 'https://www.youtube.com/watch?v=gv-PP8JzuLQ' },
      { id: 6, title: 'Design Industry Trends', source: 'Adobe', type: 'research', citations: 156, url: 'https://www.adobe.com/creativecloud/trends.html' },
    ],
  },
  cn: {
    1: [
      { id: 1, title: 'HSK 1 Vocabulary Complete', source: 'HSK Academy', type: 'documents', rating: 4.9, url: 'https://www.hsk.academy/en/hsk-1' },
      { id: 2, title: 'Chinese Learning App', source: 'HelloChinese', type: 'documents', rating: 4.8, url: 'https://www.hellochinese.cc/' },
      { id: 3, title: 'Pinyin Complete Guide', source: 'Chinese Zero to Hero', type: 'documents', rating: 4.7, url: 'https://www.chinesezerotohero.com/learn-chinese/' },
      { id: 4, title: 'Mandarin Chinese Basics', source: 'YouTube', type: 'videos', channel: 'ChineseClass101', views: '4.2M', url: 'https://www.youtube.com/watch?v=p9Qn5Vc0F7U' },
      { id: 5, title: 'Learn Chinese in 30 Days', source: 'YouTube', type: 'videos', channel: 'Chinese with Mike', views: '2.8M', url: 'https://www.youtube.com/watch?v=HgbN8doxXxg' },
      { id: 6, title: 'Chinese Language Learning Research', source: 'ResearchGate', type: 'research', citations: 89, url: 'https://www.researchgate.net/topic/Chinese-Language' },
    ],
    2: [
      { id: 1, title: 'HSK 2 Complete Study Guide', source: 'HSK Academy', type: 'documents', rating: 4.8, url: 'https://www.hsk.academy/en/hsk-2' },
      { id: 2, title: 'Chinese Grammar Wiki', source: 'AllSet Learning', type: 'documents', rating: 4.9, url: 'https://resources.allsetlearning.com/chinese/grammar/' },
      { id: 3, title: 'Chinese Character Practice', source: 'Skritter', type: 'documents', rating: 4.7, url: 'https://skritter.com/' },
      { id: 4, title: 'Chinese Grammar Explained', source: 'YouTube', type: 'videos', channel: 'Yoyo Chinese', views: '2.8M', url: 'https://www.youtube.com/watch?v=g5m7xeFXDAU' },
      { id: 5, title: 'HSK 2 Preparation', source: 'YouTube', type: 'videos', channel: 'Mandarin Corner', views: '1.5M', url: 'https://www.youtube.com/watch?v=8t0JZ7r4MZU' },
      { id: 6, title: 'Second Language Acquisition', source: 'Cambridge', type: 'research', citations: 234, url: 'https://www.cambridge.org/core/journals/language-teaching' },
    ],
    3: [
      { id: 1, title: 'Chinese Culture Introduction', source: 'China Highlights', type: 'documents', rating: 4.7, url: 'https://www.chinahighlights.com/travelguide/culture/' },
      { id: 2, title: 'Chinese Literature Guide', source: 'Chinese Reading', type: 'documents', rating: 4.6, url: 'https://chinese-reading.com/' },
      { id: 3, title: 'Traditional Chinese Arts', source: 'China Online Museum', type: 'documents', rating: 4.8, url: 'http://www.chinaonlinemuseum.com/' },
      { id: 4, title: 'Chinese History Overview', source: 'YouTube', type: 'videos', channel: 'ChinaFile', views: '890K', url: 'https://www.youtube.com/watch?v=ylWORyToTo4' },
      { id: 5, title: 'Chinese Culture Documentary', source: 'YouTube', type: 'videos', channel: 'CGTN', views: '3.2M', url: 'https://www.youtube.com/watch?v=WvPBOl0kh5w' },
      { id: 6, title: 'Chinese Cultural Studies', source: 'Khan Academy', type: 'research', citations: 156, url: 'https://www.khanacademy.org/humanities/world-history/ancient-medieval/early-china' },
    ],
    4: [
      { id: 1, title: 'HSK 3 Business Chinese', source: 'HSK Academy', type: 'documents', rating: 4.8, url: 'https://www.hsk.academy/en/hsk-3' },
      { id: 2, title: 'Business Chinese Vocabulary', source: 'FluentU', type: 'documents', rating: 4.7, url: 'https://www.fluentu.com/blog/chinese/business-chinese-vocabulary/' },
      { id: 3, title: 'Chinese Email Writing', source: 'Du Chinese', type: 'documents', rating: 4.6, url: 'https://www.duchinese.net/' },
      { id: 4, title: 'Chinese for Business', source: 'YouTube', type: 'videos', channel: 'Mandarin Corner', views: '1.2M', url: 'https://www.youtube.com/watch?v=QwR4x4m0EQc' },
      { id: 5, title: 'Business Mandarin Course', source: 'YouTube', type: 'videos', channel: 'Learn Chinese Now', views: '780K', url: 'https://www.youtube.com/watch?v=tYS2cZ3xMgE' },
      { id: 6, title: 'Business Chinese Research', source: 'SSRN', type: 'research', citations: 123, url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=business-chinese' },
    ],
    5: [
      { id: 1, title: 'HSK 4 Advanced Reading', source: 'HSK Academy', type: 'documents', rating: 4.9, url: 'https://www.hsk.academy/en/hsk-4' },
      { id: 2, title: 'Advanced Chinese Reading', source: 'Du Chinese', type: 'documents', rating: 4.8, url: 'https://www.duchinese.net/' },
      { id: 3, title: 'Chinese News Reading', source: 'The Chairman\'s Bao', type: 'documents', rating: 4.7, url: 'https://www.thechairmansbao.com/' },
      { id: 4, title: 'HSK 4 Listening Practice', source: 'YouTube', type: 'videos', channel: 'Slow Chinese', views: '1.5M', url: 'https://www.youtube.com/watch?v=7rO7g0j3ROs' },
      { id: 5, title: 'Advanced Chinese Conversation', source: 'YouTube', type: 'videos', channel: 'ChinesePod', views: '890K', url: 'https://www.youtube.com/watch?v=UbZ4X9y5qYE' },
      { id: 6, title: 'Chinese Pedagogy Research', source: 'ACTFL', type: 'research', citations: 189, url: 'https://www.actfl.org/resources' },
    ],
    7: [
      { id: 1, title: 'Translation Techniques Guide', source: 'TranslationDirectory', type: 'documents', rating: 4.7, url: 'https://www.translationdirectory.com/articles.php' },
      { id: 2, title: 'CAT Tools Tutorial', source: 'SDL Trados', type: 'documents', rating: 4.6, url: 'https://www.trados.com/learning/' },
      { id: 3, title: 'HSK 5 Preparation', source: 'HSK Academy', type: 'documents', rating: 4.8, url: 'https://www.hsk.academy/en/hsk-5' },
      { id: 4, title: 'Translation Skills', source: 'YouTube', type: 'videos', channel: 'Interpreter Training', views: '650K', url: 'https://www.youtube.com/watch?v=translation-skills' },
      { id: 5, title: 'Chinese-English Translation', source: 'YouTube', type: 'videos', channel: 'Translation Tips', views: '450K', url: 'https://www.youtube.com/results?search_query=chinese+english+translation+tips' },
      { id: 6, title: 'Translation Studies', source: 'John Benjamins', type: 'research', citations: 278, url: 'https://benjamins.com/catalog/ts' },
    ],
    8: [
      { id: 1, title: 'Simultaneous Interpretation Guide', source: 'AIIC', type: 'documents', rating: 4.8, url: 'https://aiic.org/document/4129/' },
      { id: 2, title: 'HSK 6 Advanced Study', source: 'HSK Academy', type: 'documents', rating: 4.9, url: 'https://www.hsk.academy/en/hsk-6' },
      { id: 3, title: 'Conference Interpreting', source: 'ORCIT', type: 'documents', rating: 4.7, url: 'https://www.orcit.eu/' },
      { id: 4, title: 'Interpretation Practice', source: 'YouTube', type: 'videos', channel: 'Interpreter Training', views: '550K', url: 'https://www.youtube.com/results?search_query=chinese+interpretation+practice' },
      { id: 5, title: 'Professional Interpreting Skills', source: 'YouTube', type: 'videos', channel: 'Language Professionals', views: '380K', url: 'https://www.youtube.com/results?search_query=professional+interpreting' },
      { id: 6, title: 'Interpreting Studies Research', source: 'Routledge', type: 'research', citations: 198, url: 'https://www.routledge.com/interpreting' },
    ],
    9: [
      { id: 1, title: 'Academic Writing in Chinese', source: 'Purdue OWL', type: 'documents', rating: 4.9, url: 'https://owl.purdue.edu/owl/research_and_citation/' },
      { id: 2, title: 'Thesis Writing Guide', source: 'University Resources', type: 'documents', rating: 4.8, url: 'https://writing.wisc.edu/handbook/' },
      { id: 3, title: 'Language Teaching Career', source: 'Indeed', type: 'documents', rating: 4.6, url: 'https://www.indeed.com/career-advice/finding-a-job/language-teaching' },
      { id: 4, title: 'Academic Presentation Skills', source: 'YouTube', type: 'videos', channel: 'Academic English', views: '1.2M', url: 'https://www.youtube.com/watch?v=Unzc731iCUY' },
      { id: 5, title: 'Career in Chinese Language', source: 'YouTube', type: 'videos', channel: 'Career Advice', views: '320K', url: 'https://www.youtube.com/results?search_query=chinese+language+career' },
      { id: 6, title: 'Applied Linguistics Research', source: 'Oxford', type: 'research', citations: 312, url: 'https://academic.oup.com/applij' },
    ],
  },
  mk: {
    1: [
      { id: 1, title: 'Marketing Fundamentals Course', source: 'HubSpot Academy', type: 'documents', rating: 4.8, url: 'https://academy.hubspot.com/courses/inbound-marketing' },
      { id: 2, title: 'Marketing 101', source: 'Coursera', type: 'documents', rating: 4.9, url: 'https://www.coursera.org/learn/wharton-marketing' },
      { id: 3, title: 'Marketing Principles', source: 'Khan Academy', type: 'documents', rating: 4.7, url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/marketing' },
      { id: 4, title: 'Marketing Explained', source: 'YouTube', type: 'videos', channel: 'HubSpot Marketing', views: '3.1M', url: 'https://www.youtube.com/watch?v=O_7Fpq6lq0E' },
      { id: 5, title: 'What is Marketing?', source: 'YouTube', type: 'videos', channel: 'Professor Wolters', views: '2.4M', url: 'https://www.youtube.com/watch?v=sR-qL7QdVZQ' },
      { id: 6, title: 'Marketing Fundamentals Research', source: 'AMA', type: 'research', citations: 156, url: 'https://www.ama.org/resources/' },
    ],
    2: [
      { id: 1, title: 'Consumer Behavior Guide', source: 'HubSpot', type: 'documents', rating: 4.8, url: 'https://blog.hubspot.com/marketing/consumer-behavior' },
      { id: 2, title: 'Psychology of Marketing', source: 'Verywell Mind', type: 'documents', rating: 4.7, url: 'https://www.verywellmind.com/consumer-psychology' },
      { id: 3, title: 'Consumer Psychology Course', source: 'Coursera', type: 'documents', rating: 4.8, url: 'https://www.coursera.org/learn/consumer-behavior' },
      { id: 4, title: 'Consumer Behavior Explained', source: 'YouTube', type: 'videos', channel: 'Marketing91', views: '890K', url: 'https://www.youtube.com/watch?v=tM4F3k3Ksbc' },
      { id: 5, title: 'Marketing Psychology', source: 'YouTube', type: 'videos', channel: 'The Futur', views: '1.8M', url: 'https://www.youtube.com/watch?v=9X4R3_DQekg' },
      { id: 6, title: 'Consumer Research Papers', source: 'JCR', type: 'research', citations: 289, url: 'https://academic.oup.com/jcr' },
    ],
    3: [
      { id: 1, title: 'Digital Marketing Course', source: 'Google Digital Garage', type: 'documents', rating: 4.9, url: 'https://learndigital.withgoogle.com/digitalgarage' },
      { id: 2, title: 'SEO Starter Guide', source: 'Google', type: 'documents', rating: 4.9, url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
      { id: 3, title: 'Content Marketing Guide', source: 'HubSpot', type: 'documents', rating: 4.8, url: 'https://blog.hubspot.com/marketing/content-marketing' },
      { id: 4, title: 'Google Ads Full Course', source: 'YouTube', type: 'videos', channel: 'Surfside PPC', views: '2.5M', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg' },
      { id: 5, title: 'Digital Marketing Tutorial', source: 'YouTube', type: 'videos', channel: 'Simplilearn', views: '4.2M', url: 'https://www.youtube.com/watch?v=hiEb1ture4c' },
      { id: 6, title: 'Digital Marketing Research', source: 'Journal of Marketing', type: 'research', citations: 345, url: 'https://journals.sagepub.com/home/jmx' },
    ],
    4: [
      { id: 1, title: 'Brand Strategy Guide', source: 'HubSpot', type: 'documents', rating: 4.7, url: 'https://blog.hubspot.com/marketing/branding' },
      { id: 2, title: 'Meta Blueprint', source: 'Meta', type: 'documents', rating: 4.8, url: 'https://www.facebookblueprint.com/' },
      { id: 3, title: 'Social Media Marketing', source: 'Hootsuite', type: 'documents', rating: 4.7, url: 'https://www.hootsuite.com/resources/social-media-marketing-strategy' },
      { id: 4, title: 'Social Media Marketing Full', source: 'YouTube', type: 'videos', channel: 'Neil Patel', views: '4.4M', url: 'https://www.youtube.com/watch?v=Rx_dLfxjkA0' },
      { id: 5, title: 'Building a Brand', source: 'YouTube', type: 'videos', channel: 'Gary Vaynerchuk', views: '3.8M', url: 'https://www.youtube.com/watch?v=nqMpqk4wSCg' },
      { id: 6, title: 'Brand Management Research', source: 'JBEM', type: 'research', citations: 234, url: 'https://www.emerald.com/insight/publication/issn/1061-0421' },
    ],
    5: [
      { id: 1, title: 'Marketing Research Methods', source: 'Qualtrics', type: 'documents', rating: 4.8, url: 'https://www.qualtrics.com/experience-management/research/market-research/' },
      { id: 2, title: 'Google Analytics Academy', source: 'Google', type: 'documents', rating: 4.9, url: 'https://analytics.google.com/analytics/academy/' },
      { id: 3, title: 'Data-Driven Marketing', source: 'HubSpot', type: 'documents', rating: 4.7, url: 'https://blog.hubspot.com/marketing/data-driven-marketing' },
      { id: 4, title: 'Marketing Analytics Course', source: 'YouTube', type: 'videos', channel: 'Google Analytics', views: '1.8M', url: 'https://www.youtube.com/watch?v=kMzR8V8Rdzw' },
      { id: 5, title: 'Market Research Tutorial', source: 'YouTube', type: 'videos', channel: 'CareerFoundry', views: '890K', url: 'https://www.youtube.com/watch?v=b-hDg7699S0' },
      { id: 6, title: 'Marketing Analytics Research', source: 'Harvard Business Review', type: 'research', citations: 289, url: 'https://hbr.org/topic/subject/analytics' },
    ],
    7: [
      { id: 1, title: 'Integrated Marketing Communications', source: 'HubSpot', type: 'documents', rating: 4.7, url: 'https://blog.hubspot.com/marketing/integrated-marketing-communications' },
      { id: 2, title: 'Marketing Campaign Planning', source: 'Sprout Social', type: 'documents', rating: 4.6, url: 'https://sproutsocial.com/insights/marketing-campaign/' },
      { id: 3, title: 'Email Marketing Guide', source: 'Mailchimp', type: 'documents', rating: 4.8, url: 'https://mailchimp.com/resources/email-marketing-field-guide/' },
      { id: 4, title: 'Marketing Campaign Strategy', source: 'YouTube', type: 'videos', channel: 'Neil Patel', views: '2.1M', url: 'https://www.youtube.com/watch?v=M0Mz6rOeXbM' },
      { id: 5, title: 'IMC Explained', source: 'YouTube', type: 'videos', channel: 'Marketing91', views: '560K', url: 'https://www.youtube.com/watch?v=yZ3Fd3S9VHs' },
      { id: 6, title: 'IMC Academic Research', source: 'IJAM', type: 'research', citations: 178, url: 'https://www.emerald.com/insight/publication/issn/0265-1335' },
    ],
    8: [
      { id: 1, title: 'Marketing Case Studies', source: 'Harvard Business Review', type: 'documents', rating: 4.9, url: 'https://hbr.org/topic/subject/marketing' },
      { id: 2, title: 'Strategic Marketing', source: 'McKinsey', type: 'documents', rating: 4.8, url: 'https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights' },
      { id: 3, title: 'Marketing Strategy Guide', source: 'HubSpot', type: 'documents', rating: 4.7, url: 'https://blog.hubspot.com/marketing/marketing-strategy' },
      { id: 4, title: 'Marketing Strategy Tutorial', source: 'YouTube', type: 'videos', channel: 'The Futur', views: '1.5M', url: 'https://www.youtube.com/watch?v=vYC3B3HZ7xE' },
      { id: 5, title: 'Case Study Analysis', source: 'YouTube', type: 'videos', channel: 'Harvard Business Review', views: '890K', url: 'https://www.youtube.com/watch?v=kiRCASEvo0g' },
      { id: 6, title: 'Marketing Strategy Research', source: 'MSI', type: 'research', citations: 312, url: 'https://www.msi.org/research/' },
    ],
    9: [
      { id: 1, title: 'Marketing Career Guide', source: 'Indeed', type: 'documents', rating: 4.8, url: 'https://www.indeed.com/career-advice/finding-a-job/marketing-career' },
      { id: 2, title: 'Marketing Portfolio Tips', source: 'LinkedIn', type: 'documents', rating: 4.7, url: 'https://www.linkedin.com/business/marketing/blog/trends-tips/marketing-portfolio' },
      { id: 3, title: 'Marketing Interview Prep', source: 'Glassdoor', type: 'documents', rating: 4.6, url: 'https://www.glassdoor.com/blog/marketing-interview-questions/' },
      { id: 4, title: 'Marketing Career Advice', source: 'YouTube', type: 'videos', channel: 'Gary Vaynerchuk', views: '2.8M', url: 'https://www.youtube.com/watch?v=nxDCELJGdXs' },
      { id: 5, title: 'Getting a Marketing Job', source: 'YouTube', type: 'videos', channel: 'The Futur', views: '1.2M', url: 'https://www.youtube.com/watch?v=r_3JJVZ9O0Q' },
      { id: 6, title: 'Marketing Careers Research', source: 'BLS', type: 'research', citations: 145, url: 'https://www.bls.gov/ooh/business-and-financial/marketing-managers.htm' },
    ],
  },
};

export const internshipResources: CourseResource[] = [
  { id: 1, title: 'Hướng dẫn Thực tập FPT 2024', source: 'FPT University', type: 'internship', url: 'https://daihoc.fpt.edu.vn/thuc-tap-doanh-nghiep/' },
  { id: 2, title: 'Mẫu Báo cáo Thực tập', source: 'FPT Template', type: 'internship', url: 'https://daihoc.fpt.edu.vn/bieu-mau-sinh-vien/' },
  { id: 3, title: 'Resume Writing Complete Guide', source: 'Indeed', type: 'documents', rating: 4.9, url: 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-write-a-resume' },
  { id: 4, title: 'Interview Preparation Guide', source: 'Glassdoor', type: 'documents', rating: 4.8, url: 'https://www.glassdoor.com/blog/guide/how-to-prepare-for-an-interview/' },
  { id: 5, title: 'LinkedIn Profile Optimization', source: 'LinkedIn', type: 'documents', rating: 4.7, url: 'https://www.linkedin.com/business/talent/blog/product-tips/linkedin-profile-tips' },
  { id: 6, title: 'How to Write an Internship Report', source: 'YouTube', type: 'videos', channel: 'Career Guide', views: '650K', url: 'https://www.youtube.com/watch?v=eJyVvA8_VDE' },
  { id: 7, title: 'Interview Tips & Tricks', source: 'YouTube', type: 'videos', channel: 'Indeed', views: '3.8M', url: 'https://www.youtube.com/watch?v=1mHjMNZZvFo' },
  { id: 8, title: 'Soft Skills for Interns', source: 'YouTube', type: 'videos', channel: 'LinkedIn Learning', views: '1.2M', url: 'https://www.youtube.com/watch?v=Qi6Cs68Q1IM' },
  { id: 9, title: 'Professional Skills Development', source: 'LinkedIn Learning', type: 'research', citations: 234, url: 'https://www.linkedin.com/learning/topics/professional-development' },
  { id: 10, title: 'Workplace Communication', source: 'Harvard Business Review', type: 'research', citations: 189, url: 'https://hbr.org/topic/subject/communication' },
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
