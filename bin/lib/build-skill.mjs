import path from 'node:path';
import { spawn } from 'node:child_process';
import { XMLParser } from 'fast-xml-parser';
import { JSDOM } from 'jsdom';
import { Defuddle } from 'defuddle/node';
import { AREA_TITLES, BUILD_ROOT, RELEASE_NOTE_FILES } from './config.mjs';
import {
	cleanDir,
	ensureDir,
	listFiles,
	normalizeTag,
	parseFrontmatterName,
	readText,
	renderTemplate,
	slugFromUrl,
	writeJson,
	writeText,
} from './utils.mjs';

const XML = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '',
	trimValues: true,
});

export async function generateReleaseSkill({
	version,
	tagSlug,
	notesTagSlug,
	skillSlug,
	cwd,
}) {
	const buildDir = path.resolve(cwd, BUILD_ROOT, version);
	const sourcesDir = path.join(buildDir, 'sources');
	const summariesDir = path.join(buildDir, 'summaries');
	const combinedDir = path.join(buildDir, 'combined');
	const opencodeLogsDir = path.join(buildDir, 'opencode');

	await cleanDir(buildDir);
	await Promise.all([
		ensureDir(sourcesDir),
		ensureDir(summariesDir),
		ensureDir(combinedDir),
		ensureDir(opencodeLogsDir),
	]);

	const devNotesFeedUrl = `https://make.wordpress.org/core/tag/${notesTagSlug}/feed/`;
	const releaseFeedUrl = `https://make.wordpress.org/core/tag/${tagSlug}/feed/`;

	log(`Discovering posts from ${devNotesFeedUrl}`);
	const devNotesDiscovery = await discoverPostsFromRss({
		feedUrl: devNotesFeedUrl,
		version,
	});

	log(`Discovering field-guide posts from ${releaseFeedUrl}`);
	const releaseDiscovery = await discoverPostsFromRss({
		feedUrl: releaseFeedUrl,
		version,
	});
	const extraFieldGuides = releaseDiscovery.allItems.filter((item) =>
		item.normalizedTags.includes('field-guide')
	);

	const posts = mergePostsByUrl([
		...devNotesDiscovery.selectedPosts.map((post) => ({
			...post,
			sourceFeed: 'dev-notes',
		})),
		...extraFieldGuides.map((post) => ({
			...post,
			sourceFeed: 'release-tag-field-guide',
		})),
	]);

	await writeJson(path.join(buildDir, 'rss-discovery.json'), {
		feedUrls: {
			devNotes: devNotesFeedUrl,
			releaseTag: releaseFeedUrl,
		},
		version,
		discoveredCount: {
			devNotes: devNotesDiscovery.allItems.length,
			releaseTag: releaseDiscovery.allItems.length,
			releaseTagFieldGuides: extraFieldGuides.length,
		},
		selectedCount: posts.length,
		discoveredItems: {
			devNotes: devNotesDiscovery.allItems,
			releaseTag: releaseDiscovery.allItems,
			releaseTagFieldGuides: extraFieldGuides,
		},
		selectedItems: posts,
	});

	log(`Dev-notes feed items found: ${devNotesDiscovery.allItems.length}`);
	log(`Release-tag feed items found: ${releaseDiscovery.allItems.length}`);
	log(
		`Extra field-guide items from release-tag feed: ${extraFieldGuides.length}`
	);
	log(`Total selected items after merge/dedupe: ${posts.length}`);
	for (const post of posts) {
		log(`Selected [${post.sourceFeed}]: ${post.url}`);
	}

	const manifest = {
		version,
		tagSlug,
		notesTagSlug,
		feedUrl: devNotesFeedUrl,
		additionalFeedUrl: releaseFeedUrl,
		generatedAt: new Date().toISOString(),
		posts: [],
	};

	if (posts.length === 0) {
		log(
			'No posts found in release dev-notes feed. Writing default category notes.'
		);
		await writeDefaultCombinedFiles(combinedDir, version);
	} else {
		for (const post of posts) {
			log(`Extracting article markdown: ${post.title}`);
			const extracted = await extractMarkdownFromArticle(post.url);

			const sourcePath = path.join(sourcesDir, `${post.slug}.raw.md`);
			const sourceText = [
				'# Source Article',
				'',
				`- Title: ${post.title}`,
				`- URL: ${post.url}`,
				`- WordPress Version: ${version}`,
				`- Tags: ${post.tags.join(', ') || '(none)'}`,
				'',
				'---',
				'',
				extracted.markdown.trim(),
				'',
			].join('\n');
			await writeText(sourcePath, sourceText);

			const summaryPath = path.join(
				summariesDir,
				`${post.slug}.summary.md`
			);
			log(`Summarizing post with opencode run: ${post.slug}`);
			await summarizeSource({
				version,
				post,
				sourcePath,
				summaryPath,
				templatePath: path.resolve(
					cwd,
					'bin/templates/summarize-post.prompt.md'
				),
				cwd,
				opencodeLogsDir,
				runId: `summary-${post.slug}`,
			});

			manifest.posts.push({
				title: post.title,
				url: post.url,
				published: post.published,
				tags: post.tags,
				sourceFeed: post.sourceFeed,
				slug: post.slug,
				sourcePath: toRelative(cwd, sourcePath),
				summaryPath: toRelative(cwd, summaryPath),
			});
		}

		log('Combining and deduplicating summaries');
		await combineSummaries({
			version,
			summariesDir,
			outputDir: combinedDir,
			templatePath: path.resolve(
				cwd,
				'bin/templates/combine-release.prompt.md'
			),
			cwd,
			opencodeLogsDir,
			runId: `combine-${version.replace(/\./g, '-')}`,
		});
	}

	await writeJson(path.join(buildDir, 'manifest.json'), manifest);
	log(
		`Manifest written: ${toRelative(cwd, path.join(buildDir, 'manifest.json'))}`
	);

	const skillDir = await writeSkill({
		version,
		skillSlug,
		cwd,
		combinedDir,
		templatePath: path.resolve(cwd, 'bin/templates/SKILL.md.template'),
	});

	return { buildDir, skillDir };
}

