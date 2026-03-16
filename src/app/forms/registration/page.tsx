"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserPlus, CheckCircle, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState<Id<"departments"> | null>(null);
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [contact, setContact] = useState("");

  const departments = useQuery(api.programs.listDepartments, {});
  const programs = useQuery(
    api.programs.listPrograms,
    departmentId ? { departmentId } : "skip",
  );
  const submitRegistration = useMutation(api.forms.submitRegistration);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = departments?.find((d) => d._id === e.target.value);
    setDepartment(selected?.name ?? "");
    setDepartmentId(selected?._id ?? null);
    setProgram("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await submitRegistration({
        name,
        studentId,
        email,
        department,
        program: program || undefined,
        yearLevel,
        contact,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setStudentId("");
    setEmail("");
    setDepartment("");
    setDepartmentId(null);
    setProgram("");
    setYearLevel("");
    setContact("");
  };

  return (
    <>
      <PageHeader
        title="Library Account Registration"
        subtitle="Register for a library account to access services"
        breadcrumbs={[{ label: "Online Forms" }, { label: "Registration" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <div className="card text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 font-heading text-2xl font-bold text-gray-900">Registration Submitted!</h2>
              <p className="mt-2 text-gray-600">Your account is being processed. You will receive a confirmation email.</p>
              <Button className="mt-6" onClick={handleReset}>Register Another Account</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <UserPlus className="h-6 w-6 text-maroon-700" />
                <h2 className="font-heading text-xl font-bold text-gray-900">Registration Form</h2>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" required />
                <Input label="Student / Employee ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="2024-00001" required />
              </div>

              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@mseuf.edu.ph" required />

              {/* Department */}
              <div>
                <label htmlFor="college" className="mb-1.5 block text-sm font-medium text-gray-700">
                  College / Department
                </label>
                <select
                  id="college"
                  required
                  value={departmentId ?? ""}
                  onChange={handleDepartmentChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                >
                  <option value="">Select department</option>
                  {(departments ?? []).map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                  <option value="faculty">Faculty / Staff</option>
                </select>
              </div>

              {/* Program — always visible, muted/disabled until department is selected */}
              <div>
                <label htmlFor="program" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Program
                </label>
                <select
                  id="program"
                  required={!!departmentId}
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  disabled={!departmentId || programs === undefined}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                >
                  {!departmentId && (
                    <option value="">
                      Select department first
                    </option>
                  )}
                  {departmentId && programs === undefined && (
                    <option value="">
                      Loading programs…
                    </option>
                  )}
                  {departmentId && programs !== undefined && (
                    <>
                      <option value="">Select program</option>
                      {programs.map((p) => (
                        <option key={p._id} value={p.name}>{p.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Year Level & Contact */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="year" className="mb-1.5 block text-sm font-medium text-gray-700">Year Level</label>
                  <select id="year" required value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20">
                    <option value="">Select</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>5th Year</option>
                    <option>Graduate Student</option>
                    <option>Faculty / Staff</option>
                  </select>
                </div>
                <Input label="Contact Number" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+63 912 345 6789" required />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Registration
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
