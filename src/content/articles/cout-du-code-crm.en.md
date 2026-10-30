## The test case: a basic CRM

To compare like with like, let's take the same need from one era to the next. A basic CRM for a small business means:

- a record for each contact and company, with the history of your exchanges;
- a sales pipeline, from open quotes to signature;
- tasks and follow-ups, with a reminder when someone gets forgotten;
- a few roles (salesperson, manager), importing your Excel files, and an export.

No built-in artificial intelligence, no link to your accounting. The bare minimum, but shaped around the way you sell rather than the way a software vendor thinks you should.

## Era 1: traditional code, €25,000 to €40,000

That's the range industry guides still give for a basic business CRM. [Sidely](https://www.go-sidely.com/post/combien-coute-un-crm-commercial) puts it between €25,000 and €40,000, and between €50,000 and €100,000 for a full CRM. Each connection to another piece of software, an ERP or an accounting tool, adds [€5,000 to €15,000 according to Sokeo](https://sokeo.fr/cout-crm-entreprise-investissement-rentabilite/).

These amounts come from a simple calculation: days of work multiplied by a day rate. For IT services firms, [La Fabrique du Net](https://www.lafabriquedunet.fr/agences/pages/agences-esn-ssii/tarifs) records rates starting at €320 a day for a junior developer. An agency usually charges €700 to €1,000 a day, project manager and designer included. At 40 days of work, you quickly reach €30,000 or €40,000.

Freelance platforms confirm the order of magnitude. On Codeur.com, a French business looking in 2025 for a [custom CRM to manage memberships](https://www.codeur.com/projects/462449-crm-sur-mesure-adhesion) received quotes averaging €15,400, for an estimated 40 days of work. And those are freelancers, without an agency's overheads.

Why so expensive? Because everything is written by hand: the database, the screens, the forms, the access rights, the tests. A basic CRM is thousands of lines of code, most of them mundane, that still have to be written, reviewed and tested by someone.

## Era 2: no-code, €5,000 to €15,000

From the late 2010s, visual tools like Bubble, Airtable or Softr made it possible to put an application together without writing code. You draw the screens, configure the database and wire up the logic with blocks. A wave of no-code agencies was born from that promise.

Prices followed. According to [La Fabrique du Net's survey](https://www.lafabriquedunet.fr/agences/pages/agences-nocode/tarifs) of 111 projects handed to no-code agencies in France, the median budget is €10,000, and half of the projects fall between €5,000 and €15,000. Some agencies advertise even lower entry prices: [Superforge](https://www.superforge.io/agence-bubble) offers a first Bubble product from €4,900 excl. VAT, and [Noxcod](https://www.noxcod.com/blog/cout-application-bubble-tarif) puts Bubble agencies' hourly rates between €100 and €200 excl. VAT.

The saving was real, but it had a limit: even without writing code, everything still goes through a human brain. Every screen is drawn by hand, every one of your business rules is translated into logic blocks, every edge case is tested one by one.

And a quality product actually takes several brains. A no-code agency usually puts a small team on it: someone to understand the need, someone to design the screens, someone to build and someone to test. Every handoff between them adds conversations, delays and lost information, as we explained in [One point of contact, from need to code](/en/articles/one-person-developer-ai/).

So no-code brought the price down by speeding up the building. But human time stayed at the heart of the invoice.

## Era 3: code with AI, a few thousand euros

Since 2023, AI has been writing real code, in standard languages, that any developer can read and take over. The shift has grown faster than almost anyone expected. In March 2025, Y Combinator, the best-known startup accelerator, said that [for a quarter of its batch, 95% of the code had been written by AI](https://techcrunch.com/2025/03/06/a-quarter-of-startups-in-ycs-current-cohort-have-codebases-that-are-almost-entirely-ai-generated). Lovable, a tool that generates applications from a description, passed [$100 million in annual revenue in eight months](https://tech.eu/2025/07/23/lovable-becomes-fastest-software-company-ever-to-reach-100m-arr/), with a subscription that starts at [$25 a month](https://lovable.dev/pricing).

What do studies say about the time saved? They're more nuanced than the announcements, which is exactly what makes them useful:

- in a [controlled experiment run by Microsoft Research, GitHub and MIT](https://arxiv.org/abs/2302.06590), developers helped by AI wrote a small web server 55.8% faster than the others;
- a [Stanford study covering more than 100,000 developers](https://www.ai.engineer/talks/tbDDYKRFjhk-ai-developer-productivity) measures an average net gain of 15 to 20%, but much higher on new, simple projects than on large existing software;
- on the other hand, the research organisation [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found that experienced developers, working on very large open-source projects they knew inside out, were 19% slower with AI in 2025.

The lesson is clear: AI mostly speeds up work that is new, standard and well scoped. A basic CRM ticks every box. Contact records, forms, filterable lists, access rights: that's exactly the mundane code AI writes best, and it made up most of the bill in era 1.

Public price lists haven't caught up with this change yet, and there is no reliable survey of agencies that build with AI. Our €2,500 to €5,000 range is therefore an estimate, not a market average. As a checkable reference point: at Maniaque, the first version of a custom tool like this CRM costs [€2,500 excl. VAT](/en/offer/#pricing), delivered in 2 to 8 weeks, in real code that belongs to you.

## The three eras side by side

<div class="table-scroll">
<table class="compare">
<thead>
<tr><th scope="col"></th><th scope="col">Traditional code</th><th scope="col">No-code</th><th scope="col">Code with AI</th></tr>
</thead>
<tbody>
<tr><th scope="row">First version</th><td>€25,000 to&nbsp;€40,000</td><td>€5,000 to&nbsp;€15,000</td><td>€2,500 to&nbsp;€5,000</td></tr>
<tr><th scope="row">Typical timeline</th><td>2 to 4 months</td><td>A few weeks</td><td>A few weeks</td></tr>
<tr><th scope="row">You own the code</th><td>Yes</td><td>No, it stays on the platform</td><td>Yes</td></tr>
<tr><th scope="row">Technical limits</th><td>None</td><td>Those of the tool</td><td>None</td></tr>
</tbody>
</table>
</div>

## What doesn't get cheaper

If writing code costs next to nothing, why doesn't a CRM cost $25 a month on Lovable? Because code was never the hard part. Three things keep their price:

- **understanding your need.** Knowing that your salespeople never fill in the "source" field, that one client has two billing addresses, that follow-ups must go out on Tuesdays. AI builds what you describe to it. You still have to describe it right;
- **technical decisions.** Where your data is stored, who can access it, how it's backed up, how the tool will evolve in two years. Code generated without review often works in a demo and breaks in production;
- **the life of the tool.** Software used every day needs fixes, adjustments and new requests. Industry guides budget [5 to 10% of the development cost](https://www.magram.fr/blog/prix-crm-combien-coute-un-logiciel-crm) each year for maintenance alone.

In other words, the bill is shifting. Yesterday, you mostly paid for hours of typing. Today, you mostly pay for judgement: someone who understands your business, makes the right calls and is still there after delivery.

## What it changes for a small business

The question is no longer "can we afford custom software?". For most small businesses, the answer is now yes. The real question becomes: "who will understand the way we work, and stay with us over time?".

That's why our model is a fixed-price first version, then a monthly subscription that covers changes, hosting and maintenance. The cost of code has dropped, and we pass that on. The time spent understanding your business remains the heart of the work.

If you have a CRM, a spreadsheet or a business tool that bugs you, <a data-book="" href="https://calendar.app.google/vFyLbndCK2tUXYibA" target="_blank" rel="noopener">book a free 45-minute audit</a>. You'll find out what your tool would cost today, and whether it's worth it.
