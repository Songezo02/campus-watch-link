import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Delete, Fingerprint, ScanFace, ShieldCheck } from "lucide-react";
import { PhoneFrame } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { useCampus } from "@/lib/campus-store";
import { toast } from "sonner";

export const Route = createFileRoute("/lock")({
  head: () => ({
    meta: [
      { title: "App Lock — Campus Security" },
      { name: "description", content: "Unlock Campus Security with your PIN or device biometrics." },
      { property: "og:title", content: "App Lock — Campus Security" },
      { property: "og:description", content: "Secure PIN and biometric app lock for Campus Security." },
    ],
  }),
  component: AppLock,
});

function AppLock() {
  const { currentUser, session, unlock } = useCampus();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<"pin" | "biometric">("biometric");

  const destination =
    session?.role === "officer" ? "/officer" : session?.role === "admin" ? "/admin" : "/resident";

  const finish = () => {
    unlock();
    navigate({ to: destination });
  };

  const press = (d: string) => {
    const next = (pin + d).slice(0, 6);
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        toast.success("App unlocked");
        finish();
      }, 250);
    }
  };

  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col items-center bg-primary px-6 pb-10 pt-16 text-primary-foreground md:min-h-[860px]">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/10">
          <ShieldCheck className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Welcome Back</h1>
        <img
          src={currentUser?.photo ?? "https://i.pravatar.cc/160?u=johndoe"}
          alt={currentUser?.fullName ?? "Profile"}
          className="mt-5 size-24 rounded-full object-cover ring-4 ring-primary-foreground/20"
        />
        <p className="mt-3 text-base font-semibold">{currentUser?.fullName ?? "John Doe"}</p>
        <p className="text-xs opacity-75">Unlock Campus Security</p>

        {mode === "biometric" ? (
          <div className="mt-10 flex flex-1 flex-col items-center">
            <button
              onClick={() => {
                toast.success("Fingerprint verified");
                finish();
              }}
              className="flex size-40 items-center justify-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20 transition-transform active:scale-95"
              aria-label="Use fingerprint"
            >
              <Fingerprint className="size-24" />
            </button>
            <p className="mt-5 text-sm font-medium">Use Fingerprint</p>
            <p className="mt-1 max-w-[16rem] text-center text-[11px] opacity-70">
              Uses your device&apos;s built-in biometric system. No fingerprint data is ever stored
              by this application.
            </p>
            <div className="mt-8 flex gap-3">
              <Button
                variant="secondary"
                className="rounded-xl"
                onClick={() => {
                  toast.success("Face ID verified");
                  finish();
                }}
              >
                <ScanFace className="size-4" /> Use Face ID
              </Button>
              <Button variant="secondary" className="rounded-xl" onClick={() => setMode("pin")}>
                Use PIN
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex w-full flex-1 flex-col items-center">
            <p className="text-sm font-medium">Enter PIN</p>
            <div className="mt-4 flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`size-4 rounded-full ${
                    pin.length > i ? "bg-primary-foreground" : "bg-primary-foreground/25"
                  }`}
                />
              ))}
            </div>
            <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button
                  key={d}
                  onClick={() => press(d)}
                  className="flex h-16 items-center justify-center rounded-2xl bg-primary-foreground/10 text-2xl font-semibold transition-colors active:bg-primary-foreground/20"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => setMode("biometric")}
                className="flex h-16 items-center justify-center rounded-2xl bg-primary-foreground/5"
                aria-label="Use biometrics"
              >
                <Fingerprint className="size-6" />
              </button>
              <button
                onClick={() => press("0")}
                className="flex h-16 items-center justify-center rounded-2xl bg-primary-foreground/10 text-2xl font-semibold"
              >
                0
              </button>
              <button
                onClick={() => setPin((p) => p.slice(0, -1))}
                className="flex h-16 items-center justify-center rounded-2xl bg-primary-foreground/5"
                aria-label="Delete"
              >
                <Delete className="size-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
