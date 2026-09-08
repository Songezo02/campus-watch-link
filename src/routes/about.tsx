import { createFileRoute } from "@tanstack/react-router";
import { Lock, ShieldCheck } from "lucide-react";
import { AppHeader, BottomNav, PhoneFrame } from "@/components/campus/shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Campus Security" },
      {
        name: "description",
        content: "About the Campus Security incident reporting and response management system.",
      },
      { property: "og:title", content: "About — Campus Security" },
      { property: "og:description", content: "How Campus Security protects residents and their data." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PhoneFrame>
      <AppHeader title="About" back="/resident" />
      <div className="space-y-4 px-5 py-6">
        <div className="surface-card p-5 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <ShieldCheck className="size-8" />
          </div>
          <h2 className="mt-4 text-lg font-bold">Campus Security</h2>
          <p className="text-xs text-muted-foreground">Incident Reporting &amp; Response System</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Campus Security connects students and staff directly to trained campus security officers,
            with real-time incident tracking from report to resolution.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Version 1.0.0</p>
        </div>

        <div className="surface-card space-y-2 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="size-4 text-primary" /> Privacy &amp; Security
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• Passwords are stored using secure hashing — never in plain text.</li>
            <li>• Role-based access controls limit who can view incident information.</li>
            <li>• Biometric unlock uses your device APIs; no fingerprint data is stored.</li>
            <li>• Location is only captured when you report an incident or trigger SOS.</li>
            <li>• All officer and administrator actions are recorded in an audit log.</li>
          </ul>
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
