"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserPlus, CheckCircle } from "lucide-react";

export default function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              <Button className="mt-6" onClick={() => setSubmitted(false)}>Register Another Account</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <UserPlus className="h-6 w-6 text-maroon-700" />
                <h2 className="font-heading text-xl font-bold text-gray-900">Registration Form</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" id="fullName" placeholder="Juan Dela Cruz" required />
                <Input label="Student / Employee ID" id="studentId" placeholder="2024-00001" required />
              </div>
              <Input label="Email Address" id="email" type="email" placeholder="juan@mseuf.edu.ph" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="college" className="mb-1.5 block text-sm font-medium text-gray-700">College / Department</label>
                  <select id="college" required className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20">
                    <option value="">Select</option>
                    <option>College of Arts and Sciences</option>
                    <option>College of Business and Accountancy</option>
                    <option>College of Computer Studies</option>
                    <option>College of Education</option>
                    <option>College of Engineering</option>
                    <option>College of Law</option>
                    <option>College of Nursing</option>
                    <option>Institute of Graduate Studies</option>
                    <option>Faculty / Staff</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="year" className="mb-1.5 block text-sm font-medium text-gray-700">Year Level</label>
                  <select id="year" required className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20">
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
              </div>
              <Input label="Contact Number" id="contact" type="tel" placeholder="+63 912 345 6789" required />

              <Button type="submit" size="lg" className="w-full">Submit Registration</Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
