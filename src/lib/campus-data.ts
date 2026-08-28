export type Role = "student" | "staff" | "officer" | "admin";

export type IncidentCategory =
  | "Theft"
  | "Assault"
  | "Suspicious Activity"
  | "Medical Emergency"
  | "Fire"
  | "Damage to Property"
  | "Unauthorized Access"
  | "Disturbance"
  | "Other";

export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  "Theft",
  "Assault",
  "Suspicious Activity",
  "Medical Emergency",
  "Fire",
  "Damage to Property",
  "Unauthorized Access",
  "Disturbance",
  "Other",
];

export type Priority = "Critical" | "High" | "Medium" | "Low";

export const PRIORITY_BY_CATEGORY: Record<IncidentCategory, Priority> = {
  Assault: "Critical",
  Fire: "Critical",
  "Medical Emergency": "Critical",
  Theft: "High",
  "Suspicious Activity": "High",
  "Damage to Property": "High",
  Disturbance: "Medium",
  "Unauthorized Access": "Medium",
  Other: "Low",
};

export type IncidentStatus =
  | "Reported"
  | "Received"
  | "Officer Assigned"
  | "Responding"
  | "Arrived"
  | "Resolved"
  | "Unable to Resolve"
  | "Closed"
  | "Cancelled by Reporter";

export const WORKFLOW: IncidentStatus[] = [
  "Reported",
  "Received",
  "Officer Assigned",
  "Responding",
  "Arrived",
  "Resolved",
  "Closed",
];

export type OfficerStatus = "Available" | "Occupied" | "Responding" | "Off Duty";

export interface CampusUser {
  id: string;
  fullName: string;
  gender: "Male" | "Female" | "Prefer not to say";
  email: string;
  phone: string;
  number: string;
  role: Role;
  photo: string;
  accountStatus: "Active" | "Pending Approval" | "Suspended" | "Rejected";
  createdAt: string;
}

export interface Officer extends CampusUser {
  availability: OfficerStatus;
  shift: string;
  responded: number;
  avgResponseMin: number;
}

export interface Resolution {
  outcome: "Resolved" | "Unable to Resolve" | "False Alarm" | "Escalated" | "Other";
  whatHappened: string;
  actionTaken: string;
  description: string;
  notes?: string;
  attendedAt: string;
}

