export type ProductStatus = "live" | "pending" | "scheduled" | "rejected" | "hidden"
export type UserRole = "maker" | "hunter" | "admin" | "moderator"
export type CommentStatus = "visible" | "flagged" | "hidden"

export type Product = {
  id: string
  name: string
  slug: string
  tagline: string
  category: string
  tags: string[]
  votes: number
  comments: number
  rank?: number
  status: ProductStatus
  featured: boolean
  promoted: boolean
  maker: string
  hunter: string
  launchDate: string
  website: string
  initials: string
  accent: string
}

export type AdminUser = {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  products: number
  upvotes: number
  joined: string
  location: string
  initials: string
}

export type Category = {
  id: string
  name: string
  slug: string
  products: number
  featured: boolean
  description: string
}

export type AdminComment = {
  id: string
  author: string
  product: string
  body: string
  votes: number
  time: string
  status: CommentStatus
  reason?: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Tidaro",
    slug: "tidaro",
    tagline: "Desk booking & office management for hybrid teams",
    category: "Productivity",
    tags: ["Hybrid Work", "Desk Booking", "SaaS"],
    votes: 454,
    comments: 48,
    rank: 1,
    status: "live",
    featured: true,
    promoted: true,
    maker: "Tal Zalcman",
    hunter: "Kalkidan T.",
    launchDate: "2026-09-10",
    website: "https://tidaro.io",
    initials: "T",
    accent: "#5A3896",
  },
  {
    id: "2",
    name: "PayStream Africa",
    slug: "paystream-africa",
    tagline: "Cross-border payments for modern African businesses",
    category: "Fintech",
    tags: ["Payments", "API", "B2B"],
    votes: 432,
    comments: 31,
    rank: 2,
    status: "live",
    featured: true,
    promoted: false,
    maker: "Amara Okonkwo",
    hunter: "Yonas Bekele",
    launchDate: "2026-09-10",
    website: "https://paystream.africa",
    initials: "P",
    accent: "#0F766E",
  },
  {
    id: "3",
    name: "FarmSense AI",
    slug: "farmsense-ai",
    tagline: "Crop yield predictions from local soil telemetry",
    category: "Agritech",
    tags: ["AI", "Agritech", "Sensors"],
    votes: 289,
    comments: 26,
    rank: 3,
    status: "live",
    featured: false,
    promoted: false,
    maker: "Liya Tesfaye",
    hunter: "Hana Worku",
    launchDate: "2026-09-10",
    website: "https://farmsense.ai",
    initials: "F",
    accent: "#3F6212",
  },
  {
    id: "4",
    name: "Interactive Sessions",
    slug: "interactive-sessions",
    tagline: "Drive the full SDLC with AI agents, step by step",
    category: "Developer Tools",
    tags: ["AI", "Software Engineering"],
    votes: 238,
    comments: 83,
    rank: 4,
    status: "live",
    featured: false,
    promoted: false,
    maker: "Daniel Mekonnen",
    hunter: "Sara Ahmed",
    launchDate: "2026-09-10",
    website: "https://interactivesessions.dev",
    initials: "I",
    accent: "#1E3A5F",
  },
  {
    id: "5",
    name: "AfroPulse AI",
    slug: "afropulse-ai",
    tagline: "Voice-first support in Amharic, Oromo, Swahili & English",
    category: "AI & ML",
    tags: ["AI", "Voice", "Customer Support"],
    votes: 0,
    comments: 0,
    status: "pending",
    featured: false,
    promoted: false,
    maker: "Selamawit Girma",
    hunter: "Selamawit Girma",
    launchDate: "2026-09-11",
    website: "https://afropulse.ai",
    initials: "A",
    accent: "#C2410C",
  },
  {
    id: "6",
    name: "DeliverEase",
    slug: "deliverease",
    tagline: "Last-mile logistics for informal address systems",
    category: "Logistics",
    tags: ["Logistics", "Last-mile"],
    votes: 0,
    comments: 0,
    status: "scheduled",
    featured: false,
    promoted: false,
    maker: "Kwame Mensah",
    hunter: "Betty Tadesse",
    launchDate: "2026-09-12",
    website: "https://deliverease.app",
    initials: "D",
    accent: "#9A3412",
  },
  {
    id: "7",
    name: "Injera Cloud",
    slug: "injera-cloud",
    tagline: "Serverless compute billed in ETB with local regions",
    category: "Developer Tools",
    tags: ["Cloud", "Infra"],
    votes: 12,
    comments: 4,
    status: "rejected",
    featured: false,
    promoted: false,
    maker: "Robel Assefa",
    hunter: "Robel Assefa",
    launchDate: "2026-09-09",
    website: "https://injera.cloud",
    initials: "IC",
    accent: "#44403C",
  },
  {
    id: "8",
    name: "Qene Health",
    slug: "qene-health",
    tagline: "Clinic queueing and e-prescriptions for Addis hospitals",
    category: "Healthtech",
    tags: ["Health", "Clinics"],
    votes: 0,
    comments: 0,
    status: "pending",
    featured: false,
    promoted: false,
    maker: "Dr. Helen Desta",
    hunter: "Meron Alemu",
    launchDate: "2026-09-11",
    website: "https://qene.health",
    initials: "Q",
    accent: "#0E7490",
  },
]

