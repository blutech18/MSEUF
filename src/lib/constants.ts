export const SITE_CONFIG = {
  name: "MSEUF University Libraries",
  shortName: "MSEUF Library",
  description:
    "AI-Powered University Library Support System for Manuel S. Enverga University Foundation",
  url: "https://library.mseuf.edu.ph",
  university: "Manuel S. Enverga University Foundation",
  universityUrl: "https://mseuf.edu.ph",
  follettDestinyUrl: "https://envergalibrary.com/follett",
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Follett Destiny", href: "/follett-destiny" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "LIB.COM", href: "/libcom" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Creation Center", href: "/creation-center" },
] as const;

export const ABOUT_ITEMS = [
  { label: "Vision, Mission & Goal", href: "/about/vision-mission" },
  { label: "Quality Objectives", href: "/about/quality-objectives" },
  { label: "Library Personnel", href: "/about/personnel" },
  { label: "University Library AVP", href: "/about/library-avp" },
  { label: "Activities", href: "/about/activities" },
] as const;

export const SERVICE_ITEMS = [
  {
    label: "Circulation and Reserve Section",
    href: "/services/circulation-reserve",
  },
  {
    label: "Reference and Filipiniana Section",
    href: "/services/reference-filipiniana",
  },
  {
    label: "Institute of Graduate Studies & Research Library",
    href: "/services/igsrl",
  },
  { label: "Periodicals Section", href: "/services/periodicals" },
  {
    label: "Library User Information System Section",
    href: "/services/luiss",
  },
  {
    label: "Educational Media Resource Center",
    href: "/services/emrc",
  },
] as const;

export const COLLECTION_ITEMS = [
  { label: "Acquisitions (S.Y. 2008–2023)", href: "/collections/acquisitions" },
  { label: "E-Books", href: "/collections/e-books" },
  { label: "Fiction Reviews", href: "/collections/fiction-reviews" },
  { label: "ProQuest", href: "/collections/proquest", external: true },
  { label: "EBSCO", href: "/collections/ebsco", external: true },
  { label: "IG Library", href: "/collections/ig-library", external: true },
  {
    label: "Philippine E-Journal",
    href: "/collections/philippine-ejournal",
    external: true,
  },
] as const;

export const FORM_ITEMS = [
  { label: "Library Online Appointment", href: "/forms/appointment" },
  { label: "Library Account Registration", href: "/forms/registration" },
  { label: "Online Book Renewal", href: "/forms/book-renewal" },
  { label: "Customer Satisfaction Survey", href: "/forms/satisfaction-survey" },
] as const;

export const LIBRARY_HOURS = {
  weekdays: "Monday – Friday: 7:00 AM – 7:00 PM",
  saturday: "Saturday: 8:00 AM – 5:00 PM",
  sunday: "Sunday: Closed",
  note: "Hours may vary during holidays and semester breaks.",
} as const;

export const BOOK_AVAILABILITY_STATUS = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
  RESERVED: "reserved",
  MAINTENANCE: "maintenance",
} as const;

export type BookAvailabilityStatus =
  (typeof BOOK_AVAILABILITY_STATUS)[keyof typeof BOOK_AVAILABILITY_STATUS];
