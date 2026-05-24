import { cn } from "@/lib/cn";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function AuthInput({ label, error, icon, className, id, ...props }: AuthInputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            "w-full rounded-lg border border-border bg-background/50 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60",
            icon ? "pl-10 pr-4" : "px-4",
            error && "border-red-500/50",
            className,
          )}
          {...props}
        />
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
