terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

variable "project_id" {
  type = string
}

variable "account_id" {
  type = string
}

variable "display_name" {
  type = string
}

variable "roles" {
  type    = set(string)
  default = []
}

variable "workload_identity_member" {
  type    = string
  default = null
}

resource "google_service_account" "this" {
  project      = var.project_id
  account_id   = var.account_id
  display_name = var.display_name
}

resource "google_project_iam_member" "roles" {
  for_each = var.roles

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.this.email}"
}

resource "google_service_account_iam_member" "workload_identity_user" {
  count = var.workload_identity_member == null ? 0 : 1

  service_account_id = google_service_account.this.name
  role               = "roles/iam.workloadIdentityUser"
  member             = var.workload_identity_member
}

output "email" {
  value = google_service_account.this.email
}

output "name" {
  value = google_service_account.this.name
}
