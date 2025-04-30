import { pollBatchResults, submitBatch } from '../libs/judge0.lib.js';

export const excuteCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;

    const userId = req.user.id;

    //1. validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ status: false, error: 'Invalid or missing test cases' });
    }

    //2. prepare each test case for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input
    }));

    //3. batch of submissions to judge0
    const submissionResults = await submitBatch(submissions);

    const tokens = submissionResults?.map((res) => res.token);

    // 4. Poll the judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log('Results:', results);
    res.status(200).json({ success: true, message: 'Code executed!' });
  } catch (error) {
    console.log('Error while excuting code', error);
    res.status(500).json({ status: false, error: 'Error while excuting code' });
  }
};
