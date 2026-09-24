import React from 'react';
import ResourcePage from './components/ResourcePage';
import StatusBadge from './components/StatusBadge';
import { formatDate, today } from './moduleMeta';

const PUBLISHED = {
  1: { label: 'Published', color: '#0ca30c' },
  0: { label: 'Draft', color: '#898781' }
};

const AdminArticles = () => (
  <ResourcePage
    title="News & Articles"
    subtitle="Posts shown in the public Newsroom. Publishing here updates the site immediately, with no code deploy."
    endpoint="/admin-articles"
    addLabel="+ New Article"
    formTitle="Article"
    searchPlaceholder="Search articles..."
    filters={[
      {
        name: 'is_published',
        label: 'Status',
        options: [
          { value: '1', label: 'Published' },
          { value: '0', label: 'Draft' }
        ]
      }
    ]}
    fields={[
      { name: 'title', label: 'Title', required: true, full: true },
      {
        name: 'slug',
        label: 'URL slug',
        placeholder: 'auto-generated-from-title',
        help: 'Lowercase words separated by hyphens. The article lives at /news/<slug>.'
      },
      { name: 'published_at', label: 'Publish date', type: 'date' },
      { name: 'excerpt', label: 'Summary', type: 'textarea', full: true, rows: 2, help: 'Shown on the Newsroom card and in search/social previews.' },
      { name: 'body', label: 'Article text', type: 'textarea', full: true, rows: 12, required: true, help: 'Separate paragraphs with a blank line.' },
      { name: 'is_published', label: 'Published', type: 'checkbox', checkboxLabel: 'Published (visible on the public site)' }
    ]}
    emptyForm={{ title: '', slug: '', published_at: today(), excerpt: '', body: '', is_published: true }}
    toForm={(a) => ({
      title: a.title,
      slug: a.slug,
      published_at: a.published_at || '',
      excerpt: a.excerpt || '',
      body: a.body,
      is_published: Boolean(a.is_published)
    })}
    rowActions={(a) =>
      a.is_published ? (
        <button type="button" title="View on site" onClick={() => window.open(`/news/${a.slug}`, '_blank')}>
          🔗
        </button>
      ) : null
    }
    columns={[
      {
        key: 'title',
        label: 'Article',
        render: (a) => (
          <div className="resource-primary">
            <strong>{a.title}</strong>
            <span>/news/{a.slug}</span>
          </div>
        )
      },
      { key: 'published_at', label: 'Date', render: (a) => formatDate(a.published_at) },
      { key: 'is_published', label: 'Status', render: (a) => <StatusBadge meta={PUBLISHED} value={a.is_published ? 1 : 0} /> }
    ]}
  />
);

export default AdminArticles;
