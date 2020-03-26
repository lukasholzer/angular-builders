export interface BuilderOptions {
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
}
