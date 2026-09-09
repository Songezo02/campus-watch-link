import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { AppHeader, PhoneFrame } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/register/")({
  head: () => ({
    meta: [
      { title: "Create Account — Campus Security" },
      {
        name: "description",
        content: "Register as a campus security officer or as a student/staff campus resident.",
      },
      { property: "og:title", content: "Create Account — Campus Security" },
      {
        property: "og:description",
        content: "Choose your Campus Security account type to get started.",
      },
    ],
  }),
  component: RegisterAs,
});

function RegisterAs() {
  return (
    <PhoneFrame>
      <AppHeader title="Register As" back="/" />
      <div className="space-y-5 px-5 py-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Create Your Campus Security Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose your account type</p>
        </div>

        <article className="surface-card p-5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Security Officer</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Register as an authorised campus security officer. Accounts require administrator
            approval before access is granted.
          </p>
          <Button asChild className="mt-4 h-11 w-full rounded-xl">
            <Link to="/register/officer">Register as Security Officer</Link>
          </Button>
        </article>

        <article className="surface-card p-5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-success-soft text-success">
            <GraduationCap className="size-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Student / Staff</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Register as a campus resident to report incidents and request emergency assistance.
          </p>
          <Button asChild variant="secondary" className="mt-4 h-11 w-full rounded-xl">
            <Link to="/register/student">Register as Student / Staff</Link>
          </Button>
        </article>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
