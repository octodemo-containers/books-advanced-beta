remote_state {
    backend         = "${get_env("TF_VAR_state_backend", "gcs")}"

    generate = {
        path        = "backend.generated.tf"
        if_exists   = "overwrite_terragrunt"
    }

    # Generate the backend parameters as per the cloud provider, defaultingto GCP as a fallback
    config = jsondecode(
        templatefile("backend_config/${get_env("TF_VAR_state_backend", "gcs")}.tpl",
            {
                namespace = "${get_env("TF_VAR_namespace", "default")}",
                environment = "${get_env("TF_VAR_ENVIRONMENT", "integration")}",

                azure_storage_account_resource_group = "${get_env("TF_VAR_azure_storage_account_resource_group", "octodemo-demo-rg")}",
                azure_storage_account_name = "${get_env("TF_VAR_storage_account_name", "pmoctodemo")}",
            }
        )
    )
}
