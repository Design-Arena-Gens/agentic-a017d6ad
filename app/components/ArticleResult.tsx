'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import type { ArticleResponse } from '@/lib/generator';

type Props = {
  result: ArticleResponse;
};

export function ArticleResult({ result }: Props) {
  const seoHighlights = useMemo(() => {
    return [
      `Primary keyword focus: ${result.primaryKeyword}`,
      `Secondary keyword cluster: ${result.secondaryKeywords.slice(0, 5).join(', ')}`,
      `Tonal direction: ${result.tonalDirection}`
    ];
  }, [result]);

  return (
    <section className="glass-panel fade-in" style={{ marginTop: '2.5rem', padding: '2.5rem 3rem' }}>
      <div className="stats-bar">
        <span className="stat-chip">Word Count ≈ {result.wordCount}</span>
        <span className="stat-chip">Primary Keyword · {result.primaryKeyword}</span>
        <span className="stat-chip">Tone · {result.tonalDirection}</span>
      </div>

      <div className="article-content" dangerouslySetInnerHTML={{ __html: result.html }} />

      <div style={{ marginTop: '2.5rem' }}>
        <h3 className="section-title">SEO & Editorial Notes</h3>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.4rem' }}>
          {seoHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h3 className="section-title">Optimization Checklist</h3>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.4rem' }}>
          {result.seoChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h3 className="section-title">Image Suggestions</h3>
        <div
          style={{
            display: 'grid',
            gap: '1.25rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            marginTop: '1.2rem'
          }}
        >
          {result.imageIdeas.map((image) => (
            <figure
              key={image.url}
              style={{
                background: 'rgba(15, 23, 42, 0.55)',
                padding: '1rem',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={960}
                height={640}
                style={{ borderRadius: '12px', width: '100%', height: 'auto' }}
              />
              <figcaption style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(226,232,240,0.8)' }}>
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
