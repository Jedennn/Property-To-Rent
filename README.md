# PropertyHub

Simple property listing website built with Next.js and Tailwind CSS.

## Features

- Homepage with clean listing grid
- Detail page for each listing
- Admin page to add a new listing
- Multiple image upload support
- Fields for title, description, images, and status

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Notes

- Listings now load from the server API instead of browser `localStorage`, so edits can sync across devices.
- For local development without KV, the app falls back to [data/listings.json](/C:/Users/denys/Desktop/property-listing/data/listings.json).
- On Vercel, connect a KV store so create, edit, and delete actions persist after deployment.
- Images should be uploaded to Cloudinary, and only the returned image URLs are stored with each listing.
- Set `ADMIN_PASSWORD` in your environment or Vercel project settings to protect admin access.
- Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in your environment or Vercel project settings for the WhatsApp inquiry button.

## Vercel Sync Setup

1. In Vercel, open your project and add a `KV` storage integration.
2. Redeploy the project after Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. After redeploy, listings created from phone and laptop will use the same shared server storage.

## Cloudinary Setup

1. Create a Cloudinary account and open your product environment dashboard.
2. Copy `Cloud name`, `API Key`, and `API Secret`.
3. Add these environment variables in Vercel for your project:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_UPLOAD_FOLDER` (optional, for example `propertyhub/listings`)
4. Redeploy after saving the variables.

The upload flow now uses a signed upload generated on the server, based on Cloudinary's Upload API:
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Node.js image and video upload](https://cloudinary.com/documentation/node_image_and_video_upload)
