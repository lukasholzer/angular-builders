import {
  createSourceFile,
  isCallExpression,
  isClassDeclaration,
  ScriptKind,
  ScriptTarget,
} from 'typescript';
import { GeneratedResult } from './interfaces';
import { getTsClassDecoratorByName, printTsNode } from './utils';

/**
 * Removes the root providers in the generated files
 * @param files The array of generated files.
 */
export function removeRootProvider(files: GeneratedResult[]) {
  const updatedFiles: GeneratedResult[] = [];

  for (let i = 0, max = files.length; i < max; i++) {
    const { filename, content, hooks } = files[i];

    const sourceFile = createSourceFile(
      filename,
      content,
      ScriptTarget.Latest,
      true,
      ScriptKind.TS
    );

    for (const statement of sourceFile.statements) {
      if (isClassDeclaration(statement)) {
        const decorator = getTsClassDecoratorByName(statement, 'Injectable');

        if (decorator && isCallExpression(decorator.expression)) {
          (decorator.expression as any).arguments = undefined;
        }
      }
    }

    updatedFiles.push({
      filename,
      hooks,
      content: printTsNode(sourceFile),
    });
  }

  return updatedFiles;
}
