import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, ImageUp, Lock, ShieldCheck } from "lucide-react";
import { AppHeader, PhoneFrame } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/register/officer")({
  head: () => ({
    meta: [
      { title: "Security Officer Registration — Campus Security" },
      {
        name: "description",
        content:
          "Register as an authorised campus security officer. Accounts are reviewed by the Campus Security Administrator.",
      },
      { property: "og:title", content: "Security Officer Registration — Campus Security" },
      {
        property: "og:description",
        content: "Apply for a campus security officer account, subject to administrator approval.",
      },
    ],
  }),
  component: OfficerRegistration,
});

function OfficerRegistration() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <PhoneFrame>
        <AppHeader title="Registration Submitted" back="/register" />
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-warning-soft text-warning-foreground">
            <ShieldCheck className="size-10" />
          </div>
          <h2 className="mt-6 text-xl font-bold">Registration Submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your Security Officer account will be reviewed and approved by the Campus Security
            Administrator before access is granted.
          </p>
          <div className="surface-card mt-6 w-full p-4 text-left">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Account status</p>
            <p className="mt-1 text-base font-semibold text-warning-foreground">Pending Approval</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Possible statuses: Pending Approval · Approved · Rejected · Suspended
            </p>
          </div>
          <Button className="mt-6 h-12 w-full rounded-xl" onClick={() => navigate({ to: "/verify" })}>
            Verify Email Address
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link to="/">Back to Login</Link>
          </Button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <AppHeader title="Security Officer Registration" back="/register" />
      <form
        className="space-y-4 px-5 py-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Camera className="size-8" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button type="button" size="sm" variant="secondary" className="rounded-xl">
              <Camera className="size-4" /> Capture
            </Button>
            <Button type="button" size="sm" variant="secondary" className="rounded-xl">
              <ImageUp className="size-4" /> Upload
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            ID/Face photo is used for officer verification only and stored securely.
          </p>
        </div>

        <Field label="Full Name and Surname" placeholder="e.g. John Smith" />

        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Select defaultValue="Male">
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Field label="Staff Number" placeholder="SEC-2026-000" />
        <Field label="Institutional Staff Email" type="email" placeholder="name@campus.ac.za" />
        <Field label="Cellphone Number" type="tel" placeholder="072 000 0000" />
        <Field label="Password" type="password" placeholder="••••••••" />
        <Field label="Confirm Password" type="password" placeholder="••••••••" />

        <div className="space-y-1.5">
          <Label>Motivation / Assigned Post (optional)</Label>
          <Textarea rows={3} className="rounded-xl" placeholder="Assigned campus post or unit" />
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <p>
            Passwords are stored using secure hashing. Personal information is protected and only
            visible to authorised administrators.
          </p>
        </div>

        <Button type="submit" className="h-12 w-full rounded-xl text-base">
          Register
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-primary">
            Login
          </Link>
        </p>
      </form>
    </PhoneFrame>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} className="h-11 rounded-xl" required />
    </div>
  );
}
