import { db } from '../libs/db.js';
import { getJudge0LanguageId, submitBatch, pollBatchResults } from '../libs/judge0.lib.js';

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions
  } = req.body;

  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'You are not allow to create problem' });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ success: false, error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults?.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status_id !== 3) {
          return res
            .status(400)
            .json({ success: false, error: `Testcase ${i + 1} failed for language ${language}` });
        }
      }

      const newProblem = await db.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id
        }
      });

      return res
        .status(201)
        .json({ success: true, message: 'Problem created successfully', problem: newProblem });
    }
  } catch (error) {
    console.log('Error while creating problem', error);
    res.status(500).json({ error: 'Error while creating problem' });
  }
};

export const getAllProblems = async (req, res) => {
  //   try {
  //   } catch (error) {
  //     console.log("Error while getting problem", error);
  //     res.status(500).json({ error: "Error while getting problem" });
  //   }
};

export const getProblemById = async (req, res) => {
  //   try {
  //   } catch (error) {
  //     console.log("Error while getting problem", error);
  //     res.status(500).json({ error: "Error while getting problem" });
  //   }
};

export const updateProblem = async (req, res) => {
  //   try {
  //   } catch (error) {
  //     console.log("Error while updating problem", error);
  //     res.status(500).json({ error: "Error while updating problem" });
  //   }
};

export const deleteProblem = async (req, res) => {
  //   try {
  //   } catch (error) {
  //     console.log("Error while deleting problem", error);
  //     res.status(500).json({ error: "Error while deleting problem" });
  //   }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  //   try {
  //   } catch (error) {
  //     console.log("Error while getting problem", error);
  //     res.status(500).json({ error: "Error while getting problem" });
  //   }
};
