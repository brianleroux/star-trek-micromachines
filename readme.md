# star trek micro machines database

a static blog for star trek micro machines collectibles, themed after the tng lcars interface. powered by sanity for content management and raw html/css/js for the frontend — no frameworks, no fuss.

## project structure

```
├── schemaTypes/     sanity schema definitions
├── site/            static site generator (html/css/js)
├── sanity.config.ts sanity studio config
├── sanity.cli.ts    sanity cli config
├── structure.ts     studio desk structure
├── sanity.blueprint.js   blueprints config (for functions later)
└── readme.md        you are here
```

## getting started

### 1. install dependencies

```bash
npm install
```

### 2. run the studio

```bash
npm run dev
```

this opens sanity studio at `http://localhost:3333`. from there you can:

- create **eras** (tos, tng, ds9, voy, etc.)
- create **ship classes** (galaxy, constitution, defiant, intrepid, etc.)
- create **starships** — the main posts, with images, portable text body, and micro machines collection info
- configure **site settings** (title, tagline, stardate prefix for the lcars header)

### 3. add some content

start with a few eras and ship classes, then add starships. each starship has:

- name and registry number
- ship class and era (references)
- affiliation (starfleet, klingon, romulan, etc.)
- image with alt text
- short excerpt (shown on the index page)
- full article body (portable text with inline images)
- micro machines data panel (collection number, scale, release year, notes)
- featured flag (for homepage highlights)

### 4. build the static site

```bash
npm run site:build
```

this fetches all content from sanity and generates static html into `site/dist/`.

### 5. preview locally

```bash
npm run site:serve
```

opens at `http://localhost:3000` (or whatever port `serve` picks).

## rebuilding

whenever you update content in the studio, just re-run:

```bash
npm run site:build
```

## scripts

| command | what it does |
|---------|-------------|
| npm run dev | start sanity studio |
| npm run site:build | build static site into site/dist/ |
| npm run site:serve | preview the built site locally |
| npm run studio:build | build studio for deployment |
| npm run studio:deploy | deploy studio to sanity cdn |

## the lcars theme

the frontend uses the classic tng lcars aesthetic:

- okuda color palette (gold, lavender, blue, peach, orange)
- antonio font for headers, chakra petch for body text
- rounded elbows, pill buttons, sidebar navigation
- ship cards color-coded by affiliation
- responsive layout that collapses gracefully on mobile

## content model

| type | purpose |
|------|---------|
| starship | main blog posts — one per ship |
| ship class | taxonomy (galaxy, constitution, etc.) |
| era | timeline grouping (tos, tng, ds9, etc.) |
| site settings | singleton for global config |

## blueprints

the root `sanity.blueprint.js` is ready for sanity functions if you want to add automation later (e.g. auto-generate excerpts, notify on publish, etc.).

## deploying

## deploying to github pages

the site auto-deploys to github pages on every push to `main`, and also whenever a starship is created or updated in sanity (via a sanity function that triggers a github actions workflow).

### initial setup

1. push this repo to github

2. enable github pages in your repo settings:
   - go to settings → pages
   - set source to "github actions"

3. create a github personal access token:
   - go to github → settings → developer settings → personal access tokens → fine-grained tokens
   - create a token with "contents: read" and "actions: write" permissions for your repo
   - copy the token

4. set the sanity function environment variables:
   ```bash
   npx sanity functions env add rebuild-site GITHUB_TOKEN your-github-token
   npx sanity functions env add rebuild-site GITHUB_REPO your-username/your-repo-name
   ```

5. deploy the blueprint:
   ```bash
   npx sanity blueprints deploy
   ```

### how it works

- push to `main` → github actions builds the site and deploys to pages
- create/update a starship in sanity → sanity function sends a `repository_dispatch` event to github → same workflow runs → site rebuilds with new content

### testing the function locally

```bash
npx sanity functions test rebuild-site --dataset production --with-user-token
```

this does a dry run and logs what it would do without actually triggering github.

for the studio, run `npm run studio:deploy` to host it on sanity's cdn.
