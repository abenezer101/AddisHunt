"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/AppIcon";
import { UpvoteIcon, CommentIcon } from "@/components/Icons";

interface CommentReply {
  id: string;
  author: string;
  role?: string;
  avatar: string;
  time: string;
  content: string;
  votes: number;
  hasVoted?: boolean;
}

interface CommentItem {
  id: string;
  author: string;
  badge?: string;
  avatar: string;
  time: string;
  content: string;
  votes: number;
  hasVoted?: boolean;
  replies: CommentReply[];
}

const productData = {
  id: "1",
  name: "Tidaro",
  badge: "Free Trial",
  rating: 4.9,
  reviewsCount: 12,
  rankToday: 2,
  votes: 454,
  tagline: "The all-in-one desk booking & office management tool for hybrid teams",
  description:
    "Tidaro is built to empower the future of hybrid work. It seamlessly helps distributed companies organize office desk sharing, manage meeting rooms, track parking spaces, and coordinate team schedules across different locations.",
  websiteUrl: "https://tidaro.io",
  category: "Productivity",
  tags: ["Free", "SaaS", "Software Engineering", "Developer Tools", "Hybrid Work"],
  slides: [
    {
      id: 1,
      title: "Takata Workspace Hub",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCc_ilBidrsf3xEc0mzfIHSbzECMhOyipuPld9CxrwAwr8ZgpRLAbU2AJDVS7YJAgw6eSUNMelInTmDaSNnK7_m3OIiS03TEc1OTumF7BEOwVIQGJA3L8hlsYekh3WFv8aBSea0NY3WmAi5v_3CKOy-NU9iHll7bQQlFkIvaPdrEqWYAx_cMITNba5iTzix1IE0n_Fb_ZBAo1v6P_CO9ZF1Io0u9ezX08NaLI5XstC5kjQdkbXgbjPxg",
    },
    {
      id: 2,
      title: "AI Campaigns & Analytics",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV8dAZxSjB0_k6FxPBcKx-i1bFGBvBgH-VxvF101IsVQY53ROrbRL9oCV_zAljnR1WTJHA5Hib7HaX_ZYoiqawbIZCBag4oDjvcmFMZo9YhccI1KkqF7kQQWb_0_Km_6uP4rUT1P1NA__WxqHi8RLExHHHsQecMDcSU8weFk1Lq0K8lQufWnDvFKs-eMVcOluGJ4bBpzIGqemnMkuV00horjA4I1w8akM0nfJSokfdQzodDoWwddd30Q",
    },
    {
      id: 3,
      title: "Interactive Office Floor Map",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzFioUa1w4vCX613GjHL2xq7FBa-QU6kZUuoO6hw8svyRaUF8I9H1nsBT9L2PEiw_8I3iEilENX02PMwAug8dfjBu0qhu2YNHxf4jrUhwBuFb9v1g0YpVjfUGniukXEMeEbUC_HWTyOCUuCKnSTiuf3CsgrwZHVRdJC0-JgaDwYtV1cu6-RpZYgAgG3BcqV7hhSfEQmrEy5um617O9MMycn0KYqjb50GZ5qOTRK9L9cYtNYRPNaj_2kg",
    },
  ],
  followers: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASkejkm_RALXraxM_9_3WbHOFOnB16ngIVNiRvHrn6zS6gLuooNvYSm_E5vVGJTiIgpTnBhNx4hlZknhRG_ixx_O2zadRvkfGetqrXXm9MuBCYkgCv4neR5R3ZHoSBAtymHPDPeIahTjkyNEcLnUvwnEgU4cVeC_i1SXZ9ujeCT0q99tqIQmG_Bqwm8hmezAYYFYgYW29ZrGXvtd1Sw2dpRgz6vfFEnetQyruKk-QDttxbFNNnrtN1TQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA07SWhATHGJPX7dl3U6vqZ74PcV2Wdfy_w0jUdoQvxtlXwk8xT1GXKKxCCYCWQ-HeyEDMMVnH0gU4edpEzoeYJgaVtdBHDuKb4JkqSy1ClQUYMeaZtwPDHYnQhEg5_uzMf0SGYPPW2GOOiInQPhywAlG1JCuQwoqRfbjOb8SW0kSg4j49_GoYH6xolG4t51E4Ekv9XT2cLMJAMhuhtecsDhZW-0aE_4VyEN_N6k9WPyyrGDNPHDVyyAA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBiv3kKzCMFbHiwgZJu0ZM3Vh39Z3jk1fegoIvkCmn34M14k9mH6J9Utg-dFAne03GKoQ9-5abUbS_h9MLNxostpAkyiXGB5Y6e6B-kVPdP_C0BzN__pdoVzTyfC7CqMUO_Q49rPPLZ0l175sgQa5LQJKuleRHBu5v6p0EtVHJjML48ziLGYp10lRySogFVsBVyc1xzF8xxH1BrC69srXAAJoXCDNfr7P-mAn5KuSoyzJ5bAKd5RHrQOg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCSvdU_5rF4FNwUcQkiXWz79WI2-UbuTsiFyl1eeAZu3Yl7zGJjeW2XkHMD35QDXvG4Z0jJGct7aWWHHZWWBdQjqspomQdNeISLvoElngfzTELxHd1Pas5mBPhXJlA7k-jfh0qzHN1HCruDOglKzeVfg3PiqPRCVVVWOAIW3Fy56urUCwfelMRGqCsCpEll8o9Z6-JzhQkUhJKV_bve_ILFZyQ8hbUuZJswF9RnNOfy7NWdR19Q66oYFw",
  ],
  makers: [
    {
      name: "Tal Zalcman",
      role: "Maker",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASkejkm_RALXraxM_9_3WbHOFOnB16ngIVNiRvHrn6zS6gLuooNvYSm_E5vVGJTiIgpTnBhNx4hlZknhRG_ixx_O2zadRvkfGetqrXXm9MuBCYkgCv4neR5R3ZHoSBAtymHPDPeIahTjkyNEcLnUvwnEgU4cVeC_i1SXZ9ujeCT0q99tqIQmG_Bqwm8hmezAYYFYgYW29ZrGXvtd1Sw2dpRgz6vfFEnetQyruKk-QDttxbFNNnrtN1TQ",
      twitter: "@talzalcman",
    },
    {
      name: "Sarah J.",
      role: "CTO",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA07SWhATHGJPX7dl3U6vqZ74PcV2Wdfy_w0jUdoQvxtlXwk8xT1GXKKxCCYCWQ-HeyEDMMVnH0gU4edpEzoeYJgaVtdBHDuKb4JkqSy1ClQUYMeaZtwPDHYnQhEg5_uzMf0SGYPPW2GOOiInQPhywAlG1JCuQwoqRfbjOb8SW0kSg4j49_GoYH6xolG4t51E4Ekv9XT2cLMJAMhuhtecsDhZW-0aE_4VyEN_N6k9WPyyrGDNPHDVyyAA",
      twitter: "@sarah_j_tech",
    },
  ],
  similarProducts: [
    {
      id: "deskflow",
      name: "DeskFlow",
      tagline: "Smart office space optimizer for agile teams",
      votes: 312,
      category: "Productivity",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMONhfLZ1yo3Bmq6uUIzqneAOPWirGjx0Pk8DnFwJysEVDCsTs75vG4DSG7OV5TqtjzPZRI-O36Nghf1R0nJkknNPSGf_uVAKmJJpc0PZLIO-qPJdrKY5RlzNEQRrMw6onZMl0J4xB3VZuWfLym9ISTcogo0wr_j3eNxsea0rghn-D3uuwxixD1JELn9YjnJ0DVum6RcdySoWbbyBaB_WHsU0gCSBHqnGVMVZHR8YmGa7Dib5clYVrA",
    },
    {
      id: "paystream",
      name: "PayStream Africa",
      tagline: "Seamless cross-border payments for African businesses",
      votes: 432,
      category: "Fintech",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1PLNEZWQ8-qSHyZ3Mk61jod-CZlGQk6-UM1kDhhSiKGOn6Jkn4Q1WldxbtmIN-kiORhMUF1Tl0deg4pZ012woozhZ5yMQit-l3gUfJ93ZUbfeaKH6x1MJvFAtmeJsB8uuZJiu75I0Nwi6WF4N61v6OKsHqEdvJdfyDuryY4iwQpggTi-u0ptuNUzoPJEADDXym6pxhpUI-GjoviIBwGPKE1rPlIvGrj5c22-Do75WlcRqxGpn8XBM6A",
    },
    {
      id: "farmsense",
      name: "FarmSense AI",
      tagline: "AI crop yield prediction from soil telemetry",
      votes: 289,
      category: "Agritech",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYLxPRPK1JHxdvSZ0LAwHA05SPWjesTi3js_C_x_i0cJ6w61Utr35xuPb0brDEF5zURCTvvfMR7O0DYMTlO_hmyO67iUp7IP6ti4ZQXw9STWrMXcKz-MCLy3ka4pkFe3h4MFDFsKWTYyC99YAgNS4_UzyrAUHvsTs516I4yQiF3tphATghvmyMG9RyS3oT9sTVYaeFW3ia-9_NVs3CbtbO6Vk7ji7Q3nkjPhCE0VNltOvSjYeq9bJlTg",
    },
    {
      id: "deliverease",
      name: "DeliverEase",
      tagline: "Logistics orchestration for informal addresses",
      votes: 215,
      category: "Logistics",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVfP6Xgr5gjeZ6hTXUihw9ET8OvlKWYClM-UirkaPbtjCUwFLM_jPWox6bd-A8QXtHBbbI0TMpUsOairuw6VDqPm-dvG4W70KXh5F9qB1dgsOdE3O-yUkLgc90rDYlWMYJ7onvsxvYIvtDF421w4SfPeeJGQn0bz5kdA5nKwg_khIGpAVTwdAbd3ZZuOR_VX2yz-uol-Hc0MbyVhfDbfr4utB8Y6TiDezH1FXA0IDViM-KzbeuUdfhtQ",
    },
  ],
};

