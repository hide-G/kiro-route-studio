# Final Exam Submission Copy

## Links

- Public GitHub repository: https://github.com/hide-G/kiro-route-studio
- Public demo video URL: `<PUBLIC_DEMO_VIDEO_URL>`
- Live social post URL: `<LIVE_SOCIAL_POST_URL>`
- Packaged Kiro Power: https://github.com/hide-G/kiro-route-studio/tree/main/power/route-video

## What you built (paste-ready, 3 sentences)

I built Kiro Route Studio, a Node.js application that deterministically renders a Halloween isometric city, a glowing route, and a ghost guide into a vertical H.264 video. Kiro specs, steering, hooks, property-based tests, a read-only MCP server, and two custom agents keep the implementation traceable and safe. The same CLI runs locally, in a Kiro Web cloud session, and on a security-hardened short-lived EC2 renderer.

## Lessons demonstrated (paste-ready)

### 1. Spec-driven development

I used EARS-style requirements, an architecture and correctness-property design, and an implementation task list in `.kiro/specs/route-video/`. Requirement IDs map to components and executable verification.

### 2. Steering documents

`.kiro/steering/product.md` and `tech.md` are always included, while `structure.md` uses file matching for ESM implementation files. They enforce Node.js ESM, fixed dependencies, deterministic rendering, Japanese user messages, and output-path safety.

### 3. Hooks

`.kiro/hooks/spec-check.kiro.hook` asks Kiro to check spec-to-task consistency whenever the route-video spec changes. `.kiro/hooks/test-on-save.kiro.hook` runs fast Node.js unit and scene checks when implementation or scene files change.

### 4. Property-based testing (IDE only)

`test/properties/` implements CP-01 through CP-08 with fast-check. The tests cover reversible isometric projection, projection monotonicity, route endpoints and movement bounds, normalization idempotence, frame naming, deterministic PNG hashes, and monotonic progress.

### 5. Powers

`docs/kiro-evidence.md` records how focused AWS compute, CloudFormation, and IAM guidance was used to constrain the EC2 design without deploying resources. The resulting evidence is the secure template and runbook under `aws/` and `docs/ec2.md`.

### 6. Model Context Protocol (MCP)

`.kiro/settings/mcp.json` starts `src/mcp/server.mjs` over stdio. It implements `initialize`, `tools/list`, and `tools/call` with three read-only tools for scene discovery, scene summaries, and verification summaries; `scripts/mcp-smoke.mjs` exercises the protocol.

### 7. Custom agents

`.kiro/agents/route-director.json` is constrained to visual direction within the spec and scene JSON. `.kiro/agents/quality-reviewer.json` checks tests, ffprobe evidence, safety, and submission artifacts without making AWS or Git changes.

### Bonus: Kiro Web, cloud sessions, and cloud configuration

`docs/cloud-session.md` provides a reproducible cloud-session sequence using the same `npm ci`, Node tests, frames-only render, and optional FFmpeg verification as local development. The demo script explicitly compares local MP4 generation with the Kiro Web cloud session.

### Bonus: Package a Kiro power

`power/route-video/plugin.json` packages a reusable skill, review checklist, and a self-contained three-tool read-only MCP server. The public package URL is https://github.com/hide-G/kiro-route-studio/tree/main/power/route-video.

## Eligibility reminders

個人情報、年齢、アカウント要件、Challenge Period内の最初のcommit、公開動画、公開SNS URLは申込者本人が確認してください。公開後から審査終了まではルールで許容されないcommitを追加しないでください。
