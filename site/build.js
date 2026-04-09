import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {toHTML} from '@portabletext/to-html'
import {writeFileSync, mkdirSync, cpSync} from 'fs'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const resolve = (...parts) => join(__dirname, ...parts)

const client = createClient({
  projectId: 'y3glypba',
  dataset: 'production',
  apiVersion: '2026-04-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
const urlFor = (source) => builder.image(source)

// --- Fetch all data ---
async function fetchData() {
  const [settings, starships] = await Promise.all([
    client.fetch(`*[_id == "siteSettings"][0]{ title, tagline, stardatePrefix }`),
    client.fetch(`*[_type == "starship"] | order(name asc) {
      _id,
      name,
      registry,
      slug,
      affiliation,
      excerpt,
      featured,
      image { asset->{ _id, url, metadata { lqip } }, alt },
      body,
      microMachines,
      "shipClass": shipClass->{ title, slug },
      "era": era->{ title, slug }
    }`),
  ])
  return {settings: settings || {title: 'Star Trek Micro Machines', tagline: '', stardatePrefix: '47988.1'}, starships}
}

// --- Portable Text to HTML ---
function renderBody(body) {
  if (!body) return ''
  return toHTML(body, {
    components: {
      types: {
        image: ({value}) => {
          if (!value?.asset) return ''
          const url = urlFor(value).width(800).url()
          const alt = value.alt || ''
          const caption = value.caption || ''
          return `<figure class="lcars-figure">
            <img src="${url}" alt="${alt}" loading="lazy" />
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
          </figure>`
        },
      },
    },
  })
}

// --- Image URL helper ---
function shipImageUrl(image, width = 600) {
  if (!image?.asset) return null
  return urlFor(image).width(width).url()
}

// --- LCARS color by affiliation ---
function affiliationColor(affiliation) {
  const colors = {
    starfleet: '#f1df6f',
    klingon: '#cc6666',
    romulan: '#99cc99',
    cardassian: '#cc9966',
    borg: '#99cccc',
    dominion: '#cc99cc',
    ferengi: '#ff9966',
    other: '#9999ff',
  }
  return colors[affiliation] || '#ff9900'
}

// --- HTML Templates ---
function lcarsHead(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@400;700&family=Chakra+Petch:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <div class="lcars-app">`
}

function lcarsHeader(settings) {
  return `
    <header class="lcars-header">
      <div class="lcars-elbow lcars-elbow-top-left"></div>
      <div class="lcars-bar lcars-bar-top">
        <span class="lcars-title"><a href="/">${settings.title || 'Star Trek Micro Machines'}</a></span>
        <span class="lcars-stardate">STARDATE ${settings.stardatePrefix || '47988.1'}</span>
      </div>
      <div class="lcars-pill lcars-pill-1"></div>
      <div class="lcars-pill lcars-pill-2"></div>
      <div class="lcars-pill lcars-pill-3"></div>
    </header>
    <div class="lcars-sidebar-layout">
      <nav class="lcars-sidebar">
        <div class="lcars-sidebar-block lcars-bg-gold">DATABASE</div>
        <a href="/" class="lcars-sidebar-block lcars-bg-lavender">ALL SHIPS</a>
        <div class="lcars-sidebar-block lcars-bg-blue">MICRO MACHINES</div>
        <div class="lcars-sidebar-block lcars-bg-peach">SHIP CLASSES</div>
        <div class="lcars-sidebar-spacer"></div>
        <div class="lcars-sidebar-block lcars-bg-gold lcars-sidebar-block-end"></div>
      </nav>
      <main class="lcars-main">`
}

function lcarsFooter() {
  return `
      </main>
    </div>
    <footer class="lcars-footer">
      <div class="lcars-bar lcars-bar-bottom"></div>
      <div class="lcars-elbow lcars-elbow-bottom-left"></div>
    </footer>
  </div>
  <script src="/lcars.js"></script>
</body>
</html>`
}

// --- Index page ---
function buildIndexPage(settings, starships) {
  const featured = starships.filter((s) => s.featured)
  const all = starships

  let html = lcarsHead(settings.title || 'Star Trek Micro Machines')
  html += lcarsHeader(settings)

  if (featured.length > 0) {
    html += `<section class="lcars-section">
      <h2 class="lcars-section-title">FEATURED VESSELS</h2>
      <div class="lcars-ship-grid">`
    for (const ship of featured) {
      html += shipCard(ship)
    }
    html += `</div></section>`
  }

  html += `<section class="lcars-section">
    <h2 class="lcars-section-title">ALL VESSELS IN DATABASE</h2>
    <div class="lcars-ship-grid">`
  for (const ship of all) {
    html += shipCard(ship)
  }
  html += `</div></section>`

  html += lcarsFooter()
  return html
}

function shipCard(ship) {
  const imgUrl = shipImageUrl(ship.image, 400)
  const color = affiliationColor(ship.affiliation)
  const slug = ship.slug?.current || ''
  return `
    <a href="/ships/${slug}/" class="lcars-ship-card" style="--card-accent: ${color}">
      ${imgUrl ? `<div class="lcars-ship-card-image"><img src="${imgUrl}" alt="${ship.image?.alt || ship.name}" loading="lazy" /></div>` : '<div class="lcars-ship-card-image lcars-no-image"></div>'}
      <div class="lcars-ship-card-info">
        <div class="lcars-ship-card-accent"></div>
        <h3>${ship.name}</h3>
        ${ship.registry ? `<span class="lcars-registry">${ship.registry}</span>` : ''}
        ${ship.shipClass ? `<span class="lcars-class">${ship.shipClass.title} CLASS</span>` : ''}
      </div>
    </a>`
}

// --- Ship detail page ---
function buildShipPage(settings, ship) {
  const title = `${ship.name} — ${settings.title}`
  const imgUrl = shipImageUrl(ship.image, 800)
  const color = affiliationColor(ship.affiliation)
  const bodyHtml = renderBody(ship.body)

  let html = lcarsHead(title)
  html += lcarsHeader(settings)

  html += `
    <article class="lcars-ship-detail" style="--ship-accent: ${color}">
      <div class="lcars-ship-header">
        <div class="lcars-ship-header-bar" style="background: ${color}"></div>
        <div class="lcars-ship-header-content">
          <h1>${ship.name}</h1>
          ${ship.registry ? `<div class="lcars-registry-large">${ship.registry}</div>` : ''}
          <div class="lcars-ship-meta">
            ${ship.shipClass ? `<span class="lcars-meta-item">${ship.shipClass.title} CLASS</span>` : ''}
            ${ship.era ? `<span class="lcars-meta-item">${ship.era.title}</span>` : ''}
            ${ship.affiliation ? `<span class="lcars-meta-item">${ship.affiliation.toUpperCase()}</span>` : ''}
          </div>
        </div>
      </div>

      ${imgUrl ? `<div class="lcars-ship-image"><img src="${imgUrl}" alt="${ship.image?.alt || ship.name}" /></div>` : ''}

      ${ship.excerpt ? `<p class="lcars-excerpt">${ship.excerpt}</p>` : ''}

      ${bodyHtml ? `<div class="lcars-body">${bodyHtml}</div>` : ''}

      ${ship.microMachines ? buildMicroMachinesPanel(ship.microMachines) : ''}

      <div class="lcars-back-nav">
        <a href="/" class="lcars-button">← RETURN TO DATABASE</a>
      </div>
    </article>`

  html += lcarsFooter()
  return html
}

function buildMicroMachinesPanel(mm) {
  if (!mm.collectionNumber && !mm.scale && !mm.releaseYear && !mm.notes) return ''
  return `
    <div class="lcars-panel">
      <div class="lcars-panel-header">MICRO MACHINES DATA</div>
      <div class="lcars-panel-body">
        <table class="lcars-data-table">
          ${mm.collectionNumber ? `<tr><td>COLLECTION #</td><td>${mm.collectionNumber}</td></tr>` : ''}
          ${mm.scale ? `<tr><td>SCALE</td><td>${mm.scale}</td></tr>` : ''}
          ${mm.releaseYear ? `<tr><td>RELEASE YEAR</td><td>${mm.releaseYear}</td></tr>` : ''}
          ${mm.notes ? `<tr><td>NOTES</td><td>${mm.notes}</td></tr>` : ''}
        </table>
      </div>
    </div>`
}

// --- Build ---
async function build() {
  console.log('🖖 Fetching data from Sanity...')
  const {settings, starships} = await fetchData()
  console.log(`   Found ${starships.length} starships`)

  // Prepare output dirs
  mkdirSync(resolve('dist/ships'), {recursive: true})

  // Copy static assets
  cpSync(resolve('static'), resolve('dist'), {recursive: true})

  // Build index
  writeFileSync(resolve('dist/index.html'), buildIndexPage(settings, starships))
  console.log('   Built index.html')

  // Build ship pages
  for (const ship of starships) {
    const slug = ship.slug?.current
    if (!slug) {
      console.warn(`   ⚠ Skipping ship without slug: ${ship.name}`)
      continue
    }
    mkdirSync(resolve(`dist/ships/${slug}`), {recursive: true})
    writeFileSync(resolve(`dist/ships/${slug}/index.html`), buildShipPage(settings, ship))
    console.log(`   Built ships/${slug}/`)
  }

  console.log(`\n✅ Built ${starships.length + 1} pages into site/dist/`)
}

build().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
