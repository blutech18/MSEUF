import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/layout/HeroSlider";
import {
  BookOpen,
  Search,
  Clock,
  Users,
  Database,
  Newspaper,
  ArrowRight,
  ExternalLink,
  Library,
  GraduationCap,
  Globe,
} from "lucide-react";
import { SITE_CONFIG, SERVICE_ITEMS, LIBRARY_HOURS } from "@/lib/constants";

const FEATURES = [
  {
    icon: Search,
    title: "AI-Powered Search",
    description:
      "Ask our AI assistant to find books, journals, and resources using natural language.",
  },
  {
    icon: Database,
    title: "Digital Resources",
    description:
      "Access ProQuest, ProQuest eBook Central, and Philippine E-Journal databases.",
  },
  {
    icon: BookOpen,
    title: "Extensive Catalog",
    description:
      "Browse thousands of books, periodicals, and multimedia resources.",
  },
  {
    icon: Users,
    title: "Research Support",
    description:
      "Get topic-based recommendations and keyword expansion for your research.",
  },
];

const PARTNERSHIPS = [
  {
    name: "ProQuest",
    url: "https://www.proquest.com",
    description: "Academic journals & dissertations",
  },
  {
    name: "ProQuest eBook Central",
    url: "https://ebookcentral.proquest.com/auth/lib/mseu-ebooks/login.action?returnURL=https%3A%2F%2Febookcentral.proquest.com%2Flib%2Fmseu-ebooks%2Fhome.action",
    description: "Digital textbooks & scholarly e-books",
  },
  {
    name: "Philippine E-Journal",
    url: "https://ejournals.ph",
    description: "Local research publications",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSlider />

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-page">
          <div className="text-center">
            <h2 className="section-title">Your Smart Library Companion</h2>
            <p className="section-subtitle mx-auto max-w-2xl">
              Experience the future of university library services with our
              AI-powered tools and real-time resource management.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card group text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700 transition-colors group-hover:bg-maroon-800 group-hover:text-white">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="section-title">Library Sections & Services</h2>
              <p className="section-subtitle">
                Explore our comprehensive library facilities designed to support
                your academic journey.
              </p>
              <div className="mt-8 space-y-3">
                {SERVICE_ITEMS.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-maroon-200 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-maroon-50 text-maroon-700 transition-colors group-hover:bg-maroon-800 group-hover:text-white">
                      <Library className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {service.label}
                      </h3>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-maroon-600" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {/* Hours Card */}
              <div className="rounded-2xl bg-maroon-800 p-8 text-white">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-gold-400" />
                  <h3 className="font-heading text-xl font-bold">
                    Library Hours
                  </h3>
                </div>
                <div className="mt-6 space-y-3 text-maroon-100">
                  <div className="flex justify-between border-b border-maroon-700 pb-2">
                    <span>Monday – Friday</span>
                    <span className="font-semibold text-white">
                      7:00 AM – 7:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-maroon-700 pb-2">
                    <span>Saturday</span>
                    <span className="font-semibold text-white">
                      8:00 AM – 5:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-maroon-300">
                      Closed
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs italic text-maroon-300">
                  {LIBRARY_HOURS.note}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                  <GraduationCap className="mx-auto h-8 w-8 text-maroon-600" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    10,000+
                  </p>
                  <p className="text-sm text-gray-600">Library Resources</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                  <Globe className="mx-auto h-8 w-8 text-maroon-600" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">4+</p>
                  <p className="text-sm text-gray-600">Academic Databases</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet ROSe Section */}
      <section className="section-padding bg-maroon-50">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image side */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-maroon-100" />
                <Image
                  src="/rose-chatbot.png"
                  alt="ROSe – Reference Online Services"
                  width={340}
                  height={460}
                  className="relative rounded-2xl object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* Text side */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-maroon-600">
                Meet Your AI Library Assistant
              </p>
              <h2 className="mt-3 font-heading text-4xl font-bold text-gray-900">
                Mabuhay! I am{" "}
                <span className="text-maroon-800">RO</span>
                <span className="text-blue-500">S</span>
                <span className="text-gold-500">e</span>
              </h2>
              <p className="mt-2 text-lg font-medium text-maroon-700">
                Reference Online Services
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                ROSe is the MSEUF University Libraries&apos; dedicated AI
                assistant — available 24/7 to guide you through the catalog,
                answer reference questions, connect you to digital databases,
                and help make your research journey faster and smarter.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {[
                  "Search books, journals, and digital resources",
                  "Check real-time availability of library materials",
                  "Get topic-based research recommendations",
                  "Answer frequently asked library questions",
                  "Provide librarian contact details when needed",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-maroon-800 text-white text-[10px] font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-sm text-gray-500">
                Click the chat button at the bottom-right corner of any page to
                start a conversation with ROSe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Partnerships */}
      <section className="section-padding">
        <div className="container-page">
          <div className="text-center">
            <h2 className="section-title">Academic Subscriptions</h2>
            <p className="section-subtitle mx-auto max-w-2xl">
              Access world-class academic databases and digital resource
              platforms.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERSHIPS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon-50 font-heading text-xl font-bold text-maroon-800 transition-colors group-hover:bg-maroon-800 group-hover:text-white">
                  {partner.name.charAt(0)}
                </div>
                <h3 className="mt-4 flex items-center gap-1.5 text-base font-semibold text-gray-900">
                  {partner.name}
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {partner.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-maroon-800 to-maroon-900 py-16">
        <div className="container-page text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Need Help Finding Resources?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-maroon-200">
            Our AI assistant is available 24/7 to help you search the catalog,
            find research materials, and navigate library services.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/forms/appointment" className="btn-gold gap-2">
              Book an Appointment
            </Link>
            <Link
              href="/forms/registration"
              className="btn-secondary border-white/20 text-white hover:bg-white/10 hover:text-white gap-2"
            >
              Register Account
            </Link>
          </div>
        </div>
      </section>

      {/* News Teaser */}
      <section className="section-padding">
        <div className="container-page">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Latest News</h2>
            <Link
              href="/newsletter"
              className="flex items-center gap-1 text-sm font-medium text-maroon-700 hover:text-maroon-900"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title:
                  "MSEUF, DLL Strengthened Ties with Library Access Agreement",
                date: "June 17, 2024",
                excerpt:
                  "Manuel S. Enverga University Foundation and Dalubhasaan ng Lungsod ng Lucena signed a memorandum of agreement to give DLL students free access to MSEUF library services.",
              },
              {
                title: "University Library AVP 2024 Released",
                date: "January 2024",
                excerpt:
                  "Watch the latest audio-visual presentation showcasing the MSEUF University Libraries and its services.",
              },
              {
                title: "New E-Resources Available for Students",
                date: "2024",
                excerpt:
                  "The library has expanded its digital collection with new subscriptions to academic databases and e-book platforms.",
              },
            ].map((news) => (
              <div key={news.title} className="card">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Newspaper className="h-3.5 w-3.5" />
                  {news.date}
                </div>
                <h3 className="mt-3 font-heading text-lg font-semibold text-gray-900">
                  {news.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {news.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
