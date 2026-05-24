import {
  BookOpen,
  Globe,
  Headphones,
  Languages,
  Lock,
  Play,
  Shield,
  ShieldCheck,
  Sparkles,
  Subtitles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "/pricing" },
];

export const HERO = {
  badge: "Local AI · Privacy-first · Mac desktop app",
  titleLine1: "Watch any video",
  titleLine2: "in your language",
  subtitle:
    "Paste a YouTube link or turn a book into an audiobook. Video Translator dubs content on your Mac — private, fast, and entirely on your device.",
};

export const STATS = [
  { value: "50+", label: "Languages supported" },
  { value: "100%", label: "On-device processing" },
  { value: "24/7", label: "Works offline after setup" },
];

export const FEATURES = [
  {
    icon: Play,
    title: "Video Translate",
    description:
      "Paste any public YouTube link, pick a target language, and watch a fully dubbed version — generated locally on your Mac.",
  },
  {
    icon: BookOpen,
    title: "Audio Book Creator",
    description:
      "Upload a short voice sample and turn long-form text into a natural audiobook with expressive, cloned narration.",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    description:
      "Your videos, voice samples, and transcripts never leave your machine. No cloud uploads, no data retention.",
  },
  {
    icon: Languages,
    title: "Smart language detection",
    description:
      "Source language is detected automatically. You only choose the language you want to hear.",
  },
  {
    icon: Globe,
    title: "Natural dubbed voices",
    description:
      "High-quality voice synthesis that matches tone and pacing — so dubbed audio feels like native speech.",
  },
  {
    icon: Sparkles,
    title: "One-click workflow",
    description:
      "Simple sidebar navigation, real-time progress, and a polished player — built for creators and learners alike.",
  },
];

export const STEPS = [
  {
    icon: Play,
    title: "Paste & choose",
    description:
      "Drop in a YouTube URL or upload book text, then select your target language from the sidebar.",
    status: "default" as const,
  },
  {
    icon: Subtitles,
    title: "AI dubbing runs",
    description:
      "The app transcribes, translates, and generates dubbed audio — step by step, entirely on your Mac.",
    status: "warning" as const,
  },
  {
    icon: Headphones,
    title: "Watch or listen",
    description:
      "Preview dubbed video in-app, export transcripts, or save your audiobook — all stored locally.",
    status: "success" as const,
  },
];

export const DEMO_STAGES = [
  { label: "Fetching video", progress: 25 },
  { label: "Transcribing speech", progress: 50 },
  { label: "Translating dialogue", progress: 75 },
  { label: "Generating dubbed audio", progress: 100 },
];

export const DEMO_PIPELINE = ["Transcribe", "Translate", "Voice dub", "Sync video"];

export interface Testimonial {
  content: string;
  author: string;
  role: string;
  rating: number;
  highlight?: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    content:
      "I follow creators who only post in Korean. Video Translator lets me paste a link and watch the whole thing dubbed in English — without sending anything to the cloud.",
    author: "Sarah Kim",
    role: "Language learner",
    rating: 4.9,
    highlight: "YouTube tutorials",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    content:
      "The audiobook feature saved me weeks. I uploaded a short voice sample and turned a 200-page manuscript into listenable chapters while commuting.",
    author: "Marcus Chen",
    role: "Independent author",
    rating: 4.7,
    highlight: "Audiobook creator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    content:
      "My students watch lectures from around the world. Dubbing them locally means I don't worry about privacy or upload limits.",
    author: "Jennifer Walsh",
    role: "University lecturer",
    rating: 4.8,
    highlight: "Educational content",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    content:
      "Setup took one afternoon for the first-run download, but every video after that is straightforward. The progress UI makes long jobs feel manageable.",
    author: "David Park",
    role: "Content creator",
    rating: 4.5,
    highlight: "Long-form videos",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    content:
      "I travel often with spotty Wi‑Fi. Once models are cached, I can dub videos offline on the plane. That's a game changer for me.",
    author: "Emily Torres",
    role: "Product manager",
    rating: 4.6,
    highlight: "Offline dubbing",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    content:
      "Clean interface, clear steps, and no account required beyond activation. It feels like a proper Mac app — not a clunky web wrapper.",
    author: "Michael Thompson",
    role: "Designer",
    rating: 4.8,
    highlight: "Native Mac experience",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

export const HERO_LANGUAGES = [
  "Spanish",
  "French",
  "Japanese",
  "German",
  "Portuguese",
  "Korean",
  "Italian",
  "Arabic",
  "Hindi",
  "Chinese",
  "Russian",
  "Turkish",
];

export const HERO_HIGHLIGHTS = [
  { label: "Video Translate", desc: "Dub any YouTube link" },
  { label: "Audio Book", desc: "Text to spoken chapters" },
  { label: "100% private", desc: "Stays on your Mac" },
];

export interface TrustBadge {
  icon: LucideIcon;
  value: string;
  label: string;
}

export const TRUST_BADGES: TrustBadge[] = [
  { icon: Shield, value: "100%", label: "On-device" },
  { icon: Globe, value: "50+", label: "Languages" },
  { icon: ShieldCheck, value: "Mac", label: "Native app" },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I translate a YouTube video?",
    answer:
      "Open Video Translate, paste any public YouTube URL, choose your target language, and click Translate and Watch. The app handles the rest on your Mac.",
  },
  {
    question: "Why does the first run take longer?",
    answer:
      "On first use, AI models download to your Mac for local processing. This usually takes 5–10 minutes depending on your connection. Later runs are much faster.",
  },
  {
    question: "Do I need an internet connection?",
    answer:
      "You need internet to fetch YouTube videos and for the initial model download. After setup, dubbing runs on your machine with no cloud processing.",
  },
  {
    question: "Which YouTube links are supported?",
    answer:
      "Any public YouTube video URL works — standard watch links, youtu.be short links, embed URLs, and Shorts. Private or age-restricted videos may fail.",
  },
  {
    question: "How do I create an audiobook?",
    answer:
      "Go to Audio Book, upload a short voice sample, paste your book text, pick a language, and click Create Audiobook. Processing stays entirely on your Mac.",
  },
  {
    question: "Is my voice data sent to the cloud?",
    answer:
      "No. Voice samples, transcripts, and generated audio stay on your Mac. All processing is local.",
  },
  {
    question: "Where do I enter my product key?",
    answer:
      "Open Activation in the sidebar and enter the key from your purchase email. Once validated, all features unlock on this device.",
  },
  {
    question: "Translation failed or stuck — what should I try?",
    answer:
      "Restart the app, confirm the YouTube URL is public, and wait if first-run setup is still downloading models. Use Help Center → Contact Us if the issue persists.",
  },
];

export const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Pricing", href: "/pricing" },
      { label: "Download", href: "#download" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];
