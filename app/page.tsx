'use client';

import { FormEvent, useState } from 'react';
import { ArticleResult } from '@/app/components/ArticleResult';
import type { ArticleResponse } from '@/lib/generator';

type FormState = {
  numberOfWords: number;
  location: string;
  field: string;
  audienceLevel: string;
};

const wordCountPresets = [600, 900, 1200, 1800, 2400];

export default function HomePage() {
  const [formState, setFormState] = useState<FormState>({
    numberOfWords: 1200,
    location: '',
    field: '',
    audienceLevel: 'Generalist'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArticleResponse | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.location || !formState.field) {
      setError('Please provide both a location and field focus to generate the article.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? 'Unable to generate article.');
      }

      const data = (await response.json()) as ArticleResponse;
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected failure generating article.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '2.8rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.45rem 1.1rem',
              borderRadius: '999px',
              background: 'rgba(96, 165, 250, 0.14)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              fontSize: '0.85rem',
              letterSpacing: '0.08em'
            }}
          >
            Autonomous SEO Content Studio
          </span>
          <h1 style={{ fontSize: '3rem', margin: '1.4rem 0 1rem', letterSpacing: '-0.02em' }}>
            Generate Humanized Articles Tuned for Search & Storytelling
          </h1>
          <p style={{ maxWidth: '780px', margin: '0 auto', color: 'rgba(226,232,240,0.8)', fontSize: '1.05rem' }}>
            Input your target word count, location, and focus field. We synthesize localized keyword clusters, map your
            editorial outline, and deliver a polished article with optimization guardrails ready for publication.
          </p>
        </header>

        <section className="glass-panel" style={{ padding: '2.5rem 3rem' }}>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="field">Field or Industry Focus</label>
              <input
                id="field"
                name="field"
                placeholder="e.g. Sustainable real estate investing"
                value={formState.field}
                onChange={(event) => setFormState((prev) => ({ ...prev, field: event.target.value }))}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="location">Primary Location or Market</label>
              <input
                id="location"
                name="location"
                placeholder="e.g. Austin, Texas"
                value={formState.location}
                onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="audienceLevel">Audience Sophistication</label>
              <select
                id="audienceLevel"
                name="audienceLevel"
                value={formState.audienceLevel}
                onChange={(event) => setFormState((prev) => ({ ...prev, audienceLevel: event.target.value }))}
              >
                <option>Generalist</option>
                <option>Executive</option>
                <option>Technical Team</option>
                <option>Investor</option>
                <option>Community Advocate</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="wordCount">Target Word Count</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {wordCountPresets.map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setFormState((prev) => ({ ...prev, numberOfWords: count }))}
                    className="primary-button"
                    style={{
                      background:
                        formState.numberOfWords === count
                          ? 'linear-gradient(135deg, rgba(74,222,128,0.9), rgba(96,165,250,0.9))'
                          : 'rgba(15, 23, 42, 0.6)',
                      color: formState.numberOfWords === count ? '#020617' : 'rgba(226,232,240,0.8)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '0.65rem 1.3rem'
                    }}
                  >
                    {count} words
                  </button>
                ))}
              </div>
              <input
                id="wordCount"
                type="number"
                min={300}
                max={4000}
                step={50}
                value={formState.numberOfWords}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, numberOfWords: Number(event.target.value) || prev.numberOfWords }))
                }
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.7)' }}>
                We blend structured research snippets, keyword clustering, and narrative framing to build a ready-to-use
                article. Review and adapt before publishing.
              </div>
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Generating…' : 'Generate Article'}
              </button>
            </div>
          </form>

          {error ? (
            <div className="alert" style={{ marginTop: '1.5rem' }}>
              {error}
            </div>
          ) : null}
        </section>

        {result ? <ArticleResult result={result} /> : null}
      </div>
    </main>
  );
}
