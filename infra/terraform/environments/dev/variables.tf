variable "environment" {
  type    = string
  default = "dev"
}

variable "project_id" {
  type    = string
  default = "portfolio-tq-dev"
}

variable "project_number" {
  type    = string
  default = "932345783663"
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "firestore_location" {
  type    = string
  default = "nam5"
}

variable "firestore_database_id" {
  type    = string
  default = "portfolio-tq-dev"
}

variable "firebase_site_id" {
  type    = string
  default = "portfolio-tq-dev"
}

variable "github_repository" {
  type    = string
  default = "thinkquant/portfolio_tq"
}

variable "artifact_registry_repository_id" {
  type    = string
  default = "portfolio-tq-api"
}

variable "cloud_run_service_name" {
  type    = string
  default = "portfolio-tq-api"
}

variable "cloud_run_container_image" {
  type    = string
  default = "us-docker.pkg.dev/cloudrun/container/hello"
}