const initialComments: CommentItem[] = [
  {
    id: "c1",
    author: "Ashley Jenkins",
    badge: "Hunter",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiv3kKzCMFbHiwgZJu0ZM3Vh39Z3jk1fegoIvkCmn34M14k9mH6J9Utg-dFAne03GKoQ9-5abUbS_h9MLNxostpAkyiXGB5Y6e6B-kVPdP_C0BzN__pdoVzTyfC7CqMUO_Q49rPPLZ0l175sgQa5LQJKuleRHBu5v6p0EtVHJjML48ziLGYp10lRySogFVsBVyc1xzF8xxH1BrC69srXAAJoXCDNfr7P-mAn5KuSoyzJ5bAKd5RHrQOg",
    time: "12h ago",
    content:
      "Congrats on the launch! What inspired you to build this for hybrid teams? Any plans for Google Calendar & Slack integration?",
    votes: 18,
    hasVoted: false,
    replies: [
      {
        id: "r1-1",
        author: "Tal Zalcman",
        role: "Maker",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASkejkm_RALXraxM_9_3WbHOFOnB16ngIVNiRvHrn6zS6gLuooNvYSm_E5vVGJTiIgpTnBhNx4hlZknhRG_ixx_O2zadRvkfGetqrXXm9MuBCYkgCv4neR5R3ZHoSBAtymHPDPeIahTjkyNEcLnUvwnEgU4cVeC_i1SXZ9ujeCT0q99tqIQmG_Bqwm8hmezAYYFYgYW29ZrGXvtd1Sw2dpRgz6vfFEnetQyruKk-QDttxbFNNnrtN1TQ",
        time: "11h ago",
        content:
          "Thanks Ashley! We actually have native Google Calendar and Outlook live in this version. Slack notifications are also live in our update!",
        votes: 14,
        hasVoted: false,
      },
      {
        id: "r1-2",
        author: "Sarah J.",
        role: "Maker",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA07SWhATHGJPX7dl3U6vqZ74PcV2Wdfy_w0jUdoQvxtlXwk8xT1GXKKxCCYCWQ-HeyEDMMVnH0gU4edpEzoeYJgaVtdBHDuKb4JkqSy1ClQUYMeaZtwPDHYnQhEg5_uzMf0SGYPPW2GOOiInQPhywAlG1JCuQwoqRfbjOb8SW0kSg4j49_GoYH6xolG4t51E4Ekv9XT2cLMJAMhuhtecsDhZW-0aE_4VyEN_N6k9WPyyrGDNPHDVyyAA",
        time: "9h ago",
        content: "Feel free to test out our free tier and let us know your team's feedback!",
        votes: 8,
        hasVoted: false,
      },
    ],
  },
  {
    id: "c2",
    author: "Jonathan Or",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSvdU_5rF4FNwUcQkiXWz79WI2-UbuTsiFyl1eeAZu3Yl7zGJjeW2XkHMD35QDXvG4Z0jJGct7aWWHHZWWBdQjqspomQdNeISLvoElngfzTELxHd1Pas5mBPhXJlA7k-jfh0qzHN1HCruDOglKzeVfg3PiqPRCVVVWOAIW3Fy56urUCwfelMRGqCsCpEll8o9Z6-JzhQkUhJKV_bve_ILFZyQ8hbUuZJswF9RnNOfy7NWdR19Q66oYFw",
    time: "10h ago",
    content: "Clean design! How does pricing scale for small startups under 20 employees?",
    votes: 9,
    hasVoted: false,
    replies: [
      {
        id: "r2-1",
        author: "Tal Zalcman",
        role: "Maker",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASkejkm_RALXraxM_9_3WbHOFOnB16ngIVNiRvHrn6zS6gLuooNvYSm_E5vVGJTiIgpTnBhNx4hlZknhRG_ixx_O2zadRvkfGetqrXXm9MuBCYkgCv4neR5R3ZHoSBAtymHPDPeIahTjkyNEcLnUvwnEgU4cVeC_i1SXZ9ujeCT0q99tqIQmG_Bqwm8hmezAYYFYgYW29ZrGXvtd1Sw2dpRgz6vfFEnetQyruKk-QDttxbFNNnrtN1TQ",
        time: "9h ago",
        content: "We offer a 100% free plan for up to 10 users forever!",
        votes: 11,
        hasVoted: false,
      },
    ],
  },
  {
    id: "c3",
    author: "Aref Vatan",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6g2KOpeRxsUiHvu0gwgNa-NJ1P3WVGB0FUlRWDRGDO7BaGID4NtNEIYTiO0ny83byVnXZDLij4jcpVl8bQQIbO0tloWRrjpP8adMe1ieB3B-smHy3SNHALIvqwVF_VOqnMOU9Y9wyO4341btodxveQEdGdZjuDV0xZKDmzuFfaKPvIAhibRCuez9RIGBgnS5lTYOj9vyHZ82MAyFKJJMGd1TnH6L1dznnLl5fRhaowkw6b_hYX0BigQ",
    time: "7h ago",
    content: "Love the desk booking visual map. Upvoted! 🚀",
    votes: 12,
    hasVoted: false,
    replies: [],
  },
  {
    id: "c4",
    author: "Tom Savor",
    badge: "Maker",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA07SWhATHGJPX7dl3U6vqZ74PcV2Wdfy_w0jUdoQvxtlXwk8xT1GXKKxCCYCWQ-HeyEDMMVnH0gU4edpEzoeYJgaVtdBHDuKb4JkqSy1ClQUYMeaZtwPDHYnQhEg5_uzMf0SGYPPW2GOOiInQPhywAlG1JCuQwoqRfbjOb8SW0kSg4j49_GoYH6xolG4t51E4Ekv9XT2cLMJAMhuhtecsDhZW-0aE_4VyEN_N6k9WPyyrGDNPHDVyyAA",
    time: "6h ago",
    content:
      "Hey community! We're thrilled to introduce Tidaro to you all. Our team is in the comments all day to answer your questions and take feature requests.",
    votes: 24,
    hasVoted: false,
    replies: [],
  },
  {
    id: "c5",
    author: "John Vinson",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLrb7iwcR8lKhS15WG9Awf4ykGekpmrxRCVV6WXzQnX5FRrOf7tVWhu0rSia5Q1rb4ALTJu8yARD-7r_v0Vfszj_mAzTib-DPscznVd1Nz96UTycXefdE_oBZSHyuYD7Tz19mg5go0avc3yKllM4JOc1M5Lu5AJ-tNrc9YEYPB8KZEy9lmVGWCJpFvgpO3A9BweTPaFWi09Km9yDw1Jcw4Ve_Lpfqq3f_cdYg3R9fs0o720qtA6wF70g",
    time: "4h ago",
    content: "Upvoted! Curious about data residency options in Africa and EMEA?",
    votes: 6,
    hasVoted: false,
    replies: [
      {
        id: "r5-1",
        author: "Tal Zalcman",
        role: "Maker",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASkejkm_RALXraxM_9_3WbHOFOnB16ngIVNiRvHrn6zS6gLuooNvYSm_E5vVGJTiIgpTnBhNx4hlZknhRG_ixx_O2zadRvkfGetqrXXm9MuBCYkgCv4neR5R3ZHoSBAtymHPDPeIahTjkyNEcLnUvwnEgU4cVeC_i1SXZ9ujeCT0q99tqIQmG_Bqwm8hmezAYYFYgYW29ZrGXvtd1Sw2dpRgz6vfFEnetQyruKk-QDttxbFNNnrtN1TQ",
        time: "3h ago",
        content: "Yes! We support regional data residency across EMEA and African cloud regions.",
        votes: 5,
        hasVoted: false,
      },
    ],
  },
];

