import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Siren } from "lucide-react";
import { AppHeader, BottomNav, MapPreview, PhoneFrame } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { useCampus } from "@/lib/campus-store";
import { CAMPUS_LOCATIONS } from "@/lib/campus-data";
import { toast } from "sonner";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "Emergency SOS — Campus Security" },
      {
        name: "description",
        content:
          "Trigger an immediate critical-priority emergency alert with your live GPS location to campus security.",
      },
      { property: "og:title", content: "Emergency SOS — Campus Security" },
      {
        property: "og:description",
        content: "One tap emergency assistance from campus security officers.",
      },
    ],
  }),
  component: SosScreen,
});

function SosScreen() {
  const { createIncident } = useCampus();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const spot = CAMPUS_LOCATIONS[0]!;

  const trigger = () => {
    const incident = createIncident({
      category: "Medical Emergency",
      description: "EMERGENCY SOS triggered from the resident application.",
      locationName: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      emergency: true,
    });
    toast.error("Emergency alert sent to all available officers");
    navigate({ to: "/submitted/$id", params: { id: incident.id } });
  };

  return (
    <PhoneFrame>
      <AppHeader title="Emergency SOS" subtitle="Critical priority" back="/resident" />
      <div className="space-y-5 px-5 py-6">
        <div className="rounded-3xl bg-emergency p-6 text-center text-emergency-foreground shadow-[var(--shadow-emergency)]">
          <Siren className="mx-auto size-14" />
          <h2 className="mt-3 text-xl font-extrabold">Emergency Assistance</h2>
          <p className="mt-1 text-xs opacity-90">
            Your live GPS location will be captured and sent to all available officers immediately.
          </p>
        </div>

        <div className="surface-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="size-4 text-emergency" /> Live location captured
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {spot.name} · {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
          </p>
          <MapPreview lat={spot.lat} lng={spot.lng} label={spot.name} className="mt-3 h-40" />
        </div>

        {confirming ? (
          <div className="surface-card space-y-3 border-2 border-emergency p-4">
            <p className="text-sm font-semibold">
              Are you sure you want to send an emergency alert?
            </p>
            <p className="text-xs text-muted-foreground">
              This is marked Critical priority and dispatches officers immediately.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={trigger}>
                Yes, Send SOS
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="destructive"
            className="h-16 w-full rounded-2xl text-lg font-extrabold"
            onClick={() => setConfirming(true)}
          >
            SEND EMERGENCY ALERT
          </Button>
        )}
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
