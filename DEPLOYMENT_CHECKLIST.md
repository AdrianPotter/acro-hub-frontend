# AWS Deployment Checklist

Use this checklist to ensure a smooth deployment of Acro Hub Frontend to AWS.

## ☐ Prerequisites Setup

- [ ] AWS Account created
- [ ] AWS CLI installed
- [ ] AWS CLI configured with credentials (`aws configure`)
- [ ] Terraform installed (v1.0+)
- [ ] Node.js and npm installed

## ☐ Remote State Backend (Recommended for Production)

- [ ] Navigate to backend directory: `cd terraform/backend`
- [ ] Initialize backend Terraform: `terraform init`
- [ ] Create backend resources: `terraform apply`
- [ ] Copy the backend configuration from output
- [ ] Add backend config to `terraform/main.tf` in the `terraform {}` block
- [ ] Navigate back to terraform directory: `cd ..`
- [ ] Migrate state: `terraform init -migrate-state`
- [ ] Type `yes` to confirm migration

**Note:** Skip this section for personal/testing projects

## ☐ Initial Configuration

- [ ] Navigate to terraform directory: `cd terraform`
- [ ] Copy example config: `cp terraform.tfvars.example terraform.tfvars`
- [ ] Edit `terraform.tfvars` and set `bucket_name` (must be globally unique)
- [ ] (Optional) Set custom domain and Route53 zone ID if using custom domain

## ☐ Infrastructure Deployment

- [ ] Initialize Terraform: `terraform init`
- [ ] Review plan: `terraform plan`
- [ ] Apply configuration: `terraform apply`
- [ ] Type `yes` to confirm
- [ ] Wait for deployment to complete (~5-10 minutes)
- [ ] Note the `website_url` output

## ☐ Application Deployment

- [ ] Return to project root: `cd ..`
- [ ] Run deployment script: `.\deploy.ps1` (Windows) or `./deploy.sh` (Linux/Mac)
- [ ] Wait for build to complete
- [ ] Wait for upload to complete
- [ ] Wait for cache invalidation

## ☐ Verification

- [ ] Wait 15-20 minutes for CloudFront deployment to fully propagate
- [ ] Visit the website URL from `terraform output website_url`
- [ ] Test all routes: home, about, login, register, moves
- [ ] Verify HTTPS is working (look for padlock icon)
- [ ] Test on mobile device

## ☐ Custom Domain Setup (Optional)

- [ ] Verify Route53 hosted zone exists for your domain
- [ ] Update `terraform/terraform.tfvars` with domain info
- [ ] Run `terraform apply` again
- [ ] Wait 5-30 minutes for certificate validation
- [ ] Update DNS if domain registrar is not Route53
- [ ] Test custom domain with HTTPS

## ☐ Post-Deployment

- [ ] Document the CloudFront distribution ID
- [ ] Document the S3 bucket name
- [ ] Save `terraform.tfvars` securely (do not commit to git)
- [ ] Set up monitoring alerts (optional)
- [ ] Configure backup strategy (optional)

## ☐ Future Updates

When updating the application:
- [ ] Make code changes
- [ ] Run `.\deploy.ps1` (Windows) or `./deploy.sh` (Linux/Mac)
- [ ] Wait 1-2 minutes for cache invalidation
- [ ] Test the updated site

## Quick Reference Commands

### Get website URL
```powershell
cd terraform
terraform output website_url
```

### Get bucket name
```powershell
cd terraform
terraform output s3_bucket_name
```

### Get CloudFront distribution ID
```powershell
cd terraform
terraform output cloudfront_distribution_id
```

### Manual cache invalidation
```powershell
aws cloudfront create-invalidation `
  --distribution-id $(cd terraform; terraform output -raw cloudfront_distribution_id) `
  --paths "/*"
```

### Check Terraform state
```powershell
cd terraform
terraform show
```

### Destroy everything
```powershell
cd terraform
terraform destroy
```

---

**Estimated Total Time:** 30-45 minutes for first deployment  
**Subsequent Deployments:** 2-5 minutes

