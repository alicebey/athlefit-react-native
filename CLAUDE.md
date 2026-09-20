# Claude Code Project Context — Athlefit mobile

@AGENTS.md

End-to-end map of the whole system (mobile + backend + DB, flows, gotchas): `../CLAUDE.md`.

## Mobile quick orientation (Claude notes)

- Entry: `index.js → App.js → src/Router/index.js` (Stack: Splash → Landing → Login/Signup → Starter → Main tabs).
- All network calls go through `src/Service/apiClient.js`; screens never call `fetch` or Firebase data APIs directly.
- DTO → legacy key mapping lives only in `venueService.js`, `bookingService.js`, `userService.js`.
- Location comes from the `Nearby` tab (`setLocation` in the Zustand store); Home/Search sort by Haversine.
- Booking times: always format with `Utils/VenueTime` (WIB); OrderField sends the availability slot `startAt` unchanged.
- Screen folder names with spaces (`Change Password`) must be quoted in shell commands.
