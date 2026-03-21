import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, ExternalLink, Laptop, Globe } from "lucide-react";

export const metadata: Metadata = { title: "E-Books" };

const PREMIUM_PLATFORMS = [
  { name: "ProQuest", url: "https://www.proquest.com", desc: "Academic journals, dissertations, and scholarly publications." },
  { name: "ProQuest eBook Central", url: "https://ebookcentral.proquest.com/auth/lib/mseu-ebooks/login.action?returnURL=https%3A%2F%2Febookcentral.proquest.com%2Flib%2Fmseu-ebooks%2Fhome.action", desc: "Digital textbooks and scholarly e-books available for online reading." },
  { name: "Philippine E-Journal", url: "https://ejournals.ph", desc: "Local research publications and academic journals from the Philippines." },
];

const OPEN_ACCESS_CATEGORIES = [
  { name: "Mathematics Education", url: "https://envergalibrary.wordpress.com/2020/05/21/open-access-e-books-on-mathematics-education/" },
  { name: "Philosophy of Science / Science Education", url: "https://envergalibrary.wordpress.com/2020/05/21/open-access-e-books-on-philosophy-of-science-science-education/" },
  { name: "Chemistry and Material Science", url: "https://envergalibrary.wordpress.com/2020/05/21/open-access-e-books-on-chemistry-and-material-science/" },
  { name: "Teacher Education", url: "https://envergalibrary.wordpress.com/2020/05/21/open-access-e-books-on-teacher-education/" },
  { name: "Physics and Astronomy", url: "https://envergalibrary.wordpress.com/2020/05/21/open-access-e-books-on-physics-and-astronomy/" },
  { name: "Research and Statistics", url: "https://envergalibrary.wordpress.com/2020/05/21/open-access-e-books-on-research-and-statistics-in-different-disciplines/" },
  { name: "Psychology and Behavioral Science", url: "https://envergalibrary.wordpress.com/2020/05/21/e-resources-for-psychology-and-behavioral-science/" },
  { name: "Engineering and Energy", url: "https://envergalibrary.wordpress.com/2020/05/19/e-resources-for-engineering-and-energy/" },
  { name: "Earth and Environmental Science", url: "https://envergalibrary.wordpress.com/2020/05/19/e-resources-for-earth-and-environmental-science/" },
  { name: "Academic / Research Writing", url: "https://envergalibrary.wordpress.com/2020/05/19/open-access-e-books-for-academic-research-writing/" },
  { name: "Computer Science", url: "https://envergalibrary.wordpress.com/2020/05/19/open-access-e-books-for-computer-science/" },
  { name: "Archaeology", url: "https://envergalibrary.wordpress.com/2020/05/19/open-access-e-books-for-archaeology/" },
  { name: "Guidance and Counseling", url: "https://envergalibrary.wordpress.com/2020/06/01/guidance-and-counseling/" },
  { name: "Basic Education E-Learning Resources", url: "https://envergalibrary.wordpress.com/2020/05/19/the-basic-education-department-library-compiled-e-learning-resources/" },
];

export default function EBooksPage() {
  return (
    <>
      <PageHeader title="E-Books" subtitle="Access digital books and publications online" breadcrumbs={[{ label: "Collections" }, { label: "E-Books" }]} />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-12">
          
          <div className="space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed text-center italic">
              "The University Libraries continue to support the information needs of the MSEUF community to uphold the Mission and Vision of the University. The Librarians compiled e-books to supplement the printed materials and they can browse even at home."
            </p>
            <div className="grid gap-4 sm:grid-cols-3 pt-4">
              {[
                { icon: BookOpen, label: "Digital Titles", value: "5,000+" },
                { icon: Laptop, label: "24/7 Access", value: "Online" },
                { icon: Globe, label: "Major Platforms", value: "3+" },
              ].map((s) => (
                <div key={s.label} className="card text-center bg-white shadow-sm border border-gray-100">
                  <s.icon className="mx-auto h-8 w-8 text-maroon-600" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-gray-900 border-b border-gray-100 pb-2">Premium Databases</h2>
            <div className="space-y-4">
              {PREMIUM_PLATFORMS.map((p) => (
                <div key={p.name} className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white shadow-sm border border-gray-100">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-gray-900">{p.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{p.desc}</p>
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0 gap-2 text-xs w-full sm:w-auto">
                    Access Platform <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Open Access E-Books</h2>
              <span className="text-xs font-medium text-maroon-700 bg-maroon-50 px-2 py-1 rounded-full uppercase tracking-wider">Archive</span>
            </div>
            <p className="text-sm text-gray-600">Browse open access digital books compiled by MSEUF librarians across various disciplines.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {OPEN_ACCESS_CATEGORIES.map((cat) => (
                <a 
                  key={cat.name} 
                  href={cat.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:bg-maroon-50 hover:border-maroon-100 transition-all shadow-sm"
                >
                  <span className="text-[15px] font-medium text-gray-700 group-hover:text-maroon-900 transition-colors">
                    {cat.name}
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-maroon-700 transition-colors" />
                </a>
              ))}
            </div>
          </section>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-6">
            <p className="text-sm text-amber-900 flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold">i</span>
              <span>
                <strong>Access Note:</strong> Premium e-books are available on campus through the library network. 
                For off-campus access to ProQuest or ProQuest eBook Central, please contact the library for login credentials.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
