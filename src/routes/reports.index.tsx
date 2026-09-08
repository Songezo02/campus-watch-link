import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, BottomNav, PhoneFrame, PriorityBadge, StatusBadge } from "@/components/campus/shell";
import { useCampus } from "@/lib/campus-store";
import { formatDateTime } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "My Reports — Campus Security" },
      { name: "description", content: "Track all your submitted campus security incident reports." },
      { property: "og:title", content: "My Reports — Campus Security" },
      { property: "og:description", content: "Active, resolved and cancelled incident reports." },
    ],
  }),
  component: MyReports,
});

const TABS = ["All", "Active", "Resolved", "Cancelled"] as const;

function MyReports() {
  const { incidents, currentUser } = useCampus();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const mine = incidents.filter((i) => i.reporterId === currentUser?.id);
  const filtered = mine.filter((i) => {
    if (tab === "All") return true;
    if (tab === "Resolved") return i.status === "Resolved" || i.status === "Closed";
    if (tab === "Cancelled") return i.status === "Cancelled by Reporter";
    return !["Resolved", "Closed", "Cancelled by Reporter"].includes(i.status);
  });

  return (
    <PhoneFrame>
      <AppHeader title="My Reports" back="/resident" />
      <div className="px-5 py-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No reports here yet.</p>
          ) : null}
          {filtered.map((i) => (
            <Link
              key={i.id}
              to="/reports/$id"
              params={{ id: i.id }}
              className="surface-card block p-4 transition-transform active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">#{i.id}</p>
                  <p className="text-sm text-muted-foreground">{i.category}</p>
                </div>
                <StatusBadge status={i.status} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Location: {i.locationName}</p>
              <div className="mt-3 flex items-center justify-between">
                <PriorityBadge priority={i.priority} />
                <span className="text-[11px] text-muted-foreground">
                  {formatDateTime(i.reportedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
