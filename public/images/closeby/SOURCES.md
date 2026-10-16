# Closeby screenshot provenance

Project: https://github.com/adam-Dev2002/closeby
Source revision: 926b13689a0ba86a7a0d8d0a7e944f2eeb22bf2e

- closeby-map.png: original repository capture, https://github.com/adam-Dev2002/closeby/blob/926b13689a0ba86a7a0d8d0a7e944f2eeb22bf2e/docs/screenshots/map-android.png. Android emulator screenshot, 720 x 1280. Generic My Phone profile and synthetic emulator GPS; no personal account. Original image bytes retained, including Google attribution.
- closeby-history.png: original repository capture, https://github.com/adam-Dev2002/closeby/blob/926b13689a0ba86a7a0d8d0a7e944f2eeb22bf2e/docs/activity-history-web.png. Browser screenshot, 390 x 1000. Local test account Alice, synthetic routes and stops. Original image bytes retained, including map attribution.
- closeby-spaces.png: fresh local browser capture of the private-space onboarding screen; no signed-in account or members.
- closeby-safety.png: fresh local browser capture of Safety & speed, synthetic stationary GPS (0 km/h), no emergency alerts sent.
- closeby-settings.png: fresh local browser capture of Settings, local mode with location sharing off.
- closeby-sign-in.png: fresh local browser capture of sign-in UI, no account entered and Firebase setup pending.
- closeby-overview.png: 1600 x 1000 CSS composition using the real map, history and safety screenshots above. Copy/layout around the phone screens is presentation, not app UI.

Fresh browser captures use 390 x 844 CSS pixels at device scale 2 (780 x 1688 output), Asia/Manila timezone. Browser GPS is fixed at 14.55, 121.02 for local testing. Firebase authentication/database endpoints are blocked. No production account, real device location, or cloud data writes are used. The current Google web renderer needs a browser API key, so map/history use the project's published captures rather than a fabricated or incomplete basemap.

Regenerate: run a local-only Closeby web preview with EXPO_NO_DOTENV=1, then run node scripts/capture-closeby.mjs [http://127.0.0.1:8085]. The script retrieves the two original captures from the pinned source revision and generates the other screenshots using Playwright/Chrome.
