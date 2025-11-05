import { z } from 'zod';

const fieldsKnowledgeBase: Record<string, string[]> = {
  marketing: [
    'audience-first storytelling',
    'omnichannel measurement',
    'organic visibility',
    'brand authority',
    'conversion optimization'
  ],
  technology: [
    'digital infrastructure',
    'emerging platforms',
    'scalable architectures',
    'data-backed decision making',
    'automation pipelines'
  ],
  finance: [
    'regulatory clarity',
    'risk mitigation',
    'portfolio resilience',
    'compliance-by-design',
    'financial literacy'
  ],
  hospitality: [
    'experience design',
    'seasonal demand',
    'guest loyalty',
    'reputation management',
    'local partnerships'
  ],
  healthcare: [
    'patient-centric care',
    'telehealth adoption',
    'compliance frameworks',
    'outcome tracking',
    'community outreach'
  ],
  education: [
    'curriculum innovation',
    'learner engagement',
    'assessment modernization',
    'career readiness',
    'technology enablement'
  ]
};

const tonalities = [
  'insightful yet approachable',
  'data-informed and practical',
  'strategic with a human voice',
  'visionary and grounded',
  'empathetic and action-driven'
];

export const articleRequestSchema = z.object({
  numberOfWords: z
    .number()
    .int()
    .min(300, 'Word count must be at least 300.')
    .max(4000, 'Word count must be below 4000.'),
  location: z
    .string()
    .trim()
    .min(2, 'Location must have at least 2 characters.')
    .max(80, 'Location must be shorter than 80 characters.'),
  field: z
    .string()
    .trim()
    .min(2, 'Field must have at least 2 characters.')
    .max(120, 'Field must be shorter than 120 characters.'),
  audienceLevel: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .optional()
});

const sentenceFragments = {
  opening: [
    'The landscape is shifting faster than most leaders anticipate',
    'Competitive signals now emerge in real time across digital touchpoints',
    'There is a renewed focus on measurable growth and resilient operations',
    'Local stakeholders are prioritizing initiatives that balance agility and trust',
    'Decision makers are rewarding organizations that combine creativity with analytics'
  ],
  opportunity: [
    'This creates an opening to design programs that genuinely resonate with the people of {location}',
    'Teams that align to these changes now can set the tone for the next 18 months in {location}',
    'It is the perfect moment to experiment with tiered activations that respect the local ecosystem of {location}',
    'Investing in research-backed initiatives keeps your momentum strong within the {field} community in {location}',
    'Organizations that read the pulse of {location} today will own the category conversation tomorrow'
  ],
  bridge: [
    'To accelerate traction, consider grounding experiments in community-specific insight',
    'Anchoring your strategy to verified audience intelligence prevents wasted effort',
    'Human stories blended with qualified data spark enduring brand preference',
    'Scaling with empathy unlocks growth while maintaining cultural credibility',
    'Long-term wins now depend on disciplined iteration paired with creative bravery'
  ],
  insight: [
    'High-intent buyers in {location} respond to messaging that combines authenticity with local proof points',
    'Partnerships with regional innovators shorten feedback loops and boost discoverability',
    'Search engines continue to reward depth, schema clarity, and a consistent topical footprint',
    'People crave content that sounds like it was crafted for their neighborhood, not a global template',
    'Credibility climbs when expert voices are paired with actionable visuals and memorable narratives'
  ]
};

const strategyStarters = [
  'Audit existing narratives and flag duplicate ideas as candidates for consolidation or retirement.',
  'Launch a recurring listening sprint that blends social mentions, event chatter, and support tickets.',
  'Prototype a pillar-cluster content system that maps the full intent funnel for priority keywords.',
  'Design a visual identity system for reports, data stories, and executive-ready summaries.',
  'Translate proprietary insights into interactive tools, worksheets, or self-diagnostics.',
  'Build a reputation flywheel with expert roundtables, localized case stories, and smart syndication.'
];

const seoChecklist = [
  'Map every heading to a clear search intent and align supporting paragraphs to that question.',
  'Interlink to at least five credible local resources or partners to amplify topical authority.',
  'Embed structured data for articles, FAQs, and creative assets where applicable.',
  'Pair each major section with a rich media element or data visualization concept.',
  'Refresh CTAs quarterly to reflect the most current offers and lead magnets.'
];

