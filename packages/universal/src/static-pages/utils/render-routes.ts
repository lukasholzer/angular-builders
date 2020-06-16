import { logging } from '@angular-devkit/core';
import { grey, green } from 'chalk';
import { fork } from 'child_process';
import { chunk } from 'lodash';
import { cpus } from 'os';

/** Collects a list of routes and get the html code of it */
export async function renderRoutes(options: {
  outputPath: string;
  routes: string[];
  renderModule: string;
  port: number;
  maxCpus?: number;
  logger: logging.LoggerApi;
}): Promise<void> {
  const { routes, renderModule, outputPath, logger, port, maxCpus } = options;
  const nodes = maxCpus || cpus().length - 2;
  const chunks = chunk(routes, Math.ceil(routes.length / nodes));

  let renderCount = 0;

  const childProcesses = chunks.map(
    (chunkRoutes) =>
      new Promise((resolve, reject) => {
        fork(renderModule, [
          outputPath,
          `http://localhost:${port}`,
          ...chunkRoutes,
        ])
          .on('message', (data) => {
            if (data.success) {
              logger.info(grey(`CREATE ${data.filePath} (${data.size} bytes)`));
              renderCount++;
            } else {
              logger.error(`Error: ${data.error.message}`);
              logger.error(`Unable to render ${data.path}`);
            }
          })
          .on('exit', resolve)
          .on('error', reject);
      }),
  );

  await Promise.all(childProcesses);

  logger.info(green(`✅ Successful rendered ${renderCount} pages!`));
}
