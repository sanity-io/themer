// Waits for the Vercel deployment of a commit, so the `/api/hues` contract
// tests run against that exact commit, and writes the URL to test to the
// step's `url` output. While it builds, Vercel's GitHub integration sets a
// `Vercel` commit status, and once the deployment is ready it creates a GitHub
// deployment in the `Preview` or `Production` environment. With more than one
// Vercel project connected to the repository, those are called
// `Vercel – themer`, `Preview – themer` and `Production – themer` instead.
import { appendFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'

const {
  DEPLOYMENT_ENVIRONMENT: environment,
  DEPLOYMENT_SHA: sha,
  GITHUB_API_URL = 'https://api.github.com',
  GITHUB_OUTPUT,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  PRODUCTION_URL,
  VERCEL_AUTOMATION_BYPASS_SECRET,
  VERCEL_PROJECT = 'themer',
  WAIT_TIMEOUT_MINUTES = '20',
} = process.env

const environments = new Set([
  environment,
  `${environment} – ${VERCEL_PROJECT}`,
])
const contexts = new Set(['Vercel', `Vercel – ${VERCEL_PROJECT}`])
const FAILED = new Set(['error', 'failure'])
const deadline = Date.now() + Number(WAIT_TIMEOUT_MINUTES) * 60_000

const log = (message) => process.stdout.write(`${message}\n`)

function fail(message) {
  log(`::error::${message}`)
  process.exit(1)
}

async function github(path) {
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}${path}`,
    {
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${GITHUB_TOKEN}`,
        'x-github-api-version': '2022-11-28',
      },
      signal: AbortSignal.timeout(30_000),
    },
  )
  const body = await response.text()
  // Anything but rate limits and server errors won't go away by retrying
  if (
    response.status >= 400 &&
    response.status < 500 &&
    response.status !== 429
  ) {
    fail(`GET ${path} responded ${response.status}: ${body}`)
  }
  if (!response.ok) throw new Error(`GET ${path} responded ${response.status}`)
  return JSON.parse(body)
}

async function findDeployment() {
  const deployments = (
    await github(`/deployments?sha=${sha}&per_page=100`)
  ).filter((deployment) => environments.has(deployment.environment))
  const statuses = await Promise.all(
    deployments.map(({ id }) =>
      github(`/deployments/${id}/statuses?per_page=100`),
    ),
  )
  for (const [index, deployment] of deployments.entries()) {
    const ready = statuses[index].find(
      (status) => status.state === 'success' && status.environment_url,
    )
    if (ready) return { value: ready.environment_url.replace(/\/+$/, '') }
    const [latest] = statuses[index]
    if (latest && FAILED.has(latest.state)) {
      fail(
        `The Vercel ${deployment.environment} deployment of ${sha} failed: ${latest.description} ${latest.log_url || latest.target_url}`,
      )
    }
  }

  const { statuses: commitStatuses } = await github(
    `/commits/${sha}/status?per_page=100`,
  )
  const status = commitStatuses.find(({ context }) => contexts.has(context))
  if (status && FAILED.has(status.state)) {
    fail(
      `Vercel failed to deploy ${sha}: ${status.description} ${status.target_url}`,
    )
  }
  return {
    progress: status
      ? `${status.context}: ${status.state}, ${status.description} ${status.target_url}`
      : 'Vercel has not reported a status for this commit yet',
  }
}

async function nextBuildId(baseUrl) {
  const response = await fetch(`${baseUrl}/`, {
    headers: VERCEL_AUTOMATION_BYPASS_SECRET
      ? { 'x-vercel-protection-bypass': VERCEL_AUTOMATION_BYPASS_SECRET }
      : {},
    signal: AbortSignal.timeout(30_000),
  })
  const [, buildId] = (await response.text()).match(/"buildId":"([^"]+)"/) ?? []
  if (!buildId) {
    throw new Error(
      `${baseUrl}/ responded ${response.status} without a Next.js build ID`,
    )
  }
  return buildId
}

// Retries `check` until it returns a value, or fails with `timeout` when the
// time is up
async function poll(check, timeout, last) {
  let progress
  try {
    const { value, progress: current } = await check()
    if (value) return value
    progress = current
  } catch (error) {
    progress = `Retrying: ${error.message}`
  }
  if (progress !== last) log(progress)
  if (Date.now() > deadline) fail(`${timeout} (last seen: ${progress})`)
  await delay(15_000)
  return poll(check, timeout, progress)
}

// The GitHub deployment can succeed before Vercel points the production domain
// at it, and only the Next.js build ID tells deployments apart
async function waitForProduction(deploymentUrl) {
  const buildId = await poll(
    async () => ({ value: await nextBuildId(deploymentUrl) }),
    `Could not read the Next.js build ID of ${deploymentUrl}`,
  )
  const servesBuild = async () => {
    const served = await nextBuildId(PRODUCTION_URL)
    if (served === buildId) return { value: PRODUCTION_URL }
    return {
      progress: `${PRODUCTION_URL} serves build ${served}, waiting for ${buildId}`,
    }
  }
  return poll(
    servesBuild,
    `${PRODUCTION_URL} does not serve ${deploymentUrl} (build ${buildId}) within ${WAIT_TIMEOUT_MINUTES} minutes, was a newer deployment promoted?`,
  )
}

if (!sha || !['Preview', 'Production'].includes(environment)) {
  fail(
    'Set DEPLOYMENT_SHA, and DEPLOYMENT_ENVIRONMENT to Preview or Production',
  )
}
if (environment === 'Production' && !PRODUCTION_URL) fail('Set PRODUCTION_URL')

log(`Waiting for the Vercel ${environment} deployment of ${sha}`)
const deploymentUrl = await poll(
  findDeployment,
  `No Vercel ${environment} deployment of ${sha} succeeded within ${WAIT_TIMEOUT_MINUTES} minutes. ` +
    'Vercel only deploys pull requests from forks once a member of the Vercel team authorizes it; re-run this job when the deployment is ready',
)
log(`Deployed to ${deploymentUrl}`)
const url =
  environment === 'Production'
    ? await waitForProduction(deploymentUrl)
    : deploymentUrl

log(`Testing ${url}`)
if (GITHUB_OUTPUT) await appendFile(GITHUB_OUTPUT, `url=${url}\n`)
