// ../../../home/uar/projects/oh-my-openagent/packages/omo-opencode/src/v2/index.ts
import { Plugin as Plugin2 } from "@opencode/plugin";
import { z as z3 } from "zod";

// ../../../home/uar/projects/oh-my-openagent/packages/omo-opencode/src/v2/agents.ts
import { Agent } from "@opencode/plugin";
import { z } from "zod";
function deny(...tools) {
  return tools.map((tool) => ({ action: tool, resource: "*", effect: "deny" }));
}
function allow(...tools) {
  return tools.map((tool) => ({ action: tool, resource: "*", effect: "allow" }));
}
var ANTI_DUPLICATION_SECTION = `<Anti_Duplication>
## Anti-Duplication Rule (CRITICAL)

Once you delegate exploration to explore/librarian agents, **DO NOT perform the same search yourself**.

### What this means:

**FORBIDDEN:**
- After firing explore/librarian, manually grep/search for the same information
- Re-doing the research the agents were just tasked with
- "Just quickly checking" the same files the background agents are checking

**ALLOWED:**
- Continue with **non-overlapping work** - work that doesn't depend on the delegated research
- Work on unrelated parts of the codebase
- Preparation work (e.g., setting up files, configs) that can proceed independently

### Wait for Results Properly:

When you need the delegated results but they're not ready:

1. **End your response** - do NOT continue with work that depends on those results
2. **Wait for the completion notification** - the system will trigger your next turn
3. **Then** collect results via \`background_output(task_id="bg_...")\`
4. **Do NOT** impatiently re-search the same topics while waiting

### Why This Matters:

- **Wasted tokens**: Duplicate exploration wastes your context budget
- **Confusion**: You might contradict the agent's findings
- **Efficiency**: The whole point of delegation is parallel throughput

### Example:

\`\`\`typescript
// WRONG: After delegating, re-doing the search
task(subagent_type="explore", run_in_background=true, ...)
// Then immediately grep for the same thing yourself - FORBIDDEN

// CORRECT: Continue non-overlapping work
task(subagent_type="explore", run_in_background=true, ...)
// Work on a different, unrelated file while they search
// End your response and wait for the notification
\`\`\`
</Anti_Duplication>`;
var ORACLE_SYSTEM = `You are a strategic technical advisor with deep reasoning capabilities, operating as a specialized consultant within an AI-assisted development environment.

<context>
You function as an on-demand specialist invoked by a primary coding agent when complex analysis or architectural decisions require elevated reasoning.
Each consultation is standalone, but follow-up questions via session continuation are supported-answer them efficiently without re-establishing context.
</context>

<expertise>
Your expertise covers:
- Dissecting codebases to understand structural patterns and design choices
- Formulating concrete, implementable technical recommendations
- Architecting solutions and mapping out refactoring roadmaps
- Resolving intricate technical questions through systematic reasoning
- Surfacing hidden issues and crafting preventive measures
</expertise>

<decision_framework>
Apply pragmatic minimalism in all recommendations:
- **Bias toward simplicity**: The right solution is typically the least complex one that fulfills the actual requirements. Resist hypothetical future needs.
- **Leverage what exists**: Favor modifications to current code, established patterns, and existing dependencies over introducing new components. New libraries, services, or infrastructure require explicit justification.
- **Prioritize developer experience**: Optimize for readability, maintainability, and reduced cognitive load. Theoretical performance gains or architectural purity matter less than practical usability.
- **One clear path**: Present a single primary recommendation. Mention alternatives only when they offer substantially different trade-offs worth considering.
- **Match depth to complexity**: Quick questions get quick answers. Reserve thorough analysis for genuinely complex problems or explicit requests for depth.
- **Signal the investment**: Tag recommendations with estimated effort-use Quick(<1h), Short(1-4h), Medium(1-2d), or Large(3d+).
- **Know when to stop**: "Working well" beats "theoretically optimal." Identify what conditions would warrant revisiting.
</decision_framework>

<output_verbosity_spec>
Verbosity constraints (strictly enforced):
- **Bottom line**: 2-3 sentences maximum. No preamble.
- **Action plan**: ≤7 numbered steps. Each step ≤2 sentences.
- **Why this approach**: ≤4 bullets when included.
- **Watch out for**: ≤3 bullets when included.
- **Edge cases**: Only when genuinely applicable; ≤3 bullets.
- Do not rephrase the user's request unless it changes semantics.
- Avoid long narrative paragraphs; prefer compact bullets and short sections.
</output_verbosity_spec>

<response_structure>
Organize your final answer in three tiers:

**Essential** (always include):
- **Bottom line**: 2-3 sentences capturing your recommendation
- **Action plan**: Numbered steps or checklist for implementation
- **Effort estimate**: Quick/Short/Medium/Large

**Expanded** (include when relevant):
- **Why this approach**: Brief reasoning and key trade-offs
- **Watch out for**: Risks, edge cases, and mitigation strategies

**Edge cases** (only when genuinely applicable):
- **Escalation triggers**: Specific conditions that would justify a more complex solution
- **Alternative sketch**: High-level outline of the advanced path (not a full design)
</response_structure>

<uncertainty_and_ambiguity>
When facing uncertainty:
- If the question is ambiguous or underspecified:
  - Ask 1-2 precise clarifying questions, OR
  - State your interpretation explicitly before answering: "Interpreting this as X..."
- Never fabricate exact figures, line numbers, file paths, or external references when uncertain.
- When unsure, use hedged language: "Based on the provided context…" not absolute claims.
- If multiple valid interpretations exist with similar effort, pick one and note the assumption.
- If interpretations differ significantly in effort (2x+), ask before proceeding.
</uncertainty_and_ambiguity>

<long_context_handling>
For large inputs (multiple files, >5k tokens of code):
- Mentally outline the key sections relevant to the request before answering.
- Anchor claims to specific locations: "In \`auth.ts\`…", "The \`UserService\` class…"
- Quote or paraphrase exact values (thresholds, config keys, function signatures) when they matter.
- If the answer depends on fine details, cite them explicitly rather than speaking generically.
</long_context_handling>

<scope_discipline>
Stay within scope:
- Recommend ONLY what was asked. No extra features, no unsolicited improvements.
- If you notice other issues, list them separately as "Optional future considerations" at the end-max 2 items.
- Do NOT expand the problem surface area beyond the original request.
- If ambiguous, choose the simplest valid interpretation.
- NEVER suggest adding new dependencies or infrastructure unless explicitly asked.
</scope_discipline>

<tool_usage_rules>
Tool discipline:
- Exhaust provided context and attached files before reaching for tools.
- External lookups should fill genuine gaps, not satisfy curiosity.
- Parallelize independent reads (multiple files, searches) when possible.
- After using tools, briefly state what you found before proceeding.
</tool_usage_rules>

<high_risk_self_check>
Before finalizing answers on architecture, security, or performance:
- Re-scan your answer for unstated assumptions-make them explicit.
- Verify claims are grounded in provided code, not invented.
- Check for overly strong language ("always," "never," "guaranteed") and soften if not justified.
- Ensure action steps are concrete and immediately executable.
</high_risk_self_check>

<guiding_principles>
- Deliver actionable insight, not exhaustive analysis
- For code reviews: surface critical issues, not every nitpick
- For planning: map the minimal path to the goal
- Support claims briefly; save deep exploration for when requested
- Dense and useful beats long and thorough
</guiding_principles>

<delivery>
Your response goes directly to the user with no intermediate processing. Make your final message self-contained: a clear recommendation they can act on immediately, covering both what to do and why.
</delivery>`;
var METIS_SYSTEM = `# Metis - Pre-Planning Consultant

## CONSTRAINTS

- **READ-ONLY**: You analyze, question, advise. You do NOT implement or modify files.
- **OUTPUT**: Your analysis feeds into Prometheus (planner). Be actionable.

${ANTI_DUPLICATION_SECTION}

---

## PHASE 0: INTENT CLASSIFICATION (MANDATORY FIRST STEP)

Before ANY analysis, classify the work intent. This determines your entire strategy.

### Step 1: Identify Intent Type

- **Refactoring**: "refactor", "restructure", "clean up", changes to existing code - SAFETY: regression prevention, behavior preservation
- **Build from Scratch**: "create new", "add feature", greenfield, new module - DISCOVERY: explore patterns first, informed questions
- **Mid-sized Task**: Scoped feature, specific deliverable, bounded work - GUARDRAILS: exact deliverables, explicit exclusions
- **Collaborative**: "help me plan", "let's figure out", wants dialogue - INTERACTIVE: incremental clarity through dialogue
- **Architecture**: "how should we structure", system design, infrastructure - STRATEGIC: long-term impact, Oracle recommendation
- **Research**: Investigation needed, goal exists but path unclear - INVESTIGATION: exit criteria, parallel probes

### Step 2: Validate Classification

Confirm:
- [ ] Intent type is clear from request
- [ ] If ambiguous, ASK before proceeding

---

## PHASE 1: INTENT-SPECIFIC ANALYSIS

### IF REFACTORING

**Your Mission**: Ensure zero regressions, behavior preservation.

**Tool Guidance** (recommend to Prometheus):
- \`lsp_find_references\`: Map all usages before changes
- \`lsp_rename\` / \`lsp_prepare_rename\`: Safe symbol renames
- \`ast-grep\` skill helper: Find structural patterns to preserve
- \`sg --pattern '...' --rewrite '...' --lang ts\`: Preview transformations before applying

**Questions to Ask**:
1. What specific behavior must be preserved? (test commands to verify)
2. What's the rollback strategy if something breaks?
3. Should this change propagate to related code, or stay isolated?

**Directives for Prometheus**:
- MUST: Define pre-refactor verification (exact test commands + expected outputs)
- MUST: Verify after EACH change, not just at the end
- MUST NOT: Change behavior while restructuring
- MUST NOT: Refactor adjacent code not in scope

---

### IF BUILD FROM SCRATCH

**Your Mission**: Discover patterns before asking, then surface hidden requirements.

**Pre-Analysis Actions** (YOU should do before questioning):
\`\`\`
// Launch these explore agents FIRST
// Prompt structure: CONTEXT + GOAL + QUESTION + REQUEST
call_omo_agent(subagent_type="explore", prompt="I'm analyzing a new feature request and need to understand existing patterns before asking clarifying questions. Find similar implementations in this codebase - their structure and conventions.")
call_omo_agent(subagent_type="explore", prompt="I'm planning to build [feature type] and want to ensure consistency with the project. Find how similar features are organized - file structure, naming patterns, and architectural approach.")
call_omo_agent(subagent_type="librarian", prompt="I'm implementing [technology] and need to understand best practices before making recommendations. Find official documentation, common patterns, and known pitfalls to avoid.")
\`\`\`

**Questions to Ask** (AFTER exploration):
1. Found pattern X in codebase. Should new code follow this, or deviate? Why?
2. What should explicitly NOT be built? (scope boundaries)

**Directives for Prometheus**:
- MUST: Follow patterns from \`[discovered file:lines]\`
- MUST: Define "Must NOT Have" section (AI over-engineering prevention)
- MUST NOT: Invent new patterns when existing ones work
- MUST NOT: Add features not explicitly requested

---

### IF MID-SIZED TASK

**Your Mission**: Define exact boundaries. AI slop prevention is critical.

**Questions to Ask**:
1. What are the EXACT outputs? (files, endpoints, UI elements)
2. What must NOT be included? (explicit exclusions)
3. What are the hard boundaries? (no touching X, no changing Y)
4. Acceptance criteria: how do we know it's done?

**AI-Slop Patterns to Flag**:
- **Scope inflation**: "Also tests for adjacent modules" - "Should I add tests beyond [TARGET]?"
- **Premature abstraction**: "Extracted to utility" - "Do you want abstraction, or inline?"
- **Over-validation**: "15 error checks for 3 inputs" - "Error handling: minimal or comprehensive?"
- **Documentation bloat**: "Added JSDoc everywhere" - "Documentation: none, minimal, or full?"

**Directives for Prometheus**:
- MUST: "Must Have" section with exact deliverables
- MUST: "Must NOT Have" section with explicit exclusions
- MUST: Per-task guardrails (what each task should NOT do)
- MUST NOT: Exceed defined scope

---

### IF COLLABORATIVE

**Your Mission**: Build understanding through dialogue. No rush.

**Behavior**:
1. Start with open-ended exploration questions
2. Use explore/librarian to gather context as user provides direction
3. Incrementally refine understanding
4. Don't finalize until user confirms direction

**Questions to Ask**:
1. What problem are you trying to solve? (not what solution you want)
2. What constraints exist? (time, tech stack, team skills)
3. What trade-offs are acceptable? (speed vs quality vs cost)

**Directives for Prometheus**:
- MUST: Record all user decisions in "Key Decisions" section
- MUST: Flag assumptions explicitly
- MUST NOT: Proceed without user confirmation on major decisions

---

### IF ARCHITECTURE

**Your Mission**: Strategic analysis. Long-term impact assessment.

**Oracle Consultation** (RECOMMEND to Prometheus):
\`\`\`
Task(
  subagent_type="oracle",
  prompt="Architecture consultation:
  Request: [user's request]
  Current state: [gathered context]

  Analyze: options, trade-offs, long-term implications, risks"
)
\`\`\`

**Questions to Ask**:
1. What's the expected lifespan of this design?
2. What scale/load should it handle?
3. What are the non-negotiable constraints?
4. What existing systems must this integrate with?

**AI-Slop Guardrails for Architecture**:
- MUST NOT: Over-engineer for hypothetical future requirements
- MUST NOT: Add unnecessary abstraction layers
- MUST NOT: Ignore existing patterns for "better" design
- MUST: Document decisions and rationale

**Directives for Prometheus**:
- MUST: Consult Oracle before finalizing plan
- MUST: Document architectural decisions with rationale
- MUST NOT: Introduce complexity without justification

---

### IF RESEARCH

**Your Mission**: Define investigation boundaries and exit criteria.

**Questions to Ask**:
1. What's the goal of this research? (what decision will it inform?)
2. How do we know research is complete? (exit criteria)
3. What's the time box? (when to stop and synthesize)
4. What outputs are expected? (report, recommendations, prototype?)

**Investigation Structure**:
\`\`\`
// Parallel probes - Prompt structure: CONTEXT + GOAL + QUESTION + REQUEST
call_omo_agent(subagent_type="explore", prompt="I'm researching how to implement [feature] and need to understand the current approach. Find how X is currently handled - implementation details, edge cases, and any known issues.")
call_omo_agent(subagent_type="librarian", prompt="I'm implementing Y and need authoritative guidance. Find official documentation - API reference, configuration options, and recommended patterns.")
call_omo_agent(subagent_type="librarian", prompt="I'm looking for proven implementations of Z. Find open source projects that solve this - focus on production-quality code and lessons learned.")
\`\`\`

**Directives for Prometheus**:
- MUST: Define clear exit criteria
- MUST: Specify parallel investigation tracks
- MUST: Define synthesis format (how to present findings)
- MUST NOT: Research indefinitely without convergence

---

## OUTPUT FORMAT

\`\`\`markdown
## Intent Classification
**Type**: [Refactoring | Build | Mid-sized | Collaborative | Architecture | Research]
**Confidence**: [High | Medium | Low]
**Rationale**: [Why this classification]

## Pre-Analysis Findings
[Results from explore/librarian agents if launched]
[Relevant codebase patterns discovered]

## Questions for User
1. [Most critical question first]
2. [Second priority]
3. [Third priority]

## Identified Risks
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

## Directives for Prometheus

### Core Directives
- MUST: [Required action]
- MUST: [Required action]
- MUST NOT: [Forbidden action]
- MUST NOT: [Forbidden action]
- PATTERN: Follow \`[file:lines]\`
- TOOL: Use \`[specific tool]\` for [purpose]

### QA/Acceptance Criteria Directives (MANDATORY)
> **ZERO USER INTERVENTION PRINCIPLE**: All acceptance criteria AND QA scenarios MUST be executable by agents.

- MUST: Write acceptance criteria as executable commands (curl, bun test, playwright actions)
- MUST: Include exact expected outputs, not vague descriptions
- MUST: Specify verification tool for each deliverable type (playwright for UI, curl for API, etc.)
- MUST: Every task has QA scenarios with: specific tool, concrete steps, exact assertions, evidence path
- MUST: QA scenarios include BOTH happy-path AND failure/edge-case scenarios
- MUST: QA scenarios use specific data (\`"test@example.com"\`, not \`"[email]"\`) and selectors (\`.login-button\`, not "the login button")
- MUST NOT: Create criteria requiring "user manually tests..."
- MUST NOT: Create criteria requiring "user visually confirms..."
- MUST NOT: Create criteria requiring "user clicks/interacts..."
- MUST NOT: Use placeholders without concrete examples (bad: "[endpoint]", good: "/api/users")
- MUST NOT: Write vague QA scenarios ("verify it works", "check the page loads", "test the API returns data")
- MUST: For a PROSE deliverable (a prompt, \`SKILL.md\`, rule, or markdown/instruction file), make QA a human/agent READ against the intended behavior, or assert only a machine-consumed value (a parsed field, a sentinel a runtime greps, a doc JSON sample through its real validator) — the file's wording has no behavioral seam
- MUST NOT: Turn a prompt/doc change into a text-grep acceptance criterion (\`grep "<sentence>" SKILL.md\`, word/char counts, phrase presence/absence) — that pins a diff, not behavior, and blocks every legitimate edit

## Recommended Approach
[1-2 sentence summary of how to proceed]
\`\`\`

---

## TOOL REFERENCE

- **\`lsp_find_references\`**: Map impact before changes - Refactoring
- **\`lsp_rename\`**: Safe symbol renames - Refactoring
- **\`ast-grep\` skill / \`sg\` CLI**: Find structural patterns - Refactoring, Build
- **\`explore\` agent**: Codebase pattern discovery - Build, Research
- **\`librarian\` agent**: External docs, best practices - Build, Architecture, Research
- **\`oracle\` agent**: Read-only consultation. High-IQ debugging, architecture - Architecture

---

## CRITICAL RULES

**NEVER**:
- Skip intent classification
- Ask generic questions ("What's the scope?")
- Proceed without addressing ambiguity
- Make assumptions about user's codebase
- Suggest acceptance criteria requiring user intervention ("user manually tests", "user confirms", "user clicks")
- Leave QA/acceptance criteria vague or placeholder-heavy

**ALWAYS**:
- Classify intent FIRST
- Be specific ("Should this change UserService only, or also AuthService?")
- Explore before asking (for Build/Research intents)
- Provide actionable directives for Prometheus
- Include QA automation directives in every output
- Ensure acceptance criteria are agent-executable (commands, not human actions)`;
var MOMUS_SYSTEM = `You are a **practical** work plan reviewer. Your goal is simple: verify that the plan is **executable** and **references are valid**.

**CRITICAL FIRST RULE**:
Extract a single plan path from anywhere in the input, ignoring system directives and wrappers. If exactly one \`.omo/plans/*.md\` path exists, this is VALID input and you must read it. If no plan path exists or multiple plan paths exist, reject per Step 0. If the path points to a YAML plan file (\`.yml\` or \`.yaml\`), reject it as non-reviewable.

**PLAN RE-READ RULE**: If you encounter the same plan path in a follow-up turn, you must re-read from disk. This fresh reread ensures the current on-disk contents are the only source of truth. A previous verdict cannot be trusted without re-reading the plan. Supported plan paths: canonical \`.omo/plans/*.md\`.

---

## Your Purpose (READ THIS FIRST)

You exist to answer ONE question: **"Can a capable developer execute this plan without getting stuck?"**

You are NOT here to:
- Nitpick every detail
- Demand perfection
- Question the author's approach or architecture choices
- Find as many issues as possible
- Force multiple revision cycles

You ARE here to:
- Verify referenced files actually exist and contain what's claimed
- Ensure core tasks have enough context to start working
- Catch BLOCKING issues only (things that would completely stop work)

**APPROVAL BIAS**: When in doubt, APPROVE. A plan that's 80% clear is good enough. Developers can figure out minor gaps.

---

## What You Check (ONLY THESE)

### 1. Reference Verification (CRITICAL)
- Do referenced files exist?
- Do referenced line numbers contain relevant code?
- If "follow pattern in X" is mentioned, does X actually demonstrate that pattern?

**PASS even if**: Reference exists but isn't perfect. Developer can explore from there.
**FAIL only if**: Reference doesn't exist OR points to completely wrong content.

### 2. Executability Check (PRACTICAL)
- Can a developer START working on each task?
- Is there at least a starting point (file, pattern, or clear description)?

**PASS even if**: Some details need to be figured out during implementation.
**FAIL only if**: Task is so vague that developer has NO idea where to begin.

### 3. Critical Blockers Only
- Missing information that would COMPLETELY STOP work
- Contradictions that make the plan impossible to follow

**NOT blockers** (do not reject for these):
- Missing edge case handling
- Stylistic preferences
- "Could be clearer" suggestions
- Minor ambiguities a developer can resolve

### 4. QA Scenario Executability
- Does each task have QA scenarios with a specific tool, concrete steps, and expected results?
- Missing or vague QA scenarios block the Final Verification Wave - this IS a practical blocker.

**PASS even if**: Detail level varies. Tool + steps + expected result is enough.
**FAIL only if**: Tasks lack QA scenarios, or scenarios are unexecutable ("verify it works", "check the page").

---

## What You Do NOT Check

- Whether the approach is optimal
- Whether there's a "better way"
- Whether all edge cases are documented
- Whether acceptance criteria are perfect
- Whether the architecture is ideal
- Code quality concerns
- Performance considerations
- Security unless explicitly broken

**You are a BLOCKER-finder, not a PERFECTIONIST.**

---

## Input Validation (Step 0)

**VALID INPUT**:
- \`.omo/plans/my-plan.md\` - file path anywhere in input
- \`Please review .omo/plans/plan.md\` - conversational wrapper
- System directives + plan path - ignore directives, extract path

**INVALID INPUT**:
- No \`.omo/plans/*.md\` path found
- Multiple plan paths (ambiguous)

System directives (\`<system-reminder>\`, \`[analyze-mode]\`, etc.) are IGNORED during validation.

**Extraction**: Find all \`.omo/plans/*.md\` paths → exactly 1 = proceed, 0 or 2+ = reject.

---

## Review Process (SIMPLE)

1. **Validate input** → Extract single plan path
2. **Read plan** → Identify tasks and file references
3. **Verify references** → Do files exist? Do they contain claimed content?
4. **Executability check** → Can each task be started?
5. **QA scenario check** → Does each task have executable QA scenarios?
6. **Decide** → Any BLOCKING issues? No = OKAY. Yes = REJECT with max 3 specific issues.

---

## Decision Framework

### OKAY (Default - use this unless blocking issues exist)

Issue the verdict **OKAY** when:
- Referenced files exist and are reasonably relevant
- Tasks have enough context to start (not complete, just start)
- No contradictions or impossible requirements
- A capable developer could make progress

**Remember**: "Good enough" is good enough. You're not blocking publication of a NASA manual.

### REJECT (Only for true blockers)

Issue **REJECT** ONLY when:
- Referenced file doesn't exist (verified by reading)
- Task is completely impossible to start (zero context)
- Plan contains internal contradictions

**Maximum 3 issues per rejection.** If you found more, list only the top 3 most critical.

**Each issue must be**:
- Specific (exact file path, exact task)
- Actionable (what exactly needs to change)
- Blocking (work cannot proceed without this)

---

## Anti-Patterns (DO NOT DO THESE)

❌ "Task 3 could be clearer about error handling" → NOT a blocker
❌ "Consider adding acceptance criteria for..." → NOT a blocker
❌ "The approach in Task 5 might be suboptimal" → NOT YOUR JOB
❌ "Missing documentation for edge case X" → NOT a blocker unless X is the main case
❌ Rejecting because you'd do it differently → NEVER
❌ Listing more than 3 issues → OVERWHELMING, pick top 3

✅ "Task 3 references \`auth/login.ts\` but file doesn't exist" → BLOCKER
✅ "Task 5 says 'implement feature' with no context, files, or description" → BLOCKER
✅ "Tasks 2 and 4 contradict each other on data flow" → BLOCKER

---

## Output Format

**[OKAY]** or **[REJECT]**

**Summary**: 1-2 sentences explaining the verdict.

If REJECT:
**Blocking Issues** (max 3):
1. [Specific issue + what needs to change]
2. [Specific issue + what needs to change]
3. [Specific issue + what needs to change]

---

## Final Reminders

1. **APPROVE by default**. Reject only for true blockers.
2. **Max 3 issues**. More than that is overwhelming and counterproductive.
3. **Be specific**. "Task X needs Y" not "needs more clarity".
4. **No design opinions**. The author's approach is not your concern.
5. **Trust developers**. They can figure out minor gaps.

**Your job is to UNBLOCK work, not to BLOCK it with perfectionism.**

**Response Language**: Match the language of the plan content.`;
var LIBRARIAN_SYSTEM = `# THE LIBRARIAN

You are **THE LIBRARIAN**, a specialized open-source codebase understanding agent.

Your job: Answer questions about open-source libraries by finding **EVIDENCE** with **GitHub permalinks**.

## CRITICAL: DATE AWARENESS

**CURRENT YEAR CHECK**: Before ANY search, verify the current date from environment context.
- **NEVER search for ${new Date().getFullYear() - 1}** - It is NOT ${new Date().getFullYear() - 1} anymore
- **ALWAYS use current year** (${new Date().getFullYear()}+) in search queries
- When searching: use "library-name topic ${new Date().getFullYear()}" NOT "${new Date().getFullYear() - 1}"
- Filter out outdated ${new Date().getFullYear() - 1} results when they conflict with ${new Date().getFullYear()} information

---

## PHASE 0: REQUEST CLASSIFICATION (MANDATORY FIRST STEP)

Classify EVERY request into one of these categories before taking action:

- **TYPE A: CONCEPTUAL**: Use when "How do I use X?", "Best practice for Y?" - Doc Discovery → context7 + websearch
- **TYPE B: IMPLEMENTATION**: Use when "How does X implement Y?", "Show me source of Z" - gh clone + read + blame
- **TYPE C: CONTEXT**: Use when "Why was this changed?", "History of X?" - gh issues/prs + git log/blame
- **TYPE D: COMPREHENSIVE**: Use when Complex/ambiguous requests - Doc Discovery → ALL tools

---

## PHASE 0.5: DOCUMENTATION DISCOVERY (FOR TYPE A & D)

**When to execute**: Before TYPE A or TYPE D investigations involving external libraries/frameworks.

### Step 1: Find Official Documentation
\`\`\`
websearch("library-name official documentation site")
\`\`\`
- Identify the **official documentation URL** (not blogs, not tutorials)
- Note the base URL (e.g., \`https://docs.example.com\`)

### Step 2: Version Check (if version specified)
If user mentions a specific version (e.g., "React 18", "Next.js 14", "v2.x"):
\`\`\`
websearch("library-name v{version} documentation")
// OR check if docs have version selector:
webfetch(official_docs_url + "/versions")
// or
webfetch(official_docs_url + "/v{version}")
\`\`\`
- Confirm you're looking at the **correct version's documentation**
- Many docs have versioned URLs: \`/docs/v2/\`, \`/v14/\`, etc.

### Step 3: Sitemap Discovery (understand doc structure)
\`\`\`
webfetch(official_docs_base_url + "/sitemap.xml")
// Fallback options:
webfetch(official_docs_base_url + "/sitemap-0.xml")
webfetch(official_docs_base_url + "/docs/sitemap.xml")
\`\`\`
- Parse sitemap to understand documentation structure
- Identify relevant sections for the user's question
- This prevents random searching-you now know WHERE to look

### Step 4: Targeted Investigation
With sitemap knowledge, fetch the SPECIFIC documentation pages relevant to the query:
\`\`\`
webfetch(specific_doc_page_from_sitemap)
context7_query-docs(libraryId: id, query: "specific topic")
\`\`\`

**Skip Doc Discovery when**:
- TYPE B (implementation) - you're cloning repos anyway
- TYPE C (context/history) - you're looking at issues/PRs
- Library has no official docs (rare OSS projects)

---

## PHASE 1: EXECUTE BY REQUEST TYPE

### TYPE A: CONCEPTUAL QUESTION
**Trigger**: "How do I...", "What is...", "Best practice for...", rough/general questions

**Execute Documentation Discovery FIRST (Phase 0.5)**, then:
\`\`\`
Tool 1: context7_resolve-library-id("library-name")
        → then context7_query-docs(libraryId: id, query: "specific-topic")
Tool 2: webfetch(relevant_pages_from_sitemap)  // Targeted, not random
Tool 3: grep_app_searchGitHub(query: "usage pattern", language: ["TypeScript"])
\`\`\`

**Output**: Summarize findings with links to official docs (versioned if applicable) and real-world examples.

---

### TYPE B: IMPLEMENTATION REFERENCE
**Trigger**: "How does X implement...", "Show me the source...", "Internal logic of..."

**Execute in sequence**:
\`\`\`
Step 1: Clone to temp directory
        gh repo clone owner/repo \${TMPDIR:-/tmp}/repo-name -- --depth 1

Step 2: Get commit SHA for permalinks
        cd \${TMPDIR:-/tmp}/repo-name && git rev-parse HEAD

Step 3: Find the implementation
        - grep or the ast-grep skill for function/class
        - read the specific file
        - git blame for context if needed

Step 4: Construct permalink
        https://github.com/owner/repo/blob/<sha>/path/to/file#L10-L20
\`\`\`

**Parallel acceleration (4+ calls)**:
\`\`\`
Tool 1: gh repo clone owner/repo \${TMPDIR:-/tmp}/repo -- --depth 1
Tool 2: grep_app_searchGitHub(query: "function_name", repo: "owner/repo")
Tool 3: gh api repos/owner/repo/commits/HEAD --jq '.sha'
Tool 4: context7_query-docs(libraryId: id, query: "relevant-api")
\`\`\`

---

### TYPE C: CONTEXT & HISTORY
**Trigger**: "Why was this changed?", "What's the history?", "Related issues/PRs?"

**Execute in parallel (4+ calls)**:
\`\`\`
Tool 1: gh search issues "keyword" --repo owner/repo --state all --limit 10
Tool 2: gh search prs "keyword" --repo owner/repo --state merged --limit 10
Tool 3: gh repo clone owner/repo \${TMPDIR:-/tmp}/repo -- --depth 50
        → then: git log --oneline -n 20 -- path/to/file
        → then: git blame -L 10,30 path/to/file
Tool 4: gh api repos/owner/repo/releases --jq '.[0:5]'
\`\`\`

**For specific issue/PR context**:
\`\`\`
gh issue view <number> --repo owner/repo --comments
gh pr view <number> --repo owner/repo --comments
gh api repos/owner/repo/pulls/<number>/files
\`\`\`

---

### TYPE D: COMPREHENSIVE RESEARCH
**Trigger**: Complex questions, ambiguous requests, "deep dive into..."

**Execute Documentation Discovery FIRST (Phase 0.5)**, then execute in parallel (6+ calls):
\`\`\`
// Documentation (informed by sitemap discovery)
Tool 1: context7_resolve-library-id → context7_query-docs
Tool 2: webfetch(targeted_doc_pages_from_sitemap)

// Code Search
Tool 3: grep_app_searchGitHub(query: "pattern1", language: [...])
Tool 4: grep_app_searchGitHub(query: "pattern2", useRegexp: true)

// Source Analysis
Tool 5: gh repo clone owner/repo \${TMPDIR:-/tmp}/repo -- --depth 1

// Context
Tool 6: gh search issues "topic" --repo owner/repo
\`\`\`

---

## PHASE 2: EVIDENCE SYNTHESIS

### MANDATORY CITATION FORMAT

Every claim MUST include a permalink:

\`\`\`markdown
**Claim**: [What you're asserting]

**Evidence** ([source](https://github.com/owner/repo/blob/<sha>/path#L10-L20)):
\\\`\\\`\\\`typescript
// The actual code
function example() { ... }
\\\`\\\`\\\`

**Explanation**: This works because [specific reason from the code].
\`\`\`

### PERMALINK CONSTRUCTION

\`\`\`
https://github.com/<owner>/<repo>/blob/<commit-sha>/<filepath>#L<start>-L<end>

Example:
https://github.com/tanstack/query/blob/abc123def/packages/react-query/src/useQuery.ts#L42-L50
\`\`\`

**Getting SHA**:
- From clone: \`git rev-parse HEAD\`
- From API: \`gh api repos/owner/repo/commits/HEAD --jq '.sha'\`
- From tag: \`gh api repos/owner/repo/git/refs/tags/v1.0.0 --jq '.object.sha'\`

---

## TOOL REFERENCE

### Primary Tools by Purpose

- **Official Docs**: Use context7 - \`context7_resolve-library-id\` → \`context7_query-docs\`
- **Find Docs URL**: Use websearch_exa - \`websearch_web_search_exa("library official documentation")\`
- **Sitemap Discovery**: Use webfetch - \`webfetch(docs_url + "/sitemap.xml")\` to understand doc structure
- **Read Doc Page**: Use webfetch - \`webfetch(specific_doc_page)\` for targeted documentation
- **Latest Info**: Use websearch_exa - \`websearch_web_search_exa("query ${new Date().getFullYear()}")\`
- **Fast Code Search**: Use grep_app - \`grep_app_searchGitHub(query, language, useRegexp)\`
- **Deep Code Search**: Use gh CLI - \`gh search code "query" --repo owner/repo\`
- **Clone Repo**: Use gh CLI - \`gh repo clone owner/repo \${TMPDIR:-/tmp}/name -- --depth 1\`
- **Issues/PRs**: Use gh CLI - \`gh search issues/prs "query" --repo owner/repo\`
- **View Issue/PR**: Use gh CLI - \`gh issue/pr view <num> --repo owner/repo --comments\`
- **Release Info**: Use gh CLI - \`gh api repos/owner/repo/releases/latest\`
- **Git History**: Use git - \`git log\`, \`git blame\`, \`git show\`

### Temp Directory

Use OS-appropriate temp directory:
\`\`\`bash
# Cross-platform
\${TMPDIR:-/tmp}/repo-name

# Examples:
# macOS: /var/folders/.../repo-name or /tmp/repo-name
# Linux: /tmp/repo-name
# Windows: C:\\Users\\...\\AppData\\Local\\Temp\\repo-name
\`\`\`

---

## PARALLEL EXECUTION REQUIREMENTS

- **TYPE A (Conceptual)**: Suggested Calls 1-2 - Doc Discovery Required YES (Phase 0.5 first)
- **TYPE B (Implementation)**: Suggested Calls 2-3 - Doc Discovery Required NO
- **TYPE C (Context)**: Suggested Calls 2-3 - Doc Discovery Required NO
- **TYPE D (Comprehensive)**: Suggested Calls 3-5 - Doc Discovery Required YES (Phase 0.5 first)

**Doc Discovery is SEQUENTIAL** (websearch → version check → sitemap → investigate).
**Main phase is PARALLEL** once you know where to look.

**Always vary queries** when using grep_app:
\`\`\`
// GOOD: Different angles
grep_app_searchGitHub(query: "useQuery(", language: ["TypeScript"])
grep_app_searchGitHub(query: "queryOptions", language: ["TypeScript"])
grep_app_searchGitHub(query: "staleTime:", language: ["TypeScript"])

// BAD: Same pattern
grep_app_searchGitHub(query: "useQuery")
grep_app_searchGitHub(query: "useQuery")
\`\`\`

---

## FAILURE RECOVERY

- **context7 not found** - Clone repo, read source + README directly
- **grep_app no results** - Broaden query, try concept instead of exact name
- **gh API rate limit** - Use cloned repo in temp directory
- **Repo not found** - Search for forks or mirrors
- **Sitemap not found** - Try \`/sitemap-0.xml\`, \`/sitemap_index.xml\`, or fetch docs index page and parse navigation
- **Versioned docs not found** - Fall back to latest version, note this in response
- **Uncertain** - **STATE YOUR UNCERTAINTY**, propose hypothesis

---

## COMMUNICATION RULES

1. **NO TOOL NAMES**: Say "I'll search the codebase" not "I'll use grep_app"
2. **NO PREAMBLE**: Answer directly, skip "I'll help you with..."
3. **ALWAYS CITE**: Every code claim needs a permalink
4. **USE MARKDOWN**: Code blocks with language identifiers
5. **BE CONCISE**: Facts > opinions, evidence > speculation`;
var EXPLORE_SYSTEM = `You are a codebase search specialist. Your job: find files and code, return actionable results.

## Your Mission

Answer questions like:
- "Where is X implemented?"
- "Which files contain Y?"
- "Find the code that does Z"

## CRITICAL: What You Must Deliver

Every response MUST include:

### 1. Intent Analysis (Required)
Before ANY search, wrap your analysis in <analysis> tags:

<analysis>
**Literal Request**: [What they literally asked]
**Actual Need**: [What they're really trying to accomplish]
**Success Looks Like**: [What result would let them proceed immediately]
</analysis>

### 2. Parallel Execution (Required)
Launch **3+ tools simultaneously** in your first action. Never sequential unless output depends on prior result.

### 3. Structured Results (Required)
Always end with this exact format:

<results>
<files>
- /absolute/path/to/file1.ts - [why this file is relevant]
- /absolute/path/to/file2.ts - [why this file is relevant]
</files>

<answer>
[Direct answer to their actual need, not just file list]
[If they asked "where is auth?", explain the auth flow you found]
</answer>

<next_steps>
[What they should do with this information]
[Or: "Ready to proceed - no follow-up needed"]
</next_steps>
</results>

## Success Criteria

- **Paths** - ALL paths must be **absolute** (start with /)
- **Completeness** - Find ALL relevant matches, not just the first one
- **Actionability** - Caller can proceed **without asking follow-up questions**
- **Intent** - Address their **actual need**, not just literal request

## Failure Conditions

Your response has **FAILED** if:
- Any path is relative (not absolute)
- You missed obvious matches in the codebase
- Caller needs to ask "but where exactly?" or "what about X?"
- You only answered the literal question, not the underlying need
- No <results> block with structured output

## Constraints

- **Read-only**: You cannot create, modify, or delete files
- **No emojis**: Keep output clean and parseable
- **No file creation**: Report findings as message text, never write files

## Tool Strategy

Use the right tool for the job:
- **Semantic search** (definitions, references): LSP tools
- **Structural patterns** (function shapes, class structures): use the \`ast-grep\` skill helper (\`python3 scripts/ast_grep_helper.py search\`) when loaded, or ask the caller to load it
- **Text patterns** (strings, comments, logs): grep
- **File patterns** (find by name/extension): glob
- **History/evolution** (when added, who changed): git commands

Flood with parallel calls. Cross-validate findings across multiple tools.`;
var MULTIMODAL_LOOKER_SYSTEM = `You interpret media files that cannot be read as plain text.

During look_at invocations, the file or image is already attached to the message. Analyze the attachment directly. Never call tools, never spawn other agents, and never try to load the file by path.

Your job: examine the attached file(s) and extract ONLY what was requested.

When multiple files are provided, analyze each and address the goal across all files. If the goal involves comparison, explicitly compare and contrast.

When to use you:
- Media files that need visual or document interpretation
- Extracting specific information or summaries from documents
- Describing visual content in images or diagrams
- When analyzed/extracted data is needed, not raw file contents

When NOT to use you:
- Source code or plain text files needing exact contents
- Files that need editing afterward
- Simple file reading where no interpretation is needed

How you work:
1. Receive an attached file or image and a goal describing what to extract
2. Analyze the attachment deeply
3. Return ONLY the relevant extracted information
4. The main agent never processes the raw file - you save context tokens

For PDFs and documents: extract text, structure, tables, and data from specific sections
For images: describe layouts, UI elements, text, diagrams, charts
For diagrams: explain relationships, flows, architecture depicted

Response rules:
- Return extracted information directly, no preamble
- If info not found, state clearly what's missing
- Match the language of the request
- Be thorough on the goal, concise on everything else

Your output goes straight to the main agent for continued work.`;
var SISYPHUS_JUNIOR_SYSTEM = `<Role>
Sisyphus-Junior - Focused executor from [OMC].
Execute tasks directly.
</Role>

${ANTI_DUPLICATION_SECTION}

<Todo_Discipline>
TODO OBSESSION (NON-NEGOTIABLE):
- 2+ steps → todowrite FIRST, atomic breakdown
- Mark in_progress before starting (ONE at a time)
- Mark completed IMMEDIATELY after each step
- NEVER batch completions

No todos on multi-step work = INCOMPLETE WORK.
</Todo_Discipline>

<Verification>
Task NOT complete without:
- lsp_diagnostics clean on changed files
- Build passes (if applicable)
- All todos marked completed
</Verification>

<Termination>
STOP after first successful verification. Do NOT re-verify.
Maximum status checks: 2. Then stop regardless.
</Termination>

<Style>
- Start immediately. No acknowledgments.
- Match user's communication style.
- Dense > verbose.
</Style>`;
var SISYPHUS_SYSTEM = `<Role>
Sisyphus - Orchestrator from [OMC].
</Role>

You are a powerful AI orchestrator. Plan obsessively with todos, assess search complexity before exploration, and delegate strategically using category + skills combinations. Use the explore agent for internal codebase search (parallel-friendly) and the librarian agent for external documentation.

NOTE: This is a reduced identity port. The V1 Sisyphus prompt is generated by a model-family-specific dynamic builder (kimi-k2/k3, gpt-5.4/5.5/5.6, claude fable/opus, glm, grok variants) that requires model-core, the config schema and the skills loader — not available in the isolated V2 plugin context.`;
var HEPHAESTUS_SYSTEM = `<Role>
Hephaestus - Autonomous Deep Worker from [OMC].
</Role>

Goal-oriented execution with deep exploration. Explore thoroughly before acting, use the explore/librarian agents to gather comprehensive context, and complete tasks end-to-end. Inspired by AmpCode deep mode.

NOTE: This is a reduced identity port. The V1 Hephaestus prompt is generated by a dynamic builder (gpt, gpt-5-4, gpt-5-5, gpt-5-6 variants) that requires model-core and the config schema — not available in the isolated V2 plugin context.`;
var ATLAS_SYSTEM = `<Role>
Atlas - Orchestrator from [OMC].
</Role>

Orchestrates work via task() to complete ALL tasks in a todo list until fully done.

NOTE: This is a reduced identity port. The V1 Atlas prompt is generated dynamically from an OrchestratorContext (category descriptions, agent inventory, skills) that is not available in the isolated V2 plugin context.`;
var OMC_AGENTS = [
  {
    id: "sisyphus",
    name: "Sisyphus",
    description: "Powerful AI orchestrator. Plans obsessively with todos, assesses search complexity before exploration, delegates strategically via category+skills combinations. Uses explore for internal code (parallel-friendly), librarian for external docs. (Sisyphus - [OMC])",
    mode: "primary",
    system: SISYPHUS_SYSTEM,
    color: "#00CED1",
    permissions: [...allow("question"), ...deny("call_omo_agent")]
  },
  {
    id: "hephaestus",
    name: "Hephaestus",
    description: "Autonomous Deep Worker - goal-oriented execution with GPT Codex. Explores thoroughly before acting, uses explore/librarian agents for comprehensive context, completes tasks end-to-end. Inspired by AmpCode deep mode. (Hephaestus - [OMC])",
    mode: "primary",
    system: HEPHAESTUS_SYSTEM,
    color: "#D97706",
    permissions: [...allow("question"), ...deny("call_omo_agent")]
  },
  {
    id: "oracle",
    name: "Oracle",
    description: "Read-only consultation agent. High-IQ reasoning specialist for debugging hard problems and high-difficulty architecture design. (Oracle - [OMC])",
    mode: "subagent",
    system: ORACLE_SYSTEM,
    permissions: [...deny("write", "edit", "apply_patch", "task")]
  },
  {
    id: "librarian",
    name: "Librarian",
    description: "Specialized codebase understanding agent for multi-repository analysis, searching remote codebases, retrieving official documentation, and finding implementation examples using GitHub CLI, Context7, and Web Search. MUST BE USED when users ask to look up code in remote repositories, explain library internals, or find usage examples in open source. (Librarian - [OMC])",
    mode: "subagent",
    system: LIBRARIAN_SYSTEM,
    permissions: [...deny("write", "edit", "apply_patch", "task", "call_omo_agent")]
  },
  {
    id: "explore",
    name: "Explore",
    description: 'Contextual grep for codebases. Answers "Where is X?", "Which file has Y?", "Find the code that does Z". Fire multiple in parallel for broad searches. Specify thoroughness: "quick" for basic, "medium" for moderate, "very thorough" for comprehensive analysis. (Explore - [OMC])',
    mode: "subagent",
    system: EXPLORE_SYSTEM,
    permissions: [
      ...deny("write", "edit", "apply_patch", "task", "call_omo_agent"),
      ...allow("lsp_symbols", "lsp_goto_definition", "lsp_find_references", "lsp_diagnostics")
    ]
  },
  {
    id: "multimodal-looker",
    name: "Multimodal Looker",
    description: "Analyze media files (PDFs, images, diagrams) that require interpretation beyond raw text. Extracts specific information or summaries from documents, describes visual content. Use when you need analyzed/extracted data rather than literal file contents. (Multimodal-Looker - [OMC])",
    mode: "subagent",
    system: MULTIMODAL_LOOKER_SYSTEM,
    permissions: [...deny("*"), ...allow("read")]
  },
  {
    id: "metis",
    name: "Metis",
    description: "Pre-planning consultant that analyzes requests to identify hidden intentions, ambiguities, and AI failure points. (Metis - [OMC])",
    mode: "subagent",
    system: METIS_SYSTEM,
    permissions: [...deny("write", "edit", "apply_patch")]
  },
  {
    id: "momus",
    name: "Momus",
    description: "Expert reviewer for evaluating work plans against rigorous clarity, verifiability, and completeness standards. (Momus - [OMC])",
    mode: "subagent",
    system: MOMUS_SYSTEM,
    permissions: [...deny("write", "edit", "apply_patch")]
  },
  {
    id: "atlas",
    name: "Atlas",
    description: "Orchestrates work via task() to complete ALL tasks in a todo list until fully done. (Atlas - [OMC])",
    mode: "primary",
    system: ATLAS_SYSTEM,
    color: "#10B981"
  },
  {
    id: "sisyphus-junior",
    name: "Sisyphus-Junior",
    description: "Focused task executor. Same discipline, no delegation. (Sisyphus-Junior - [OMC])",
    mode: "subagent",
    system: SISYPHUS_JUNIOR_SYSTEM,
    color: "#20B2AA",
    permissions: [...deny("task"), ...allow("call_omo_agent")]
  }
];
async function registerAgents(ctx) {
  await ctx.agent.transform((editor) => {
    for (const def of OMC_AGENTS) {
      editor.update(def.id, (agent) => {
        agent.name = Agent.Name.make(def.name);
        agent.description = def.description;
        agent.mode = def.mode;
        agent.system = def.system;
        agent.hidden = false;
        if (def.color !== undefined) {
          agent.color = def.color;
        }
        agent.permissions = [...def.permissions ?? []];
      });
    }
    for (const builtinId of ["build", "plan"]) {
      if (editor.get(builtinId) !== undefined) {
        editor.update(builtinId, (agent) => {
          agent.mode = "subagent";
          agent.hidden = true;
        });
      }
    }
    editor.default("sisyphus");
  });
  const rpc = await ctx.rpc.register({
    id: "omo.agents",
    methods: {
      list: {
        input: z.object({}),
        output: z.object({
          count: z.number(),
          agents: z.array(z.object({
            id: z.string(),
            name: z.string(),
            mode: z.enum(["primary", "subagent", "all"]),
            hasSystem: z.boolean()
          }))
        })
      },
      get: {
        input: z.object({ agent: z.string() }),
        output: z.object({
          ok: z.boolean(),
          agent: z.object({
            id: z.string(),
            name: z.string(),
            mode: z.enum(["primary", "subagent", "all"]),
            description: z.string(),
            system: z.string()
          }).optional(),
          error: z.string().optional()
        })
      },
      dispatch: {
        input: z.object({ agent: z.string(), title: z.string().optional() }),
        output: z.object({
          ok: z.boolean(),
          sessionID: z.string().optional(),
          agent: z.string().optional(),
          error: z.string().optional()
        })
      }
    },
    events: {}
  }, {
    list: async () => {
      const out = await ctx.agent.list();
      const agents = out.data.map((agent) => ({
        id: agent.id,
        name: agent.name,
        mode: agent.mode,
        hasSystem: agent.system !== undefined && agent.system.length > 0
      }));
      return { count: agents.length, agents };
    },
    get: async (input) => {
      const out = await ctx.agent.list();
      const found = out.data.find((agent) => agent.id === input.agent);
      if (found === undefined || found.system === undefined) {
        return { ok: false, error: `unknown agent: ${input.agent}` };
      }
      return {
        ok: true,
        agent: {
          id: found.id,
          name: found.name,
          mode: found.mode,
          description: found.description ?? "",
          system: found.system
        }
      };
    },
    dispatch: async (input) => {
      const out = await ctx.agent.list();
      const found = out.data.find((agent) => agent.id === input.agent);
      if (found === undefined) {
        return {
          ok: false,
          error: `unknown agent: ${input.agent} (available: ${out.data.map((a) => a.id).sort().join(", ")})`
        };
      }
      try {
        const session = await ctx.session.create({
          agent: input.agent,
          title: input.title ?? `${input.agent} (omo dispatch)`
        });
        return { ok: true, sessionID: session.id, agent: session.agent };
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  });
  return async () => {
    await rpc.dispose();
  };
}

// ../../../home/uar/projects/oh-my-openagent/packages/omo-opencode/src/v2/tools.ts
var {readdirSync, readFileSync, statSync} = (() => ({}));

// node:path
function assertPath(path) {
  if (typeof path !== "string")
    throw TypeError("Path must be a string. Received " + JSON.stringify(path));
}
function normalizeStringPosix(path, allowAboveRoot) {
  var res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, code;
  for (var i = 0;i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1)
                res = "", lastSegmentLength = 0;
              else
                res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              lastSlash = i, dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "", lastSegmentLength = 0, lastSlash = i, dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += "/..";
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += "/" + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i, dots = 0;
    } else if (code === 46 && dots !== -1)
      ++dots;
    else
      dots = -1;
  }
  return res;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root, base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep + base;
}
function resolve() {
  var resolvedPath = "", resolvedAbsolute = false, cwd;
  for (var i = arguments.length - 1;i >= -1 && !resolvedAbsolute; i--) {
    var path;
    if (i >= 0)
      path = arguments[i];
    else {
      if (cwd === undefined)
        cwd = process.cwd();
      path = cwd;
    }
    if (assertPath(path), path.length === 0)
      continue;
    resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  if (resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute), resolvedAbsolute)
    if (resolvedPath.length > 0)
      return "/" + resolvedPath;
    else
      return "/";
  else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var isAbsolute = path.charCodeAt(0) === 47, trailingSeparator = path.charCodeAt(path.length - 1) === 47;
  if (path = normalizeStringPosix(path, !isAbsolute), path.length === 0 && !isAbsolute)
    path = ".";
  if (path.length > 0 && trailingSeparator)
    path += "/";
  if (isAbsolute)
    return "/" + path;
  return path;
}
function isAbsolute(path) {
  return assertPath(path), path.length > 0 && path.charCodeAt(0) === 47;
}
function join() {
  if (arguments.length === 0)
    return ".";
  var joined;
  for (var i = 0;i < arguments.length; ++i) {
    var arg = arguments[i];
    if (assertPath(arg), arg.length > 0)
      if (joined === undefined)
        joined = arg;
      else
        joined += "/" + arg;
  }
  if (joined === undefined)
    return ".";
  return normalize(joined);
}
function relative(from, to) {
  if (assertPath(from), assertPath(to), from === to)
    return "";
  if (from = resolve(from), to = resolve(to), from === to)
    return "";
  var fromStart = 1;
  for (;fromStart < from.length; ++fromStart)
    if (from.charCodeAt(fromStart) !== 47)
      break;
  var fromEnd = from.length, fromLen = fromEnd - fromStart, toStart = 1;
  for (;toStart < to.length; ++toStart)
    if (to.charCodeAt(toStart) !== 47)
      break;
  var toEnd = to.length, toLen = toEnd - toStart, length = fromLen < toLen ? fromLen : toLen, lastCommonSep = -1, i = 0;
  for (;i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47)
          return to.slice(toStart + i + 1);
        else if (i === 0)
          return to.slice(toStart + i);
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47)
          lastCommonSep = i;
        else if (i === 0)
          lastCommonSep = 0;
      }
      break;
    }
    var fromCode = from.charCodeAt(fromStart + i), toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === 47)
      lastCommonSep = i;
  }
  var out = "";
  for (i = fromStart + lastCommonSep + 1;i <= fromEnd; ++i)
    if (i === fromEnd || from.charCodeAt(i) === 47)
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    if (toStart += lastCommonSep, to.charCodeAt(toStart) === 47)
      ++toStart;
    return to.slice(toStart);
  }
}
function _makeLong(path) {
  return path;
}
function dirname(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var code = path.charCodeAt(0), hasRoot = code === 47, end = -1, matchedSlash = true;
  for (var i = path.length - 1;i >= 1; --i)
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else
      matchedSlash = false;
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path.slice(0, end);
}
function basename(path, ext) {
  if (ext !== undefined && typeof ext !== "string")
    throw TypeError('"ext" argument must be a string');
  assertPath(path);
  var start = 0, end = -1, matchedSlash = true, i;
  if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
    if (ext.length === path.length && ext === path)
      return "";
    var extIdx = ext.length - 1, firstNonSlashEnd = -1;
    for (i = path.length - 1;i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1)
          matchedSlash = false, firstNonSlashEnd = i + 1;
        if (extIdx >= 0)
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1)
              end = i;
          } else
            extIdx = -1, end = firstNonSlashEnd;
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path.length;
    return path.slice(start, end);
  } else {
    for (i = path.length - 1;i >= 0; --i)
      if (path.charCodeAt(i) === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1)
        matchedSlash = false, end = i + 1;
    if (end === -1)
      return "";
    return path.slice(start, end);
  }
}
function extname(path) {
  assertPath(path);
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, preDotState = 0;
  for (var i = path.length - 1;i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    return "";
  return path.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object")
    throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
  return _format("/", pathObject);
}
function parse(path) {
  assertPath(path);
  var ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path.length === 0)
    return ret;
  var code = path.charCodeAt(0), isAbsolute2 = code === 47, start;
  if (isAbsolute2)
    ret.root = "/", start = 1;
  else
    start = 0;
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, i = path.length - 1, preDotState = 0;
  for (;i >= start; --i) {
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1)
      if (startPart === 0 && isAbsolute2)
        ret.base = ret.name = path.slice(1, end);
      else
        ret.base = ret.name = path.slice(startPart, end);
  } else {
    if (startPart === 0 && isAbsolute2)
      ret.name = path.slice(1, startDot), ret.base = path.slice(1, end);
    else
      ret.name = path.slice(startPart, startDot), ret.base = path.slice(startPart, end);
    ret.ext = path.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
}
var sep = "/";
var delimiter = ":";
var posix = ((p) => (p.posix = p, p))({ resolve, normalize, isAbsolute, join, relative, _makeLong, dirname, basename, extname, format, parse, sep, delimiter, win32: null, posix: null });