export async function discoverPostsFromRss({ feedUrl, version }) {
	const response = await fetch(feedUrl, {
		headers: {
			'user-agent': 'wp-upgrade-skills-builder/0.1',
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch RSS feed: HTTP ${response.status} ${feedUrl}`
		);
	}

	const xmlText = await response.text();
	let parsed;
	try {
		parsed = XML.parse(xmlText);
	} catch (error) {
		throw new Error(`Failed to parse RSS feed XML: ${error.message}`);
	}

	const rawItems = toArray(parsed?.rss?.channel?.item);
	const allItems = rawItems
		.map((item) => normalizeFeedItem(item, version))
		.filter((item) => item.url);

	const selected = allItems;

	const seen = new Map();
	const selectedPosts = selected.map((item) => {
		const base = slugFromUrl(item.url);
		const n = seen.get(base) || 0;
		seen.set(base, n + 1);
		const slug = n === 0 ? base : `${base}-${n + 1}`;
		return { ...item, slug };
	});

	return {
		allItems,
		selectedPosts,
	};
}

function normalizeFeedItem(item, version) {
	const title = asText(item.title) || 'Untitled post';
	const url = asText(item.link);
	const published = asText(item.pubDate) || null;
	const tags = toArray(item.category).map(asText).filter(Boolean);
	const normalizedTags = tags.map(normalizeTag);
	const matchedTags = normalizedTags;

	return {
		version,
		title,
		url,
		published,
		tags,
		normalizedTags,
		matchedTags,
		upgradeRelevant: true,
	};
}

async function extractMarkdownFromArticle(url) {
	const response = await fetch(url, {
		headers: {
			'user-agent': 'wp-upgrade-skills-builder/0.1',
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch source article: HTTP ${response.status} ${url}`
		);
	}

	const html = await response.text();
	const dom = new JSDOM(html, { url });
	const preferredNode = dom.window.document.querySelector('article.post');

	if (!preferredNode) {
		log(
			`No article.post found for ${url}. Falling back to Defuddle auto-detection.`
		);
	}

	const parsed = await Defuddle(dom.window.document, url, {
		markdown: true,
		useAsync: false,
		contentSelector: preferredNode ? 'article.post' : undefined,
	});

	const markdown = String(parsed.content || '').trim();
	if (!markdown) {
		throw new Error(`No markdown extracted from source article ${url}`);
	}

	return { markdown: `${markdown}\n` };
}

async function summarizeSource({
	version,
	post,
	sourcePath,
	summaryPath,
	templatePath,
	cwd,
	opencodeLogsDir,
	runId,
}) {
	const [template, sourceMarkdown] = await Promise.all([
		readText(templatePath),
		readText(sourcePath),
	]);
	const prompt = renderTemplate(template, {
		version,
		source_title: post.title,
		source_url: post.url,
		source_markdown: sourceMarkdown,
	});

	const output = await runOpencode(prompt, { cwd, opencodeLogsDir, runId });
	const normalized = String(output).trim().startsWith('# Source Summary')
		? `${String(output).trim()}\n`
		: `# Source Summary\n\n- Source Title: ${post.title}\n- Source URL: ${post.url}\n- WordPress Version: ${version}\n- Note: Summarizer returned non-standard output.\n\n${String(output).trim()}\n`;

	await writeText(summaryPath, normalized);
}

async function combineSummaries({
	version,
	summariesDir,
	outputDir,
	templatePath,
	cwd,
	opencodeLogsDir,
	runId,
}) {
	const [template, files] = await Promise.all([
		readText(templatePath),
		listFiles(summariesDir),
	]);
	const summaryFiles = files
		.filter((name) => name.endsWith('.summary.md'))
		.sort((a, b) => a.localeCompare(b));
	if (summaryFiles.length === 0) {
		throw new Error('No summary files found to combine.');
	}

	const chunks = [];
	for (const fileName of summaryFiles) {
		const content = await readText(path.join(summariesDir, fileName));
		chunks.push(`## ${fileName}\n\n${content.trim()}\n`);
	}

	const prompt = renderTemplate(template, {
		version,
		category_files: RELEASE_NOTE_FILES.join('\n'),
		summaries: chunks.join('\n'),
	});

	const combined = await runOpencode(prompt, { cwd, opencodeLogsDir, runId });
	const byFile = parseCombinedSections(combined);

	for (const fileName of RELEASE_NOTE_FILES) {
		const body = byFile.get(fileName) || defaultCategoryText(fileName);
		await writeText(path.join(outputDir, fileName), `${body.trim()}\n`);
	}
}

function parseCombinedSections(text) {
	const regex = /<!--\s*FILE:\s*([^\s]+)\s*-->([\s\S]*?)(?=<!--\s*FILE:|$)/g;
	const map = new Map();
	let match;
	while ((match = regex.exec(String(text))) !== null) {
		map.set(String(match[1]).trim(), String(match[2]).trim());
	}
	return map;
}

async function writeSkill({
	version,
	skillSlug,
	cwd,
	combinedDir,
	templatePath,
}) {
	const skillDir = path.resolve(cwd, 'skills', skillSlug);
	const releaseNotesDir = path.join(skillDir, 'release-notes');
	await cleanDir(skillDir);
	await ensureDir(releaseNotesDir);

	for (const fileName of RELEASE_NOTE_FILES) {
		const content = await readText(path.join(combinedDir, fileName));
		await writeText(path.join(releaseNotesDir, fileName), content);
	}

	const skillTemplate = await readText(templatePath);
	const releaseList = RELEASE_NOTE_FILES.map(
		(fileName) =>
			`- \`release-notes/${fileName}\` - ${AREA_TITLES[fileName]}`
	).join('\n');

	const skillMarkdown = renderTemplate(skillTemplate, {
		skill_name: skillSlug,
		wordpress_version: version,
		release_note_file_list: releaseList,
		generated_at: new Date().toISOString().slice(0, 10),
	}).trim();

	const frontmatterName = parseFrontmatterName(skillMarkdown);
	if (frontmatterName !== skillSlug) {
		throw new Error(
			`SKILL frontmatter name mismatch: expected "${skillSlug}", got "${frontmatterName || '(missing)'}".`
		);
	}

	await writeText(path.join(skillDir, 'SKILL.md'), `${skillMarkdown}\n`);
	return skillDir;
}

async function runOpencode(prompt, { cwd, opencodeLogsDir, runId }) {
	return new Promise((resolve, reject) => {
		const opencodeConfigPath = path.resolve(cwd, 'bin/opencode.jsonc');
		const child = spawn('opencode', ['run', prompt], {
			stdio: ['ignore', 'pipe', 'pipe'],
			cwd,
			env: {
				...process.env,
				OPENCODE_CONFIG: opencodeConfigPath,
			},
		});

		let stdout = '';
		let stderr = '';
		child.stdout.on('data', (chunk) => {
			stdout += String(chunk);
		});
		child.stderr.on('data', (chunk) => {
			stderr += String(chunk);
		});
		child.on('error', (error) => {
			reject(
				new Error(`Failed to execute opencode CLI: ${error.message}`)
			);
		});
		child.on('close', (code) => {
			const logsBase = runId || `opencode-${Date.now()}`;
			const stdoutPath = path.join(
				opencodeLogsDir,
				`${logsBase}.stdout.txt`
			);
			const stderrPath = path.join(
				opencodeLogsDir,
				`${logsBase}.stderr.txt`
			);
			Promise.all([
				writeText(stdoutPath, stdout),
				writeText(stderrPath, stderr),
			]).catch(() => {
				// Best-effort logging only.
			});

			if (code !== 0) {
				reject(
					new Error(
						`opencode run failed with code ${code}: ${stderr.trim()}`
					)
				);
				return;
			}
			const output = unwrapCodeFence(stdout);
			if (!output.trim()) {
				reject(new Error('opencode run returned empty output.'));
				return;
			}
			resolve(output.trim());
		});
	});
}

function unwrapCodeFence(text) {
	const match = String(text)
		.trim()
		.match(/```(?:markdown|md)?\n([\s\S]*?)```/i);
	return match ? match[1] : String(text);
}

function writeDefaultCombinedFiles(outputDir, version) {
	return Promise.all(
		RELEASE_NOTE_FILES.map((fileName) =>
			writeText(
				path.join(outputDir, fileName),
				`# ${AREA_TITLES[fileName]}\n\n- No matching dev-note or field-guide items were discovered for WordPress ${version}.\n`
			)
		)
	);
}

function defaultCategoryText(fileName) {
	return `# ${AREA_TITLES[fileName]}\n\n- No major upgrade-impacting changes identified for this area in this release set.`;
}

function mergePostsByUrl(posts) {
	const byUrl = new Map();
	for (const post of posts) {
		const key = post.url;
		if (!key) {
			continue;
		}

		const existing = byUrl.get(key);
		if (!existing) {
			byUrl.set(key, {
				...post,
				tags: dedupeList(post.tags || []),
				sourceFeeds: [post.sourceFeed].filter(Boolean),
			});
			continue;
		}

		existing.tags = dedupeList([
			...(existing.tags || []),
			...(post.tags || []),
		]);
		existing.normalizedTags = dedupeList([
			...(existing.normalizedTags || []),
			...(post.normalizedTags || []),
		]);
		existing.matchedTags = dedupeList([
			...(existing.matchedTags || []),
			...(post.matchedTags || []),
		]);
		existing.sourceFeeds = dedupeList(
			[...(existing.sourceFeeds || []), post.sourceFeed].filter(Boolean)
		);

		const existingIsFieldGuide = (existing.normalizedTags || []).includes(
			'field-guide'
		);
		const incomingIsFieldGuide = (post.normalizedTags || []).includes(
			'field-guide'
		);

		if (!existingIsFieldGuide && incomingIsFieldGuide) {
			existing.sourceFeed = post.sourceFeed;
		}
	}

	const seenSlug = new Map();
	return Array.from(byUrl.values()).map((post) => {
		const base = slugFromUrl(post.url);
		const n = seenSlug.get(base) || 0;
		seenSlug.set(base, n + 1);
		return {
			...post,
			slug: n === 0 ? base : `${base}-${n + 1}`,
			sourceFeed:
				post.sourceFeed ||
				(post.sourceFeeds && post.sourceFeeds[0]) ||
				'unknown',
		};
	});
}

function dedupeList(list) {
	return Array.from(new Set((list || []).filter(Boolean)));
}

function toArray(value) {
	if (value == null) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
}

function asText(value) {
	if (value == null) {
		return '';
	}
	if (typeof value === 'string') {
		return value.trim();
	}
	if (typeof value === 'object') {
		if (typeof value['#text'] === 'string') {
			return value['#text'].trim();
		}
		if (typeof value.text === 'string') {
			return value.text.trim();
		}
	}
	return String(value).trim();
}

function log(message) {
	console.log(`[make-release-notes] ${message}`);
}

function toRelative(cwd, targetPath) {
	return path.relative(cwd, targetPath) || '.';
}