export const users: AdminUser[] = [
  {
    id: "u1",
    name: "Kalkidan Tadesse",
    username: "kalkidandesigns",
    email: "kalkidan@addishunt.com",
    role: "admin",
    products: 2,
    upvotes: 1840,
    joined: "Jan 2026",
    location: "Addis Ababa",
    initials: "KT",
  },
  {
    id: "u2",
    name: "Tal Zalcman",
    username: "talzalcman",
    email: "tal@tidaro.io",
    role: "maker",
    products: 1,
    upvotes: 312,
    joined: "Mar 2026",
    location: "Addis Ababa",
    initials: "TZ",
  },
  {
    id: "u3",
    name: "Amara Okonkwo",
    username: "amaraok",
    email: "amara@paystream.africa",
    role: "maker",
    products: 1,
    upvotes: 890,
    joined: "Feb 2026",
    location: "Lagos",
    initials: "AO",
  },
  {
    id: "u4",
    name: "Yonas Bekele",
    username: "yonasb",
    email: "yonas@hunter.et",
    role: "hunter",
    products: 0,
    upvotes: 2401,
    joined: "Dec 2025",
    location: "Addis Ababa",
    initials: "YB",
  },
  {
    id: "u5",
    name: "Liya Tesfaye",
    username: "liya_agri",
    email: "liya@farmsense.ai",
    role: "maker",
    products: 1,
    upvotes: 156,
    joined: "Apr 2026",
    location: "Bahir Dar",
    initials: "LT",
  },
  {
    id: "u6",
    name: "Hana Worku",
    username: "hanaw",
    email: "hana@addishunt.com",
    role: "moderator",
    products: 0,
    upvotes: 620,
    joined: "Jan 2026",
    location: "Addis Ababa",
    initials: "HW",
  },
  {
    id: "u7",
    name: "Selamawit Girma",
    username: "selam_ai",
    email: "selam@afropulse.ai",
    role: "maker",
    products: 1,
    upvotes: 44,
    joined: "Aug 2026",
    location: "Addis Ababa",
    initials: "SG",
  },
  {
    id: "u8",
    name: "Sara Ahmed",
    username: "saraahmed",
    email: "sara@nairobi.dev",
    role: "hunter",
    products: 0,
    upvotes: 1102,
    joined: "May 2026",
    location: "Nairobi",
    initials: "SA",
  },
]

