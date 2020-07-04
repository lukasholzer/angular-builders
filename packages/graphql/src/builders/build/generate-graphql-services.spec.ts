import { vol } from 'memfs';
import { getFixture } from '../../testing';
import { BuildBuilderSchema } from './schema';
import { generateGraphQlServices } from './generate-graphql-services';
import { readFileSync } from 'fs';

const TEST_ENDPOINT =
  'https://swapi-graphql.netlify.com/.netlify/functions/index';

async function runGeneration(
  config: Partial<BuildBuilderSchema> = {}
): Promise<void> {
  return generateGraphQlServices({
    schema: TEST_ENDPOINT,
    documents: '**/*.graphql',
    declarationFile: 'types.d.ts',
    outputPath: 'models',
    watch: false,
    ...config,
  });
}

beforeEach(() => {
  process.chdir('/');
  vol.reset();
});

it('An allFilms angular service should be generated for the matching graphql query', async () => {
  vol.fromJSON({
    '/test/all-films.graphql': getFixture('get-all-films.graphql'),
  });
  await runGeneration();

  expect(vol.toJSON()).toMatchSnapshot('all-films');
});

it('should not generate __typename properties in the declarations when skipTypename is provided', async () => {
  vol.fromJSON({
    '/test/all-films.graphql': getFixture('get-all-films.graphql'),
  });
  await runGeneration({ skipTypename: true });

  expect(readFileSync('/models/types.d.ts', { encoding: 'utf-8' })).not.toMatch(
    /__typename/gm
  );
});

it('should not generate a forRoot provider in the generated Angular Service', async () => {
  vol.fromJSON({
    '/test/all-films.graphql': getFixture('get-all-films.graphql'),
    '/module.ts': getFixture('module.ts'),
  });
  await runGeneration({
    skipTypename: true,
    provideServices: false,
  });

  const file = readFileSync('/test/models/all-films.generated.ts', {
    encoding: 'utf-8',
  });
  expect(file).not.toMatch(/providedIn:\s?\Sroot\S/gm);
});
