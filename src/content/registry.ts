/**
 * ============================================================================
 * REGISTRY TRANG — nguồn sự thật DUY NHẤT về cấu trúc site.
 * ----------------------------------------------------------------------------
 * Nó điều khiển: menu chính, footer, sitemap.xml, và bảng theo dõi /_track.
 * Mỗi trang khai báo đủ các trường theo §25 của blueprint ("Hướng dẫn cho agent").
 *
 * Thêm trang mới = thêm một entry ở đây TRƯỚC, rồi mới tạo route.
 * Không tạo route "mồ côi" không có trong registry.
 * ============================================================================
 */

/** Giai đoạn triển khai — §8.3 blueprint */
export type Phase = "V1" | "V2";

/**
 * Trạng thái hoàn thiện, tăng dần:
 *  spec      — mới khai báo, chưa có route
 *  stub      — route chạy được, nội dung là placeholder
 *  wireframe — đủ section, heading, CTA; copy còn nháp
 *  content   — copy tiếng Việt hoàn chỉnh, đã qua biên tập
 *  ready     — đã gắn proof thật + qua QA (§27)
 */
export type Status = "spec" | "stub" | "wireframe" | "content" | "ready";

/** Vai trò người mua — §5 blueprint */
export type Audience =
  | "ceo"
  | "coo"
  | "cio"
  | "ciso"
  | "manager"
  | "procurement";

/** Giai đoạn phễu — §6 blueprint */
export type Funnel = "awareness" | "consideration" | "validation" | "decision";

/** Nhóm CTA — §7 blueprint. Mỗi trang chỉ có MỘT CTA chính. */
export type Cta =
  | "assessment" // Đánh giá cơ hội ứng dụng AI
  | "process" // Trao đổi một quy trình cụ thể
  | "architecture" // Trao đổi về kiến trúc AI
  | "usecase" // Trao đổi use case này
  | "poc" // Xác định phạm vi PoC
  | "contact"
  | "none";

export interface PageEntry {
  /** Khoá ổn định, dùng làm namespace trong messages/*.json */
  key: string;
  /** Đường dẫn KHÔNG kèm locale. "/" là trang chủ. */
  path: string;
  phase: Phase;
  status: Status;
  /** Nhiệm vụ của trang — §25.1. Viết bằng tiếng Việt, một câu. */
  objective: string;
  audiencePrimary: Audience;
  audienceSecondary?: Audience[];
  funnel: Funnel;
  cta: Cta;
  /** Câu hỏi khách hàng mang tới trang này — §25.5 */
  questions: string[];
  /** Bằng chứng trang này cần có — §17 */
  proofNeeded: string[];
  /** Nội dung còn thiếu, để nguyên placeholder — §24 */
  gaps: string[];
  /** Nội dung KHÔNG được đưa vào trang này — §25.13 */
  forbidden?: string[];
  /** Xuất hiện ở menu chính? */
  inNav?: boolean;
  /** Xuất hiện ở footer nhóm nào? */
  footerGroup?: "solutions" | "usecases" | "company" | "legal";
  children?: PageEntry[];
}

