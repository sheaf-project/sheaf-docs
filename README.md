# sheaf-docs

User documentation for [Sheaf](https://github.com/sheaf-project/sheaf), published at
`docs.sheaf.sh`. Covers the web app, Android (phone and Wear OS), and iOS
(iPhone and Apple Watch).

Built with [Starlight](https://starlight.astro.build/) (Astro).

## Develop

```bash
npm install
npm run dev      # serves at http://localhost:4321 with live reload
npm run build    # build into dist/
```

## Authoring conventions

Doc pages carry staleness-tracking frontmatter so we know when a page needs
re-verification against the app:

- `platforms:` - which platforms the page covers (`web`, `android`, `wear`,
  `ios`, `watch`).
- `covers:` - per platform, the repo-relative source paths the page documents.
- `verified:` - per platform, the date and app-repo commit the page was last
  checked against. Quote the ref (`ref: "240d9d7"`) so all-digit hashes don't
  parse as numbers.

The schema in `src/content.config.ts` enforces this at build time: every
platform a page declares must have both a `covers:` and a `verified:` entry.
Pages with no platform-specific content (landing, concept overviews) omit all
three.

UI text quoted in prose uses bold straight quotes, e.g. `**"Add member"**`, so
it can be checked against the app's actual strings.

Screenshots live next to their page with a `<page>.assets.yaml` manifest
recording what each image is supposed to show, when it was captured, and a
perceptual hash used to triage re-captures. Each screenshot ships as a
light/dark pair rendered through `src/components/ThemeImage.astro`, which
shows the variant matching the reader's theme (the site defaults to dark).

## Contributing

Fixes and suggestions are welcome as issues or PRs. Note that screenshots are
captured against a seeded demo instance with a pinned setup, so PRs that change
prose are much easier to accept than PRs that replace images - for anything
visual, an issue describing what's wrong or missing is the fastest path.
