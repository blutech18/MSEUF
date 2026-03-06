import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, Clock, MapPin, AlertCircle, BookMarked, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Circulation and Reserve Section",
};

export default function CirculationReservePage() {
  return (
    <>
      <PageHeader
        title="Circulation and Reserve Section"
        subtitle="Information about our lending services and reserve materials"
        breadcrumbs={[
          { label: "Services", href: "/services/circulation-reserve" },
          { label: "Circulation and Reserve Section" },
        ]}
      />

      <div className="container-page section-padding">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="section-title text-2xl">About This Section</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                The Circulation and Reserve Section (CRS) manages the lending and return of library materials. 
                Books are organized using the Dewey Decimal Classification System, and users can locate materials 
                through the Online Public Access Cataloging (OPAC) system — Follett Destiny.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-maroon-800">Lending Policies</h3>
              <div className="mt-4 space-y-4">
                {[
                  { title: "Students", detail: "May borrow up to 2 circulation books for 3 days, renewable for another 3 days." },
                  { title: "Faculty", detail: "May borrow up to 5 books for 1 week, renewable for another week." },
                  { title: "Reserved Books", detail: "Can be borrowed for 1 period or overnight (7:00 PM – 9:00 AM)." },
                ].map((policy) => (
                  <div key={policy.title} className="card flex gap-4">
                    <BookMarked className="h-5 w-5 shrink-0 text-maroon-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{policy.title}</h4>
                      <p className="text-sm text-gray-600">{policy.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-maroon-800">Classification System</h3>
              <div className="mt-4 card bg-maroon-50 border-maroon-200">
                <div className="flex gap-4">
                  <Layers className="h-6 w-6 shrink-0 text-maroon-700" />
                  <div>
                    <h4 className="font-semibold text-maroon-900">Dewey Decimal Classification</h4>
                    <p className="mt-1 text-sm text-maroon-700">
                      All library materials are organized using the Dewey Decimal Classification (DDC) system. 
                      Call numbers help you locate books on the shelves. Our OPAC system makes it easy to search and find materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-900">Late Return Fees</h4>
                  <ul className="mt-2 space-y-1 text-sm text-amber-800">
                    <li>Circulation books: ₱6.00 per day</li>
                    <li>Reserved books: ₱2.00 per period</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800">
                <MapPin className="h-5 w-5" />
                Location
              </h3>
              <p className="mt-2 text-sm text-gray-600">Ground Floor, University Library Building</p>
            </div>
            <div className="card">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-maroon-800">
                <Clock className="h-5 w-5" />
                Service Hours
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Monday – Friday: 7:00 AM – 7:00 PM</p>
                <p>Saturday: 8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
