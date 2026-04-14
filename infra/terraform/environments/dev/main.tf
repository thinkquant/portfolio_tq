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
    "roles/datastore.indexAdmin",
    "roles/firebasehosting.admin",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.workloadIdentityPoolAdmin",
    "roles/iam.serviceAccountUser",
    "roles/logging.configWriter",
    "roles/monitoring.editor",
    "roles/resourcemanager.projectIamAdmin",
    "roles/run.admin",
    "roles/secretmanager.admin",
    "roles/secretmanager.secretAccessor",
  ])

  runtime_roles = toset([
    "roles/datastore.user",
    "roles/secretmanager.secretAccessor",
  ])

  firestore_indexes = [
    {
      name        = "runs-project-createdAt-desc"
      collection  = "runs"
      query_scope = "COLLECTION"
      fields = [
        { field_path = "projectId", order = "ASCENDING" },
        { field_path = "createdAt", order = "DESCENDING" },
      ]
    },
    {
      name        = "runs-status-createdAt-desc"
      collection  = "runs"
      query_scope = "COLLECTION"
      fields = [
        { field_path = "status", order = "ASCENDING" },
        { field_path = "createdAt", order = "DESCENDING" },
      ]
    },
    {
      name        = "tool-invocations-project-startedAt-desc"
      collection  = "toolInvocations"
      query_scope = "COLLECTION"
      fields = [
        { field_path = "projectId", order = "ASCENDING" },
        { field_path = "startedAt", order = "DESCENDING" },
      ]
    },
    {
      name        = "evaluations-project-createdAt-desc"
      collection  = "evaluations"
      query_scope = "COLLECTION"
      fields = [
        { field_path = "projectId", order = "ASCENDING" },
        { field_path = "createdAt", order = "DESCENDING" },
      ]
    },
    {
      name        = "escalations-project-createdAt-desc"
      collection  = "escalations"
      query_scope = "COLLECTION"
      fields = [
        { field_path = "projectId", order = "ASCENDING" },
        { field_path = "createdAt", order = "DESCENDING" },
      ]
    },
    {
      name        = "prompt-versions-project-createdAt-desc"
      collection  = "promptVersions"
      query_scope = "COLLECTION"
      fields = [
        { field_path = "projectId", order = "ASCENDING" },
        { field_path = "createdAt", order = "DESCENDING" },
      ]
    },
    {
      name        = "cases-project-updatedAt-desc"
      collection  = "cases"
      query_scope = "COLLECTION"
      fields = [
        { field_path = "projectId", order = "ASCENDING" },
        { field_path = "updatedAt", order = "DESCENDING" },
      ]
    },
  ]

  secret_names = toset([
    "vertex-ai-location",
    "demo-access-gate",
  ])

  logging_metrics = {
    run-failures = {
      description = "Count failed Cloud Run request/error events for the API service."
      filter      = "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${var.cloud_run_service_name}\" severity>=ERROR"
    }
    fallback-triggered = {
      description = "Count fallback-triggered run lifecycle events for the API service."
      filter      = "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${var.cloud_run_service_name}\" jsonPayload.eventType=\"fallback.triggered\""
    }
  }

  dashboard_json = jsonencode({
    displayName      = "portfolio_tq dev overview"
    dashboardFilters = []
    mosaicLayout = {
      columns = 48
      tiles = [
        {
          xPos   = 0
          yPos   = 0
          width  = 48
          height = 4
          widget = {
            title = "Environment summary"
            text = {
              content = "Environment: dev\\nProject: ${var.project_id}\\nCloud Run service: ${var.cloud_run_service_name}\\nFirebase site: ${var.firebase_site_id}\\nApplication observability feeds now come from Firestore-backed API endpoints, while platform metrics come from Cloud Run and log-based metrics."
            }
          }
        },
        {
          xPos   = 0
          yPos   = 4
          width  = 24
          height = 12
          widget = {
            title = "Request count"
            xyChart = {
              chartOptions = {
                mode = "COLOR"
              }
              dataSets = [
                {
                  plotType           = "LINE"
                  targetAxis         = "Y1"
                  minAlignmentPeriod = "60s"
                  timeSeriesQuery = {
                    timeSeriesFilter = {
                      filter = "metric.type=\"run.googleapis.com/request_count\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"${var.cloud_run_service_name}\""
                      aggregation = {
                        alignmentPeriod    = "60s"
                        perSeriesAligner   = "ALIGN_DELTA"
                        crossSeriesReducer = "REDUCE_SUM"
                        groupByFields      = []
                      }
                    }
                  }
                }
              ]
              thresholds = []
              yAxis = {
                label = "Requests / min"
                scale = "LINEAR"
              }
            }
          }
        },
        {
          xPos   = 24
          yPos   = 4
          width  = 24
          height = 12
          widget = {
            title = "P95 request latency"
            xyChart = {
              chartOptions = {
                mode = "COLOR"
              }
              dataSets = [
                {
                  plotType           = "LINE"
                  targetAxis         = "Y1"
                  minAlignmentPeriod = "60s"
                  timeSeriesQuery = {
                    timeSeriesFilter = {
                      filter = "metric.type=\"run.googleapis.com/request_latencies\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"${var.cloud_run_service_name}\""
                      aggregation = {
                        alignmentPeriod    = "60s"
                        perSeriesAligner   = "ALIGN_PERCENTILE_95"
                        crossSeriesReducer = "REDUCE_NONE"
                        groupByFields      = []
                      }
                    }
                  }
                }
              ]
              thresholds = []
              yAxis = {
                label = "Milliseconds"
                scale = "LINEAR"
              }
            }
          }
        },
        {
          xPos   = 0
          yPos   = 16
          width  = 24
          height = 12
          widget = {
            title = "Error count"
            xyChart = {
              chartOptions = {
                mode = "COLOR"
              }
              dataSets = [
                {
                  plotType           = "STACKED_BAR"
                  targetAxis         = "Y1"
                  minAlignmentPeriod = "60s"
                  timeSeriesQuery = {
                    timeSeriesFilter = {
                      filter = "metric.type=\"logging.googleapis.com/user/run-failures\" resource.type=\"global\""
                      aggregation = {
                        alignmentPeriod    = "60s"
                        perSeriesAligner   = "ALIGN_DELTA"
                        crossSeriesReducer = "REDUCE_SUM"
                        groupByFields      = []
                      }
                    }
                  }
                }
              ]
              thresholds = []
              yAxis = {
                label = "Error events"
                scale = "LINEAR"
              }
            }
          }
        },
        {
          xPos   = 24
          yPos   = 16
          width  = 24
          height = 12
          widget = {
            title = "Fallback-triggered count"
            xyChart = {
              chartOptions = {
                mode = "COLOR"
              }
              dataSets = [
                {
                  plotType           = "STACKED_BAR"
                  targetAxis         = "Y1"
                  minAlignmentPeriod = "60s"
                  timeSeriesQuery = {
                    timeSeriesFilter = {
                      filter = "metric.type=\"logging.googleapis.com/user/fallback-triggered\" resource.type=\"global\""
                      aggregation = {
                        alignmentPeriod    = "60s"
                        perSeriesAligner   = "ALIGN_DELTA"
                        crossSeriesReducer = "REDUCE_SUM"
                        groupByFields      = []
                      }
                    }
                  }
                }
              ]
              thresholds = []
              yAxis = {
                label = "Fallback events"
                scale = "LINEAR"
              }
            }
          }
        },
        {
          xPos   = 0
          yPos   = 28
          width  = 48
          height = 8
          widget = {
            title = "Recent API error logs"
            logsPanel = {
              filter        = "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"${var.cloud_run_service_name}\" severity>=ERROR"
              resourceNames = ["projects/${var.project_id}"]
            }
          }
        },
      ]
    }
    labels = {
      portfolio = ""
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

module "runtime_service_account" {
  source = "../../modules/iam_service_account"

  project_id   = var.project_id
  account_id   = "portfolio-api-runtime-dev"
  display_name = "portfolio_tq API runtime account for dev"
  roles        = local.runtime_roles
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
  service_account_email = module.runtime_service_account.email
  container_port        = var.cloud_run_container_port
  ingress               = var.cloud_run_ingress
  min_instance_count    = var.cloud_run_min_instance_count
  max_instance_count    = var.cloud_run_max_instance_count
  concurrency           = var.cloud_run_concurrency
  cpu                   = var.cloud_run_cpu
  memory                = var.cloud_run_memory
  allow_unauthenticated = var.cloud_run_allow_unauthenticated

  env_vars = {
    NODE_ENV                              = "development"
    PORT                                  = tostring(var.cloud_run_container_port)
    APP_ENV                               = var.environment
    SERVICE_NAME                          = "portfolio-tq-api"
    API_BASE_PATH                         = "/api"
    LOG_LEVEL                             = "debug"
    GCP_PROJECT_ID                        = var.project_id
    GOOGLE_CLOUD_PROJECT                  = var.project_id
    FIRESTORE_DATABASE_ID                 = var.firestore_database_id
    FIRESTORE_RUNS_COLLECTION             = "runs"
    FIRESTORE_TOOL_INVOCATIONS_COLLECTION = "tool_invocations"
    FIRESTORE_EVALS_COLLECTION            = "evaluations"
    FIRESTORE_SEED_COLLECTION             = "seed_data"
    WEB_ALLOWED_ORIGIN                    = "https://${var.firebase_site_id}.web.app"
    VERTEX_AI_MODEL                       = ""
    ENABLE_DEMO_GATES                     = "false"
    ENABLE_SEED_ENDPOINTS                 = "true"
  }

  secret_env_vars = {
    VERTEX_AI_LOCATION = {
      secret_name = module.secrets.secret_ids["vertex-ai-location"]
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
  indexes     = local.firestore_indexes
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
