# Version 1 Risk Register

Last updated: April 16, 2026

## Risk: provider mismatch with public expectations
- Description: users may expect real OTP, maps, or payment gateways even though Version 1 uses mock or simplified flows
- Mitigation: keep pilot participation controlled, disclose Version 1 boundaries clearly, do not overstate provider capability

## Risk: fare or payout inconsistency
- Description: a misconfiguration or incomplete payment status could affect driver earnings or operator reporting
- Mitigation: follow the fare and payout SOPs, review completed rides daily, pause settlement on mismatch

## Risk: operator inconsistency
- Description: pilot operators may improvise beyond the approved runbooks
- Mitigation: use the operations handbook, launch playbooks, and incident log for every meaningful exception

## Risk: ride lifecycle inconsistency
- Description: customer, driver, and admin surfaces may disagree on ride state after abnormal flow
- Mitigation: use monitoring checks hourly, investigate affected rides through admin, apply rollback and fallback rules when needed

## Risk: complaint backlog
- Description: complaints could accumulate beyond the target SLA during busy pilot periods
- Mitigation: assign a dedicated support operator, review open complaints hourly, escalate safety and abuse issues immediately

## Risk: legal or regulatory gap
- Description: Version 1 legal and compliance posture may not satisfy broader commercial deployment requirements
- Mitigation: keep launch limited to pilot scope and complete legal review before wider rollout
