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

variable "database_id" {
  type = string
}

variable "indexes" {
  type = list(object({
    name        = string
    collection  = string
    query_scope = string
    fields = list(object({
      field_path   = string
      order        = optional(string)
      array_config = optional(string)
    }))
  }))
  default = []
}

locals {
  indexes_by_name = { for index in var.indexes : index.name => index }
}

resource "google_firestore_index" "this" {
  provider = google-beta
  for_each = local.indexes_by_name

  project     = var.project_id
  database    = var.database_id
  collection  = each.value.collection
  query_scope = each.value.query_scope

  dynamic "fields" {
    for_each = each.value.fields
    content {
      field_path   = fields.value.field_path
      order        = try(fields.value.order, null)
      array_config = try(fields.value.array_config, null)
    }
  }
}

output "database_id" {
  value = var.database_id
}

output "index_ids" {
  value = { for name, index in google_firestore_index.this : name => index.id }
}
