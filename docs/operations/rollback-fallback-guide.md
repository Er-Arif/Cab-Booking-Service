# Version 1 Rollback and Fallback Guide

Last updated: April 16, 2026

Use this guide when the pilot cannot continue safely or reliably in its current state.

## Common trigger events
- backend service unavailable
- admin panel unavailable
- persistent booking failure
- ride lifecycle becoming inconsistent
- fare configuration changed incorrectly
- unresolved safety, fraud, or abuse event

## Immediate response
1. Pause new pilot activity if the issue affects booking, rider safety, or ride correctness.
2. Record the incident time, symptoms, and affected surfaces.
3. Confirm whether the issue is config-related, data-related, or runtime-related.
4. Notify the launch lead.

## Fallback actions
- if the issue is only in mobile distribution, continue with admin and backend verification while pausing participant usage
- if the issue is a fare config mistake, revert to the approved pilot baseline before resuming
- if the issue is a complaint or safety escalation, keep the pilot paused for the affected users until reviewed

## Rollback rule
- revert only to the most recent known-good pilot configuration
- never make multiple untracked emergency changes at once
- document who approved the rollback and why

## Resume rule
Resume only after:
- the core issue is understood
- the service is re-verified
- the launch lead approves restart
