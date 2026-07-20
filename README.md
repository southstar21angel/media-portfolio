# 🎥 Mirkazim Media Portfolio

A high-performance, premium, and fully localized video/photography portfolio and content management dashboard built for **Mirkazim Media**.

---

## 🌟 Key Features

* **Multi-Lingual Localization (i18n)**: Instant routing-friendly translation across **Azerbaijani (AZ)**, **Russian (RU)**, and **English (EN)** namespaces.
* **Self-Hosted CMS Admin Dashboard**: Secure authentication system linked to Supabase Auth. Allows creating, editing, re-ordering, and deleting projects directly from the browser.
* **Custom Storage Uploader**: High-performance upload implementation via raw `XMLHttpRequest` callbacks to Supabase Storage, featuring real-time file progress indicators (supporting up to 100MB videos).
* **Multi-Format Video Player**: Custom streaming frame supporting YouTube embed streams, Instagram Reels embeds, and native direct HTML5 video.
* **Sleek Dark Mode Aesthetics**: Tailwind v4 design system with customized splash screen drawing animations, scroll-reveals, and a canvas-style rising SVG wave animation inside the showcase section.
* **Advanced Code Splitting**: TanStack Router optimized loading structure, separating heavy dashboard components (`admin.lazy.jsx` and `$slug.lazy.jsx`) to keep initial bundles lightweight (~320kB).
* **Containerized Deployment**: Ready-to-go `Dockerfile` configuration and customized `nginx.conf` setups with built-in SPA router fallback redirects and static cache policies.

---

## 🛠️ Technical Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
* **Routing**: [TanStack Router v1](https://tanstack.com/router/latest)
* **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Keyframe CSS Animations + Radix UI + Lucide React
* **Backend Database & Storage**: [Supabase JS Client v2](https://supabase.com/)
* **Asset Optimization**: [Sharp](https://sharp.pixelplumbing.com/) (WebP image processing) + [FFmpeg](https://ffmpeg.org/) (H.264 video compression)
* **Code Quality**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) (Fast Rust-based Linter)

---

## 📂 Directory Structure

```text
├── .agents/             # Agent guidelines and custom rule files
├── public/              # Local optimized assets
│   ├── images/          # Backgrounds and portraits (.webp format)
│   └── videos/          # Showreels and background streams (.mp4 format)
├── scripts/             # Shell SQL migrations and image optimization scripts
│   ├── seed.sql         # Database schema setup migration script
│   └── optimize-images.js # Node script for WebP conversion
├── src/                 # React source code root
│   ├── components/      # UI components (Navbar, Footer, VideoPlayer, Logo)
│   ├── hooks/           # Custom data fetching and animation hooks
│   ├── i18n/            # Translation dictionary files (az, ru, en)
│   ├── lib/             # Helpers (Supabase client initialization)
│   ├── routes/          # File-based routes (root, admin, works list, detail)
│   └── main.jsx         # App initialization entry point
├── Dockerfile           # Multi-stage production container setup
└── nginx.conf           # Production server configurations with SPA redirects
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have [Node.js v22+](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-api-endpoint
VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📊 Media Assets Optimization

To maintain rapid loading times on mobile devices, keep raw high-resolution media out of the git repository. Follow these steps when adding new local files:

### Image Compression (WebP)
Run the automated image optimization script to convert PNGs/JPEGs in `public/images` to WebP:
```bash
node scripts/optimize-images.js
```

### Video Compression (MP4 H.264 + moov faststart)
If you place a new QuickTime `.MOV` reel inside `public/videos/`, re-encode it using `ffmpeg` for web compatibility and fast start playback:
```bash
ffmpeg -i .\public\videos\new_video.MOV -vcodec libx264 -crf 24 -acodec aac -movflags +faststart .\public\videos\reel.mp4
```

---

## 🐳 Deployment (Docker & Nginx)

The project includes container files optimized for deployment engines (like Coolify, Docker Compose, or manual VPS hosting):

### Build and Run Docker Container Locally
```bash
# Build
docker build -t mirmedia-portfolio \
  --build-arg VITE_SUPABASE_URL="https://your-supabase.co" \
  --build-arg VITE_SUPABASE_ANON_KEY="your-anon-key" .

# Run
docker run -p 8080:80 mirmedia-portfolio
```
The application will be accessible at `http://localhost:8080` with Nginx handling static assets caching and routing.
