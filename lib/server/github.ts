import { timingSafeEqual } from "node:crypto";

const GITHUB_API = "https://api.github.com";
const ASSET_BRANCH = "issue-assets";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "detextit/theironedit";
  return { token, repo };
}

export function hasGitHubConfig() {
  return Boolean(process.env.GITHUB_TOKEN);
}

export function ownerSecretMatches(candidate: string) {
  const secret = process.env.OWNER_ISSUE_SECRET || "";
  if (!secret) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function hasOwnerSecretConfig() {
  return Boolean(process.env.OWNER_ISSUE_SECRET);
}

// Reads the owner passcode from the `x-owner-secret` header.
export function ownerRequestAuthorized(request: Request) {
  return ownerSecretMatches(request.headers.get("x-owner-secret") || "");
}

function ghFetch(path: string, init: RequestInit = {}) {
  const { token } = getConfig();
  return fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {}),
    },
  });
}

function safeName(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-60) || "screenshot.png"
  );
}

async function getDefaultBranchSha(repo: string) {
  const repoRes = await ghFetch(`/repos/${repo}`);
  if (!repoRes.ok) throw new Error(`Could not read repo (${repoRes.status})`);
  const defaultBranch = ((await repoRes.json()) as { default_branch?: string })
    .default_branch || "main";

  const refRes = await ghFetch(`/repos/${repo}/git/ref/heads/${defaultBranch}`);
  if (!refRes.ok) throw new Error(`Could not read default branch (${refRes.status})`);
  return ((await refRes.json()) as { object: { sha: string } }).object.sha;
}

async function ensureAssetBranch(repo: string) {
  const existing = await ghFetch(`/repos/${repo}/git/ref/heads/${ASSET_BRANCH}`);
  if (existing.ok) return;
  if (existing.status !== 404) {
    throw new Error(`Could not check asset branch (${existing.status})`);
  }
  const sha = await getDefaultBranchSha(repo);
  const created = await ghFetch(`/repos/${repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${ASSET_BRANCH}`, sha }),
  });
  if (!created.ok && created.status !== 422) {
    // 422 means the ref already exists (race) which is fine.
    throw new Error(`Could not create asset branch (${created.status})`);
  }
}

export type UploadedScreenshot = {
  name: string;
  downloadUrl: string;
};

export async function uploadScreenshots(
  files: File[],
  slug: string,
): Promise<UploadedScreenshot[]> {
  if (files.length === 0) return [];
  const { repo } = getConfig();
  await ensureAssetBranch(repo);

  const uploaded: UploadedScreenshot[] = [];
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const buffer = Buffer.from(await file.arrayBuffer());
    const path = `screenshots/${slug}/${index + 1}-${safeName(file.name)}`;
    const res = await ghFetch(`/repos/${repo}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `chore(issues): screenshot for ${slug}`,
        content: buffer.toString("base64"),
        branch: ASSET_BRANCH,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Screenshot upload failed (${res.status}): ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as { content?: { download_url?: string } };
    if (json.content?.download_url) {
      uploaded.push({ name: file.name, downloadUrl: json.content.download_url });
    }
  }
  return uploaded;
}

export async function createGitHubIssue({
  title,
  body,
  labels,
}: {
  title: string;
  body: string;
  labels: string[];
}) {
  const { repo } = getConfig();
  const res = await ghFetch(`/repos/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub issue creation failed:", res.status, text);
    return {
      ok: false as const,
      status: res.status,
      error: "GitHub issue could not be created.",
    };
  }

  const issue = (await res.json()) as { html_url?: string; number?: number };
  return {
    ok: true as const,
    issueUrl: issue.html_url,
    issueNumber: issue.number,
  };
}
