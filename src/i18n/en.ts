// English Translation Dictionary — FPT Learn Portal
import type { Translations } from './vi';

const en: Translations = {
  // === NAVBAR ===
  nav: {
    home: 'Home',
    leaderboard: 'Leaderboard',
    gpa: 'GPA Calculator',
    favorites: 'Favorites',
    admin: 'Admin',
    profile: 'My Profile',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    fptStudent: 'FPT Student',
    streakDays: 'Day Streak',
  },

  // === MAJOR SELECTION ===
  major: {
    title: 'Choose Your',
    titleHighlight: 'Major',
    subtitle: 'Select your field of study to access specialized materials and connect with students in the same program.',
    selectButton: 'Select Major',
    helpText: "Not sure which major to choose? Ask our AI assistant for guidance.",
    se: {
      name: 'Software Engineering',
      desc: 'Build the future with code. Master programming, algorithms, and software development.',
    },
    mm: {
      name: 'Multimedia',
      desc: 'Create stunning digital experiences. Learn design, animation, and multimedia production.',
    },
    cn: {
      name: 'Chinese Language',
      desc: 'Connect with the world. Master Chinese language and culture for global opportunities.',
    },
    mk: {
      name: 'Marketing',
      desc: 'Drive business growth. Learn digital marketing, branding, and consumer psychology.',
    },
  },

  // === GPA PAGE ===
  gpaPage: {
    title: 'GPA',
    titleHighlight: 'Calculator',
    subtitle: 'Track your academic performance and plan for success',
  },

  // === LEADERBOARD ===
  leaderboard: {
    community: 'FPT Learn Community',
    title: 'Leaderboard',
    titleHighlight: 'RANK MASTER',
    subtitle: 'Honoring the most outstanding learners at FPT Learn. Earn points through discussions and document contributions to climb the ranks!',
    searchPlaceholder: 'Search for top learners...',
    listTitle: 'Top Learners',
    loading: 'Summoning top learners...',
    noResults: 'No matching learners found...',
    viewDetail: 'View Details',
    defaultName: 'FPT Student',
    notUpdated: 'Major not set',
  },

  // === CHATBOT ===
  chatbot: {
    greeting: "Hi there! 👋 I'm **FPT Assistant** 🤖✨ — powered by **AI Gemini**. Ask me anything about the Portal and I'll help you out! 🤝🔥",
    thinking: '🤔 Thinking with AI...',
    placeholder: 'Ask anything — AI will answer smartly! ✨',
    poweredBy: 'Powered by Gemini AI + Trained Data',
    errorConnect: "⚠️ Can't connect to AI right now. Please try again later!",
    fallback: "😅 Sorry, I don't have info on this topic. Try asking about **courses, GPA, rank, materials** on the Portal! 🤝",
  },

  // === AUTH ===
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    studentId: 'Student ID',
  },

  // === RESOURCE CARD ===
  resource: {
    openDoc: 'Open Document',
    document: 'Document',
    research: 'Research',
    internship: 'Internship',
    citations: 'citations',
  },

  // === FAVORITES ===
  favorites: {
    title: 'Favorites',
    subtitle: 'Your saved documents',
  },

  // === PROFILE ===
  profile: {
    title: 'Profile',
    points: 'Points',
    rank: 'Rank',
  },

  // === COMMON ===
  common: {
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    search: 'Search',
    noData: 'No data',
  },
};

export default en;
