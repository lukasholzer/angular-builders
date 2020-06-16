import { fork } from 'child_process';

/**
 * Starts the server that is serving the ssr application.
 * Returns the process id of the server.
 * @param serverPath The path to the express server that should be started
 * @param port The port where the server should run on.
 */
export function startServer(
  serverPath: string,
  port: number = 4000,
  env?: { [key: string]: string },
): Promise<{ pid: number }> {
  const child = fork(serverPath, [], {
    silent: true,
    env: { PORT: `${port}`, ...env },
  });

  return new Promise((resolve, reject) => {
    if (child.stdout) {
      child.stdout.on('data', (msg: Buffer) => {
        const message = msg.toString().trim();
        if (message.startsWith('Node Express server listening on')) {
          resolve({ pid: child.pid });
        }
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (error) => {
        reject({ pid: child.pid, error: error.toString() });
      });
    }
  });
}
