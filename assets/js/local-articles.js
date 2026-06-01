// Real, locally-authored Win-Win blog articles.
//
// These are served the same way as Contentful entries: the listing (/vpogledi/),
// the homepage "Z našega bloga" strip and the article detail page (/clanek/)
// all read from here in addition to Contentful. `body` is Markdown and is
// rendered by markdownToHtml() in insights.js (supports ##/### headings,
// **bold**, *italic*, "- " bullet lists and paragraphs).
//
// To add a new post: copy one block, give it a unique `slug`, and write the
// `body` in Markdown. Set `featured: true` on the one post you want as the big
// hero card on the /vpogledi/ page (keep the rest false).

export const LOCAL_ARTICLES = [
  {
    id: "local-5-lastnosti",
    slug: "5-lastnosti-uspesnega-prodajnega-svetovalca",
    title: "5 ključnih lastnosti uspešnega prodajnega svetovalca",
    category: "Karierni nasveti",
    description:
      "Kaj loči top prodajalce od povprečja? Razložimo, katere lastnosti najbolj cenimo pri Win-Win in kako jih razviješ.",
    readTime: "5 min branja",
    featured: true,
    published: true,
    date: "2026-05-22",
    image: new URL("../img/blog-1.jpg", import.meta.url).href,
    imageAlt: "Prodajni svetovalec v pogovoru s stranko",
    body: `Kaj loči vrhunske prodajne svetovalce od povprečja? Po več kot desetletju gradnje prodajnih ekip pri Win-Win smo opazili, da uspeh skoraj nikoli ni stvar sreče ali "prirojenega talenta". Gre za skupek lastnosti, ki se jih da razviti — če veš, na kaj se osredotočiti.

## 1. Disciplina pred motivacijo

Motivacija pride in gre. Disciplina ostane. Najboljši svetovalci se ne zanašajo na to, da bodo vsak dan "dobre volje" — imajo rutino, ki jih nese tudi takrat, ko ni navdiha. Vsak klic, vsak obisk in vsak vnos v CRM je del sistema, ne razpoloženja.

**Praktičen nasvet:** določi si fiksno število kontaktov na dan in jih opravi ne glede na rezultat. Številke se dolgoročno vedno izravnajo v tvojo korist.

## 2. Aktivno poslušanje

Slabi prodajalci govorijo. Dobri sprašujejo in poslušajo. Stranka ti bo skoraj vedno sama povedala, kaj potrebuje in kaj jo skrbi — če ji daš prostor. Tvoja naloga ni "prepričati", ampak razumeti in ponuditi pravo rešitev.

## 3. Odpornost na zavrnitev

V prodaji je "ne" del posla, ne osebni napad. Vrhunski svetovalci zavrnitev ne jemljejo osebno — analizirajo jo, se iz nje učijo in gredo naprej. Vsak "ne" te približa naslednjemu "da".

## 4. Poznavanje produkta

Zaupanje stranke si prislužiš s strokovnostjo. Ko Telemach pakete, pogoje in prednosti poznaš do potankosti, prodaja postane svetovanje. Stranka začuti, da ji pomagaš — ne da ji nekaj "vsiljuješ".

## 5. Usmerjenost k rezultatom

Najboljši poznajo svoje številke: koliko kontaktov, koliko ponudb, koliko sklenitev. Kar meriš, lahko izboljšaš. Ta lastnost je tudi tista, ki loči svetovalce, ki napredujejo v vodje, od tistih, ki ostanejo na mestu.

## Kako te lastnosti razviješ pri Win-Win

Nobene od teh lastnosti ni treba imeti že prvi dan. Naš sistem — strukturirano uvajanje, skripte, CRM in coaching — je zasnovan prav zato, da jih razviješ v praksi, ob podpori izkušenih mentorjev.

Če v sebi prepoznaš vsaj nekaj od naštetega, imaš odlično osnovo za kariero v prodaji. Ostalo se da naučiti.`,
  },
  {
    id: "local-visoke-provizije",
    slug: "kako-dosegati-visoke-provizije",
    title: "Kako dosegati visoke provizije v prodaji telekomunikacij",
    category: "Provizije & rast",
    description:
      "Praktičen vodnik skozi prodajni proces Win-Win — od prvega kontakta do podpisane pogodbe in stabilne mesečne provizije.",
    readTime: "7 min branja",
    featured: false,
    published: true,
    date: "2026-05-15",
    image: new URL("../img/blog-2.jpg", import.meta.url).href,
    imageAlt: "Sodelavka pregleduje prodajne rezultate",
    body: `Provizijski model je za marsikoga strašljiv — a prav on je razlog, da najboljši prodajni svetovalci pri Win-Win zaslužijo bistveno več od povprečja. Razlika ni v sreči, ampak v procesu. Poglejmo, kako izgleda pot od prvega kontakta do stabilne mesečne provizije.

## Razumi matematiko provizije

Provizija ni naključje — je posledica številk. Če poznaš svoje razmerje med kontakti, ponudbami in sklenitvami, lahko zaslužek dobesedno načrtuješ. Več kakovostnih kontaktov ob enakem razmerju pomeni več sklenitev in višji prihodek.

**Ključno spoznanje:** ne ganjaj zgolj večjega števila klicev — izboljšaj razmerje. Boljša kvalifikacija stranke pogosto prinese več kot podvojen obseg dela.

## Prvi kontakt odloča

Prvih nekaj sekund pogovora določi ton celotne prodaje. Jasen, samozavesten in spoštljiv nastop odpre vrata; negotovost jih zapre. Zato pri Win-Win vadimo uvodne stavke, dokler ne postanejo naravni.

## Delo z ugovori

Ugovor ni konec pogovora — je vabilo k pogovoru. Najpogostejši ugovori imajo strukturiran, pošten odgovor, ki ga predelaš v treningu:

- "Predrago je" — pogovor o vrednosti in dejanski porabi, ne le o ceni
- "Moram premisliti" — razjasnitev, kaj točno stranko še zadržuje
- "Že imam ponudnika" — primerjava pogojev in konkretnih prihrankov

## Sklenitev in priporočila

Sklenitev je naravna posledica dobrega pogovora, ne pritiska. Zadovoljna stranka pa je vir naslednjih poslov — priporočila so najcenejši in najbolj donosen kanal prodaje.

## Sistem, ki ti stoji ob strani

Visoke provizije niso rezultat posameznika, ki se "znajde sam". So rezultat sistema: skript, CRM podpore, coachinga in jasnih ciljev. Pri Win-Win dobiš vse to — tvoja naloga je le, da slediš procesu in vztrajaš.

Rezultat? Predvidljiv, merljiv in rastoč zaslužek, ki je neposredno odvisen od tvojega truda.`,
  },
  {
    id: "local-od-svetovalca-do-vodje",
    slug: "od-svetovalca-do-vodje-v-18-mesecih",
    title: "Od svetovalca do vodje ekipe v 18 mesecih",
    category: "Karierna pot",
    description:
      "Zgodbe iz Win-Win ekipe: pot od prvega prodajnega dne do vodenja lastne ekipe. Kaj je potrebno in kako sistem podpira napredovanje.",
    readTime: "6 min branja",
    featured: false,
    published: true,
    date: "2026-05-08",
    image: new URL("../img/blog-3.jpg", import.meta.url).href,
    imageAlt: "Vodja prodajne ekipe na sestanku",
    body: `Pri Win-Win napredovanje ni obljuba — je sistem. Naši najboljši svetovalci v povprečju prevzamejo vodenje lastne ekipe v manj kot 18 mesecih. Kako izgleda ta pot in kaj je za njo potrebno?

## Faza 1: Osvoji osnove (0–3 mesece)

Prvi meseci so namenjeni obvladovanju temeljev: produkt, skripte, CRM in prvi samostojni rezultati. To je obdobje, kjer disciplina in pripravljenost za učenje štejeta največ.

## Faza 2: Doslednost in rezultati (3–9 mesecev)

Ko osnove sedijo, je čas za doslednost. Svetovalci, ki v tem obdobju dosegajo stabilne rezultate, začnejo izstopati. Tu se pokaže, kdo ima potencial za vodenje.

**Kaj iščemo:** ne samo številke, ampak tudi odnos — zanesljivost, pozitivno energijo in pripravljenost pomagati drugim.

## Faza 3: Mentorstvo (9–14 mesecev)

Bodoči vodje začnejo pomagati novim sodelavcem še preden uradno prevzamejo ekipo. Mentorstvo je najboljši test vodstvenih sposobnosti — in obenem način, da jih razviješ.

## Faza 4: Prevzem ekipe (14–18 mesecev)

Z dokazanimi rezultati in mentorskimi izkušnjami sledi prevzem lastne ekipe. S tem se spremeni tudi struktura zaslužka — poleg lastne provizije sledi nagrada za uspeh ekipe.

## Zakaj to deluje

Sistem napredovanja pri Win-Win temelji na enem načelu: napredujejo tisti, ki dosegajo rezultate in dvigujejo ljudi okoli sebe. Ni politike, ni čakanja "na vrsto" — samo dokazana uspešnost.

Če iščeš kariero, kjer je napredovanje odvisno od tebe in ne od sreče, je to pot, ki ti jo lahko ponudimo.`,
  },
];
