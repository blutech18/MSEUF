"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { CalendarDays, CheckCircle } from "lucide-react";

export default function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        title="Library Online Appointment"
        subtitle="Schedule your visit or reserve a facility"
        breadcrumbs={[{ label: "Online Forms" }, { label: "Appointment" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <div className="card text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 font-heading text-2xl font-bold text-gray-900">Appointment Submitted!</h2>
              <p className="mt-2 text-gray-600">We will confirm your appointment via email. Please check your inbox.</p>
              <Button className="mt-6" onClick={() => setSubmitted(false)}>Book Another Appointment</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <CalendarDays className="h-6 w-6 text-maroon-700" />
                <h2 className="font-heading text-xl font-bold text-gray-900">Appointment Details</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" id="name" placeholder="Juan Dela Cruz" required />
                <Input label="Student / Employee ID" id="studentId" placeholder="2024-00001" required />
              </div>
              <Input label="Email Address" id="email" type="email" placeholder="juan@mseuf.edu.ph" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Preferred Date" id="date" type="date" required />
                <div>
                  <label htmlFor="time" className="mb-1.5 block text-sm font-medium text-gray-700">Preferred Time</label>
                  <select id="time" required className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20">
                    <option value="">Select time slot</option>
                    <option>7:00 AM – 9:00 AM</option>
                    <option>9:00 AM – 11:00 AM</option>
                    <option>11:00 AM – 1:00 PM</option>
                    <option>1:00 PM – 3:00 PM</option>
                    <option>3:00 PM – 5:00 PM</option>
                    <option>5:00 PM – 7:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="purpose" className="mb-1.5 block text-sm font-medium text-gray-700">Purpose of Visit</label>
                <textarea id="purpose" rows={3} required placeholder="Describe the purpose of your appointment..." className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20" />
              </div>

              <Button type="submit" size="lg" className="w-full">Submit Appointment Request</Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
