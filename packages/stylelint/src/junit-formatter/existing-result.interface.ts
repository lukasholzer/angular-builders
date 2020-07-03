export interface ExistingResult {
  testsuites: ExistingTestSuites;
}

export interface ExistingTestSuites {
  $: { package: string };
  testsuite: ExisitingTestSuite[];
}

export interface ExisitingTestSuite {
  $: {
    name: string;
    failures: string;
    errors: string;
    tests: string;
  };
  testcase: ExisitingTestCase[];
}

export interface ExisitingTestCase {
  $: {
    name: string;
  };
  failure?: ExisitingTestcaseFailure[];
}

export interface ExisitingTestcaseFailure {
  _: string;
  $: {
    type: string;
    message: string;
  };
}
