import { useEffect, useRef, useState } from 'react'
import BookingBar from '../components/BookingBar'
import ResponsiveImage from '../components/ResponsiveImage'
import Link from '../router/Link'
import { images } from '../data/images'
import { homeMedia } from '../data/homeMedia'
import { brand, destinations, hotels, mice } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

const bookableHotelOrder = [
  'grand-mogador-agdal',
  'grand-mogador-menara',
  'grand-mogador-sea-view-tanger',
  'grand-mogador-aqua-resort',
  'mogador-menzah',
]

const homeCopy = {
  fr: {
    intro: { skip: 'Passer l’introduction', label: 'Depuis 1999 · Maroc' },
    hero: {
      eyebrow: 'Mogador Hotels & Resorts · Maroc · Depuis 1999',
      title: ['Le Maroc au cœur.', 'L’hospitalité en héritage.'],
      text: 'Depuis plus de vingt-cinq ans, Mogador imagine des maisons où la générosité marocaine se vit dans chaque geste, chaque matière et chaque rencontre.',
      primary: 'Entrer dans notre histoire',
      secondary: 'Explorer nos maisons',
      pause: 'Mettre le film en pause',
      play: 'Lire le film',
      scroll: 'Découvrir le Groupe',
      facts: [['1999', 'L’histoire commence'], ['12', 'maisons marocaines'], ['05', 'horizons à vivre']],
    },
    manifesto: {
      eyebrow: 'Le Groupe Mogador',
      statement: ['Mogador n’est pas une destination.', 'C’est une manière marocaine de recevoir.'],
      title: 'Une collection née ici, ouverte sur le monde.',
      text: 'Nos hôtels ont leurs propres rythmes, leurs propres paysages et leurs propres histoires. Ils partagent une attention sincère, le respect du patrimoine et le désir de faire de chaque séjour une rencontre avec le Maroc.',
      action: 'Découvrir qui nous sommes',
      since: 'Depuis',
      caption: 'Le geste d’accueil, signature de toutes nos maisons.',
    },
    story: {
      eyebrow: 'Notre histoire',
      title: 'Un fil rouge relie toutes nos maisons.',
      text: 'Mogador grandit sans perdre son point de départ : une hospitalité marocaine accessible, généreuse et profondément humaine.',
      chapters: [
        ['1999', 'L’origine', 'Une ambition marocaine prend forme : créer des lieux où le voyageur se sent attendu, reconnu et pleinement accueilli.'],
        ['Aujourd’hui', 'L’envergure', 'Douze hôtels, cinq destinations et 1 800 collaborateurs font vivre une même culture de service.'],
        ['Demain', 'La transmission', 'Faire rayonner le patrimoine, innover avec justesse et contribuer à un tourisme plus responsable.'],
      ],
    },
    values: {
      eyebrow: 'Notre vision en actes',
      title: 'Ce que l’on ressent avant même de le nommer.',
      text: 'Survolez, touchez ou parcourez chaque engagement pour entrer dans la culture Mogador.',
      items: [
        ['L’attention', 'Voir la personne avant le client.', 'Écouter, anticiper et personnaliser les détails qui rendent un séjour naturellement fluide.'],
        ['La transmission', 'Faire vivre le Maroc, sans le figer.', 'Préserver les gestes, les matières et les récits tout en les inscrivant dans le présent.'],
        ['Le collectif', 'Recevoir est une histoire d’équipe.', 'La solidarité et le partage entre 1 800 collaborateurs donnent sa cohérence à l’expérience.'],
        ['L’adaptabilité', 'Évoluer avec les usages.', 'Innover avec discernement pour rester simple, utile et proche des attentes de chaque voyageur.'],
        ['Le respect', 'Grandir de manière responsable.', 'Agir avec équité envers nos clients, nos équipes, nos partenaires et les territoires qui nous accueillent.'],
      ],
    },
    numbers: {
      eyebrow: 'Mogador en un regard',
      labels: ['hôtels', 'destinations', 'chambres', 'collaborateurs'],
    },
    destinations: {
      eyebrow: 'Nos horizons',
      title: 'Cinq façons de ressentir le Maroc.',
      text: 'De l’Atlas à l’Atlantique, chaque ville révèle une lumière différente et la même générosité.',
      label: 'Destination Mogador',
      explore: 'Découvrir la destination',
      stay: 'Préparer mon séjour',
      hotelSingular: 'maison',
      hotelPlural: 'maisons',
      names: { marrakech: 'Marrakech', casablanca: 'Casablanca', tanger: 'Tanger', agadir: 'Agadir', essaouira: 'Essaouira' },
      descriptions: {
        marrakech: 'La ville rouge, l’Atlas et l’énergie des grands rendez-vous. Marrakech concentre le plus vaste éventail d’expériences Mogador.',
        casablanca: 'Une escale urbaine et fluide où affaires, architecture contemporaine et art de vivre atlantique avancent au même rythme.',
        tanger: 'La baie, la plage et le détroit composent une respiration méditerranéenne entre deux continents.',
        agadir: 'La lumière atlantique, la marina et le soleil installent un séjour simple, doux et tourné vers l’océan.',
        essaouira: 'Le vent, les remparts et l’esprit riad dessinent une parenthèse intime au tempo de l’Atlantique.',
      },
    },
    experiences: {
      eyebrow: 'L’art de vivre Mogador',
      title: 'Des instants qui restent après le voyage.',
      text: 'La chambre n’est qu’un commencement. Le souvenir se construit dans un rituel, autour d’une table ou dans un éclat de rire partagé.',
      action: 'Vivre l’expérience',
      all: 'Explorer toutes les expériences',
      items: [
        ['Rituels', 'Retrouver le temps.', 'Hammams, soins et gestes inspirés des traditions marocaines invitent le corps à ralentir.'],
        ['La table', 'Partager le Maroc.', 'Des cuisines généreuses et des salons vivants font de chaque repas un moment de rencontre.'],
        ['Ensemble', 'Créer des souvenirs.', 'Piscines, Aqua Fun et espaces pour les plus jeunes laissent à chacun son propre rythme.'],
      ],
    },
    collection: {
      eyebrow: 'La collection',
      title: 'Cinq adresses à réserver. Une même signature.',
      text: 'Palace face à l’Atlas, adresse urbaine, refuge en bord de mer ou séjour en famille : choisissez l’atmosphère qui vous ressemble.',
      all: 'Voir les 5 hôtels',
      details: 'Entrer dans la maison',
      book: 'Voir les disponibilités',
      index: 'Sélectionner une maison',
      fallback: 'Une adresse singulière, portée par le sens de l’accueil et les services Mogador.',
    },
    mice: {
      eyebrow: 'Réunions & événements',
      title: 'Les grands projets méritent un lieu à leur mesure.',
      text: 'À Marrakech, le Grand Palais des Congrès et les équipes Mogador orchestrent congrès, séminaires, lancements et célébrations dans des espaces pensés pour rassembler.',
      action: 'Découvrir les espaces',
      quote: 'Construire mon événement',
      caption: 'Grand Palais des Congrès · Marrakech',
      statLabels: ['sur quatre niveaux', 'places', 'places en amphithéâtre', 'places en plénière', 'salles de sous-commission'],
    },
    booking: {
      eyebrow: 'Réservation officielle',
      title: 'Lorsque l’histoire devient voyage.',
      text: 'Choisissez votre maison et vos dates. Votre recherche se poursuit directement sur le moteur sécurisé de l’hôtel sélectionné.',
      proof: [
        ['Direct', 'Sans intermédiaire'],
        ['Serein', 'Moteur officiel sécurisé'],
        ['Humain', 'Une équipe reste joignable'],
      ],
    },
    final: {
      eyebrow: 'Mogador Hotels & Resorts',
      title: 'Le Maroc vous attend. Nous aussi.',
      text: 'Douze maisons, cinq horizons et une même attention pour donner du sens à votre prochain séjour.',
      primary: 'Choisir ma maison',
      secondary: 'Parler à l’équipe Mogador',
    },
  },
  en: {
    intro: { skip: 'Skip introduction', label: 'Since 1999 · Morocco' },
    hero: {
      eyebrow: 'Mogador Hotels & Resorts · Morocco · Since 1999',
      title: ['Morocco at heart.', 'Hospitality as heritage.'],
      text: 'For more than twenty-five years, Mogador has imagined hotels where Moroccan generosity lives in every gesture, material and encounter.',
      primary: 'Enter our story',
      secondary: 'Explore our hotels',
      pause: 'Pause film',
      play: 'Play film',
      scroll: 'Discover the Group',
      facts: [['1999', 'The story begins'], ['12', 'Moroccan hotels'], ['05', 'horizons to experience']],
    },
    manifesto: {
      eyebrow: 'The Mogador Group',
      statement: ['Mogador is not a destination.', 'It is a Moroccan way of welcoming.'],
      title: 'A collection born here, open to the world.',
      text: 'Our hotels have their own rhythms, landscapes and stories. They share sincere attention, respect for heritage and the desire to make every stay an encounter with Morocco.',
      action: 'Discover who we are',
      since: 'Since',
      caption: 'The welcoming gesture, shared by every Mogador hotel.',
    },
    story: {
      eyebrow: 'Our story',
      title: 'One red thread connects every Mogador hotel.',
      text: 'Mogador continues to grow without losing its starting point: accessible, generous and deeply human Moroccan hospitality.',
      chapters: [
        ['1999', 'The origin', 'A Moroccan ambition takes shape: create places where every traveller feels expected, recognised and fully welcome.'],
        ['Today', 'The scale', 'Twelve hotels, five destinations and 1,800 team members bring one service culture to life.'],
        ['Tomorrow', 'The legacy', 'Celebrate heritage, innovate with purpose and contribute to more responsible tourism.'],
      ],
    },
    values: {
      eyebrow: 'Our vision in action',
      title: 'What you feel before you can name it.',
      text: 'Hover, tap or move through each commitment to enter the Mogador culture.',
      items: [
        ['Attention', 'See the person before the guest.', 'Listen, anticipate and personalise the details that make a stay naturally effortless.'],
        ['Transmission', 'Keep Morocco alive, never frozen.', 'Preserve gestures, materials and stories while giving them a place in the present.'],
        ['Togetherness', 'Hospitality is a team story.', 'Solidarity and sharing among 1,800 people give the experience its coherence.'],
        ['Adaptability', 'Move with new ways of travelling.', 'Innovate with judgement to remain simple, useful and close to every guest’s expectations.'],
        ['Respect', 'Grow responsibly.', 'Act fairly towards guests, teams, partners and the places that welcome us.'],
      ],
    },
    numbers: {
      eyebrow: 'Mogador at a glance',
      labels: ['hotels', 'destinations', 'rooms', 'team members'],
    },
    destinations: {
      eyebrow: 'Our horizons',
      title: 'Five ways to feel Morocco.',
      text: 'From the Atlas to the Atlantic, each city reveals a different light and the same generosity.',
      label: 'Mogador destination',
      explore: 'Discover the destination',
      stay: 'Plan my stay',
      hotelSingular: 'hotel',
      hotelPlural: 'hotels',
      names: { marrakech: 'Marrakech', casablanca: 'Casablanca', tanger: 'Tangier', agadir: 'Agadir', essaouira: 'Essaouira' },
      descriptions: {
        marrakech: 'The red city, the Atlas and the energy of landmark events. Marrakech brings together the widest range of Mogador experiences.',
        casablanca: 'A fluid urban stop where business, contemporary architecture and an Atlantic way of life move at the same pace.',
        tanger: 'The bay, beach and strait create a Mediterranean breath between two continents.',
        agadir: 'Atlantic light, the marina and year-round sun set an easy pace facing the ocean.',
        essaouira: 'Wind, ramparts and riad spirit shape an intimate interlude at the rhythm of the Atlantic.',
      },
    },
    experiences: {
      eyebrow: 'The Mogador way of life',
      title: 'Moments that remain after the journey.',
      text: 'The room is only a beginning. Memories take shape in a ritual, around a table or in shared laughter.',
      action: 'Live the experience',
      all: 'Explore every experience',
      items: [
        ['Rituals', 'Make time slow down.', 'Hammams, treatments and gestures inspired by Moroccan traditions invite the body to pause.'],
        ['The table', 'Share Morocco.', 'Generous cooking and lively lounges turn every meal into an encounter.'],
        ['Together', 'Create memories.', 'Pools, Aqua Fun and spaces for younger guests let everyone enjoy their own rhythm.'],
      ],
    },
    collection: {
      eyebrow: 'The collection',
      title: 'Five bookable hotels. One signature.',
      text: 'An Atlas-facing palace, an urban address, a seaside retreat or family escape: choose the atmosphere that feels like you.',
      all: 'View all 5 hotels',
      details: 'Enter this hotel',
      book: 'Check availability',
      index: 'Select a hotel',
      fallback: 'A singular address shaped by Mogador hospitality and thoughtful service.',
    },
    mice: {
      eyebrow: 'Meetings & events',
      title: 'Ambitious projects deserve a place to match.',
      text: 'In Marrakech, the Grand Palais des Congrès and Mogador teams orchestrate congresses, seminars, launches and celebrations in spaces designed to bring people together.',
      action: 'Discover the venues',
      quote: 'Plan my event',
      caption: 'Grand Palais des Congrès · Marrakech',
      statLabels: ['across four levels', 'seats', 'amphitheatre seats', 'plenary seats', 'breakout rooms'],
    },
    booking: {
      eyebrow: 'Official booking',
      title: 'When the story becomes a journey.',
      text: 'Choose your hotel and dates. Your search continues directly through the selected hotel’s secure booking engine.',
      proof: [['Direct', 'No intermediary'], ['Secure', 'Official booking engine'], ['Human', 'A team remains available']],
    },
    final: {
      eyebrow: 'Mogador Hotels & Resorts',
      title: 'Morocco is waiting. So are we.',
      text: 'Twelve hotels, five horizons and the same attention to give meaning to your next stay.',
      primary: 'Choose my hotel',
      secondary: 'Speak to the Mogador team',
    },
  },
  ar: {
    intro: { skip: 'تجاوز المقدمة', label: 'منذ 1999 · المغرب' },
    hero: {
      eyebrow: 'فنادق ومنتجعات موغادور · المغرب · منذ 1999',
      title: ['المغرب في القلب.', 'والضيافة إرثنا.'],
      text: 'منذ أكثر من خمسة وعشرين عاما، تصنع موغادور بيوتا تنبض فيها الكرامة المغربية في كل لفتة ومادة ولقاء.',
      primary: 'ادخلوا حكايتنا',
      secondary: 'اكتشفوا فنادقنا',
      pause: 'إيقاف الفيلم مؤقتا',
      play: 'تشغيل الفيلم',
      scroll: 'اكتشفوا المجموعة',
      facts: [['1999', 'بداية الحكاية'], ['12', 'بيتا مغربيا'], ['05', 'آفاق لاكتشافها']],
    },
    manifesto: {
      eyebrow: 'مجموعة موغادور',
      statement: ['موغادور ليست مجرد وجهة.', 'إنها طريقة مغربية في الاستقبال.'],
      title: 'مجموعة ولدت هنا وانفتحت على العالم.',
      text: 'لكل فندق إيقاعه ومنظره وحكايته، وتجمعها عناية صادقة بالضيف واحترام للتراث ورغبة في جعل كل إقامة لقاء حقيقيا مع المغرب.',
      action: 'اكتشفوا من نحن',
      since: 'منذ',
      caption: 'لفتة الاستقبال هي توقيع كل بيوت موغادور.',
    },
    story: {
      eyebrow: 'حكايتنا',
      title: 'خيط أحمر يصل بين جميع بيوتنا.',
      text: 'تكبر موغادور من دون أن تفقد أصلها: ضيافة مغربية كريمة وقريبة وإنسانية.',
      chapters: [
        ['1999', 'البداية', 'طموح مغربي يرى النور: ابتكار أماكن يشعر فيها كل مسافر بأنه منتظر ومعروف ومرحب به.'],
        ['اليوم', 'الحضور', 'اثنا عشر فندقا وخمس وجهات و1800 متعاون يحيون ثقافة خدمة واحدة.'],
        ['غدا', 'الاستمرار', 'إبراز التراث والابتكار بوعي والمساهمة في سياحة أكثر مسؤولية.'],
      ],
    },
    values: {
      eyebrow: 'رؤيتنا في الواقع',
      title: 'ما نشعر به قبل أن نسميه.',
      text: 'مرروا المؤشر أو المسوا أو تنقلوا بين الالتزامات لاكتشاف ثقافة موغادور.',
      items: [
        ['العناية', 'نرى الإنسان قبل النزيل.', 'نصغي ونتوقع ونعتني بالتفاصيل التي تجعل الإقامة سلسة بطبيعتها.'],
        ['النقل', 'نحيي المغرب من دون أن نجمده.', 'نحفظ الإيماءات والمواد والحكايات ونمنحها مكانها في الحاضر.'],
        ['روح الفريق', 'الضيافة حكاية جماعية.', 'التضامن والتشارك بين 1800 متعاون يمنحان التجربة انسجامها.'],
        ['المرونة', 'نتطور مع طرق السفر.', 'نبتكر بوعي لنظل قريبين من توقعات كل ضيف.'],
        ['الاحترام', 'نكبر بمسؤولية.', 'نتعامل بإنصاف مع ضيوفنا وفرقنا وشركائنا والأماكن التي تحتضننا.'],
      ],
    },
    numbers: {
      eyebrow: 'موغادور في أرقام',
      labels: ['فندقا', 'وجهات', 'غرفة', 'متعاونا'],
    },
    destinations: {
      eyebrow: 'آفاقنا',
      title: 'خمس طرق لاكتشاف المغرب.',
      text: 'من الأطلس إلى المحيط، تكشف كل مدينة ضوءا مختلفا وكرما واحدا.',
      label: 'وجهة موغادور',
      explore: 'اكتشفوا الوجهة',
      stay: 'حضّروا إقامتكم',
      hotelSingular: 'فندق',
      hotelPlural: 'فنادق',
      names: { marrakech: 'مراكش', casablanca: 'الدار البيضاء', tanger: 'طنجة', agadir: 'أكادير', essaouira: 'الصويرة' },
      descriptions: {
        marrakech: 'المدينة الحمراء والأطلس وطاقة اللقاءات الكبرى. تجمع مراكش أوسع تجارب موغادور.',
        casablanca: 'محطة حضرية تجمع الأعمال والهندسة المعاصرة وأسلوب الحياة الأطلسي بإيقاع واحد.',
        tanger: 'الخليج والشاطئ والمضيق يمنحون طنجة نسمة متوسطية بين قارتين.',
        agadir: 'ضوء الأطلسي والمارينا والشمس يصنعون إقامة هادئة بإيقاع المحيط.',
        essaouira: 'الرياح والأسوار وروح الرياض ترسم استراحة حميمة على إيقاع الأطلسي.',
      },
    },
    experiences: {
      eyebrow: 'فن العيش في موغادور',
      title: 'لحظات تبقى بعد انتهاء الرحلة.',
      text: 'الغرفة ليست سوى البداية. تتكون الذكرى في طقس عافية أو حول مائدة أو في ضحكة مشتركة.',
      action: 'عيشوا التجربة',
      all: 'اكتشفوا كل التجارب',
      items: [
        ['الطقوس', 'استعيدوا هدوء الوقت.', 'حمامات وعلاجات مستوحاة من التقاليد المغربية تدعو الجسد إلى التمهل.'],
        ['المائدة', 'شاركوا المغرب.', 'مطابخ سخية وصالونات حية تجعل كل وجبة لحظة لقاء.'],
        ['معا', 'اصنعوا الذكريات.', 'مسابح وأكوا فن وفضاءات للصغار تمنح كل فرد إيقاعه الخاص.'],
      ],
    },
    collection: {
      eyebrow: 'مجموعة الفنادق',
      title: 'خمسة فنادق للحجز. توقيع واحد.',
      text: 'قصر أمام الأطلس أو عنوان حضري أو ملاذ على البحر أو إقامة عائلية: اختاروا الأجواء التي تشبهكم.',
      all: 'عرض الفنادق الخمسة',
      details: 'ادخلوا إلى الفندق',
      book: 'تحققوا من التوفر',
      index: 'اختاروا فندقا',
      fallback: 'عنوان متفرد تحمله ضيافة موغادور وخدماتها المتأنية.',
    },
    mice: {
      eyebrow: 'الاجتماعات والفعاليات',
      title: 'المشاريع الكبرى تستحق مكانا يليق بها.',
      text: 'في مراكش، يرافق قصر المؤتمرات الكبير وفرق موغادور المؤتمرات والندوات والإطلاقات والاحتفالات في فضاءات صممت للجمع بين الناس.',
      action: 'اكتشفوا الفضاءات',
      quote: 'خططوا لفعاليتكم',
      caption: 'قصر المؤتمرات الكبير · مراكش',
      statLabels: ['على أربعة طوابق', 'مقعدا', 'مقعدا في المدرج', 'مقعدا في القاعة', 'قاعة فرعية'],
    },
    booking: {
      eyebrow: 'الحجز الرسمي',
      title: 'عندما تصبح الحكاية رحلة.',
      text: 'اختاروا الفندق والتواريخ، ثم تابعوا مباشرة عبر محرك الحجز الآمن للفندق المحدد.',
      proof: [['مباشر', 'دون وسيط'], ['آمن', 'محرك حجز رسمي'], ['إنساني', 'فريق قريب منكم']],
    },
    final: {
      eyebrow: 'فنادق ومنتجعات موغادور',
      title: 'المغرب ينتظركم. ونحن أيضا.',
      text: 'اثنا عشر فندقا وخمسة آفاق وعناية واحدة تمنح إقامتكم المقبلة معنى خاصا.',
      primary: 'اختاروا فندقكم',
      secondary: 'تحدثوا مع فريق موغادور',
    },
  },
}

