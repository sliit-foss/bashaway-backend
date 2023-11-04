import serviceConnector from '@sliit-foss/service-connector';
import { APP_ENV, SCOREKEEPER } from '@/config';

const connector = serviceConnector({
  baseURL: 'https://api.github.com',
  service: 'Github',
  headerIntercepts: () => ({
    authorization: `Bearer ${SCOREKEEPER.GITHUB_ACCESS_TOKEN}`
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
  return connector.post(`/repos/${SCOREKEEPER.REPO_OWNER}/${SCOREKEEPER.REPO_NAME}/dispatches`, {
    event_type: `run-${APP_ENV}-tests`,
    client_payload: {
      name,
      email,
      submission_id: submissionId,
      submission_url: submissionLink,
      challenge_url: challengeLink,
      challenge_name: challengeName,
      strict_inputs: strictInputs
    }
  });
};
