class CloudProviderParameters {

  constructor(context, core, github) {
    this.context = context;
    this.core = core;
    this.github = github;
  }

  exportTerraformParameters(config) {
    const cloudProvider = process.env.cloud_provider
      , parameters = this._getParameters(cloudProvider, config)
      ;

    const envVars = {
      TF_VAR_ENVIRONMENT: config.environment_name,
      TF_VAR_namespace: config.namespace,
      TF_VAR_container_registry: parameters.container_registry_url,
      TF_VAR_app_container: config.app_container_image,
      TF_VAR_app_container_version: config.app_container_version,
      TF_VAR_database_container: config.database_container_image,
      TF_VAR_database_container_version: config.database_container_version,
    };

    if (parameters.terraform_backend) {
      const backend = parameters.terraform_backend;

      if(backend.state) {
        Object.keys(backend.state).forEach(key => {
          envVars[`TF_VAR_${key}`] = backend.state[key];
        });
      }

      if (backend.vars) {
        Object.keys(backend.vars).forEach(key => {
          envVars[key] = backend.vars[key];
        });
      }
    }

    this._exportParameters(envVars, {});
  }

  exportCloudParameters(config) {
    const cloudProvider = process.env.cloud_provider
      , parameters = this._getParameters(cloudProvider, config)
      ;

    const outputs = {
      app_container_image: parameters.app_container_image_url,
      database_container_image: parameters.database_container_image_url,
      container_registry: parameters.container_registry,
      container_registry_url: parameters.container_registry_url,
    }

    this._exportParameters({}, outputs);
  }

  _getParameters(cloudProvider, config) {
    if (cloudProvider === 'gcp') {
      return this._getGoogleCloudPlatformParameters(config);
    } else if (cloudProvider === 'azure') {
      return this._getAzureParameters(config);
    } else {
      throw new Error(`Unsupported cloud platform: ${cloudProvider}`);
    }
  }

  _getGoogleCloudPlatformParameters(config) {
    const acr = `europe-west2-docker.pkg.dev`
      , acrUrl = `${acr}/${process.env.gcp_project_id}/octodemo-containers`
      , appContainerImageWithTag = `${config.app_container_image}:${config.app_container_version}`
      , appContainerImage = `${acrUrl}/${appContainerImageWithTag}`
      , dbContainerImageWithTag = `${config.database_container_image}:${config.database_container_version}`
      , dbContainerImage = `${acrUrl}/${dbContainerImageWithTag}`
      ;

    return {
      container_registry: acr,
      container_registry_url: acrUrl,
      app_container_image_url: appContainerImage,
      app_container_image_with_tag: appContainerImageWithTag,
      database_container_image_url: dbContainerImage,
      database_container_image_with_tag: dbContainerImageWithTag,

      terraform_backend: {
        state: {
          state_backend: 'gcs',
        },
      }
    }
  }

  _getAzureParameters(config) {
    const acr = `octodemocontainers.azurecr.io`
      , appContainerImageWithTag = `${config.app_container_image}:${config.app_container_version}`
      , appContainerImage = `${acr}/${appContainerImageWithTag}`
      , dbContainerImageWithTag = `${config.database_container_image}:${config.database_container_version}`
      , dbContainerImage = `${acr}/${dbContainerImageWithTag}`
      ;

    return {
      container_registry: acr,
      container_registry_url: acr,
      app_container_image_url: appContainerImage,
      app_container_image_with_tag: appContainerImageWithTag,
      database_container_image_url: dbContainerImage,
      database_container_image_with_tag: dbContainerImageWithTag,

      terraform_backend: {
        state: {
          state_backend: 'azurerm',
          azure_storage_account_resource_group: process.env.azure_storage_account_resource_group,
          azure_storage_account_name: process.env.azure_storage_account_name,
        },
        vars: {
          ARM_ACCESS_KEY: process.env.arm_access_key
        }
      },
    }
  }

  _exportParameters(envVars, outputs) {
    const core = this.core;

    if (envVars) {
      console.log('Exporting Environment Variables:');
      console.log(JSON.stringify(envVars, null, 2));

      Object.keys(envVars).forEach(name => {
        core.exportVariable(name, envVars[name]);
      });
    }

    if (outputs) {
      console.log('Setting Step Outputs:')
      console.log(JSON.stringify(outputs, null, 2));

      Object.keys(outputs).forEach(name => {
        core.setOutput(name, outputs[name]);
      });
    }
  }
}

module.exports.create = (context, core, github) => {
  return new CloudProviderParameters(context, core, github);
}