export const PAGES: PageEntry[] = [
  {
    key: "home",
    path: "/",
    phase: "V1",
    status: "wireframe",
    objective:
      "Trong 15 giây giúp khách hiểu Pebble là ai, giúp ai, tạo ra kết quả gì và bước tiếp theo là gì.",
    audiencePrimary: "ceo",
    audienceSecondary: ["coo", "cio"],
    funnel: "awareness",
    cta: "assessment",
    questions: [
      "Công ty này làm gì, có phải bán chip không?",
      "AI của họ tạo ra kết quả kinh doanh nào?",
      "Doanh nghiệp như chúng tôi bắt đầu từ đâu?",
      "Có đáng tin để giao một dự án Enterprise không?",
    ],
    proofNeeded: [
      "Năng lực full-stack thể hiện bằng sơ đồ tầng",
      "Ít nhất một case study có số liệu",
      "Quy trình triển khai 8 bước",
    ],
    gaps: [
      "Case study có số liệu",
      "Danh sách khách hàng/đối tác được phép công khai",
      "Ảnh đội ngũ và phòng lab thật",
    ],
    forbidden: [
      "Danh sách chip hoặc thông số phần cứng ở phần đầu trang",
      "Số liệu ROI chưa được assessment xác nhận",
      "Testimonial chưa có thật",
    ],
  },

  {
    key: "solutions",
    path: "/solutions",
    phase: "V1",
    status: "wireframe",
    objective:
      "Cho khách chọn đúng nhóm bài toán của mình theo kết quả cần đạt, không theo tên công nghệ.",
    audiencePrimary: "coo",
    audienceSecondary: ["ceo", "manager"],
    funnel: "consideration",
    cta: "assessment",
    questions: [
      "Bài toán của tôi có nằm trong nhóm nào không?",
      "Nên bắt đầu từ nhóm nào trước?",
    ],
    proofNeeded: ["Mỗi solution có ít nhất một ví dụ triển khai"],
    gaps: ["Use case mở cửa đã được Pebble Vina chốt"],
    inNav: true,
    children: [
      {
        key: "solutions.enterprise-knowledge",
        path: "/solutions/enterprise-knowledge",
        phase: "V1",
        status: "wireframe",
        objective:
          "Giúp nhân viên tìm đúng thông tin nội bộ trong vài giây thay vì hỏi vòng quanh.",
        audiencePrimary: "coo",
        audienceSecondary: ["manager", "cio"],
        funnel: "consideration",
        cta: "usecase",
        questions: [
          "Tài liệu của chúng tôi nằm rải rác, có gom được không?",
          "AI trả lời sai thì sao?",
          "Ai được xem tài liệu nào?",
        ],
        proofNeeded: ["Kiến trúc tham chiếu", "Chỉ số đo độ chính xác"],
        gaps: ["Case study kho tri thức"],
        footerGroup: "solutions",
      },
      {
        key: "solutions.document-intelligence",
        path: "/solutions/document-intelligence",
        phase: "V1",
        status: "wireframe",
        objective:
          "Giảm thời gian bóc tách, nhập liệu và đối chiếu hồ sơ, chứng từ, hợp đồng.",
        audiencePrimary: "coo",
        audienceSecondary: ["manager", "procurement"],
        funnel: "consideration",
        cta: "process",
        questions: [
          "Chứng từ của chúng tôi không theo mẫu chuẩn, xử lý được không?",
          "Sai sót thì ai chịu trách nhiệm kiểm?",
          "Có đẩy được thẳng vào ERP không?",
        ],
        proofNeeded: ["Chỉ số độ chính xác theo loại chứng từ", "Ví dụ tích hợp ERP"],
        gaps: ["Bộ chứng từ mẫu được phép dùng minh hoạ"],
        footerGroup: "solutions",
      },
      {
        key: "solutions.workflow-automation",
        path: "/solutions/workflow-automation",
        phase: "V1",
        status: "wireframe",
        objective:
          "Nối các bước thủ công rời rạc thành một quy trình có kiểm soát và đo được.",
        audiencePrimary: "coo",
        audienceSecondary: ["cio", "manager"],
        funnel: "consideration",
        cta: "process",
        questions: [
          "Quy trình của chúng tôi phức tạp, AI làm được bước nào?",
          "Con người phê duyệt ở đâu?",
          "Có phải thay hệ thống hiện tại không?",
        ],
        proofNeeded: ["Sơ đồ luồng trước/sau", "Ma trận trách nhiệm"],
        gaps: ["Ví dụ quy trình có số liệu"],
        footerGroup: "solutions",
      },
      {
        key: "solutions.ai-agents",
        path: "/solutions/ai-agents",
        phase: "V1",
        status: "wireframe",
        objective:
          "Đưa AI từ hỗ trợ từng thao tác lên mức thực hiện chuỗi việc liên hệ thống, có giám sát.",
        audiencePrimary: "cio",
        audienceSecondary: ["coo"],
        funnel: "consideration",
        cta: "architecture",
        questions: [
          "Agent khác chatbot ở chỗ nào?",
          "Nó được phép làm gì và bị chặn ở đâu?",
          "Chi phí có kiểm soát được không?",
        ],
        proofNeeded: ["Kiến trúc agent", "Cơ chế guardrail và phê duyệt"],
        gaps: ["Demo agent hoạt động"],
        footerGroup: "solutions",
      },
      {
        key: "solutions.private-ai",
        path: "/solutions/private-ai",
        phase: "V1",
        status: "wireframe",
        objective:
          "Trả lời trọn vẹn lo ngại về dữ liệu: chạy ở đâu, ai truy cập, kiểm soát thế nào.",
        audiencePrimary: "ciso",
        audienceSecondary: ["cio", "ceo"],
        funnel: "validation",
        cta: "architecture",
        questions: [
          "Dữ liệu có bị dùng để huấn luyện không?",
          "Chạy được trong hạ tầng của chúng tôi không?",
          "Có audit log không?",
        ],
        proofNeeded: [
          "Sơ đồ deployment on-premise",
          "Mô hình vận hành sau go-live",
          "Tài liệu security",
        ],
        gaps: [
          "Chứng chỉ bảo mật đang có",
          "Chính sách bảo mật chính thức",
          "Năng lực support và SLA vận hành",
        ],
        forbidden: ["Tuyên bố bảo mật tuyệt đối", "Nói on-premise mà không mô tả mô hình vận hành"],
        footerGroup: "solutions",
      },
      {
        key: "solutions.industrial-edge-ai",
        path: "/solutions/industrial-edge-ai",
        phase: "V2",
        status: "stub",
        objective:
          "Chứng minh Pebble xử lý được lớp hiện trường: thiết bị, cảm biến, suy luận tại chỗ.",
        audiencePrimary: "cio",
        audienceSecondary: ["coo"],
        funnel: "validation",
        cta: "architecture",
        questions: [
          "Nhà máy không có kết nối ổn định thì sao?",
          "Thiết bị nào chạy được?",
        ],
        proofNeeded: ["Datasheet thiết bị", "Ảnh phòng lab", "Kết quả kiểm thử"],
        gaps: ["Toàn bộ thông số phần cứng cần Pebble Vina cung cấp"],
        footerGroup: "solutions",
      },
    ],
  },

  {
    key: "use-cases",
    path: "/use-cases",
    phase: "V1",
    status: "wireframe",
    objective:
      "Cho khách thấy công việc cụ thể của phòng ban mình được cải thiện thế nào.",
    audiencePrimary: "manager",
    audienceSecondary: ["coo", "ceo"],
    funnel: "consideration",
    cta: "usecase",
    questions: [
      "Phòng ban của tôi dùng được vào việc gì?",
      "Nhân viên sẽ làm việc khác đi ra sao?",
    ],
    proofNeeded: ["Mỗi use case cần một ví dụ triển khai thật"],
    gaps: ["Chỉ số hiệu quả thực tế theo từng use case"],
    inNav: true,
    children: [
      {
        key: "use-cases.customer-service",
        path: "/use-cases/customer-service",
        phase: "V2",
        status: "stub",
        objective: "Chuẩn hoá câu trả lời và rút ngắn thời gian xử lý yêu cầu khách hàng.",
        audiencePrimary: "manager",
        funnel: "consideration",
        cta: "usecase",
        questions: ["AI trả lời sai khách hàng thì sao?"],
        proofNeeded: ["Chỉ số thời gian phản hồi"],
        gaps: ["Số liệu thực tế"],
        footerGroup: "usecases",
      },
      {
        key: "use-cases.human-resources",
        path: "/use-cases/human-resources",
        phase: "V2",
        status: "stub",
        objective: "Giảm thời gian trả lời câu hỏi nội bộ và xử lý hồ sơ nhân sự.",
        audiencePrimary: "manager",
        funnel: "consideration",
        cta: "usecase",
        questions: ["Dữ liệu nhân sự nhạy cảm, kiểm soát thế nào?"],
        proofNeeded: ["Cơ chế phân quyền"],
        gaps: ["Số liệu thực tế"],
        footerGroup: "usecases",
      },
      {
        key: "use-cases.finance-accounting",
        path: "/use-cases/finance-accounting",
        phase: "V2",
        status: "stub",
        objective: "Rút ngắn khâu bóc tách chứng từ, đối chiếu và lập báo cáo định kỳ.",
        audiencePrimary: "manager",
        audienceSecondary: ["procurement"],
        funnel: "consideration",
        cta: "usecase",
        questions: ["Số liệu sai lệch thì phát hiện bằng cách nào?"],
        proofNeeded: ["Chỉ số độ chính xác"],
        gaps: ["Số liệu thực tế"],
        footerGroup: "usecases",
      },
      {
        key: "use-cases.procurement",
        path: "/use-cases/procurement",
        phase: "V2",
        status: "stub",
        objective: "Chuẩn hoá khâu so sánh báo giá, kiểm tra hồ sơ nhà cung cấp và lập báo giá.",
        audiencePrimary: "procurement",
        funnel: "consideration",
        cta: "usecase",
        questions: ["Có so sánh được các bộ hồ sơ khác định dạng không?"],
        proofNeeded: ["Ví dụ đối chiếu"],
        gaps: ["Số liệu thực tế"],
        footerGroup: "usecases",
      },
      {
        key: "use-cases.legal-compliance",
        path: "/use-cases/legal-compliance",
        phase: "V2",
        status: "stub",
        objective: "Hỗ trợ đối chiếu hợp đồng và rà soát điều khoản trước khi ký.",
        audiencePrimary: "procurement",
        funnel: "consideration",
        cta: "usecase",
        questions: ["AI bỏ sót điều khoản thì sao?"],
        proofNeeded: ["Cơ chế con người rà soát"],
        gaps: ["Số liệu thực tế"],
        footerGroup: "usecases",
      },
      {
        key: "use-cases.manufacturing",
        path: "/use-cases/manufacturing",
        phase: "V2",
        status: "stub",
        objective: "Đưa AI vào khâu kiểm tra, ghi nhận và báo cáo tại hiện trường sản xuất.",
        audiencePrimary: "coo",
        funnel: "consideration",
        cta: "usecase",
        questions: ["Có cần thay hệ thống MES không?"],
        proofNeeded: ["Ví dụ tích hợp MES"],
        gaps: ["Số liệu thực tế"],
        footerGroup: "usecases",
      },
      {
        key: "use-cases.executive-reporting",
        path: "/use-cases/executive-reporting",
        phase: "V2",
        status: "stub",
        objective: "Tự động chuẩn bị báo cáo điều hành từ dữ liệu đã có.",
        audiencePrimary: "ceo",
        funnel: "consideration",
        cta: "usecase",
        questions: ["Số liệu trong báo cáo lấy từ đâu, có kiểm chứng được không?"],
        proofNeeded: ["Sơ đồ nguồn dữ liệu"],
        gaps: ["Số liệu thực tế"],
        footerGroup: "usecases",
      },
    ],
  },

  {
    key: "how-we-deliver",
    path: "/how-we-deliver",
    phase: "V1",
    status: "wireframe",
    objective:
      "Biến quy trình triển khai thành bằng chứng về độ tin cậy và giảm rủi ro mua hàng.",
    // Đổi từ `procurement` sang `ceo` 2026-08-07 theo yêu cầu chủ dự án: content
    // phải nói thứ C-level muốn nghe. Kéo theo cả giọng trang — mỗi bước kể
    // "bạn được gì", nhãn trường ở ngôi thứ hai, và tiêu chí chuyển bước đọc
    // thành quyền dừng của bên mua chứ không phải kỷ luật của bên bán.
    // Procurement vẫn đọc được trang này, nhưng không còn là người được nhắm.
    audiencePrimary: "ceo",
    audienceSecondary: ["coo", "cio", "procurement"],
    funnel: "validation",
    cta: "assessment",
    questions: [
      "Bao lâu thì thấy kết quả?",
      "Nghiệm thu bằng gì?",
      "Pebble chịu trách nhiệm phần nào, chúng tôi phần nào?",
      "Chúng tôi cần chuẩn bị dữ liệu gì?",
    ],
    proofNeeded: ["Mẫu PoC framework", "Ma trận trách nhiệm", "Tiêu chí nghiệm thu mẫu"],
    gaps: ["Thời lượng và chi phí từng bước", "SLA phản hồi"],
    inNav: true,
    children: [
      {
        key: "how-we-deliver.assessment",
        path: "/how-we-deliver/assessment",
        phase: "V1",
        status: "wireframe",
        objective: "Giải thích rõ AI Readiness Assessment gồm gì và đầu ra là gì.",
        audiencePrimary: "ceo",
        audienceSecondary: ["coo"],
        funnel: "validation",
        cta: "assessment",
        questions: ["Assessment mất bao lâu?", "Có tính phí không?", "Ai cần tham gia?"],
        proofNeeded: ["Mẫu báo cáo assessment"],
        gaps: ["Miễn phí hay có phí", "Thời lượng chuẩn"],
      },
      {
        key: "how-we-deliver.proof-of-concept",
        path: "/how-we-deliver/proof-of-concept",
        phase: "V1",
        status: "wireframe",
        objective: "Cho thấy PoC được đóng khung bằng phạm vi, KPI và tiêu chí nghiệm thu.",
        audiencePrimary: "coo",
        audienceSecondary: ["cio", "procurement"],
        funnel: "decision",
        cta: "poc",
        questions: ["PoC thành công rồi có mở rộng được không?", "PoC thất bại thì sao?"],
        proofNeeded: ["PoC framework", "Ví dụ acceptance criteria"],
        gaps: ["Thời lượng và chi phí PoC tham khảo"],
      },
      {
        key: "how-we-deliver.governance",
        path: "/how-we-deliver/governance",
        phase: "V1",
        status: "wireframe",
        objective: "Trả lời lo ngại vận hành: ai quản, đo gì, sai thì xử lý ra sao.",
        audiencePrimary: "ciso",
        audienceSecondary: ["cio", "procurement"],
        funnel: "validation",
        cta: "architecture",
        questions: [
          "Ai vận hành sau go-live?",
          "Chi phí AI có tăng mất kiểm soát không?",
          "AI trả lời sai thì quy trình xử lý thế nào?",
        ],
        proofNeeded: ["Mô hình vận hành", "Cơ chế giám sát chi phí và chất lượng"],
        gaps: ["Năng lực support hiện có", "Mô hình vận hành sau go-live"],
      },
    ],
  },

  {
    key: "technology",
    path: "/technology",
    phase: "V1",
    status: "wireframe",
    objective:
      "Cho đội kỹ thuật thẩm định được kiến trúc, tích hợp, hạ tầng và chiều sâu phần cứng.",
    audiencePrimary: "cio",
    audienceSecondary: ["ciso"],
    funnel: "validation",
    cta: "architecture",
    questions: [
      "Kiến trúc gồm những lớp nào?",
      "Tích hợp với ERP/CRM/MES ra sao?",
      "Model chọn thế nào, đánh giá bằng gì?",
      "Triển khai được ở đâu?",
    ],
    proofNeeded: [
      "Reference architecture",
      "Ví dụ tích hợp",
      "Datasheet phần cứng có điều kiện kiểm thử",
    ],
    gaps: ["Thông số MINT/PAPAYA/ESPRESSO đã được duyệt công bố", "Benchmark kèm điều kiện đo"],
    forbidden: [
      "Trộn thông số prototype với sản phẩm thương mại",
      "Benchmark không nêu điều kiện kiểm thử",
    ],
    inNav: true,
    children: [
      {
        key: "technology.architecture",
        path: "/technology/architecture",
        phase: "V2",
        status: "stub",
        objective: "Mô tả 8 lớp kiến trúc từ quy trình nghiệp vụ xuống bán dẫn.",
        audiencePrimary: "cio",
        funnel: "validation",
        cta: "architecture",
        questions: ["Lớp nào Pebble tự làm, lớp nào dùng bên thứ ba?"],
        proofNeeded: ["Sơ đồ kiến trúc tham chiếu"],
        gaps: ["Sơ đồ chính thức"],
      },
      {
        key: "technology.data-integration",
        path: "/technology/data-integration",
        phase: "V2",
        status: "stub",
        objective: "Trả lời câu hỏi tích hợp: API, ERP, CRM, MES, identity, audit.",
        audiencePrimary: "cio",
        funnel: "validation",
        cta: "architecture",
        questions: ["Hệ thống cũ không có API thì sao?"],
        proofNeeded: ["Danh sách hệ thống đã tích hợp"],
        gaps: ["Danh sách được phép công khai"],
      },
      {
        key: "technology.models-agents",
        path: "/technology/models-agents",
        phase: "V2",
        status: "stub",
        objective: "Giải thích cách chọn model, RAG, đánh giá, guardrail và phê duyệt.",
        audiencePrimary: "cio",
        funnel: "validation",
        cta: "architecture",
        questions: ["Dùng model nào, có bị khoá nhà cung cấp không?"],
        proofNeeded: ["Phương pháp đánh giá model"],
        gaps: ["Bộ tiêu chí đánh giá nội bộ"],
      },
      {
        key: "technology.deployment-infrastructure",
        path: "/technology/deployment-infrastructure",
        phase: "V2",
        status: "stub",
        objective: "Mô tả các mô hình triển khai cloud, hybrid, on-premise, edge.",
        audiencePrimary: "ciso",
        funnel: "validation",
        cta: "architecture",
        questions: ["On-premise cần hạ tầng gì?"],
        proofNeeded: ["Yêu cầu hạ tầng tối thiểu"],
        gaps: ["Cấu hình tham chiếu"],
      },
      {
        key: "technology.edge-hardware",
        path: "/technology/edge-hardware",
        phase: "V2",
        status: "stub",
        objective: "Trình bày năng lực thiết bị và bán dẫn như chiều sâu, không như trọng tâm.",
        audiencePrimary: "cio",
        funnel: "validation",
        cta: "architecture",
        questions: ["MINT, PAPAYA, ESPRESSO khác nhau thế nào?"],
        proofNeeded: ["Datasheet", "Ảnh sản phẩm và lab"],
        gaps: ["Toàn bộ thông số cần duyệt công bố"],
      },
    ],
  },

  {
    key: "insights",
    path: "/insights",
    phase: "V2",
    status: "stub",
    objective:
      "Kéo đúng người vào site bằng nội dung giải quyết vấn đề, rồi dẫn về trang đích tương ứng.",
    audiencePrimary: "coo",
    audienceSecondary: ["ceo", "cio"],
    funnel: "awareness",
    cta: "assessment",
    questions: [
      "Vì sao mua công cụ AI rồi mà không có gì thay đổi?",
      "Nên bắt đầu từ quy trình nào?",
    ],
    proofNeeded: ["Bài viết có quan điểm, không phải tổng hợp chung chung"],
    gaps: ["Lịch xuất bản", "Người viết chịu trách nhiệm nội dung"],
    inNav: true,
    footerGroup: "company",
  },

  {
    key: "about",
    path: "/about",
    phase: "V1",
    status: "wireframe",
    objective:
      "Chứng minh Pebble đủ năng lực và trách nhiệm để đồng hành dài hạn, làm rõ quan hệ Việt Nam – Hàn Quốc.",
    audiencePrimary: "ceo",
    audienceSecondary: ["procurement", "cio"],
    funnel: "validation",
    cta: "assessment",
    questions: [
      "Công ty này là ai, ai đứng sau?",
      "Đội ngũ có đủ năng lực không?",
      "Ai chịu trách nhiệm khi triển khai?",
    ],
    proofNeeded: [
      "Hồ sơ lãnh đạo",
      "Ảnh đội ngũ và phòng lab",
      "Pháp nhân, địa chỉ, mã số thuế",
    ],
    gaps: [
      "Hồ sơ lãnh đạo và chuyên gia",
      "Ảnh thật của đội ngũ và lab",
      "Thông tin pháp nhân đầy đủ",
    ],
    forbidden: ["Mở đầu bằng lịch sử công ty"],
    inNav: true,
    footerGroup: "company",
  },

  {
    key: "case-studies",
    path: "/case-studies",
    phase: "V2",
    status: "stub",
    objective: "Chứng minh Pebble đã tạo ra kết quả đo được ở doanh nghiệp thật.",
    audiencePrimary: "ceo",
    audienceSecondary: ["coo", "procurement"],
    funnel: "validation",
    cta: "assessment",
    questions: ["Đã làm được gì cho ai?", "Kết quả đo bằng gì?"],
    proofNeeded: ["Case study có số liệu và được khách hàng cho phép công bố"],
    gaps: ["Toàn bộ case study — chưa có dữ liệu được duyệt công bố"],
    forbidden: ["Case study hư cấu", "Số liệu chưa xác minh"],
    footerGroup: "company",
  },

  {
    key: "ai-assessment",
    path: "/ai-assessment",
    phase: "V1",
    status: "wireframe",
    objective:
      "Chuyển người quan tâm thành một cơ hội bán hàng có đủ thông tin để đội Account tiếp tục.",
    audiencePrimary: "coo",
    audienceSecondary: ["ceo", "cio"],
    funnel: "decision",
    cta: "assessment",
    questions: [
      "Tôi sẽ nhận được gì?",
      "Mất bao lâu?",
      "Có tốn phí không?",
      "Tôi phải cung cấp những gì?",
    ],
    proofNeeded: ["Mô tả rõ đầu vào – đầu ra của assessment"],
    gaps: ["Miễn phí hay có phí", "SLA phản hồi", "Người nhận lead"],
    forbidden: ["Form dài ngay lần đầu", "Hỏi dữ liệu nhạy cảm qua form"],
    footerGroup: "company",
  },

  {
    key: "contact",
    path: "/contact",
    phase: "V1",
    status: "wireframe",
    objective: "Cho các vai trò khác nhau chọn đúng kiểu trao đổi họ cần.",
    audiencePrimary: "procurement",
    audienceSecondary: ["cio", "ceo"],
    funnel: "decision",
    cta: "contact",
    questions: ["Liên hệ ai?", "Bao lâu được phản hồi?", "Văn phòng ở đâu?"],
    proofNeeded: ["Thông tin pháp nhân và địa chỉ"],
    gaps: ["Địa chỉ, hotline, email chính thức", "SLA phản hồi"],
    footerGroup: "company",
  },

  {
    key: "privacy-policy",
    path: "/privacy-policy",
    phase: "V1",
    status: "stub",
    objective: "Nêu rõ dữ liệu thu thập qua website được dùng và lưu thế nào.",
    audiencePrimary: "ciso",
    funnel: "validation",
    cta: "none",
    questions: ["Thông tin tôi để lại được dùng làm gì?"],
    proofNeeded: ["Bản chính sách do bộ phận pháp chế duyệt"],
    gaps: ["Toàn bộ nội dung — cần pháp chế soạn và duyệt"],
    footerGroup: "legal",
  },

  {
    key: "terms",
    path: "/terms",
    phase: "V2",
    status: "stub",
    objective: "Điều khoản sử dụng website.",
    audiencePrimary: "procurement",
    funnel: "validation",
    cta: "none",
    questions: ["Điều kiện sử dụng nội dung trên site?"],
    proofNeeded: ["Bản điều khoản do pháp chế duyệt"],
    gaps: ["Toàn bộ nội dung — cần pháp chế soạn và duyệt"],
    footerGroup: "legal",
  },
];

/* ------------------------------------------------------------------ */
/* Tiện ích tra cứu                                                    */
/* ------------------------------------------------------------------ */

export function flattenPages(pages: PageEntry[] = PAGES): PageEntry[] {
  return pages.flatMap((p) => [p, ...flattenPages(p.children ?? [])]);
}

export const ALL_PAGES = flattenPages();

export function getPage(key: string): PageEntry | undefined {
  return ALL_PAGES.find((p) => p.key === key);
}

export function pagesByStatus(status: Status): PageEntry[] {
  return ALL_PAGES.filter((p) => p.status === status);
}

export const NAV_PAGES = PAGES.filter((p) => p.inNav);

export function footerPages(
  group: NonNullable<PageEntry["footerGroup"]>,
): PageEntry[] {
  return ALL_PAGES.filter((p) => p.footerGroup === group);
}

/** Tổng hợp mọi khoảng trống nội dung để hiển thị ở /_track */
export function allGaps(): { page: PageEntry; gap: string }[] {
  return ALL_PAGES.flatMap((page) => page.gaps.map((gap) => ({ page, gap })));
}
