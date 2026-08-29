import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Crosshair, ImagePlus, Map, Video } from "lucide-react";
import { AppHeader, BottomNav, MapPreview, PhoneFrame, PriorityBadge } from "@/components/campus/shell";
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
  const { createIncident } = useCampus();
  const navigate = useNavigate();
  const [category, setCategory] = useState<IncidentCategory>("Suspicious Activity");
  const [description, setDescription] = useState("");
  const [locationIdx, setLocationIdx] = useState(0);
  const [pickingMap, setPickingMap] = useState(false);
  const [evidence, setEvidence] = useState<{ type: "photo" | "video" | "note"; label: string }[]>([]);
  const [confirming, setConfirming] = useState(false);
  const spot = CAMPUS_LOCATIONS[locationIdx]!;

  const submit = () => {
    const incident = createIncident({
      category,
      description,
      locationName: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      evidence,
    });
    toast.success("Report submitted");
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

        {confirming ? (
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
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
