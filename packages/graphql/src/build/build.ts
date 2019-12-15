import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { BuilderOptions } from './builder-options';
import { json } from '@angular-devkit/core';
import { generateGraphQlServices } from './generate-graphql-services';

export async function run(
  options: BuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {

  try {
    await generateGraphQlServices(options)
  } catch (error) {
    context.logger.error(error);
    return { success: false };
  }

  context.logger.info(`\n\n✔︎ Successfully generated graphql services!`);

  return {
    success: true
  };
}

export default createBuilder<BuilderOptions & json.JsonObject>(run);
