"use client";

import { useState } from "react";
import {
  CalendarDays,
  UserPlus,
  RefreshCw,
  ClipboardList,
  Loader2,
  Star,
  Check,
  X,
  Clock,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import type { Id } from "../../../../convex/_generated/dataModel";

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "registrations", label: "Registrations", icon: UserPlus },
  { key: "renewals", label: "Book Renewals", icon: RefreshCw },
  { key: "surveys", label: "Surveys", icon: ClipboardList },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600")}>
      {status}
    </span>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

// ── Appointments Tab ──────────────────────────────────────────────────────────

function AppointmentsTab({ filter }: { filter: string }) {
  const rows = useQuery(api.forms.listAppointments, filter ? { status: filter } : {});
  const updateStatus = useMutation(api.forms.updateAppointmentStatus);
  const deleteAppointment = useMutation(api.forms.deleteAppointment);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Id<"appointments"> | null>(null);

  if (rows === undefined)
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-maroon-700" /></div>;
  if (rows.length === 0)
    return <p className="py-12 text-center text-sm text-gray-400">No appointments found.</p>;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Time</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{r.name}<div className="text-xs text-gray-500">{r.studentId}</div></td>
              <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{r.email}</td>
              <td className="px-4 py-3 text-gray-600">{r.date}</td>
              <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{r.time}</td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {r.status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus({ id: r._id as Id<"appointments">, status: "confirmed" })}
                        className="rounded p-1.5 text-green-600 hover:bg-green-50"
                        title="Confirm"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateStatus({ id: r._id as Id<"appointments">, status: "cancelled" })}
                        className="rounded p-1.5 text-amber-600 hover:bg-amber-50"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                  <button
                    onClick={() => setAppointmentToDelete(r._id as Id<"appointments">)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {appointmentToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-gray-900">Delete appointment?</h3>
            <p className="text-sm text-gray-600">
              This will permanently remove the selected appointment submission. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAppointment({ id: appointmentToDelete });
                  setAppointmentToDelete(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Registrations Tab ─────────────────────────────────────────────────────────

function RegistrationsTab({ filter }: { filter: string }) {
  const rows = useQuery(api.forms.listRegistrations, filter ? { status: filter } : {});
  const updateStatus = useMutation(api.forms.updateRegistrationStatus);
  const deleteRegistration = useMutation(api.forms.deleteRegistration);
  const [registrationToDelete, setRegistrationToDelete] = useState<Id<"registrations"> | null>(null);

  if (rows === undefined)
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-maroon-700" /></div>;
  if (rows.length === 0)
    return <p className="py-12 text-center text-sm text-gray-400">No registrations found.</p>;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Email</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Department</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Year</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{r.name}<div className="text-xs text-gray-500">{r.studentId}</div></td>
              <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{r.email}</td>
              <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">{r.department}</td>
              <td className="px-4 py-3 text-gray-600">{r.yearLevel}</td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {r.status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus({ id: r._id as Id<"registrations">, status: "approved" })}
                        className="rounded p-1.5 text-green-600 hover:bg-green-50"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateStatus({ id: r._id as Id<"registrations">, status: "rejected" })}
                        className="rounded p-1.5 text-amber-600 hover:bg-amber-50"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                  <button
                    onClick={() => setRegistrationToDelete(r._id as Id<"registrations">)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {registrationToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-gray-900">Delete registration?</h3>
            <p className="text-sm text-gray-600">
              This will permanently remove the selected library registration. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRegistrationToDelete(null)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRegistration({ id: registrationToDelete });
                  setRegistrationToDelete(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Book Renewals Tab ─────────────────────────────────────────────────────────

function RenewalsTab({ filter }: { filter: string }) {
  const rows = useQuery(api.forms.listBookRenewals, filter ? { status: filter } : {});
  const updateStatus = useMutation(api.forms.updateRenewalStatus);
  const deleteRenewal = useMutation(api.forms.deleteRenewal);
  const [renewalToDelete, setRenewalToDelete] = useState<Id<"bookRenewals"> | null>(null);

  if (rows === undefined)
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-maroon-700" /></div>;
  if (rows.length === 0)
    return <p className="py-12 text-center text-sm text-gray-400">No renewal requests found.</p>;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Book Title</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Call #</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Period</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{r.name}<div className="text-xs text-gray-500">{r.libraryCardNumber}</div></td>
              <td className="px-4 py-3 text-gray-600 max-w-48 truncate">{r.bookTitle}</td>
              <td className="px-4 py-3 text-gray-600 hidden md:table-cell font-mono text-xs">{r.callNumber}</td>
              <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{r.renewalPeriod}</td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {r.status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus({ id: r._id as Id<"bookRenewals">, status: "approved" })}
                        className="rounded p-1.5 text-green-600 hover:bg-green-50"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateStatus({ id: r._id as Id<"bookRenewals">, status: "rejected" })}
                        className="rounded p-1.5 text-amber-600 hover:bg-amber-50"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                  <button
                    onClick={() => setRenewalToDelete(r._id as Id<"bookRenewals">)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renewalToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-gray-900">Delete book renewal?</h3>
            <p className="text-sm text-gray-600">
              This will permanently remove the selected book renewal request. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRenewalToDelete(null)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRenewal({ id: renewalToDelete });
                  setRenewalToDelete(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Surveys Tab ───────────────────────────────────────────────────────────────

function SurveysTab() {
  const rows = useQuery(api.forms.listSurveys, {});
  const deleteSurvey = useMutation(api.forms.deleteSurvey);
  const [surveyToDelete, setSurveyToDelete] = useState<Id<"surveys"> | null>(null);

  if (rows === undefined)
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-maroon-700" /></div>;
  if (rows.length === 0)
    return <p className="py-12 text-center text-sm text-gray-400">No surveys submitted yet.</p>;

  return (
    <div className="relative divide-y divide-gray-100">
      {rows.map((r) => {
        const avg = r.ratings.length > 0 ? r.ratings.reduce((s, x) => s + x.rating, 0) / r.ratings.length : 0;
        return (
          <div key={r._id} className="px-4 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={cn("h-4 w-4", n <= Math.round(avg) ? "fill-gold-400 text-gold-400" : "text-gray-200")} />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{avg.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                <button
                  onClick={() => setSurveyToDelete(r._id as Id<"surveys">)}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 grid gap-1 text-xs text-gray-500 sm:grid-cols-2 md:grid-cols-3">
              {r.ratings.map((x) => (
                <span key={x.criterion}>{x.criterion}: <strong>{x.rating}/5</strong></span>
              ))}
            </div>
            {r.comments && <p className="mt-2 text-sm text-gray-600 italic">&ldquo;{r.comments}&rdquo;</p>}
          </div>
        );
      })}

      {surveyToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-gray-900">Delete survey response?</h3>
            <p className="text-sm text-gray-600">
              This will permanently remove the selected survey response. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSurveyToDelete(null)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteSurvey({ id: surveyToDelete });
                  setSurveyToDelete(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FormSubmissionsPage() {
  const [tab, setTab] = useState<TabKey>("appointments");
  const [statusFilter, setStatusFilter] = useState("");
  const counts = useQuery(api.forms.getFormCounts, {});

  const statusOptions: Record<TabKey, string[]> = {
    appointments: ["pending", "confirmed", "cancelled"],
    registrations: ["pending", "approved", "rejected"],
    renewals: ["pending", "approved", "rejected"],
    surveys: [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Form Submissions</h1>
        <p className="text-sm text-gray-500">Review and manage online form submissions</p>
      </div>

      {/* Summary cards */}
      {counts && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Appointments", total: counts.appointments.total, pending: counts.appointments.pending, icon: CalendarDays, color: "bg-blue-50 text-blue-700" },
            { label: "Registrations", total: counts.registrations.total, pending: counts.registrations.pending, icon: UserPlus, color: "bg-green-50 text-green-700" },
            { label: "Book Renewals", total: counts.renewals.total, pending: counts.renewals.pending, icon: RefreshCw, color: "bg-purple-50 text-purple-700" },
            { label: "Surveys", total: counts.surveys.total, pending: 0, icon: ClipboardList, color: "bg-orange-50 text-orange-700" },
          ].map((c) => (
            <div key={c.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{c.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{c.total}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", c.color)}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
              {c.pending > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                  <Clock className="h-3.5 w-3.5" />
                  {c.pending} pending
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tabs + filter */}
      <div className="card overflow-hidden p-0!">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4">
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setStatusFilter(""); }}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  tab === t.key ? "border-maroon-700 text-maroon-800" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          {statusOptions[tab].length > 0 && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
            >
              <option value="">All statuses</option>
              {statusOptions[tab].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          )}
        </div>

        {/* Tab content */}
        {tab === "appointments" && <AppointmentsTab filter={statusFilter} />}
        {tab === "registrations" && <RegistrationsTab filter={statusFilter} />}
        {tab === "renewals" && <RenewalsTab filter={statusFilter} />}
        {tab === "surveys" && <SurveysTab />}
      </div>
    </div>
  );
}
