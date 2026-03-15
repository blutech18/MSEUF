"use client";

import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import { Printer, Box, Scissors, Palette, MapPin, Clock, ExternalLink, HardDrive, Zap, Layers } from "lucide-react";
import Link from "next/link";

const EQUIPMENT = [
  {
    title: "Digital Fabrication Tools",
    desc: "Precision hand tools and rotary sets for post-processing and fine-tuning your creations.",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/395350030_550105010642032_2954385715974013570_n-1.jpg"
  },
  {
    title: "Professional 3D Printers",
    desc: "State-of-the-art FDM printers capable of handling complex geometries and high-resolution details.",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/368014992_1381320035826295_3087855482601720165_n-1.jpg"
  },
  {
    title: "Filament Inventory",
    desc: "A wide selection of PLA+, PLA Silk, and specialized filaments in various colors and finishes.",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/393736292_364925045958012_5074895397514624367_n-1.jpg"
  },
  {
    title: "Creative Workspace",
    desc: "A dedicated environment for collaboration, experimentation, and turning imagination into reality.",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/394947600_1725532854577895_7299859200887586858_n-1.jpg"
  }
];

const MODELS = [
  {
    name: "Christmas Tree",
    price: "P 750.00",
    duration: "20 Hours",
    filament: "PLA Silk - Rainbow & Gold",
    source: "https://www.thingiverse.com/",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/387606446_1944260239308344_7098189507658076465_n.jpg"
  },
  {
    name: "Blue Dragon",
    price: "P 600.00",
    duration: "18 Hours",
    filament: "PLA+ Blue & Orange",
    source: "https://www.printables.com/",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/393855134_309950688624262_7453990266941913356_n.jpg"
  },
  {
    name: "Crocodile Skin Lizard",
    price: "P 600.00",
    duration: "18 Hours",
    filament: "PLA+ Yellow Green",
    source: "https://www.thingiverse.com/",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/387555234_1183373619256272_5600427150915871589_n.jpg"
  },
  {
    name: "Moblie Suit Phone Holder",
    price: "P 1,000.00",
    duration: "30 Hours",
    filament: "PLA+ Customize",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/386854005_683733893693423_9221947077254397294_n.jpg"
  },
  {
    name: "Suzuki Jimny",
    price: "P 400.00",
    duration: "14 Hours",
    filament: "PLA+ Yellow",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/370228021_211393101851641_5232675004942465266_n.jpg"
  },
  {
    name: "Dinosaur Keychain",
    price: "P 90.00",
    duration: "1 Hour",
    filament: "PLA+ Red",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/387598840_876928937189181_1964404986623026846_n.jpg"
  },
  {
    name: "Mini Prime",
    duration: "2 Hours",
    filament: "PLA+",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/387326845_857449936014309_6735759042512553167_n.jpg"
  },
  {
    name: "Retractable Swords",
    duration: "6 Hours",
    filament: "PLA+",
    source: "https://www.printables.com/",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/370107515_878088637107615_436057652688062194_n.jpg"
  },
  {
    name: "Sunflower",
    duration: "6 Hours",
    filament: "PLA+",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/387484461_1322089171778842_2360976674803241639_n-1.jpg?w=442"
  },
  {
    name: "Customize Phone Holder",
    duration: "1 Hour/piece",
    filament: "PLA+ Silk Pink",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/370257383_644250144525493_4985226638558007053_n.jpg"
  },
  {
    name: "Pochita",
    duration: "3.5 Hours",
    filament: "PLA",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/387518279_289423707246906_433719976180527770_n.jpg"
  },
  {
    name: "Miniature Character",
    duration: "6 Hours",
    filament: "PLA+",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/381125229_844684207027263_9099479094021551793_n.jpg?w=590"
  },
  {
    name: "Flexi Octopus",
    duration: "2 Hours",
    filament: "PLA+ Customize",
    source: "https://www.thingiverse.com/",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/387525374_7600282316655182_1674282071661032264_n.jpg"
  },
  {
    name: "Parts & Accessories",
    duration: "30 Mins/piece",
    filament: "PLA",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/370115145_1755998158162742_8582886282223154269_n.jpg"
  },
  {
    name: "Decorative Rose",
    duration: "5 Hours",
    filament: "PLA+",
    image: "https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/370099458_712063100782951_4178530124939459095_n.jpg?w=591"
  }
];

