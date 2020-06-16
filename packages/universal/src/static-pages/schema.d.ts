import type { JsonObject } from '@angular-devkit/core';

export interface StaticPagesBuilderSchema extends JsonObject {
  /** Target to build. */
  browserTarget: string;
  /** Server target to use for rendering the app. */
  serverTarget: string;
  /** The output path of the generated files. */
  outputPath: string;
  /** Path to the file that holds the route information.  */
  routesFile?: string;
  /** Comma separated list of routes.  */
  routes?: string[];
}
