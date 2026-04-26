---
title: 'Integrating Business Central with External Systems: A Developer's Overview'
description: 'Business Central API integration is how BC connects to e-commerce platforms, logistics providers, CRMs, and custom portals. This is a practical look at the options, the patterns that work, and the common mistakes.'
date: '2025-05-15'
draft: false
slug: '/pensieve/business-central-api-integration'
tags:
  - Business Central
  - API
  - Integration
  - Development
---

## Why Integration Is Almost Always on the Roadmap

Most Business Central implementations are not islands. From day one, clients ask about connecting BC to their webshop, syncing it with a CRM, pushing data to a Power BI dashboard, or pulling inventory from a third-party logistics platform. Business Central API integration is a core part of almost every project.

The platform has good native support for this. The question is which approach to use — and that depends on whether you need real-time data exchange, batch processing, or something in between.

## The Three Main Integration Approaches

### Standard REST APIs (v2.0)

Business Central exposes a set of standard API endpoints out of the box — customers, vendors, items, sales orders, purchase orders, journal lines, and more. These endpoints use OAuth 2.0 for authentication and return JSON. If your integration maps well to these standard entities, you can get a working connection quickly without writing any AL code.

The v2.0 API is the current standard. SOAP web services still exist but are deprecated; avoid starting new integrations on them.

### Custom API Pages

When the standard endpoints do not expose what you need — composite data, calculated fields, custom entities — you write a custom API page in AL. This is a page object of type `API` that exposes exactly the data shape your integration requires.

```al
page 50200 "Item API"
{
    PageType = API;
    APIPublisher = 'contoso';
    APIGroup = 'inventory';
    APIVersion = 'v1.0';
    EntityName = 'item';
    EntitySetName = 'items';
    SourceTable = Item;
    ...
}
```

Custom API pages are versioned, support OData filtering and expansion, and integrate cleanly with Azure Logic Apps, Power Automate, and third-party middleware. This is the right approach for most serious integration work.

### Webhooks and Event-Driven Patterns

For real-time triggers — "notify my e-commerce platform when a shipment is posted" — BC supports webhooks. You register a subscription against an API endpoint, and BC sends a POST to your listener when the data changes.

The limitation is that webhooks only fire on create, update, and delete operations on standard entities. For custom events (e.g., "a specific approval step was completed"), you typically combine a webhook with a custom API endpoint that the external system can then query for details.

## Authentication

OAuth 2.0 with Azure Active Directory (now Entra ID) is mandatory for BC online integrations. The two flows used in practice are:

- **Client credentials** (service-to-service): the integration runs as an application identity, not a user. Right for automated background processes.
- **Authorization code flow**: the integration acts on behalf of a user. Right for interactive applications like portals.

Basic authentication was removed years ago. If you are maintaining an older integration that relied on it, it is already broken or running on a deprecated web service endpoint that will be removed.

## What Goes Wrong

**Unbounded queries.** The standard BC APIs return pages of 20 records by default, up to 1000 with `$top`. Integrations that do not handle pagination correctly miss data silently. Add `$skiptoken`-based pagination from the start.

**Ignoring the `@odata.etag`.** BC uses optimistic concurrency. If you PATCH a record without including the current ETag, the request will fail when the record has been modified since you last read it. This surprises developers who are not used to ERP-grade data integrity requirements.

**No retry logic.** BC online has rate limits and occasional transient errors. An integration without exponential backoff and retry will fail under load or during peak posting periods.

**Hardcoding company names.** BC tenants can have multiple companies. Integrations that hardcode the company name in the URL break as soon as a client renames a company or adds a second one.

**Missing change tracking.** If your integration is batch-based — syncing data every hour — you need a reliable way to detect what changed. The `lastModifiedDateTime` filter on API endpoints is the standard approach. Delta links (OData) are an alternative for more complex cases.

## Middleware vs. Direct Integration

Small integrations between BC and a single external system can often connect directly. As the number of systems grows, a middleware layer — Azure Logic Apps, Azure Service Bus, or a dedicated integration platform — becomes worth the investment. It gives you a central place to monitor, retry, and transform data flows.

For partners building integrations that will be deployed across multiple customer tenants, containerising the integration logic in Azure and connecting via the BC APIs is the standard pattern.

If you need to connect Business Central to an external system and want it done properly, [get in touch](/contact) — API integration is one of the core services I offer.
