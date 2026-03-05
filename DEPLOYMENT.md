# Acro Hub Frontend - AWS Deployment Summary

This project has been configured with complete Terraform infrastructure to deploy to AWS with S3, CloudFront, and HTTPS support.

## What Was Created

### Terraform Configuration Files
- **`terraform/main.tf`** - Complete infrastructure configuration including:
  - S3 bucket (private, with versioning)
  - CloudFront distribution with HTTPS
  - Origin Access Control (OAC) for secure S3 access
  - ACM SSL/TLS certificates (optional, for custom domains)
  - Route53 DNS records (optional, for custom domains)
  - Proper bucket policies and security settings

- **`terraform/variables.tf`** - Input variables for customization:
  - `bucket_name` (required) - Globally unique S3 bucket name
  - `aws_region` (default: us-east-1)
  - `environment` (default: production)
  - `cloudfront_price_class` (default: PriceClass_100)
  - `domain_name` (optional) - For custom domain
  - `route53_zone_id` (optional) - For custom domain DNS

- **`terraform/outputs.tf`** - Useful output values:
  - Website URL (HTTPS)
  - S3 bucket name and ARN
  - CloudFront distribution ID and domain
  - ACM certificate ARN (if using custom domain)

- **`terraform/terraform.tfvars.example`** - Example configuration file
- **`terraform/README.md`** - Comprehensive deployment guide

### Deployment Scripts
- **`deploy.ps1`** - PowerShell deployment script for Windows
- **`deploy.sh`** - Bash deployment script for Linux/Mac

Both scripts automate:
1. Building the application
2. Uploading to S3
3. Invalidating CloudFront cache

### Updated Documentation
- **`README.md`** - Updated with Terraform deployment instructions
- **`.gitignore`** - Updated to exclude Terraform state files

## Quick Deployment Guide

### First-Time Setup

1. **Install Prerequisites**
   - [AWS CLI](https://aws.amazon.com/cli/) - Configure with `aws configure`
   - [Terraform](https://www.terraform.io/downloads) v1.0+

2. **(Recommended) Set Up Remote State Backend**
   
   For production use and team collaboration, create a remote state backend:
   
   ```powershell
   cd terraform/backend
   terraform init
   terraform apply
   ```
   
   After creation, copy the backend configuration shown in the output and add it to `terraform/main.tf` in the `terraform {}` block. Then run:
   
   ```powershell
   cd ..
   terraform init -migrate-state
   ```
   
   See `terraform/backend/README.md` for details.
   
   **Note:** You can skip this for testing/personal projects and use local state.

3. **Configure Terraform**
   ```powershell
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars and set bucket_name
   ```

4. **Create Infrastructure**
   ```powershell
   terraform init
   terraform plan
   terraform apply
   ```

4. **Deploy Application**
   ```powershell
   cd ..
   .\deploy.ps1
   ```

5. **Get Your Website URL**
   ```powershell
   cd terraform
   terraform output website_url
   ```

### Subsequent Deployments

After making changes to your Vue.js application:

```powershell
.\deploy.ps1
```

That's it! The script handles building, uploading, and cache invalidation.

## Architecture Overview

```
┌─────────┐
│  Users  │
└────┬────┘
     │
     │ HTTPS (TLS 1.2+)
     ▼
┌─────────────────────┐
│    CloudFront       │
│   (CDN + HTTPS)     │
└──────────┬──────────┘
           │
           │ Origin Access Control (OAC)
           ▼
    ┌──────────────┐
    │  S3 Bucket   │
    │   (Private)  │
    └──────────────┘

Optional:
┌─────────────┐      ┌──────────────┐
│   Route53   │◄─────│ ACM Cert     │
│    (DNS)    │      │ (us-east-1)  │
└─────────────┘      └──────────────┘
```

## Key Features

✅ **Secure by Default**
   - S3 bucket is private (not publicly accessible)
   - CloudFront uses Origin Access Control
   - All traffic forced to HTTPS
   - TLS 1.2 minimum encryption

✅ **Production Ready**
   - CloudFront CDN for global performance
   - S3 versioning enabled for rollback
   - Proper error handling for SPA routing
   - Gzip compression enabled

✅ **Cost Efficient**
   - CloudFront free tier: 1TB transfer + 10M requests/month
   - S3 storage: ~$0.023/GB/month
   - Estimated cost: <$1/month for typical usage

✅ **Easy to Use**
   - One-command deployment scripts
   - Automated cache invalidation
   - Clear documentation

## Custom Domain Setup

To use your own domain (e.g., `acrohub.example.com`):

1. Ensure you have a Route53 hosted zone
2. Edit `terraform/terraform.tfvars`:
   ```hcl
   domain_name = "acrohub.example.com"
   route53_zone_id = "Z1234567890ABC"
   ```
3. Run `terraform apply`

Terraform automatically handles:
- SSL certificate creation and validation
- CloudFront configuration
- DNS record creation

**Note:** Initial certificate validation takes 5-30 minutes.

## Useful Commands

### View Infrastructure Outputs
```powershell
cd terraform
terraform output
```

### Manual Deployment Steps
```powershell
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://YOUR-BUCKET-NAME/ --delete

# Invalidate cache
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
```

### Destroy Infrastructure
```powershell
cd terraform
terraform destroy
```

**Warning:** This permanently deletes all resources and data.

## Troubleshooting

### 403 Forbidden
- Wait 15-20 minutes for CloudFront deployment to complete
- Verify files uploaded to S3
- Check bucket policy allows CloudFront access

### Old Content After Deployment
- Cache invalidation can take 1-2 minutes
- Check CloudFront invalidation status in AWS Console

### Bucket Name Already Exists
- S3 bucket names are globally unique
- Choose a different name in `terraform.tfvars`

## Next Steps

1. **Deploy your application** using the steps above
2. **Set up CI/CD** with GitHub Actions, AWS CodePipeline, etc.
3. **Monitor costs** in AWS Cost Explorer
4. **Add a backend API** (consider AWS API Gateway + Lambda)
5. **Set up custom domain** for professional branding

## Resources

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
- [AWS CLI S3 Commands](https://docs.aws.amazon.com/cli/latest/reference/s3/)
- [Vue.js Production Deployment](https://vuejs.org/guide/best-practices/production-deployment.html)

## Support

For detailed information, see:
- `terraform/README.md` - Comprehensive Terraform guide
- `README.md` - Project overview and quick start

---

**Ready to deploy!** 🚀

