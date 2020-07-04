import {
  createPrinter,
  createSourceFile,
  EmitHint,
  NewLineKind,
  Node,
  ScriptTarget,
  SourceFile,
} from 'typescript';

/**
 * Prints a typescript node and returns the result as string
 * @param node The node to print.
 * @param sourceFile A source file that provides context for the node
 */
export function printTsNode(node: Node, sourceFile?: SourceFile): string {
  // create a printer to print the ts.SourceFiles
  const printer = createPrinter({ newLine: NewLineKind.LineFeed });

  return printer.printNode(
    EmitHint.Unspecified,
    node,
    sourceFile || createSourceFile('tmp.ts', '', ScriptTarget.ESNext)
  );
}
