import assert from 'assert';
import { isOwnSubmissionLink, isScorekeeper, loggable, submissionCooldown } from '../src/utils';

process.env.API_ACCESS_KEY = 'key';
process.env.AZURE_SOLUTION_UPLOAD_STORAGE_ACCOUNT = 'bashaway';
process.env.AZURE_STORAGE_CONTAINER = 'solutions';

const id = '656f1c2a9b3e4d0012345678';
const request = (method, originalUrl, headers = { 'x-api-key': 'key' }) => ({ method, originalUrl, headers });

assert(isScorekeeper(request('PATCH', `/api/submissions/${id}`)));
assert(!isScorekeeper(request('PATCH', `/api/submissions/${id}`, { 'x-api-key': 'wrong' })));
assert(!isScorekeeper(request('PATCH', `/api/submissions/${id}`, {})));
assert(!isScorekeeper(request('GET', `/api/submissions/${id}`)));
assert(!isScorekeeper(request('POST', '/api/users')));
assert(!isScorekeeper(request('PATCH', `/api/questions/${id}`)));
assert(!isScorekeeper(request('PATCH', '/api/settings')));
assert(!isScorekeeper(request('PATCH', `/api/submissions/${id}/../../users`)));
delete process.env.API_ACCESS_KEY;
assert(!isScorekeeper(request('PATCH', `/api/submissions/${id}`, {})));

const base = 'https://bashaway.blob.core.windows.net/solutions';
const stamp = '2026-11-28T04%3A00%3A00.000Z';
assert(isOwnSubmissionLink(`${base}/Cargo/${stamp}/submission.zip`, 'Cargo'));
assert(isOwnSubmissionLink(`${base}/Smile%20Labs/${stamp}/question%20(1).zip`, 'Smile Labs'));
assert(isOwnSubmissionLink(`${base}/O%27Neil/${stamp}/submission.zip`, "O'Neil"));
assert(!isOwnSubmissionLink(`${base}/Cargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/../Cargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/%2e%2e/Cargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/..%2FCargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/..%2fCargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/..%5CCargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/.%2E%2FCargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/%2E%2E/Cargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/..\\Cargo/${stamp}/submission.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car./${stamp}/a.zip`, 'Car.'));
assert(!isOwnSubmissionLink(`${base}/Car/${stamp}/a.zip?x=1`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/${stamp}/a.zip#x`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/${stamp}/a b.zip`, 'Car'));
assert(!isOwnSubmissionLink(`${base}/Car/${stamp}/a.zip\n`, 'Car'));
assert(!isOwnSubmissionLink(`https://evil.example/solutions/Car/${stamp}/a.zip`, 'Car'));
assert(!isOwnSubmissionLink('', 'Car'));

const now = Date.parse('2026-11-28T04:00:00.000Z');
const ago = (seconds) => new Date(now - seconds * 1000);
assert.strictEqual(submissionCooldown(undefined, undefined, now), 0);
assert.strictEqual(submissionCooldown(ago(10), undefined, now), 20);
assert.strictEqual(submissionCooldown(ago(30), undefined, now), 0);
assert.strictEqual(submissionCooldown(ago(100), ago(100), now), 80);
assert.strictEqual(submissionCooldown(ago(10), ago(170), now), 20);
assert.strictEqual(submissionCooldown(ago(200), ago(200), now), 0);
process.env.QUESTION_COOLDOWN_SECONDS = '0';
assert.strictEqual(submissionCooldown(ago(100), ago(100), now), 0);
delete process.env.QUESTION_COOLDOWN_SECONDS;

assert.deepStrictEqual(
  loggable({
    headers: { 'authorization': 'Bearer x', 'x-api-key': 'key', 'cookie': 'c', 'accept': '*/*' },
    body: { email: 'a@b.c', password: 'p', refresh_token: 't' }
  }),
  { headers: { accept: '*/*' }, payload: { email: 'a@b.c' } }
);
