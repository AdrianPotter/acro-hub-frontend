variable "aws_region" {
  description = "AWS region for the S3 bucket"
  type        = string
  default     = "eu-west-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket (must be globally unique)"
  type        = string
  default     = "acrohub.org"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, production)"
  type        = string
  default     = "production"
}

variable "cloudfront_price_class" {
  description = "CloudFront price class (PriceClass_All, PriceClass_200, PriceClass_100)"
  type        = string
  default     = "PriceClass_100"
}

variable "domain_name" {
  description = "Custom domain name for the website (leave empty to use CloudFront default domain)"
  type        = string
  default     = "acrohub.org"
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID (required if using custom domain)"
  type        = string
  default     = "Z04501911GNFDYM9PBX6Y"
}

