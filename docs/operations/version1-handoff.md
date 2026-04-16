# Version 1 Handoff Note

Last updated: April 16, 2026

## Purpose
This handoff note is for future developers, operators, and product owners continuing the project after Version 1 pilot preparation.

## Source-of-truth locations
- Product scope: [../guides/product-scope.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/product-scope.md)
- Business rules: [../guides/business-rules.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/business-rules.md)
- Documentation index: [../README.md](/e:/MyProjects/Cab%20Booking%20Service/docs/README.md)
- Pilot configuration: [../guides/version1-pilot-configuration.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/version1-pilot-configuration.md)
- Operations handbook: [operations-handbook.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/operations-handbook.md)
- Legal pack: [../legal/README.md](/e:/MyProjects/Cab%20Booking%20Service/docs/legal/README.md)

## What should not be changed casually
- approved launch zones and landmarks
- Version 1 fare baseline without documented reason
- commission rules without updating ops docs
- mock-provider boundary without explicitly moving work into Version 2 scope
- legal wording without noting whether legal review has happened

## How to continue safely
- use the phase docs as the project history
- update docs whenever implementation changes a business rule or pilot procedure
- keep Version 1 support changes separate from Version 2 provider-integration work
- preserve operator-facing SOP consistency

## Recommended next development focus
- replace mock providers in a controlled Version 2 milestone
- improve realtime delivery
- strengthen automation and permission granularity
- extend pilot learnings into production architecture choices
