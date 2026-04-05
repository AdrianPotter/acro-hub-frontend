output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "website_url" {
  description = "URL of the website"
  value       = "https://${var.domain_name}"
}

output "github_actions_access_key_id" {
  description = "AWS access key ID for the GitHub Actions IAM user"
  value       = aws_iam_access_key.github_actions.id
  sensitive   = true
}

output "github_actions_secret_access_key" {
  description = "AWS secret access key for the GitHub Actions IAM user (sensitive)"
  value       = aws_iam_access_key.github_actions.secret
  sensitive   = true
}

