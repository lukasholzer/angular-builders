import { generate } from '@graphql-codegen/cli';
import { writeFileSync } from 'fs';
import { basename, join } from 'path';
import { BuildBuilderSchema } from './schema';
import { removeRootProvider } from './remove-root-provider';
import { GeneratedResult } from './interfaces';
import { writeFiles } from './utils/write-files';

/** Generates the apollo graphql services */
async function graphQlCodeGenerator(
  options: BuildBuilderSchema
): Promise<GeneratedResult[]> {
  const {
    schema,
    documents,
    outputPath,
    declarationFile,
    provideServices = true,
    watch,
    ...config
  } = options;
  const modelsFolder = basename(outputPath);

  try {
    return await generate(
      {
        watch,
        schema,
        documents,
        generates: {
          [join(outputPath, declarationFile)]: {
            config,
            plugins: ['typescript', 'fragment-matcher'],
          },
          [join(outputPath)]: {
            config,
            preset: 'near-operation-file',
            presetConfig: {
              baseTypesPath: declarationFile,
              folder: modelsFolder,
            },
            plugins: [
              'typescript-operations',
              'typescript-compatibility',
              'typescript-apollo-angular',
            ],
          },
        },
      },
      false
    );
  } catch (error) {
    if (Array.isArray(error.errors)) {
      console.error(error.errors);
      for (const problem of error.errors) {
        throw new Error(problem);
      }
    }
  }
}

export async function generateGraphQlServices(
  options: BuildBuilderSchema
): Promise<void> {
  const { provideServices = true } = options;
  let files = await graphQlCodeGenerator(options);

  if (!provideServices) {
    files = removeRootProvider(files);
  }

  const barrelFile = files
    .map((file) => `export * from './${basename(file.filename, '.ts')}';`)
    .sort()
    .join('\n');

  files.push({
    filename: join(options.outputPath, 'index.ts'),
    content: barrelFile,
  });

  writeFiles(files);
}
