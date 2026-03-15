# Acro Hub Frontend

A Vue.js single-page application that serves as a partner acrobatics move database.

## Tech Stack

- [Vue 3](https://vuejs.org/) with Composition API (`<script setup>`)
- [Vite](https://vitejs.dev/) for fast development and optimised production builds
- [Vue Router 4](https://router.vuejs.org/) with hash-based history (required for S3 SPA hosting)

## Backend Integration

This SPA connects to the [Acro Hub Backend](https://github.com/AdrianPotter/acro-hub-backend) REST API. The following endpoints are consumed:

| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| `POST` | `/auth/login` | No | Authenticate; returns `{ accessToken, idToken, refreshToken, … }` |
| `POST` | `/auth/logout` | accessToken | Globally revoke all Cognito tokens |
| `POST` | `/auth/register` | No | Create a new account; returns `{ message, userSub, confirmed }` |
| `GET` | `/moves` | idToken (Bearer) | Return all moves as `{ moves: Move[], count: N }` |

The `idToken` (Cognito ID token) is stored in `localStorage` and sent as `Authorization: Bearer <idToken>` on all authenticated requests. The `accessToken` is stored separately and used only for the `/auth/logout` call.

### Move fields

The `Move` objects returned by `GET /moves` contain:

| Field | Type | Notes |
|-------|------|-------|
| `moveId` | string (UUID) | Unique identifier |
| `name` | string | Move name |
| `description` | string | Description |
| `difficulty` | `easy` \| `medium` \| `hard` \| `expert` | Skill level |
| `tags` | string[] | Free-form tags |

### Configuration

Copy `.env.example` to `.env.local` and set the backend URL:

```bash
cp .env.example .env.local
# then edit .env.local:
VITE_API_BASE_URL=https://api.acrohub.org
```

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

## Deploying to AWS with Terraform

This project includes Terraform configuration to deploy the frontend to AWS with:
- **S3** for static file hosting (private bucket)
- **CloudFront** CDN with HTTPS
- **ACM** SSL/TLS certificates (optional, for custom domains)
- **Route53** DNS management (optional, for custom domains)

### Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/) configured with credentials
- [Terraform](https://www.terraform.io/downloads) v1.0 or later
- An AWS account with appropriate permissions

### Quick Start

#### 1. Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set your bucket name (must be globally unique):

```hcl
bucket_name = "acro-hub-frontend-your-unique-name"
```

#### 2. Initialize and Apply Terraform

```bash
terraform init
terraform plan
terraform apply
```

Type `yes` when prompted. This creates:
- S3 bucket (private)
- CloudFront distribution with HTTPS
- Origin Access Control for secure S3 access
- Proper bucket policies

#### 3. Deploy Your Application

Use the deployment script:

**PowerShell (Windows):**
```powershell
.\deploy.ps1
```

**Bash (Linux/Mac):**
```bash
chmod +x deploy.sh
./deploy.sh
```

Or manually:

```bash
# Build the app
npm run build

# Upload to S3
aws s3 sync dist/ s3://$(cd terraform && terraform output -raw s3_bucket_name)/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $(cd terraform && terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

#### 4. Access Your Website

Get your website URL:

```bash
cd terraform
terraform output website_url
```

Your site will be available via HTTPS at the CloudFront distribution URL.

### Using a Custom Domain

To use your own domain (e.g., `acrohub.example.com`):

1. Ensure you have a Route53 hosted zone for your domain
2. Update `terraform/terraform.tfvars`:
   ```hcl
   domain_name = "acrohub.example.com"
   route53_zone_id = "Z1234567890ABC"  # Your Route53 zone ID
   ```
3. Run `terraform apply`

Terraform will automatically:
- Create and validate an ACM certificate
- Configure CloudFront to use your domain
- Create DNS records in Route53

**Note:** Certificate validation can take 5-30 minutes.

### Additional Configuration

See [`terraform/README.md`](terraform/README.md) for:
- Detailed deployment instructions
- Configuration options
- Custom domain setup
- Troubleshooting tips
- Cost estimates

### Security Features

- ✅ S3 bucket is private (not publicly accessible)
- ✅ CloudFront uses Origin Access Control (OAC)
- ✅ All traffic is HTTPS only (HTTP redirects to HTTPS)
- ✅ TLS 1.2 minimum protocol version
- ✅ Bucket versioning enabled

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
│   ├── composables/
│   │   └── useAuth.js   # Auth state (tokens) composable
│   ├── router/
│   │   └── index.js     # Vue Router configuration
│   ├── services/
│   │   └── api.js       # Centralised fetch wrapper for backend API
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── MovesView.vue
│   ├── App.vue          # Root component
│   ├── main.js          # App entry point
│   └── style.css        # Global styles & CSS variables
├── terraform/           # AWS infrastructure as code
│   ├── main.tf          # Main Terraform configuration
│   ├── variables.tf     # Input variables
│   ├── outputs.tf       # Output values
│   ├── terraform.tfvars.example  # Example configuration
│   └── README.md        # Detailed deployment guide
├── .env.example         # Environment variable template
├── deploy.sh            # Deployment script (Bash)
├── deploy.ps1           # Deployment script (PowerShell)
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── prompt.md            # Original project prompt
└── README.md            # This file
```
