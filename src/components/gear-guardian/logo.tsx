import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6 text-primary", className)}
      {...props}
    >
      <path d="M12 2L2 8.5V15.5L12 22L22 15.5V8.5L12 2Z" />
      <path d="M8 14l3-3 3 3" />
      <path d="M12 11v-1" />
      <path d="m8.2 11.2 1.2-3.4" />
      <path d="m14.6 7.8 1.2 3.4" />
    </svg>
  );
}
