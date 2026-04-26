---
title: 'Business Central Upgrade: A Practical Guide for NAV and Older BC Users'
description: 'Planning a Business Central upgrade from NAV or an older BC version? This practical guide covers what to expect, common blockers, and how to approach the migration without disrupting your business.'
date: '2025-05-01'
draft: false
slug: '/pensieve/business-central-upgrade'
tags:
  - Business Central
  - NAV
  - Upgrade
  - ERP
---

## What a Business Central Upgrade Actually Involves

A Business Central upgrade is not a software update — it is a migration. Whether you are moving from Dynamics NAV 2013, NAV 2018, or a Business Central version from a couple of years ago, the process involves upgrading your database schema, converting your customisations, and validating that your business data comes across cleanly. Understanding this distinction early saves a lot of frustration later.

The good news is that Microsoft has invested heavily in making BC the long-term home for NAV customers. The platform is stable, the upgrade paths are well-documented, and extensions have replaced the old C/AL modification model. The harder part is dealing with the real-world state of most NAV installations: years of modifications baked directly into base objects.

## The Main Upgrade Paths

### NAV 2009 / 2013 / 2015

These require a multi-step upgrade. You cannot jump straight to the current BC version in one pass. The typical approach is to upgrade to an intermediate version (usually NAV 2018 or BC 14) and then continue to the current release. This adds time and cost, but there is no shortcut.

### NAV 2016 / 2017 / 2018

Single-step upgrade to BC on-premises is supported. From there, you can migrate to BC online (SaaS) using the cloud migration tools Microsoft provides. This is the most common scenario for European SMBs moving off NAV.

### Older BC Versions (BC 14 – BC 21)

If you are on a supported BC version, the upgrade is mostly technical — schema changes, extension updates, and testing. The biggest risk here is third-party extensions that have not been kept current by their publishers.

## What Actually Slows Upgrades Down

In practice, the technical lift is rarely the main bottleneck. The problems that add weeks to a project are:

**Undocumented modifications.** If the original developer merged changes directly into base application objects without keeping a change log, it takes significant time to identify what was customised and why.

**Outdated C/AL code.** NAV modifications written in C/AL need to be rewritten as AL extensions. This is not a mechanical translation — it requires understanding the business logic and restructuring it to work with the extension model.

**Data quality issues.** Old NAV databases often carry years of inconsistent data. Dimension entries, posting group mismatches, and orphaned records all need cleaning before the upgrade or they will surface as errors during data migration.

**Third-party add-ons.** If you are running a solution like a WMS, EDI, or payroll module from a third-party publisher, their BC-compatible version needs to be in place before you can go live. Not all publishers are current.

## Cloud vs. On-Premises

Microsoft's clear direction is Business Central online (SaaS). You get automatic twice-yearly updates, no server infrastructure to manage, and access to the full Power Platform ecosystem. For most SMBs in Western Europe, SaaS is the right choice.

On-premises BC still exists and is supported, but it is increasingly a niche case — typically for businesses with regulatory requirements around data residency, or those running complex integrations that are not yet ready for the cloud.

## How Long Does It Take?

A realistic timeline for a NAV 2018 to BC online migration, including one or two moderate customisations:

- Discovery and planning: 1–2 weeks
- Technical upgrade and extension conversion: 3–6 weeks
- Testing and UAT: 2–4 weeks
- Go-live and stabilisation: 1 week

Simpler setups can be done faster. Heavily customised installations with multiple third-party modules take longer. Projects that skip proper UAT almost always have painful go-lives.

## Starting the Conversation

If you are still on NAV, Microsoft's mainstream support for NAV 2018 has ended, which means no new security patches. That is the practical reason most businesses are finally making the move.

A good first step is a discovery engagement — reviewing your current setup, documenting customisations, and producing a realistic project estimate. That gives you something concrete to plan and budget around.

Need help planning or executing a Business Central upgrade? [Get in touch](/contact) — I work with businesses across Europe on exactly this.
