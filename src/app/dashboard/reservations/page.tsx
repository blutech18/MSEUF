"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Clock,
  Check,
  X,
  Trash2,
  Loader2,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Filter,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import type { Id } from "../../../../convex/_generated/dataModel";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  borrowed: "bg-purple-100 text-purple-700",
  returned: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
  expired: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeUntilExpiry(expiresAt: number) {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m remaining`;
}

export default function ReservationsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [actionModal, setActionModal] = useState<{
    id: Id<"reservations">;
    action: string;
    bookTitle: string;
    studentName: string;
  } | null>(null);
  const [dateBorrowed, setDateBorrowed] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Id<"reservations"> | null>(null);

  const reservations = useQuery(
    api.reservations.list,
    statusFilter ? { status: statusFilter } : {}
  );
  const counts = useQuery(api.reservations.getCounts, {});
  const updateStatus = useMutation(api.reservations.updateStatus);
  const removeReservation = useMutation(api.reservations.remove);
  const expireOverdue = useMutation(api.reservations.expireOverdue);
  const [isExpiring, setIsExpiring] = useState(false);

  const handleExpireOverdue = async () => {
    setIsExpiring(true);
    try {
      const result = await expireOverdue({});
      if (result.expired > 0) {
        alert(`${result.expired} overdue reservation(s) have been expired.`);
      } else {
        alert("No overdue reservations found.");
      }
    } catch {
      alert("Failed to expire overdue reservations.");
    } finally {
      setIsExpiring(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!actionModal) return;
    try {
      const args: {
        id: Id<"reservations">;
        status: string;
        dateBorrowed?: string;
        returnDate?: string;
        cancelReason?: string;
      } = {
        id: actionModal.id,
        status: actionModal.action,
      };
      if (actionModal.action === "borrowed") {
        args.dateBorrowed = dateBorrowed || new Date().toISOString().split("T")[0];
      }
      if (actionModal.action === "returned" || actionModal.action === "borrowed") {
        if (returnDate) args.returnDate = returnDate;
      }
      if (actionModal.action === "cancelled") {
        args.cancelReason = cancelReason || "Cancelled by librarian";
      }
      await updateStatus(args);
    } catch {
      alert("Failed to update reservation status.");
    } finally {
      setActionModal(null);
      setDateBorrowed("");
      setReturnDate("");
      setCancelReason("");
    }
  };

  const isLoading = reservations === undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Reservations
          </h1>
          <p className="text-sm text-gray-500">
            Manage book reservations and borrowing status
          </p>
        </div>
        <button
          onClick={handleExpireOverdue}
          disabled={isExpiring}
          className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
        >
          {isExpiring ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          Auto-Expire Overdue
        </button>
      </div>

      {/* Summary Cards */}
      {counts && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Pending", value: counts.pending, icon: Clock, color: "bg-yellow-50 text-yellow-700" },
            { label: "Confirmed", value: counts.confirmed, icon: Check, color: "bg-blue-50 text-blue-700" },
            { label: "Borrowed", value: counts.borrowed, icon: BookOpen, color: "bg-purple-50 text-purple-700" },
            { label: "Returned", value: counts.returned, icon: RotateCcw, color: "bg-green-50 text-green-700" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter + Table */}
      <div className="card overflow-hidden p-0!">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          {counts && (
            <p className="text-xs text-gray-400">
              {counts.total} total reservations
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-maroon-700" />
          </div>
        ) : reservations.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">
            No reservations found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Book
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">
                    Dates
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 hidden lg:table-cell">
                    Expires
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 max-w-48 truncate">
                        {r.bookTitle}
                      </p>
                      {r.bookCallNumber && (
                        <p className="text-xs text-gray-400 font-mono">
                          {r.bookCallNumber}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {r.studentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.studentNumber}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">
                      {r.department}
                      <div className="text-gray-400">{r.program}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">
                      <div>Reserved: {formatDate(r.createdAt)}</div>
                      {r.dateBorrowed && (
                        <div>Borrowed: {r.dateBorrowed}</div>
                      )}
                      {r.returnDate && (
                        <div>Return: {r.returnDate}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {r.status === "pending" ? (
                        <span
                          className={cn(
                            "text-xs font-medium",
                            r.expiresAt <= Date.now()
                              ? "text-red-600"
                              : "text-amber-600"
                          )}
                        >
                          {timeUntilExpiry(r.expiresAt)}
                        </span>
                      ) : r.cancelReason ? (
                        <span className="text-xs text-gray-400 italic">
                          {r.cancelReason}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {r.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                setActionModal({
                                  id: r._id as Id<"reservations">,
                                  action: "confirmed",
                                  bookTitle: r.bookTitle,
                                  studentName: r.studentName,
                                })
                              }
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                              title="Confirm"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setActionModal({
                                  id: r._id as Id<"reservations">,
                                  action: "cancelled",
                                  bookTitle: r.bookTitle,
                                  studentName: r.studentName,
                                })
                              }
                              className="rounded p-1.5 text-amber-600 hover:bg-amber-50"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {r.status === "confirmed" && (
                          <>
                            <button
                              onClick={() =>
                                setActionModal({
                                  id: r._id as Id<"reservations">,
                                  action: "borrowed",
                                  bookTitle: r.bookTitle,
                                  studentName: r.studentName,
                                })
                              }
                              className="rounded p-1.5 text-purple-600 hover:bg-purple-50"
                              title="Mark as Borrowed"
                            >
                              <BookOpen className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setActionModal({
                                  id: r._id as Id<"reservations">,
                                  action: "cancelled",
                                  bookTitle: r.bookTitle,
                                  studentName: r.studentName,
                                })
                              }
                              className="rounded p-1.5 text-amber-600 hover:bg-amber-50"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {r.status === "borrowed" && (
                          <button
                            onClick={() =>
                              setActionModal({
                                id: r._id as Id<"reservations">,
                                action: "returned",
                                bookTitle: r.bookTitle,
                                studentName: r.studentName,
                              })
                            }
                            className="rounded p-1.5 text-green-600 hover:bg-green-50"
                            title="Mark as Returned"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                        {["cancelled", "expired", "returned"].includes(
                          r.status
                        ) && (
                          <button
                            onClick={() =>
                              setDeleteTarget(r._id as Id<"reservations">)
                            }
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {actionModal.action === "confirmed"
                ? "Confirm Reservation"
                : actionModal.action === "borrowed"
                  ? "Mark as Borrowed"
                  : actionModal.action === "returned"
                    ? "Mark as Returned"
                    : "Cancel Reservation"}
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                <strong>Book:</strong> {actionModal.bookTitle}
              </p>
              <p>
                <strong>Student:</strong> {actionModal.studentName}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {actionModal.action === "borrowed" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Date Borrowed
                    </label>
                    <input
                      type="date"
                      value={dateBorrowed}
                      onChange={(e) => setDateBorrowed(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                    />
                  </div>
                </>
              )}

              {actionModal.action === "returned" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                  />
                </div>
              )}

              {actionModal.action === "cancelled" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Cancel Reason (optional)
                  </label>
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Not claimed within 24 hours"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActionModal(null);
                  setDateBorrowed("");
                  setReturnDate("");
                  setCancelReason("");
                }}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium text-white",
                  actionModal.action === "cancelled"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-maroon-800 hover:bg-maroon-900"
                )}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-gray-900">
              Delete reservation?
            </h3>
            <p className="text-sm text-gray-600">
              This will permanently remove this reservation record. This action
              cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeReservation({ id: deleteTarget });
                  setDeleteTarget(null);
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
