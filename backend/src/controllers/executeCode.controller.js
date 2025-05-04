import { getLanguageName, pollBatchResults, submitBatch } from '../libs/judge0.lib.js';
import { db } from '../libs/db.js';

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
    // console.log('Results:', results);

    //5. analyze testcases results
    const allPassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result?.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      return {
        testCase: i + 1,
        passed,
        expected: expected_output,
        status: result?.status?.description,
        stdout,
        stderr: result?.stderr || null,
        compile_output: result?.compile_output || null,
        memory: result?.memory ? `${result.memory} KB` : undefined,
        time: result?.time ? `${result?.time} s` : undefined
      };

      // console.log(`testcase #${i + 1}`);
      // console.log(`Input ${stdin[i]}`);
      // console.log(`Expected output for testcase ${expected_output}`);
      // console.log(`Actual output ${stdout}`);
      // console.log(`Matched : ${passed}`);
    });

    console.log('detailedResults', detailedResults);
    //6. store submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join('\n'),
        stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null
      }
    });

    //7. if All passed = true marked problem as solved for current user

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: { userId, problemId }
        },
        update: {},
        create: {
          userId,
          problemId
        }
      });
    }

    //8. save individual test case results in database

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      expected: result.expected,
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults
    });

    const submissionWithTestCases = await db.submission.findUnique({
      where: {
        id: submission.id
      },
      include: {
        testCases: true
      }
    });

    res
      .status(200)
      .json({
        success: true,
        message: 'Code executed! successfully!',
        submission: submissionWithTestCases
      });
  } catch (error) {
    console.log('Error while excuting code', error);
    res.status(500).json({ status: false, error: 'Error while excuting code' });
  }
};
