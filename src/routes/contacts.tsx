import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { AppHeader, BottomNav, PhoneFrame } from "@/components/campus/shell";
import { EMERGENCY_CONTACTS } from "@/lib/campus-data";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Emergency Contacts — Campus Security" },
      {
        name: "description",
        content: "Direct-dial numbers for campus security, medical, fire and police emergencies.",
      },
      { property: "og:title", content: "Emergency Contacts — Campus Security" },
      { property: "og:description", content: "One-tap emergency calling for campus residents." },
    ],
  }),
  component: Contacts,
});

const toneMap: Record<string, string> = {
  primary: "bg-primary-soft text-primary",
  emergency: "bg-emergency-soft text-emergency",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning-foreground",
};

function Contacts() {
  return (
    <PhoneFrame>
      <AppHeader title="Emergency Contacts" back="/resident" />
      <div className="space-y-3 px-5 py-5">
        {EMERGENCY_CONTACTS.map((c) => (
          <article key={c.name} className="surface-card flex items-center gap-3 p-4">
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${toneMap[c.tone]}`}
            >
              <Phone className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.number}</p>
            </div>
            <a
              href={`tel:${c.number.replace(/\s/g, "")}`}
              className="ml-auto rounded-xl bg-emergency px-4 py-2 text-xs font-bold text-emergency-foreground"
            >
              Call
            </a>
          </article>
        ))}
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
