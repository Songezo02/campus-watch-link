import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation, Phone, User } from "lucide-react";
import {
  AppHeader,
  MapPreview,
  PhoneFrame,
  PriorityBadge,
  StatusBadge,
  Timeline,
} from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampus } from "@/lib/campus-store";
import { formatDateTime, type Resolution } from "@/lib/campus-data";
import { toast } from "sonner";

export const Route = createFileRoute("/officer/$id")({
  head: () => ({
    meta: [
      { title: "Incident Detail — Officer | Campus Security" },
      {
        name: "description",
        content: "Officer view of an incident: reporter details, location, workflow and resolution.",
      },
      { property: "og:title", content: "Incident Detail — Officer | Campus Security" },
      { property: "og:description", content: "Respond to and resolve an assigned campus incident." },
    ],
  }),
  component: OfficerIncident,
});

const OUTCOMES: Resolution["outcome"][] = [
  "Resolved",
  "Unable to Resolve",
  "False Alarm",
  "Escalated",
  "Other",
];

function OfficerIncident() {
  const { id } = useParams({ from: "/officer/$id" });
  const navigate = useNavigate();
  const { incidents, officers, currentUser, advanceIncident, resolveIncident } = useCampus();
  const incident = incidents.find((i) => i.id === id);
  const me = officers.find((o) => o.id === currentUser?.id) ?? officers[0]!;

  const [outcome, setOutcome] = useState<Resolution["outcome"]>("Resolved");
  const [whatHappened, setWhatHappened] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);

  if (!incident) {
    return (
      <PhoneFrame>
        <AppHeader title="Incident" back="/officer" />
        <p className="p-8 text-center text-sm text-muted-foreground">Incident not found.</p>
      </PhoneFrame>
    );
  }

  const reporterHistory = incidents.filter(
    (i) => i.reporterId === incident.reporterId && i.id !== incident.id,
  );

  return (
    <PhoneFrame>
      <AppHeader title={`#${incident.id}`} subtitle={incident.category} back="/officer" />
      <div className="space-y-5 px-5 py-5 pb-10">
        <section className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <PriorityBadge priority={incident.priority} />
            <StatusBadge status={incident.status} />
          </div>
          <p className="text-sm">{incident.description}</p>
          <p className="text-xs text-muted-foreground">
            Reported {formatDateTime(incident.reportedAt)}
          </p>
        </section>

        <section className="surface-card p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <User className="size-4" /> Reporter Information
          </h2>
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{incident.reporterName}</p>
            <p className="text-xs text-muted-foreground">Number: {incident.reporterNumber}</p>
            <p className="text-xs text-muted-foreground">Gender: {incident.reporterGender}</p>
            <a
              href={`tel:${incident.reporterPhone.replace(/\s/g, "")}`}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              <Phone className="size-4" /> Call {incident.reporterPhone}
            </a>
          </div>
          {reporterHistory.length ? (
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Previous reports
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {reporterHistory.map((h) => (
                  <li key={h.id}>
                    #{h.id} · {h.category} · {h.status} · {formatDateTime(h.reportedAt)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="surface-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Location
          </h2>
          <p className="text-sm font-medium">{incident.locationName}</p>
          <p className="text-xs text-muted-foreground">
            {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
          </p>
          <MapPreview
            lat={incident.lat}
            lng={incident.lng}
            label={incident.locationName}
            className="mt-3 h-40"
          />
          <Button
            variant="secondary"
            className="mt-3 h-11 w-full rounded-xl"
            onClick={() => toast("Opening turn-by-turn navigation")}
          >
            <Navigation className="size-4" /> Navigate to Location
          </Button>
        </section>

        <section className="surface-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Response Workflow
          </h2>
          <Timeline history={incident.history} current={incident.status} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                advanceIncident(incident.id, "Responding", me);
                toast.success("Status: Responding");
              }}
            >
              Start Responding
            </Button>
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                advanceIncident(incident.id, "Arrived", me);
                toast.success("Marked as arrived");
              }}
            >
              Mark Arrived
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast.warning("Incident escalated to the control room")}
            >
              Escalate
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                advanceIncident(incident.id, "Closed", me);
                toast.success("Incident closed");
              }}
            >
              Close Incident
            </Button>
          </div>
        </section>

        {showForm ? (
          <section className="surface-card space-y-3 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Resolution Report
            </h2>
            <div className="space-y-1.5">
              <Label>Outcome</Label>
              <Select value={outcome} onValueChange={(v) => setOutcome(v as Resolution["outcome"])}>
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTCOMES.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Area label="What Happened?" value={whatHappened} onChange={setWhatHappened} />
            <Area label="Action Taken" value={actionTaken} onChange={setActionTaken} />
            <Area label="Resolution" value={description} onChange={setDescription} />
            <Area label="Additional Notes (optional)" value={notes} onChange={setNotes} />
            <p className="text-xs text-muted-foreground">
              Date and time attended is captured automatically.
            </p>
            <Button
              className="h-12 w-full rounded-xl font-bold"
              onClick={() => {
                resolveIncident(incident.id, {
                  outcome,
                  whatHappened,
                  actionTaken,
                  description,
                  notes,
                  attendedAt: new Date().toISOString(),
                });
                toast.success("Resolution report submitted");
                navigate({ to: "/officer" });
              }}
            >
              SUBMIT RESOLUTION REPORT
            </Button>
          </section>
        ) : (
          <Button className="h-12 w-full rounded-xl" onClick={() => setShowForm(true)}>
            Record Resolution
          </Button>
        )}
      </div>
    </PhoneFrame>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl"
      />
    </div>
  );
}
