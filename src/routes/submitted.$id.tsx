import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AppHeader, PhoneFrame, PriorityBadge } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { useCampus } from "@/lib/campus-store";
import { formatDateTime } from "@/lib/campus-data";

export const Route = createFileRoute("/submitted/$id")({
  head: () => ({
    meta: [
      { title: "Incident Submitted — Campus Security" },
      {
        name: "description",
        content: "Your campus security incident report has been submitted and officers notified.",
      },
      { property: "og:title", content: "Incident Submitted — Campus Security" },
      { property: "og:description", content: "Report confirmation and incident reference details." },
    ],
  }),
  component: Submitted,
});

function Submitted() {
  const { id } = useParams({ from: "/submitted/$id" });
  const { incidents } = useCampus();
  const incident = incidents.find((i) => i.id === id);

  return (
    <PhoneFrame>
      <AppHeader title="Incident Submitted" back="/resident" />
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-14" />
        </div>
        <h2 className="mt-6 text-xl font-bold">Report Submitted Successfully</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Campus Security has been notified. You will receive updates about your report.
        </p>

        {incident ? (
          <div className="surface-card mt-6 w-full space-y-3 p-4 text-left">
            <Row label="Incident ID" value={`#${incident.id}`} />
            <Row label="Category" value={incident.category} />
            <Row label="Date / Time" value={formatDateTime(incident.reportedAt)} />
            <Row label="Location" value={incident.locationName} />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Priority</span>
              <PriorityBadge priority={incident.priority} />
            </div>
          </div>
        ) : null}

        <Button asChild className="mt-6 h-12 w-full rounded-xl">
          <Link to="/reports">View My Reports</Link>
        </Button>
        <Button asChild variant="secondary" className="mt-2 h-12 w-full rounded-xl">
          <Link to="/resident">Return Home</Link>
        </Button>
      </div>
    </PhoneFrame>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
