# Deployment script for Acro Hub Frontend (PowerShell)
# This script builds the app and deploys it to AWS S3 + CloudFront

$ErrorActionPreference = "Stop"

Write-Host "[Build] Building application..." -ForegroundColor Cyan
npm run build

Write-Host "[Terraform] Getting S3 bucket name from Terraform..." -ForegroundColor Cyan
Push-Location terraform
$BUCKET_NAME = terraform output -raw s3_bucket_name
Pop-Location

Write-Host "[S3] Uploading to S3 bucket: $BUCKET_NAME" -ForegroundColor Cyan
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete

Write-Host "[CloudFront] Getting CloudFront distribution ID..." -ForegroundColor Cyan
Push-Location terraform
$DISTRIBUTION_ID = terraform output -raw cloudfront_distribution_id
Pop-Location

Write-Host "[CloudFront] Invalidating CloudFront cache..." -ForegroundColor Cyan
aws cloudfront create-invalidation `
  --distribution-id "$DISTRIBUTION_ID" `
  --paths "/*"

Write-Host "[Done] Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "[URL] Your website URL:" -ForegroundColor Cyan
Push-Location terraform
terraform output -raw website_url
Pop-Location
Write-Host ""
