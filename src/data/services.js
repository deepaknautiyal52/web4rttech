export const categories = [
  {
    id: 'development',
    title: 'Web & Mobile Development',
    description: 'Custom-built, scalable products for startups and growing businesses — from first launch to enterprise scale.',
    process: [
      { title: 'Discovery & Planning', description: 'We understand your goals, users, and technical requirements before writing a line of code.' },
      { title: 'Design & Architecture', description: 'Wireframes, UI design, and technical architecture planned around your specific scale and budget.' },
      { title: 'Development & Testing', description: 'Iterative builds with regular check-ins, tested across devices and real-world conditions.' },
      { title: 'Launch & Support', description: 'Deployment, monitoring, and ongoing support after go-live.' }
    ]
  },
  {
    id: 'growth',
    title: 'Digital Marketing & Growth',
    description: 'Data-driven marketing that gets found, gets clicked, and gets measured — for both Indian and global audiences.',
    process: [
      { title: 'Audit & Research', description: 'Analyze your current presence, competitors, and audience to find the highest-impact opportunities.' },
      { title: 'Strategy & Setup', description: 'Build a channel-specific plan with clear, measurable targets.' },
      { title: 'Execution & Optimization', description: 'Launch campaigns and content, then continuously test and refine based on real performance data.' },
      { title: 'Reporting & Iteration', description: 'Transparent reporting with a clear view of what’s working and what’s next.' }
    ]
  },
  {
    id: 'ai-data',
    title: 'AI & Data Science',
    description: 'Turn raw data into decisions, and repetitive work into automation, with practical AI built for real business outcomes.',
    process: [
      { title: 'Discovery & Data Assessment', description: 'Understand your data sources, systems, and the business problem you’re actually solving.' },
      { title: 'Solution Design', description: 'Choose the right approach — off-the-shelf model, custom ML, or automation — matched to your budget and timeline.' },
      { title: 'Build & Validate', description: 'Develop and test the solution against real data before rollout.' },
      { title: 'Deploy & Monitor', description: 'Integrate into your workflow with ongoing monitoring so performance doesn’t drift over time.' }
    ]
  }
];

