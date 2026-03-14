"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Trash2,
  UserX,
  UserCheck,
  Loader2,
  Upload,
  X,
  ChevronDown,
} from "lucide-react";
import Input from "@/components/ui/Input";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import type { Id } from "../../../../convex/_generated/dataModel";

const DEPARTMENTS = [
  "College of Arts and Sciences",
  "College of Business and Accountancy",
  "College of Education",
  "College of Engineering",
  "College of Nursing and Health Sciences",
  "Institute of Graduate Studies and Research",
];

const PROGRAMS: Record<string, string[]> = {
  "College of Arts and Sciences": [
    "BS Psychology",
    "BS Biology",
    "BA Communication",
    "BA Political Science",
    "BS Mathematics",
  ],
  "College of Business and Accountancy": [
    "BS Accountancy",
    "BS Business Administration",
    "BS Management Accounting",
    "BS Entrepreneurship",
  ],
  "College of Education": [
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education",
    "Bachelor of Physical Education",
  ],
  "College of Engineering": [
    "BS Civil Engineering",
    "BS Mechanical Engineering",
    "BS Electrical Engineering",
    "BS Electronics Engineering",
    "BS Computer Engineering",
    "BS Industrial Engineering",
  ],
  "College of Nursing and Health Sciences": [
    "BS Nursing",
    "BS Medical Technology",
    "BS Pharmacy",
  ],
  "Institute of Graduate Studies and Research": [
    "Master of Arts in Education",
    "Master in Business Administration",
    "Doctor of Education",
  ],
};

interface AddStudentForm {
  studentNumber: string;
  name: string;
  program: string;
  department: string;
  year: number;
}

const EMPTY_FORM: AddStudentForm = {
  studentNumber: "",
  name: "",
  program: "",
  department: "",
  year: 0,
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddStudentForm>({ ...EMPTY_FORM });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const students = useQuery(api.students.list, {
    searchQuery: search || undefined,
    department: filterDept || undefined,
  });
  const counts = useQuery(api.students.getCounts);
  const nextStudentNumber = useQuery(api.students.getNextStudentNumber);

  const createStudent = useMutation(api.students.create);
  const deactivateStudent = useMutation(api.students.deactivate);
  const reactivateStudent = useMutation(api.students.reactivate);
  const removeStudent = useMutation(api.students.remove);

  const isLoading = students === undefined;

  useEffect(() => {
    if (showAdd && nextStudentNumber) {
      setForm((prev) => ({ ...prev, studentNumber: nextStudentNumber }));
    }
  }, [showAdd, nextStudentNumber]);

  const handleAdd = async () => {
    if (
      !form.studentNumber.trim() ||
      !form.name.trim() ||
      !form.program ||
      !form.department ||
      !form.year
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await createStudent({
        studentNumber: form.studentNumber.trim(),
        name: form.name.trim(),
        program: form.program,
        department: form.department,
        year: form.year,
      });
      setForm({ ...EMPTY_FORM });
      setShowAdd(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to add student."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id: Id<"students">) => {
    if (!confirm("Deactivate this student? They will no longer be able to use the chatbot.")) return;
    await deactivateStudent({ id });
  };

  const handleReactivate = async (id: Id<"students">) => {
    await reactivateStudent({ id });
  };

  const handleRemove = async (id: Id<"students">) => {
    if (!confirm("Permanently remove this student? This action cannot be undone.")) return;
    await removeStudent({ id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Student Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage enrolled students for chatbot verification
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-maroon-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-maroon-900"
        >
          {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAdd ? "Cancel" : "Add Student"}
        </button>
      </div>

      {/* Summary Cards */}
      {counts && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Students",
              value: counts.total,
              icon: GraduationCap,
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Active",
              value: counts.active,
              icon: UserCheck,
              color: "bg-green-50 text-green-700",
            },
            {
              label: "Inactive",
              value: counts.inactive,
              icon: UserX,
              color: "bg-red-50 text-red-700",
            },
            {
              label: "Departments",
              value: counts.byDepartment.length,
              icon: Upload,
              color: "bg-purple-50 text-purple-700",
            },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Student Form */}
      {showAdd && (
        <div className="card">
          <h2 className="mb-4 font-heading text-lg font-bold text-gray-900">
            Add New Student
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Student Number
              </label>
              <Input
                value={form.studentNumber}
                onChange={(e) =>
                  setForm({ ...form, studentNumber: e.target.value })
                }
                placeholder="e.g. 2024-00123"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Juan Dela Cruz"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Department
              </label>
              <div className="relative">
                <select
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value, program: "" })
                  }
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-8 text-sm text-gray-900 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Program
              </label>
              <div className="relative">
                <select
                  value={form.program}
                  onChange={(e) =>
                    setForm({ ...form, program: e.target.value })
                  }
                  disabled={!form.department}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-8 text-sm text-gray-900 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20 disabled:opacity-50"
                >
                  <option value="">
                    {form.department ? "Select program" : "Select department first"}
                  </option>
                  {form.department &&
                    PROGRAMS[form.department]?.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Year Level
              </label>
              <div className="relative">
                <select
                  value={form.year || ""}
                  onChange={(e) =>
                    setForm({ ...form, year: parseInt(e.target.value) || 0 })
                  }
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-8 text-sm text-gray-900 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                >
                  <option value="">Select year</option>
                  {[1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y}>
                      {y === 5 ? "5th Year" : `${y}${y === 1 ? "st" : y === 2 ? "nd" : y === 3 ? "rd" : "th"} Year`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {formError && (
            <p className="mt-3 text-sm text-red-600">{formError}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-maroon-900 disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Student
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, student number, or program..."
            className="pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-8 text-sm text-gray-900 transition-colors focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Students Table */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
        </div>
      ) : (
        <div className="card overflow-hidden p-0!">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Student Number
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 hidden lg:table-cell">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Year
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">
                        {student.studentNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        <span className="text-xs">{student.department}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                        <span className="text-xs">{student.program}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.year}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                            student.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {student.isActive ? (
                            <button
                              onClick={() =>
                                handleDeactivate(
                                  student._id as Id<"students">
                                )
                              }
                              className="rounded-lg p-1.5 text-orange-600 transition-colors hover:bg-orange-50"
                              title="Deactivate"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleReactivate(
                                  student._id as Id<"students">
                                )
                              }
                              className="rounded-lg p-1.5 text-green-600 transition-colors hover:bg-green-50"
                              title="Reactivate"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleRemove(student._id as Id<"students">)
                            }
                            className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                            title="Remove permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      {search || filterDept
                        ? "No students match your search criteria."
                        : "No students in the database yet. Add your first student above."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