const secondaryKeywordSuffixes = [
  'framework',
  'playbook',
  'case study',
  'best practices',
  'industry benchmarks',
  'emerging trends',
  'growth strategy',
  'market outlook',
  'optimization tips',
  'thought leadership'
];

export type ArticlePayload = z.infer<typeof articleRequestSchema>;

export type ArticleResponse = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  tonalDirection: string;
  title: string;
  summary: string;
  sections: {
    heading: string;
    html: string;
  }[];
  html: string;
  wordCount: number;
  imageIdeas: { url: string; alt: string }[];
  seoChecklist: string[];
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
};

export function buildArticle(payload: ArticlePayload): ArticleResponse {
  const normalizedField = payload.field.trim();
  const normalizedLocation = payload.location.trim();
  const primaryKeyword = buildPrimaryKeyword(normalizedField, normalizedLocation);
  const secondaryKeywords = buildSecondaryKeywords(primaryKeyword, normalizedField);
  const tonalDirection = pickRandom(tonalities);
  const title = craftTitle(normalizedField, normalizedLocation);
  const sections = craftSections(payload, primaryKeyword, secondaryKeywords, tonalDirection);
  const html = sections
    .map((section, idx) => (idx === 0 ? `<h1>${section.heading}</h1>${section.html}` : `<h2>${section.heading}</h2>${section.html}`))
    .join('');
  const wordCount = estimateWordCount(html);
  const summary = craftSummary(primaryKeyword, tonalDirection, normalizedLocation, normalizedField);
  const imageIdeas = buildImageIdeas(normalizedField, normalizedLocation);

  return {
    primaryKeyword,
    secondaryKeywords,
    tonalDirection,
    title,
    summary,
    sections,
    html,
    wordCount,
    imageIdeas,
    seoChecklist,
    metadata: {
      title,
      description: summary,
      keywords: [primaryKeyword, ...secondaryKeywords.slice(0, 6)],
      slug: generateSlug(title)
    }
  };
}

function buildPrimaryKeyword(field: string, location: string) {
  const core = `${titleCase(field)} Strategy`;
  return `${core} in ${titleCase(location)}`;
}

function buildSecondaryKeywords(primary: string, field: string) {
  const base = primary.replace('Strategy', '').trim();
  const fieldRoot = titleCase(field);
  const knowledgeMatches = findFieldInsights(field.toLowerCase());
  const keywords = new Set<string>();

  secondaryKeywordSuffixes.forEach((suffix) => {
    keywords.add(`${base} ${suffix}`.trim());
  });

  knowledgeMatches.forEach((insight) => {
    keywords.add(`${fieldRoot} ${insight}`);
  });

  keywords.add(`${fieldRoot} content ideas`);
  keywords.add(`${fieldRoot} audience insights ${new Date().getFullYear()}`);

  return Array.from(keywords).slice(0, 12);
}

function craftTitle(field: string, location: string) {
  const localized = `${titleCase(field)} Playbook for ${titleCase(location)}`;
  return `${localized}: Evidence-Backed Tactics for Bold Teams`;
}

function craftSummary(primaryKeyword: string, tonalDirection: string, location: string, field: string) {
  return `A ${tonalDirection} exploration of ${primaryKeyword.toLowerCase()}, blending local insight from ${titleCase(
    location
  )} with human-centered ${field.toLowerCase()} frameworks and data-backed execution.`;
}

