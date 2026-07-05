// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.sheaf.sh',
	integrations: [
		starlight({
			title: 'Sheaf Docs',
			description: 'User documentation for Sheaf, the open-source plural system tracker.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/sheaf-project/sheaf' },
				{ icon: 'external', label: 'sheaf.sh', href: 'https://sheaf.sh' },
			],
			sidebar: [
				{ label: 'Getting started', items: [{ autogenerate: { directory: 'getting-started' } }] },
				{ label: 'Concepts', items: [{ autogenerate: { directory: 'concepts' } }] },
				{ label: 'Guides', items: [{ autogenerate: { directory: 'guides' } }] },
				{ label: 'Settings', items: [{ autogenerate: { directory: 'settings' } }] },
				{ label: 'Wearables', items: [{ autogenerate: { directory: 'wearables' } }] },
				{ label: 'For admins', items: [{ autogenerate: { directory: 'for-admins' } }] },
			],
		}),
	],
});
