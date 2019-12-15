import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from "@angular-devkit/architect";
import { BuilderOptions } from "./builder-options";

export async function run(
  options: BuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  return {
    success: true
  };
}

export default createBuilder<BuilderOptions>(run);
