import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Crosshair, ImagePlus, Lock, Map, Video } from "lucide-react";
import { AppHeader, BottomNav, MapPreview, PhoneFrame, PriorityBadge } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAMPUS_LOCATIONS,
  INCIDENT_CATEGORIES,
  PRIORITY_BY_CATEGORY,
  type IncidentCategory,
} from "@/lib/campus-data";
import { useCampus } from "@/lib/campus-store";
import { toast } from "sonner";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Incident — Campus Security" },
      {
        name: "description",
        content:
          "Submit a campus security incident with category, description, location and optional evidence.",
      },
      { property: "og:title", content: "Report an Incident — Campus Security" },
      {
        property: "og:description",
        content: "Fast, structured incident reporting for campus residents.",
      },
    ],
  }),
  component: ReportIncident,
});

function ReportIncident() {
  const { createIncident, currentUser } = useCampus();
  const navigate = useNavigate();
  const [category, setCategory] = useState<IncidentCategory>("Suspicious Activity");
  const [description, setDescription] = useState("");
  const [locationIdx, setLocationIdx] = useState(0);
  const [pickingMap, setPickingMap] = useState(false);
  const [evidence, setEvidence] = useState<{ type: "photo" | "video" | "note"; label: string }[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const spot = CAMPUS_LOCATIONS[locationIdx]!;

  // Only signed-in students and staff may report anonymously.
  const canAnonymous = currentUser?.role === "student" || currentUser?.role === "staff";
  const isAnonymous = anonymous && canAnonymous;

  const submit = () => {
    const incident = createIncident({
      category,
      description,
      locationName: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      evidence,
      anonymous: isAnonymous,
    });
    toast.success(isAnonymous ? "Anonymous report submitted" : "Report submitted");
    navigate({ to: "/submitted/$id", params: { id: incident.id } });
  };

  return (
    <PhoneFrame>
      <AppHeader title="Report Incident" back="/resident" />
      <div className="space-y-5 px-5 py-6">
        <div className="space-y-1.5">
          <Label>Incident Type</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as IncidentCategory)}>
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INCIDENT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="surface-card flex items-center justify-between p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Calculated Priority
            </p>
            <p className="text-sm text-muted-foreground">Based on the selected category</p>
          </div>
          <PriorityBadge priority={PRIORITY_BY_CATEGORY[category]} />
        </div>

        <div className="space-y-1.5">
          <Label>Incident Description</Label>
          <Textarea
            rows={5}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened..."
            className="rounded-2xl"
          />
          <p className="text-right text-[11px] text-muted-foreground">{description.length}/500</p>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={pickingMap ? "secondary" : "default"}
              className="h-11 rounded-xl"
              onClick={() => {
                setPickingMap(false);
                setLocationIdx(0);
                toast.success("Live location captured");
              }}
            >
              <Crosshair className="size-4" /> Live Location
            </Button>
            <Button
              type="button"
              variant={pickingMap ? "default" : "secondary"}
              className="h-11 rounded-xl"
              onClick={() => setPickingMap(true)}
            >
              <Map className="size-4" /> Pick on Map
            </Button>
          </div>

          {pickingMap ? (
            <Select
              value={String(locationIdx)}
              onValueChange={(v) => setLocationIdx(Number(v))}
            >
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAMPUS_LOCATIONS.map((l, i) => (
                  <SelectItem key={l.name} value={String(i)}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <MapPreview lat={spot.lat} lng={spot.lng} label={spot.name} className="h-40" />
        </div>

        <div className="space-y-2">
          <Label>Additional Evidence (optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl"
              onClick={() => {
                setEvidence((e) => [...e, { type: "photo", label: `photo-${e.length + 1}.jpg` }]);
                toast.success("Photo attached");
              }}
            >
              <ImagePlus className="size-4" /> Add Photo
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl"
              onClick={() => {
                setEvidence((e) => [...e, { type: "video", label: `clip-${e.length + 1}.mp4` }]);
                toast.success("Video attached");
              }}
            >
              <Video className="size-4" /> Add Video
            </Button>
          </div>
          {evidence.length ? (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {evidence.map((e, i) => (
                <li key={i}>• {e.label}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {canAnonymous ? (
          <div className="space-y-2">
            <Label>Reporting Identity</Label>
            <div className="surface-card space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="anon" className="text-sm font-medium">
                  Report Anonymously: {isAnonymous ? "ON" : "OFF"}
                </Label>
                <Switch id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
              </div>
              <RadioGroup
                value={anonymous ? "anon" : "self"}
                onValueChange={(v) => setAnonymous(v === "anon")}
                className="gap-2"
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="self" /> Report as Myself
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="anon" /> Report Anonymously
                </label>
              </RadioGroup>
              {isAnonymous ? (
                <div className="flex items-start gap-2 rounded-xl bg-primary-soft p-3 text-xs text-primary">
                  <Lock className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Anonymous Report</p>
                    <p>
                      Your identity will be hidden from security officers when viewing this report.
                      Your account is still securely linked to the report for system security and
                      administrative purposes.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {confirming && !isAnonymous ? (
          <div className="surface-card space-y-3 border-2 border-primary p-4">
            <p className="text-sm font-semibold">
              Are you sure you want to submit this incident report?
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 rounded-xl"
                onClick={() => setConfirming(false)}
              >
                Review
              </Button>
              <Button className="flex-1 rounded-xl" onClick={submit}>
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="h-14 w-full rounded-2xl text-base font-bold"
            disabled={description.trim().length < 5}
            onClick={() => setConfirming(true)}
          >
            SUBMIT REPORT
          </Button>
        )}

        <AlertDialog
          open={confirming && isAnonymous}
          onOpenChange={(open) => !open && setConfirming(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Anonymously?</AlertDialogTitle>
              <AlertDialogDescription>
                Your identity will be hidden from Security Officers. Your account will remain
                securely associated with this report for system security and authorized
                administrative purposes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={submit}>Submit Anonymously</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
