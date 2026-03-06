"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { RefreshCw, CheckCircle } from "lucide-react";

export default function BookRenewalPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        title="Online Book Renewal"
        subtitle="Renew your borrowed books online"
        breadcrumbs={[{ label: "Online Forms" }, { label: "Book Renewal" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <div className="card text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 font-heading text-2xl font-bold text-gray-900">Renewal Request Submitted!</h2>
              <p className="mt-2 text-gray-600">Your renewal is being processed. Check your email for confirmation.</p>
              <Button className="mt-6" onClick={() => setSubmitted(false)}>Renew Another Book</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <RefreshCw className="h-6 w-6 text-maroon-700" />
                <h2 className="font-heading text-xl font-bold text-gray-900">Book Renewal Form</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" id="name" placeholder="Juan Dela Cruz" required />
                <Input label="Library Card Number" id="cardNumber" placeholder="LIB-2024-0001" required />
              </div>
              <Input label="Book Title" id="bookTitle" placeholder="Enter the title of the book" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Call Number" id="callNumber" placeholder="QA76.6 .S65 2022" required />
                <Input label="Date Borrowed" id="dateBorrowed" type="date" required />
              </div>
              <div>
                <label htmlFor="renewalPeriod" className="mb-1.5 block text-sm font-medium text-gray-700">Renewal Period</label>
                <select id="renewalPeriod" required className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20">
                  <option value="">Select renewal period</option>
                  <option>3 days</option>
                  <option>1 week</option>
                </select>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                <strong>Note:</strong> Renewals are subject to availability and outstanding reservation requests. 
                Books can only be renewed once.
              </div>

              <Button type="submit" size="lg" className="w-full">Submit Renewal Request</Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
