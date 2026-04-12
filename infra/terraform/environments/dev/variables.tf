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
  default = "portfolio-tq-api-dev"
}

variable "cloud_run_container_port" {
  type    = number
  default = 8080
}

variable "cloud_run_ingress" {
  type    = string
  default = "INGRESS_TRAFFIC_ALL"
}

variable "cloud_run_allow_unauthenticated" {
  type    = bool
  default = true
}

variable "cloud_run_min_instance_count" {
  type    = number
  default = 0
}

variable "cloud_run_max_instance_count" {
  type    = number
  default = 2
}

variable "cloud_run_concurrency" {
  type    = number
  default = 40
}

variable "cloud_run_cpu" {
  type    = string
  default = "1"
}

variable "cloud_run_memory" {
  type    = string
  default = "512Mi"
}

variable "cloud_run_container_image" {
  type    = string
  default = "us-central1-docker.pkg.dev/portfolio-tq-dev/portfolio-tq-api/portfolio-tq-api:observability-v1"
}
