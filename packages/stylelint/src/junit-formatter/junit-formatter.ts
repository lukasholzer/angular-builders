import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { LintResult } from 'stylelint';
import { parseStringPromise } from 'xml2js';
import { create } from 'xmlbuilder';
import { ExistingResult } from './existing-result.interface';
import { parseExistingSuite } from './parse-exisiting-suite';
import { parseSuite } from './parse-suite';
import { ParsedSuite } from './parsed-suite.interface';

export async function junitFormatter(
  file: string,
  stylelintResults: LintResult[],
): Promise<void> {
  const parsedResults = stylelintResults.map((result) => parseSuite(result));

  // if we have an existing xml add the linted files to the xml
  if (existsSync(file)) {
    const existing = readFileSync(file).toString();
    const parsed: ExistingResult = await parseStringPromise(existing);
    if (parsed.testsuites && parsed.testsuites.testsuite) {
      const transformed = parsed.testsuites.testsuite.map((suite) =>
        parseExistingSuite(suite),
      );
      parsedResults.push(...transformed);
    }
  } else {
    // create directory if it does not exist
    mkdirSync(dirname(file), { recursive: true });
  }

  writeFileSync(file, createXML(parsedResults));
}

/** Creates an XML out of the provided object structure */
function createXML(testSuites: ParsedSuite[]): string {
  const xmlRoot = create('testsuites', { encoding: 'utf-8' }).att(
    'package',
    'stylelint.rules',
  );

  return testSuites.length > 0
    ? xmlRoot.element(testSuites).end({ pretty: true })
    : xmlRoot.end({ pretty: true });
}
