# AI Customer Support & Lead CRM screenshots

These are actual 1440 × 1000 application captures fetched from [the project repository](https://github.com/adam-Dev2002/AI-Customer-Lead-CRM-System/tree/72638e8e2c955014d989d99fe44a45e47bcf3bca/docs/images/setup), pinned to commit `72638e8e2c955014d989d99fe44a45e47bcf3bca`.

The repository's [capture script](https://raw.githubusercontent.com/adam-Dev2002/AI-Customer-Lead-CRM-System/72638e8e2c955014d989d99fe44a45e47bcf3bca/scripts/capture-setup-docs.mjs) creates an isolated local workspace with mock authentication, ClearFlow Demo Plumbing, 16 fictional sample leads, and `example.com` email addresses. Customers are marked Sample in the interface. Counts, approval states, and delivery labels are illustrative. No production customer records or real email delivery appear in these images.

The supplied ClearFlow Gemini workflow matches the repository's documented source SHA-256. Its 128 nodes include 118 automation nodes and 10 notes. The portfolio renders diagrams from that private export without publishing its parameters or account bindings.

Refresh these pinned screenshots with `node scripts/fetch-customer-support.mjs`. To create fresh captures after frontend changes, use the upstream capture script in an isolated checkout, review its fictional output, and then update the pinned revision. `provenance.json` records each source URL, route, dimensions, and SHA-256.

| Image | Application view |
| --- | --- |
| dashboard.png | `/` |
| leads.png | `/leads` |
| inbox.png | `/inbox` |
| reply-review.png | `/inbox?view=replies` |
| follow-ups.png | `/follow-ups` |
| settings.png | `/settings` |
