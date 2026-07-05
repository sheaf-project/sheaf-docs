import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Platform keys used across frontmatter. Keep in sync with the sidebar and
// any tab labels used in page content.
const platformKey = z.enum(['web', 'android', 'wear', 'ios', 'watch']);

// A verification stamp: when a maintainer last checked this page against the
// app, and the app-repo commit it was checked against. Refs are quoted in
// YAML so short hashes made of digits don't parse as numbers.
const verifiedEntry = z.object({
	date: z.coerce.date(),
	ref: z.coerce.string().regex(/^[0-9a-f]{7,40}$/, 'expected a git commit hash'),
});

/**
 * Extended frontmatter for staleness tracking.
 *
 * Pages that document app behaviour declare:
 *   platforms: which platforms the page covers
 *   covers:    per platform, the repo-relative source paths it documents
 *   verified:  per platform, when and against which commit it was last checked
 *
 * Structural pages (landing, concept overviews with no UI) may omit all three.
 * If `platforms` is present, every listed platform must have both a `covers`
 * and a `verified` entry; the build fails otherwise.
 */
const staleness = z
	.object({
		platforms: z.array(platformKey).nonempty().optional(),
		// String-keyed records (keys validated below): zod v4 treats
		// enum-keyed records as exhaustive, which is not what we want.
		covers: z.record(z.string(), z.array(z.string()).nonempty()).optional(),
		verified: z.record(z.string(), verifiedEntry).optional(),
	})
	.superRefine((data, ctx) => {
		const known = new Set<string>(platformKey.options);
		for (const field of ['covers', 'verified'] as const) {
			for (const p of Object.keys(data[field] ?? {})) {
				if (!known.has(p)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `${field}: has unknown platform key "${p}"`,
					});
				}
			}
		}
		for (const p of data.platforms ?? []) {
			if (!data.covers?.[p]) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `platform "${p}" is declared but has no covers: entry`,
				});
			}
			if (!data.verified?.[p]) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `platform "${p}" is declared but has no verified: entry`,
				});
			}
		}
		for (const p of Object.keys(data.covers ?? {})) {
			if (data.platforms && !data.platforms.includes(p as z.infer<typeof platformKey>)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `covers: has "${p}" but it is not listed in platforms:`,
				});
			}
		}
	});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({ extend: staleness }),
	}),
};
