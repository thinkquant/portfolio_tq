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

variable "metrics" {
  type = map(object({
    description = string
    filter      = string
  }))
}

resource "google_logging_metric" "this" {
  for_each = var.metrics

  project     = var.project_id
  name        = each.key
  description = each.value.description
  filter      = each.value.filter

  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
    unit        = "1"
  }
}

output "metric_names" {
  value = { for name, metric in google_logging_metric.this : name => metric.name }
}
