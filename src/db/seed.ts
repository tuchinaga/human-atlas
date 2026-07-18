import { randomUUID } from "node:crypto";
import { db } from "./client";
import {
  places,
  people,
  locationPeriods,
  works,
  events,
  movements,
  workCreators,
  movementPeople,
  eventPlaces,
  eventParticipants,
  eventRelatedWorks,
  relationships,
} from "./schema";

const id = () => randomUUID();

async function main() {
  console.log("Seeding Human Atlas demonstration data (1889)…");

  // ---- Places --------------------------------------------------------
  const place = {
    zundert: id(),
    theHague: id(),
    london: id(),
    paris: id(),
    arles: id(),
    saintRemy: id(),
    auversSurOise: id(),
    tokyo: id(),
    budapest: id(),
    kyoto: id(),
    edo: id(),
  };

  await db.insert(places).values([
    { id: place.zundert, slug: "zundert", name: "Zundert", nameJa: "ズュンデルト", placeType: "town", latitude: 51.47, longitude: 4.65 },
    { id: place.theHague, slug: "the-hague", name: "The Hague", nameJa: "ハーグ", placeType: "city", latitude: 52.08, longitude: 4.31 },
    { id: place.london, slug: "london", name: "London", nameJa: "ロンドン", placeType: "city", latitude: 51.51, longitude: -0.13 },
    { id: place.paris, slug: "paris", name: "Paris", nameJa: "パリ", placeType: "city", latitude: 48.86, longitude: 2.35 },
    { id: place.arles, slug: "arles", name: "Arles", nameJa: "アルル", placeType: "town", latitude: 43.68, longitude: 4.63 },
    { id: place.saintRemy, slug: "saint-remy-de-provence", name: "Saint-Rémy-de-Provence", nameJa: "サン=レミ=ド=プロヴァンス", placeType: "town", latitude: 43.79, longitude: 4.83 },
    { id: place.auversSurOise, slug: "auvers-sur-oise", name: "Auvers-sur-Oise", nameJa: "オーヴェル=シュル=オワーズ", placeType: "town", latitude: 49.07, longitude: 2.17 },
    { id: place.tokyo, slug: "tokyo", name: "Tokyo", nameJa: "東京", placeType: "city", latitude: 35.68, longitude: 139.65 },
    { id: place.budapest, slug: "budapest", name: "Budapest", nameJa: "ブダペスト", placeType: "city", latitude: 47.5, longitude: 19.04 },
    { id: place.kyoto, slug: "kyoto", name: "Kyoto", nameJa: "京都", placeType: "city", latitude: 35.01, longitude: 135.77 },
    { id: place.edo, slug: "edo", name: "Edo", nameJa: "江戸", historicalNamesJson: JSON.stringify(["Edo"]), placeType: "city", latitude: 35.68, longitude: 139.65 },
  ]);

  // ---- People ---------------------------------------------------------
  const person = {
    vanGogh: id(),
    monet: id(),
    renoir: id(),
    mahler: id(),
    soseki: id(),
    picasso: id(),
    eiffel: id(),
    yamauchi: id(),
    hokusai: id(),
  };

  await db.insert(people).values([
    {
      id: person.vanGogh,
      slug: "vincent-van-gogh",
      name: "Vincent van Gogh",
      nameJa: "ヴィンセント・ファン・ゴッホ",
      birthDate: "1853-03-30",
      deathDate: "1890-07-29",
      birthPlaceId: place.zundert,
      occupationsJson: JSON.stringify(["painter"]),
      nationalitiesJson: JSON.stringify(["Dutch"]),
      biography:
        "Dutch post-impressionist painter whose brief, prolific career reshaped how color and brushwork could carry emotion.",
      biographyJa:
        "オランダ出身の後期印象派の画家。短い画業期間の中で、色彩と筆致で感情を伝える表現を切り拓いた。",
    },
    {
      id: person.monet,
      slug: "claude-monet",
      name: "Claude Monet",
      nameJa: "クロード・モネ",
      birthDate: "1840-11-14",
      deathDate: "1926-12-05",
      birthPlaceId: place.paris,
      occupationsJson: JSON.stringify(["painter"]),
      nationalitiesJson: JSON.stringify(["French"]),
    },
    {
      id: person.renoir,
      slug: "pierre-auguste-renoir",
      name: "Pierre-Auguste Renoir",
      nameJa: "ピエール=オーギュスト・ルノワール",
      birthDate: "1841-02-25",
      deathDate: "1919-12-03",
      occupationsJson: JSON.stringify(["painter"]),
      nationalitiesJson: JSON.stringify(["French"]),
    },
    {
      id: person.mahler,
      slug: "gustav-mahler",
      name: "Gustav Mahler",
      nameJa: "グスタフ・マーラー",
      birthDate: "1860-07-07",
      deathDate: "1911-05-18",
      birthPlaceId: place.budapest,
      occupationsJson: JSON.stringify(["composer", "conductor"]),
      nationalitiesJson: JSON.stringify(["Austrian"]),
    },
    {
      id: person.soseki,
      slug: "natsume-soseki",
      name: "Natsume Sōseki",
      nameJa: "夏目漱石",
      birthDate: "1867-02-09",
      deathDate: "1916-12-09",
      birthPlaceId: place.edo,
      occupationsJson: JSON.stringify(["novelist"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
    },
    {
      id: person.picasso,
      slug: "pablo-picasso",
      name: "Pablo Picasso",
      nameJa: "パブロ・ピカソ",
      birthDate: "1881-10-25",
      deathDate: "1973-04-08",
      occupationsJson: JSON.stringify(["painter", "sculptor"]),
      nationalitiesJson: JSON.stringify(["Spanish"]),
    },
    {
      id: person.eiffel,
      slug: "gustave-eiffel",
      name: "Gustave Eiffel",
      nameJa: "ギュスターヴ・エッフェル",
      birthDate: "1832-12-15",
      deathDate: "1923-12-27",
      occupationsJson: JSON.stringify(["engineer"]),
      nationalitiesJson: JSON.stringify(["French"]),
    },
    {
      id: person.yamauchi,
      slug: "fusajiro-yamauchi",
      name: "Fusajiro Yamauchi",
      nameJa: "山内房治郎",
      birthDate: "1859-11-22",
      deathDate: "1940-01-03",
      birthPlaceId: place.kyoto,
      occupationsJson: JSON.stringify(["entrepreneur"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
    },
    {
      id: person.hokusai,
      slug: "katsushika-hokusai",
      name: "Katsushika Hokusai",
      nameJa: "葛飾北斎",
      birthDate: "1760-10-31",
      deathDate: "1849-05-10",
      birthPlaceId: place.edo,
      occupationsJson: JSON.stringify(["ukiyo-e artist"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
      biography:
        "Edo-period ukiyo-e master whose woodblock prints, especially the Thirty-Six Views of Mount Fuji, later influenced European Impressionism.",
      biographyJa:
        "江戸時代の浮世絵師。代表作『富嶽三十六景』などは、のちにヨーロッパの印象派にも影響を与えた。",
    },
  ]);

  // ---- Van Gogh's geographic journey (spec section 13 example) -------
  const journeyStops: [string, string, string][] = [
    [place.zundert, "1853-03-30", "1864-10-01"],
    [place.theHague, "1869-01-01", "1876-01-01"],
    [place.london, "1873-01-01", "1875-01-01"],
    [place.paris, "1886-03-01", "1888-02-19"],
    [place.arles, "1888-02-20", "1889-05-07"],
    [place.saintRemy, "1889-05-08", "1890-05-16"],
    [place.auversSurOise, "1890-05-20", "1890-07-29"],
  ];
  await db.insert(locationPeriods).values(
    journeyStops.map(([placeId, startDate, endDate]) => ({
      id: id(),
      personId: person.vanGogh,
      placeId,
      startDate,
      endDate,
      confidence: "verified" as const,
    })),
  );

  // ---- Works ------------------------------------------------------------
  const work = {
    starryNight: id(),
    eiffelTower: id(),
    symphonyNo1: id(),
  };

  await db.insert(works).values([
    {
      id: work.starryNight,
      slug: "the-starry-night",
      title: "The Starry Night",
      titleJa: "星月夜",
      workType: "painting",
      category: "art",
      creationStartDate: "1889-06-01",
      displayDate: "June 1889",
      datePrecision: "approximate",
      creationPlaceId: place.saintRemy,
      medium: "Oil on canvas",
      description:
        "Painted from the asylum window at Saint-Paul-de-Mausole, working from memory as much as direct observation.",
      descriptionJa: "サン=ポール=ド=モゾール療養院の窓から、記憶と観察の両方を頼りに描かれた。",
      confidence: "verified",
    },
    {
      id: work.eiffelTower,
      slug: "eiffel-tower",
      title: "Eiffel Tower",
      titleJa: "エッフェル塔",
      workType: "building",
      category: "architecture",
      creationStartDate: "1887-01-28",
      creationEndDate: "1889-03-31",
      displayDate: "1887–1889",
      datePrecision: "exact",
      creationPlaceId: place.paris,
      currentLocationId: place.paris,
      description: "Completed as the entrance arch for the 1889 Exposition Universelle.",
      descriptionJa: "1889年万国博覧会の正面ゲートとして完成した。",
      confidence: "verified",
    },
    {
      id: work.symphonyNo1,
      slug: "symphony-no-1",
      title: "Symphony No. 1",
      titleJa: "交響曲第1番",
      workType: "musical composition",
      category: "music",
      creationStartDate: "1888-01-01",
      displayDate: "1888, premiered 1889",
      datePrecision: "approximate",
      creationPlaceId: place.budapest,
      description: "Premiered in Budapest under the title 'Titan' to a puzzled audience.",
      descriptionJa: "「巨人」という題でブダペストにて初演されたが、聴衆の反応は芳しくなかった。",
      confidence: "verified",
    },
  ]);

  await db.insert(workCreators).values([
    { workId: work.starryNight, personId: person.vanGogh },
    { workId: work.eiffelTower, personId: person.eiffel },
    { workId: work.symphonyNo1, personId: person.mahler },
  ]);

  // ---- Events -------------------------------------------------------
  const event = {
    meijiConstitution: id(),
    expositionUniverselle: id(),
    nintendoFounded: id(),
  };

  await db.insert(events).values([
    {
      id: event.meijiConstitution,
      slug: "promulgation-of-the-meiji-constitution",
      title: "Promulgation of the Meiji Constitution",
      titleJa: "大日本帝国憲法発布",
      category: "japan",
      startDate: "1889-02-11",
      displayDate: "February 11, 1889",
      description: "Japan's first modern constitution, establishing a constitutional monarchy.",
      descriptionJa: "日本初の近代憲法で、立憲君主制の基礎を定めた。",
      significanceScore: 90,
      confidence: "verified",
    },
    {
      id: event.expositionUniverselle,
      slug: "exposition-universelle-1889",
      title: "Exposition Universelle",
      titleJa: "パリ万国博覧会",
      category: "history",
      startDate: "1889-05-06",
      endDate: "1889-10-31",
      displayDate: "May–October 1889",
      description: "A world's fair marking the centennial of the French Revolution.",
      descriptionJa: "フランス革命100周年を記念した万国博覧会。",
      significanceScore: 85,
      confidence: "verified",
    },
    {
      id: event.nintendoFounded,
      slug: "nintendo-koppai-founded",
      title: "Nintendo Koppai founded",
      titleJa: "任天堂骨牌 創業",
      category: "science",
      startDate: "1889-01-01",
      displayDate: "1889",
      description: "Began as a maker of handmade hanafuda playing cards.",
      descriptionJa: "手作りの花札（はなふだ）製造業として創業した。",
      significanceScore: 40,
      confidence: "approximate",
    },
  ]);

  await db.insert(eventPlaces).values([
    { eventId: event.meijiConstitution, placeId: place.tokyo },
    { eventId: event.expositionUniverselle, placeId: place.paris },
    { eventId: event.nintendoFounded, placeId: place.kyoto },
  ]);
  await db.insert(eventParticipants).values([
    { eventId: event.nintendoFounded, personId: person.yamauchi },
  ]);
  await db.insert(eventRelatedWorks).values([
    { eventId: event.expositionUniverselle, workId: work.eiffelTower },
  ]);

  // ---- Movement (illustrates section 18's Ukiyo-e → Impressionism line) --
  const impressionismId = id();
  await db.insert(movements).values([
    {
      id: impressionismId,
      slug: "impressionism",
      name: "Impressionism",
      nameJa: "印象派",
      startDate: "1860-01-01",
      endDate: "1890-01-01",
      description:
        "A 19th-century movement centered on light, color and everyday subject matter, shaped in part by exposure to Japanese ukiyo-e prints.",
      descriptionJa:
        "光や色彩、日常的な主題を重視した19世紀の芸術運動。日本の浮世絵版画からの影響も指摘される。",
    },
  ]);
  await db.insert(movementPeople).values([
    { movementId: impressionismId, personId: person.monet },
    { movementId: impressionismId, personId: person.renoir },
  ]);

  // ---- Relationship: a documented cross-cultural influence -----------
  await db.insert(relationships).values([
    {
      id: id(),
      subjectId: person.hokusai,
      objectId: person.vanGogh,
      relationshipType: "influenced",
      description:
        "Van Gogh collected and studied Japanese woodblock prints, including Hokusai's; the influence is stylistic and documented through his letters, not a personal acquaintance.",
      confidence: "probable",
    },
  ]);

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
