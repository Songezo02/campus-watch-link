import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  INCIDENTS,
  NOTIFICATIONS,
  OFFICERS,
  PRIORITY_BY_CATEGORY,
  USERS,
  type AppNotification,
  type CampusUser,
  type IdentityAudit,
  type Incident,
  type IncidentCategory,
  type IncidentStatus,
  type Officer,
  type OfficerStatus,
  type Resolution,
  type Role,
} from "./campus-data";

export interface RegisterResidentInput {
  fullName: string;
  gender: CampusUser["gender"];
  accountType: "Student" | "Staff";
  email: string;
  number: string;
  phone: string;
  password: string;
  photo?: string;
}

export interface RegisterOfficerInput {
  fullName: string;
  gender: CampusUser["gender"];
  email: string;
  number: string;
  phone: string;
  password: string;
  post?: string;
  photo?: string;
}

interface Session {
  userId: string;
  role: Role;
  locked: boolean;
}

interface StoreValue {
  users: CampusUser[];
  officers: Officer[];
  incidents: Incident[];
  notifications: AppNotification[];
  identityAudit: IdentityAudit[];
  session: Session | null;
  currentUser: CampusUser | Officer | null;
  /** Admin-only: reveals who filed an anonymous report and writes an audit record. */
  revealReporterIdentity: (
    incidentId: string,
    reason: string,
  ) =>
    | { ok: true; name: string; number: string; email: string; phone: string }
    | { ok: false; error: string };
  login: (role: Role) => void;
  loginWithEmail: (
    email: string,
    password: string,
  ) => { ok: true; role: Role } | { ok: false; error: string };
  registerResident: (input: RegisterResidentInput) =>
    | { ok: true; user: CampusUser }
    | { ok: false; error: string };
  registerOfficer: (input: RegisterOfficerInput) =>
    | { ok: true; officer: Officer }
    | { ok: false; error: string };
  logout: () => void;
  lock: () => void;
  unlock: () => void;
  createIncident: (input: {
    category: IncidentCategory;
    description: string;
    locationName: string;
    lat: number;
    lng: number;
    evidence?: Incident["evidence"];
    emergency?: boolean;
  }) => Incident;
  advanceIncident: (id: string, status: IncidentStatus, officer?: Officer) => void;
  cancelIncident: (id: string, reason: string) => void;
  resolveIncident: (id: string, resolution: Resolution) => void;
  reassign: (id: string, officerId: string) => void;
  setOfficerAvailability: (id: string, status: OfficerStatus) => void;
  setOfficerApproval: (id: string, status: CampusUser["accountStatus"]) => void;
  setUserStatus: (id: string, status: CampusUser["accountStatus"]) => void;
  markNotificationsRead: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const STORAGE_KEY = "campus-security-session-v1";
const ACCOUNTS_KEY = "campus-security-accounts-v1";

export function CampusStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<CampusUser[]>(USERS);
  const [officers, setOfficers] = useState<Officer[]>(OFFICERS);
  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS);
  const [session, setSession] = useState<Session | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        setSession({ ...(JSON.parse(raw) as Session), locked: true });
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  // Persist locally registered accounts so people can sign in again later.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as {
        users: CampusUser[];
        officers: Officer[];
        credentials: Record<string, string>;
      };
      setUsers((prev) => [
        ...prev,
        ...saved.users.filter((s) => !prev.some((p) => p.id === s.id)),
      ]);
      setOfficers((prev) => [
        ...prev,
        ...saved.officers.filter((s) => !prev.some((p) => p.id === s.id)),
      ]);
      setCredentials((prev) => ({ ...saved.credentials, ...prev }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = Object.keys(credentials);
    if (!ids.length) return;
    window.localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify({
        users: users.filter((u) => ids.includes(u.id)),
        officers: officers.filter((o) => ids.includes(o.id)),
        credentials,
      }),
    );
  }, [users, officers, credentials]);

  const value = useMemo<StoreValue>(() => {
    const resolveUser = () => {
      if (!session) return null;
      return (
        users.find((u) => u.id === session.userId) ??
        officers.find((o) => o.id === session.userId) ??
        null
      );
    };

    const pushNotification = (
      userId: string,
      title: string,
      message: string,
      tone: AppNotification["tone"],
    ) =>
      setNotifications((prev) => [
        {
          id: `n-${Math.random().toString(36).slice(2, 8)}`,
          userId,
          title,
          message,
          read: false,
          createdAt: new Date().toISOString(),
          tone,
        },
        ...prev,
      ]);

    return {
      users,
      officers,
      incidents,
      notifications,
      session,
      currentUser: resolveUser(),
      login: (role) => {
        const id =
          role === "officer"
            ? "o-1"
            : role === "admin"
              ? "u-9"
              : role === "staff"
                ? "u-2"
                : "u-1";
        setSession({ userId: id, role, locked: false });
      },
      loginWithEmail: (email, password) => {
        const key = email.trim().toLowerCase();
        const account =
          users.find((u) => u.email.toLowerCase() === key || u.number.toLowerCase() === key) ??
          officers.find((o) => o.email.toLowerCase() === key || o.number.toLowerCase() === key);
        if (!account) return { ok: false, error: "No account found with those details." };
        const stored = credentials[account.id];
        if (stored && stored !== password) return { ok: false, error: "Incorrect password." };
        if (account.accountStatus === "Pending Approval")
          return { ok: false, error: "Your account is still awaiting administrator approval." };
        if (account.accountStatus === "Suspended" || account.accountStatus === "Rejected")
          return { ok: false, error: `Account ${account.accountStatus.toLowerCase()}.` };
        setSession({ userId: account.id, role: account.role, locked: false });
        return { ok: true, role: account.role };
      },
      registerResident: (input) => {
        const key = input.email.trim().toLowerCase();
        const taken =
          users.some((u) => u.email.toLowerCase() === key) ||
          officers.some((o) => o.email.toLowerCase() === key);
        if (taken) return { ok: false, error: "An account with this email already exists." };
        const user: CampusUser = {
          id: `u-${Math.random().toString(36).slice(2, 8)}`,
          fullName: input.fullName.trim(),
          gender: input.gender,
          email: input.email.trim(),
          phone: input.phone.trim(),
          number: input.number.trim(),
          role: input.accountType === "Staff" ? "staff" : "student",
          photo: input.photo ?? "",
          accountStatus: "Active",
          createdAt: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, user]);
        setCredentials((prev) => ({ ...prev, [user.id]: input.password }));
        return { ok: true, user };
      },
      registerOfficer: (input) => {
        const key = input.email.trim().toLowerCase();
        const taken =
          users.some((u) => u.email.toLowerCase() === key) ||
          officers.some((o) => o.email.toLowerCase() === key);
        if (taken) return { ok: false, error: "An account with this email already exists." };
        const officer: Officer = {
          id: `o-${Math.random().toString(36).slice(2, 8)}`,
          fullName: input.fullName.trim(),
          gender: input.gender,
          email: input.email.trim(),
          phone: input.phone.trim(),
          number: input.number.trim(),
          role: "officer",
          photo: input.photo ?? "",
          accountStatus: "Pending Approval",
          createdAt: new Date().toISOString(),
          availability: "Off Duty",
          shift: input.post?.trim() || "Unassigned",
          responded: 0,
          avgResponseMin: 0,
        };
        setOfficers((prev) => [...prev, officer]);
        setCredentials((prev) => ({ ...prev, [officer.id]: input.password }));
        return { ok: true, officer };
      },
      logout: () => setSession(null),
      lock: () => setSession((s) => (s ? { ...s, locked: true } : s)),
      unlock: () => setSession((s) => (s ? { ...s, locked: false } : s)),
      createIncident: (input) => {
        const reporter = resolveUser() ?? users[0]!;
        const now = new Date().toISOString();
        const seq = 100 + incidents.length;
        const incident: Incident = {
          id: `INC-2026-${seq}`,
          reporterId: reporter.id,
          reporterName: reporter.fullName,
          reporterNumber: reporter.number,
          reporterPhone: reporter.phone,
          reporterGender: reporter.gender,
          category: input.category,
          description: input.description,
          priority: input.emergency ? "Critical" : PRIORITY_BY_CATEGORY[input.category],
          status: "Reported",
          lat: input.lat,
          lng: input.lng,
          locationName: input.locationName,
          reportedAt: now,
          evidence: input.evidence ?? [],
          history: [{ status: "Reported", at: now }],
        };
        setIncidents((prev) => [incident, ...prev]);
        pushNotification(
          reporter.id,
          "Report received",
          `Your incident report #${incident.id} has been received by the control room.`,
          input.emergency ? "emergency" : "info",
        );
        return incident;
      },
      advanceIncident: (id, status, officer) =>
        setIncidents((prev) =>
          prev.map((i) => {
            if (i.id !== id) return i;
            const now = new Date().toISOString();
            const next: Incident = {
              ...i,
              status,
              history: [...i.history, { status, at: now }],
            };
            if (officer) {
              next.officerId = officer.id;
              next.officerName = officer.fullName;
              next.assignedAt = next.assignedAt ?? now;
            }
            if (status === "Arrived") next.arrivedAt = now;
            if (status === "Resolved" || status === "Unable to Resolve") next.resolvedAt = now;
            if (status === "Closed") next.closedAt = now;
            pushNotification(
              i.reporterId,
              `Incident ${status.toLowerCase()}`,
              `Incident #${i.id} status updated to ${status}.`,
              status === "Resolved" || status === "Closed" ? "success" : "info",
            );
            return next;
          }),
        ),
      cancelIncident: (id, reason) =>
        setIncidents((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "Cancelled by Reporter",
                  cancelReason: reason,
                  history: [
                    ...i.history,
                    { status: "Cancelled by Reporter", at: new Date().toISOString() },
                  ],
                }
              : i,
          ),
        ),
      resolveIncident: (id, resolution) =>
        setIncidents((prev) =>
          prev.map((i) => {
            if (i.id !== id) return i;
            const now = new Date().toISOString();
            const status: IncidentStatus =
              resolution.outcome === "Unable to Resolve" ? "Unable to Resolve" : "Resolved";
            pushNotification(
              i.reporterId,
              "Incident resolved",
              `Incident #${i.id} has been completed by the responding officer.`,
              "success",
            );
            return {
              ...i,
              status,
              resolution,
              resolvedAt: now,
              arrivedAt: i.arrivedAt ?? now,
              history: [...i.history, { status, at: now }],
            };
          }),
        ),
      reassign: (id, officerId) => {
        const officer = officers.find((o) => o.id === officerId);
        if (!officer) return;
        setIncidents((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  officerId: officer.id,
                  officerName: officer.fullName,
                  assignedAt: new Date().toISOString(),
                  status: i.status === "Reported" ? "Officer Assigned" : i.status,
                  history: [
                    ...i.history,
                    { status: `Reassigned to ${officer.fullName}`, at: new Date().toISOString() },
                  ],
                }
              : i,
          ),
        );
      },
      setOfficerAvailability: (id, status) =>
        setOfficers((prev) =>
          prev.map((o) => (o.id === id ? { ...o, availability: status } : o)),
        ),
      setOfficerApproval: (id, status) =>
        setOfficers((prev) => prev.map((o) => (o.id === id ? { ...o, accountStatus: status } : o))),
      setUserStatus: (id, status) =>
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, accountStatus: status } : u))),
      markNotificationsRead: () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    };
  }, [users, officers, incidents, notifications, session, credentials]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useCampus() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useCampus must be used inside CampusStoreProvider");
  return ctx;
}
