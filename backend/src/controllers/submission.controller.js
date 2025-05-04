import { db } from '../libs/db.js';

export const getAllSubmission = async (req, res) => {
  const { userId } = req.user.id;
  try {
    const submissions = await db.submission.findMany({
      where: {
        userId
      }
    });

    res.status(200).json({ success: true, message: 'submissions fetched successfully', submissions });
  } catch (error) {
    console.log('Error while fetching submissions', error);
    res.status(500).json({ success: false, error: 'Error while fetching submissions' });
  }
};

export const getSubmissionsForProblem = async (req, res) => {
  const { problemId } = req.params;
  const { userId } = req.user.id;
  try {
    const submissions = await db.submission.findMany({
      where: {
        problemId,
        userId
      }
    });

    res.status(200).json({ success: true, message: 'Submissions fetched successfully', submissions });
  } catch (error) {
    console.log('Error while fetching submissions for problem', error);
    res.status(500).json({ success: false, error: 'Error while fetching submissions for problem' });
  }
};

export const getAllTheSubmissionsCountForProblem = async (req, res) => {
  const { problemId } = req.params;
  try {
    const submissionCount = await db.submission.count({
      where: { problemId }
    });

    res
      .status(200)
      .json({ success: true, message: 'Submission count fetched successfully', count: submissionCount });
  } catch (error) {
    console.log('Error while fetching submission count for problem', error);
    res.status(500).json({ success: false, error: 'Error while fetching submission count for problem' });
  }
};
