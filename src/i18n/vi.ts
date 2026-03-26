// Từ điển Tiếng Việt — FPT Learn Portal
const vi = {
  // === NAVBAR ===
  nav: {
    home: 'Trang chủ',
    leaderboard: 'Bảng xếp hạng',
    gpa: 'Tính GPA',
    favorites: 'Yêu thích',
    admin: 'Admin',
    profile: 'Hồ sơ của tôi',
    signOut: 'Đăng xuất',
    signIn: 'Đăng nhập',
    fptStudent: 'FPT Student',
    streakDays: 'Streak ngày',
  },

  // === MAJOR SELECTION ===
  major: {
    title: 'Chọn',
    titleHighlight: 'Chuyên Ngành',
    subtitle: 'Chọn lĩnh vực học tập để truy cập tài liệu chuyên ngành và kết nối với sinh viên cùng chương trình.',
    selectButton: 'Chọn ngành',
    helpText: 'Chưa biết chọn ngành nào? Hỏi trợ lý AI của chúng tôi để được tư vấn.',
    se: {
      name: 'Software Engineering',
      desc: 'Xây dựng tương lai bằng mã nguồn. Chinh phục lập trình, thuật toán, và phát triển phần mềm.',
    },
    mm: {
      name: 'Multimedia',
      desc: 'Sáng tạo trải nghiệm kỹ thuật số. Thiết kế, hoạt hình, và sản xuất đa phương tiện.',
    },
    cn: {
      name: 'Chinese Language',
      desc: 'Kết nối thế giới. Tinh thông ngôn ngữ và văn hóa Trung Quốc cho cơ hội toàn cầu.',
    },
    mk: {
      name: 'Marketing',
      desc: 'Thúc đẩy tăng trưởng kinh doanh. Marketing kỹ thuật số, thương hiệu, và tâm lý người tiêu dùng.',
    },
  },

  // === GPA PAGE ===
  gpaPage: {
    title: 'GPA',
    titleHighlight: 'Calculator',
    subtitle: 'Theo dõi kết quả học tập và lập kế hoạch thành công',
  },

  // === LEADERBOARD ===
  leaderboard: {
    community: 'Cộng đồng FPT Learn',
    title: 'Bảng xếp hạng',
    titleHighlight: 'RANK MASTER',
    subtitle: 'Vinh danh những chiến thần học tập xuất sắc nhất tại FPT Learn. Tích lũy điểm từ việc thảo luận và đóng góp tài liệu để leo Rank!',
    searchPlaceholder: 'Tìm kiếm cao thủ...',
    listTitle: 'Danh sách Cao thủ',
    loading: 'Đang triệu hồi các cao thủ...',
    noResults: 'Không tìm thấy cao thủ nào phù hợp...',
    viewDetail: 'Xem chi tiết',
    defaultName: 'Học viên FPT',
    notUpdated: 'Chưa cập nhật ngành',
  },

  // === CHATBOT ===
  chatbot: {
    greeting: 'Xin chào bạn! Mình là **FPT Assistant** 🤖✨ — được hỗ trợ bởi **AI Gemini**. Bạn cần hỏi gì về Portal, mình đều hỗ trợ chi tiết nhé! 🤝🔥',
    thinking: '🤔 Đang suy nghĩ với AI...',
    placeholder: 'Hỏi bất kỳ điều gì — AI sẽ trả lời thông minh! ✨',
    poweredBy: 'Powered by Gemini AI + Trained Data',
    errorConnect: '⚠️ Không thể kết nối AI lúc này. Bạn thử lại sau nhé!',
    fallback: '😅 Xin lỗi bạn, mình chưa có thông tin về vấn đề này. Bạn thử hỏi về **môn học, GPA, rank, tài liệu** tại Portal nhé! 🤝',
  },

  // === AUTH ===
  auth: {
    signIn: 'Đăng nhập',
    signUp: 'Đăng ký',
    email: 'Email',
    password: 'Mật khẩu',
    studentId: 'Mã sinh viên',
  },

  // === RESOURCE CARD ===
  resource: {
    openDoc: 'Mở tài liệu',
    document: 'Tài liệu',
    research: 'Nghiên cứu',
    internship: 'Thực tập',
    citations: 'trích dẫn',
  },

  // === FAVORITES ===
  favorites: {
    title: 'Yêu thích',
    subtitle: 'Tài liệu đã lưu của bạn',
  },

  // === PROFILE ===
  profile: {
    title: 'Hồ sơ',
    points: 'Điểm',
    rank: 'Hạng',
  },

  // === COMMON ===
  common: {
    loading: 'Đang tải...',
    error: 'Lỗi',
    save: 'Lưu',
    cancel: 'Huỷ',
    delete: 'Xoá',
    search: 'Tìm kiếm',
    noData: 'Không có dữ liệu',
  },
};

export default vi;
export type Translations = typeof vi;
