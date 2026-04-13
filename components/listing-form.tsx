"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createListingId, Listing, ListingStatus } from "@/lib/listings";
import { saveListing } from "@/lib/storage";

type FormState = {
  title: string;
  price: string;
  description: string;
  status: ListingStatus;
};

const initialForm: FormState = {
  title: "",
  price: "",
  description: "",
  status: "available"
};

type ListingFormProps = {
  initialListing?: Listing;
};

export function ListingForm({ initialListing }: ListingFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialListing);
  const [form, setForm] = useState<FormState>(
    initialListing
      ? {
          title: initialListing.title,
          price: String(initialListing.price),
          description: initialListing.description,
          status: initialListing.status
        }
      : initialForm
  );
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    const nextPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [files]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const hasImages = files.length > 0 || (initialListing?.images.length ?? 0) > 0;
    if (!form.title || !form.price || !form.description || !hasImages) {
      setError("Please complete all fields and upload at least one image.");
      return;
    }

    setSubmitting(true);

    try {
      const images =
        files.length > 0 ? await Promise.all(files.map(fileToDataUrl)) : (initialListing?.images ?? []);
      const nextListing: Listing = {
        id: initialListing?.id ?? createListingId(form.title),
        title: form.title.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        status: form.status,
        images,
        createdAt: initialListing?.createdAt ?? new Date().toISOString()
      };

      saveListing(nextListing);
      setForm(
        initialListing
          ? {
              title: nextListing.title,
              price: String(nextListing.price),
              description: nextListing.description,
              status: nextListing.status
            }
          : initialForm
      );
      setFiles([]);
      router.push(`/listing/${nextListing.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong while preparing the images. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    setFiles(selected);
  }

  return (
    <section className="shell max-w-3xl">
      <div className="rounded-[2rem] bg-white p-8 shadow-card">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Admin Panel</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            {isEditing ? "Edit listing" : "Add new listing"}
          </h1>
          <p className="mt-3 text-slate-600">
            {isEditing
              ? "Update the property details below. Upload new images only if you want to replace the current ones."
              : "Create a property card with title, price, description, status, and multiple images."}
          </p>
        </div>

        {isEditing && initialListing ? (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 text-sm text-slate-600">
            <span>Editing: {initialListing.title}</span>
            <Link href={`/listing/${initialListing.id}`} className="font-semibold text-brand hover:text-brand-dark">
              Back to detail
            </Link>
          </div>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 transition focus:border-brand"
                placeholder="Modern family home"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Price</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 transition focus:border-brand"
                placeholder="250000"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
            <textarea
              rows={5}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 transition focus:border-brand"
              placeholder="Describe the property..."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as ListingStatus
                }))
              }
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 transition focus:border-brand"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:font-semibold file:text-white"
            />
            {isEditing ? (
              <p className="mt-2 text-xs text-slate-500">
                Leave empty to keep current images, or upload new ones to replace them.
              </p>
            ) : null}
          </label>

          {initialListing && files.length === 0 && initialListing.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {initialListing.images.map((image, index) => (
                <div key={image + index} className="relative h-24 overflow-hidden rounded-2xl bg-stone-200">
                  <Image src={image} alt={`Current image ${index + 1}`} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          ) : null}

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((preview, index) => (
                <div key={preview} className="relative h-24 overflow-hidden rounded-2xl bg-stone-200">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          )}

          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-brand px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Saving listing..." : isEditing ? "Update listing" : "Save listing"}
          </button>
        </form>
      </div>
    </section>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Invalid file result"));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
