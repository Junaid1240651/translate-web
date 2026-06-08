export const CONTACT_REASONS = [
  { value: "general", label: "General Inquiry", icon: "message" },
  { value: "support", label: "Technical Support", icon: "help" },
  { value: "bug", label: "Report a Bug", icon: "bug" },
  { value: "feature", label: "Feature Request", icon: "lightbulb" },
] as const;

export const SUPPORT_EMAIL = "notification@schedley.com";

export type ContactReason = (typeof CONTACT_REASONS)[number]["value"];
