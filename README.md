# PropertyHub

Simple property listing website built with Next.js and Tailwind CSS.

## Features

- Homepage with clean listing grid
- Detail page for each listing
- Admin page to add a new listing
- Multiple image upload support
- Fields for title, price, description, images, and status

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

- New listings are stored in the browser using `localStorage`.
- Seed listings are included so the homepage is not empty on first load.
- Set `ADMIN_PASSWORD` in your environment or Vercel project settings to protect admin access.
