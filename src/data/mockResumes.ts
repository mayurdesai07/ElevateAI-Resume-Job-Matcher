import { ResumeProfile } from "@/types";

export const SAMPLE_RESUMES: Record<string, ResumeProfile> = {
  alex_data_analyst: {
    name: "Alex Rivera",
    title: "Mid-Level Data Analyst",
    email: "alex.rivera@example.com",
    summary:
      "Results-driven Data Analyst with 3.5+ years of experience transforming raw enterprise datasets into actionable executive insights. Proficient in SQL querying, Python data modeling (Pandas, NumPy), Excel automation, and building interactive business intelligence dashboards in Tableau & Power BI. Track record of improving marketing ROI by 24% and streamlining operational ETL pipelines.",
    technicalSkills: [
      "SQL",
      "Python",
      "Pandas",
      "NumPy",
      "Data Modeling",
      "ETL Pipelines",
      "Statistical Analysis",
      "A/B Testing",
      "Data Cleaning",
      "Relational Databases",
      "PostgreSQL"
    ],
    softSkills: [
      "Executive Storytelling",
      "Cross-functional Collaboration",
      "Problem Solving",
      "Business Acumen",
      "Data Translation"
    ],
    toolsAndSoftware: [
      "Tableau",
      "Power BI",
      "Microsoft Excel (Advanced/VBA)",
      "Git",
      "Jupyter Notebooks",
      "Google Analytics 4",
      "dbt",
      "Postman"
    ],
    experienceLevel: "Mid",
    yearsOfExperience: 3.5,
    education: "B.S. in Information Systems & Statistics, University of Washington",
    keyStrengths: [
      "Complex SQL window functions & query optimization",
      "Automated automated reporting saving 15 engineering hours weekly",
      "High executive dashboard adoption across 4 global regions"
    ],
    targetRoles: ["Senior Data Analyst", "Analytics Engineer", "Data Scientist", "BI Lead"],
    rawText: `ALEX RIVERA — Mid-Level Data Analyst
alex.rivera@example.com | Seattle, WA | linkedin.com/in/alexrivera-data

PROFESSIONAL SUMMARY
Data Analyst with 3.5+ years of experience utilizing SQL, Python, Excel, and Tableau to translate complex datasets into strategic executive decisions. Proven success optimizing marketing spend by $1.2M and developing automated ETL pipelines.

CORE COMPETENCIES
• Technical Skills: SQL (PostgreSQL, MySQL), Python (Pandas, NumPy), Data Modeling, Statistical Analysis, A/B Testing, ETL.
• Tools & BI: Tableau, Power BI, Advanced Excel (Macros, Power Query), Git, Jupyter, dbt.
• Soft Skills: Cross-functional leadership, Data storytelling, Stakeholder management.

PROFESSIONAL EXPERIENCE
Data Analyst | NexaTech Analytics | 2022 – Present
- Designed 12+ executive Tableau dashboards tracking $45M ARR and churn retention rates.
- Wrote and optimized complex SQL queries across 10M+ rows, reducing report latency by 38%.
- Conducted 25+ product A/B tests analyzing user funnel drops to enhance checkout conversion by 14%.

Associate Data Analyst | CloudCore Systems | 2020 – 2022
- Maintained automated daily ETL jobs using Python and PostgreSQL.
- Partnered with product managers to deliver weekly KPI reporting in Power BI.
- Cleaned and normalized messy customer interaction datasets.

EDUCATION
B.S. in Information Systems & Statistics, University of Washington`
  },

  sarah_fullstack_dev: {
    name: "Sarah Chen",
    title: "Full-Stack Software Engineer",
    email: "sarah.chen@example.com",
    summary:
      "Full-Stack Engineer with 3 years building scalable, responsive web applications using TypeScript, React, Next.js, and Node.js. Passionate about performant UI architecture, clean RESTful and GraphQL APIs, and robust database design with PostgreSQL. Looking to bridge into Cloud Architecture and DevOps.",
    technicalSkills: [
      "TypeScript",
      "JavaScript (ES6+)",
      "React.js",
      "Next.js",
      "Node.js",
      "Express",
      "PostgreSQL",
      "REST APIs",
      "HTML5/CSS3",
      "Tailwind CSS",
      "Git",
      "Unit Testing (Jest)"
    ],
    softSkills: [
      "Agile/Scrum Practices",
      "Code Reviews",
      "Product-Driven Mindset",
      "Technical Documentation"
    ],
    toolsAndSoftware: [
      "VS Code",
      "Postman",
      "Docker (Basics)",
      "GitHub Actions",
      "Prisma ORM",
      "Figma",
      "Vercel"
    ],
    experienceLevel: "Mid",
    yearsOfExperience: 3,
    education: "B.S. in Computer Science, UC Davis",
    keyStrengths: [
      "Component architecture with Next.js & Server Components",
      "High-speed API route execution and PostgreSQL database schema design",
      "Clean UI delivery with pixel-perfect responsive Tailwind styling"
    ],
    targetRoles: ["Senior Full-Stack Engineer", "Frontend Architect", "Cloud Software Engineer"],
    rawText: `SARAH CHEN — Full-Stack Software Engineer
sarah.chen@example.com | San Francisco, CA | github.com/sarahchen-dev

SUMMARY
Software Engineer with 3 years of production experience in TypeScript, React, Next.js, and Node.js. Built high-traffic web applications handling 250k+ monthly active users.

SKILLS
- Languages & Frameworks: TypeScript, JavaScript, React, Next.js, Node.js, Express, Tailwind CSS, HTML/CSS.
- Databases & Tools: PostgreSQL, Prisma, Jest, Git, Docker, Postman, Vercel, Supabase.

EXPERIENCE
Full-Stack Engineer | Horizon Web Studios | 2022 – Present
- Architected responsive customer-facing portals using Next.js 14 and TypeScript.
- Implemented secure JWT and OAuth authentication flows backed by PostgreSQL.
- Reduced initial bundle load times by 42% via code-splitting and dynamic imports.

Junior Developer | FinStack Solutions | 2021 – 2022
- Developed reusable UI design system components with Tailwind CSS.
- Built internal REST endpoints using Express and Prisma ORM.

EDUCATION
B.S. in Computer Science, University of California, Davis`
  },

  marcus_junior_ai: {
    name: "Marcus Vance",
    title: "Junior Python & Machine Learning Specialist",
    email: "marcus.vance@example.com",
    summary:
      "Aspiring AI/ML Engineer with strong mathematical foundations and 1.5 years of practical experience building Python machine learning prototypes. Hands-on with Scikit-learn, PyTorch fundamentals, data preprocessing, and exploratory data analysis. Eager to master production MLOps and LLM engineering.",
    technicalSkills: [
      "Python",
      "PyTorch (Fundamentals)",
      "Scikit-learn",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Linear Algebra",
      "Probability & Statistics",
      "Machine Learning Algorithms",
      "SQL (Foundational)"
    ],
    softSkills: [
      "Continuous Learner",
      "Analytical Rigor",
      "Research Synthesis",
      "Team Player"
    ],
    toolsAndSoftware: [
      "Jupyter Lab",
      "Google Colab",
      "Git / GitHub",
      "Conda",
      "Hugging Face (Basics)",
      "Weights & Biases"
    ],
    experienceLevel: "Entry",
    yearsOfExperience: 1.5,
    education: "B.S. in Applied Mathematics & Data Science, University of Michigan",
    keyStrengths: [
      "Mathematical modeling & supervised classification/regression algorithms",
      "Clean Python code and data manipulation",
      "Fast learner of cutting-edge open-source AI frameworks"
    ],
    targetRoles: ["Machine Learning Engineer", "Junior AI Engineer", "Data Scientist"],
    rawText: `MARCUS VANCE — Junior AI & Python Engineer
marcus.vance@example.com | Ann Arbor, MI | linkedin.com/in/marcusvance

SUMMARY
Junior AI specialist with 1.5 years experience programming in Python and implementing predictive models using Scikit-Learn and PyTorch.

TECHNICAL SKILLS
Python, Scikit-learn, PyTorch, NumPy, Pandas, Matplotlib, SQL, Git, Linux, Jupyter, Hugging Face.

PROJECTS & EXPERIENCE
Junior AI Research Assistant | DataLab UM | 2023 – Present
- Implemented feature extraction pipelines across 500k tabular records.
- Fine-tuned small transformer models on Hugging Face for sentiment classification (92% accuracy).
- Built clustering algorithms for customer segmentation.

EDUCATION
B.S. Applied Mathematics & Data Science, University of Michigan`
  },

  elena_product_ops: {
    name: "Elena Rostova",
    title: "Associate Product Manager / Product Ops",
    email: "elena.rostova@example.com",
    summary:
      "Product professional with 2.5 years of experience bridging engineering, UX, and business teams. Expert in customer journey mapping, backlog grooming in Jira, conducting qualitative user interviews, and defining MVP scopes. Looking to transition into Technical Product Management.",
    technicalSkills: [
      "Product Strategy",
      "Agile / Scrum Methodologies",
      "User Journey Mapping",
      "Requirements Gathering",
      "PRD Writing",
      "Feature Prioritization (RICE/MoSCoW)",
      "SQL (Basic queries)",
      "A/B Testing Concepts"
    ],
    softSkills: [
      "Stakeholder Communication",
      "Empathetic User Research",
      "Conflict Resolution",
      "Strategic Vision"
    ],
    toolsAndSoftware: [
      "Jira",
      "Confluence",
      "Figma (Wireframing)",
      "Miro",
      "Notion",
      "Mixpanel",
      "Linear",
      "Slack"
    ],
    experienceLevel: "Mid",
    yearsOfExperience: 2.5,
    education: "B.A. in Business Administration & Human-Computer Interaction, NYU",
    keyStrengths: [
      "Cross-functional sprint coordination across 8-person engineering squads",
      "Actionable PRDs that reduce scope creep by 30%",
      "Data-informed feature prioritization using Mixpanel and user feedback"
    ],
    targetRoles: ["Product Manager", "Technical Product Manager", "Senior Product Ops"],
    rawText: `ELENA ROSTOVA — Associate Product Manager
elena.rostova@example.com | New York, NY | linkedin.com/in/elenarostova-pm

SUMMARY
Associate Product Manager with 2.5 years managing SaaS feature roadmaps, writing detailed PRDs, and collaborating with cross-functional dev teams.

EXPERIENCE
Associate Product Manager | Nexus SaaS | 2022 – Present
- Led discovery and execution of the customer onboarding revamp, increasing 14-day retention by 18%.
- Authored 30+ comprehensive PRDs with acceptance criteria in Jira.
- Ran weekly sprint rituals and backlog prioritization.

EDUCATION
B.A. Business Administration & HCI, New York University`
  }
};
