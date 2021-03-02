class CloudProviderParameters {

  constructor(context, core, github) {
    this.context = context;
    this.core = core;
    this.github = github;
  }

  exportParameters(config) {
    const core = this.core
      , cloudProvider = process.env.cloud_provider
      ;

    const parameters = this.getParameters(cloudProvider, config);

    Object.keys(parameters.environmentVariables).forEach(name => {
      core.exportVariable(name, parameters.environmentVariables[name]);
    });

    Object.keys(parameters.outputs).forEach(name => {
      core.seteOutput(name, parameters.outputs[name]);
    });
  }

  getParameters(cloudProvider, config) {
    const envVars = {}
      , outputs = {}
      ;

    if (cloudProvider === 'gcp') {
      const acr = `europe-west2-docker.pkg.dev`
        , acrUrl = `${acr}/${process.env.gcp_project_id}/octodemo-containers`
        , appContainerImage = `${acrUrl}/${config.app_container_image}:${config.app_container_version}`
        , dbContainerImage = `${acrUrl}/${config.database_container_image}:${config.database_container_version}`
        ;

      // envVars['APP_CONTAINER_IMAGE'] = appContainerImage;
      // envVars['DB_CONTAINER_IMAGE'] = dbContainerImage;
      // envVars['CONTAINER_REGISTRY'] = acr;

      outputs['app_container_image'] = appContainerImage;
      outputs['db_container_image'] = dbContainerImage;
      outputs['container_registry'] = acr;
      outputs['container_registry_url'] = acrUrl;
    } else if (cloudProvider === 'azure') {
      const acr = `octodemorg.azurecr.io`
        , appContainerImage = `${acr}/${config.app_container_image}:${config.app_container_version}`
        , dbContainerImage = `${acr}/${config.database_container_image}:${config.database_container_version}`
        ;

      outputs['app_container_image'] = appContainerImage;
      outputs['db_container_image'] = dbContainerImage;
      outputs['container_registry'] = acr;
      outputs['container_registry_url'] = acr;
    } else {
      throw new Error(`Unsupported cloud platform: ${cloudProvider}`);
    }

    return {
      environmentVariables: envVars,
      outputs: outputs,
    };
  }
}

module.exports.create = (context, core, github) => {
  return new CloudProviderParameters(context, core, github);
}