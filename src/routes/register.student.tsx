import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, CheckCircle2, ImageUp, Lock } from "lucide-react";
import { AppHeader, PhoneFrame } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/register/student")({
  head: () => ({
    meta: [
      { title: "Student / Staff Registration — Campus Security" },
      {
        name: "description",
        content:
          "Create a campus resident account to report incidents and request emergency assistance.",
      },
      { property: "og:title", content: "Student / Staff Registration — Campus Security" },
      {
        property: "og:description",
        content: "Register with your institutional email and student or staff number.",
      },
    ],
  }),
  component: StudentRegistration,
});

function StudentRegistration() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <PhoneFrame>
        <AppHeader title="Account Created" back="/register" />
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="size-11" />
          </div>
          <h2 className="mt-6 text-xl font-bold">Account Created Successfully</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We have sent an institutional email verification link and code to your campus mailbox.
          </p>
          <Button className="mt-8 h-12 w-full rounded-xl" onClick={() => navigate({ to: "/verify" })}>
            Verify My Account
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
      <AppHeader title="Student / Staff Registration" back="/register" />
      <form
        className="space-y-4 px-5 py-6"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-success-soft text-success">
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
        </div>

        <div className="space-y-1.5">
          <Label>Full Name and Surname</Label>
          <Input required placeholder="e.g. John Doe" className="h-11 rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div className="space-y-1.5">
            <Label>Account Type</Label>
            <Select defaultValue="Student">
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Institutional Email</Label>
          <Input required type="email" placeholder="name@campus.ac.za" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Student or Staff Number</Label>
          <Input required placeholder="STU-2026-0000" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Cellphone Number</Label>
          <Input required type="tel" placeholder="072 000 0000" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Password</Label>
          <Input required type="password" placeholder="••••••••" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Confirm Password</Label>
          <Input required type="password" placeholder="••••••••" className="h-11 rounded-xl" />
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <p>
            Your institutional email and student/staff number are verified before your account is
            activated. Personal information is never shared outside campus security.
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
