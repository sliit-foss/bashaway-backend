import serviceConnector from '@sliit-foss/service-connector';

const connector = serviceConnector({
  baseURL: 'https://api.github.com',
  service: 'Github',
  headerIntercepts: () => ({
    authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
  })
});

export const triggerScorekeeper = (email, submissionId, submissionLink, questionLink, strictInputs) => {
  return connector.post(
    `/repos/${process.env.SCOREKEEPER_REPO_OWNER}/${process.env.SCOREKEEPER_REPO_NAME}/dispatches`,
    {
      email,
      submission_id: submissionId,
      submission_url: submissionLink,
      question_url: questionLink,
      strict_inputs: strictInputs
    }
  );
};
