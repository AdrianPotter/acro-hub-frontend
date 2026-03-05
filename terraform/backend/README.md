# Terraform Backend Configuration (S3 + DynamoDB)

This directory contains Terraform configuration to create the remote state backend infrastructure.

## What This Creates

- **S3 bucket** for storing Terraform state files
- **DynamoDB table** for state locking
- **Encryption** enabled on the S3 bucket
- **Versioning** enabled for state file history

## One-Time Setup

This backend infrastructure must be created **before** the main infrastructure, and it uses **local state** initially.

### 1. Create the Backend Infrastructure

```powershell
cd terraform/backend
terraform init
terraform apply
```

Note the outputs:
- `state_bucket_name` - Your state bucket name
- `lock_table_name` - Your DynamoDB lock table name

### 2. Configure Main Terraform to Use Remote State

The outputs will show you the exact configuration to add to `terraform/main.tf`.

Edit `terraform/main.tf` and add the backend configuration in the `terraform` block:

```hcl
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket         = "your-terraform-state-bucket-name"
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

### 3. Migrate to Remote State

```powershell
cd ..  # Back to terraform/ directory
terraform init -migrate-state
```

Type `yes` when prompted to migrate your existing state.

## Important Notes

⚠️ **Bootstrap Problem**: The backend configuration itself uses local state (in `terraform/backend/.terraform/`). This is normal and expected.

⚠️ **State Bucket Naming**: The bucket name must be globally unique. The default uses a random suffix.

⚠️ **Backup**: The `backend/` directory's local state should be backed up securely after creation.

## Cost

- **S3**: ~$0.01-0.05/month for state storage
- **DynamoDB**: Free tier covers state locking (25 WCU/RCU free forever)

Total: Essentially free for small teams.