const services = [
  {
    id: 'web-development',
    category: 'development',
    title: 'Web Development',
    description: 'Fast, responsive websites and web apps built on modern frameworks, engineered to convert visitors into customers.',
    long: 'We design and build custom websites, e-commerce stores, and web applications using modern stacks like React, Node.js, Laravel, and Python/Django. Every build is optimized for speed, mobile responsiveness, and conversion — whether you need a marketing site, a customer portal, or a full SaaS product.',
    offerings: ['Custom website & web app development', 'E-commerce stores', 'API & third-party integrations', 'Website speed & performance optimization'],
    techStack: ['React', 'Next.js', 'Node.js', 'Laravel', 'Python', 'Django', 'WordPress', 'Tailwind CSS'],
    pricing: [
      {
        name: 'Starter',
        priceINR: '₹16,500',
        priceUSD: '$200',
        tagline: 'Best for personal brands & small businesses',
        features: ['Up to 5 pages', 'Responsive design', 'Basic on-page SEO setup', 'Contact form', '1 round of revisions', '30 days post-launch support']
      },
      {
        name: 'Business',
        priceINR: '₹41,500',
        priceUSD: '$500',
        tagline: 'Best for growing businesses',
        featured: true,
        features: ['Up to 12 pages', 'Custom design (no templates)', 'CMS integration (blog/news)', 'Advanced SEO setup', 'Analytics & tracking setup', '90 days post-launch support']
      },
      {
        name: 'E-Commerce / Web App',
        priceINR: '₹1,25,000',
        priceUSD: '$1,500',
        tagline: 'Best for online stores & custom platforms',
        features: ['Custom web app or online store', 'Payment gateway integration', 'User accounts & admin dashboard', 'Third-party API integrations', 'Load & security testing', '6 months post-launch support']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for large-scale, complex platforms',
        features: ['Fully custom architecture', 'Scalable cloud infrastructure', 'Dedicated project team', 'SLA-backed support', 'Ongoing development retainer']
      }
    ],
    pricingNote: 'Prices shown are starting estimates for typical projects. Final pricing depends on scope, features, timeline, and complexity — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'How long does a typical website take to build?', a: 'A marketing website usually takes 3–5 weeks; a more complex web app can take 8–12+ weeks depending on scope. We’ll give you a clear timeline after understanding your requirements.' },
      { q: 'Can you work with our existing website or codebase?', a: 'Yes — we regularly take over existing projects, whether that means redesigning on top of your current stack or migrating to something more modern.' },
      { q: 'How much does a website actually cost?', a: 'It depends entirely on scope — see the pricing guide above for typical ranges. Simple sites start around $200, business websites around $500, and e-commerce or custom web apps start around $1,500. We\'ll always give you a firm quote before starting work.' }
    ]
  },
  {
    id: 'mobile-app-development',
    category: 'development',
    title: 'Mobile App Development',
    description: 'Native and cross-platform iOS/Android apps designed for smooth performance and real user retention.',
    long: 'From concept to App Store launch, we build cross-platform and native mobile apps using React Native and modern native toolchains. We focus on performance, offline reliability, and clean UX so your app holds up under real-world usage, not just demos.',
    offerings: ['Cross-platform apps (React Native)', 'Native iOS & Android development', 'App Store & Play Store launch support', 'Post-launch maintenance & updates'],
    techStack: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'REST & GraphQL APIs'],
    pricing: [
      {
        name: 'Starter',
        priceINR: '₹66,500',
        priceUSD: '$800',
        tagline: 'Best for validating an idea with a simple app',
        features: ['Single platform (iOS or Android)', 'Up to 5 screens', 'Basic UI/UX design', 'REST API integration', '30 days post-launch support']
      },
      {
        name: 'Business',
        priceINR: '₹2,07,500',
        priceUSD: '$2,500',
        tagline: 'Best for full-featured cross-platform apps',
        featured: true,
        features: ['iOS + Android (React Native)', 'Up to 15 screens', 'Custom UI/UX design', 'Backend & API integration', 'Push notifications', '90 days post-launch support']
      },
      {
        name: 'Advanced',
        priceINR: '₹5,00,000',
        priceUSD: '$6,000',
        tagline: 'Best for complex apps with custom backend & integrations',
        features: ['iOS + Android + admin dashboard', 'Custom backend development', 'Third-party integrations (payments, maps, etc.)', 'User authentication & roles', '6 months post-launch support']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for large-scale, mission-critical apps',
        features: ['Native iOS + Android development', 'Dedicated project team', 'Scalable cloud backend', 'SLA-backed support', 'Ongoing development retainer']
      }
    ],
    pricingNote: 'Prices shown are starting estimates for typical projects, billed one-time. Final pricing depends on scope, features, and platform complexity — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'Should we build native or cross-platform?', a: 'For most startups and SMBs, React Native gets you to both iOS and Android faster and cheaper without a meaningful UX tradeoff. We’ll recommend native only when your app has heavy platform-specific requirements.' },
      { q: 'Do you help with App Store and Play Store submission?', a: 'Yes, we handle store listings, submission, and the review process, and can advise on ASO (app store optimization) to improve discoverability.' },
      { q: 'How much does a mobile app cost?', a: 'A simple single-platform MVP starts around $800; a full-featured cross-platform app typically starts around $2,500; complex apps with custom backends start around $6,000. We\'ll give you a firm quote after scoping your requirements.' }
    ]
  },
  {
    id: 'cloud-services',
    category: 'development',
    title: 'Cloud Services',
    description: 'Migrate, manage, and optimize your cloud infrastructure with AWS, Azure, and Google Cloud expertise.',
    long: 'We handle cloud strategy, migration, and ongoing management across AWS, Azure, and Google Cloud — from moving legacy systems to the cloud to right-sizing infrastructure so you are not overpaying as you scale.',
    offerings: ['Cloud migration & setup', 'Infrastructure management (AWS/Azure/GCP)', 'Cost optimization & right-sizing', 'CI/CD & DevOps pipelines'],
    techStack: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
    pricing: [
      {
        name: 'Starter',
        priceINR: '₹12,500',
        priceUSD: '$150',
        tagline: 'Best for startups launching their first cloud environment',
        features: ['Cloud account setup (AWS/Azure/GCP)', 'Basic architecture & deployment', 'DNS, SSL & firewall configuration', 'Single environment setup', '30 days post-launch support']
      },
      {
        name: 'Business',
        priceINR: '₹50,000',
        priceUSD: '$600',
        tagline: 'Best for businesses migrating to the cloud',
        featured: true,
        features: ['Full migration from on-prem/legacy hosting', 'Staging + production environments', 'Automated backups & monitoring setup', 'Cost optimization review', '90 days post-launch support']
      },
      {
        name: 'Managed Cloud',
        priceINR: '₹21,000',
        priceUSD: '$250',
        billing: '/mo',
        tagline: 'Best for ongoing infrastructure management',
        features: ['24/7 infrastructure monitoring', 'Monthly cost & performance optimization', 'Patching & maintenance', 'CI/CD pipeline management', 'Priority email & chat support']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for large-scale, multi-region infrastructure',
        features: ['Multi-cloud / hybrid architecture', 'Dedicated DevOps engineer', 'Kubernetes & container orchestration', 'SLA-backed uptime guarantees', '24/7 dedicated support']
      }
    ],
    pricingNote: 'Starter and Business are one-time setup/migration projects; Managed Cloud is a monthly retainer for ongoing support. Final pricing depends on your current infrastructure and requirements — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'Which cloud provider should we use?', a: 'It depends on your existing stack, team familiarity, and budget — we’ll recommend the right fit rather than pushing one provider by default.' },
      { q: 'Can you manage our cloud costs, not just the infrastructure?', a: 'Yes — cost optimization (right-sizing, reserved instances, cleanup of unused resources) is part of our ongoing cloud management, not a separate line item.' },
      { q: 'How much does cloud migration or management cost?', a: 'A basic cloud setup starts around $150 one-time; a full migration typically starts around $600 one-time. Ongoing managed infrastructure is billed monthly, starting around $250/mo. We\'ll give you a firm quote after understanding your current setup.' }
    ]
  },
  {
    id: 'seo',
    category: 'growth',
    title: 'Search Engine Optimization (SEO)',
    description: 'Technical, on-page, and content SEO to rank higher and win organic traffic that actually converts.',
    long: 'We combine technical SEO audits, on-page optimization, content strategy, and link building to improve rankings sustainably — no shortcuts that risk penalties. Reporting is transparent: you see the same rankings, traffic, and conversion data we do.',
    offerings: ['Technical SEO audits', 'On-page & content optimization', 'Keyword research & strategy', 'Link building & authority growth'],
    techStack: ['Google Search Console', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Analytics'],
    pricing: [
      {
        name: 'SEO Audit',
        priceINR: '₹12,500',
        priceUSD: '$150',
        tagline: 'Best for a baseline health check',
        features: ['Full technical SEO audit', 'On-page analysis', 'Competitor analysis', 'Keyword opportunity report', 'Actionable recommendations report']
      },
      {
        name: 'Growth',
        priceINR: '₹33,000',
        priceUSD: '$400',
        billing: '/mo',
        tagline: 'Best for building organic traffic',
        featured: true,
        features: ['On-page optimization', 'Monthly content/blog optimization', 'Basic link building', 'Monthly ranking & traffic reports', 'Technical SEO monitoring']
      },
      {
        name: 'Scale',
        priceINR: '₹75,000',
        priceUSD: '$900',
        billing: '/mo',
        tagline: 'Best for competitive markets',
        features: ['Everything in Growth', 'Advanced link building & outreach', 'Content strategy & creation', 'Local SEO (if applicable)', 'Bi-weekly reporting calls']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for large or multi-market sites',
        features: ['Multi-site/multi-market SEO', 'Dedicated SEO strategist', 'Custom reporting dashboard', 'Priority support']
      }
    ],
    pricingNote: 'The SEO Audit is a one-time engagement; Growth and Scale are monthly retainers for ongoing SEO work. Final pricing depends on your site size, competition, and goals — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'How long until we see SEO results?', a: 'Meaningful ranking movement typically starts in 2–4 months, with more significant traffic growth by month 4–6 — SEO is a compounding investment, not an overnight fix.' },
      { q: 'Do you guarantee #1 rankings?', a: 'No ethical SEO provider can guarantee a specific ranking position — search algorithms change constantly. We focus on sustainable, penalty-free growth in organic traffic and conversions instead.' },
      { q: 'How much does SEO cost?', a: 'A standalone audit starts around $150 one-time. Ongoing SEO is billed monthly, starting around $400/mo for growing sites and $900/mo for competitive markets. We\'ll recommend the right starting point based on your site and goals.' }
    ]
  },
  {
    id: 'smo',
    category: 'growth',
    title: 'Social Media Optimization (SMO)',
    description: 'Grow brand presence and engagement across the platforms your customers actually use.',
    long: 'We build and manage a consistent social presence — content calendars, community engagement, and platform-specific optimization across Instagram, LinkedIn, Facebook, and X — tuned to your audience, whether local or international.',
    offerings: ['Content calendars & posting', 'Profile & platform optimization', 'Community engagement', 'Performance & growth reporting'],
    techStack: ['Meta Business Suite', 'Instagram', 'LinkedIn', 'Canva', 'Buffer / Hootsuite'],
    pricing: [
      {
        name: 'Starter',
        priceINR: '₹21,000',
        priceUSD: '$250',
        billing: '/mo',
        tagline: 'Best for building an initial presence',
        features: ['1–2 platforms', '12 posts/month', 'Basic graphic design', 'Monthly performance report']
      },
      {
        name: 'Business',
        priceINR: '₹41,500',
        priceUSD: '$500',
        billing: '/mo',
        tagline: 'Best for growing brands',
        featured: true,
        features: ['2–3 platforms', '20 posts/month', 'Custom graphics & short-form video planning', 'Community engagement', 'Monthly strategy call']
      },
      {
        name: 'Growth',
        priceINR: '₹75,000',
        priceUSD: '$900',
        billing: '/mo',
        tagline: 'Best for scaling social presence',
        features: ['Up to 4 platforms', 'Daily posting', 'Influencer outreach coordination', 'Paid social boost management', 'Bi-weekly reporting']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for multi-brand or large-scale operations',
        features: ['Unlimited platforms', 'Dedicated social media manager', 'Content calendar & campaign planning', 'Crisis management support']
      }
    ],
    pricingNote: 'SMO is billed as a monthly retainer, since social presence is built through consistent, ongoing management. Final pricing depends on platforms, posting frequency, and content needs — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'Which platforms should we focus on?', a: 'We’ll recommend platforms based on where your actual customers spend time — B2B often means LinkedIn-first, while consumer brands usually lean Instagram or Facebook.' },
      { q: 'Do you create the content, or just post it?', a: 'We handle both — content creation (graphics, captions, short-form video planning) and consistent scheduling, plus community engagement.' },
      { q: 'How much does social media management cost?', a: 'Plans start around $250/mo for 1–2 platforms and scale up based on platform count, posting frequency, and content complexity. We\'ll recommend the right tier based on your goals.' }
    ]
  },
  {
    id: 'ppc-google-ads',
    category: 'growth',
    title: 'PPC & Google Ads',
    description: 'Paid campaigns engineered for ROI — Google Ads, Meta Ads, and retargeting that pay for themselves.',
    long: 'We plan, launch, and continuously optimize paid campaigns across Google Ads, Meta, and retargeting networks. Every campaign is built around measurable cost-per-acquisition targets, with ongoing A/B testing so ad spend keeps getting more efficient over time.',
    offerings: ['Google Ads & Meta Ads management', 'Retargeting & remarketing campaigns', 'Landing page & conversion optimization', 'Spend efficiency & ROI reporting'],
    techStack: ['Google Ads', 'Meta Ads Manager', 'Google Tag Manager', 'Google Analytics 4'],
    pricing: [
      {
        name: 'Starter',
        priceINR: '₹25,000',
        priceUSD: '$300',
        billing: '/mo',
        tagline: 'Best for businesses testing paid ads',
        features: ['Single platform (Google or Meta)', 'Campaign setup & management', 'Basic A/B testing', 'Monthly performance report']
      },
      {
        name: 'Business',
        priceINR: '₹50,000',
        priceUSD: '$600',
        billing: '/mo',
        tagline: 'Best for scaling ad spend',
        featured: true,
        features: ['Google + Meta Ads management', 'Landing page recommendations', 'Ongoing A/B testing', 'Retargeting campaigns', 'Bi-weekly reporting calls']
      },
      {
        name: 'Growth',
        priceINR: '₹1,00,000',
        priceUSD: '$1,200',
        billing: '/mo',
        tagline: 'Best for larger, multi-platform ad budgets',
        features: ['Multi-platform management', 'Advanced audience segmentation', 'Conversion rate optimization', 'Dedicated account manager', 'Weekly reporting']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for enterprise-scale ad spend',
        features: ['Custom strategy across all platforms', 'Dedicated PPC team', 'Advanced attribution modeling', 'Priority support']
      }
    ],
    pricingNote: 'Prices shown are monthly management fees and do not include ad spend, which is paid directly to Google/Meta and set based on your budget. Get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'What’s a reasonable ad budget to start with?', a: 'It depends on your industry and goals, but we typically recommend starting with a test budget over 4–6 weeks to gather enough data before scaling spend.' },
      { q: 'How do you measure success?', a: 'Cost-per-acquisition and return on ad spend, tracked against the specific conversion goal we define together up front — not just clicks or impressions.' },
      { q: 'How much does PPC management cost?', a: 'Our management fees start around $300/mo, separate from your actual ad spend (paid directly to Google/Meta). We\'ll recommend a tier based on your budget and how many platforms you want to run.' }
    ]
  },
  {
    id: 'digital-marketing',
    category: 'growth',
    title: 'Digital Marketing Strategy',
    description: 'A unified marketing plan tying SEO, paid, social, and content together around one growth goal.',
    long: 'Rather than running channels in isolation, we build one integrated strategy across SEO, paid media, social, and email — so every channel reinforces the others. You get a clear roadmap, monthly reporting, and a single point of accountability for growth.',
    offerings: ['Cross-channel growth strategy', 'Email & marketing automation', 'Content marketing planning', 'Monthly performance reporting'],
    techStack: ['HubSpot', 'Mailchimp', 'Google Analytics 4', 'Looker Studio'],
    pricing: [
      {
        name: 'Strategy Sprint',
        priceINR: '₹41,500',
        priceUSD: '$500',
        tagline: 'Best for businesses needing a clear roadmap',
        features: ['Full marketing audit', 'Channel prioritization', '90-day action plan', 'Competitor analysis', '1 strategy presentation call']
      },
      {
        name: 'Growth Retainer',
        priceINR: '₹66,500',
        priceUSD: '$800',
        billing: '/mo',
        tagline: 'Best for ongoing cross-channel execution',
        featured: true,
        features: ['Multi-channel strategy execution', 'Monthly planning & optimization', 'Email marketing setup', 'Performance dashboard', 'Monthly strategy call']
      },
      {
        name: 'Scale Retainer',
        priceINR: '₹1,25,000',
        priceUSD: '$1,500',
        billing: '/mo',
        tagline: 'Best for running multiple active channels',
        features: ['Everything in Growth Retainer', 'Content marketing plan & execution', 'Marketing automation setup', 'Bi-weekly reporting', 'Dedicated strategist']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for complex, multi-market operations',
        features: ['Custom multi-market strategy', 'Dedicated marketing team', 'Advanced attribution & reporting', 'Priority support']
      }
    ],
    pricingNote: 'Strategy Sprint is a one-time engagement; Growth and Scale Retainers are monthly for ongoing execution. Final pricing depends on channels involved and scope — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'Do we need to use all channels (SEO, PPC, social, email) at once?', a: 'No — we’ll prioritize based on where your audience actually is and your budget, then layer in additional channels as the strategy proves out.' },
      { q: 'How often will we get reporting?', a: 'Monthly reporting is standard, with a live dashboard available anytime and a call to walk through results and next steps.' },
      { q: 'How much does a marketing strategy engagement cost?', a: 'A one-time strategy sprint starts around $500. Ongoing execution retainers start around $800/mo and scale with the number of channels and workload involved.' }
    ]
  },
  {
    id: 'adsense-monetization',
    category: 'growth',
    title: 'AdSense & Site Monetization',
    description: 'Maximize ad revenue from your content site with AdSense setup, placement strategy, and policy compliance.',
    long: 'For publishers and content sites, we handle Google AdSense setup and approval, ad placement strategy for maximum RPM without hurting UX, and ongoing compliance so your account stays in good standing as traffic scales.',
    offerings: ['AdSense account setup & approval', 'Ad placement & layout strategy', 'RPM & revenue optimization', 'Policy compliance monitoring'],
    techStack: ['Google AdSense', 'Google Ad Manager', 'Ezoic'],
    pricing: [
      {
        name: 'Setup',
        priceINR: '₹12,500',
        priceUSD: '$150',
        tagline: 'Best for new publishers setting up AdSense',
        features: ['AdSense account setup & approval assistance', 'Basic ad placement strategy', 'Policy compliance check', 'Implementation support']
      },
      {
        name: 'Optimization',
        priceINR: '₹29,000',
        priceUSD: '$350',
        tagline: 'Best for existing sites improving ad revenue',
        featured: true,
        features: ['Full ad placement audit & redesign', 'A/B testing setup', 'Ad density & UX balance review', 'RPM improvement recommendations', '30 days post-launch support']
      },
      {
        name: 'Managed Monetization',
        priceINR: '₹33,000',
        priceUSD: '$400',
        billing: '/mo',
        tagline: 'Best for ongoing revenue optimization',
        features: ['Monthly placement optimization', 'Ongoing policy compliance monitoring', 'Revenue reporting & analysis', 'Ongoing A/B testing', 'Priority support']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for high-traffic publishers & ad networks',
        features: ['Multi-site monetization strategy', 'Header bidding setup', 'Ad network diversification beyond AdSense', 'Dedicated monetization manager']
      }
    ],
    pricingNote: 'Setup and Optimization are one-time engagements; Managed Monetization is a monthly retainer for ongoing revenue optimization. Get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'How much traffic do we need before AdSense is worthwhile?', a: 'AdSense can work at almost any traffic level, but revenue becomes meaningful once you’re consistently seeing a few thousand monthly pageviews — we’ll advise honestly on whether it’s the right fit yet.' },
      { q: 'Will ads hurt our site’s user experience?', a: 'Poorly placed ads do — that’s why placement strategy is central to what we do, balancing revenue with a page experience that doesn’t drive visitors away.' },
      { q: 'How much does AdSense setup or optimization cost?', a: 'Initial setup starts around $150 one-time; a full placement optimization for an existing site starts around $350 one-time. Ongoing managed monetization is billed monthly, starting around $400/mo.' }
    ]
  },
  {
    id: 'ai-solutions',
    category: 'ai-data',
    title: 'AI Solutions',
    description: 'Practical AI integrations — chatbots, automation, and applied ML — built for measurable business impact.',
    long: 'We build applied AI solutions: customer-facing chatbots, workflow automation, document processing, and custom ML models integrated directly into your existing systems. The focus is always on a clear business outcome, not AI for its own sake.',
    offerings: ['Custom chatbots & virtual assistants', 'Workflow & process automation', 'Document & data processing', 'Custom ML model integration'],
    techStack: ['OpenAI / Claude APIs', 'Python', 'LangChain', 'Custom ML models'],
    pricing: [
      {
        name: 'Starter',
        priceINR: '₹41,500',
        priceUSD: '$500',
        tagline: 'Best for a single chatbot or automation workflow',
        features: ['Single chatbot or automation workflow', 'Basic integration (website/WhatsApp)', 'Standard AI model (GPT/Claude API)', 'Testing & deployment', '30 days post-launch support']
      },
      {
        name: 'Business',
        priceINR: '₹1,25,000',
        priceUSD: '$1,500',
        tagline: 'Best for multi-workflow automation or advanced chatbots',
        featured: true,
        features: ['Multi-step automation or advanced chatbot', 'CRM/database integration', 'Custom prompt engineering', 'Analytics & performance tracking', '90 days post-launch support']
      },
      {
        name: 'Advanced',
        priceINR: '₹3,32,000',
        priceUSD: '$4,000',
        tagline: 'Best for custom ML models or complex integrations',
        features: ['Custom ML model development', 'Multiple system integrations', 'Document/data processing pipelines', 'Ongoing monitoring setup', '6 months post-launch support']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for large-scale AI deployments',
        features: ['Enterprise-grade AI architecture', 'Dedicated AI engineer', 'Continuous model monitoring & retraining', 'SLA-backed support']
      }
    ],
    pricingNote: 'Prices shown are starting estimates for one-time project delivery. Final pricing depends on complexity, integrations, and data requirements — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'Do we need a lot of data to get started with AI?', a: 'Not always — many high-value use cases like chatbots and automation don’t require large proprietary datasets. We’ll assess what’s realistic for your specific use case.' },
      { q: 'How do you make sure the AI stays accurate over time?', a: 'We build in monitoring and feedback loops so model or chatbot performance is tracked after launch, not just at delivery.' },
      { q: 'How much does an AI solution cost?', a: 'A single chatbot or automation workflow starts around $500; multi-workflow automation or advanced chatbots start around $1,500; custom ML models and complex integrations start around $4,000. We\'ll scope your specific use case for a firm quote.' }
    ]
  },
  {
    id: 'data-science',
    category: 'ai-data',
    title: 'Data Science & Analytics',
    description: 'Dashboards, predictive models, and data pipelines that turn scattered data into clear decisions.',
    long: 'From data pipeline setup to predictive modeling and executive dashboards, we help you turn raw operational data into decisions you can act on — covering everything from data cleaning and warehousing to the final visualization layer.',
    offerings: ['Data pipeline & warehousing setup', 'Predictive modeling', 'Executive dashboards & reporting', 'Data cleaning & governance'],
    techStack: ['Python', 'SQL', 'Power BI', 'Looker Studio', 'Pandas'],
    pricing: [
      {
        name: 'Starter',
        priceINR: '₹50,000',
        priceUSD: '$600',
        tagline: 'Best for a basic reporting dashboard',
        features: ['Single data source integration', 'Basic dashboard (up to 10 metrics)', 'Data cleaning & preparation', '1 round of revisions', '30 days post-launch support']
      },
      {
        name: 'Business',
        priceINR: '₹1,50,000',
        priceUSD: '$1,800',
        tagline: 'Best for multi-source dashboards & insights',
        featured: true,
        features: ['Multiple data source integration', 'Advanced dashboard & reporting', 'Basic predictive analytics', 'Data pipeline setup', '90 days post-launch support']
      },
      {
        name: 'Advanced',
        priceINR: '₹3,75,000',
        priceUSD: '$4,500',
        tagline: 'Best for predictive modeling & data infrastructure',
        features: ['Custom predictive/ML models', 'Data warehouse setup', 'Automated reporting pipelines', 'Data governance setup', '6 months post-launch support']
      },
      {
        name: 'Enterprise',
        priceINR: 'Custom Quote',
        priceUSD: 'Custom Quote',
        tagline: 'Best for enterprise-scale data infrastructure',
        features: ['Enterprise data architecture', 'Dedicated data science team', 'Ongoing model maintenance & retraining', 'SLA-backed support']
      }
    ],
    pricingNote: 'Prices shown are starting estimates for one-time project delivery. Final pricing depends on data sources, complexity, and reporting needs — get in touch for a detailed, no-obligation quote.',
    faqs: [
      { q: 'Our data is messy across multiple systems — can you still help?', a: 'Yes — data cleaning and consolidation is usually the first phase of any engagement, before dashboards or models are built on top.' },
      { q: 'Do you build one-time reports or ongoing dashboards?', a: 'Both, depending on your need — but most clients move toward live dashboards so decisions are based on current data, not a monthly export.' },
      { q: 'How much does a data science project cost?', a: 'A basic single-source dashboard starts around $600; multi-source dashboards with predictive analytics start around $1,800; custom ML models and data infrastructure start around $4,500. We\'ll scope your data sources for a firm quote.' }
    ]
  }
];

export default services;
