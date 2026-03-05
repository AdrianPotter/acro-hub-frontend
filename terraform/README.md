# Terraform Infrastructure for Acro Hub Frontend

This directory contains Terraform configuration to deploy the Acro Hub Frontend to AWS using:
- **S3** for static file hosting
- **CloudFront** as a CDN with HTTPS
- **ACM** for SSL/TLS certificates (optional, for custom domains)
- **Route53** for DNS management (optional, for custom domains)

## Architecture

```
Users → CloudFront (HTTPS) → S3 Bucket (private)
         ↓
    ACM Certificate (us-east-1)
         ↓
    Route53 (optional custom domain)
```

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** v1.0 or later ([Install Terraform](https://www.terraform.io/downloads))
4. **(Optional)** A registered domain with Route53 hosted zone for custom domain setup

## Remote State Backend (Recommended)

For production use or team collaboration, set up a remote state backend before deploying the main infrastructure.

### Why Use Remote State?

- **Team Collaboration** - Multiple people can work on infrastructure safely
- **State Locking** - Prevents concurrent modifications using DynamoDB
- **Backup & Versioning** - Protects against state file loss
- **Security** - Centralized, encrypted state storage

### Setup Remote State (One-Time)

```bash
cd backend
terraform init
terraform apply
```

Note the backend configuration in the output, then add it to `main.tf`:

```hcl
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket         = "your-state-bucket-name"
    key            = "acro-hub-frontend/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
  
  required_providers {
    # ...existing code...
  }
}
```

Then migrate your state:

```bash
cd ..  # Back to terraform/ directory
terraform init -migrate-state
```

See [`backend/README.md`](backend/README.md) for detailed instructions.

**Note:** You can skip this for personal/testing projects and use local state.

## Quick Start

### 1. Configure Variables

Copy the example variables file and update with your values:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set at minimum:

```hcl
bucket_name = "acro-hub-frontend-your-unique-name"
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Review the Plan

```bash
terraform plan
```

### 4. Apply the Configuration

```bash
terraform apply
```

Type `yes` when prompted to create the resources.

### 5. Note the Outputs

After successful deployment, Terraform will output:
- `website_url` - The HTTPS URL of your deployed website
- `cloudfront_distribution_id` - For invalidating the cache
- `s3_bucket_name` - For uploading files

## Deploying Your Application

After the infrastructure is created, deploy your built application:

### 1. Build the Application

```bash
cd ..  # Return to project root
npm run build
```

### 2. Upload to S3

```bash
aws s3 sync dist/ s3://<bucket-name>/ --delete
```

Replace `<bucket-name>` with the value from `terraform output s3_bucket_name`.

### 3. Invalidate CloudFront Cache

After uploading new files, invalidate the CloudFront cache:

```bash
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

Replace `<distribution-id>` with the value from `terraform output cloudfront_distribution_id`.

### 4. Access Your Website

Visit the URL shown in `terraform output website_url`.

## Configuration Options

### Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `bucket_name` | S3 bucket name (must be globally unique) | - | Yes |
| `aws_region` | AWS region for S3 bucket | `us-east-1` | No |
| `environment` | Environment tag | `production` | No |
| `cloudfront_price_class` | CloudFront distribution coverage | `PriceClass_100` | No |
| `domain_name` | Custom domain name | `""` | No |
| `route53_zone_id` | Route53 hosted zone ID | `""` | No |

### CloudFront Price Classes

- **PriceClass_100** - US, Canada, Europe (cheapest, recommended for testing)
- **PriceClass_200** - PriceClass_100 + Asia, Africa, Oceania, Middle East
- **PriceClass_All** - All CloudFront edge locations worldwide

## Using a Custom Domain

To use your own domain (e.g., `acrohub.example.com`):

1. **Ensure you have a Route53 hosted zone** for your domain
2. **Update terraform.tfvars**:
   ```hcl
   domain_name = "acrohub.example.com"
   route53_zone_id = "Z1234567890ABC"  # Your Route53 zone ID
   ```
3. **Apply the configuration**:
   ```bash
   terraform apply
   ```

Terraform will:
- Create an ACM certificate in us-east-1
- Create DNS validation records in Route53
- Wait for certificate validation
- Configure CloudFront to use your custom domain
- Create an A record pointing to CloudFront

**Note:** Certificate validation can take 5-30 minutes.

## Outputs

After applying, you can view outputs at any time:

```bash
terraform output
```

Available outputs:
- `website_url` - Full HTTPS URL
- `s3_bucket_name` - S3 bucket name
- `s3_bucket_arn` - S3 bucket ARN
- `cloudfront_distribution_id` - CloudFront distribution ID
- `cloudfront_domain_name` - CloudFront default domain
- `acm_certificate_arn` - ACM certificate ARN (if using custom domain)

## Deployment Script

For convenience, you can use this one-liner to build and deploy:

```bash
npm run build && aws s3 sync dist/ s3://$(terraform -chdir=terraform output -raw s3_bucket_name)/ --delete && aws cloudfront create-invalidation --distribution-id $(terraform -chdir=terraform output -raw cloudfront_distribution_id) --paths "/*"
```

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning:** This will permanently delete your S3 bucket and all uploaded files.

## Security Features

- ✅ S3 bucket is **private** (not publicly accessible)
- ✅ CloudFront uses **Origin Access Control (OAC)** to access S3
- ✅ All traffic is **HTTPS only** (HTTP redirects to HTTPS)
- ✅ **TLS 1.2** minimum protocol version
- ✅ Bucket versioning enabled
- ✅ No public bucket policies

## Troubleshooting

### "Bucket name already exists"
S3 bucket names must be globally unique. Change `bucket_name` in terraform.tfvars.

### Certificate validation timeout
DNS propagation can take time. Wait 5-30 minutes and try again.

### 403 Forbidden errors
Check that:
1. Files were uploaded to S3
2. CloudFront distribution is "Deployed" status (can take 15-20 minutes)
3. Bucket policy allows CloudFront access

### CloudFront shows old content
Create a cache invalidation:
```bash
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

## Cost Estimation

Typical monthly costs for a low-traffic site:
- **S3**: ~$0.50 (1 GB storage + requests)
- **CloudFront**: Free tier includes 1 TB transfer, 10M requests
- **Route53**: $0.50/hosted zone (if using custom domain)
- **ACM Certificate**: FREE

**Total**: ~$0.50-1.00/month for most use cases

## Additional Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

