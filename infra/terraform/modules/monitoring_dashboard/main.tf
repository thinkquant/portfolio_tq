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

variable "dashboard_json" {
  type = string
}

resource "google_monitoring_dashboard" "this" {
  project        = var.project_id
  dashboard_json = var.dashboard_json
}

output "id" {
  value = google_monitoring_dashboard.this.id
}
