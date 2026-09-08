import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fingerprint, KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { AppHeader, BottomNav, PhoneFrame } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCampus } from "@/lib/campus-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Campus Security" },
      { name: "description", content: "Manage your Campus Security profile, app lock PIN and biometrics." },
      { property: "og:title", content: "My Profile — Campus Security" },
      { property: "og:description", content: "Account details and app security settings." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { currentUser, logout } = useCampus();
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <AppHeader title="My Profile" back="/resident" />
      <div className="space-y-4 px-5 py-6">
        <div className="surface-card flex flex-col items-center p-5">
          <img
            src={currentUser?.photo}
            alt={currentUser?.fullName ?? "Profile"}
            className="size-20 rounded-full object-cover"
          />
          <p className="mt-3 text-base font-bold">{currentUser?.fullName}</p>
          <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          <span className="mt-2 rounded-full bg-success-soft px-3 py-1 text-[11px] font-semibold text-success">
            {currentUser?.accountStatus}
          </span>
        </div>

        <div className="surface-card divide-y divide-border">
          <Row icon={ShieldCheck} label="Account Number" value={currentUser?.number ?? "—"} />
          <Row icon={ShieldCheck} label="Phone" value={currentUser?.phone ?? "—"} />
          <Row icon={ShieldCheck} label="Gender" value={currentUser?.gender ?? "—"} />
        </div>

        <div className="surface-card divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <KeyRound className="size-5 text-primary" />
            <span className="text-sm font-medium">App Lock PIN</span>
            <Switch defaultChecked className="ml-auto" />
          </div>
          <div className="flex items-center gap-3 p-4">
            <Fingerprint className="size-5 text-primary" />
            <span className="text-sm font-medium">Biometric Unlock</span>
            <Switch defaultChecked className="ml-auto" />
          </div>
        </div>

        <Button
          variant="outline"
          className="h-12 w-full rounded-xl text-emergency"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="size-4" /> Sign Out
        </Button>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Icon className="size-5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto text-sm font-semibold">{value}</span>
    </div>
  );
}
