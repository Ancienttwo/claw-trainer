// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: cloudflare(),
	integrations: [
		react(),
		starlight({
			title: 'ClawTrainer Docs',
			social: {
				github: 'https://github.com/clawtrainer',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [{ label: 'Introduction', slug: 'getting-started' }],
				},
				{
					label: 'FAQ',
					items: [
						{ label: 'General', slug: 'faq/general' },
						{ label: 'Quest Board', slug: 'faq/quest-board' },
						{ label: 'Agents', slug: 'faq/agents' },
						{ label: 'Trainers', slug: 'faq/trainers' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'Overview', slug: 'api/overview' },
						{ label: 'Endpoints', slug: 'api/endpoints' },
					],
				},
			],
			customCss: ['./src/styles/starlight.css'],
			prerender: true,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
