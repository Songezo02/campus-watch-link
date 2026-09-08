import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, ShieldCheck, XCircle } from "lucide-react";
import {
  AppHeader,
  BottomNav,
  MapPreview,
  PhoneFrame,
  PriorityBadge,
  StatusBadge,
  Timeline,
} from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampus } from "@/lib/campus-store";
import { formatDateTime, responseGrade, responseMinutes } from "@/lib/campus-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reports/$id")({
  head: () => ({
    meta: [
      { title: "Report Details — Campus Security" },
      {
        name: "description",
        content: "Full incident details, response timeline, assigned officer and resolution report.",
      },
      { property: "og:title", content: "Report Details — Campus Security" },
      { property: "og:description", content: "Track your incident through the response workflow." },
    ],
  }),
  component: ReportDetails,
});

const REASONS = [
  "Report submitted by mistake",
  "Situation resolved",
  "No longer require assistance",
  "Other",
];

function ReportDetails() {
  const { id } = useParams({ from: "/reports/$id" });
  const navigate = useNavigate();
  const { incidents, officers, cancelIncident } = useCampus();
  const incident = incidents.find((i) => i.id === id);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState(REASONS[0]!);

  if (!incident) {
    return (
      <PhoneFrame>
        <AppHeader title="Report Details" back="/reports" />
        <p className="p-8 text-center text-sm text-muted-foreground">Report not found.</p>
      </PhoneFrame>
    );
  }

  const officer = officers.find((o) => o.id === incident.officerId);
  const mins = responseMinutes(incident);
  const grade = responseGrade(mins);
  const canCancel = !["Resolved", "Closed", "Cancelled by Reporter", "Unable to Resolve"].includes(
    incident.status,
  );

  return (
    <PhoneFrame>
      <AppHeader title={`#${incident.id}`} subtitle={incident.category} back="/reports" />
      <div className="space-y-5 px-5 py-5">
        <section className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <PriorityBadge priority={incident.priority} />
            <StatusBadge status={incident.status} />
          </div>
          <p className="text-sm">{incident.description}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Info label="Reported" value={formatDateTime(incident.reportedAt)} />
            <Info label="Location" value={incident.locationName} />
            <Info label="Coordinates" value={`${incident.lat.toFixed(4)}, ${incident.lng.toFixed(4)}`} />
            <Info label="Evidence" value={`${incident.evidence.length} item(s)`} />
          </div>
          <MapPreview
            lat={incident.lat}
            lng={incident.lng}
            label={incident.locationName}
            className="h-36"
          />
        </section>

        <section className="surface-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Incident Status
          </h2>
          <Timeline history={incident.history} current={incident.status} />
        </section>

        {officer ? (
          <section className="surface-card p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Assigned Officer
            </h2>
            <div className="flex items-center gap-3">
              <img src={officer.photo} alt={officer.fullName} className="size-12 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{officer.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {officer.availability} · Assigned {formatDateTime(incident.assignedAt)}
                </p>
              </div>
              <ShieldCheck className="ml-auto size-5 text-primary" />
            </div>
          </section>
        ) : null}

        <section className="surface-card flex items-center gap-3 p-4">
          <Clock className="size-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">
              {mins === null ? "Awaiting officer arrival" : `Officer responded in ${mins} minutes.`}
            </p>
            <p className="text-xs text-muted-foreground">Response performance: {grade.label}</p>
          </div>
        </section>

        {incident.resolution ? (
          <section className="surface-card space-y-2 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Resolution
            </h2>
            <Info label="Outcome" value={incident.resolution.outcome} />
            <Info label="What happened" value={incident.resolution.whatHappened} />
            <Info label="Action taken" value={incident.resolution.actionTaken} />
            <Info label="Attended" value={formatDateTime(incident.resolution.attendedAt)} />
          </section>
        ) : null}

        {incident.cancelReason ? (
          <p className="rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
            Cancelled by reporter — {incident.cancelReason}
          </p>
        ) : null}

        {canCancel ? (
          cancelling ? (
            <div className="surface-card space-y-3 border-2 border-emergency p-4">
              <p className="text-sm font-semibold">Cancel Incident Report</p>
              {incident.officerId ? (
                <p className="text-xs text-warning-foreground">
                  An officer has already been dispatched. Cancelling will notify {incident.officerName}.
                </p>
              ) : null}
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setCancelling(false)}>
                  Keep Report
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    cancelIncident(incident.id, reason);
                    toast("Report cancelled by reporter");
                    navigate({ to: "/reports" });
                  }}
                >
                  Confirm Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl text-emergency"
              onClick={() => setCancelling(true)}
            >
              <XCircle className="size-4" /> Cancel Incident Report
            </Button>
          )
        ) : null}
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
