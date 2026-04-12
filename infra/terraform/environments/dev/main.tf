locals {
  common_labels = {
    environment = var.environment
    managed_by  = "terraform"
    repository  = "portfolio_tq"
  }

  github_pool_id     = "github-actions-dev"
  github_provider_id = "github-dev"

  deploy_roles = toset([
    "roles/artifactregistry.writer",
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/secretmanager.secretAccessor",
  ])

  secret_names = toset([
    "vertex-ai-location",
    "demo-access-gate",
  ])

  logging_metrics = {
    run-failures = {
      description = "Count failed Cloud Run request/error events for the API service."
      filter      = "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${var.cloud_run_service_name}\" severity>=ERROR"
    }
  }

  dashboard_json = jsonencode({
    displayName = "portfolio_tq dev overview"
    mosaicLayout = {
      columns = 12
      tiles = [
        {
          xPos   = 0
          yPos   = 0
          width  = 12
          height = 4
          widget = {
            title = "Environment summary"
            text = {
              content = "Environment: dev\\nProject: ${var.project_id}\\nCloud Run service: ${var.cloud_run_service_name}\\nFirebase site: ${var.firebase_site_id}"
            }
          }
        }
      ]
    }
  })
}

module "github_oidc" {
  source = "../../modules/github_oidc"

  project_id        = var.project_id
  pool_id           = local.github_pool_id
  provider_id       = local.github_provider_id
  github_repository = var.github_repository
}

module "deploy_service_account" {
  source = "../../modules/iam_service_account"

  project_id               = var.project_id
  account_id               = "github-deploy-dev"
  display_name             = "GitHub deploy account for dev"
  roles                    = local.deploy_roles
  workload_identity_member = module.github_oidc.principal_set
}

module "artifact_registry" {
  source = "../../modules/artifact_registry"

  project_id    = var.project_id
  location      = var.region
  repository_id = var.artifact_registry_repository_id
  description   = "Container images for the dev API service."
  labels        = local.common_labels
}

module "secrets" {
  source = "../../modules/secrets"

  project_id   = var.project_id
  secret_names = local.secret_names
}

module "cloud_run_service" {
  source = "../../modules/cloud_run_service"

  project_id            = var.project_id
  location              = var.region
  service_name          = var.cloud_run_service_name
  image                 = var.cloud_run_container_image
  service_account_email = module.deploy_service_account.email

  env_vars = {
    APP_ENV            = var.environment
    FIRESTORE_DATABASE = var.firestore_database_id
    FIRESTORE_LOCATION = var.firestore_location
    GCP_PROJECT_ID     = var.project_id
  }

  secret_env_vars = {
    DEMO_ACCESS_GATE = {
      secret_name = module.secrets.secret_ids["demo-access-gate"]
      version     = "latest"
    }
  }
}

module "firebase_hosting" {
  source = "../../modules/firebase_hosting"

  project_id  = var.project_id
  site_id     = var.firebase_site_id
  create_site = false
}

module "firestore_indexes" {
  source = "../../modules/firestore_indexes"

  project_id  = var.project_id
  database_id = var.firestore_database_id
  indexes     = []
}

module "logging_metrics" {
  source = "../../modules/logging_metrics"

  project_id = var.project_id
  metrics    = local.logging_metrics
}

module "monitoring_dashboard" {
  source = "../../modules/monitoring_dashboard"

  project_id     = var.project_id
  dashboard_json = local.dashboard_json
}
