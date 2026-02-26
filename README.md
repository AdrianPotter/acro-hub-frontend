# Acro Hub Frontend

A Vue.js single-page application that serves as a partner acrobatics move database.

## Tech Stack

- [Vue 3](https://vuejs.org/) with Composition API (`<script setup>`)
- [Vite](https://vitejs.dev/) for fast development and optimised production builds
- [Vue Router 4](https://router.vuejs.org/) with hash-based history (required for S3 SPA hosting)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with logo, description, and login/register buttons |
| `/about` | About page describing the project |
| `/login` | Login form (email + password) |
| `/register` | Registration form (email, password, confirm password, T&C checkbox) |
| `/moves` | Searchable list of acrobatics moves |

## Colour Palette

| Swatch | Hex | Usage |
|--------|-----|-------|
| White | `#FFFFFF` | Backgrounds, text on dark |
| Darkest | `#00171F` | Body text, footer background |
| Dark Blue | `#003459` | Navigation, headings |
| Mid Blue | `#007EA7` | Accents, borders |
| Light Blue | `#00A8E8` | CTAs, interactive elements |

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The app will be available at <http://localhost:5173>.

### Build for production

```bash
npm run build
```

The compiled output will be placed in the `dist/` directory.

### Preview the production build locally

```bash
npm run preview
```

---

## Deploying to AWS S3

The app uses [hash-based routing](https://router.vuejs.org/guide/essentials/history-mode.html#hash-mode)
(`createWebHashHistory`), so all navigation is handled client-side via the URL hash fragment
(e.g. `/#/login`). This means no special server-side redirect rules are required — the S3 bucket
only needs to serve `index.html`.

### Steps

1. **Build the app:**

   ```bash
   npm run build
   ```

2. **Create an S3 bucket** with static website hosting enabled.
   - In the AWS Console, go to **S3 → Create bucket**.
   - Uncheck *Block all public access* (required for a public website).
   - Enable **Static website hosting** under bucket properties.
   - Set **Index document** to `index.html`.
   - Set **Error document** to `index.html` (so deep links resolve correctly).

3. **Upload the `dist/` folder contents** to the bucket root:

   ```bash
   aws s3 sync dist/ s3://<your-bucket-name>/ --delete
   ```

4. **Set a bucket policy** to allow public read access:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::<your-bucket-name>/*"
       }
     ]
   }
   ```

5. Your site will be accessible at the **S3 static website endpoint**:
   `http://<your-bucket-name>.s3-website-<region>.amazonaws.com`

> **Optional:** Front the S3 bucket with **Amazon CloudFront** for HTTPS, custom domain support,
> and improved performance.

---

## Project Structure

```
acro-hub-frontend/
├── public/              # Static assets served as-is
├── src/
│   ├── assets/          # Images, icons
│   ├── components/
│   │   ├── NavBar.vue   # Top navigation bar
│   │   └── FooterBar.vue# Page footer
│   ├── router/
│   │   └── index.js     # Vue Router configuration
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── MovesView.vue
│   ├── App.vue          # Root component
│   ├── main.js          # App entry point
│   └── style.css        # Global styles & CSS variables
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── prompt.md            # Original project prompt
└── README.md            # This file
```