function craftSections(
  payload: ArticlePayload,
  primaryKeyword: string,
  secondaryKeywords: string[],
  tonalDirection: string
) {
  const targetWords = payload.numberOfWords;
  const avgParagraphWords = 110;
  const baseSections: { heading: string; type: string }[] = [
    { heading: primaryKeyword, type: 'intro' },
    {
      heading: `Signals Shaping ${titleCase(payload.field)} in ${titleCase(payload.location)}`,
      type: 'insights'
    },
    { heading: 'Momentum-Building Plays', type: 'plays' },
    { heading: `Local Spotlight: ${titleCase(payload.location)} in Focus`, type: 'case' },
    { heading: 'Content & SEO Optimization Checklist', type: 'checklist' },
    { heading: 'Key Takeaways to Act On This Quarter', type: 'conclusion' }
  ];

  const paragraphsNeeded = Math.max(4, Math.round(targetWords / avgParagraphWords));
  const paragraphBudget = distributeParagraphs(baseSections.length, paragraphsNeeded);

  return baseSections.map((section, index) => ({
    heading: section.heading,
    html: buildSectionBody({
      type: section.type,
      location: payload.location,
      field: payload.field,
      primaryKeyword,
      secondaryKeywords,
      tonalDirection,
      paragraphs: paragraphBudget[index],
      targetWordsPerParagraph: Math.max(90, Math.round(targetWords / paragraphsNeeded))
    })
  }));
}

function buildSectionBody(config: {
  type: string;
  location: string;
  field: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tonalDirection: string;
  paragraphs: number;
  targetWordsPerParagraph: number;
}) {
  const { type } = config;
  switch (type) {
    case 'intro':
      return buildIntro(config);
    case 'insights':
      return buildInsights(config);
    case 'plays':
      return buildPlays(config);
    case 'case':
      return buildCaseStudy(config);
    case 'checklist':
      return buildChecklistSection(config);
    case 'conclusion':
      return buildConclusion(config);
    default:
      return buildGenericParagraphs(config, config.paragraphs);
  }
}

function buildIntro(config: SectionConfig) {
  const paragraphs = new Array(Math.max(2, config.paragraphs)).fill(null).map((_, idx) => {
    const opening = pickRandom(sentenceFragments.opening);
    const opportunity = replaceTokens(pickRandom(sentenceFragments.opportunity), config);
    const bridge = pickRandom(sentenceFragments.bridge);
    const insight = replaceTokens(pickRandom(sentenceFragments.insight), config);
    const callout = idx % 2 === 0 ? bridge : insight;
    return `${opening}. ${opportunity}. ${callout}.`;
  });

  const keywordLine = `Primary focus: <strong>${config.primaryKeyword}</strong>. Supporting opportunities include ${config.secondaryKeywords
    .slice(0, 4)
    .map((kw) => `<em>${kw}</em>`)
    .join(', ')}.`;

  return `<p>${paragraphs.join('</p><p>')}</p><div class="alert">${keywordLine}</div>`;
}

function buildInsights(config: SectionConfig) {
  const insights = findFieldInsights(config.field.toLowerCase());
  const localized = insights.map((insight) =>
    `<li><strong>${titleCase(insight)}</strong> — connect this with live sentiment in ${titleCase(
      config.location
    )} to surface timely story angles.</li>`
  );

  const paragraph = wrapParagraph(
    `Ground research in verified signals from ${titleCase(config.location)}. Blend quant trends with qualitative listening to understand why conversations spike around ${config.secondaryKeywords[0]?.toLowerCase()}.`
  );

  return `${paragraph}<ul>${localized.join('')}</ul>`;
}

function buildPlays(config: SectionConfig) {
  const plays = strategyStarters
    .slice(0, Math.min(strategyStarters.length, config.paragraphs + 1))
    .map((play, idx) => `<li><strong>Play ${idx + 1}.</strong> ${injectFieldContext(play, config)}</li>`);

  const framing = wrapParagraph(
    `Reading demand signals through the lens of ${config.primaryKeyword.toLowerCase()} allows teams to prioritize the workflow upgrades that unlock measurable ROI. Anchor every sprint to hypotheses you can validate within ${config.targetWordsPerParagraph} days.`
  );

  return `${framing}<ol>${plays.join('')}</ol>`;
}

function buildCaseStudy(config: SectionConfig) {
  const narrative = [
    `A ${config.field.toLowerCase()} collective in ${titleCase(config.location)} mapped the customer journey and discovered three key friction points affecting revenue velocity.`,
    'They embedded a qualitative research pod to capture verbatim insight within 48 hours of every meaningful interaction.',
    `Using those insights, the team produced cornerstone assets centered on ${config.secondaryKeywords[1]?.toLowerCase() ?? 'localized value propositions'} and layered in supporting micro-content.`,
    'Within two quarters they doubled newsletter engagement, raised assisted conversions by 37%, and grew partner referrals through community-led activations.'
  ];

  return `${wrapParagraph(narrative.join(' '))}<blockquote>“We stopped guessing what our audience cared about and started co-creating with them. The shift was immediate and powerful.” — Program Director, ${titleCase(
    config.location
  )}</blockquote>`;
}

