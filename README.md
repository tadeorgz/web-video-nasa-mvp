# juxtacrop — From orbit to your field

A frontend presentation of a NASA Space Apps concept: help farmers explore crop rotations under changing conditions, connecting Earth observations with local knowledge.

The experience starts with a scroll-driven journey from Earth to Iowa. It then becomes a top-down field interface: boundaries draw themselves, crop cards move from a compact catalog into parcels, seasons change, and illustrative dry/wet layers reveal different questions to consider.

## Run locally

Requires Node.js 20 or later. No dependency installation, API keys or backend are required; browser libraries and media are included locally.

```sh
npm start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). Keep the terminal running. For a different port:

```sh
node server.mjs --port 4300
```

Use a local HTTP server rather than opening `index.html` through `file://`. Any static host that serves ES modules and the included assets can serve this project.

## Experience

- A realistic NASA Earth texture, geographic outlines and a transition toward Iowa.
- Local USGS/USDA aerial imagery with three illustrative parcels.
- Scroll-controlled boundary drawing and simulated crop placement; visitors do not need to drag or edit anything.
- Corn and soybeans in the initial season, followed by an illustrative rye cover crop and a new campaign.
- Subtle map rotation, pan and zoom. Labels and controls remain upright.
- Conceptual dry/wet overlays, source links, a concept film and the student team.
- Responsive layouts, keyboard navigation, reduced-motion support and a static fallback (`?view=static`).

After reaching the 2D field, the WebGL render loop stops. The field presentation uses HTML, SVG and CSS, driven deterministically by the scroll position.

## Edit

- `config.js`: video URL, poster, caption track and accompanying note. Video settings apply on reload.
- `index.html`: English presentation content, team and static layout.
- `timeline.js`: camera keyframes and map transformations.
- `field-model.js`: reversible crop placement and campaign states.
- `field-map.js`, `map.css`: map, labels, crop cards and compact controls.
- `scene.js`: Earth and the geographic descent.

## Validate

```sh
npm test
npm run check
```

Tests cover deterministic scroll sampling, continuous camera handoffs, staged assignments, cover crops, campaign changes, reduced-motion states and source references.

## Status and provenance

This is a presentation prototype. Alex, parcel boundaries, crop assignments, seasons and scenario overlays are illustrative. There are no live NASA integrations, weather forecasts, yield predictions or agronomic recommendations.

The current 110-second film is an earlier interface animation: Spanish on-screen text, former Campo Vivo branding and a demonstration field in Uruguay. English scene descriptions are included as a caption track and transcript. Its geography is distinct from the Iowa presentation.

The field basemap is real aerial imagery from [USGS/USDA NAIP, The National Map](https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer), with 2023 source records, retrieved November 14, 2026. Geographic extent and source records are retained in `assets/iowa-aerial-metadata.json`. The displayed boundaries and crop layers do not describe the actual farm.

Earth imagery: [NASA Blue Marble Next Generation](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/), July 2004. Country and state outlines: Natural Earth, public domain. Three.js: MIT, see `vendor/THREE-LICENSE.txt`. Outfit: SIL Open Font License, see `assets/Outfit-OFL.txt`. Video imagery, music and effects credits: `assets/VIDEO-CREDITS.md` and the website footer.

## Team

Manuela Guedez, Ignacio Carbajal, Guillermo Tula and Tadeo Rodriguez. Software developers and students at Universidad Católica del Uruguay (UCU).

Independent student concept for NASA Space Apps 2026. No NASA endorsement.
