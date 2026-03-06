import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Acquisitions (S.Y. 2008–2023)" };

const ACQUISITIONS = [
  { year: "2022–2023", books: 856, periodicals: 124, av: 45 },
  { year: "2021–2022", books: 743, periodicals: 118, av: 38 },
  { year: "2020–2021", books: 512, periodicals: 95, av: 22 },
  { year: "2019–2020", books: 678, periodicals: 110, av: 35 },
  { year: "2018–2019", books: 621, periodicals: 102, av: 30 },
  { year: "2017–2018", books: 589, periodicals: 98, av: 28 },
  { year: "2016–2017", books: 534, periodicals: 90, av: 25 },
  { year: "2015–2016", books: 498, periodicals: 85, av: 20 },
  { year: "2014–2015", books: 467, periodicals: 78, av: 18 },
  { year: "2013–2014", books: 423, periodicals: 72, av: 15 },
  { year: "2012–2013", books: 398, periodicals: 68, av: 12 },
  { year: "2011–2012", books: 365, periodicals: 60, av: 10 },
  { year: "2010–2011", books: 334, periodicals: 55, av: 8 },
  { year: "2009–2010", books: 312, periodicals: 50, av: 6 },
  { year: "2008–2009", books: 289, periodicals: 45, av: 5 },
];

export default function AcquisitionsPage() {
  const totalBooks = ACQUISITIONS.reduce((s, a) => s + a.books, 0);

  return (
    <>
      <PageHeader
        title="Acquisitions (S.Y. 2008–2023)"
        subtitle="Library collection growth over the years"
        breadcrumbs={[{ label: "Collections" }, { label: "Acquisitions" }]}
      />
      <div className="container-page section-padding">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="card text-center">
            <BookOpen className="mx-auto h-8 w-8 text-maroon-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{totalBooks.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Books Acquired</p>
          </div>
          <div className="card text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-maroon-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{ACQUISITIONS.length}</p>
            <p className="text-sm text-gray-600">School Years</p>
          </div>
          <div className="card text-center">
            <BookOpen className="mx-auto h-8 w-8 text-maroon-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{ACQUISITIONS[0].books}</p>
            <p className="text-sm text-gray-600">Latest Year Acquisitions</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-maroon-800 text-white">
              <tr>
                <th className="px-6 py-3 font-semibold">School Year</th>
                <th className="px-6 py-3 font-semibold text-right">Books</th>
                <th className="px-6 py-3 font-semibold text-right">Periodicals</th>
                <th className="px-6 py-3 font-semibold text-right">AV Materials</th>
                <th className="px-6 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ACQUISITIONS.map((a, i) => (
                <tr key={a.year} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-3 font-medium text-gray-900">{a.year}</td>
                  <td className="px-6 py-3 text-right text-gray-700">{a.books}</td>
                  <td className="px-6 py-3 text-right text-gray-700">{a.periodicals}</td>
                  <td className="px-6 py-3 text-right text-gray-700">{a.av}</td>
                  <td className="px-6 py-3 text-right font-semibold text-maroon-800">{a.books + a.periodicals + a.av}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
