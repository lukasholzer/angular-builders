import {
  BuilderContext,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { join } from 'path';
import { StaticPagesBuilderSchema } from '../schema';

export async function scheduleBuilds(
  options: StaticPagesBuilderSchema,
  context: BuilderContext,
): Promise<string> {
  const browserTarget = targetFromTargetString(options.browserTarget);
  const serverTarget = targetFromTargetString(options.serverTarget);

  const browserTargetRun = await context.scheduleTarget(browserTarget, {
    watch: false,
  });
  const serverTargetRun = await context.scheduleTarget(serverTarget, {
    watch: false,
  });

  const [browserResult, serverResult] = await Promise.all([
    browserTargetRun.result,
    serverTargetRun.result,
  ]);

  const success =
    browserResult.success &&
    serverResult.success &&
    browserResult.baseOutputPath !== undefined;
  const error = browserResult.error || (serverResult.error as string);

  if (!success) {
    throw Error(error);
  }

  context.logger.info(`✅ Successfully build Frontend and backend!`);

  await Promise.all([browserTargetRun.stop(), serverTargetRun.stop()]);

  return join(`${serverResult.outputPath}`, 'main.js');
}
