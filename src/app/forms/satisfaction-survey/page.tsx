"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { ClipboardList, CheckCircle, Star } from "lucide-react";

const CRITERIA = [
  "Overall library experience",
  "Staff helpfulness and courtesy",
  "Book and resource availability",
  "Facility cleanliness and comfort",
  "Digital resource accessibility",
  "AI chatbot usefulness",
];

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-0.5"
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          >
            <Star className={`h-6 w-6 transition-colors ${n <= value ? "fill-gold-400 text-gold-400" : "text-gray-300 hover:text-gold-300"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SatisfactionSurveyPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        title="Customer Satisfaction Survey"
        subtitle="Help us improve our library services"
        breadcrumbs={[{ label: "Online Forms" }, { label: "Satisfaction Survey" }]}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <div className="card text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 font-heading text-2xl font-bold text-gray-900">Thank You!</h2>
              <p className="mt-2 text-gray-600">Your feedback helps us improve our services for the MSEUF community.</p>
              <Button className="mt-6" onClick={() => { setSubmitted(false); setRatings({}); }}>Submit Another Survey</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <ClipboardList className="h-6 w-6 text-maroon-700" />
                <h2 className="font-heading text-xl font-bold text-gray-900">Rate Our Services</h2>
              </div>

              <p className="text-sm text-gray-600">Please rate the following aspects of our library services (1 = Poor, 5 = Excellent):</p>

              <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                {CRITERIA.map((c) => (
                  <RatingRow
                    key={c}
                    label={c}
                    value={ratings[c] || 0}
                    onChange={(v) => setRatings((r) => ({ ...r, [c]: v }))}
                  />
                ))}
              </div>

              <div>
                <label htmlFor="comments" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Additional Comments or Suggestions
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  placeholder="Share your thoughts on how we can improve..."
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">Submit Survey</Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
