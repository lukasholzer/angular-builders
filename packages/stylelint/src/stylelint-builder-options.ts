import { json } from '@angular-devkit/core';

export interface StylelintBuilderOptions extends json.JsonObject {
  stylelintConfig: string;
  exclude: string[];
  files: string[];
  reportFile: string;
}
