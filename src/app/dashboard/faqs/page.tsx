"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  HelpCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

const FAQ_CATEGORIES = [
  "General",
  "Borrowing & Returns",
  "Digital Resources",
  "Services",
  "Registration",
  "Other",
];

const EMPTY_FORM = {
  question: "",
  answer: "",
  category: "General",
  order: 0,
};

export default function FAQsPage() {
  const faqs = useQuery(api.faqs.list, { activeOnly: false });
  const createFAQ = useMutation(api.faqs.create);
  const updateFAQ = useMutation(api.faqs.update);
  const removeFAQ = useMutation(api.faqs.remove);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<Id<"faqs"> | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered =
    faqs?.filter(
      (f) => filterCategory === "all" || f.category === filterCategory
    ) ?? [];

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      order: (faqs?.length ?? 0) + 1,
    });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (faq: NonNullable<typeof faqs>[number]) => {
    setEditingId(faq._id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError("");
    try {
      if (editingId) {
        await updateFAQ({
          id: editingId,
          question: form.question,
          answer: form.answer,
          category: form.category,
          order: form.order,
        });
      } else {
        await createFAQ({
          question: form.question,
          answer: form.answer,
          category: form.category,
          order: form.order,
        });
      }
      setShowModal(false);
    } catch {
      setFormError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: Id<"faqs">) => {
    if (confirm("Delete this FAQ?")) {
      await removeFAQ({ id });
    }
  };

  const handleToggleActive = async (
    id: Id<"faqs">,
    currentState: boolean
  ) => {
    await updateFAQ({ id, isActive: !currentState });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            FAQ Management
          </h1>
          <p className="text-sm text-gray-500">
            {faqs === undefined
              ? "Loading…"
              : `${faqs.length} FAQ${faqs.length !== 1 ? "s" : ""} — ${faqs.filter((f) => f.isActive).length} active`}
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", ...FAQ_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filterCategory === cat
                ? "bg-maroon-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {faqs === undefined ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-maroon-700" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400">
          <HelpCircle className="h-10 w-10 text-gray-300" />
          <p>No FAQs yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq) => (
            <div
              key={faq._id}
              className={`rounded-xl border p-4 transition-opacity ${
                faq.isActive
                  ? "border-gray-200 bg-white"
                  : "border-dashed border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-maroon-50 px-2 py-0.5 text-xs font-medium text-maroon-700">
                      {faq.category}
                    </span>
                    <span className="text-xs text-gray-400">#{faq.order}</span>
                    {!faq.isActive && (
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-gray-900">
                    {faq.question}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {faq.answer}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(faq._id, faq.isActive)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-maroon-50 hover:text-maroon-700"
                    title={faq.isActive ? "Hide FAQ" : "Show FAQ"}
                  >
                    {faq.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(faq)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-maroon-50 hover:text-maroon-700"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="font-heading text-xl font-bold text-gray-900">
                {editingId ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                >
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Question *
                </label>
                <textarea
                  rows={2}
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                  placeholder="What is the library's operating hours?"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  value={form.answer}
                  onChange={(e) =>
                    setForm({ ...form, answer: e.target.value })
                  }
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-maroon-500 focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                  placeholder="The library is open Monday–Friday 7:00 AM – 7:00 PM..."
                />
              </div>
              <Input
                label="Display Order"
                type="number"
                value={form.order.toString()}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) || 0 })
                }
              />
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
                  {editingId ? "Save Changes" : "Add FAQ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
