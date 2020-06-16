import * as fs from 'fs';
import { Volume } from 'memfs';

import { render, generateFileName } from './renderer';
import { join } from 'path';
import { startServer } from './utils';

let forkPid: number;

beforeAll(async () => {
  const fakeServerPath = join(__dirname, 'fixtures/mock-server.js');
  forkPid = (await startServer(fakeServerPath, 3333)).pid;
});

afterAll(() => {
  expect(typeof forkPid).toBe('number');
  process.kill(forkPid);
});

afterEach(() => {
  // Reset the mocked fs
  (fs as any).reset();
});

it('should test all variants of the index route', () => {
  expect(generateFileName('/')).toMatch('index.html');
  expect(generateFileName('index')).toMatch('index.html');
  expect(generateFileName('/index')).toMatch('index.html');
  expect(generateFileName('/components')).toMatch('components/index.html');
});

it('should render all routes correctly', async () => {
  const vol = Volume.fromJSON(
    {
      'index.original.html': 'original',
    },
    '/test-root',
  );

  // Merge the current fs with the mocked volume
  const fsMock: any = fs;
  fsMock.use(vol);

  const spy = jest.spyOn(process, 'send');

  await render('/test-root', 'http://localhost:3333', [
    '/index',
    '/components',
    '/components/button',
  ]);

  expect(spy).toHaveBeenNthCalledWith(1, {
    filePath: '/test-root/index.html',
    size: '13',
    success: true,
  });
  expect(spy).toHaveBeenNthCalledWith(2, {
    filePath: '/test-root/components/index.html',
    size: '13',
    success: true,
  });

  expect(vol.toJSON()).toMatchInlineSnapshot(`
    Object {
      "/test-root/components/button/index.html": "<html></html>",
      "/test-root/components/index.html": "<html></html>",
      "/test-root/index.html": "<html></html>",
      "/test-root/index.original.html": "original",
    }
  `);
});

it('should render the index route correctly when only a slash is provided', async () => {
  const vol = Volume.fromJSON({});

  // Merge the current fs with the mocked volume
  const fsMock: any = fs;
  fsMock.use(vol);

  await render('/test-root', 'http://localhost:3333', ['/']);

  expect(vol.toJSON()).toMatchInlineSnapshot(`
    Object {
      "/test-root/index.html": "<html></html>",
    }
  `);
});
