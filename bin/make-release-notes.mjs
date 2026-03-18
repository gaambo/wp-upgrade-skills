#!/usr/bin/env node

import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateReleaseSkill } from './lib/build-skill.mjs';
import { normalizeVersion } from './lib/utils.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

async function main() {
	try {
		const { version, tagSlug, notesTagSlug, skillSlug } = normalizeVersion(
			process.argv[2]
		);
		const result = await generateReleaseSkill({
			version,
			tagSlug,
			notesTagSlug,
			skillSlug,
			cwd: REPO_ROOT,
		});

		console.log(
			`[make-release-notes] Done. Build artifacts: ${result.buildDir}`
		);
		console.log(
			`[make-release-notes] Done. Skill output: ${result.skillDir}`
		);
	} catch (error) {
		console.error(`[error] ${error.message}`);
		process.exitCode = 1;
	}
}

await main();