export default function CreationCenterPage() {
  return (
    <>
      <PageHeader
        title="Creation Center"
        subtitle="Transform your imagination into tangible prototypes and artworks"
        breadcrumbs={[{ label: "Creation Center" }]}
      />
      
      <div className="container-page section-padding">
        <div className="mx-auto max-w-7xl">
          {/* Vision Section */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-maroon-50 px-4 py-1.5 text-sm font-semibold text-maroon-700">
                <Palette className="h-4 w-4" />
                <span>Makerspace Facility</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
                The Only Limit is Your Imagination
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                In the Creation Center, individuals can collaborate, experiment with cutting-edge technologies, 
                and transform their imagination into tangible prototypes or artworks. Our facility provides 
                the specialized tools and support needed for both creative and academic projects.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-maroon-100 text-maroon-700">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Rapid Prototyping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-maroon-100 text-maroon-700">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">3D Fabrication</span>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
              <Image 
                src="https://envergalibrary.wordpress.com/wp-content/uploads/2023/10/394947600_1725532854577895_7299859200887586858_n-1.jpg"
                alt="Creation Center Facilities"
                width={800}
                height={600}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-maroon-900/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Equipment Showcase */}
          <div className="mt-24">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold text-gray-900">Tools and Materials</h2>
              <p className="mt-4 text-gray-600">Equipped with specialized machinery to bring your ideas to life</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {EQUIPMENT.map((item) => (
                <div key={item.title} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <Image 
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-gray-900 group-hover:text-maroon-700 transition-colors">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Models Catalog */}
          <div className="mt-24">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">3D Printed Models</h2>
                <p className="mt-2 text-gray-600">A collection of items manufactured in our lab</p>
              </div>
              <div className="flex h-12 items-center gap-3 rounded-xl bg-maroon-50 px-6 font-semibold text-maroon-700">
                <Box className="h-5 w-5" />
                <span>{MODELS.length} Models Featured</span>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {MODELS.map((model) => (
                <div key={model.name} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-maroon-100 hover:shadow-lg group">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                    <Image 
                      src={model.image}
                      alt={model.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {model.price && (
                      <div className="absolute top-4 right-4 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-sm font-bold text-white">
                        {model.price}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-maroon-700 transition-colors">
                      {model.name}
                    </h3>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Print Time: <span className="font-medium text-gray-900">{model.duration}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HardDrive className="h-4 w-4 text-gray-400" />
                        <span>{model.filament}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                      {model.source ? (
                        <a 
                          href={model.source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon-700 hover:text-maroon-800"
                        >
                          Source Design <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">In-House Design</span>
                      )}
                      <div className="h-2 w-2 rounded-full bg-maroon-600 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-24 rounded-3xl bg-linear-to-r from-maroon-900 via-maroon-800 to-maroon-900 p-8 text-center text-white lg:p-16 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10">
              <h3 className="font-heading text-3xl font-bold sm:text-4xl">Ready to Create?</h3>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-maroon-100">
                Whether you have a ready-to-print file or just a rough idea, 
                our staff is here to help you navigate the world of digital fabrication.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/forms/appointment" className="btn-gold px-8 py-4 text-lg">Book Lab Session</Link>
                <Link href="/forms/registration" className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-md transition-all hover:bg-white/20">Learn More</Link>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-gray-900">Lab Location</h4>
                <p className="mt-1 text-sm text-gray-600">University Library Building, Ground Floor, MSEUF Main Campus</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-gray-900">Operating Hours</h4>
                <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                  <p>Mon – Fri: 8:00 AM – 6:00 PM</p>
                  <p>Sat: 8:00 AM – 12:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
