---
title: 'What to Look for When Hiring a Business Central Developer'
description: 'Hiring a Business Central developer is harder than it looks. The BC talent pool is small, credentials vary widely, and the wrong hire will cost more than the project. Here is what actually matters.'
date: '2025-05-22'
draft: false
slug: '/pensieve/hiring-business-central-developer'
tags:
  - Business Central
  - Hiring
  - AL
  - Microsoft Partners
---

## The BC Developer Market Is Smaller Than It Looks

Searching for a Business Central developer — or a BC AL developer specifically — returns a list of profiles and agencies that all look broadly similar. Microsoft certifications, years of NAV experience, "end-to-end implementation" in the headline. The problem is that Business Central development is a narrow specialisation, and the difference between someone who can follow a tutorial and someone who can build a production-grade extension is large.

This matters because mistakes in ERP development are expensive. A poorly written AL extension that works in a sandbox but corrupts posting data in production is not a theoretical risk — it happens, and it tends to happen after go-live.

## What Actually Matters

### AL and the Extension Model

The shift from C/AL to AL is not cosmetic. AL extensions require a different mental model — event-based design, dependency management, upgrade logic, permission sets, AppSource technical validation rules if the work is going to be published. A developer who learned NAV in 2015 and has not kept current will produce code that looks like AL but thinks in C/AL. Ask specifically about extensions they have deployed to production tenants.

### Understanding the BC Data Model

The Business Central data model is not intuitive. Dimension posting, the general ledger entry structure, the way documents move through status flows — these require experience to work with correctly. A developer who does not understand why you cannot delete a ledger entry, or how posting groups connect documents to accounts, will introduce subtle bugs that accounting staff find weeks later.

### Integration Experience

Most BC projects involve some kind of external integration — a webshop, a logistics platform, a Power BI report. Ask whether they have built custom API pages, worked with OAuth 2.0 against BC online, and handled pagination and error recovery in integration flows. Surface-level REST API knowledge is common; solid BC-specific integration experience is less so.

### On-Premises vs. Cloud

These are meaningfully different environments. BC online (SaaS) has stricter extension rules, mandatory AppSource validation for published apps, and different deployment workflows. On-premises gives more flexibility but requires server knowledge. If your project is cloud-based, confirm the developer has deployed to BC online, not just on-premises installations.

## Red Flags to Watch For

**No published extensions or production references.** Sandbox experience is not the same as production experience. If a developer cannot point to extensions running in live customer environments, treat that as a gap.

**Vague about upgrade paths.** Ask how they handle upgrading a custom extension when Microsoft ships a new BC version. If they do not have a clear answer about upgrade codeunits and dependency versioning, they have not managed a long-running extension.

**Over-reliance on base application modification.** Some developers still try to modify base application objects directly rather than using the extension model. This is incompatible with BC online and will cause problems at upgrade.

**No mention of telemetry or error handling.** Production extensions fail. A developer who does not talk about Application Insights, error handling, and monitoring has not been responsible for keeping an extension running after deployment.

## Subcontracting Through a Partner

Many Microsoft Partners bring in freelance BC developers for specific workstreams — custom extensions, upgrade projects, integrations — where they need specialist capacity without adding permanent headcount. If you are a Partner looking for a subcontractor, the same criteria apply, but also ask about experience working within an existing project context: picking up undocumented code, fitting into a delivery timeline, and communicating clearly about scope and blockers.

The BC freelance market is thin. When you find someone who combines technical depth with the ability to work independently and communicate clearly with non-technical stakeholders, that is worth prioritising.

Looking for a Business Central developer for a specific project? [Get in touch](/contact) — I work directly with businesses and Microsoft Partners across Europe.
