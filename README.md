# omo-v2-local

Local distribution shim for the **oh-my-openagent OpenCode V2 plugin surface**
(agents + dispatch, tools + hooks slices) built from the dev branch
`packages/omo-opencode/src/v2` — see upstream track
[code-yeongyu/oh-my-openagent#9389](https://github.com/code-yeongyu/oh-my-openagent/issues/9389),
[PR #10374](https://github.com/code-yeongyu/oh-my-openagent/pull/10374).

Install on OpenCode 2.x:

    opencode plugin add github:fos111/omo-v2-local

V1 OpenCode (pre-2.x) must use the official plugin instead; this package only
contains the `@opencode/plugin` 2.x entry (`Plugin.define`, id `oh-my-openagent`).

Rebuild from source (after the dev branch moves):

    bun build <repo>/packages/omo-opencode/src/v2/index.ts --outfile dist/index.js \
      --format esm --external @opencode/plugin --external zod

Provenance: adapted from the runtime-verified V2 port referenced in #9389
(fazulfi/omo-v2) with co-author attribution; repo-protocol QA evidence
(summaries/hash lines) lives in the upstream PR #10374 body.
