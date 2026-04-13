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

variable "location" {
  type = string
}

variable "repository_id" {
  type = string
}

variable "description" {
  type = string
}

variable "format" {
  type    = string
  default = "DOCKER"
}

variable "labels" {
  type    = map(string)
  default = {}
}

resource "google_artifact_registry_repository" "this" {
  project       = var.project_id
  location      = var.location
  repository_id = var.repository_id
  description   = var.description
  format        = var.format
  labels        = var.labels
}

output "id" {
  value = google_artifact_registry_repository.this.id
}

output "name" {
  value = google_artifact_registry_repository.this.name
}

output "repository_url" {
  value = "${var.location}-docker.pkg.dev/${var.project_id}/${var.repository_id}"
}