export default function ProductDetailPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasMainVoted, setHasMainVoted] = useState(false);
  const [mainVotes, setMainVotes] = useState(productData.votes);
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleMainVote = () => {
    setHasMainVoted(!hasMainVoted);
    setMainVotes(hasMainVoted ? mainVotes - 1 : mainVotes + 1);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productData.slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + productData.slides.length) % productData.slides.length);
  };

  const handleCommentVote = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const voted = !c.hasVoted;
          return { ...c, hasVoted: voted, votes: voted ? c.votes + 1 : c.votes - 1 };
        }
        return c;
      })
    );
  };

  const handleReplyVote = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === replyId) {
                const voted = !r.hasVoted;
                return { ...r, hasVoted: voted, votes: voted ? r.votes + 1 : r.votes - 1 };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: "Kalkidan T.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCSvdU_5rF4FNwUcQkiXWz79WI2-UbuTsiFyl1eeAZu3Yl7zGJjeW2XkHMD35QDXvG4Z0jJGct7aWWHHZWWBdQjqspomQdNeISLvoElngfzTELxHd1Pas5mBPhXJlA7k-jfh0qzHN1HCruDOglKzeVfg3PiqPRCVVVWOAIW3Fy56urUCwfelMRGqCsCpEll8o9Z6-JzhQkUhJKV_bve_ILFZyQ8hbUuZJswF9RnNOfy7NWdR19Q66oYFw",
      time: "Just now",
      content: newCommentText.trim(),
      votes: 1,
      hasVoted: true,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: CommentReply = {
      id: `r-${Date.now()}`,
      author: "Kalkidan T.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCSvdU_5rF4FNwUcQkiXWz79WI2-UbuTsiFyl1eeAZu3Yl7zGJjeW2XkHMD35QDXvG4Z0jJGct7aWWHHZWWBdQjqspomQdNeISLvoElngfzTELxHd1Pas5mBPhXJlA7k-jfh0qzHN1HCruDOglKzeVfg3PiqPRCVVVWOAIW3Fy56urUCwfelMRGqCsCpEll8o9Z6-JzhQkUhJKV_bve_ILFZyQ8hbUuZJswF9RnNOfy7NWdR19Q66oYFw",
      time: "Just now",
      content: replyText.trim(),
      votes: 1,
      hasVoted: true,
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return { ...c, replies: [...c.replies, newReply] };
        }
        return c;
      })
    );
    setReplyText("");
    setActiveReplyId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)] font-body antialiased">
      <Header />

      <main className="flex-grow w-full max-w-[1240px] mx-auto px-6 py-8">
        {/* Top Product Header Row matching Screenshot */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
            {/* App Icon */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[var(--border)] shrink-0 bg-[#5A3896] flex items-center justify-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-2xl font-display">
                ✦
              </div>
            </div>

            {/* Title & Tagline & Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink-900)] tracking-tight">
                  {productData.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FFEDEA] text-[#FF6154] border border-[#FF6154]/20">
                  {productData.badge}
                </span>
              </div>

              <p className="text-sm sm:text-base text-[var(--ink-700)] mt-1 font-normal leading-relaxed">
                {productData.tagline}
              </p>

              {/* Rating & Reviews & Categories */}
              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-[var(--ink-500)]">
                <div className="flex items-center gap-1 font-semibold text-[#D97706]">
                  <span>★★★★★</span>
                  <span className="text-[var(--ink-900)] font-bold">{productData.rating}</span>
                  <span className="text-[var(--ink-500)] font-normal">({productData.reviewsCount} reviews)</span>
                </div>
                <span>·</span>
                <span className="hover:text-[var(--ink-900)] transition-colors cursor-pointer">Desk Booking</span>
                <span>·</span>
                <span className="hover:text-[var(--ink-900)] transition-colors cursor-pointer">Hybrid Work</span>
                <span>·</span>
                <span className="hover:text-[var(--ink-900)] transition-colors cursor-pointer">Office Management</span>
              </div>
            </div>
          </div>

          {/* Top Right Action: Visit Website */}
          <div className="shrink-0 w-full sm:w-auto flex items-center gap-3">
            <a
              href={productData.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-50)] hover:bg-[var(--surface-100)] text-xs sm:text-sm font-bold font-display text-[var(--ink-900)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Visit website</span>
              <Icon icon="solar:export-linear" className="text-base text-[var(--ink-500)]" />
            </a>
          </div>
        </div>

        {/* Short Description */}
        <div className="py-4 text-xs sm:text-sm text-[var(--ink-700)] leading-relaxed max-w-4xl">
          {productData.description}
        </div>

        {/* Media / Carousel Preview Section matching Screenshot */}
        <div className="space-y-4 mb-8">
          <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-50)] p-4 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Card 1: Brand slide */}
              <div className="md:col-span-6 aspect-[16/10] rounded-xl overflow-hidden bg-[#53457B] text-white p-6 flex flex-col justify-between relative shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight">✦ Takata</span>
                </div>
                <div className="text-xl font-bold font-display leading-tight max-w-xs">
                  Smart office & desk booking for hybrid teams
                </div>
                <div className="text-xs text-white/70">
                  Slide {currentSlide + 1} of {productData.slides.length}
                </div>
              </div>

              {/* Card 2: AI Analytics Dashboard Preview */}
              <div className="md:col-span-5 aspect-[16/10] rounded-xl overflow-hidden bg-[#E2E8D8] text-[#2C3E2D] p-5 flex flex-col justify-between relative shadow-sm">
                <div className="font-bold text-sm">✦ Takata</div>
                <div className="space-y-2">
                  <div className="text-lg font-bold leading-tight">
                    Desk AI Campaigns & Analytics
                  </div>
                  <div className="p-3 bg-white/70 rounded-lg text-xs font-mono space-y-1 text-gray-800">
                    <div>✓ 84% desk occupancy rate</div>
                    <div>✓ Automated QR check-in enabled</div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-600">Real-time floor telemetry</div>
              </div>

              {/* Card 3: Next peek & Arrow */}
              <div className="hidden md:flex md:col-span-1 items-center justify-center">
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-11 h-11 rounded-full bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--surface-100)] text-[var(--ink-900)] flex items-center justify-center shadow-sm cursor-pointer transition-all hover:scale-105"
                  aria-label="Next preview"
                >
                  <Icon icon="solar:alt-arrow-right-linear" className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Pagination */}
          <div className="flex items-center justify-center gap-1.5">
            {productData.slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  currentSlide === idx ? "w-6 bg-[var(--ink-900)]" : "w-2 bg-[var(--border)] hover:bg-[var(--ink-300)]"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Category Tag Chips Row */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs font-bold text-[var(--ink-500)] mr-1">Tags:</span>
            {productData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface-50)] hover:bg-[var(--surface-100)] border border-[var(--border)] text-[var(--ink-700)] transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Follow Bar matching Screenshot */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface-50)] border border-[var(--border)] flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                {productData.followers.map((avatar, i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--bg)] overflow-hidden border border-[var(--border)]"
                  >
                    <Image src={avatar} alt="Follower" width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-[var(--ink-700)]">
                Leave a Review / Follow
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isFollowing
                    ? "bg-[var(--ink-900)] text-[var(--bg)]"
                    : "border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--surface-100)]"
                }`}
              >
                <Icon icon={isFollowing ? "solar:check-circle-bold" : "solar:add-circle-linear"} className="text-sm" />
                {isFollowing ? "Following" : "Follow +"}
              </button>
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-xs font-bold border border-[var(--border)] bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--surface-100)] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Icon icon="solar:star-linear" className="text-sm" />
                Review +
              </button>
            </div>
          </div>
        </div>

        {/* Main Content (2 Columns Layout - 8 cols / 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Discussions & Comments (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-[var(--ink-900)] tracking-tight flex items-center gap-2">
                <span>Discussion</span>
                <span className="text-xs font-normal text-[var(--ink-500)] bg-[var(--surface-50)] px-2.5 py-0.5 rounded-full border border-[var(--border)] font-mono">
                  {comments.length}
                </span>
              </h2>

              <div className="flex items-center gap-2 text-xs text-[var(--ink-500)]">
                <span className="font-semibold text-[var(--ink-900)] cursor-pointer">Top</span>
                <span>•</span>
                <span className="hover:text-[var(--ink-900)] cursor-pointer">Newest</span>
              </div>
            </div>

            {/* "What do you think?" Comment Input Box */}
            <form
              onSubmit={handlePostComment}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] space-y-3 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSvdU_5rF4FNwUcQkiXWz79WI2-UbuTsiFyl1eeAZu3Yl7zGJjeW2XkHMD35QDXvG4Z0jJGct7aWWHHZWWBdQjqspomQdNeISLvoElngfzTELxHd1Pas5mBPhXJlA7k-jfh0qzHN1HCruDOglKzeVfg3PiqPRCVVVWOAIW3Fy56urUCwfelMRGqCsCpEll8o9Z6-JzhQkUhJKV_bve_ILFZyQ8hbUuZJswF9RnNOfy7NWdR19Q66oYFw"
                    alt="Current user"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="What do you think of this product?"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--ink-900)] placeholder-[var(--ink-400)] focus:outline-none focus:border-[var(--ink-900)] resize-none h-20 transition-all font-body"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-[var(--ink-500)] text-sm">
                  <button type="button" className="p-1 rounded hover:bg-[var(--surface-100)] cursor-pointer" title="Bold">
                    <Icon icon="solar:text-bold-linear" />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-[var(--surface-100)] cursor-pointer" title="Italic">
                    <Icon icon="solar:text-italic-linear" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-5 py-2 bg-[var(--ink-900)] text-[var(--bg)] disabled:opacity-40 rounded-full text-xs font-bold font-display hover:opacity-90 transition-all cursor-pointer"
                >
                  Comment
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-6 pt-2">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3 pb-6 border-b border-[var(--border)] last:border-b-0">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] shrink-0 mt-0.5">
                      <Image
                        src={comment.avatar}
                        alt={comment.author}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold font-display text-[var(--ink-900)]">
                          {comment.author}
                        </span>
                        {comment.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FFEDEA] text-[#FF6154] border border-[#FF6154]/20">
                            {comment.badge}
                          </span>
                        )}
                        <span className="text-xs text-[var(--ink-500)]">• {comment.time}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 text-xs font-medium text-[var(--ink-500)] pt-2.5">
                        <button
                          type="button"
                          onClick={() => handleCommentVote(comment.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                            comment.hasVoted
                              ? "bg-[var(--ink-900)] text-[var(--bg)] font-bold"
                              : "hover:bg-[var(--surface-50)] text-[var(--ink-700)] border border-[var(--border)]"
                          }`}
                        >
                          <UpvoteIcon filled={comment.hasVoted} className="text-xs" />
                          <span>Upvote ({comment.votes})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                          className="hover:text-[var(--ink-900)] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Icon icon="solar:reply-linear" />
                          <span>Reply</span>
                        </button>

                        <button
                          type="button"
                          className="hover:text-[var(--ink-900)] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Icon icon="solar:share-linear" />
                          <span>Share</span>
                        </button>
                      </div>

                      {/* Reply Box */}
                      {activeReplyId === comment.id && (
                        <div className="mt-3 p-3 rounded-xl bg-[var(--surface-50)] border border-[var(--border)] space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.author}...`}
                            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--ink-900)] focus:outline-none focus:border-[var(--ink-900)] resize-none h-16 font-body"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReplyId(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1 rounded-md text-xs font-medium text-[var(--ink-500)] hover:bg-[var(--surface-100)] cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePostReply(comment.id)}
                              disabled={!replyText.trim()}
                              className="px-4 py-1 rounded-md bg-[var(--ink-900)] text-[var(--bg)] text-xs font-bold disabled:opacity-50 cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 sm:ml-10 pl-4 border-l-2 border-[var(--border)] space-y-4 pt-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border)] shrink-0 mt-0.5">
                            <Image
                              src={reply.avatar}
                              alt={reply.author}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold font-display text-[var(--ink-900)]">
                                {reply.author}
                              </span>
                              {reply.role && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                  {reply.role}
                                </span>
                              )}
                              <span className="text-xs text-[var(--ink-500)]">• {reply.time}</span>
                            </div>

                            <p className="text-xs sm:text-sm text-[var(--ink-700)] mt-1 leading-relaxed">
                              {reply.content}
                            </p>

                            <div className="flex items-center gap-3 text-xs font-medium text-[var(--ink-500)] pt-2">
                              <button
                                type="button"
                                onClick={() => handleReplyVote(comment.id, reply.id)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                                  reply.hasVoted
                                    ? "bg-[var(--ink-900)] text-[var(--bg)] font-bold"
                                    : "hover:bg-[var(--surface-50)] text-[var(--ink-700)] border border-[var(--border)]"
                                }`}
                              >
                                <UpvoteIcon filled={reply.hasVoted} className="text-[10px]" />
                                <span>{reply.votes}</span>
                              </button>
                              <span className="text-[var(--ink-400)]">•</span>
                              <button
                                type="button"
                                onClick={() => setActiveReplyId(comment.id)}
                                className="hover:text-[var(--ink-900)] cursor-pointer"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[var(--ink-900)] text-[var(--bg)] font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--ink-700)] hover:bg-[var(--surface-50)] font-medium text-xs flex items-center justify-center cursor-pointer"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--ink-700)] hover:bg-[var(--surface-50)] font-medium text-xs flex items-center justify-center cursor-pointer"
              >
                3
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--ink-700)] hover:bg-[var(--surface-50)] text-xs flex items-center justify-center cursor-pointer"
              >
                <Icon icon="solar:alt-arrow-right-linear" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Launchers Today Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-50)] p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[var(--ink-500)] uppercase tracking-wider">
                    Launchers Today
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-display text-[var(--ink-900)]">
                      #{productData.rankToday}
                    </span>
                    <span className="text-xs text-[var(--ink-500)] font-medium">Rank</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg p-1">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-[var(--surface-50)] text-[var(--ink-700)] cursor-pointer"
                    title="Previous"
                  >
                    <Icon icon="solar:alt-arrow-left-linear" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-[var(--surface-50)] text-[var(--ink-700)] cursor-pointer"
                    title="Next"
                  >
                    <Icon icon="solar:alt-arrow-right-linear" />
                  </button>
                </div>
              </div>

              {/* Large Product Hunt Red Upvote Button matching Screenshot */}
              <button
                type="button"
                onClick={handleMainVote}
                className="w-full py-3.5 rounded-xl font-bold font-display text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 duration-150 bg-[#FF6154] hover:bg-[#FF4F40] text-white cursor-pointer"
              >
                <UpvoteIcon
                  filled={hasMainVoted}
                  className="text-lg"
                />
                <span>UPVOTE ({mainVotes})</span>
              </button>
            </div>

            {/* 2. Company Info Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-500)] font-display">
                Company Info
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[var(--ink-700)]">
                  <span className="flex items-center gap-2 text-[var(--ink-500)]">
                    <Icon icon="solar:global-linear" className="text-sm" /> Website
                  </span>
                  <a
                    href={productData.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--ink-900)] hover:underline cursor-pointer"
                  >
                    tidaro.io
                  </a>
                </div>

                <div className="flex items-center justify-between text-[var(--ink-700)]">
                  <span className="flex items-center gap-2 text-[var(--ink-500)]">
                    <Icon icon="solar:map-point-linear" className="text-sm" /> Location
                  </span>
                  <span className="font-medium text-[var(--ink-900)]">Addis Ababa</span>
                </div>

                <div className="flex items-center justify-between text-[var(--ink-700)]">
                  <span className="flex items-center gap-2 text-[var(--ink-500)]">
                    <Icon icon="solar:calendar-linear" className="text-sm" /> Launched
                  </span>
                  <span className="font-medium text-[var(--ink-900)]">2024</span>
                </div>

                <div className="flex items-center justify-between text-[var(--ink-700)]">
                  <span className="flex items-center gap-2 text-[var(--ink-500)]">
                    <Icon icon="solar:tag-price-linear" className="text-sm" /> Pricing
                  </span>
                  <span className="font-semibold text-[var(--ink-900)]">Free Trial / SaaS</span>
                </div>
              </div>
            </div>

            {/* 3. Team / Makers Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-500)] font-display">
                Team & Makers
              </h3>

              <div className="space-y-3">
                {productData.makers.map((maker) => (
                  <div key={maker.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
                        <Image
                          src={maker.avatar}
                          alt={maker.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold font-display text-[var(--ink-900)]">{maker.name}</div>
                        <div className="text-[10px] text-[var(--ink-500)]">{maker.role}</div>
                      </div>
                    </div>

                    <a
                      href={`https://twitter.com/${maker.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:bg-[var(--surface-50)] transition-colors cursor-pointer"
                      aria-label={`${maker.name} on X`}
                    >
                      <Icon icon="ri:twitter-x-fill" className="text-xs" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Similar Products Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-500)] font-display">
                  Similar Products
                </h3>
                <Link href="/categories" className="text-[11px] font-semibold text-[var(--ink-900)] hover:underline cursor-pointer">
                  View all
                </Link>
              </div>

              <div className="space-y-3.5">
                {productData.similarProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/1`}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--surface-50)] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-50)]">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-display text-[var(--ink-900)] group-hover:underline truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[var(--ink-500)] truncate">{item.tagline}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[11px] font-bold text-[var(--ink-700)] shrink-0 group-hover:border-[var(--ink-900)]">
                      <UpvoteIcon className="text-xs" />
                      {item.votes}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}