export interface Incident {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterNumber: string;
  reporterPhone: string;
  reporterGender: string;
  officerId?: string;
  officerName?: string;
  category: IncidentCategory;
  description: string;
  priority: Priority;
  status: IncidentStatus;
  lat: number;
  lng: number;
  locationName: string;
  reportedAt: string;
  assignedAt?: string;
  arrivedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  cancelReason?: string;
  evidence: { type: "photo" | "video" | "note"; label: string }[];
  resolution?: Resolution;
  history: { status: IncidentStatus | string; at: string }[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  tone: "info" | "success" | "emergency" | "warning";
}

export const CAMPUS_LOCATIONS = [
  { name: "Main Campus Residence", lat: -25.7565, lng: 28.1961 },
  { name: "Engineering Building", lat: -25.7551, lng: 28.2312 },
  { name: "Library & Learning Centre", lat: -25.7539, lng: 28.229 },
  { name: "Student Centre", lat: -25.7572, lng: 28.2305 },
  { name: "Sports Complex", lat: -25.7598, lng: 28.2348 },
  { name: "North Gate Parking", lat: -25.7512, lng: 28.2277 },
  { name: "Science Faculty", lat: -25.7546, lng: 28.2265 },
];

export const EMERGENCY_CONTACTS = [
  { name: "Campus Security Control Room", number: "0800 123 456", tone: "primary" },
  { name: "Campus Emergency Line", number: "0800 911 000", tone: "emergency" },
  { name: "Campus Medical Clinic", number: "012 420 3333", tone: "success" },
  { name: "Fire Department", number: "10177", tone: "warning" },
  { name: "South African Police Service", number: "10111", tone: "primary" },
];

export const SAFETY_TIPS = [
  "Walk in well-lit areas and use the campus escort service after dark.",
  "Never leave laptops or bags unattended in study areas.",
  "Save the Campus Security number on your phone's speed dial.",
  "Report suspicious persons immediately — do not confront them.",
  "Keep residence doors locked and never let strangers tailgate in.",
];

const photo = (seed: string) => `https://i.pravatar.cc/160?u=${seed}`;

export const USERS: CampusUser[] = [
  {
    id: "u-1",
    fullName: "John Doe",
    gender: "Male",
    email: "john.doe@campus.ac.za",
    phone: "072 555 0111",
    number: "STU-2026-4471",
    role: "student",
    photo: photo("johndoe"),
    accountStatus: "Active",
    createdAt: "2026-02-10",
  },
  {
    id: "u-2",
    fullName: "Naledi Mokoena",
    gender: "Female",
    email: "n.mokoena@campus.ac.za",
    phone: "083 555 0192",
    number: "STF-2026-1180",
    role: "staff",
    photo: photo("naledi"),
    accountStatus: "Active",
    createdAt: "2026-01-22",
  },
  {
    id: "u-3",
    fullName: "Sipho Dlamini",
    gender: "Male",
    email: "s.dlamini@campus.ac.za",
    phone: "071 555 0133",
    number: "STU-2026-3390",
    role: "student",
    photo: photo("sipho"),
    accountStatus: "Active",
    createdAt: "2026-03-04",
  },
  {
    id: "u-9",
    fullName: "Amara Ndlovu",
    gender: "Female",
    email: "admin@campus.ac.za",
    phone: "012 555 0100",
    number: "ADM-0001",
    role: "admin",
    photo: photo("amara"),
    accountStatus: "Active",
    createdAt: "2025-11-01",
  },
];

export const OFFICERS: Officer[] = [
  {
    id: "o-1",
    fullName: "John Smith",
    gender: "Male",
    email: "j.smith@campus.ac.za",
    phone: "079 555 0144",
    number: "SEC-2026-014",
    role: "officer",
    photo: photo("jsmith"),
    accountStatus: "Active",
    createdAt: "2025-12-02",
    availability: "Available",
    shift: "Night Shift · 18:00 – 06:00",
    responded: 128,
    avgResponseMin: 7,
  },
  {
    id: "o-2",
    fullName: "Thandiwe Khumalo",
    gender: "Female",
    email: "t.khumalo@campus.ac.za",
    phone: "076 555 0178",
    number: "SEC-2026-021",
    role: "officer",
    photo: photo("thandiwe"),
    accountStatus: "Active",
    createdAt: "2026-01-14",
    availability: "Responding",
    shift: "Day Shift · 06:00 – 18:00",
    responded: 94,
    avgResponseMin: 9,
  },
  {
    id: "o-3",
    fullName: "Pieter van Wyk",
    gender: "Male",
    email: "p.vanwyk@campus.ac.za",
    phone: "082 555 0166",
    number: "SEC-2026-033",
    role: "officer",
    photo: photo("pieter"),
    accountStatus: "Pending Approval",
    createdAt: "2026-08-24",
    availability: "Off Duty",
    shift: "Unassigned",
    responded: 0,
    avgResponseMin: 0,
  },
];

const iso = (daysAgo: number, hour: number, min = 0) => {
  const d = new Date("2026-08-28T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(hour, min, 0, 0);
  return d.toISOString();
};

export const INCIDENTS: Incident[] = [
  {
    id: "INC-2026-007",
    reporterId: "u-1",
    reporterName: "John Doe",
    reporterNumber: "STU-2026-4471",
    reporterPhone: "072 555 0111",
    reporterGender: "Male",
    officerId: "o-1",
    officerName: "John Smith",
    category: "Suspicious Activity",
    description:
      "Two unidentified individuals have been circling the residence parking area for the last 20 minutes and trying car door handles.",
    priority: "High",
    status: "Responding",
    lat: -25.7565,
    lng: 28.1961,
    locationName: "Main Campus Residence",
    reportedAt: iso(0, 9, 12),
    assignedAt: iso(0, 9, 15),
    evidence: [{ type: "photo", label: "parking-cctv.jpg" }],
    history: [
      { status: "Reported", at: iso(0, 9, 12) },
      { status: "Received", at: iso(0, 9, 13) },
      { status: "Officer Assigned", at: iso(0, 9, 15) },
      { status: "Responding", at: iso(0, 9, 16) },
    ],
  },
  {
    id: "INC-2026-008",
    reporterId: "u-3",
    reporterName: "Sipho Dlamini",
    reporterNumber: "STU-2026-3390",
    reporterPhone: "071 555 0133",
    reporterGender: "Male",
    category: "Medical Emergency",
    description: "Student collapsed near the residence entrance and is unresponsive.",
    priority: "Critical",
    status: "Reported",
    lat: -25.7572,
    lng: 28.2305,
    locationName: "Student Centre",
    reportedAt: iso(0, 11, 40),
    evidence: [],
    history: [{ status: "Reported", at: iso(0, 11, 40) }],
  },
  {
    id: "INC-2026-006",
    reporterId: "u-1",
    reporterName: "John Doe",
    reporterNumber: "STU-2026-4471",
    reporterPhone: "072 555 0111",
    reporterGender: "Male",
    officerId: "o-2",
    officerName: "Thandiwe Khumalo",
    category: "Theft",
    description: "Laptop taken from study cubicle on the second floor of the library.",
    priority: "High",
    status: "Closed",
    lat: -25.7539,
    lng: 28.229,
    locationName: "Library & Learning Centre",
    reportedAt: iso(3, 14, 5),
    assignedAt: iso(3, 14, 8),
    arrivedAt: iso(3, 14, 13),
    resolvedAt: iso(3, 15, 2),
    closedAt: iso(3, 15, 20),
    evidence: [{ type: "note", label: "Serial number provided" }],
    resolution: {
      outcome: "Resolved",
      whatHappened: "Laptop was removed by another student who mistook it for their own device.",
      actionTaken: "Device recovered, both parties interviewed, incident logged with CCTV footage.",
      description: "Property returned to owner on site.",
      attendedAt: iso(3, 14, 13),
    },
    history: [
      { status: "Reported", at: iso(3, 14, 5) },
      { status: "Received", at: iso(3, 14, 6) },
      { status: "Officer Assigned", at: iso(3, 14, 8) },
      { status: "Responding", at: iso(3, 14, 9) },
      { status: "Arrived", at: iso(3, 14, 13) },
      { status: "Resolved", at: iso(3, 15, 2) },
      { status: "Closed", at: iso(3, 15, 20) },
    ],
  },
  {
    id: "INC-2026-005",
    reporterId: "u-2",
    reporterName: "Naledi Mokoena",
    reporterNumber: "STF-2026-1180",
    reporterPhone: "083 555 0192",
    reporterGender: "Female",
    officerId: "o-1",
    officerName: "John Smith",
    category: "Unauthorized Access",
    description: "Side door of the engineering lab was forced open after hours.",
    priority: "Medium",
    status: "Resolved",
    lat: -25.7551,
    lng: 28.2312,
    locationName: "Engineering Building",
    reportedAt: iso(5, 21, 30),
    assignedAt: iso(5, 21, 33),
    arrivedAt: iso(5, 21, 44),
    resolvedAt: iso(5, 22, 10),
    evidence: [],
    resolution: {
      outcome: "Resolved",
      whatHappened: "Faulty door latch, no intrusion detected.",
      actionTaken: "Area swept and secured, maintenance ticket logged.",
      description: "Door secured with temporary lock.",
      attendedAt: iso(5, 21, 44),
    },
    history: [
      { status: "Reported", at: iso(5, 21, 30) },
      { status: "Received", at: iso(5, 21, 31) },
      { status: "Officer Assigned", at: iso(5, 21, 33) },
      { status: "Responding", at: iso(5, 21, 34) },
      { status: "Arrived", at: iso(5, 21, 44) },
      { status: "Resolved", at: iso(5, 22, 10) },
    ],
  },
  {
    id: "INC-2026-004",
    reporterId: "u-1",
    reporterName: "John Doe",
    reporterNumber: "STU-2026-4471",
    reporterPhone: "072 555 0111",
    reporterGender: "Male",
    category: "Disturbance",
    description: "Loud noise complaint at residence block C.",
    priority: "Medium",
    status: "Cancelled by Reporter",
    lat: -25.7565,
    lng: 28.1961,
    locationName: "Main Campus Residence",
    reportedAt: iso(8, 23, 5),
    cancelReason: "Situation resolved",
    evidence: [],
    history: [
      { status: "Reported", at: iso(8, 23, 5) },
      { status: "Cancelled by Reporter", at: iso(8, 23, 22) },
    ],
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-1",
    userId: "u-1",
    title: "Officer responding",
    message: "Officer John Smith is responding to your location for #INC-2026-007.",
    read: false,
    createdAt: iso(0, 9, 16),
    tone: "emergency",
  },
  {
    id: "n-2",
    userId: "u-1",
    title: "Security officer assigned",
    message: "Officer John Smith has been assigned to incident #INC-2026-007.",
    read: false,
    createdAt: iso(0, 9, 15),
    tone: "info",
  },
  {
    id: "n-3",
    userId: "u-1",
    title: "Report received",
    message: "Your incident report #INC-2026-007 has been received by the control room.",
    read: true,
    createdAt: iso(0, 9, 13),
    tone: "info",
  },
  {
    id: "n-4",
    userId: "u-1",
    title: "Incident resolved",
    message: "Incident #INC-2026-006 has been resolved and closed.",
    read: true,
    createdAt: iso(3, 15, 20),
    tone: "success",
  },
];

export const DAILY_INCIDENTS = [
  { day: "Mon", incidents: 12, emergency: 2 },
  { day: "Tue", incidents: 9, emergency: 1 },
  { day: "Wed", incidents: 15, emergency: 3 },
  { day: "Thu", incidents: 11, emergency: 1 },
  { day: "Fri", incidents: 18, emergency: 2 },
  { day: "Sat", incidents: 22, emergency: 4 },
  { day: "Sun", incidents: 14, emergency: 2 },
];

export const CATEGORY_SPLIT = [
  { name: "Theft", value: 34 },
  { name: "Suspicious Activity", value: 26 },
  { name: "Medical", value: 14 },
  { name: "Disturbance", value: 12 },
  { name: "Other", value: 14 },
];

export const RESPONSE_TREND = [
  { month: "Mar", minutes: 12 },
  { month: "Apr", minutes: 11 },
  { month: "May", minutes: 10 },
  { month: "Jun", minutes: 9 },
  { month: "Jul", minutes: 8 },
  { month: "Aug", minutes: 7 },
];

export const RISK_LOCATIONS = [
  { location: "North Gate Parking", incidents: 28 },
  { location: "Main Residence", incidents: 24 },
  { location: "Library", incidents: 17 },
  { location: "Sports Complex", incidents: 11 },
  { location: "Science Faculty", incidents: 8 },
];

export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.max(1, Math.round(diff / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}

export function responseMinutes(i: Incident) {
  if (!i.arrivedAt) return null;
  return Math.round(
    (new Date(i.arrivedAt).getTime() - new Date(i.reportedAt).getTime()) / 60000,
  );
}

export function responseGrade(mins: number | null) {
  if (mins === null) return { label: "Pending", tone: "muted" as const };
  if (mins <= 10) return { label: "On Time", tone: "success" as const };
  if (mins <= 20) return { label: "Delayed", tone: "warning" as const };
  return { label: "Critical Delay", tone: "emergency" as const };
}
