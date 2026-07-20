import { createHash, createHmac } from 'node:crypto'
import { spawn } from 'node:child_process'
import { mkdir, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const apiKey = process.env.HOTELRUNNER_API_KEY
if (!apiKey) throw new Error('HOTELRUNNER_API_KEY is required')
const properties = [
  ['grand-mogador-menara', 'grand-mogador-menara'],
  ['grand-mogador-sea-view-tanger', 'grand-mogador-sea-view-spa-1'],
  ['grand-mogador-agdal', 'grand-mogador-agdal'],
  ['grand-mogador-aqua-resort', 'mogador-aqua-fun'],
  ['mogador-menzah', 'mogador-menzah'],
]

const roomNames = {
  'grand-mogador-sea-view-tanger': {
    'Superior Room Mountain View': 'Chambre Supérieure Vue Montagne',
    'Superior Room Sea View': 'Chambre Supérieure Vue Mer',
    'Deluxe Room Sea View': 'Chambre Deluxe Vue Mer',
    'Junior Suite Mountain View': 'Suite Junior Vue Montagne',
    'Junior Suite Sea View': 'Suite Junior Vue Mer',
    'Senior Suite': 'Suite Sénior',
  },
  'grand-mogador-aqua-resort': {
    'Twin Room': 'Chambre Twin Vue Jardin',
    'Twin Room Pool View': 'Chambre Twin Vue Piscine',
    'Family Room': 'Chambre Familiale',
    'Junior suite': 'Suite Junior Vue Jardin',
    'Junior suite pool view': 'Suite Junior Vue Piscine',
    'Double room': 'Chambre Double Vue Jardin',
    'Double room with pool view': 'Chambre Double Vue Piscine',
  },
}

const frenchDescriptions = {
  'grand-mogador-sea-view-tanger': {
    'Superior Room Mountain View': "Cette chambre climatisée avec vue montagne dispose d'un balcon, d'un minibar et d'une salle de bains privative.",
    'Superior Room Sea View': "Cette chambre climatisée avec vue mer dispose d'un balcon, d'un minibar et d'une salle de bains privative.",
    'Deluxe Room Sea View': "Cette chambre Deluxe avec vue mer dispose d'un balcon, d'une salle de bains avec douche et d'équipements pensés pour un séjour confortable.",
    'Junior Suite Mountain View': "Cette suite climatisée avec vue montagne dispose d'un balcon, d'une télévision, d'un téléphone et d'un minibar.",
    'Junior Suite Sea View': "Cette suite climatisée avec vue mer dispose d'un balcon, d'une télévision, d'un téléphone et d'un minibar.",
    'Senior Suite': "Cette suite spacieuse et climatisée offre une vue mer ou montagne, avec balcon, télévision, téléphone et minibar.",
  },
  'grand-mogador-aqua-resort': {
    'Twin Room': "Cette chambre Twin dispose d'un balcon avec vue jardin, de la climatisation et d'un minibar.",
    'Twin Room Pool View': "Cette chambre Twin dispose d'un balcon avec vue piscine, d'un coin salon et d'un minibar.",
    'Family Room': "Cette chambre familiale avec balcon offre des vues sur les jardins et la ville, avec des équipements adaptés aux familles.",
    'Junior suite': "Cette suite Junior avec vue jardin comprend un balcon, un coin salon, un minibar et une salle de bains avec baignoire et douche.",
    'Junior suite pool view': "Cette suite Junior avec vue piscine comprend un balcon, un coin salon, un minibar et une salle de bains avec baignoire et douche.",
    'Double room': "Cette chambre Double dispose d'un balcon avec vue jardin, de la climatisation et d'un minibar.",
    'Double room with pool view': "Cette chambre Double dispose d'un balcon avec vue piscine, d'un coin salon et d'un minibar.",
  },
}

const amenityNames = {
  king: 'Très grand lit double',
  twin: 'Deux lits simples',
  'twin extra long': 'Deux lits simples extra-longs',
  'garden view': 'Vue jardin',
  'mountain view': 'Vue montagne',
  'sea view': 'Vue mer',
  'pool view': 'Vue piscine',
  'city view': 'Vue ville',
  balcony: 'Balcon',
  'bathroom with bathtub': 'Salle de bains avec baignoire',
  'bathroom with shower': 'Salle de bains avec douche',
  'bedside telephone': 'Téléphone',
  'cable tv': 'Télévision par câble',
  'wireless internet': 'Wi-Fi',
  'remote control tv': 'Télévision avec télécommande',
  'satellite tv': 'Télévision par satellite',
  minibar: 'Minibar',
  'individually controlled air conditioning': 'Climatisation individuelle',
  bathrobes: 'Peignoirs',
  hairdryer: 'Sèche-cheveux',
  'room safe': 'Coffre-fort',
  'non-smoking': 'Chambre non-fumeur',
  'pets not allowed': 'Animaux non admis',
  bidet: 'Bidet',
  'free toiletries': "Produits d'accueil",
  'flat screen': 'Télévision à écran plat',
  'baby cot': 'Lit bébé',
  'smoke detector': 'Détecteur de fumée',
  'seating area': 'Coin salon',
  'internet sans-fil (wifi)': 'Wi-Fi',
  'tv par satellite': 'Télévision par satellite',
  'coffre-fort dans la chambre': 'Coffre-fort',
  'defense de fumer': 'Chambre non-fumeur',
  'climatisation a controle individuel': 'Climatisation individuelle',
  'climatisation a controle central': 'Climatisation centrale',
  'lit king size (tres grand lit double)': 'Très grand lit double',
  'lit queen size olempique (grand lit double)': 'Grand lit double',
  'television par cable (a louert)': 'Télévision par câble',
  'peignoirs (a louer)': 'Peignoirs',
  'articles de toilette gratuits': "Produits d'accueil",
  'ecran plat': 'Télévision à écran plat',
}

const serviceNames = {
  '24-hour room service': 'Service en chambre 24h/24',
  'room service': 'Service en chambre',
  'business center': "Centre d'affaires",
  'children playground': 'Aire de jeux pour enfants',
  '24-hour security': 'Sécurité 24h/24',
  'fitness center': 'Centre de fitness',
  terrace: 'Terrasse',
  'sun terrace': 'Terrasse ensoleillée',
  'outdoor pool': 'Piscine extérieure',
  pool: 'Piscine',
  parking: 'Parking',
  'public parking': 'Parking public',
  'luggage storage': 'Bagagerie',
  'baggage storage': 'Bagagerie',
  'baggage handling': 'Service bagages',
  'cable tv': 'Télévision par câble',
  'pets not allowed': 'Animaux non admis',
  'children’s playground': 'Aire de jeux pour enfants',
  "children's playground": 'Aire de jeux pour enfants',
  'smoke detectors': 'Détecteurs de fumée',
  'video surveillance of entrances': 'Vidéosurveillance des entrées',
  'video surveillance of lobby': 'Vidéosurveillance du hall',
  'video surveillance of hallways': 'Vidéosurveillance des couloirs',
  'conference rooms': 'Salles de conférence',
  'adjacent conference center': 'Centre de conférence attenant',
  'banquet facilities': 'Espaces de banquet',
  'meeting facilities': 'Espaces de réunion',
  'heated pool': 'Piscine chauffée',
}

function normalizeKey(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function cleanText(value = '') {
  return value
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function translateLabel(value, dictionary) {
  return dictionary[normalizeKey(value)] || cleanText(value)
}

function challengeFor(host, serverTime) {
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(Math.floor(serverTime / 30)))
  const secret = createHash('md5').update(host).digest('hex')
  const digest = createHmac('sha1', Buffer.from(secret)).update(counter).digest()
  const offset = digest[digest.length - 1] & 15
  return String(digest.readUInt32BE(offset) & 0x7fffffff).slice(-6)
}

function searchDates() {
  const checkin = new Date()
  const checkout = new Date(checkin)
  checkout.setUTCDate(checkout.getUTCDate() + 1)
  const format = (date) => date.toISOString().slice(0, 10)
  return [format(checkin), format(checkout)]
}

async function fetchJson(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.json()
}

async function fetchProperty(slug, code) {
  const host = `https://${code}.hotelrunner.com`
  const base = `${host}/api/v1/bv3`
  const [store, timestamp] = await Promise.all([
    fetchJson(`${base}/infos/store.json?api_key=${apiKey}`),
    fetchJson(`${base}/infos/timestamp.json?api_key=${apiKey}`),
  ])
  const [checkinDate, checkoutDate] = searchDates()
  const availabilityUrl = new URL(`${base}/search/availabilities.json`)
  const query = {
    api_key: apiKey,
    checkin_date: checkinDate,
    checkout_date: checkoutDate,
    day_count: '1',
    room_count: '1',
    total_adult: '2',
    total_child: '0',
  }
  Object.entries(query).forEach(([key, value]) => availabilityUrl.searchParams.set(key, value))
  Object.entries({ adult_count: '2', guest_count: '2', child_count: '0' }).forEach(([key, value]) => {
    availabilityUrl.searchParams.set(`guest_rooms[0][${key}]`, value)
  })
  const availability = await fetchJson(availabilityUrl, {
    headers: {
      'Content-Type': 'text/plain',
      'X-HR-CHALLENGE': challengeFor(host, timestamp.time),
    },
  })
  const rawRooms = [...(availability.available_room_types || []), ...(availability.unavailable_room_types || [])]
  const rooms = [...new Map(rawRooms.map((room) => [room.id, room])).values()]
    .sort((left, right) => left.position - right.position)
    .map((room) => {
      const sourceName = cleanText(room.name)
      const amenities = [...new Set((room.amenities || []).map((item) => translateLabel(item.name, amenityNames)))]
      return {
        name: roomNames[slug]?.[sourceName] || sourceName,
        sourceName,
        description: frenchDescriptions[slug]?.[sourceName] || cleanText(room.description),
        capacity: room.total_capacity || room.guest_capacity || room.room_capacity || null,
        area: room.area || null,
        bedrooms: room.bedrooms || null,
        bathrooms: room.bathrooms || null,
        amenities,
        photos: (room.media || []).map((item) => item.source),
      }
    })
  const gallery = (store.media || []).map((item) => item.source)

  return {
    source: `${host}/bv3/search`,
    image: gallery[0] || store.main_image?.source || rooms[0]?.photos[0],
    gallery,
    services: [...new Set((store.amenities || []).map((item) => translateLabel(item.name, serviceNames)))],
    roomTypes: rooms,
  }
}

const entries = await Promise.all(properties.map(async ([slug, code]) => [slug, await fetchProperty(slug, code)]))
const imageSets = {}
for (const [slug, property] of entries) Object.assign(imageSets, await localizeMedia(slug, property))
const output = `// Generated from the public HotelRunner booking engines on ${new Date().toISOString().slice(0, 10)}.\nexport const hotelRunnerData = ${JSON.stringify(Object.fromEntries(entries), null, 2)}\n\nexport const hotelRunnerImageSets = ${JSON.stringify(imageSets, null, 2)}\n`
await writeFile(new URL('../src/data/hotelRunnerData.js', import.meta.url), output, 'utf8')

async function localizeMedia(slug, property) {
  const media = [...new Set([
    property.image,
    ...property.gallery,
    ...property.roomTypes.flatMap((room) => room.photos),
  ].filter(Boolean))]
  const directory = new URL(`../public/assets/hotelrunner/${slug}/`, import.meta.url)
  const localPaths = new Map()
  const responsiveSets = {}
  const generatedFiles = new Set()
  await mkdir(directory, { recursive: true })
  const existingFiles = await readdir(directory, { withFileTypes: true })
  const existingSets = existingFiles.reduce((sets, entry) => {
    const match = entry.isFile() && entry.name.match(/^(.*)-(\d+)\.webp$/)
    if (!match) return sets
    if (!sets.has(match[1])) sets.set(match[1], [])
    sets.get(match[1]).push(Number(match[2]))
    return sets
  }, new Map())
  console.log(`${slug}: ${media.length} media`)

  for (let index = 0; index < media.length; index += 3) {
    await Promise.all(media.slice(index, index + 3).map(async (source) => {
      const filename = new URL(source).pathname.split('/').pop()
      const stem = filename.replace(/\.[^.]+$/, '')
      const cachedWidths = existingSets.get(stem)?.sort((left, right) => left - right)
      if (cachedWidths?.length && cachedWidths.join() === getCandidateWidths(cachedWidths.at(-1)).join()) {
        const candidates = registerCandidates(slug, stem, cachedWidths, generatedFiles)
        const defaultCandidate = getDefaultCandidate(candidates)
        localPaths.set(source, defaultCandidate.src)
        responsiveSets[defaultCandidate.src] = getSrcSet(candidates)
        return
      }
      const variants = ['original', 'large', 'product'].map((size) => source.replace(/\/photos\/(?:product|large|original)\//, `/photos/${size}/`))
      let response
      for (const candidate of [...new Set(variants)]) {
        try {
          response = await fetch(candidate, {
            headers: {
              Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              Referer: property.source,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
            },
            signal: AbortSignal.timeout(120000),
          })
        } catch (error) {
          console.warn(`Media download failed (${error.name}): ${candidate}`)
          response = null
          continue
        }
        if (response.ok) break
      }
      if (!response?.ok) {
        console.warn(`Skipping unavailable media: ${source}`)
        localPaths.set(source, null)
        return
      }
      const sourceBuffer = Buffer.from(await response.arrayBuffer())
      const { width } = await getImageDimensions(sourceBuffer)
      const widths = getCandidateWidths(width)
      await createWebpVariants(sourceBuffer, directory, stem, widths)
      const candidates = registerCandidates(slug, stem, widths, generatedFiles)
      const defaultCandidate = getDefaultCandidate(candidates)
      localPaths.set(source, defaultCandidate.src)
      responsiveSets[defaultCandidate.src] = getSrcSet(candidates)
    }))
    console.log(`${slug}: ${Math.min(index + 3, media.length)}/${media.length}`)
  }

  await Promise.all(existingFiles
    .filter((entry) => entry.isFile() && !generatedFiles.has(entry.name))
    .map((entry) => unlink(new URL(entry.name, directory))))

  property.gallery = property.gallery.map((source) => localPaths.get(source)).filter(Boolean)
  property.roomTypes.forEach((room) => {
    room.photos = room.photos.map((source) => localPaths.get(source)).filter(Boolean)
  })
  property.image = localPaths.get(property.image) || property.gallery[0] || property.roomTypes.find((room) => room.photos.length)?.photos[0]
  return responsiveSets
}

function getCandidateWidths(sourceWidth) {
  const maximum = Math.min(sourceWidth, 1920)
  return [...new Set([640, 960, 1440, 1920].filter((width) => width < maximum).concat(maximum))]
}

function registerCandidates(slug, stem, widths, generatedFiles) {
  return widths.map((width) => {
    const filename = `${stem}-${width}.webp`
    generatedFiles.add(filename)
    return { src: `/assets/hotelrunner/${slug}/${filename}`, width }
  })
}

function getDefaultCandidate(candidates) {
  return [...candidates].reverse().find((candidate) => candidate.width <= 1440) || candidates.at(-1)
}

function getSrcSet(candidates) {
  return candidates.map((candidate) => `${candidate.src} ${candidate.width}w`).join(', ')
}

async function getImageDimensions(buffer) {
  const output = await runProcess('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    'pipe:0',
  ], buffer)
  const stream = JSON.parse(output).streams?.[0]
  if (!stream?.width || !stream?.height) throw new Error('Unable to read HotelRunner image dimensions')
  return stream
}

async function createWebpVariants(buffer, directory, stem, widths) {
  const splitInputs = widths.map((_, index) => `[source${index}]`).join('')
  const filters = [`[0:v]split=${widths.length}${splitInputs}`]
  widths.forEach((width, index) => filters.push(`[source${index}]scale=${width}:-2:flags=lanczos[output${index}]`))
  const args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', 'pipe:0', '-filter_complex', filters.join(';')]
  const outputPaths = widths.map((width) => ({
    temporary: fileURLToPath(new URL(`${stem}-${width}.tmp.webp`, directory)),
    final: fileURLToPath(new URL(`${stem}-${width}.webp`, directory)),
  }))
  widths.forEach((width, index) => {
    args.push(
      '-map', `[output${index}]`,
      '-frames:v', '1',
      '-c:v', 'libwebp',
      '-preset', 'picture',
      '-quality', '84',
      '-compression_level', '5',
      outputPaths[index].temporary,
    )
  })
  await runProcess('ffmpeg', args, buffer)
  await Promise.all(outputPaths.map(async ({ temporary, final }) => {
    await unlink(final).catch((error) => {
      if (error.code !== 'ENOENT') throw error
    })
    await rename(temporary, final)
  }))
}

function runProcess(command, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true })
    const stdout = []
    const stderr = []
    child.stdout.on('data', (chunk) => stdout.push(chunk))
    child.stderr.on('data', (chunk) => stderr.push(chunk))
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve(Buffer.concat(stdout).toString('utf8'))
      else reject(new Error(`${command} exited with ${code}: ${Buffer.concat(stderr).toString('utf8')}`))
    })
    child.stdin.end(input)
  })
}