export const categories: Category[] = [
  { id: "c1", name: "Fintech", slug: "fintech", products: 42, featured: true, description: "Payments, banking, and money movement" },
  { id: "c2", name: "AI & ML", slug: "ai-ml", products: 28, featured: true, description: "Models, agents, and language tools" },
  { id: "c3", name: "Developer Tools", slug: "developer-tools", products: 19, featured: true, description: "Build, ship, and observe software" },
  { id: "c4", name: "Agritech", slug: "agritech", products: 14, featured: false, description: "Farms, soil, and climate intelligence" },
  { id: "c5", name: "Productivity", slug: "productivity", products: 33, featured: true, description: "Work, teams, and operations" },
  { id: "c6", name: "Healthtech", slug: "healthtech", products: 11, featured: false, description: "Clinics, insurance, and care" },
  { id: "c7", name: "Logistics", slug: "logistics", products: 9, featured: false, description: "Delivery, freight, and last mile" },
  { id: "c8", name: "Edtech", slug: "edtech", products: 16, featured: false, description: "Learning for schools and makers" },
  { id: "c9", name: "E-commerce", slug: "e-commerce", products: 21, featured: false, description: "Stores, marketplaces, and retail" },
  { id: "c10", name: "Clean Energy", slug: "clean-energy", products: 7, featured: false, description: "Solar, grid, and climate tech" },
]

export const comments: AdminComment[] = [
  {
    id: "cm1",
    author: "Ashley Jenkins",
    product: "Tidaro",
    body: "Congrats on the launch! Any plans for Google Calendar & Slack integration?",
    votes: 18,
    time: "12h ago",
    status: "visible",
  },
  {
    id: "cm2",
    author: "Jonathan Or",
    product: "Tidaro",
    body: "Clean design! How does pricing scale for small startups under 20 employees?",
    votes: 9,
    time: "10h ago",
    status: "visible",
  },
  {
    id: "cm3",
    author: "spam_bot_92",
    product: "PayStream Africa",
    body: "Buy cheap followers at bit.ly/not-real-promo — limited time!!!!",
    votes: 0,
    time: "3h ago",
    status: "flagged",
    reason: "Spam / outbound link",
  },
  {
    id: "cm4",
    author: "Aref Vatan",
    product: "Tidaro",
    body: "Love the desk booking visual map. Upvoted! 🚀",
    votes: 12,
    time: "7h ago",
    status: "visible",
  },
  {
    id: "cm5",
    author: "anon_hunter",
    product: "FarmSense AI",
    body: "This is a scam, they stole the idea from CropX. Don't upvote.",
    votes: 2,
    time: "1h ago",
    status: "flagged",
    reason: "Harassment / accusation",
  },
  {
    id: "cm6",
    author: "Tom Savor",
    product: "Interactive Sessions",
    body: "We're in the comments all day — drop feature requests.",
    votes: 24,
    time: "6h ago",
    status: "visible",
  },
]

export const kpis = {
  liveToday: 4,
  pendingReview: 2,
  upvotesToday: 1413,
  newHunters: 86,
  liveDelta: "+2 vs yesterday",
  pendingDelta: "Needs review before 12:01 AM EAT",
  upvoteDelta: "+19% vs last Thursday",
  hunterDelta: "+12 this hour",
}

export type AdPlacement = "promoted-top" | "homepage-banner" | "newsletter" | "category-rail"
export type AdStatus = "live" | "scheduled" | "paused" | "ended" | "pending"

export type AdSlot = {
  id: AdPlacement
  name: string
  where: string
  capacity: number
  filled: number
  rate: string
  rateUsd: number
  period: "day" | "week"
  description: string
}

export type AdCampaign = {
  id: string
  advertiser: string
  product: string
  placement: AdPlacement
  status: AdStatus
  start: string
  end: string
  dailyRateUsd: number
  impressions: number
  clicks: number
  destination: string
  creative: string
  initials: string
  accent: string
  contact: string
}

export const adSlots: AdSlot[] = [
  {
    id: "promoted-top",
    name: "Promoted top placement",
    where: "Homepage · #1 product card",
    capacity: 1,
    filled: 1,
    rate: "ETB 11,500 / day",
    rateUsd: 199,
    period: "day",
    description: "Pin a product at the top of today’s hunt with a Promoted badge.",
  },
  {
    id: "homepage-banner",
    name: "Homepage banner",
    where: "Feed · below today’s list",
    capacity: 1,
    filled: 1,
    rate: "ETB 20,200 / day",
    rateUsd: 349,
    period: "day",
    description: "Full-width creative under Top Products Launching Today.",
  },
  {
    id: "newsletter",
    name: "Newsletter sponsorship",
    where: "Thursday digest · 42k hunters",
    capacity: 1,
    filled: 0,
    rate: "ETB 28,900 / week",
    rateUsd: 499,
    period: "week",
    description: "One primary sponsor in the weekly Addis Hunt email.",
  },
  {
    id: "category-rail",
    name: "Category rail",
    where: "Best Products dropdown",
    capacity: 2,
    filled: 1,
    rate: "ETB 4,600 / day",
    rateUsd: 79,
    period: "day",
    description: "Sponsored chip in Fintech, AI, or Developer Tools.",
  },
]

