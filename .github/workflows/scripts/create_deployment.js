//
// Creates a Deployment Request Repoisotry Dispatch Event using the provided data
//


module.exports.validateEnvironment = function(command) {
  const commandRegex = /^deploy to (aws|azure|gcp) ([a-zA-Z-_]+)/i;

  const matched = commandRegex.exect(command);
  if (!matched) {
    throw new Error(`The provided environment deployment command does not match the expected pattern 'deploy to <aws|azure|gcp> <name>'`);
  }

  return {
    cloud: matched[1].toLowerCase(),
    name: matched[2].toLowerCase()
  };
}


module.exports.dispatch = async(payload) => {

  const environmentName = validateParameter(payload, 'environmentName'),
    cloudProvider = validateParameter(payload, 'cloudProvider'),
    context = validateParameter(payload, 'context'),
    github = validateParameter(payload, 'github'),
    containerRegistry = validateParameter(payload, 'containerRegistry'),
    appContainerImage = validateParameter(payload, 'appContainerImage'),
    appContainerVersion = validateParameter(payload, 'appContainerVersion'),
    databaseContainerImage = validateParameter(payload, 'databaseContainerImage'),
    databaseContainerVersion = validateParameter(payload, 'databaseContainerVersion'),
    sha = validateParameter(payload, 'sha'),
    head = validateParameter(payload, 'head');

  const isProduction = /^prod.*/.test(environmentName),
    deploymentEnvironment = isProduction
      ? `${environmentName}-${cloudProvider}`
      : `${environmentName}-${head}-${cloudProvider}`
      ;

  // A deployment payload for passing information of the components for the deployment
  const deploymentPayload = {
    container_registry: containerRegistry,
    app_container: {
      image: appContainerImage,
      version: appContainerVersion,
    },
    database_container: {
      image: databaseContainerImage,
      version: databaseContainerVersion,
    },
    sha: sha,
    environment: deploymentEnvironment,
    ref: context.ref,
  };

  console.log('Deployment Request Payload:');
  console.log(JSON.stringify(deploymentPayload, null, 2));

  await github.repos.createDispatchEvent({
    ...context.repo,
    event_type: 'deployment_request',
    client_payload: deploymentPayload
  });
}

function validateParameter(payload, name) {
  const value = payload[name];

  if (!value) {
    throw new Error(`Required Parameter '${name}' was not provided.`);
  }
  return value;
}