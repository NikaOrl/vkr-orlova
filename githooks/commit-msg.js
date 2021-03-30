const fs = require('fs');

/* If message title:
 * * Doesn't start with Merge branch
 * * Doesn't start with Merge pull request
 * * Doesn't start with #
 * * Doesn't start with JIRA_TAG for ammended
 * and
 * branch name starts with "feature-XXX"
 * then change it according with JIRA TAG ${JIRA_TAG}-XXX (e.g. EPMRDCI-123)
 * then prepend the issue tag to the commit message
 * My awesome commit -> EPMRDCI-123 My awesome commit
 */

const tagMatcher = new RegExp(`^\\d+`, 'i');
const getIssueTagFromBranchName = str => {
  const matched = str.match(tagMatcher);
  return matched && matched[0];
};
const branchName = require('child_process').execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
const issueTag = getIssueTagFromBranchName(branchName);

const startsWithMergeBranch = str => str.startsWith('Merge branch');
const startsWithMergePR = str => str.startsWith('Merge pull request');
const startsWithHash = str => str.startsWith('#');
const startsWithNumber = str => str.startsWith(issueTag);
const isInvalidMessage = str =>
  !startsWithMergeBranch(str) && !startsWithMergePR(str) && !startsWithHash(str) && !startsWithNumber(str);

const messageFile = process.env.HUSKY_GIT_PARAMS;
const message = fs.readFileSync(messageFile, { encoding: 'utf-8' });
const messageTitle = message.split('\n')[0];

if (issueTag && isInvalidMessage(messageTitle)) {
  // Apply the issue tag to message title
  const messageLines = message.split('\n');
  messageLines[0] = `${issueTag.toUpperCase()}: ${messageTitle}`;
  fs.writeFileSync(messageFile, messageLines.join('\n'), { encoding: 'utf-8' });
}
