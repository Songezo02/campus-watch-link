import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, LogOut, Users } from "lucide-react";
import { AppHeader, PhoneFrame, PriorityBadge, StatusBadge } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampus } from "@/lib/campus-store";
import { timeAgo, type OfficerStatus } from "@/lib/campus-data";
import { toast } from "sonner";

export const Route = createFileRoute("/officer/")({
  head: () => ({
    meta: [
      { title: "Officer Dashboard — Campus Security" },
      {
        name: "description",
        content: "Incoming incidents, availability status and live response management for officers.",
      },
      { property: "og:title", content: "Officer Dashboard — Campus Security" },
      { property: "og:description", content: "Accept, respond to and resolve campus incidents." },
    ],
  }),
  component: OfficerDashboard,
});

const STATUSES: OfficerStatus[] = ["Available", "Occupied", "Responding", "Off Duty"];

function OfficerDashboard() {
  const { officers, incidents, currentUser, setOfficerAvailability, advanceIncident, logout } =
    useCampus();
  const navigate = useNavigate();
  const me = officers.find((o) => o.id === currentUser?.id) ?? officers[0]!;

  const active = incidents.filter(
    (i) => !["Closed", "Resolved", "Cancelled by Reporter", "Unable to Resolve"].includes(i.status),
  );
  const emergencies = active.filter((i) => i.priority === "Critical");
  const availableOfficers = officers.filter((o) => o.availability === "Available").length;
  const incoming = active.filter((i) => !i.officerId || i.officerId === me.id);

  return (
    <PhoneFrame>
      <AppHeader
        title="Officer Dashboard"
        subtitle={`${me.fullName} · ${me.number}`}
        action={
          <button
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10"
            aria-label="Sign out"
          >
            <LogOut className="size-5" />
          </button>
        }
      />
      <div className="space-y-5 px-5 py-5 pb-10">
        <div className="surface-card flex items-center gap-3 p-4">
          <img src={me.photo} alt={me.fullName} className="size-12 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{me.fullName}</p>
            <p className="text-xs text-muted-foreground">{me.shift}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            My Availability
          </p>
          <Select
            value={me.availability}
            onValueChange={(v) => {
              setOfficerAvailability(me.id, v as OfficerStatus);
              toast.success(`Status set to ${v}`);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Active" value={active.length} tone="bg-primary-soft text-primary" />
          <Stat
            label="Emergency"
            value={emergencies.length}
            tone="bg-emergency-soft text-emergency"
          />
          <Stat
            label="Available"
            value={availableOfficers}
            tone="bg-success-soft text-success"
          />
        </div>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <AlertTriangle className="size-4" /> Incoming Incidents
          </h2>
          <div className="space-y-3">
            {incoming.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No incidents awaiting response.
              </p>
            ) : null}
            {incoming.map((i) => (
              <article key={i.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">#{i.id}</p>
                    <p className="text-sm text-muted-foreground">{i.category}</p>
                  </div>
                  <PriorityBadge priority={i.priority} />
                </div>
                <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                  <p>Reported: {timeAgo(i.reportedAt)}</p>
                  <p>Location: {i.locationName}</p>
                  <p>Reporter: {i.reporterName}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={i.status} />
                  <Link
                    to="/officer/$id"
                    params={{ id: i.id }}
                    className="text-xs font-semibold text-primary"
                  >
                    View details
                  </Link>
                </div>
                {!i.officerId ? (
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 rounded-xl"
                      onClick={() => toast("Incident declined and returned to the queue")}
                    >
                      Decline
                    </Button>
                    <Button
                      className="flex-1 rounded-xl"
                      onClick={() => {
                        advanceIncident(i.id, "Officer Assigned", me);
                        setOfficerAvailability(me.id, "Responding");
                        toast.success("Incident accepted");
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Users className="size-4" /> Officers On Duty
          </h2>
          <div className="surface-card divide-y divide-border">
            {officers.map((o) => (
              <div key={o.id} className="flex items-center gap-3 p-3">
                <img src={o.photo} alt={o.fullName} className="size-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.fullName}</p>
                  <p className="text-[11px] text-muted-foreground">{o.shift}</p>
                </div>
                <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {o.availability}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PhoneFrame>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl p-3 text-center ${tone}`}>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
    </div>
  );
}
