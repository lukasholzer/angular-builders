import { lint, formatters, LinterResult } from 'stylelint';
import { junitFormatter } from './junit-formatter';

import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { join } from 'path';
import { StylelintBuilderOptions } from './stylelint-builder-options';
import { readFiles } from './read-files';

const ERROR_MESSAGE = 'Lint errors found in the listed files.';
const SUCCESS_MESSAGE = 'All files pass linting.';

async function run(
  options: StylelintBuilderOptions,
  context: BuilderContext,
): Promise<BuilderOutput> {
  const systemRoot = context.workspaceRoot;
  const files = readFiles(systemRoot, options);
  let lintingOutcome: LinterResult;

  // if there are no files to lint return success
  if (files.length === 0) {
    return { success: true };
  }

  try {
    lintingOutcome = await lint({
      configFile: join(systemRoot, options.stylelintConfig),
      files,
    });

    if (lintingOutcome.errored) {
      context.logger.error(ERROR_MESSAGE);
    } else {
      context.logger.info(SUCCESS_MESSAGE);
    }

    const errors = lintingOutcome.results.filter((result) => result.errored);

    if (errors.length) {
      context.logger.info(formatters.string(errors));
    }

    if (options.reportFile) {
      await junitFormatter(options.reportFile, lintingOutcome.results);
    }
  } catch (error) {
    context.logger.error(error.message);
  }

  return {
    success: (lintingOutcome! && !lintingOutcome!.errored) || false,
  };
}

export default createBuilder<StylelintBuilderOptions>(run);
