import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, Bell, Home, FileText, Siren, Phone, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { IncidentStatus, Priority } from "@/lib/campus-data";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary py-0 md:py-8">
      <div className="mx-auto w-full max-w-md bg-background shadow-[var(--shadow-float)] md:min-h-[860px] md:rounded-[2.5rem] md:border md:border-border md:p-0 md:overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function AppHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
      {back ? (
        <Link
          to={back}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
          aria-label="Go back"
        >
          <ChevronLeft className="size-5" />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="truncate text-xs opacity-75">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

const priorityStyles: Record<Priority, string> = {
  Critical: "bg-emergency-soft text-emergency",
  High: "bg-warning-soft text-warning-foreground",
  Medium: "bg-info-soft text-info",
  Low: "bg-muted text-muted-foreground",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        priorityStyles[priority],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const tone =
    status === "Resolved" || status === "Closed"
      ? "bg-success-soft text-success"
      : status === "Cancelled by Reporter" || status === "Unable to Resolve"
        ? "bg-muted text-muted-foreground"
        : status === "Responding" || status === "Arrived"
          ? "bg-warning-soft text-warning-foreground"
          : "bg-primary-soft text-primary";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", tone)}>{status}</span>
  );
}

export function MapPreview({
  lat,
  lng,
  label,
  className,
}: {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-primary-soft",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24px, oklch(0.29 0.078 261 / 0.12) 25px), linear-gradient(90deg, transparent 24px, oklch(0.29 0.078 261 / 0.12) 25px)",
          backgroundSize: "25px 25px",
        }}
      />
      <div className="absolute left-6 top-8 h-3 w-28 rounded-full bg-primary/15" />
      <div className="absolute bottom-10 right-8 h-16 w-20 rounded-lg bg-primary/10" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="block size-4 rounded-full bg-emergency ring-4 ring-emergency/25" />
      </div>
      <div className="relative flex h-full flex-col justify-end p-3">
        <div className="rounded-xl bg-card/90 px-3 py-2 backdrop-blur">
          <p className="text-xs font-semibold text-foreground">{label}</p>
          <p className="text-[11px] text-muted-foreground">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}

const residentNav = [
  { to: "/resident", label: "Home", icon: Home },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/sos", label: "SOS", icon: Siren, emphasis: true },
  { to: "/contacts", label: "Contacts", icon: Phone },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-5 items-end border-t border-border bg-card px-2 pb-3 pt-2">
      {residentNav.map(({ to, label, icon: Icon, emphasis }) => {
        const active = pathname === to;
        if (emphasis) {
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 text-[11px] font-semibold text-emergency"
            >
              <span className="-mt-6 flex size-14 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-[var(--shadow-emergency)]">
                <Icon className="size-6" />
              </span>
              {label}
            </Link>
          );
        }
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function NotificationBell({ count }: { count: number }) {
  return (
    <Link
      to="/notifications"
      className="relative flex size-9 items-center justify-center rounded-full bg-primary-foreground/10"
      aria-label="Notifications"
    >
      <Bell className="size-5" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-emergency text-[10px] font-bold text-emergency-foreground">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export function Timeline({
  history,
  current,
}: {
  history: { status: string; at: string }[];
  current: string;
}) {
  const steps = ["Reported", "Received", "Officer Assigned", "Responding", "Arrived", "Resolved", "Closed"];
  const currentIdx = steps.indexOf(current);
  return (
    <ol className="space-y-0">
      {steps.map((step, idx) => {
        const done = currentIdx > idx;
        const isCurrent = currentIdx === idx;
        const entry = history.find((h) => h.status === step);
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                  done
                    ? "border-success bg-success text-success-foreground"
                    : isCurrent
                      ? "border-warning bg-warning text-warning-foreground"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? "✓" : isCurrent ? "●" : ""}
              </span>
              {idx < steps.length - 1 ? (
                <span className={cn("w-0.5 flex-1", done ? "bg-success" : "bg-border")} />
              ) : null}
            </div>
            <div className="pb-5">
              <p
                className={cn(
                  "text-sm font-semibold",
                  isCurrent ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry
                  ? new Date(entry.at).toLocaleString("en-ZA", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : done
                    ? "Completed"
                    : isCurrent
                      ? "In progress"
                      : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
