import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AppHeader, BottomNav, PhoneFrame } from "@/components/campus/shell";
import { SAFETY_TIPS } from "@/lib/campus-data";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety Tips — Campus Security" },
      { name: "description", content: "Practical safety guidance for students and staff on campus." },
      { property: "og:title", content: "Safety Tips — Campus Security" },
      { property: "og:description", content: "Stay safe on campus with these security tips." },
    ],
  }),
  component: Safety,
});

function Safety() {
  return (
    <PhoneFrame>
      <AppHeader title="Safety Tips" back="/resident" />
      <div className="space-y-3 px-5 py-5">
        {SAFETY_TIPS.map((tip) => (
          <article key={tip} className="surface-card flex gap-3 p-4">
            <ShieldCheck className="size-5 shrink-0 text-success" />
            <p className="text-sm">{tip}</p>
          </article>
        ))}
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
