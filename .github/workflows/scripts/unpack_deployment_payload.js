class DeploymentPayload {

  constructor(context, core, github) {
    this.context = context;
    this.core = core;
    this.github = github;
  }

  // Unpacks the deployment payload and sets them as outputs then reports a deployment status
  async extractDeploymentDetails() {
    const context = this.context
      , core = this.core
      , deploymentPayload = context.payload.client_payload
      ;

    core.setOutput('app_container_image', deploymentPayload.app_container.image);
    core.setOutput('app_container_version', deploymentPayload.app_container.version);

    core.setOutput('database_container_image', deploymentPayload.database_container.image);
    core.setOutput('database_container_version', deploymentPayload.database_container.version);

    core.setOutput('deployment_sha', deploymentPayload.sha);
    core.setOutput('deployment_github_ref', deploymentPayload.ref);

    core.setOutput('environment', deploymentPayload.environment);
    core.setOutput('cloud_provider', deploymentPayload.cloud_provider);
    core.setOutput('environment_name', deploymentPayload.environment_name);

    core.setOutput('container_registry', deploymentPayload.container_registry);
    core.setOutput('namespace', deploymentPayload.repository_name);
  }
}

module.exports = (context, core, github) => {
  return new DeploymentPayload(context, core, github);
}
