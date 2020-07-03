import {
  ExisitingTestSuite,
  ExisitingTestCase,
} from './existing-result.interface';
import { ParsedSuite, ParsedCase } from './parsed-suite.interface';

/** Parses an existing XML Test suite to a parsed suite definition */
export function parseExistingSuite(suite: ExisitingTestSuite): ParsedSuite {
  return {
    testsuite: {
      '@name': suite.$.name,
      '@failures': +suite.$.failures,
      '@errors': +suite.$.errors,
      '@tests': +suite.$.tests,
      testcase: parseExistingCases(suite.testcase || []),
    },
  };
}

/** Parses existing test cases to the parsed case definition */
function parseExistingCases(testCases: ExisitingTestCase[]): ParsedCase[] {
  return testCases.map((testCase) => {
    const parsedCase: ParsedCase = { '@name': testCase.$.name };

    if (testCase.failure && testCase.failure.length) {
      parsedCase.failure = testCase.failure.map((failure) => ({
        '#text': failure._.trim(),
        '@message': failure.$.message,
        '@type': failure.$.type,
      }));
    }

    return parsedCase;
  });
}
