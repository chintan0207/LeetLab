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
        console.log('result:', result);
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({ success: false, error: `Testcase ${i + 1} failed for language ${language}` });
        }
      }

      const newProblem = await db.problem.create({
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
    res.status(500).json({ status: false, error: 'Error while creating problem' });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({ success: false, error: 'No problems found' });
    }

    return res.status(200).json({ success: true, problems, message: 'Problems fetched successfully' });
  } catch (error) {
    console.log('Error while fetching all problems', error);
    res.status(500).json({ status: false, error: 'Error while fetching all problems' });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id
      }
    });

    if (!problem) {
      res.status(404).json({ success: false, error: 'Problem not found' });
    }

    return res.status(200).json({ success: true, problem, message: 'Problem fetched successfully' });
  } catch (error) {
    console.log('Error while fetching problem by id', error);
    res.status(500).json({ status: false, error: 'Error while fetching problem by id' });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
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

    if (!req.user.role === 'ADMIN') {
      return res.status(403).json({ success: false, error: 'You are not allow to update problem' });
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
        console.log('result:', result);
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({ success: false, error: `Testcase ${i + 1} failed for language ${language}` });
        }
      }
    }

    const updatedProblem = await db.problem.update({
      where: {
        id
      },
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

    if (!updatedProblem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Problem updated successfully', problem: updatedProblem });
  } catch (error) {
    console.log('Error while updating problem', error);
    res.status(500).json({ error: 'Error while updating problem' });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id
      }
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    await db.problem.delete({ where: { id } });

    return res.status(200).json({ success: true, message: 'Problem deleted successfully' });
  } catch (error) {
    console.log('Error while deleting problem', error);
    res.status(500).json({ error: 'Error while deleting problem' });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id
          }
        }
      }
    });

    return res.status(200).json({ success: true, problems, message: 'Problems fetched successfully' });
  } catch (error) {
    console.log('Error while fetching problem', error);
    res.status(500).json({ error: 'Error while fetching problem' });
  }
};
