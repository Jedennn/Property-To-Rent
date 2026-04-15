import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_FOLDER,
  createCloudinarySignature,
  hasCloudinaryConfig
} from "@/lib/cloudinary";

export async function GET() {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured yet. Add the required environment variables first." },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    folder: CLOUDINARY_UPLOAD_FOLDER,
    timestamp
  };

  return NextResponse.json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder: CLOUDINARY_UPLOAD_FOLDER,
    timestamp,
    signature: createCloudinarySignature(params)
  });
}
