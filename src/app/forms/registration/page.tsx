"use client";

import { useState, useRef, useCallback } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserPlus, CheckCircle, Loader2, UploadCloud, X, FileImage } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [proofError, setProofError] = useState("");

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState<Id<"departments"> | null>(null);
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [contact, setContact] = useState("");

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const departments = useQuery(api.programs.listDepartments, {});
  const programs = useQuery(
    api.programs.listPrograms,
    departmentId ? { departmentId } : "skip",
  );
  const submitRegistration = useMutation(api.forms.submitRegistration);
  const generateUploadUrl = useMutation(api.forms.generateUploadUrl);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = departments?.find((d) => d._id === e.target.value);
    setDepartment(selected?.name ?? "");
    setDepartmentId(selected?._id ?? null);
    setProgram("");
  };

  const handleFileSelect = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setProofError("Only JPG, PNG, WEBP, or PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProofError("File must be smaller than 5 MB.");
      return;
    }
    setProofError("");
    setProofFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setProofPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setProofPreview(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      if (!proofFile) {
        setProofError("Proof of Enrollment is required.");
        setIsSubmitting(false);
        return;
      }
      let enrollmentProof: Id<"_storage"> | undefined;

      if (proofFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": proofFile.type },
          body: proofFile,
        });
        if (!result.ok) throw new Error("File upload failed. Please try again.");
        const { storageId } = await result.json();
        enrollmentProof = storageId as Id<"_storage">;
      }

      await submitRegistration({
        name,
        studentId,
        email,
        department,
        program: program || undefined,
        yearLevel,
        contact,
        enrollmentProof,
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
    setProofFile(null);
    setProofPreview(null);
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

              {/* Program */}
              <div>
                <label htmlFor="program" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Program
                </label>
                <select
                  id="program"
                  required
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  disabled={!departmentId || programs === undefined}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                >
                  {!departmentId && (
                    <option value="">Select department first</option>
                  )}
                  {departmentId && programs === undefined && (
                    <option value="">Loading programs…</option>
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
                <Input
                  label="Contact Number"
                  type="tel"
                  value={contact}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setContact(digitsOnly);
                  }}
                  placeholder="09123456789"
                  maxLength={11}
                  pattern="^09\d{9}$"
                  title="Please enter an 11-digit mobile number starting with 09 (e.g. 09123456789)."
                  required
                />
              </div>

              {/* Proof of Enrollment Upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Proof of Enrollment
                  <span className="ml-1 text-xs font-normal text-gray-400">(required — JPG, PNG, PDF · max 5 MB)</span>
                </label>

                {proofFile ? (
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {proofPreview ? (
                      <img src={proofPreview} alt="Preview" className="h-14 w-14 rounded object-cover border border-gray-200 shrink-0" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded bg-maroon-50 shrink-0">
                        <FileImage className="h-7 w-7 text-maroon-600" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{proofFile.name}</p>
                      <p className="text-xs text-gray-500">{(proofFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setProofFile(null); setProofPreview(null); }}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
                      isDragging
                        ? "border-maroon-400 bg-maroon-50"
                        : "border-gray-300 bg-gray-50 hover:border-maroon-400 hover:bg-maroon-50/40"
                    }`}
                  >
                    <UploadCloud className={`h-8 w-8 ${isDragging ? "text-maroon-500" : "text-gray-400"}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Drag & drop your file here, or <span className="text-maroon-700 underline">browse</span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">Certificate of Registration, enrollment form, or similar document</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                )}
                {proofError && (
                  <p className="mt-1 text-xs text-red-600">{proofError}</p>
                )}
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
