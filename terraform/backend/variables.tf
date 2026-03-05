variable "aws_region" {
  description = "AWS region for the state bucket and DynamoDB table"
  type        = string
  default     = "eu-west-1"
}

variable "state_bucket_prefix" {
  description = "Prefix for the Terraform state bucket name (will be suffixed with random characters)"
  type        = string
  default     = "acro-hub-frontend-terraform-state"
}

variable "lock_table_name" {
  description = "Name of the DynamoDB table for state locking"
  type        = string
  default     = "frontend-terraform-state-lock"
}

