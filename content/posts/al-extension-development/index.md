---
title: 'AL Extension Development for Business Central: What It Is and Why It Matters'
description: 'AL extension development is how Business Central is customised without modifying base code. Here is what the extension model means for your project, and what good AL development looks like in practice.'
date: '2025-05-08'
draft: false
slug: '/pensieve/al-extension-development'
tags:
  - Business Central
  - AL
  - Extensions
  - Development
---

## The Old Way vs. The Extension Model

Anyone who has worked with Dynamics NAV remembers the old approach: modify the base application directly. Add a field to a table, change the logic in a codeunit, alter a page. It worked, but the cost showed up at upgrade time — every customisation had to be manually reconciled with the new version of the base app.

AL extension development is Microsoft's answer to that problem. Instead of touching the base application, you write separate packages — extensions — that sit alongside it. Your code extends tables, subscribes to events, and adds pages without owning the objects it modifies. When Microsoft ships a new BC version, your extension upgrades independently. The base application is theirs; the business logic is yours.

## What AL Extensions Can Do

### Extending Existing Objects

The most common use case. You need a new field on the Item table, a new action on the Sales Order page, or a different calculation in the posting routine. In AL, you do this with table extensions, page extensions, and event subscribers — no copies, no merges.

```al
tableextension 50100 ItemExt extends Item
{
    fields
    {
        field(50100; "Custom Reference"; Code[20])
        {
            Caption = 'Custom Reference';
            DataClassification = CustomerContent;
        }
    }
}
```

### Building New Functionality

Extensions are not limited to modifications. You can build entirely new tables, pages, reports, and APIs within an extension. A warehouse label printing module, a custom approval workflow, a supplier portal integration — all of these live as separate extensions with their own version lifecycle.

### Event-Driven Integration

BC exposes hundreds of publisher events that fire at key moments — before a sales order posts, after a payment is applied, when an item is shipped. Your extension subscribes to these events and runs your code at the right time. This is the primary pattern for integrating business logic without coupling tightly to the base app.

## What Makes AL Development Go Wrong

### Direct modification thinking

Developers coming from C/AL sometimes try to replicate what they used to do — essentially writing procedural modifications and wrapping them in extension syntax. AL's extension model requires a different design approach. If your extension is fighting the base application rather than extending it, the architecture is wrong.

### Missing upgrade logic

AL extensions have version properties and upgrade codeunits. These exist for a reason. When your extension updates and the data schema changes, upgrade code handles the migration. Extensions that ship without upgrade logic cause silent data problems during deployment.

### Overusing permissions

Every extension declares its permission set. Overly broad permissions are a security risk. Overly narrow permissions break functionality in ways that are hard to debug. Getting this right requires understanding the full execution context of your extension.

### No telemetry

Business Central has first-class support for Application Insights telemetry. Extensions that do not instrument their critical paths leave you flying blind when something fails in production.

## AppSource vs. Per-Tenant Extensions

There are two deployment models. AppSource extensions are published through Microsoft's marketplace and must pass technical validation. They follow stricter rules but can be sold to any BC tenant.

Per-tenant extensions (PTEs) are deployed directly to a specific tenant. They have more flexibility but are the customer's responsibility to maintain and upgrade. Most bespoke development work results in a PTE.

If you are building a product for multiple customers, AppSource is the right target. If you are solving a specific business problem for one company, a PTE is usually faster and cheaper.

## Picking the Right Developer

AL extension development is a specialist skill. The BC development community is smaller than mainstream web development, and the gap between someone who can write AL syntax and someone who understands the BC data model, posting routines, and upgrade lifecycle is significant. Ask for examples of extensions they have deployed to production tenants, not just sandbox demos.

Working on a customisation or extension for Business Central? [Get in touch](/contact) — I build AL extensions for European businesses and Microsoft Partners.
