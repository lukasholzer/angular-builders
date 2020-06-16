
import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { green } from 'chalk';
import { existsSync, renameSync } from 'fs';
import { join } from 'path';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, mapTo, switchMap, tap } from 'rxjs/operators';
import type { StaticPagesBuilderSchema } from './schema';
import { getRoutes, renderRoutes, scheduleBuilds, startServer } from './utils';

/**
 * output file is placed in the build output next to the
 * builder file.
 */
export const RENDERER_MODULE = join(__dirname, 'renderer.js');

/** The server port where the server app is running on. */
const SERVER_PORT = 4200;

/** The main builder function to render the static pages*/
export function runBuilder(
  options: StaticPagesBuilderSchema,
  context: BuilderContext,
): Observable<BuilderOutput> {
  const outputPath = options.outputPath;
  const routes = getRoutes(options);

  // Process id of the spawned server that should be killed
  // afterwards
  let serverProcessId: number;

  return from(scheduleBuilds(options, context)).pipe(
    tap(() => {
      // rename the original index file to avoid race conditions.
      const originalIndex = join(outputPath, 'index.html');
      if (existsSync(originalIndex)) {
        renameSync(originalIndex, join(outputPath, 'index.original.html'));
      }
    }),
    switchMap((serverModule) => startServer(serverModule, SERVER_PORT)),
    tap(({ pid }) => {
      serverProcessId = pid;
      context.logger.info(green(`Server started with PID: ${pid}`));
    }),
    switchMap(() =>
      renderRoutes({
        outputPath,
        routes,
        port: SERVER_PORT,
        renderModule: RENDERER_MODULE,
        logger: context.logger,
      }),
    ),
    mapTo({ success: true }),
    catchError((error) => {
      context.reportStatus(`Error: ${error.message}`);
      context.logger.error(error.message);
      return of({ success: false });
    }),
    finalize(() => {
      if (serverProcessId) {
        process.kill(serverProcessId);
      }
    }),
  );
}

export default createBuilder(runBuilder);
