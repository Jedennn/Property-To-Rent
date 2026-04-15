"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Listing, ListingStatus } from "@/lib/listings";

type FormState = {
  title: string;
  description: string;
  status: ListingStatus;
};

const initialForm: FormState = {
  title: "",
  description: "",
  status: "available"
};

type ListingFormProps = {
  initialListing?: Listing;
};

const MAX_IMAGE_COUNT = 10;
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

export function ListingForm({ initialListing }: ListingFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialListing);
  const [form, setForm] = useState<FormState>(
    initialListing
      ? {
          title: initialListing.title,
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
    if (!form.title || !form.description || !hasImages) {
      setError("Please complete all fields and upload at least one image.");
      return;
    }

    setSubmitting(true);

    try {
      const images = files.length > 0 ? await Promise.all(files.map(uploadFileToCloudinary)) : (initialListing?.images ?? []);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        images
      };

      const response = await fetch(isEditing ? `/api/listings/${initialListing?.id}` : "/api/listings", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await readJsonSafely(response)) as { error?: string; listing?: Listing } | null;

      if (!response.ok || !data?.listing) {
        throw new Error(data?.error ?? `Failed to save listing (${response.status}).`);
      }

      const nextListing = data.listing;

      setForm(
        initialListing
          ? {
              title: nextListing.title,
              description: nextListing.description,
              status: nextListing.status
            }
          : initialForm
      );
      setFiles([]);
      router.push(`/listing/${nextListing.id}`);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong while saving the listing.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);

    if (selected.length > MAX_IMAGE_COUNT) {
      setError(`You can upload up to ${MAX_IMAGE_COUNT} images per listing.`);
      event.target.value = "";
      setFiles([]);
      return;
    }

    const oversizedFile = selected.find((file) => file.size > MAX_IMAGE_SIZE_BYTES);
    if (oversizedFile) {
      setError(`Each image must be 8 MB or smaller. Problem file: ${oversizedFile.name}`);
      event.target.value = "";
      setFiles([]);
      return;
    }

    setError("");
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
            <p className="mt-2 text-xs text-slate-500">
              Up to {MAX_IMAGE_COUNT} images. Maximum 8 MB per image.
            </p>
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

async function uploadFileToCloudinary(file: File) {
  const signatureResponse = await fetch("/api/uploads/signature", { cache: "no-store" });
  const signatureData = (await readJsonSafely(signatureResponse)) as
    | {
        error?: string;
        cloudName?: string;
        apiKey?: string;
        folder?: string;
        timestamp?: number;
        signature?: string;
      }
    | null;

  if (!signatureData) {
    throw new Error(`Cloudinary signature request failed (${signatureResponse.status}).`);
  }

  if (!signatureResponse.ok || !signatureData.cloudName || !signatureData.apiKey || !signatureData.signature) {
    throw new Error(signatureData.error ?? `Cloudinary upload is not ready yet (${signatureResponse.status}).`);
  }

  const uploadBody = new FormData();
  uploadBody.append("file", file);
  uploadBody.append("api_key", signatureData.apiKey);
  uploadBody.append("timestamp", String(signatureData.timestamp));
  uploadBody.append("signature", signatureData.signature);
  uploadBody.append("folder", signatureData.folder ?? "propertyhub/listings");

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadBody
    }
  );

  const uploadData = (await readJsonSafely(uploadResponse)) as
    | { secure_url?: string; error?: { message?: string } }
    | null;

  if (!uploadResponse.ok || !uploadData?.secure_url) {
    throw new Error(
      uploadData?.error?.message ?? `Failed to upload image to Cloudinary (${uploadResponse.status}).`
    );
  }

  return uploadData.secure_url;
}

async function readJsonSafely(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
