import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneFrame } from "@/components/campus/shell";
import { useCampus } from "@/lib/campus-store";
import type { Role } from "@/lib/campus-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campus Security — Incident Reporting & Response" },
      {
        name: "description",
        content:
          "Report campus security incidents, trigger emergency SOS, and track officer response in real time.",
      },
      { property: "og:title", content: "Campus Security — Incident Reporting & Response" },
      {
        property: "og:description",
        content: "Fast, secure incident reporting and response management for university campuses.",
      },
    ],
  }),
  component: LoginScreen,
});

const demoAccounts: { role: Role; label: string; hint: string }[] = [
  { role: "student", label: "Student", hint: "john.doe@campus.ac.za" },
  { role: "staff", label: "Staff", hint: "n.mokoena@campus.ac.za" },
  { role: "officer", label: "Security Officer", hint: "j.smith@campus.ac.za" },
  { role: "admin", label: "Administrator", hint: "admin@campus.ac.za" },
];

function LoginScreen() {
  const { login, loginWithEmail } = useCampus();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("john.doe@campus.ac.za");
  const [password, setPassword] = useState("Campus@2026");
  const [error, setError] = useState<string | null>(null);

  const go = (r: Role) =>
    navigate({ to: r === "officer" ? "/officer" : r === "admin" ? "/admin" : "/resident" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const demo = demoAccounts.find((a) => a.hint === email.trim().toLowerCase());
    if (demo) {
      login(demo.role);
      go(demo.role);
      return;
    }
    const result = loginWithEmail(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    go(result.role);
  };

  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col bg-primary px-6 pb-10 pt-14 text-primary-foreground md:min-h-[860px]">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
            <ShieldCheck className="size-10" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">Campus Security</h1>
          <p className="mt-1 text-sm opacity-80">Incident Reporting &amp; Response System</p>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 space-y-4 rounded-3xl bg-card p-5 text-card-foreground shadow-[var(--shadow-float)]"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email or Student/Staff Number</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@campus.ac.za"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sign in as</Label>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => {
                    setRole(a.role);
                    setEmail(a.hint);
                  }}
                  className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    role === a.role
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <p role="alert" className="rounded-xl bg-emergency-soft px-3 py-2 text-sm text-emergency">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-base">
            Login
          </Button>

          <div className="flex items-center justify-between text-xs">
            <button type="button" className="font-medium text-primary">
              Forgot Password?
            </button>
            <Link to="/lock" className="font-medium text-muted-foreground">
              App Lock
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-primary">
              Register
            </Link>
          </p>
        </form>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary-foreground/10 p-4 text-xs leading-relaxed">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <p>
            Your safety is our priority. Report incidents quickly and securely — all reports are
            encrypted and handled by authorised campus security personnel.
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
