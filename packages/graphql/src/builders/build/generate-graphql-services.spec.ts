import { vol } from 'memfs';
import { getFixture } from '../../testing';
import { BuildBuilderSchema } from './schema';
import { generateGraphQlServices } from './generate-graphql-services';

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
    ...config
  });
}

beforeEach(() => {
  process.chdir('/');
  vol.reset();
});

it('An allFilms angular service should be generated for the matching graphql query', async () => {
  vol.fromJSON({
    '/test/all-films.graphql': getFixture('get-all-films.graphql')
  });

  await runGeneration();

  expect(vol.toJSON()).toMatchSnapshot('all-films');
});
