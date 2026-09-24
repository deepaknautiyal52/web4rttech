import { API_URL } from '../utils/adminAuth';

// Articles are managed in the admin panel (News). These copies are only
// used if the API cannot be reached, so the Newsroom never renders empty.
export const fallbackArticles = [
  {
    slug: 'ai-first-delivery',
    title: 'Web4rtTech Launches AI-First Delivery Framework',
    excerpt: 'A new approach to project delivery that embeds AI-assisted engineering across every stage.',
    body: 'Web4rtTech announced a new AI-first delivery framework designed to embed applied AI and automation across every stage of a project. The framework emphasizes faster iteration, higher code quality, and closer collaboration between engineering and design teams.'
  },
  {
    slug: 'cloud-fabric',
    title: 'Web4rtTech Cloud Fabric™ Now Live',
    excerpt: 'A composable stack of cloud services and connectors built to accelerate enterprise migrations.',
    body: 'Cloud Fabric is a composable stack of cloud services, connectors, and reusable components built to accelerate enterprise cloud migrations. It allows organizations to combine pre-built modules to speed up deployments and reduce time-to-value.'
  },
  {
    slug: 'innovations-2025',
    title: 'New Innovations in Tech',
    excerpt: "Discover how we're driving innovation and digital excellence for growing enterprises.",
    body: 'Web4rtTech continues to invest in research and experimentation, pushing boundaries in cloud-native architectures, AI, and sustainability-focused solutions to help clients navigate their next.'
  }
];

export async function fetchArticles() {
  try {
    const response = await fetch(`${API_URL}/articles`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Failed');
    return (await response.json()).data;
  } catch {
    return fallbackArticles;
  }
}

// Resolves to the article, or null if it does not exist.
export async function fetchArticle(slug) {
  try {
    const response = await fetch(`${API_URL}/articles/${encodeURIComponent(slug)}`, { headers: { Accept: 'application/json' } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed');
    return (await response.json()).data;
  } catch {
    return fallbackArticles.find((a) => a.slug === slug) || null;
  }
}
