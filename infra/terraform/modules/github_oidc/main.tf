terraform {
  required_providers {
    google-beta = {
      source = "hashicorp/google-beta"
    }
  }
}

variable "project_id" {
  type = string
}

variable "pool_id" {
  type = string
}

variable "provider_id" {
  type = string
}

variable "github_repository" {
  type = string
}

resource "google_iam_workload_identity_pool" "this" {
  provider = google-beta

  project                   = var.project_id
  workload_identity_pool_id = var.pool_id
  display_name              = "GitHub ${var.pool_id}"
  description               = "OIDC trust for GitHub Actions in ${var.github_repository}."
}

resource "google_iam_workload_identity_pool_provider" "this" {
  provider = google-beta

  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.this.workload_identity_pool_id
  workload_identity_pool_provider_id = var.provider_id
  display_name                       = "GitHub provider ${var.provider_id}"
  description                        = "GitHub Actions OIDC provider for ${var.github_repository}."

  attribute_mapping = {
    "google.subject"             = "assertion.sub"
    "attribute.actor"            = "assertion.actor"
    "attribute.aud"              = "assertion.aud"
    "attribute.ref"              = "assertion.ref"
    "attribute.repository"       = "assertion.repository"
    "attribute.repository_owner" = "assertion.repository_owner"
  }

  attribute_condition = "assertion.repository == \"${var.github_repository}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

output "workload_identity_pool_name" {
  value = google_iam_workload_identity_pool.this.name
}

output "workload_identity_provider_name" {
  value = google_iam_workload_identity_pool_provider.this.name
}

output "principal_set" {
  value = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.this.name}/attribute.repository/${var.github_repository}"
}