export const adCampaigns: AdCampaign[] = [
  {
    id: "ad1",
    advertiser: "Tidaro",
    product: "Tidaro",
    placement: "promoted-top",
    status: "live",
    start: "2026-09-08",
    end: "2026-09-14",
    dailyRateUsd: 199,
    impressions: 18420,
    clicks: 612,
    destination: "https://tidaro.io/?ref=addishunt",
    creative: "Promoted badge + rank-1 card",
    initials: "T",
    accent: "#5A3896",
    contact: "tal@tidaro.io",
  },
  {
    id: "ad2",
    advertiser: "Prepl",
    product: "Prepl Launch",
    placement: "homepage-banner",
    status: "live",
    start: "2026-09-09",
    end: "2026-09-16",
    dailyRateUsd: 349,
    impressions: 22104,
    clicks: 891,
    destination: "https://link.prepl.me/74FF",
    creative: "prepl-launch-banner.webp",
    initials: "P",
    accent: "#1A1815",
    contact: "ads@prepl.me",
  },
  {
    id: "ad3",
    advertiser: "PayStream Africa",
    product: "PayStream Africa",
    placement: "newsletter",
    status: "scheduled",
    start: "2026-09-17",
    end: "2026-09-17",
    dailyRateUsd: 499,
    impressions: 0,
    clicks: 0,
    destination: "https://paystream.africa",
    creative: "Newsletter hero · cross-border payments",
    initials: "P",
    accent: "#0F766E",
    contact: "amara@paystream.africa",
  },
  {
    id: "ad4",
    advertiser: "AfroPulse AI",
    product: "AfroPulse AI",
    placement: "promoted-top",
    status: "pending",
    start: "2026-09-15",
    end: "2026-09-21",
    dailyRateUsd: 199,
    impressions: 0,
    clicks: 0,
    destination: "https://afropulse.ai",
    creative: "Voice-first multilingual support",
    initials: "A",
    accent: "#C2410C",
    contact: "selam@afropulse.ai",
  },
  {
    id: "ad5",
    advertiser: "FarmSense AI",
    product: "FarmSense AI",
    placement: "category-rail",
    status: "live",
    start: "2026-09-10",
    end: "2026-09-24",
    dailyRateUsd: 79,
    impressions: 6402,
    clicks: 188,
    destination: "https://farmsense.ai",
    creative: "Agritech chip · Best Products",
    initials: "F",
    accent: "#3F6212",
    contact: "liya@farmsense.ai",
  },
  {
    id: "ad6",
    advertiser: "Qene Health",
    product: "Qene Health",
    placement: "homepage-banner",
    status: "paused",
    start: "2026-09-01",
    end: "2026-09-30",
    dailyRateUsd: 349,
    impressions: 9100,
    clicks: 140,
    destination: "https://qene.health",
    creative: "Clinic queueing for Addis hospitals",
    initials: "Q",
    accent: "#0E7490",
    contact: "helen@qene.health",
  },
  {
    id: "ad7",
    advertiser: "Injera Cloud",
    product: "Injera Cloud",
    placement: "newsletter",
    status: "ended",
    start: "2026-08-20",
    end: "2026-08-27",
    dailyRateUsd: 499,
    impressions: 38400,
    clicks: 420,
    destination: "https://injera.cloud",
    creative: "Compute billed in ETB",
    initials: "IC",
    accent: "#44403C",
    contact: "robel@injera.cloud",
  },
]

export const placementLabel: Record<AdPlacement, string> = {
  "promoted-top": "Promoted top",
  "homepage-banner": "Homepage banner",
  newsletter: "Newsletter",
  "category-rail": "Category rail",
}
