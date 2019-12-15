import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { BuilderOptions } from './builder-options';
import { json } from '@angular-devkit/core';

export async function run(
  options: BuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  return {
    success: true
  };
}

export default createBuilder<BuilderOptions & json.JsonObject>(run);
