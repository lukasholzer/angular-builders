import { JsonObject } from '@angular-devkit/core';

export interface BuildBuilderSchema extends JsonObject {
  /** The schema field should point to your GraphQLSchema. */
  schema: string | string[];
  /** The documents field should point to your GraphQL documents. */
  documents: string | string[];
  /** The path where the files should be generated. */
  outputPath: string;
  /** The name of the generated declaration file. */
  declarationFile: string;
  /** Watch files for changes and rerun code generation */
  watch: boolean;
  /** Skip __typename in generated models */
  skipTypename?: boolean;
  /** Make sure to generate code that compatible with TypeScript strict mode */
  strict?: boolean;
  /** Avoid using Pick and resolve the actual primitive type of all selection set */
  preResolveTypes?: boolean;
  /** Generates immutable types by adding readonly to properties and uses ReadonlyArray */
  immutableTypes?: boolean;
}
