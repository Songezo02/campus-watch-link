import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppHeader, PhoneFrame } from "@/components/campus/shell";
import { PhotoPicker } from "@/components/campus/photo-picker";
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
import { useCampus } from "@/lib/campus-store";
import type { CampusUser } from "@/lib/campus-data";

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
  const { registerResident } = useCampus();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<CampusUser["gender"]>("Male");
  const [accountType, setAccountType] = useState<"Student" | "Staff">("Student");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [photo, setPhoto] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 3) return setError("Please enter your full name and surname.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError("Please enter a valid institutional email address.");
    if (number.trim().length < 4) return setError("Please enter your student or staff number.");
    if (phone.replace(/\D/g, "").length < 9) return setError("Please enter a valid phone number.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    const result = registerResident({
      fullName,
      gender,
      accountType,
      email,
      number,
      phone,
      password,
      photo,
    });
    if (!result.ok) return setError(result.error);

    toast.success("Account created successfully");
    setDone(true);
  };

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
            We have sent an institutional email verification link and code to {email}.
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
      <form className="space-y-4 px-5 py-6" onSubmit={submit} noValidate>
        <PhotoPicker
          value={photo}
          onChange={setPhoto}
          tone="success"
          hint="Optional profile photo, used to help security identify you."
        />

        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name and Surname</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={100}
            placeholder="e.g. John Doe"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as CampusUser["gender"])}>
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
            <Select value={accountType} onValueChange={(v) => setAccountType(v as "Student" | "Staff")}>
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
          <Label htmlFor="email">Institutional Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            placeholder="name@campus.ac.za"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="number">Student or Staff Number</Label>
          <Input
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            maxLength={30}
            placeholder="STU-2026-0000"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Cellphone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            placeholder="072 000 0000"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="h-11 rounded-xl"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-emergency-soft px-3 py-2 text-sm text-emergency">
            {error}
          </p>
        ) : null}

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
