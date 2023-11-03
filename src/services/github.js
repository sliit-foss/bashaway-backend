import serviceConnector from '@sliit-foss/service-connector';

const connector = serviceConnector({
  baseURL: 'https://api.github.com',
  service: 'Github',
  headerIntercepts: () => ({
    authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
  })
});

export const triggerScorekeeper = (
  name,
  email,
  submissionId,
  submissionLink,
  challengeLink,
  challengeName,
  strictInputs
) => {
  return connector.post(
    `/repos/${process.env.SCOREKEEPER_REPO_OWNER}/${process.env.SCOREKEEPER_REPO_NAME}/dispatches`,
    {
      event_type: `run-${process.env.APP_ENV}-tests`,
      client_payload: {
        name,
        email,
        submission_id: submissionId,
        submission_url: submissionLink,
        challenge_url: challengeLink,
        challenge_name: challengeName,
        strict_inputs: strictInputs
      }
    }
  );
};
