# SG portfolio: instructions for every chat

Read `HANDOFF.md` in this directory before planning or changing anything. It is the authoritative project brief, sprint backlog, and continuation record.

When the user supplies the handoff path or asks to continue a sprint:

1. Inspect the current repository and the handoff's **Current state**, **Sprint status**, and **Latest continuation record**. Preserve existing work.
2. If the user names a sprint, work on that sprint, checking its dependencies first. Otherwise resume an `IN_PROGRESS` sprint, or start the first dependency-ready `TODO` sprint. Complete one sprint per chat unless the user asks for more.
3. Follow the selected sprint's scope, implementation instructions, and acceptance checks. A supplied handoff path is an instruction to execute the next sprint, not merely summarize the document.
4. Update `HANDOFF.md` when starting, after meaningful checkpoints, and before ending the chat, including interruptions and partial completion. Keep status, evidence, changed files, decisions, missing inputs, and the next action accurate.
5. Never mark a sprint `DONE` without checking its acceptance criteria. Record failed or unavailable checks explicitly. Do not fabricate personal facts, project results, working links, or successful tests.
6. Do not start another implementation sprint automatically. End with the completed or partial sprint, checks, limitations, and the handoff path.

The current request is planning and handoff creation, including owner-content intake. Do not implement the website until a subsequent user instruction invokes a sprint or asks to proceed. A content update or replacement resume is a maintenance request, not an instruction to start an implementation sprint.

Owner-confirmed inputs and resume-derived facts are in `docs/sources/owner-inputs.json`; reviewed repository READMEs, hashes, and caveats are in `docs/sources/repository-evidence.json`. Read the handoff's current facts before asking about missing inputs. The website degree is owner-confirmed Information Technology even though the unchanged supplied PDF says Computer Science. Preserve the stable resume asset at `public/resume/sakshi-gupta-resume.pdf` during scaffolding; see the handoff for replacement instructions.