function Arrow({ direction = 'forward' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === 'down' ? 'M12 4v15M6 13l6 6 6-6' : 'M4 12h15M13 6l6 6-6 6'} />
    </svg>
  )
}

function moveSelection(event, index, length, setSelection, getId) {
  let next = index
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % length
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + length) % length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = length - 1
  else return

  event.preventDefault()
  setSelection(next)
  window.requestAnimationFrame(() => document.getElementById(getId(next))?.focus())
}

export default function HomePage({ t, lang }) {
  const [introComplete, setIntroComplete] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [activeValue, setActiveValue] = useState(0)
  const [activeDestination, setActiveDestination] = useState(0)
  const [activeHotel, setActiveHotel] = useState(0)
  const videoRef = useRef(null)
  const copy = homeCopy[lang] || homeCopy.fr

  useSeo({ title: t.home.seoTitle, description: t.home.seoDescription, lang })

  const currentDestination = destinations[activeDestination] || destinations[0]
  const currentValue = copy.values.items[activeValue]
  const bookableHotels = bookableHotelOrder.map((slug) => hotels.find((hotel) => hotel.slug === slug)).filter(Boolean)
  const currentHotel = bookableHotels[activeHotel] || bookableHotels[0]
  const currentDestinationHotelCount = bookableHotels.filter((hotel) => hotel.destination === currentDestination.name).length

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setIntroComplete(true)
      return undefined
    }
    const timer = window.setTimeout(() => setIntroComplete(true), 1450)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || copy.values.items.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveValue((current) => (current + 1) % copy.values.items.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [copy.values.items.length])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || bookableHotels.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveHotel((current) => (current + 1) % bookableHotels.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [bookableHotels.length])

  const toggleVideo = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      if (videoRef.current.ended || videoRef.current.currentTime >= videoRef.current.duration) videoRef.current.currentTime = 0
      videoRef.current.play().then(() => setVideoPlaying(true)).catch(() => setVideoPlaying(false))
    } else {
      videoRef.current.pause()
      setVideoPlaying(false)
    }
  }

  const resetVideo = () => {
    if (videoRef.current) videoRef.current.currentTime = 0
    setVideoPlaying(false)
  }

  return (
    <div className="gm-home gm-home-divine">
      <div className={`gm-home-intro ${introComplete ? 'is-complete' : ''}`} aria-hidden={introComplete}>
        <div className="gm-home-intro__line" />
        <img src={images.brand.logoWhite} alt="" />
        <span>{copy.intro.label}</span>
        <button type="button" onClick={() => setIntroComplete(true)}>{copy.intro.skip}</button>
      </div>

      <section className={`gm-divine-hero${videoPlaying ? ' is-film-playing' : ''}`} aria-labelledby="home-hero-title">
        <div className="gm-divine-hero__media" aria-hidden="true">
          <img src={homeMedia.hero.poster} alt="" fetchPriority="high" />
          <video
            ref={videoRef}
            src={homeMedia.hero.video}
            poster={homeMedia.hero.poster}
            muted
            playsInline
            preload="metadata"
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onEnded={resetVideo}
          />
        </div>
        <div className="gm-divine-hero__veil" aria-hidden="true" />
        <div className="gm-divine-hero__mark" aria-hidden="true">
          <img src={images.brand.mark} alt="" />
          <span />
        </div>
        <div className="gm-divine-hero__content" aria-hidden={videoPlaying} inert={videoPlaying ? true : undefined}>
          <span className="gm-home-eyebrow gm-divine-hero__eyebrow">{copy.hero.eyebrow}</span>
          <h1 id="home-hero-title">
            <span>{copy.hero.title[0]}</span>
            <span>{copy.hero.title[1]}</span>
          </h1>
          <p>{copy.hero.text}</p>
          <div className="gm-home-actions">
            <Link className="gm-home-cta gm-home-cta--light" to="#heritage">{copy.hero.primary}<Arrow /></Link>
            <Link className="gm-home-link gm-home-link--light" to="#collection">{copy.hero.secondary}</Link>
          </div>
        </div>
        <div className="gm-divine-hero__facts" aria-label={copy.numbers.eyebrow} aria-hidden={videoPlaying}>
          {copy.hero.facts.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}
        </div>
        <Link className="gm-divine-hero__scroll" to="#heritage" aria-hidden={videoPlaying} tabIndex={videoPlaying ? -1 : undefined}><span>{copy.hero.scroll}</span><Arrow direction="down" /></Link>
        <button className="gm-divine-hero__control" type="button" onClick={toggleVideo} aria-label={videoPlaying ? copy.hero.pause : copy.hero.play}>
          <span aria-hidden="true" className={videoPlaying ? 'is-playing' : ''} />
          {videoPlaying ? copy.hero.pause : copy.hero.play}
        </button>
      </section>

      <section id="heritage" className="gm-manifesto" aria-labelledby="home-manifesto-title">
        <div className="gm-manifesto__statement reveal">
          <span className="gm-home-eyebrow">{copy.manifesto.eyebrow}</span>
          <p id="home-manifesto-title">
            <span>{copy.manifesto.statement[0]}</span>
            <strong>{copy.manifesto.statement[1]}</strong>
          </p>
        </div>
        <div className="gm-manifesto__composition">
          <figure className="gm-manifesto__primary gm-media-reveal reveal">
            <img src={homeMedia.story.hospitality} alt={copy.manifesto.caption} loading="eager" decoding="async" />
            <figcaption>{copy.manifesto.caption}</figcaption>
          </figure>
          <figure className="gm-manifesto__detail gm-media-reveal reveal">
            <img src={homeMedia.story.craft} alt="Détail du patrimoine architectural marocain" loading="eager" decoding="async" />
          </figure>
          <div className="gm-manifesto__seal reveal" aria-hidden="true">
            <img src={images.brand.mark} alt="" />
            <span>{copy.manifesto.since}</span>
            <strong>1999</strong>
          </div>
          <div className="gm-manifesto__copy reveal">
            <h2>{copy.manifesto.title}</h2>
            <p>{copy.manifesto.text}</p>
            <Link className="gm-home-link" to="/a-propos">{copy.manifesto.action}<Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="gm-story" aria-labelledby="home-story-title">
        <header className="gm-home-heading reveal">
          <span className="gm-home-eyebrow">{copy.story.eyebrow}</span>
          <h2 id="home-story-title">{copy.story.title}</h2>
          <p>{copy.story.text}</p>
        </header>
        <div className="gm-story__chapters">
          <div className="gm-story__thread" aria-hidden="true"><span /></div>
          {copy.story.chapters.map(([marker, title, text]) => (
            <article className="gm-story__chapter reveal" key={title}>
              <span>{marker}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-values" aria-labelledby="home-values-title">
        <div className="gm-values__media">
          {homeMedia.values.map((image, index) => (
            <img className={index === activeValue ? 'is-active' : ''} src={image} alt="" loading="lazy" decoding="async" key={image} />
          ))}
          <span aria-hidden="true">{String(activeValue + 1).padStart(2, '0')} / 05</span>
        </div>
        <div className="gm-values__body">
          <header className="reveal">
            <span className="gm-home-eyebrow gm-home-eyebrow--sand">{copy.values.eyebrow}</span>
            <h2 id="home-values-title">{copy.values.title}</h2>
            <p>{copy.values.text}</p>
          </header>
          <div className="gm-values__tabs" role="tablist" aria-orientation="vertical">
            {copy.values.items.map(([label, title], index) => (
              <button
                id={`home-value-${index}`}
                className={index === activeValue ? 'is-active' : ''}
                type="button"
                role="tab"
                aria-selected={index === activeValue}
                aria-controls="home-value-panel"
                tabIndex={index === activeValue ? 0 : -1}
                onMouseEnter={() => setActiveValue(index)}
                onFocus={() => setActiveValue(index)}
                onClick={() => setActiveValue(index)}
                onKeyDown={(event) => moveSelection(event, index, copy.values.items.length, setActiveValue, (next) => `home-value-${next}`)}
                key={label}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
                <small>{title}</small>
                <i aria-hidden="true"><Arrow /></i>
              </button>
            ))}
          </div>
          <div id="home-value-panel" className="gm-values__panel" role="tabpanel" aria-labelledby={`home-value-${activeValue}`} aria-live="polite">
            <strong>{currentValue[1]}</strong>
            <p>{currentValue[2]}</p>
          </div>
        </div>
      </section>

      <section id="group-numbers" className="gm-numbers-home" aria-label={copy.numbers.eyebrow}>
        <span className="gm-home-eyebrow gm-home-eyebrow--sand reveal">{copy.numbers.eyebrow}</span>
        <div>
          {['12', '05', '3 000', '1 800'].map((value, index) => (
            <article className="reveal" key={value + copy.numbers.labels[index]}>
              <strong>{value}</strong><span>{copy.numbers.labels[index]}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="destinations" className="gm-destinations-home" aria-labelledby="home-destinations-title">
        <header className="gm-home-heading gm-home-heading--split reveal">
          <div><span className="gm-home-eyebrow">{copy.destinations.eyebrow}</span><h2 id="home-destinations-title">{copy.destinations.title}</h2></div>
          <p>{copy.destinations.text}</p>
        </header>
        <div className="gm-destination-stage reveal">
          <div className="gm-destination-stage__media">
            {destinations.map((destination, index) => (
              <img
                className={index === activeDestination ? 'is-active' : ''}
                src={homeMedia.destinations[destination.slug] || destination.image}
                alt={copy.destinations.names[destination.slug]}
                loading="lazy"
                decoding="async"
                key={destination.slug}
              />
            ))}
            <span className="gm-destination-stage__count" aria-hidden="true">{String(activeDestination + 1).padStart(2, '0')}<i />{String(destinations.length).padStart(2, '0')}</span>
          </div>
          <div className="gm-destination-stage__content">
            <div className="gm-destination-stage__tabs" role="tablist" aria-label={t.nav.destinations}>
              {destinations.map((destination, index) => (
                <button
                  id={`home-destination-${destination.slug}`}
                  className={index === activeDestination ? 'is-active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={index === activeDestination}
                  aria-controls="home-destination-panel"
                  tabIndex={index === activeDestination ? 0 : -1}
                  onMouseEnter={() => setActiveDestination(index)}
                  onFocus={() => setActiveDestination(index)}
                  onClick={() => setActiveDestination(index)}
                  onKeyDown={(event) => moveSelection(event, index, destinations.length, setActiveDestination, (next) => `home-destination-${destinations[next].slug}`)}
                  key={destination.slug}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>{copy.destinations.names[destination.slug]}
                </button>
              ))}
            </div>
            <article id="home-destination-panel" role="tabpanel" aria-labelledby={`home-destination-${currentDestination.slug}`} aria-live="polite">
              <span>{copy.destinations.label}</span>
              <h3>{copy.destinations.names[currentDestination.slug]}</h3>
              <p>{copy.destinations.descriptions[currentDestination.slug]}</p>
              <small>{currentDestinationHotelCount} {currentDestinationHotelCount === 1 ? copy.destinations.hotelSingular : copy.destinations.hotelPlural}</small>
              <div className="gm-home-actions">
                <Link className="gm-home-link gm-home-link--light" to={`/destinations#${currentDestination.slug}`}>{copy.destinations.explore}<Arrow /></Link>
                {currentDestinationHotelCount ? <Link className="gm-home-cta gm-home-cta--outline" to="#reservation" data-destination={currentDestination.name}>{copy.destinations.stay}</Link> : null}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="experiences" className="gm-experiences-home" aria-labelledby="home-experiences-title">
        <header className="gm-home-heading gm-home-heading--split reveal">
          <div><span className="gm-home-eyebrow">{copy.experiences.eyebrow}</span><h2 id="home-experiences-title">{copy.experiences.title}</h2></div>
          <div><p>{copy.experiences.text}</p><Link className="gm-home-link" to="/experiences">{copy.experiences.all}<Arrow /></Link></div>
        </header>
        <div className="gm-experiences-home__grid">
          {copy.experiences.items.map(([label, title, text], index) => (
            <Link className="gm-home-moment reveal" to="/experiences" key={label}>
              <figure><img src={homeMedia.experiences[index]} alt={title} loading="lazy" decoding="async" /></figure>
              <div>
                <span>{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <strong>{copy.experiences.action}<Arrow /></strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="collection" className="gm-collection-home" aria-labelledby="home-collection-title">
        <header className="gm-home-heading gm-home-heading--split reveal">
          <div><span className="gm-home-eyebrow gm-home-eyebrow--sand">{copy.collection.eyebrow}</span><h2 id="home-collection-title">{copy.collection.title}</h2></div>
          <div><p>{copy.collection.text}</p><Link className="gm-home-link gm-home-link--light" to="/hotels">{copy.collection.all}<Arrow /></Link></div>
        </header>
        <div className="gm-collection-stage reveal">
          <figure className="gm-collection-stage__media">
            {bookableHotels.map((hotel, index) => (
              <ResponsiveImage className={index === activeHotel ? 'is-active' : ''} src={homeMedia.hotels[hotel.slug] || hotel.image} sizes="100vw" alt={hotel.name} loading="lazy" decoding="async" key={hotel.slug} />
            ))}
            <figcaption><span>{currentHotel.destination}</span><strong>{currentHotel.category}</strong></figcaption>
          </figure>
          <div className="gm-collection-stage__index" aria-label={copy.collection.index}>
            {bookableHotels.map((hotel, index) => (
              <button
                className={index === activeHotel ? 'is-active' : ''}
                type="button"
                aria-pressed={index === activeHotel}
                onMouseEnter={() => setActiveHotel(index)}
                onFocus={() => setActiveHotel(index)}
                onClick={() => setActiveHotel(index)}
                key={hotel.slug}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{hotel.name}</strong>
                <small>{hotel.destination}</small>
              </button>
            ))}
          </div>
          <article className="gm-collection-stage__copy" aria-live="polite">
            <span>{currentHotel.destination} · {currentHotel.category}</span>
            <h3>{currentHotel.name}</h3>
            <p>{lang === 'fr' ? currentHotel.baseline : copy.collection.fallback}</p>
            <div className="gm-home-actions">
              <Link className="gm-home-link gm-home-link--light" to={`/hotels/${currentHotel.slug}`}>{copy.collection.details}<Arrow /></Link>
              <Link className="gm-home-cta" to="#reservation" data-hotel={currentHotel.name} data-destination={currentHotel.destination}>{copy.collection.book}</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="gm-mice-home" aria-labelledby="home-mice-title">
        <figure className="gm-mice-home__media gm-media-reveal reveal">
          <img src={homeMedia.mice} alt={copy.mice.caption} loading="lazy" decoding="async" />
          <figcaption>{copy.mice.caption}</figcaption>
        </figure>
        <div className="gm-mice-home__copy reveal">
          <span className="gm-home-eyebrow">{copy.mice.eyebrow}</span>
          <h2 id="home-mice-title">{copy.mice.title}</h2>
          <p>{copy.mice.text}</p>
          <div className="gm-home-actions">
            <Link className="gm-home-cta" to="/reunions-evenements">{copy.mice.action}<Arrow /></Link>
            <Link className="gm-home-link" to="/contact?request=mice">{copy.mice.quote}</Link>
          </div>
        </div>
        <div className="gm-mice-home__stats">
          {mice.stats.map((stat, index) => <article className="reveal" key={stat.label}><strong>{stat.value}</strong><span>{copy.mice.statLabels[index]}</span></article>)}
        </div>
      </section>

      <section id="direct-booking" className="gm-booking-home" aria-labelledby="home-booking-title">
        <div className="gm-booking-home__heading reveal">
          <span className="gm-home-eyebrow gm-home-eyebrow--sand">{copy.booking.eyebrow}</span>
          <h2 id="home-booking-title">{copy.booking.title}</h2>
          <p>{copy.booking.text}</p>
        </div>
        <div className="gm-booking-home__form reveal">
          <BookingBar t={t} lang={lang} variant="hero" source="home_booking_final" />
        </div>
        <div className="gm-booking-home__proof" aria-label={t.common.directBooking}>
          {copy.booking.proof.map(([title, text]) => <span className="reveal" key={title}><strong>{title}</strong><small>{text}</small></span>)}
        </div>
      </section>

      <section className="gm-final-home" aria-labelledby="home-final-title">
        <img src={images.brand.mark} alt="" aria-hidden="true" />
        <span className="gm-home-eyebrow gm-home-eyebrow--sand reveal">{copy.final.eyebrow}</span>
        <h2 id="home-final-title" className="reveal">{copy.final.title}</h2>
        <p className="reveal">{copy.final.text}</p>
        <div className="gm-home-actions reveal">
          <Link className="gm-home-cta gm-home-cta--light" to="/hotels">{copy.final.primary}<Arrow /></Link>
          <a className="gm-home-link gm-home-link--light" href={`tel:${brand.phone.replaceAll(' ', '')}`}>{copy.final.secondary}</a>
        </div>
      </section>
    </div>
  )
}
