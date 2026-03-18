#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import { RELEASE_NOTE_FILES } from './lib/config.mjs';
import { parseFrontmatterName } from './lib/utils.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

async function main() {
	const skillsRoot = path.resolve(REPO_ROOT, 'skills');
	console.log(`[validate-skills] Checking skills at ${skillsRoot}`);
	const exists = await fileExists(skillsRoot);
	if (!exists) {
		console.log(
			`[validate-skills] No skills directory found at ${skillsRoot}.`
		);
		return;
	}

	const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
	const skillDirs = entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name);
	if (skillDirs.length === 0) {
		console.log('[validate-skills] No skill directories found.');
		return;
	}

	let failures = 0;

	for (const skillDirName of skillDirs) {
		try {
			await validateSkill(
				path.join(skillsRoot, skillDirName),
				skillDirName
			);
			console.log(`[validate-skills] OK ${skillDirName}`);
		} catch (error) {
			failures += 1;
			console.error(
				`[validate-skills] FAIL ${skillDirName}: ${error.message}`
			);
		}
	}

	if (failures > 0) {
		process.exitCode = 1;
	}
}

async function validateSkill(skillDirPath, skillDirName) {
	const skillMdPath = path.join(skillDirPath, 'SKILL.md');
	const releaseNotesDir = path.join(skillDirPath, 'release-notes');

	const [skillMdExists, notesDirExists] = await Promise.all([
		fileExists(skillMdPath),
		fileExists(releaseNotesDir),
	]);

	if (!skillMdExists) {
		throw new Error('Missing SKILL.md');
	}
	if (!notesDirExists) {
		throw new Error('Missing release-notes directory');
	}

	const skillMd = await fs.readFile(skillMdPath, 'utf8');
	const frontmatterName = parseFrontmatterName(skillMd);
	if (!frontmatterName) {
		throw new Error('Missing frontmatter "name" field in SKILL.md');
	}
	if (frontmatterName !== skillDirName) {
		throw new Error(
			`Skill frontmatter name mismatch. Directory is "${skillDirName}" but frontmatter has "${frontmatterName}".`
		);
	}

	if (!skillMd.includes('## Source provenance')) {
		throw new Error('Missing source provenance section in SKILL.md');
	}
	if (!skillMd.includes('make.wordpress.org/core')) {
		throw new Error(
			'Missing official WordPress Core source attribution in SKILL.md'
		);
	}

	for (const fileName of RELEASE_NOTE_FILES) {
		const filePath = path.join(releaseNotesDir, fileName);
		if (!(await fileExists(filePath))) {
			throw new Error(`Missing required release note file: ${fileName}`);
		}

		await validateReleaseNoteSources(filePath, fileName);
	}
}

async function validateReleaseNoteSources(filePath, fileName) {
	const note = await fs.readFile(filePath, 'utf8');
	const trimmed = note.trim();
	if (!trimmed) {
		throw new Error(`Release note file is empty: ${fileName}`);
	}

	if (!trimmed.includes('## ')) {
		return;
	}

	const sections = trimmed.split(/^##\s+/m).slice(1);
	for (const rawSection of sections) {
		const section = `## ${rawSection}`;
		if (!section.includes('- Sources:')) {
			throw new Error(
				`Release note item missing Sources block in ${fileName}`
			);
		}

		if (!/https:\/\/make\.wordpress\.org\/core\//.test(section)) {
			throw new Error(
				`Release note item missing official WordPress source URL in ${fileName}`
			);
		}
	}
}

async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

await main();
