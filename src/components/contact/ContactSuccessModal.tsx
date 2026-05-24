"use client";

import { Send } from "lucide-react";
import AppModal from "@/components/ui/AppModal";

interface ContactSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onSendAnother: () => void;
}

export default function ContactSuccessModal({
  open,
  onClose,
  onSendAnother,
}: ContactSuccessModalProps) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Message sent!"
      titleId="contact-success-title"
      description="Thank you for contacting us. We'll get back to you within 24–48 hours."
      icon={<Send className="h-7 w-7" />}
      iconClassName="bg-success/15 text-success"
      actions={[
        { label: "Back to home", href: "/", variant: "primary" },
        { label: "Send another message", onClick: onSendAnother, variant: "secondary" },
      ]}
    />
  );
}
