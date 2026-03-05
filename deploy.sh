#!/bin/bash

# Deployment script for Acro Hub Frontend
# This script builds the app and deploys it to AWS S3 + CloudFront

set -e  # Exit on error

echo "🏗️  Building application..."
npm run build

echo "📦 Getting S3 bucket name from Terraform..."
BUCKET_NAME=$(cd terraform && terraform output -raw s3_bucket_name)

echo "☁️  Uploading to S3 bucket: $BUCKET_NAME"
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete

echo "🔄 Getting CloudFront distribution ID..."
DISTRIBUTION_ID=$(cd terraform && terraform output -raw cloudfront_distribution_id)

echo "♻️  Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your website URL:"
cd terraform && terraform output -raw website_url
echo ""

