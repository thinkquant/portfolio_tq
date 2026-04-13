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

variable "site_id" {
  type = string
}

variable "create_site" {
  type    = bool
  default = false
}

resource "google_firebase_hosting_site" "this" {
  provider = google-beta
  count    = var.create_site ? 1 : 0

  project = var.project_id
  site_id = var.site_id
}

output "site_id" {
  value = var.create_site ? google_firebase_hosting_site.this[0].site_id : var.site_id
}

output "default_url" {
  value = var.create_site ? google_firebase_hosting_site.this[0].default_url : "https://${var.site_id}.web.app"
}

output "managed_by_terraform" {
  value = var.create_site
}
