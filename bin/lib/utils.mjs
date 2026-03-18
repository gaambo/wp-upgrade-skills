import path from 'node:path';
import { promises as fs } from 'node:fs';

const VERSION_RE = /^\d+\.\d+(?:\.\d+)?$/;

export function normalizeVersion(rawVersion) {
	if (!rawVersion || typeof rawVersion !== 'string') {
		throw new Error(
			'Missing WordPress version. Example: node bin/make-release-notes.mjs 6.9'
		);
	}
	const version = rawVersion.trim();
	if (!VERSION_RE.test(version)) {
		throw new Error(
			`Invalid version "${rawVersion}". Expected format like 6.9 or 6.9.1.`
		);
	}

	const tagSlug = version.replace(/\./g, '-');
	const notesTagSlug = `dev-notes-${tagSlug}`;
	return {
		version,
		tagSlug,
		notesTagSlug,
		skillSlug: `update-to-wordpress-${tagSlug}`,
	};
}

export function normalizeTag(value) {
	return String(value || '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/_/g, '-');
}

export function slugFromUrl(url) {
	try {
		const parsed = new URL(url);
		const parts = parsed.pathname.split('/').filter(Boolean);
		const last = parts[parts.length - 1] || 'post';
		return slugify(last);
	} catch {
		return 'post';
	}
}

export function slugify(value) {
	return String(value || '')
		.toLowerCase()
		.replace(/&amp;/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-')
		.slice(0, 80);
}

export async function ensureDir(dirPath) {
	await fs.mkdir(dirPath, { recursive: true });
}

export async function cleanDir(dirPath) {
	await fs.rm(dirPath, { recursive: true, force: true });
	await ensureDir(dirPath);
}

export async function writeText(filePath, text) {
	await ensureDir(path.dirname(filePath));
	await fs.writeFile(filePath, text, 'utf8');
}

export async function writeJson(filePath, value) {
	await writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export async function readText(filePath) {
	return fs.readFile(filePath, 'utf8');
}

export async function listFiles(dirPath) {
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

export function renderTemplate(template, values) {
	return String(template).replace(
		/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
		(_, key) => {
			if (!(key in values)) {
				return '';
			}
			return String(values[key]);
		}
	);
}

export function parseFrontmatterName(markdown) {
	const match = String(markdown).match(/^---\n([\s\S]*?)\n---\n?/);
	if (!match) {
		return '';
	}
	const nameLine = match[1]
		.split('\n')
		.find((line) => line.trim().startsWith('name:'));
	if (!nameLine) {
		return '';
	}
	return nameLine
		.split(':')
		.slice(1)
		.join(':')
		.trim()
		.replace(/^['"]|['"]$/g, '');
}
