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

    const deployment = {
      app_container_image: deploymentPayload.app_container.image,
      app_container_version: deploymentPayload.app_container.version,

      database_container_image: deploymentPayload.database_container.image,
      database_container_version: deploymentPayload.database_container.version,

      deployment_sha: deploymentPayload.sha,
      deployment_github_ref: deploymentPayload.ref,

      environment: deploymentPayload.environment,
      environment_name: deploymentPayload.environment_name,

      cloud_provider: deploymentPayload.cloud_provider,

      container_registry: deploymentPayload.container_registry,
      namespace: `${deploymentPayload.repository_name.toLowerCase().replace(/_/g, '-')}`,
    };

    console.log('Deployment Request Payload:');
    console.log(JSON.stringify(deployment, null, 2));

    Object.keys(deployment).forEach(key => {
      core.setOutput(key, deployment[key]);
    });
  }
}

module.exports = (context, core, github) => {
  return new DeploymentPayload(context, core, github);
}
