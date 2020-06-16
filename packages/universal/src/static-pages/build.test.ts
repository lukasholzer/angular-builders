import * as fs from 'fs';
import { Volume } from 'memfs';

import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { join } from 'path';
import { StaticPagesBuilderSchema } from './schema';

// Mocked imports
import * as childProcess from 'child_process';
import * as utils from './utils';

const BUILDER_NAME = '@ng-builders/universal:static-pages'

const options: StaticPagesBuilderSchema = {
  browserTarget: 'test-app:build-frontend:production',
  serverTarget: 'test-app:build-server:production',
  outputPath: '',
  routes: ['test']
};

afterEach(() => {
  // Reset the mocked fs
  (fs as any).reset();
});

describe('Universal static pages builder', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;
  let builderSpy: jest.SpyInstance<Promise<string>>;
  let renderSpy: jest.SpyInstance<Promise<void>>;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    architectHost = new TestingArchitectHost('/root', '/root');
    architect = new Architect(architectHost, registry);

    await architectHost.addBuilderFromPackage(join(__dirname, '../../..'));
    builderSpy = jest
      .spyOn(utils, 'scheduleBuilds')
      .mockImplementation(async () =>
        join(__dirname, 'fixtures/mock-server.js')
      );
    // mock the render Routes to test it separately
    renderSpy = jest
      .spyOn(utils, 'renderRoutes')
      .mockImplementation(async () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('can run successfully', async () => {
    // A "run" can have multiple outputs, and contains progress information.
    const run = await architect.scheduleBuilder(
      BUILDER_NAME,
      options
    );

    const forkSpy = jest.spyOn(childProcess, 'fork');

    // The "result" member (of type BuilderOutput) is the next output.
    const output = await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();

    // Expect that the builder succeeded
    expect(output.success).toBe(true);
    expect(builderSpy).toHaveBeenCalledTimes(1);
    expect(forkSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/mock-server\.js$/),
      [],
      { env: { PORT: '4200' }, silent: true }
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        logger: expect.any(Object),
        renderModule: expect.stringMatching(/renderer\.js$/),
        port: 4200,
        routes: ['test'],
        outputPath: expect.any(String)
      })
    );
  });

  it('should rename the original index correctly and render the pages', async () => {
    const vol = Volume.fromJSON(
      {
        'index.html': 'original-index'
      },
      '/root/dist/'
    );

    // Merge the current fs with the mocked volume
    const fsMock: any = fs;
    fsMock.use(vol);

    // A "run" can have multiple outputs, and contains progress information.
    const run = await architect.scheduleBuilder(
      BUILDER_NAME,
      { ...options, outputPath: '/root/dist' } as any
    );

    // The "result" member (of type BuilderOutput) is the next output.
    const output = await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();

    expect(output.success).toBe(true);
    // Should rename the index correctly
    expect(vol.toJSON()).toMatchInlineSnapshot(`
      Object {
        "/root/dist/index.original.html": "original-index",
      }
    `);
  });
});
