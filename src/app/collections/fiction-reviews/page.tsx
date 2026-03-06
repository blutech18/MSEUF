import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, Star } from "lucide-react";

export const metadata: Metadata = { title: "Fiction Reviews" };

const REVIEWS = [
  { title: "Noli Me Tangere", author: "José Rizal", rating: 5, review: "A timeless masterpiece that exposes the injustices of Spanish colonial rule in the Philippines. Essential reading for all Filipino students." },
  { title: "El Filibusterismo", author: "José Rizal", rating: 5, review: "The powerful sequel to Noli Me Tangere, exploring themes of revolution, justice, and social reform." },
  { title: "Dekada '70", author: "Lualhati Bautista", rating: 4, review: "A gripping portrayal of a family caught in the turbulence of martial law era Philippines." },
  { title: "Banaag at Sikat", author: "Lope K. Santos", rating: 4, review: "A classic Filipino novel that explores class struggle and social inequality through two contrasting characters." },
  { title: "Florante at Laura", author: "Francisco Balagtas", rating: 5, review: "A beloved epic poem that is a cornerstone of Filipino literary heritage." },
  { title: "Smaller and Smaller Circles", author: "F.H. Batacan", rating: 4, review: "The Philippines' first crime novel — a taut thriller that exposes urban decay and systemic corruption." },
];

export default function FictionReviewsPage() {
  return (
    <>
      <PageHeader title="Fiction Reviews" subtitle="Staff picks and reviews of fiction in our collection" breadcrumbs={[{ label: "Collections" }, { label: "Fiction Reviews" }]} />
      <div className="container-page section-padding">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.title} className="card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-50">
                <BookOpen className="h-6 w-6 text-maroon-700" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900">{r.title}</h3>
              <p className="text-sm text-gray-500">by {r.author}</p>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold-400 text-gold-400" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{r.review}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
