import { join } from 'path';
const { readFileSync } = jest.requireActual('fs');

export function getFixture(file: string): string {
  const filePath = join(__dirname, '../fixtures', file);
  return readFileSync(filePath, { encoding: 'utf-8' });
}
