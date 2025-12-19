# AlienStressManager

This is an application to handle Stress points in Alien RPG (Free League Publishing)

All data is stored locally, and it works perfectly online.

Used also to test SDD Frameworks, direct human intervention is minimal

Deployed on https://alien-stress-manager.vercel.app/

# Technical Specs

It's build using Vue 3 and Tailwind 4

## [Spec-Kitty](https://github.com/Priivacy-ai/spec-kitty) / Claude Sonnet 4.5

- First PR (basic MVP), artifacts kept in kitty-specs
- I found it a bit too heavy for my usage (i'm not parallelizing)

## [Open-Spec](https://openspec.dev/) / Gemini Pro (2.5 - 3)

- Second PR (panic rolls) : openspec\specs
- Console interaction in Gemini was a bit tedious, need to test with Claude Code

## [Open-Spec](https://openspec.dev/) / Claude Sonnet (4.5)

- Thired PR (Add dice rolling) : openspec\specs
- Very fluid.

## Claude Code Plan Mode / (Claude Opus 4.5)

- Pushing rolls : claude_code_planning/push-roll-feature.md
- Did its job
