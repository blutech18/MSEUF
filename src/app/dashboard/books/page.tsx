"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  BookOpen,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Link,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { BookAvailabilityStatus } from "@/lib/constants";

const EMPTY_FORM = {
  title: "",
  authors: "",
  isbn: "",
  publisher: "",
  publicationYear: "",
  edition: "",
  callNumber: "",
  shelfLocation: "",
  subject: "",
  keywords: "",
  abstract: "",
  language: "English",
  format: "Hardcover",
  digitalAccessLink: "",
  availability: "available" as BookAvailabilityStatus,
};

const availabilityBadge = (status: string) => {
  const map: Record<string, "success" | "danger" | "warning" | "info"> = {
    available: "success",
    unavailable: "danger",
    reserved: "warning",
    maintenance: "info",
  };
  return map[status] ?? "default";
};

export default function BooksPage() {
  const books = useQuery(api.books.list, { limit: 700 });
  const createBook = useMutation(api.books.create);
  const updateBook = useMutation(api.books.update);
  const removeBook = useMutation(api.books.remove);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<Id<"books"> | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const activeBooks = books ?? [];

  const filtered = activeBooks.filter((book) => {
    const matchesSearch =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (book.callNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesFilter =
      filterStatus === "all" || book.availability === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearchChange = (v: string) => { setSearchQuery(v); setPage(1); };
  const handleFilterChange = (v: string) => { setFilterStatus(v); setPage(1); };

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (book: NonNullable<typeof books>[number]) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      authors: book.authors.join(", "),
      isbn: book.isbn ?? "",
      publisher: book.publisher ?? "",
      publicationYear: book.publicationYear?.toString() ?? "",
      edition: book.edition ?? "",
      callNumber: book.callNumber ?? "",
      shelfLocation: book.shelfLocation ?? "",
      subject: book.subject?.join(", ") ?? "",
      keywords: book.keywords?.join(", ") ?? "",
      abstract: book.abstract ?? "",
      language: book.language ?? "English",
      format: book.format ?? "Hardcover",
      digitalAccessLink: book.digitalAccessLink ?? "",
      availability: book.availability as BookAvailabilityStatus,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError("");
    try {
      const authors = form.authors.split(",").map((a) => a.trim()).filter(Boolean);
      const subject = form.subject ? form.subject.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
      const keywords = form.keywords ? form.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined;
      const publicationYear = form.publicationYear ? parseInt(form.publicationYear) : undefined;

      if (editingId) {
        await updateBook({
          id: editingId,
          title: form.title,
          authors,
          isbn: form.isbn || undefined,
          publisher: form.publisher || undefined,
          publicationYear,
          edition: form.edition || undefined,
          callNumber: form.callNumber || undefined,
          shelfLocation: form.shelfLocation || undefined,
          subject,
          keywords,
          abstract: form.abstract || undefined,
          language: form.language || undefined,
          format: form.format || undefined,
          digitalAccessLink: form.digitalAccessLink || undefined,
          availability: form.availability,
        });
      } else {
        await createBook({
          title: form.title,
          authors,
          isbn: form.isbn || undefined,
          publisher: form.publisher || undefined,
          publicationYear,
          edition: form.edition || undefined,
          callNumber: form.callNumber || undefined,
          shelfLocation: form.shelfLocation || undefined,
          subject,
          keywords,
          abstract: form.abstract || undefined,
          language: form.language || undefined,
          format: form.format || undefined,
          digitalAccessLink: form.digitalAccessLink || undefined,
          availability: form.availability,
        });
      }
      setShowModal(false);
    } catch {
      setFormError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (bookId: Id<"books">) => {
    if (confirm("Are you sure you want to remove this book record?")) {
      await removeBook({ id: bookId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Book Management
          </h1>
          <p className="text-sm text-gray-500">
            {books === undefined
              ? "Loading…"
              : `${filtered.length} of ${activeBooks.length} books shown`}
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" /> Add Book
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-50">
          <Input
            placeholder="Search by title, author, or call number..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Books Table */}
      {books === undefined ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author(s)</th>
                  <th className="px-4 py-3">Call Number</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">E-Book Link</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map((book) => (
                  <tr key={book._id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 shrink-0 text-maroon-600" />
                        <span className="font-medium text-gray-900">
                          {book.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {book.authors.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {book.callNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {book.shelfLocation ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {book.digitalAccessLink ? (
                        <a
                          href={book.digitalAccessLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-maroon-700 underline underline-offset-2 hover:text-maroon-900"
                          title={book.digitalAccessLink}
                        >
                          <Link className="h-3.5 w-3.5 shrink-0" />
                          Open Link
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={availabilityBadge(book.availability)}>
                        {book.availability}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(book)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-maroon-50 hover:text-maroon-700"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No books match your search criteria."
                        : "No books in the catalog yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of <span className="font-medium text-gray-700">{filtered.length}</span> books
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page number buttons — show at most 5 around current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safePage) <= 1
                  )
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm transition-colors ${
                          item === safePage
                            ? "border-maroon-700 bg-maroon-700 font-semibold text-white"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="font-heading text-xl font-bold text-gray-900">
                {editingId ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Input
                label="Authors (comma-separated) *"
                value={form.authors}
                onChange={(e) => setForm({ ...form, authors: e.target.value })}
                placeholder="Author 1, Author 2"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="ISBN"
                  value={form.isbn}
                  onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                />
                <Input
                  label="Publisher"
                  value={form.publisher}
                  onChange={(e) =>
                    setForm({ ...form, publisher: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Publication Year"
                  type="number"
                  value={form.publicationYear}
                  onChange={(e) =>
                    setForm({ ...form, publicationYear: e.target.value })
                  }
                />
                <Input
                  label="Edition"
                  value={form.edition}
                  onChange={(e) =>
                    setForm({ ...form, edition: e.target.value })
                  }
                />
                <Input
                  label="Language"
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Call Number"
                  value={form.callNumber}
                  onChange={(e) =>
                    setForm({ ...form, callNumber: e.target.value })
                  }
                />
                <Input
                  label="Shelf Location"
                  value={form.shelfLocation}
                  onChange={(e) =>
                    setForm({ ...form, shelfLocation: e.target.value })
                  }
                />
              </div>
              <Input
                label="Subjects (comma-separated)"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />
              <Input
                label="Keywords (comma-separated)"
                value={form.keywords}
                onChange={(e) =>
                  setForm({ ...form, keywords: e.target.value })
                }
              />
              <Input
                label="Digital Access Link (E-Book URL)"
                value={form.digitalAccessLink}
                onChange={(e) =>
                  setForm({ ...form, digitalAccessLink: e.target.value })
                }
                placeholder="https://example.com/ebook-link"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Abstract
                </label>
                <textarea
                  rows={3}
                  value={form.abstract}
                  onChange={(e) =>
                    setForm({ ...form, abstract: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Format
                  </label>
                  <select
                    value={form.format}
                    onChange={(e) =>
                      setForm({ ...form, format: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                  >
                    <option>Hardcover</option>
                    <option>Paperback</option>
                    <option>E-Book</option>
                    <option>Audio</option>
                    <option>DVD/CD</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Availability Status *
                  </label>
                  <select
                    value={form.availability}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availability: e.target.value as BookAvailabilityStatus,
                      })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={isSaving}>
                  {editingId ? "Save Changes" : "Add Book"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
