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

variable "secret_names" {
  type = set(string)
}

resource "google_secret_manager_secret" "this" {
  for_each = var.secret_names

  project   = var.project_id
  secret_id = each.value

  replication {
    auto {}
  }
}

output "secret_ids" {
  value = { for name, secret in google_secret_manager_secret.this : name => secret.secret_id }
}
