import {
  ClassDeclaration,
  Decorator,
  isCallExpression,
  isIdentifier,
} from 'typescript';

/**
 * Searches and returns a decorator with a specific name on a ClassDeclaration node
 * @param node ClassDeclaration node identified by `isClassDeclaration(node)`
 * @param name The name of the decorator that is searched for.
 */
export function getTsClassDecoratorByName(
  node: ClassDeclaration,
  name: string
): Decorator | null {
  if (!node.decorators) {
    return null;
  }

  return (
    node.decorators.find(
      (decorator) =>
        isCallExpression(decorator.expression) &&
        isIdentifier(decorator.expression.expression) &&
        decorator.expression.expression.escapedText === name
    ) || null
  );
}