function buildChecklistSection(config: SectionConfig) {
  const listItems = seoChecklist.map((item) => `<li>${injectFieldContext(item, config)}</li>`);
  const description = wrapParagraph(
    `Treat this checklist as a living artifact. Review it whenever you draft, review, or refresh ${config.field.toLowerCase()} content for ${titleCase(
      config.location
    )} to make sure every asset earns visibility and action.`
  );
  return `${description}<ul>${listItems.join('')}</ul>`;
}

function buildConclusion(config: SectionConfig) {
  const recap = wrapParagraph(
    `Momentum compounds when teams champion ${config.primaryKeyword.toLowerCase()} as a cross-functional priority. Align channel owners, subject matter experts, and community voices around a shared editorial rhythm.`
  );
  const nextSteps = wrapParagraph(
    `Set a 30-60-90 day roadmap that ties each ${config.field.toLowerCase()} initiative to leading indicators. Share wins quickly, keep curiosity high, and invite collaborators from inside and outside ${titleCase(
      config.location
    )} to shape what comes next.`
  );
  return `${recap}${nextSteps}`;
}

function buildGenericParagraphs(config: SectionConfig, count: number) {
  const paragraphs = new Array(count).fill(null).map(() =>
    wrapParagraph(
      `Teams focused on ${config.primaryKeyword.toLowerCase()} can repurpose insights into podcasts, livestreams, tactical briefs, and interactive dashboards. Doing so reinforces brand salience while surfacing new collaborations in ${titleCase(
        config.location
      )}.`
    )
  );
  return paragraphs.join('');
}

function injectFieldContext(line: string, config: SectionConfig) {
  return line
    .replace('content', `${config.field.toLowerCase()} content`)
    .replace('reports', `${config.field.toLowerCase()} reports`)
    .replace('decision making', `${config.field.toLowerCase()} decision making`)
    .replace('stories', `${config.field.toLowerCase()} stories`)
    .replace('insights', `${config.field.toLowerCase()} insights`);
}

function wrapParagraph(content: string) {
  return `<p>${content}</p>`;
}

type SectionConfig = {
  type: string;
  location: string;
  field: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tonalDirection: string;
  paragraphs: number;
  targetWordsPerParagraph: number;
};

function replaceTokens(template: string, config: SectionConfig) {
  return template
    .replaceAll('{location}', titleCase(config.location))
    .replaceAll('{field}', titleCase(config.field));
}

function distributeParagraphs(sectionCount: number, totalParagraphs: number) {
  const base = Math.floor(totalParagraphs / sectionCount);
  const remainder = totalParagraphs % sectionCount;
  return new Array(sectionCount).fill(base).map((value, idx) => value + (idx < remainder ? 1 : 0));
}

function buildImageIdeas(field: string, location: string) {
  const query = encodeURIComponent(`${field} ${location}`);
  const altBase = `${titleCase(field)} in ${titleCase(location)}`;
  return [
    {
      url: `https://images.unsplash.com/featured/?${query}`,
      alt: `${altBase} — contextual hero image`
    },
    {
      url: `https://source.unsplash.com/960x640/?strategy,${query}`,
      alt: `${altBase} strategy workshop`
    },
    {
      url: `https://source.unsplash.com/960x640/?teamwork,${query}`,
      alt: `${altBase} collaborative session`
    }
  ];
}

function findFieldInsights(field: string) {
  const key = Object.keys(fieldsKnowledgeBase).find((entry) => field.includes(entry));
  if (!key) {
    return ['audience intelligence', 'differentiated positioning', 'continuous optimization'];
  }
  return fieldsKnowledgeBase[key];
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function estimateWordCount(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ');
  return text
    .split(/\s+/)
    .map((fragment) => fragment.trim())
    .filter(Boolean).length;
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
