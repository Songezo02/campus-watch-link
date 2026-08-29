import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  Info,
  Phone,
  ShieldQuestion,
  Siren,
  ClipboardList,
} from "lucide-react";
import {
  AppHeader,
  BottomNav,
  MapPreview,
  NotificationBell,
  PhoneFrame,
  PriorityBadge,
  StatusBadge,
} from "@/components/campus/shell";
import { useCampus } from "@/lib/campus-store";
import { formatDateTime } from "@/lib/campus-data";

export const Route = createFileRoute("/resident")({
  head: () => ({
    meta: [
      { title: "Resident Dashboard — Campus Security" },
      {
        name: "description",
        content:
          "Emergency SOS, incident reporting, and live tracking of your campus security reports.",
      },
      { property: "og:title", content: "Resident Dashboard — Campus Security" },
      {
        property: "og:description",
        content: "Report an incident or trigger emergency assistance from your campus dashboard.",
      },
    ],
  }),
  component: ResidentDashboard,
});

const actions = [
  { to: "/report", label: "Report Incident", icon: FileText, tone: "bg-primary-soft text-primary" },
  { to: "/reports", label: "My Reports", icon: ClipboardList, tone: "bg-info-soft text-info" },
  { to: "/notifications", label: "Notifications", icon: Bell, tone: "bg-warning-soft text-warning-foreground" },
  { to: "/contacts", label: "Emergency Contacts", icon: Phone, tone: "bg-emergency-soft text-emergency" },
  { to: "/safety", label: "Safety Tips", icon: ShieldQuestion, tone: "bg-success-soft text-success" },
  { to: "/about", label: "About", icon: Info, tone: "bg-muted text-muted-foreground" },
] as const;

function ResidentDashboard() {
  const { currentUser, incidents, notifications } = useCampus();
  const user = currentUser;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const mine = incidents.filter((i) => i.reporterId === user?.id);
  const active = mine.find(
    (i) => !["Closed", "Resolved", "Cancelled by Reporter"].includes(i.status),
  );
  const unread = notifications.filter((n) => n.userId === user?.id && !n.read).length;

  return (
    <PhoneFrame>
      <AppHeader
        title={`${greeting}, ${user?.fullName ?? "Resident"}`}
        subtitle={user?.number ?? ""}
        action={<NotificationBell count={unread} />}
      />
      <div className="space-y-6 px-5 pb-8 pt-5">
        <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
          <img
            src={user?.photo}
            alt={user?.fullName ?? "Profile"}
            className="size-12 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Link
          to="/sos"
          className="pulse-emergency flex flex-col items-center rounded-3xl bg-emergency px-6 py-8 text-emergency-foreground shadow-[var(--shadow-emergency)] transition-transform active:scale-[0.98]"
        >
          <Siren className="size-12" />
          <span className="mt-3 text-2xl font-extrabold tracking-wide">EMERGENCY</span>
          <span className="mt-1 text-xs opacity-90">Tap for immediate security assistance</span>
        </Link>

        {active ? (
          <section className="surface-card overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Active Report
              </p>
              <StatusBadge status={active.status} />
            </div>
            <div className="px-4 pb-4 pt-2">
              <p className="text-base font-bold">#{active.id}</p>
              <p className="text-sm text-muted-foreground">{active.category}</p>
              <div className="mt-2 flex items-center gap-2">
                <PriorityBadge priority={active.priority} />
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(active.reportedAt)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Location: {active.locationName}
                {active.officerName ? ` · Officer ${active.officerName}` : " · Awaiting assignment"}
              </p>
              <MapPreview
                lat={active.lat}
                lng={active.lng}
                label={active.locationName}
                className="mt-3 h-32"
              />
              <Link
                to="/reports/$id"
                params={{ id: active.id }}
                className="mt-3 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Track Report
              </Link>
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {actions.map(({ to, label, icon: Icon, tone }) => (
              <Link
                key={to}
                to={to}
                className="surface-card flex flex-col gap-3 p-4 transition-transform active:scale-[0.98]"
              >
                <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
