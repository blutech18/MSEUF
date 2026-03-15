"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  UserX,
  UserCheck,
  X,
  Users,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuthStore } from "@/stores/authStore";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "librarian" as "admin" | "librarian" | "staff",
};

const roleColor: Record<string, string> = {
  admin: "bg-maroon-100 text-maroon-800",
  librarian: "bg-blue-100 text-blue-800",
  staff: "bg-gray-100 text-gray-700",
};

export default function StaffPage() {
  const { user: currentUser } = useAuthStore();

  const staffList = useQuery(api.staff.listAll);
  const createStaff = useMutation(api.staff.createStaff);
  const updateStaff = useMutation(api.staff.updateStaff);
  const deactivateStaff = useMutation(api.staff.deactivateStaff);
  const reactivateStaff = useMutation(api.staff.reactivateStaff);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<Id<"staff"> | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
        <ShieldCheck className="h-10 w-10 text-gray-300" />
        <p className="font-medium">Admin access required</p>
        <p className="text-sm">Only administrators can manage staff accounts.</p>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (member: NonNullable<typeof staffList>[number]) => {
    setEditingId(member._id);
    setForm({
      name: member.name,
      email: member.email,
      password: "",
      role: member.role as "admin" | "librarian" | "staff",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError("");
    try {
      if (editingId) {
        await updateStaff({
          id: editingId,
          name: form.name,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });
      } else {
        if (!form.password) {
          setFormError("Password is required for new staff.");
          setIsSaving(false);
          return;
        }
        await createStaff({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }
      setShowModal(false);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (
    id: Id<"staff">,
    isActive: boolean,
    isSelf: boolean
  ) => {
    if (isSelf) return;
    if (
      isActive
        ? confirm("Deactivate this staff account?")
        : confirm("Reactivate this staff account?")
    ) {
      if (isActive) {
        await deactivateStaff({ id });
      } else {
        await reactivateStaff({ id });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Staff Accounts
          </h1>
          <p className="text-sm text-gray-500">
            {staffList === undefined
              ? "Loading…"
              : `${staffList.length} staff member${staffList.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      {staffList === undefined ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffList.map((member) => {
                const isSelf = member._id === currentUser?._id;
                return (
                  <tr key={member._id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-100 text-sm font-bold text-maroon-700">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {member.name}
                          {isSelf && (
                            <span className="ml-1 text-xs text-gray-400">
                              (you)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{member.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          roleColor[member.role] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          member.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(member)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-maroon-50 hover:text-maroon-700"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleActive(
                              member._id,
                              member.isActive,
                              isSelf
                            )
                          }
                          disabled={isSelf}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                          title={
                            isSelf
                              ? "Cannot deactivate your own account"
                              : member.isActive
                                ? "Deactivate"
                                : "Reactivate"
                          }
                        >
                          {member.isActive ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="text-gray-500">No staff accounts yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="font-heading text-xl font-bold text-gray-900">
                {editingId ? "Edit Staff Account" : "Add New Staff"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email Address *"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label={editingId ? "New Password (leave blank to keep)" : "Password *"}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editingId ? "Leave blank to keep current" : "Enter password"}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Role *
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as "admin" | "librarian" | "staff",
                    })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                >
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={isSaving}>
                  {editingId ? "Save Changes" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
