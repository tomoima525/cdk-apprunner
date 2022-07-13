import * as path from "path";
import { Construct } from "constructs";
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import * as assets from "aws-cdk-lib/aws-ecr-assets";
import { CfnOutput } from "aws-cdk-lib";

export class AppRunner extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // create a Service from local docker image asset directory built and pushed to Amazon ECR:
    const asset = new assets.DockerImageAsset(this, "ImageAssets", {
      directory: path.join(__dirname, "../server"),
    });

    const appRunnerService = new apprunner.Service(this, "Service", {
      serviceName: "test-apprunner",
      source: apprunner.Source.fromAsset({
        imageConfiguration: { port: 8000 },
        asset,
      }),
    });

    new CfnOutput(this, "AppRunnerServiceARN", {
      value: appRunnerService.serviceArn,
    });
    new CfnOutput(this, "AppRunnerServiceURL", {
      value: `https://${appRunnerService.serviceUrl}`,
    });
  }
}
