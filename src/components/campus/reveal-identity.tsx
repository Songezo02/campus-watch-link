import { useState } from "react";
import { Eye, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCampus } from "@/lib/campus-store";

/** Admin-only control to reveal who filed an anonymous report. Every reveal is audited. */
export function RevealIdentity({ incidentId }: { incidentId: string }) {
  const { revealReporterIdentity } = useCampus();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<{
    name: string;
    number: string;
    email: string;
    phone: string;
  } | null>(null);

  const reveal = () => {
    setError(null);
    if (reason.trim().length < 10)
      return setError("Please give a reason of at least 10 characters.");
    const res = revealReporterIdentity(incidentId, reason);
    if (!res.ok) return setError(res.error);
    setIdentity({ name: res.name, number: res.number, email: res.email, phone: res.phone });
    toast.warning(`Identity access for #${incidentId} recorded in the audit log`);
  };

  return (
    <>
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
        <Lock className="size-3" /> Anonymous
      </span>
      <Button
        size="sm"
        variant="outline"
        className="rounded-xl"
        onClick={() => {
          setOpen(true);
          setReason("");
          setError(null);
          setIdentity(null);
        }}
      >
        <Eye className="size-4" /> Reveal Reporter
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restricted administrative action</DialogTitle>
            <DialogDescription>
              This report was submitted anonymously. Revealing the reporter's identity is a
              restricted administrative action. Continue only when authorized.
            </DialogDescription>
          </DialogHeader>
          {identity ? (
            <div className="space-y-1 rounded-xl bg-muted p-4 text-sm">
              <p className="font-semibold">{identity.name}</p>
              <p className="text-xs text-muted-foreground">Number: {identity.number}</p>
              <p className="text-xs text-muted-foreground">Email: {identity.email}</p>
              <p className="text-xs text-muted-foreground">Phone: {identity.phone}</p>
              <p className="pt-2 text-[11px] text-muted-foreground">
                This access has been recorded in the audit log.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor={`reason-${incidentId}`}>Reason for accessing the identity</Label>
              <Textarea
                id={`reason-${incidentId}`}
                rows={3}
                maxLength={300}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Formal investigation requested by campus legal office"
              />
              {error ? <p className="text-xs text-emergency">{error}</p> : null}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {identity ? "Close" : "Cancel"}
            </Button>
            {identity ? null : (
              <Button variant="destructive" onClick={reveal}>
                Reveal Identity
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
