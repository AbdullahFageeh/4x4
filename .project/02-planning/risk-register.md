# Risk Register

| ID | Risk | Category | Probability | Impact | Score | Response Strategy | Mitigation Plan | Owner | Status |
|----|------|----------|-------------|--------|-------|-------------------|-----------------|-------|--------|
| R01 | Google Maps API cost overruns | Technical | Medium | High | 6 | Mitigate | Cache tiles; proxy queries through Supabase edge function; cap daily requests at 100/user; set billing alerts at $50, $100, $200 | Tech Lead | Open |
| R02 | Payment integration delays | Technical | Medium | High | 6 | Mitigate | Use Moyasar hosted checkout (no PCI scope); start integration in Sprint 4; have fallback to manual payment tracking | Tech Lead | Open |
| R03 | Arabic RTL layout bugs | Quality | High | Medium | 6 | Mitigate | Use I18nManager.forceRTL() from day 1; test every screen in both languages; use IBM Plex Sans Arabic; automated RTL snapshot tests | Tech Lead | Open |
| R04 | Real-time chat unreliability | Technical | Medium | Medium | 4 | Mitigate | Use Stream SDK (managed service, SLA); offline queue for messages; graceful degradation to "message will send when online" | Tech Lead | Open |
| R05 | Live location battery drain | Technical | Medium | Medium | 4 | Mitigate | Configurable update intervals (default 30s); use significant-change API when available; user education tooltip; auto-pause after 4h | Tech Lead | Open |
| R06 | Scope creep | Management | High | High | 9 | Avoid | Strict MVP scope in charter; phase gate reviews; any new feature requires PO approval and risk re-assessment | PO | Open |
| R07 | App Store rejection | Compliance | Low | High | 3 | Mitigate | Follow Apple guidelines for background location usage descriptions; provide clear purpose strings; test with TestFlight before submission | Tech Lead | Open |
| R08 | Performance issues on low-end devices | Technical | Medium | Medium | 4 | Mitigate | Performance budget in architecture; test on mid-range Android devices; lazy load screens; optimize images | Tech Lead | Open |
| R09 | Data loss from offline sync conflicts | Technical | Low | High | 3 | Mitigate | WatermelonDB conflict resolution strategies; last-write-wins with user confirmation for critical data; regular cloud backups | Tech Lead | Open |
| R10 | Missing external service credentials | External | High | High | 9 | Accept | Demo mode with sample data works without credentials; clearly document setup requirements; no fake "real" data presented as genuine | PO | Open |

---

## Risk Heat Map

```
        Impact →
        Low    Medium    High
      ┌───────┬────────┬────────┐
High  │       │ R03,R04│ R06    │  ← Probability
      │       │ R05,R08│ R10    │
      ├───────┼────────┼────────┤
Medium│       │ R01,R02│        │
      │       │        │        │
      ├───────┼────────┼────────┤
Low   │       │ R07,R09│        │
      │       │        │        │
      └───────┴────────┴────────┘
```

## Top 3 Risks (Requiring Active Monitoring)

1. **R06 Scope Creep** — High probability, high impact
   - **Action:** PO enforces charter scope; phase gates mandatory
   - **Trigger:** Any feature request not in P0 backlog
   - **Contingency:** Defer to post-MVP if approved

2. **R10 Missing Credentials** — High probability, high impact
   - **Action:** Demo mode works standalone; setup guide in README
   - **Trigger:** API keys not provided by Sprint 3
   - **Contingency:** Use mock data with clear "demo" labels

3. **R01 Google Maps Cost** — Medium probability, high impact
   - **Action:** Aggressive caching, daily caps, billing alerts
   - **Trigger:** 50% of monthly budget consumed
   - **Contingency:** Switch to static map images for some views

---

## Risk Review Cadence
- Reviewed at every sprint retrospective
- Updated when new risks identified
- Escalated if score increases above 6