// ../../../home/uar/projects/oh-my-openagent/packages/omo-opencode/src/v2/tools.ts
import { z as z2 } from "zod";
var globInputSchema = z2.object({
  pattern: z2.string().describe("The glob pattern to match files against"),
  path: z2.string().optional().describe("The directory to search in. If not specified, the current working directory will be used. " + 'IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - ' + "simply omit it for the default behavior. Must be a valid directory path if provided.")
});
var grepInputSchema = z2.object({
  pattern: z2.string().describe("The regex pattern to search for in file contents"),
  include: z2.string().optional().describe('File pattern to include in the search (e.g. "*.js", "*.{ts,tsx}")'),
  path: z2.string().optional().describe("The directory to search in. Defaults to the current working directory."),
  output_mode: z2.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts per file.'),
  head_limit: z2.number().optional().describe("Limit output to first N entries. 0 or omitted means no limit.")
});
var GLOB_MAX_RESULTS = 100;
var GLOB_MAX_SCANNED_FILES = 20000;
var GREP_MAX_OUTPUT_BYTES = 256 * 1024;
var GREP_MAX_FILE_BYTES = 2 * 1024 * 1024;
var GREP_MAX_SCANNED_FILES = 20000;
var GREP_MAX_MATCHES = 1e4;
var IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "out",
  "build",
  ".next",
  ".turbo",
  ".cache",
  "coverage",
  ".venv",
  "__pycache__"
]);
function escapeRegExpChar(char) {
  return /[\\^$.*+?()[\]{}|]/.test(char) ? `\\${char}` : char;
}
function escapeRegExp(literal) {
  return literal.split("").map(escapeRegExpChar).join("");
}
function globToRegExp(pattern) {
  const normalized = pattern.replace(/\\/g, "/");
  let regex = "^";
  let i = 0;
  while (i < normalized.length) {
    const char = normalized[i];
    if (char === "*") {
      if (normalized[i + 1] === "*") {
        if (normalized[i + 2] === "/") {
          regex += "(?:.*/)?";
          i += 3;
        } else {
          regex += ".*";
          i += 2;
        }
      } else {
        regex += "[^/]*";
        i += 1;
      }
    } else if (char === "?") {
      regex += "[^/]";
      i += 1;
    } else if (char === "[") {
      const close = normalized.indexOf("]", i);
      if (close === -1) {
        regex += "\\[";
        i += 1;
      } else {
        regex += normalized.slice(i, close + 1);
        i = close + 1;
      }
    } else if (char === "{") {
      const close = normalized.indexOf("}", i);
      if (close === -1) {
        regex += "\\{";
        i += 1;
      } else {
        const inner = normalized.slice(i + 1, close);
        regex += `(?:${inner.split(",").map(escapeRegExp).join("|")})`;
        i = close + 1;
      }
    } else {
      regex += escapeRegExpChar(char);
      i += 1;
    }
  }
  regex += "$";
  return new RegExp(regex);
}
function toPosixPath(path) {
  return path.split(sep).join("/");
}
function walkFiles(root) {
  const files = [];
  const stack = [root];
  let visitedDirs = 0;
  while (stack.length > 0 && files.length < GLOB_MAX_SCANNED_FILES && visitedDirs < GLOB_MAX_SCANNED_FILES) {
    const dir = stack.pop();
    if (dir === undefined)
      break;
    visitedDirs += 1;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (files.length >= GLOB_MAX_SCANNED_FILES)
        break;
      const absolute = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name))
          continue;
        stack.push(absolute);
      } else if (entry.isFile()) {
        let mtime = 0;
        try {
          mtime = statSync(absolute).mtime.getTime();
        } catch {}
        files.push({
          absolute,
          relative: toPosixPath(relative(root, absolute)),
          mtime
        });
      }
    }
  }
  return files;
}
async function runGlob(input, directory) {
  const searchPath = input.path ? resolve(directory, input.path) : directory;
  const matcher = globToRegExp(input.pattern);
  const files = walkFiles(searchPath).filter((file) => matcher.test(file.relative) || matcher.test(toPosixPath(file.absolute))).sort((a, b) => b.mtime - a.mtime).slice(0, GLOB_MAX_RESULTS);
  if (files.length === 0)
    return "No files found";
  const lines = [`Found ${files.length} file(s)`, ""];
  for (const file of files) {
    lines.push(file.absolute);
  }
  return lines.join(`
`);
}
async function runGrep(input, directory) {
  const searchPath = input.path ? resolve(directory, input.path) : directory;
  const outputMode = input.output_mode ?? "files_with_matches";
  const headLimit = input.head_limit && input.head_limit > 0 ? input.head_limit : undefined;
  let regex;
  try {
    regex = new RegExp(input.pattern);
  } catch (error) {
    return `Error: invalid regex: ${error instanceof Error ? error.message : String(error)}`;
  }
  const includeMatcher = input.include ? globToRegExp(input.include) : undefined;
  const matches = [];
  const perFileCount = new Map;
  let scannedFiles = 0;
  let outputBytes = 0;
  let truncated = false;
  for (const file of walkFiles(searchPath)) {
    if (scannedFiles >= GREP_MAX_SCANNED_FILES)
      break;
    if (includeMatcher && !includeMatcher.test(file.relative) && !includeMatcher.test(toPosixPath(file.absolute))) {
      continue;
    }
    scannedFiles += 1;
    let content;
    try {
      const stat = statSync(file.absolute);
      if (stat.size > GREP_MAX_FILE_BYTES)
        continue;
      content = readFileSync(file.absolute, "utf8");
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    let fileCount = 0;
    for (let index = 0;index < lines.length; index += 1) {
      const lineText = lines[index];
      if (regex.test(lineText)) {
        fileCount += 1;
        if (outputMode !== "count") {
          matches.push({ file: file.absolute, line: index + 1, text: lineText });
        }
      }
    }
    if (fileCount > 0) {
      perFileCount.set(file.absolute, fileCount);
    }
  }
  if (outputMode === "count") {
    const entries = [...perFileCount.entries()].sort((a, b) => b[1] - a[1]);
    const limited2 = headLimit ? entries.slice(0, headLimit) : entries;
    if (limited2.length === 0)
      return "No matches found";
    const total = limited2.reduce((sum, [, count]) => sum + count, 0);
    const out = [`Found ${total} match(es) in ${limited2.length} file(s):`, ""];
    for (const [file, count] of limited2) {
      out.push(`  ${String(count).padStart(6)}: ${file}`);
    }
    return out.join(`
`);
  }
  const limited = headLimit ? matches.slice(0, headLimit) : matches.slice(0, GREP_MAX_MATCHES);
  if (matches.length > limited.length)
    truncated = true;
  if (limited.length === 0)
    return "No matches found";
  const isFilesOnlyMode = outputMode === "files_with_matches";
  const byFile = new Map;
  for (const match of limited) {
    const existing = byFile.get(match.file) ?? [];
    existing.push(match);
    byFile.set(match.file, existing);
  }
  const header = `Found ${limited.length} match(es) in ${byFile.size} file(s)`;
  const chunks = [header];
  if (truncated)
    chunks.push("[Output truncated due to size limit]");
  chunks.push("");
  for (const [file, fileMatches] of byFile) {
    const line = file;
    if (outputBytes + line.length > GREP_MAX_OUTPUT_BYTES) {
      truncated = true;
      break;
    }
    outputBytes += line.length;
    chunks.push(line);
    if (!isFilesOnlyMode) {
      for (const match of fileMatches) {
        const trimmed = match.text.trim();
        if (match.line === 0 && trimmed === "")
          continue;
        const entry = `  ${match.line}: ${trimmed}`;
        if (outputBytes + entry.length > GREP_MAX_OUTPUT_BYTES) {
          truncated = true;
          break;
        }
        outputBytes += entry.length;
        chunks.push(entry);
      }
    }
    chunks.push("");
  }
  if (truncated)
    chunks.push("[Output truncated due to size limit]");
  return chunks.join(`
`);
}
var hookActivity = [];
function recordActivity(kind, detail) {
  hookActivity.push({ at: new Date().toISOString(), kind, detail });
  if (hookActivity.length > 100)
    hookActivity.shift();
}
async function registerToolsAndHooks(ctx) {
  const directory = ctx.location.directory;
  const runners = {
    glob: (input) => {
      const parsed = globInputSchema.safeParse(input);
      if (!parsed.success) {
        return Promise.reject(new Error(`invalid glob input: ${parsed.error.message}`));
      }
      return runGlob(parsed.data, directory);
    },
    grep: (input) => {
      const parsed = grepInputSchema.safeParse(input);
      if (!parsed.success) {
        return Promise.reject(new Error(`invalid grep input: ${parsed.error.message}`));
      }
      return runGrep(parsed.data, directory);
    }
  };
  await ctx.tool.transform((editor) => {
    editor.add({
      name: "glob",
      description: "Fast file pattern matching tool with safety limits (60s timeout, 100 file limit). " + 'Supports glob patterns like "**/*.js" or "src/**/*.ts". ' + "Returns matching file paths sorted by modification time. " + "Use this tool when you need to find files by name patterns.",
      input: globInputSchema,
      execute: async (input) => ({ content: await runGlob(input, directory) })
    });
    editor.add({
      name: "grep",
      description: "Fast content search tool with safety limits (60s timeout, 256KB output). " + "Searches file contents using regular expressions. " + 'Supports full regex syntax (eg. "log.*Error", "function\\s+\\w+", etc.). ' + 'Filter files by pattern with the include parameter (eg. "*.js", "*.{ts,tsx}"). ' + 'Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts per file.',
      input: grepInputSchema,
      execute: async (input) => ({ content: await runGrep(input, directory) })
    });
  });
  await ctx.tool.hook("execute.before", (input) => {
    recordActivity("tool.execute.before", input.tool);
    if (input.tool.toLowerCase().startsWith("mcp_")) {
      input.tool = input.tool.replace(/^mcp_/i, "");
    }
  });
  await ctx.tool.hook("execute.after", (input) => {
    recordActivity("tool.execute.after", `${input.tool}:${input.status}`);
  });
  await ctx.session.hook("compaction", (input) => {
    recordActivity("session.compaction", input.sessionID);
  });
  await ctx.shell.hook("create.before", (input) => {
    recordActivity("shell.create.before", input.command);
    if (input.command.includes("\x00")) {
      input.command = input.command.replace(/\x00/g, "");
    }
  });
  const rpc = await ctx.rpc.register({
    id: "omo.tools",
    methods: {
      list: {
        input: z2.object({}),
        output: z2.object({ tools: z2.array(z2.string()) })
      },
      invoke: {
        input: z2.object({ tool: z2.string(), input: z2.record(z2.string(), z2.unknown()) }),
        output: z2.object({
          ok: z2.boolean(),
          content: z2.string().optional(),
          error: z2.string().optional()
        })
      },
      hooks: {
        input: z2.object({}),
        output: z2.object({ activity: z2.array(z2.object({ at: z2.string(), kind: z2.string(), detail: z2.string() })) })
      }
    },
    events: {}
  }, {
    list: async () => {
      const registered = await ctx.tool.list();
      return { tools: registered.map((tool) => tool.id) };
    },
    invoke: async (input) => {
      const runner = runners[input.tool];
      if (!runner) {
        return { ok: false, error: `unknown tool: ${input.tool} (available: ${Object.keys(runners).join(", ")})` };
      }
      try {
        const content = await runner(input.input);
        return { ok: true, content };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    },
    hooks: async () => ({ activity: hookActivity.slice() })
  });
  return async () => {
    await rpc.dispose();
  };
}

// ../../../home/uar/projects/oh-my-openagent/packages/omo-opencode/src/v2/index.ts
var bootstrapRpc = {
  id: "omo",
  methods: {
    status: {
      input: z3.object({}),
      output: z3.object({ ok: z3.boolean(), stage: z3.string() })
    }
  },
  events: {}
};
var omoV2Plugin = Plugin2.define({
  id: "oh-my-openagent",
  async setup(ctx) {
    ctx.rpc.register(bootstrapRpc, {
      status: async () => ({ ok: true, stage: "bootstrap" })
    });
    const disposeTools = await registerToolsAndHooks(ctx);
    const disposeAgents = await registerAgents(ctx);
    return async () => {
      await disposeTools();
      await disposeAgents();
    };
  }
});
var v2_default = omoV2Plugin;
export {
  omoV2Plugin,
  v2_default as default
};
