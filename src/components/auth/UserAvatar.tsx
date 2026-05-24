"use client";

import { cn } from "@/lib/cn";

interface UserAvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export default function UserAvatar({ name, imageUrl, size = "sm", className }: UserAvatarProps) {
  const sizeClass = sizeClasses[size];

  if (imageUrl?.startsWith("http")) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover ring-1 ring-primary/20", sizeClass, className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary ring-1 ring-primary/20",
        sizeClass,
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
