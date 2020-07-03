import { sync } from 'glob';
import { join } from 'path';
import { StylelintBuilderOptions } from './stylelint-builder-options';

export function readFiles(
  root: string,
  options: StylelintBuilderOptions,
): string[] {
  const { files, exclude: ignore } = options;

  return (
    files
      .map((file) => sync(file, { cwd: root, ignore, nodir: true }))
      .reduce((prev, curr) => prev.concat(curr), [])
      .map((file) => join(root, file))
      // Stylelint passes the pattern internally into globby
      // https://github.com/stylelint/stylelint/blob/81211b108153e650bfffdd04d8fd02aedb5d5501/lib/standalone.js#L197
      // globby uses forward slashes to construct their patterns, independently to path separators of operating systems
      // https://github.com/sindresorhus/globby/blob/master/readme.md#api
      .map((file) => file.replace(/\\/g, '/'))
  );
}
