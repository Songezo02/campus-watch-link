import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bell, CheckCircle2, Info, Siren } from "lucide-react";
import { AppHeader, BottomNav, PhoneFrame } from "@/components/campus/shell";
import { useCampus } from "@/lib/campus-store";
import { timeAgo } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Campus Security" },
      { name: "description", content: "Real-time updates on your campus security incident reports." },
      { property: "og:title", content: "Notifications — Campus Security" },
      { property: "og:description", content: "Assignment, response and resolution alerts." },
    ],
  }),
  component: Notifications,
});

const icons = { info: Info, success: CheckCircle2, emergency: Siren, warning: Bell };
const tones = {
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  emergency: "bg-emergency-soft text-emergency",
  warning: "bg-warning-soft text-warning-foreground",
};

function Notifications() {
  const { notifications, currentUser, markNotificationsRead } = useCampus();
  const mine = notifications.filter((n) => n.userId === currentUser?.id);

  useEffect(() => {
    const t = setTimeout(markNotificationsRead, 1200);
    return () => clearTimeout(t);
  }, [markNotificationsRead]);

  return (
    <PhoneFrame>
      <AppHeader title="Notifications" back="/resident" />
      <div className="space-y-3 px-5 py-5">
        {mine.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No notifications yet.</p>
        ) : null}
        {mine.map((n) => {
          const Icon = icons[n.tone];
          return (
            <article
              key={n.id}
              className={cn(
                "surface-card flex gap-3 p-4",
                !n.read && "border-l-4 border-primary",
              )}
            >
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tones[n.tone])}>
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read ? <span className="ml-auto mt-1 size-2 shrink-0 rounded-full bg-emergency" /> : null}
            </article>
          );
        })}
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
