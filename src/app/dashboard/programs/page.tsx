"use client";

import { useState } from "react";
import {
  Building2,
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import Input from "@/components/ui/Input";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type Department = {
  _id: Id<"departments">;
  _creationTime: number;
  name: string;
  abbreviation?: string;
  isActive: boolean;
  order: number;
};

type Program = {
  _id: Id<"programs">;
  _creationTime: number;
  name: string;
  departmentId: Id<"departments">;
  departmentName: string;
  isActive: boolean;
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDestructive = false,
  saving = false
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  saving?: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="font-heading text-lg font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60",
              isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-maroon-800 hover:bg-maroon-900"
            )}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Department Modal ──────────────────────────────────────────────────────────

function DeptModal({
  editing,
  onClose,
}: {
  editing: Department | null;
  onClose: () => void;
}) {
  const create = useMutation(api.programs.createDepartment);
  const update = useMutation(api.programs.updateDepartment);

  const [name, setName] = useState(editing?.name ?? "");
  const [abbr, setAbbr] = useState(editing?.abbreviation ?? "");
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) { setError("Department name is required."); return; }

    if (editing && !confirmOpen) {
      setConfirmOpen(true);
      return;
    }

    setConfirmOpen(false);
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await update({ id: editing._id, name, abbreviation: abbr || undefined, isActive });
      } else {
        await create({ name, abbreviation: abbr || undefined });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="font-heading text-xl font-bold text-gray-900">
            {editing ? "Edit Department" : "Add Department"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Input
            label="Department Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. College of Engineering"
            required
          />
          <Input
            label="Abbreviation"
            value={abbr}
            onChange={(e) => setAbbr(e.target.value)}
            placeholder="e.g. COEng"
          />
          {editing && (
            <div className="flex items-center gap-3">
              <input
                id="dept-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-maroon-600 focus:ring-maroon-500"
              />
              <label htmlFor="dept-active" className="text-sm font-medium text-gray-700">
                Active (visible in student forms)
              </label>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-maroon-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-maroon-900 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? "Save Changes" : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
    <ConfirmModal
      isOpen={confirmOpen}
      title="Confirm Update"
      message={`Are you sure you want to update "${editing?.name}"?`}
      onCancel={() => setConfirmOpen(false)}
      onConfirm={() => handleSubmit()}
      saving={saving}
    />
    </>
  );
}

// ── Program Modal ─────────────────────────────────────────────────────────────

function ProgModal({
  editing,
  departments,
  defaultDeptId,
  onClose,
}: {
  editing: Program | null;
  departments: Department[];
  defaultDeptId: Id<"departments"> | null;
  onClose: () => void;
}) {
  const create = useMutation(api.programs.createProgram);
  const update = useMutation(api.programs.updateProgram);

  const [name, setName] = useState(editing?.name ?? "");
  const [deptId, setDeptId] = useState<Id<"departments"> | "">(
    editing?.departmentId ?? defaultDeptId ?? ""
  );
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) { setError("Program name is required."); return; }
    if (!deptId) { setError("Please select a department."); return; }

    if (editing && !confirmOpen) {
      setConfirmOpen(true);
      return;
    }

    setConfirmOpen(false);
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await update({ id: editing._id, name, departmentId: deptId as Id<"departments">, isActive });
      } else {
        await create({ name, departmentId: deptId as Id<"departments"> });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="font-heading text-xl font-bold text-gray-900">
            {editing ? "Edit Program" : "Add Program"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Input
            label="Program Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. BS Computer Engineering"
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Department *
            </label>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value as Id<"departments">)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          {editing && (
            <div className="flex items-center gap-3">
              <input
                id="prog-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-maroon-600 focus:ring-maroon-500"
              />
              <label htmlFor="prog-active" className="text-sm font-medium text-gray-700">
                Active (visible in student forms)
              </label>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-maroon-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-maroon-900 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? "Save Changes" : "Add Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
    <ConfirmModal
      isOpen={confirmOpen}
      title="Confirm Update"
      message={`Are you sure you want to update "${editing?.name}"?`}
      onCancel={() => setConfirmOpen(false)}
      onConfirm={() => handleSubmit()}
      saving={saving}
    />
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

export default function ProgramsPage() {
  const { user: currentUser } = useAuthStore();

  const departments = useQuery(api.programs.listDepartments, { includeInactive: true });
  const [selectedDeptId, setSelectedDeptId] = useState<Id<"departments"> | null>(null);
  const programs = useQuery(
    api.programs.listPrograms,
    selectedDeptId
      ? { departmentId: selectedDeptId, includeInactive: true }
      : { includeInactive: true }
  );

  const deleteDept = useMutation(api.programs.deleteDepartment);
  const deleteProg = useMutation(api.programs.deleteProgram);

  const [deptModal, setDeptModal] = useState<{ open: boolean; editing: Department | null }>({
    open: false,
    editing: null,
  });
  const [progModal, setProgModal] = useState<{ open: boolean; editing: Program | null }>({
    open: false,
    editing: null,
  });
  const [deleteError, setDeleteError] = useState("");

  const [deptPage, setDeptPage] = useState(1);
  const [progPage, setProgPage] = useState(1);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  } | null>(null);

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
        <ShieldCheck className="h-10 w-10 text-gray-300" />
        <p className="font-medium">Admin access required</p>
        <p className="text-sm">Only administrators can manage programs and departments.</p>
      </div>
    );
  }

  const handleDeleteDept = async (d: Department) => {
    setDeleteError("");
    setDeleteConfirm({
      open: true,
      title: "Delete Department",
      message: `Delete "${d.name}"? This cannot be undone.`,
      action: async () => {
        setDeleteConfirm(null);
        try {
          await deleteDept({ id: d._id });
          if (selectedDeptId === d._id) setSelectedDeptId(null);
        } catch (err) {
          setDeleteError(err instanceof Error ? err.message : "Failed to delete.");
        }
      }
    });
  };

  const handleDeleteProg = async (p: Program) => {
    setDeleteConfirm({
      open: true,
      title: "Delete Program",
      message: `Delete "${p.name}"? This cannot be undone.`,
      action: async () => {
        setDeleteConfirm(null);
        await deleteProg({ id: p._id });
      }
    });
  };

  const sortedDepartments = departments
    ? [...departments].sort((a, b) => b._creationTime - a._creationTime)
    : undefined;

  const selectedDept = sortedDepartments?.find((d) => d._id === selectedDeptId) ?? null;

  const programsForDept = selectedDeptId
    ? programs?.filter((p) => p.departmentId === selectedDeptId)
    : programs;

  const sortedProgramsForDept = programsForDept
    ? [...programsForDept].sort((a, b) => b._creationTime - a._creationTime)
    : undefined;

  const totalDeptPages = sortedDepartments ? Math.max(1, Math.ceil(sortedDepartments.length / ITEMS_PER_PAGE)) : 1;
  const paginatedDepartments = sortedDepartments?.slice(
    (deptPage - 1) * ITEMS_PER_PAGE,
    deptPage * ITEMS_PER_PAGE
  );

  const totalProgPages = sortedProgramsForDept ? Math.max(1, Math.ceil(sortedProgramsForDept.length / ITEMS_PER_PAGE)) : 1;
  const paginatedPrograms = sortedProgramsForDept?.slice(
    (progPage - 1) * ITEMS_PER_PAGE,
    progPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Programs &amp; Departments
          </h1>
          <p className="text-sm text-gray-500">
            Manage academic departments and their programs for student registration
          </p>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {deleteError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Departments Panel */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden p-0! flex flex-col h-[500px] lg:h-[600px]">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 font-medium text-gray-900">
                <Building2 className="h-4 w-4 text-maroon-700" />
                Departments
                {departments !== undefined && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {departments.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setDeptModal({ open: true, editing: null })}
                className="flex items-center gap-1 rounded-lg bg-maroon-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {departments === undefined ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-maroon-700" />
                </div>
              ) : departments.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-gray-400">
                  No departments yet. Add one or load default data.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {paginatedDepartments?.map((dept) => (
                    <li
                      key={dept._id}
                      onClick={() => {
                        setSelectedDeptId(selectedDeptId === dept._id ? null : dept._id);
                        setProgPage(1);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50",
                        selectedDeptId === dept._id && "bg-maroon-50"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-sm font-medium", !dept.isActive && "text-gray-400 line-through")}>
                          {dept.name}
                        </p>
                        {dept.abbreviation && (
                          <p className="text-xs text-gray-500">{dept.abbreviation}</p>
                        )}
                      </div>
                      <div className="ml-2 flex shrink-0 items-center gap-1">
                        {selectedDeptId === dept._id && (
                          <ChevronRight className="h-4 w-4 text-maroon-600" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeptModal({ open: true, editing: dept as Department });
                          }}
                          className="rounded p-1 text-gray-400 hover:bg-maroon-50 hover:text-maroon-700"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDept(dept as Department);
                          }}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Departments Pagination */}
            {totalDeptPages > 1 && (
              <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-4 py-3 sm:px-6">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{deptPage}</span> of{" "}
                  <span className="font-medium">{totalDeptPages}</span>
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDeptPage((prev) => Math.max(1, prev - 1))}
                    disabled={deptPage === 1}
                    className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeptPage((prev) => Math.min(totalDeptPages, prev + 1))}
                    disabled={deptPage === totalDeptPages}
                    className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Programs Panel */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden p-0! flex flex-col h-[500px] lg:h-[600px]">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 font-medium text-gray-900">
                <GraduationCap className="h-4 w-4 text-maroon-700" />
                {selectedDept ? (
                  <span className="truncate max-w-50" title={selectedDept.name}>
                    {selectedDept.abbreviation ?? selectedDept.name}
                  </span>
                ) : (
                  "All Programs"
                )}
                {programsForDept !== undefined && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {programsForDept.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setProgModal({ open: true, editing: null })}
                className="flex items-center gap-1 rounded-lg bg-maroon-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {programs === undefined ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-maroon-700" />
                </div>
              ) : programsForDept?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 py-10 text-center text-sm text-gray-400">
                  <BookOpen className="mb-2 h-8 w-8 text-gray-200" />
                  {selectedDept
                    ? `No programs in ${selectedDept.name} yet.`
                    : "No programs yet. Select a department or add one."}
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {paginatedPrograms?.map((prog) => (
                    <li key={prog._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm font-medium text-gray-900", !prog.isActive && "text-gray-400 line-through")}>
                          {prog.name}
                        </p>
                        {!selectedDeptId && (
                          <p className="text-xs text-gray-500">{prog.departmentName}</p>
                        )}
                      </div>
                      <div className="ml-2 flex shrink-0 items-center gap-1">
                        {!prog.isActive && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                            Inactive
                          </span>
                        )}
                        <button
                          onClick={() => setProgModal({ open: true, editing: prog as Program })}
                          className="rounded p-1 text-gray-400 hover:bg-maroon-50 hover:text-maroon-700"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProg(prog as Program)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Programs Pagination */}
            {totalProgPages > 1 && (
              <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-4 py-3 sm:px-6">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{progPage}</span> of{" "}
                  <span className="font-medium">{totalProgPages}</span>
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setProgPage((prev) => Math.max(1, prev - 1))}
                    disabled={progPage === 1}
                    className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setProgPage((prev) => Math.min(totalProgPages, prev + 1))}
                    disabled={progPage === totalProgPages}
                    className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {deptModal.open && (
        <DeptModal
          editing={deptModal.editing}
          onClose={() => setDeptModal({ open: false, editing: null })}
        />
      )}
      {progModal.open && (
        <ProgModal
          editing={progModal.editing}
          departments={(departments ?? []) as Department[]}
          defaultDeptId={selectedDeptId}
          onClose={() => setProgModal({ open: false, editing: null })}
        />
      )}
      {deleteConfirm && (
        <ConfirmModal
          isOpen={deleteConfirm.open}
          title={deleteConfirm.title}
          message={deleteConfirm.message}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={deleteConfirm.action}
          isDestructive={true}
        />
      )}
    </div>
  );
}
