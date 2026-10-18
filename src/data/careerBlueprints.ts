import { CareerBlueprint } from "@/types";

export const MASTER_CAREER_BLUEPRINTS: Record<string, CareerBlueprint> = {
  "data-analyst": {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data & AI",
    overview:
      "A Data Analyst inspects, cleans, transforms, and models data to discover useful information, suggest conclusions, and support managerial decision-making. They act as the vital bridge between complex enterprise databases and strategic business stakeholders.",
    averageSalaryUsd: "$92,000 - $145,000/yr",
    growthRate: "+23% (Much faster than average through 2032)",
    openRolesCount: "135,000+ active openings worldwide",
    seniorityLevels: [
      { level: "Junior / Associate Analyst", yearsExp: "0 - 2 yrs", avgPay: "$70,000 - $88,000" },
      { level: "Mid-Level Data Analyst", yearsExp: "2 - 5 yrs", avgPay: "$95,000 - $125,000" },
      { level: "Senior / Lead Analyst", yearsExp: "5 - 8 yrs", avgPay: "$130,000 - $175,000" },
      { level: "Principal / Analytics Director", yearsExp: "8+ yrs", avgPay: "$180,000 - $240,000+" }
    ],
    coreQualities: [
      {
        name: "Analytical Thinking & Problem Decomposition",
        description: "Breaking down complex, fuzzy business problems into quantifiable metrics and hypothesis-driven inquiry.",
        iconName: "Brain"
      },
      {
        name: "Data Storytelling & Visualization",
        description: "Transforming dry spreadsheets into compelling narrative dashboards that guide executive leadership directly to ROI.",
        iconName: "Presentation"
      },
      {
        name: "Relational Rigor & Data Integrity",
        description: "Obsession with accuracy, validating anomalous edge cases, handling nulls, and establishing reproducible pipelines.",
        iconName: "ShieldCheck"
      },
      {
        name: "Cross-Functional Business Acumen",
        description: "Speaking the language of Finance, Product, and Marketing to ensure analysis answers the 'So What?' question.",
        iconName: "Briefcase"
      }
    ],
    techStack: [
      // Beginner
      {
        name: "Microsoft Excel / Google Sheets",
        category: "Spreadsheets & Ad-hoc",
        level: "Beginner",
        importance: "Essential",
        description: "XLOOKUP, Pivot Tables, SUMIFS, conditional formatting, index/match, and data hygiene."
      },
      {
        name: "SQL (Structured Query Language)",
        category: "Databases & Querying",
        level: "Beginner",
        importance: "Essential",
        description: "SELECT, JOINs (INNER, LEFT, FULL), GROUP BY, HAVING, subqueries, and WHERE filtering."
      },
      {
        name: "Basic Statistics & Probability",
        category: "Mathematics",
        level: "Beginner",
        importance: "Essential",
        description: "Mean, median, mode, variance, standard deviation, normal distributions, and correlation vs causation."
      },
      // Intermediate
      {
        name: "Advanced SQL (Window Functions & CTEs)",
        category: "Databases & Querying",
        level: "Intermediate",
        importance: "Essential",
        description: "ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD, Common Table Expressions, and query indexing."
      },
      {
        name: "Tableau & Power BI",
        category: "BI & Visualization",
        level: "Intermediate",
        importance: "Essential",
        description: "Calculated fields, DAX measures, parameter actions, LOD expressions, and executive dashboard design."
      },
      {
        name: "Python (Pandas, NumPy, Matplotlib)",
        category: "Programming & Automation",
        level: "Intermediate",
        importance: "Highly Valued",
        description: "Dataframe manipulation, handling missing values, exploratory data analysis, and script automation."
      },
      {
        name: "A/B Testing & Hypothesis Testing",
        category: "Experimentation",
        level: "Intermediate",
        importance: "Highly Valued",
        description: "p-values, statistical significance, confidence intervals, sample size calculation, and test design."
      },
      // Advanced
      {
        name: "Cloud Data Warehouses (Snowflake, BigQuery)",
        category: "Cloud Data Platforms",
        level: "Advanced",
        importance: "Highly Valued",
        description: "Partitioning, clustering, semi-structured JSON querying, cost optimization, and modern data stack."
      },
      {
        name: "dbt (data build tool)",
        category: "Data Transformation",
        level: "Advanced",
        importance: "Highly Valued",
        description: "Modular SQL transformations, testing, documentation, and version-controlled data modeling."
      },
      {
        name: "Predictive Analytics & Machine Learning Basics",
        category: "Advanced Analytics",
        level: "Advanced",
        importance: "Bonus",
        description: "Linear and logistic regression, clustering (k-means), and decision trees for predictive forecasting."
      }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        phaseName: "Data Foundations & Query Mastery",
        durationWeeks: "Weeks 1 - 4",
        objective: "Master relational database fundamentals and query fluency to retrieve any slice of data with speed.",
        keyMilestones: [
          "Complete SQL Fundamentals: mastering multi-table JOINs, aggregations, and filtering",
          "Deep dive into Advanced SQL: Window Functions (OVER, PARTITION BY) and CTEs",
          "Advanced Excel modeling: Power Query, nested formulas, dynamic arrays"
        ],
        recommendedProjects: [
          "E-Commerce Customer Retention & Cohort Analysis in PostgreSQL",
          "Financial KPI Model with Automated Excel Power Query"
        ]
      },
      {
        phaseNumber: 2,
        phaseName: "Business Intelligence & Executive Storytelling",
        durationWeeks: "Weeks 5 - 8",
        objective: "Build interactive, high-impact BI dashboards that communicate clear ROI to non-technical stakeholders.",
        keyMilestones: [
          "Master Tableau or Power BI: parameters, calculated fields, and dashboard UX",
          "Learn visual hierarchy and chart selection (when to use heatmaps vs combo charts vs bullet graphs)",
          "Design for user adoption: latency optimization, interactive drill-downs"
        ],
        recommendedProjects: [
          "SaaS Executive Revenue & Churn Dashboard in Tableau (Publicly Hosted)",
          "Healthcare Operational Efficiency Dashboard in Power BI"
        ]
      },
      {
        phaseNumber: 3,
        phaseName: "Python Analytics & Experimentation",
        durationWeeks: "Weeks 9 - 12",
        objective: "Automate exploratory data workflows and execute rigorous statistical A/B tests using Python.",
        keyMilestones: [
          "Python data manipulation with Pandas & NumPy",
          "Automated exploratory data analysis (EDA) and data cleansing scripts",
          "Design and evaluate statistical A/B tests (two-tailed t-tests, chi-square)"
        ],
        recommendedProjects: [
          "Marketing Campaign Funnel Drop-off Analysis & A/B Experiment Evaluator",
          "Customer Lifetime Value (LTV) Prediction Script"
        ]
      },
      {
        phaseNumber: 4,
        phaseName: "Modern Cloud Stack & Interview Readiness",
        durationWeeks: "Weeks 13 - 16",
        objective: "Bridge into modern cloud data warehouses (Snowflake/BigQuery) and polish a job-winning portfolio.",
        keyMilestones: [
          "Learn cloud warehousing concepts: columnar storage, partitioning, BigQuery / Snowflake",
          "Understand dimensional modeling (star schema vs snowflake schema)",
          "Complete 3 GitHub case studies with clear business problem statements and slide decks",
          "Practice SQL technical whiteboard interviews on LeetCode/StrataScratch"
        ],
        recommendedProjects: [
          "End-to-End Modern Analytics Stack: Snowflake + dbt + Streamlit/Tableau",
          "Public Portfolio Website featuring 3 end-to-end interactive case studies"
        ]
      }
    ]
  },

  "ai-ml-engineer": {
    id: "ai-ml-engineer",
    title: "AI & Machine Learning Engineer",
    category: "Data & AI",
    overview:
      "AI & ML Engineers design, build, and deploy intelligent algorithms and neural networks that learn from data. In 2026, they focus on Foundation Model adaptation, RAG (Retrieval-Augmented Generation), fine-tuning, and scalable production MLOps.",
    averageSalaryUsd: "$140,000 - $225,000/yr",
    growthRate: "+38% (Explosive industry demand)",
    openRolesCount: "98,000+ active openings worldwide",
    seniorityLevels: [
      { level: "Junior ML Engineer", yearsExp: "0 - 2 yrs", avgPay: "$95,000 - $125,000" },
      { level: "Mid-Level AI/ML Engineer", yearsExp: "2 - 5 yrs", avgPay: "$135,000 - $175,000" },
      { level: "Senior AI Systems Architect", yearsExp: "5 - 8 yrs", avgPay: "$180,000 - $250,000" },
      { level: "Staff / Principal AI Researcher", yearsExp: "8+ yrs", avgPay: "$260,000 - $400,000+" }
    ],
    coreQualities: [
      {
        name: "Algorithmic & Mathematical Grounding",
        description: "Intuition for gradient descent, matrix multiplication, backpropagation, and loss function dynamics.",
        iconName: "Binary"
      },
      {
        name: "Systems Engineering for Inference",
        description: "Balancing compute latency, token throughput, GPU memory constraints (VRAM), and quantization.",
        iconName: "Cpu"
      },
      {
        name: "Scientific Curiosity & Rigor",
        description: "Formulating crisp hypotheses, benchmark evaluations, and avoiding data leakage.",
        iconName: "Sparkles"
      },
      {
        name: "Production MLOps Mindset",
        description: "Ensuring models do not just work on a Jupyter notebook, but reliably serve millions in production.",
        iconName: "Server"
      }
    ],
    techStack: [
      { name: "Python", category: "Languages", level: "Beginner", importance: "Essential", description: "Idiomatic Python, OOP, type hinting, and virtual environments." },
      { name: "Linear Algebra & Calculus", category: "Mathematics", level: "Beginner", importance: "Essential", description: "Eigenvalues, dot products, partial derivatives, and probability distributions." },
      { name: "Scikit-Learn & Pandas", category: "ML Foundations", level: "Beginner", importance: "Essential", description: "Regression, Random Forests, XGBoost, feature engineering." },
      { name: "PyTorch", category: "Deep Learning", level: "Intermediate", importance: "Essential", description: "Tensors, autograd, nn.Module, custom loss functions, and DataLoader pipelines." },
      { name: "Transformers & Hugging Face", category: "NLP & GenAI", level: "Intermediate", importance: "Essential", description: "Attention mechanisms, tokenizers, BERT, LLaMA, and LoRA/QLoRA fine-tuning." },
      { name: "Vector Databases & Embeddings", category: "GenAI & RAG", level: "Intermediate", importance: "Essential", description: "Pinecone, Chroma, Milvus, semantic search, hybrid sparse-dense retrieval." },
      { name: "Docker & Containerization", category: "MLOps", level: "Intermediate", importance: "Highly Valued", description: "Packaging reproducible model services and inference endpoints." },
      { name: "vLLM & TensorRT-LLM", category: "Inference Acceleration", level: "Advanced", importance: "Highly Valued", description: "PagedAttention, continuous batching, FP8/INT4 quantization for ultra-fast serving." },
      { name: "Kubernetes & Kubeflow / Ray", category: "Distributed ML", level: "Advanced", importance: "Highly Valued", description: "Distributed model training across multi-node GPU clusters." },
      { name: "Agentic Frameworks (LangGraph, AutoGen)", category: "Autonomous Agents", level: "Advanced", importance: "Bonus", description: "Multi-agent orchestration, tool-calling, reflection loops, and state machines." }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        phaseName: "Mathematical Foundations & Classical ML",
        durationWeeks: "Weeks 1 - 4",
        objective: "Build deep intuition for core statistics, matrix algebra, and classical machine learning algorithms.",
        keyMilestones: [
          "Linear Algebra and Multivariate Calculus for Optimization",
          "Data cleaning, normalization, and feature encoding with Scikit-learn",
          "Implementing Decision Trees, Random Forests, and Gradient Boosting (XGBoost)"
        ],
        recommendedProjects: [
          "Algorithmic House Price Predictor with Feature Importance Analysis",
          "Credit Card Fraud Detection using Imbalanced Classification & ROC-AUC"
        ]
      },
      {
        phaseNumber: 2,
        phaseName: "Deep Learning & PyTorch Mastery",
        durationWeeks: "Weeks 5 - 8",
        objective: "Design, train, and debug neural networks from scratch using PyTorch.",
        keyMilestones: [
          "Deep understanding of Backpropagation and Optimization (SGD, AdamW)",
          "Building Convolutional Neural Networks (CNNs) and Recurrent Architectures",
          "Mastering PyTorch training loops, learning rate schedulers, and TensorBoard logging"
        ],
        recommendedProjects: [
          "Medical Image Disease Classifier using Transfer Learning (ResNet/ViT)",
          "Multi-Modal Sentiment Analyzer with PyTorch"
        ]
      },
      {
        phaseNumber: 3,
        phaseName: "Modern GenAI, LLMs, & RAG Systems",
        durationWeeks: "Weeks 9 - 12",
        objective: "Build production-grade Generative AI applications with Vector DBs and customized fine-tuning.",
        keyMilestones: [
          "Transformer architecture: Multi-head self-attention and positional embeddings",
          "Retrieval-Augmented Generation (RAG) with hybrid search and rerankers",
          "Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA) on open models"
        ],
        recommendedProjects: [
          "Enterprise Knowledge Graph & Hybrid RAG Assistant with Source Attribution",
          "Domain-Specific Fine-Tuned LLaMA-3 Model for Legal Contract Review"
        ]
      },
      {
        phaseNumber: 4,
        phaseName: "Production MLOps, Inference & Deployment",
        durationWeeks: "Weeks 13 - 16",
        objective: "Deploy high-throughput, low-latency AI endpoints with automated monitoring and evaluation.",
        keyMilestones: [
          "Containerizing models with Docker and serving with FastAPI & vLLM",
          "Implementing model evaluation pipelines (Ragas, DeepEval, prompt regression tests)",
          "Deploying onto cloud GPU instances (AWS SageMaker / GCP Vertex AI / RunPod)"
        ],
        recommendedProjects: [
          "Production-Ready Autonomous Research Agent with Streaming WebSockets",
          "High-Throughput Model Serving Cluster with Autoscaling & vLLM"
        ]
      }
    ]
  },

  "full-stack-engineer": {
    id: "full-stack-engineer",
    title: "Full-Stack Software Engineer",
    category: "Software Engineering",
    overview:
      "Full-Stack Software Engineers architect and build complete end-to-end digital solutions—from responsive user interfaces to resilient distributed backend architectures, relational and non-relational databases, and cloud infrastructure.",
    averageSalaryUsd: "$115,000 - $175,000/yr",
    growthRate: "+25% (High persistent demand)",
    openRolesCount: "180,000+ active openings worldwide",
    seniorityLevels: [
      { level: "Junior Software Engineer", yearsExp: "0 - 2 yrs", avgPay: "$75,000 - $95,000" },
      { level: "Mid-Level Full-Stack Dev", yearsExp: "2 - 5 yrs", avgPay: "$110,000 - $145,000" },
      { level: "Senior Software Engineer", yearsExp: "5 - 8 yrs", avgPay: "$150,000 - $210,000" },
      { level: "Staff / Principal Engineer", yearsExp: "8+ yrs", avgPay: "$220,000 - $320,000+" }
    ],
    coreQualities: [
      {
        name: "Systems Architecture & Scalability",
        description: "Understanding caching layers, asynchronous queues, database indexes, and decoupled modular design.",
        iconName: "Network"
      },
      {
        name: "Craftsmanship & Code Maintainability",
        description: "Writing clean, type-safe, testable code with strict linting, CI/CD safety nets, and clear documentation.",
        iconName: "Code2"
      },
      {
        name: "Product Empathy & UX Sensitivity",
        description: "Caring about layout shift, accessibility, optimistic UI updates, and sub-second user interactions.",
        iconName: "HeartHandshake"
      },
      {
        name: "Debugging & Observability Instinct",
        description: "Pinpointing memory leaks, network waterfalls, and database bottlenecks using profilers and logs.",
        iconName: "Bug"
      }
    ],
    techStack: [
      { name: "TypeScript", category: "Languages", level: "Beginner", importance: "Essential", description: "Strict typing, generics, interfaces, union types, and utility types." },
      { name: "React.js & Next.js", category: "Frontend", level: "Beginner", importance: "Essential", description: "React 18/19, App Router, Server Components, suspense, and state hooks." },
      { name: "Tailwind CSS", category: "Styling & UI", level: "Beginner", importance: "Essential", description: "Utility-first design, fluid responsive layouts, dark mode, animations." },
      { name: "Node.js & Express / NestJS", category: "Backend Runtime", level: "Intermediate", importance: "Essential", description: "Event loop, streams, middleware, RESTful API design, authentication." },
      { name: "PostgreSQL & Prisma / Drizzle", category: "Databases", level: "Intermediate", importance: "Essential", description: "Schema migrations, relational integrity, indexing, connection pooling." },
      { name: "Git & GitHub Actions CI/CD", category: "DevOps", level: "Intermediate", importance: "Essential", description: "Branching strategies, automated testing, pull request workflows." },
      { name: "Redis Caching & BullMQ", category: "Distributed Systems", level: "Advanced", importance: "Highly Valued", description: "In-memory caching, pub/sub, rate limiting, and background worker queues." },
      { name: "Docker & Container Architecture", category: "DevOps", level: "Advanced", importance: "Highly Valued", description: "Multi-stage Dockerfiles, Docker Compose, image size optimization." },
      { name: "System Design & Distributed Data", category: "Architecture", level: "Advanced", importance: "Essential for Senior", description: "Sharding, read replicas, CAP theorem, event-driven architecture, WebSockets." },
      { name: "GraphQL & tRPC", category: "API Paradigms", level: "Advanced", importance: "Bonus", description: "End-to-end type safety, schema stitching, reduced over-fetching." }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        phaseName: "Modern TypeScript & Frontend Engineering",
        durationWeeks: "Weeks 1 - 4",
        objective: "Master modern TypeScript and responsive component architecture with React and Next.js.",
        keyMilestones: [
          "Advanced TypeScript: generic functions, type narrowing, discriminated unions",
          "Next.js App Router: Server Components vs Client Components, nested layouts",
          "Accessible UI design system with Tailwind CSS and Framer Motion"
        ],
        recommendedProjects: [
          "Interactive SaaS Dashboard with Server-Rendered Charts and Filters",
          "Component Library published with Storybook & TypeDoc"
        ]
      },
      {
        phaseNumber: 2,
        phaseName: "Backend Architecture & Database Mastery",
        durationWeeks: "Weeks 5 - 8",
        objective: "Design scalable REST & GraphQL APIs backed by robust relational databases.",
        keyMilestones: [
          "PostgreSQL schema modeling: foreign keys, composite indexes, query EXPLAIN",
          "Secure authentication with OAuth, JWT, HTTP-only cookies, and session rotation",
          "Automated schema migrations and type generation with Prisma or Drizzle ORM"
        ],
        recommendedProjects: [
          "Multi-Tenant Collaborative Workspace API with Role-Based Access Control (RBAC)",
          "E-Commerce Payment Checkout Webhook Engine with Stripe Integration"
        ]
      },
      {
        phaseNumber: 3,
        phaseName: "Real-Time Systems, Caching & Performance",
        durationWeeks: "Weeks 9 - 12",
        objective: "Scale applications to handle concurrent real-time events and high-throughput traffic.",
        keyMilestones: [
          "Real-time bidirectional communication with WebSockets or Server-Sent Events",
          "Redis caching strategies (cache-aside, write-through) and API rate limiting",
          "Background task processing with distributed worker queues (BullMQ/Kafka)"
        ],
        recommendedProjects: [
          "Real-Time Collaborative Document Canvas (like Figma or Notion) with WebSockets",
          "High-Throughput Notification Dispatch Service with Redis Queue"
        ]
      },
      {
        phaseNumber: 4,
        phaseName: "Cloud Deployment, CI/CD & System Design",
        durationWeeks: "Weeks 13 - 16",
        objective: "Package, deploy, and monitor containerized full-stack applications in the cloud.",
        keyMilestones: [
          "Containerization with multi-stage Docker builds and automated CI/CD pipelines",
          "Deployment on Vercel, AWS ECS, or Fly.io with custom domains and SSL",
          "System design mastery: microservices vs monolith, load balancing, database sharding"
        ],
        recommendedProjects: [
          "Production Cloud-Native SaaS Platform deployed with Automated GitHub Actions",
          "Comprehensive System Design Whitepaper for a Distributed Video Streaming Service"
        ]
      }
    ]
  },

  "product-manager": {
    id: "product-manager",
    title: "Product Manager (Technical PM)",
    category: "Product & Design",
    overview:
      "Product Managers define the 'Why', 'What', and 'When' of a product that engineering and design teams build. Technical PMs specifically excel at bridging deep engineering complexities with customer needs, commercial goals, and competitive strategy.",
    averageSalaryUsd: "$125,000 - $185,000/yr",
    growthRate: "+21% (High demand across all tech tiers)",
    openRolesCount: "75,000+ active openings worldwide",
    seniorityLevels: [
      { level: "Associate PM (APM)", yearsExp: "0 - 2 yrs", avgPay: "$85,000 - $110,000" },
      { level: "Product Manager", yearsExp: "2 - 5 yrs", avgPay: "$120,000 - $155,000" },
      { level: "Senior Product Manager", yearsExp: "5 - 8 yrs", avgPay: "$160,000 - $215,000" },
      { level: "Group PM / VP of Product", yearsExp: "8+ yrs", avgPay: "$220,000 - $350,000+" }
    ],
    coreQualities: [
      {
        name: "Obsessive Customer Empathy",
        description: "Listening deeply to uncover hidden user pain points rather than simply accepting surface feature requests.",
        iconName: "Users"
      },
      {
        name: "Ruthless Prioritization",
        description: "Saying 'No' to 9 out of 10 good ideas to focus finite engineering firepower on the single 10x opportunity.",
        iconName: "Target"
      },
      {
        name: "Influence Without Authority",
        description: "Rallying diverse teams of engineers, designers, sales, and executives toward a unified product north star.",
        iconName: "Flame"
      },
      {
        name: "Metric-Driven Decision Making",
        description: "Balancing qualitative user intuition with hard quantitative cohort, churn, and conversion analytics.",
        iconName: "LineChart"
      }
    ],
    techStack: [
      { name: "Agile / Scrum / Kanban", category: "Methodology", level: "Beginner", importance: "Essential", description: "Sprint rituals, story points, backlog refinement, and velocity tracking." },
      { name: "Jira, Linear & Notion", category: "Project Management", level: "Beginner", importance: "Essential", description: "Issue tracking, roadmapping, documentation, and dependency management." },
      { name: "Figma (Wireframing & FigJam)", category: "Design Tools", level: "Beginner", importance: "Essential", description: "Low-fidelity wireframing, user flows, and interactive whiteboard brainstorming." },
      { name: "SQL for Product Analytics", category: "Data Fluency", level: "Intermediate", importance: "Highly Valued", description: "Querying production event tables to pull retention, funnel drops, and cohorts." },
      { name: "Product Analytics (Mixpanel / PostHog / Amplitude)", category: "Analytics Tools", level: "Intermediate", importance: "Essential", description: "Funnel analysis, user retention cohorts, feature adoption heatmaps." },
      { name: "PRD (Product Requirement Document) Crafting", category: "Execution", level: "Intermediate", importance: "Essential", description: "Writing unambiguous user stories, acceptance criteria, edge cases, and scope bounds." },
      { name: "A/B Testing & Feature Flagging (LaunchDarkly)", category: "Experimentation", level: "Intermediate", importance: "Highly Valued", description: "Phased rollouts, statistical sample sizes, guardrail metrics, and kill switches." },
      { name: "API & System Architecture Fundamentals", category: "Technical Fluency", level: "Advanced", importance: "Essential for TPM", description: "REST vs GraphQL, webhooks, latency trade-offs, microservice boundaries." },
      { name: "Financial Modeling & Unit Economics", category: "Business Strategy", level: "Advanced", importance: "Highly Valued", description: "CAC, LTV, payback periods, gross margins, and pricing tier design." },
      { name: "AI Product Architecture", category: "Emerging Tech", level: "Advanced", importance: "Bonus", description: "Prompt engineering, evaluation benchmarks, token cost modeling, and latency SLAs." }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        phaseName: "Product Discovery & User Research",
        durationWeeks: "Weeks 1 - 4",
        objective: "Master the art of uncovering genuine user problems through structured qualitative discovery.",
        keyMilestones: [
          "Conduct 10+ structured customer discovery interviews using 'The Mom Test' methodology",
          "Map out Customer Journey Maps and identify friction touchpoints",
          "Formulate clear Problem Statements and Product Opportunity Hypotheses"
        ],
        recommendedProjects: [
          "Zero-to-One Product Discovery Report on a Broken Everyday Workflow",
          "Interactive Figma Prototype solving the identified user problem"
        ]
      },
      {
        phaseNumber: 2,
        phaseName: "PRDs, Specifications & Agile Execution",
        durationWeeks: "Weeks 5 - 8",
        objective: "Translate product vision into crystal-clear engineering specifications and manage sprint execution.",
        keyMilestones: [
          "Write 3 comprehensive Product Requirement Documents (PRDs) with user stories",
          "Prioritize feature backlogs using RICE (Reach, Impact, Confidence, Effort) framework",
          "Simulate 2-week Sprint planning, standups, and retrospective rituals in Linear"
        ],
        recommendedProjects: [
          "Complete PRD for a New B2B SaaS Collaboration Feature with Edge Cases",
          "Linear Workspace Setup with Tagged Epics, Sprints, and Acceptance Criteria"
        ]
      },
      {
        phaseNumber: 3,
        phaseName: "Product Analytics, Metrics & Growth Loops",
        durationWeeks: "Weeks 9 - 12",
        objective: "Define North Star metrics, build analytics funnels, and test growth hypotheses.",
        keyMilestones: [
          "Set up event tracking taxonomy in Mixpanel / PostHog",
          "Analyze onboarding funnel drop-offs and design A/B test experiments",
          "Calculate unit economics (CAC, LTV, Net Revenue Retention) for SaaS models"
        ],
        recommendedProjects: [
          "Product Analytics Teardown & Growth Audit of a Top Mobile/Web App",
          "A/B Testing Experiment Brief with Hypothesis, Power Analysis, and Guardrails"
        ]
      },
      {
        phaseNumber: 4,
        phaseName: "Technical Fluency & Senior PM Strategy",
        durationWeeks: "Weeks 13 - 16",
        objective: "Master technical system trade-offs and communicate with engineering leadership effortlessly.",
        keyMilestones: [
          "Understand API lifecycles, webhooks, database constraints, and caching",
          "Develop a 12-month Strategic Product Vision & Outcome-Based Roadmap",
          "Prepare for PM interview loops: Product Sense, Analytical Execution, and Leadership"
        ],
        recommendedProjects: [
          "12-Month Product Strategy & Execution Roadmap Deck for an AI-Native App",
          "Mock PM Interview Case Study: 'How would you redesign Spotify for Podcasts?'"
        ]
      }
    ]
  },

  "cybersecurity-analyst": {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "Cyber & Cloud",
    overview:
      "Cybersecurity Analysts monitor, detect, analyze, and respond to security threats across networks, endpoints, and cloud infrastructure. They defend critical business infrastructure from malware, ransomware, unauthorized breaches, and advanced persistent threats (APTs).",
    averageSalaryUsd: "$102,000 - $155,000/yr",
    growthRate: "+32% (Massive critical shortage worldwide)",
    openRolesCount: "110,000+ active openings worldwide",
    seniorityLevels: [
      { level: "SOC Analyst Tier 1", yearsExp: "0 - 2 yrs", avgPay: "$68,000 - $85,000" },
      { level: "Security Analyst Tier 2 / Incident Responder", yearsExp: "2 - 5 yrs", avgPay: "$95,000 - $130,000" },
      { level: "Senior Security Engineer / Threat Hunter", yearsExp: "5 - 8 yrs", avgPay: "$135,000 - $180,000" },
      { level: "Principal Security Architect / CISO", yearsExp: "8+ yrs", avgPay: "$190,000 - $275,000+" }
    ],
    coreQualities: [
      { name: "Adversarial Thinking", description: "Thinking like an attacker to anticipate vulnerability chains before adversaries can exploit them.", iconName: "Skull" },
      { name: "Calm Under Crisis", description: "Systematic, methodic triage during active ransomware or zero-day incident response.", iconName: "AlertTriangle" },
      { name: "Forensic Attention to Detail", description: "Analyzing log artifacts, packet captures, and memory dumps for stealthy indicators of compromise (IoCs).", iconName: "Search" },
      { name: "Security Culture Advocacy", description: "Educating cross-functional employees without creating friction that slows business momentum.", iconName: "Shield" }
    ],
    techStack: [
      { name: "Computer Networking (TCP/IP, DNS, OSI Model)", category: "Networking", level: "Beginner", importance: "Essential", description: "Subnetting, packet routing, TLS/SSL handshakes, firewall rules." },
      { name: "Linux OS & Bash Shell", category: "Operating Systems", level: "Beginner", importance: "Essential", description: "Permissions, systemd services, syslog, file integrity, process monitoring." },
      { name: "Network Packet Analysis (Wireshark)", category: "Inspection", level: "Beginner", importance: "Essential", description: "Capturing and dissecting PCAPs, identifying suspicious HTTP/DNS beacons." },
      { name: "SIEM & Log Aggregation (Splunk / Elastic / Sentinel)", category: "Detection", level: "Intermediate", importance: "Essential", description: "Writing detection rules, query SPL/KQL, correlation searches, alert triage." },
      { name: "Endpoint Detection & Response (EDR - CrowdStrike, Defender)", category: "Defense", level: "Intermediate", importance: "Essential", description: "Process trees, memory injection detection, host isolation, threat containment." },
      { name: "Python / PowerShell Scripting for SecOps", category: "Automation", level: "Intermediate", importance: "Highly Valued", description: "Automating OSINT lookups, parsing log JSONs, triggering webhook alerts." },
      { name: "Vulnerability Management & Scanning (Nessus, Qualys)", category: "Hygiene", level: "Intermediate", importance: "Highly Valued", description: "CVE scoring, patch management prioritization, misconfiguration detection." },
      { name: "Cloud Security (AWS IAM, GuardDuty, CloudTrail)", category: "Cloud Defense", level: "Advanced", importance: "Essential in 2026", description: "Securing S3 buckets, least privilege IAM policies, cloud detection." },
      { name: "MITRE ATT&CK Framework Mapping", category: "Threat Intelligence", level: "Advanced", importance: "Essential", description: "Categorizing adversary tactics, techniques, and procedures (TTPs)." },
      { name: "Incident Response Playbooks & Forensics (Autopsy, Volatility)", category: "Forensics", level: "Advanced", importance: "Highly Valued", description: "Evidence collection, chain of custody, memory dumping, root-cause analysis." }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        phaseName: "Networking Protocols & Linux Hardening",
        durationWeeks: "Weeks 1 - 4",
        objective: "Master deep networking protocols and Linux system internals to spot abnormalities.",
        keyMilestones: [
          "Dissect TCP/IP, UDP, DNS, and TLS handshakes using Wireshark captures",
          "Master Linux terminal administration and security auditing (auditd)",
          "Earn CompTIA Security+ or Google Cybersecurity Certificate foundations"
        ],
        recommendedProjects: [
          "Wireshark Malicious Traffic Analysis Challenge Writeup",
          "Hardened Debian Server Setup with UFW, SSH Key Authentication & Fail2Ban"
        ]
      },
      {
        phaseNumber: 2,
        phaseName: "SIEM, SOC Operations & Alert Triage",
        durationWeeks: "Weeks 5 - 8",
        objective: "Configure and query enterprise SIEM tools to detect brute-force and credential-stuffing attacks.",
        keyMilestones: [
          "Set up a home lab SIEM with Elastic Stack or Splunk Free",
          "Ingest Windows Event Logs (Sysmon) and Linux authentication logs",
          "Write 5 custom detection rules mapped to MITRE ATT&CK techniques"
        ],
        recommendedProjects: [
          "SOC Analyst Home Lab: Ingesting Sysmon Logs into Splunk to Detect Mimikatz",
          "Automated Threat Intelligence Enrichment Script with VirusTotal API"
        ]
      },
      {
        phaseNumber: 3,
        phaseName: "Incident Response, EDR & Memory Forensics",
        durationWeeks: "Weeks 9 - 12",
        objective: "Execute systematic incident response workflows to contain and analyze malware attacks.",
        keyMilestones: [
          "Conduct memory forensics using Volatility to find injected malicious DLLs",
          "Draft step-by-step incident response playbooks for Ransomware & Phishing",
          "Participate in Blue Team CTFs (CyberDefenders, LetsDefend, TryHackMe)"
        ],
        recommendedProjects: [
          "End-to-End Incident Response Post-Mortem Report for a Simulated Ransomware Outbreak",
          "Malware Memory Dump Forensics Analysis using Volatility 3"
        ]
      },
      {
        phaseNumber: 4,
        phaseName: "Cloud Security, Threat Hunting & Certification",
        durationWeeks: "Weeks 13 - 16",
        objective: "Secure modern cloud environments and prepare for tier-1 security analyst interview loops.",
        keyMilestones: [
          "Audit AWS/GCP IAM permissions and inspect CloudTrail logs for privilege escalation",
          "Proactive threat hunting for living-off-the-land binaries (LOLBins)",
          "Complete hands-on certification (BTL1 or CySA+) and mock technical interviews"
        ],
        recommendedProjects: [
          "Cloud Security Posture Assessment Report for an AWS Architecture",
          "Public GitHub Security Portfolio with 4 Detailed Incident Investigation Case Studies"
        ]
      }
    ]
  }
};
