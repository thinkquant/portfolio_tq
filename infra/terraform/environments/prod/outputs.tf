output "project_id" {
  value = var.project_id
}

output "artifact_registry_repository_url" {
  value = module.artifact_registry.repository_url
}

output "cloud_run_service_name" {
  value = module.cloud_run_service.name
}

output "firebase_site_id" {
  value = module.firebase_hosting.site_id
}

output "github_oidc_provider_name" {
  value = module.github_oidc.workload_identity_provider_name
}

output "deploy_service_account_email" {
  value = module.deploy_service_account.email
}
