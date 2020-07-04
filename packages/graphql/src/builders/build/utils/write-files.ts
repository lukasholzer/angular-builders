import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { parse, dirname } from 'path';
import { GeneratedResult } from '../interfaces';

/**
 * Writes an array of files to the filesystem
 * @param files The array of files to write
 */
export function writeFiles(files: GeneratedResult[]) {
  files.forEach((file) => {
    const dir = dirname(file.filename);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(file.filename, file.content, { encoding: 'utf-8' });
  });
}
