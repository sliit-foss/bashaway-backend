import { findAllQuestions } from '@/repository/question';
import { getSubmissionsByQuestion } from '@/repository/submission';
import { getAllUniverstyUserGroups } from '@/repository/user';

export const getAllQuestionsSubmissions = async (user) => {
  const results = await getSubmissionsByQuestion();
  const allQuestions = await findAllQuestions(user);
  return allQuestions.map((question) => {
    const submissions =
      results.find((submission) => submission.question?._id?.toString() === question._id.toString())?.count || 0;
    return {
      question: question,
      submission_count: submissions
    };
  });
};

export const getRegistrations = async () => {
  const userGroups = await getAllUniverstyUserGroups();
  return {
    university_counts: userGroups,
    total_registrations: userGroups.reduce((acc, curr) => acc + curr.count, 0)
  };
};
