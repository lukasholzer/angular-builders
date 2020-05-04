import { generate } from '@graphql-codegen/cli';
import { writeFileSync } from 'fs';
import { join, basename } from 'path';
import { BuilderOptions } from './builder-options';

interface GeneratedResult {
  filename: string;
  content: string;
  hooks: object;
}

export async function generateGraphQlServices(
  options: BuilderOptions
): Promise<void> {
  const files = await graphQlCodeGenerator(options);

  const barrelFile = files
    .map(file => `export * from './${basename(file.filename, '.ts')}';`)
    .sort()
    .join('\n');

  await writeFileSync(join(options.outputPath, 'index.ts'), barrelFile);
}

/** Generates the apollo graphql services */
async function graphQlCodeGenerator(
  options: BuilderOptions
): Promise<GeneratedResult[]> {
  const {
    schema,
    documents,
    outputPath,
    declarationFile,
    watch,
    ...config
  } = options;
  const modelsFolder = basename(outputPath);

  try {
    return await generate({
      watch,
      schema,
      documents,
      generates: {
        [join(outputPath, declarationFile)]: {
          config,
          plugins: ['typescript', 'fragment-matcher']
        },
        [join(outputPath)]: {
          config,
          preset: 'near-operation-file',
          presetConfig: {
            baseTypesPath: declarationFile,
            folder: modelsFolder
          },
          plugins: [
            'typescript-operations',
            'typescript-compatibility',
            'typescript-apollo-angular'
          ]
        }
      }
    });
  } catch (error) {
    if (Array.isArray(error.errors)) {
      console.error(error.errors);
      for (const problem of error.errors) {
        throw problem;
      }
    }
  }
}
