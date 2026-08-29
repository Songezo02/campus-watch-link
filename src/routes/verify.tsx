import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MailCheck } from "lucide-react";
import { AppHeader, PhoneFrame } from "@/components/campus/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify Your Account — Campus Security" },
      {
        name: "description",
        content: "Enter the 6-digit verification code sent to your institutional email address.",
      },
      { property: "og:title", content: "Verify Your Account — Campus Security" },
      {
        property: "og:description",
        content: "Institutional email verification for Campus Security accounts.",
      },
    ],
  }),
  component: VerifyAccount,
});

function VerifyAccount() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);

  return (
    <PhoneFrame>
      <AppHeader title="Verify Account" back="/register" />
      <div className="px-6 py-10 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-soft text-primary">
          {verified ? <CheckCircle2 className="size-10" /> : <MailCheck className="size-10" />}
        </div>
        {verified ? (
          <>
            <h2 className="mt-6 text-xl font-bold">Account Verified</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account has been successfully verified.
            </p>
            <Button asChild className="mt-8 h-12 w-full rounded-xl">
              <Link to="/">Continue to Login</Link>
            </Button>
          </>
        ) : (
          <>
            <h2 className="mt-6 text-xl font-bold">Verify Your Account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We have sent a verification code to your institutional email.
            </p>
            <div className="mt-8 flex justify-center gap-2">
              {code.map((c, i) => (
                <Input
                  key={i}
                  inputMode="numeric"
                  maxLength={1}
                  value={c}
                  aria-label={`Digit ${i + 1}`}
                  onChange={(e) =>
                    setCode((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                  className="size-12 rounded-xl p-0 text-center text-lg font-semibold"
                />
              ))}
            </div>
            <Button
              className="mt-8 h-12 w-full rounded-xl"
              onClick={() => {
                setVerified(true);
                toast.success("Account verified");
              }}
            >
              Verify
            </Button>
            <Button
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => toast("A new code has been sent to your email")}
            >
              Resend Code
            </Button>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
