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
  movementWorks,
  eventPlaces,
  eventParticipants,
  eventRelatedWorks,
  relationships,
  imageAssets,
  journeys,
  journeySteps,
} from "./schema";

const id = () => randomUUID();

/**
 * This script is a full reset-and-reload, not an incremental append.
 * Demo/seed data has no stable external identity to upsert against
 * (see the note on ImageAsset-style tables in schema.ts), so re-running
 * this after editing it is simpler and safer as "clear everything this
 * script owns, then insert the current definition" rather than trying
 * to diff against what's already there.
 */
async function clearExistingData() {
  await db.delete(journeySteps);
  await db.delete(journeys);
  await db.delete(imageAssets);
  await db.delete(eventRelatedWorks);
  await db.delete(eventParticipants);
  await db.delete(eventPlaces);
  await db.delete(movementWorks);
  await db.delete(movementPeople);
  await db.delete(workCreators);
  await db.delete(relationships);
  await db.delete(locationPeriods);
  await db.delete(events);
  await db.delete(works);
  await db.delete(movements);
  await db.delete(people);
  await db.delete(places);
}

async function main() {
  console.log("Resetting and reseeding Human Atlas demonstration data…");
  await clearExistingData();

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
    kristiania: id(),
    chicago: id(),
    aixEnProvence: id(),
    newYork: id(),
    berlin: id(),
    philadelphia: id(),
    beijing: id(),
    sanFrancisco: id(),
    boston: id(),
    portsmouth: id(),
  };

  await db.insert(places).values([
    { id: place.zundert, slug: "zundert", name: "Zundert", nameJa: "ズュンデルト", placeType: "town", country: "Netherlands", latitude: 51.47, longitude: 4.65 },
    { id: place.theHague, slug: "the-hague", name: "The Hague", nameJa: "ハーグ", placeType: "city", country: "Netherlands", latitude: 52.08, longitude: 4.31 },
    { id: place.london, slug: "london", name: "London", nameJa: "ロンドン", placeType: "city", country: "United Kingdom", latitude: 51.51, longitude: -0.13 },
    { id: place.paris, slug: "paris", name: "Paris", nameJa: "パリ", placeType: "city", country: "France", latitude: 48.86, longitude: 2.35 },
    { id: place.arles, slug: "arles", name: "Arles", nameJa: "アルル", placeType: "town", country: "France", latitude: 43.68, longitude: 4.63 },
    { id: place.saintRemy, slug: "saint-remy-de-provence", name: "Saint-Rémy-de-Provence", nameJa: "サン=レミ=ド=プロヴァンス", placeType: "town", country: "France", latitude: 43.79, longitude: 4.83 },
    { id: place.auversSurOise, slug: "auvers-sur-oise", name: "Auvers-sur-Oise", nameJa: "オーヴェル=シュル=オワーズ", placeType: "town", country: "France", latitude: 49.07, longitude: 2.17 },
    { id: place.tokyo, slug: "tokyo", name: "Tokyo", nameJa: "東京", placeType: "city", country: "Japan", latitude: 35.68, longitude: 139.65 },
    { id: place.budapest, slug: "budapest", name: "Budapest", nameJa: "ブダペスト", placeType: "city", country: "Hungary", latitude: 47.5, longitude: 19.04 },
    { id: place.kyoto, slug: "kyoto", name: "Kyoto", nameJa: "京都", placeType: "city", country: "Japan", latitude: 35.01, longitude: 135.77 },
    { id: place.edo, slug: "edo", name: "Edo", nameJa: "江戸", historicalNamesJson: JSON.stringify(["Edo"]), placeType: "city", country: "Japan", latitude: 35.68, longitude: 139.65 },
    { id: place.kristiania, slug: "kristiania", name: "Kristiania", nameJa: "クリスチャニア", historicalNamesJson: JSON.stringify(["Oslo"]), placeType: "city", country: "Norway", latitude: 59.91, longitude: 10.75 },
    { id: place.chicago, slug: "chicago", name: "Chicago", nameJa: "シカゴ", placeType: "city", country: "United States", latitude: 41.88, longitude: -87.63 },
    { id: place.aixEnProvence, slug: "aix-en-provence", name: "Aix-en-Provence", nameJa: "エクス=アン=プロヴァンス", placeType: "town", country: "France", latitude: 43.53, longitude: 5.45 },
    { id: place.newYork, slug: "new-york", name: "New York", nameJa: "ニューヨーク", placeType: "city", country: "United States", latitude: 40.71, longitude: -74.01 },
    { id: place.berlin, slug: "berlin", name: "Berlin", nameJa: "ベルリン", placeType: "city", country: "Germany", latitude: 52.52, longitude: 13.40 },
    { id: place.philadelphia, slug: "philadelphia", name: "Philadelphia", nameJa: "フィラデルフィア", placeType: "city", country: "United States", latitude: 39.95, longitude: -75.17 },
    { id: place.beijing, slug: "beijing", name: "Beijing", nameJa: "北京", placeType: "city", country: "China", latitude: 39.90, longitude: 116.41 },
    { id: place.sanFrancisco, slug: "san-francisco", name: "San Francisco", nameJa: "サンフランシスコ", placeType: "city", country: "United States", latitude: 37.77, longitude: -122.42 },
    { id: place.boston, slug: "boston", name: "Boston", nameJa: "ボストン", placeType: "city", country: "United States", latitude: 42.36, longitude: -71.06 },
    { id: place.portsmouth, slug: "portsmouth-nh", name: "Portsmouth", nameJa: "ポーツマス", placeType: "city", country: "United States", latitude: 43.07, longitude: -70.76 },
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
    curie: id(),
    munch: id(),
    tesla: id(),
    rodin: id(),
    cezanne: id(),
    zola: id(),
    debussy: id(),
    einstein: id(),
    sunYatSen: id(),
    itoHirobumi: id(),
    moriOgai: id(),
    higuchiIchiyo: id(),
    okakuraTenshin: id(),
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
      occupationsJsonJa: JSON.stringify(["画家"]),
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
      occupationsJsonJa: JSON.stringify(["画家"]),
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
      occupationsJsonJa: JSON.stringify(["画家"]),
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
      occupationsJsonJa: JSON.stringify(["作曲家", "指揮者"]),
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
      occupationsJsonJa: JSON.stringify(["小説家"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
      biography:
        "Novelist and scholar whose work bridged Japan's transition from the Edo period into rapid modernization.",
      biographyJa:
        "江戸から近代への急速な移行期の日本を生きた小説家・学者。",
    },
    {
      id: person.picasso,
      slug: "pablo-picasso",
      name: "Pablo Picasso",
      nameJa: "パブロ・ピカソ",
      birthDate: "1881-10-25",
      deathDate: "1973-04-08",
      occupationsJson: JSON.stringify(["painter", "sculptor"]),
      occupationsJsonJa: JSON.stringify(["画家", "彫刻家"]),
      nationalitiesJson: JSON.stringify(["Spanish"]),
      biography:
        "Spanish painter whose 1907 break with single-point perspective helped open the way to Cubism.",
      biographyJa:
        "1907年、単一視点の絵画表現から離れた作品でキュビスムへの道を切り拓いたスペインの画家。",
    },
    {
      id: person.eiffel,
      slug: "gustave-eiffel",
      name: "Gustave Eiffel",
      nameJa: "ギュスターヴ・エッフェル",
      birthDate: "1832-12-15",
      deathDate: "1923-12-27",
      occupationsJson: JSON.stringify(["engineer"]),
      occupationsJsonJa: JSON.stringify(["技術者"]),
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
      occupationsJsonJa: JSON.stringify(["実業家"]),
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
      occupationsJsonJa: JSON.stringify(["浮世絵師"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
      biography:
        "Edo-period ukiyo-e master whose woodblock prints, especially the Thirty-Six Views of Mount Fuji, later influenced European Impressionism.",
      biographyJa:
        "江戸時代の浮世絵師。代表作『富嶽三十六景』などは、のちにヨーロッパの印象派にも影響を与えた。",
    },
    {
      id: person.curie,
      slug: "marie-curie",
      name: "Marie Curie",
      nameJa: "マリー・キュリー",
      birthDate: "1867-11-07",
      deathDate: "1934-07-04",
      occupationsJson: JSON.stringify(["physicist", "chemist"]),
      occupationsJsonJa: JSON.stringify(["物理学者", "化学者"]),
      nationalitiesJson: JSON.stringify(["Polish", "French"]),
      biography:
        "Physicist and chemist who conducted pioneering research on radioactivity, working in Paris for most of her career.",
      biographyJa:
        "放射性物質の研究で先駆的な業績を残した物理学者・化学者。研究生活の大半をパリで送った。",
    },
    {
      id: person.munch,
      slug: "edvard-munch",
      name: "Edvard Munch",
      nameJa: "エドヴァルド・ムンク",
      birthDate: "1863-12-12",
      deathDate: "1944-01-23",
      birthPlaceId: place.kristiania,
      occupationsJson: JSON.stringify(["painter"]),
      occupationsJsonJa: JSON.stringify(["画家"]),
      nationalitiesJson: JSON.stringify(["Norwegian"]),
      biography:
        "Norwegian painter whose emotionally raw work anticipated Expressionism; spent long periods in Paris and Berlin.",
      biographyJa:
        "感情を生々しく描く作風で表現主義を先取りしたノルウェーの画家。パリやベルリンで長く過ごした。",
    },
    {
      id: person.tesla,
      slug: "nikola-tesla",
      name: "Nikola Tesla",
      nameJa: "ニコラ・テスラ",
      birthDate: "1856-07-10",
      deathDate: "1943-01-07",
      occupationsJson: JSON.stringify(["engineer", "inventor"]),
      occupationsJsonJa: JSON.stringify(["技術者", "発明家"]),
      nationalitiesJson: JSON.stringify(["Serbian", "American"]),
      biography:
        "Engineer and inventor whose work on alternating current systems shaped the era's electrical infrastructure.",
      biographyJa:
        "交流電力システムの研究で、この時代の電力インフラの基礎を築いた技術者・発明家。",
    },
    {
      id: person.rodin,
      slug: "auguste-rodin",
      name: "Auguste Rodin",
      nameJa: "オーギュスト・ロダン",
      birthDate: "1840-11-12",
      deathDate: "1917-11-17",
      birthPlaceId: place.paris,
      occupationsJson: JSON.stringify(["sculptor"]),
      occupationsJsonJa: JSON.stringify(["彫刻家"]),
      nationalitiesJson: JSON.stringify(["French"]),
    },
    {
      id: person.cezanne,
      slug: "paul-cezanne",
      name: "Paul Cézanne",
      nameJa: "ポール・セザンヌ",
      birthDate: "1839-01-19",
      deathDate: "1906-10-22",
      occupationsJson: JSON.stringify(["painter"]),
      occupationsJsonJa: JSON.stringify(["画家"]),
      nationalitiesJson: JSON.stringify(["French"]),
    },
    {
      id: person.zola,
      slug: "emile-zola",
      name: "Émile Zola",
      nameJa: "エミール・ゾラ",
      birthDate: "1840-04-02",
      deathDate: "1902-09-29",
      birthPlaceId: place.paris,
      occupationsJson: JSON.stringify(["novelist"]),
      occupationsJsonJa: JSON.stringify(["小説家"]),
      nationalitiesJson: JSON.stringify(["French"]),
    },
    {
      id: person.debussy,
      slug: "claude-debussy",
      name: "Claude Debussy",
      nameJa: "クロード・ドビュッシー",
      birthDate: "1862-08-22",
      deathDate: "1918-03-25",
      birthPlaceId: place.paris,
      occupationsJson: JSON.stringify(["composer"]),
      occupationsJsonJa: JSON.stringify(["作曲家"]),
      nationalitiesJson: JSON.stringify(["French"]),
    },
    {
      id: person.einstein,
      slug: "albert-einstein",
      name: "Albert Einstein",
      nameJa: "アルベルト・アインシュタイン",
      birthDate: "1879-03-14",
      deathDate: "1955-04-18",
      occupationsJson: JSON.stringify(["physicist"]),
      occupationsJsonJa: JSON.stringify(["物理学者"]),
      nationalitiesJson: JSON.stringify(["German", "Swiss"]),
      biography:
        "Physicist whose work on relativity, developed while based in Berlin, reshaped modern physics.",
      biographyJa:
        "ベルリンを拠点に相対性理論を発展させ、近代物理学のあり方を変えた物理学者。",
    },
    {
      id: person.sunYatSen,
      slug: "sun-yat-sen",
      name: "Sun Yat-sen",
      nameJa: "孫文",
      birthDate: "1866-11-12",
      deathDate: "1925-03-12",
      occupationsJson: JSON.stringify(["revolutionary", "statesman"]),
      occupationsJsonJa: JSON.stringify(["革命家", "政治家"]),
      nationalitiesJson: JSON.stringify(["Chinese"]),
      biography:
        "Revolutionary and statesman regarded as a founding father of the Republic of China after the fall of the Qing dynasty.",
      biographyJa: "清朝滅亡後の中華民国建国の父とされる革命家・政治家。",
    },
    {
      id: person.itoHirobumi,
      slug: "ito-hirobumi",
      name: "Itō Hirobumi",
      nameJa: "伊藤博文",
      birthDate: "1841-10-16",
      deathDate: "1909-10-26",
      birthPlaceId: place.edo,
      occupationsJson: JSON.stringify(["statesman"]),
      occupationsJsonJa: JSON.stringify(["政治家"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
      biography:
        "Statesman who led the drafting of the Meiji Constitution and served as Japan's first prime minister.",
      biographyJa: "大日本帝国憲法の起草を主導し、初代内閣総理大臣も務めた政治家。",
    },
    {
      id: person.moriOgai,
      slug: "mori-ogai",
      name: "Mori Ōgai",
      nameJa: "森鷗外",
      birthDate: "1862-02-17",
      deathDate: "1922-07-09",
      occupationsJson: JSON.stringify(["novelist", "physician"]),
      occupationsJsonJa: JSON.stringify(["小説家", "軍医"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
      biography:
        "Novelist and army surgeon, a contemporary of Sōseki, who studied in Germany before returning to Japan.",
      biographyJa: "夏目漱石と同時代の小説家・軍医。ドイツ留学ののち帰国した。",
    },
    {
      id: person.higuchiIchiyo,
      slug: "higuchi-ichiyo",
      name: "Higuchi Ichiyō",
      nameJa: "樋口一葉",
      birthDate: "1872-05-02",
      deathDate: "1896-11-23",
      birthPlaceId: place.tokyo,
      occupationsJson: JSON.stringify(["novelist"]),
      occupationsJsonJa: JSON.stringify(["小説家"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
      biography:
        "Novelist whose short career produced some of the most acclaimed fiction of the Meiji era before her early death.",
      biographyJa: "短い活動期間の中で、明治期を代表する評価を得た小説を残した作家。若くして世を去った。",
    },
    {
      id: person.okakuraTenshin,
      slug: "okakura-tenshin",
      name: "Okakura Tenshin",
      nameJa: "岡倉天心",
      birthDate: "1863-02-14",
      deathDate: "1913-09-02",
      birthPlaceId: place.edo,
      occupationsJson: JSON.stringify(["art critic", "curator"]),
      occupationsJsonJa: JSON.stringify(["美術評論家", "学芸員"]),
      nationalitiesJson: JSON.stringify(["Japanese"]),
      biography:
        "Art critic and curator who promoted Japanese art internationally while working with the Museum of Fine Arts, Boston.",
      biographyJa: "ボストン美術館とも関わりながら、日本美術を海外に広く紹介した美術評論家・学芸員。",
    },
  ]);

  // ---- Van Gogh's geographic journey (spec section 13 example) -------
  const journeyStops: {
    placeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    reasonJa: string;
  }[] = [
    {
      placeId: place.zundert,
      startDate: "1853-03-30",
      endDate: "1864-10-01",
      reason: "Born here; spent his childhood in his father's parsonage.",
      reasonJa: "生まれ育った地。父が牧師を務める教区で幼少期を過ごした。",
    },
    {
      placeId: place.theHague,
      startDate: "1869-01-01",
      endDate: "1876-01-01",
      reason: "Worked as an art dealer for Goupil & Cie.",
      reasonJa: "画商グーピル商会で働いた。",
    },
    {
      placeId: place.london,
      startDate: "1873-01-01",
      endDate: "1875-01-01",
      reason: "Transferred to the Goupil & Cie branch office.",
      reasonJa: "グーピル商会のロンドン支店に異動した。",
    },
    {
      placeId: place.paris,
      startDate: "1886-03-01",
      endDate: "1888-02-19",
      reason: "Moved in with his brother Theo and encountered Impressionism.",
      reasonJa: "弟テオのもとに身を寄せ、印象派の作品に触れた。",
    },
    {
      placeId: place.arles,
      startDate: "1888-02-20",
      endDate: "1889-05-07",
      reason: "Sought stronger light and color; created many of his best-known paintings.",
      reasonJa: "より強い光と色彩を求めて移住し、代表作の多くをここで描いた。",
    },
    {
      placeId: place.saintRemy,
      startDate: "1889-05-08",
      endDate: "1890-05-16",
      reason: "Voluntarily admitted to the Saint-Paul-de-Mausole asylum.",
      reasonJa: "サン=ポール=ド=モゾール療養院に自ら入院した。",
    },
    {
      placeId: place.auversSurOise,
      startDate: "1890-05-20",
      endDate: "1890-07-29",
      reason: "Moved to be under the care of Dr. Paul Gachet, his final months.",
      reasonJa: "医師ポール・ガシェの元で療養するために移り住んだ、最後の日々。",
    },
  ];
  await db.insert(locationPeriods).values(
    journeyStops.map((stop) => ({
      id: id(),
      personId: person.vanGogh,
      placeId: stop.placeId,
      startDate: stop.startDate,
      endDate: stop.endDate,
      reason: stop.reason,
      reasonJa: stop.reasonJa,
      confidence: "verified" as const,
    })),
  );

  // ---- Munch's geographic journey ------------------------------------
  const munchJourneyStops: {
    placeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    reasonJa: string;
  }[] = [
    {
      placeId: place.kristiania,
      startDate: "1863-12-12",
      endDate: "1889-01-01",
      reason: "Born and raised here; began painting in the city's bohemian circles.",
      reasonJa: "生まれ育った地。この街のボヘミアン的な芸術家仲間の中で絵を描き始めた。",
    },
    {
      placeId: place.paris,
      startDate: "1889-01-01",
      endDate: "1892-01-01",
      reason: "Studied and exhibited, absorbing Post-Impressionist and Symbolist influences.",
      reasonJa: "研究と出品を重ね、後期印象派や象徴主義の影響を吸収した。",
    },
    {
      placeId: place.berlin,
      startDate: "1892-01-01",
      endDate: "1897-01-01",
      reason: "A controversial exhibition here made him a central figure in the city's avant-garde.",
      reasonJa: "この地での物議を醸した展覧会をきっかけに、前衛芸術の中心人物のひとりとなった。",
    },
    {
      placeId: place.kristiania,
      startDate: "1897-01-01",
      endDate: "1944-01-23",
      reason: "Returned home, continuing to work for the rest of his life.",
      reasonJa: "故郷に戻り、生涯にわたって制作を続けた。",
    },
  ];
  await db.insert(locationPeriods).values(
    munchJourneyStops.map((stop) => ({
      id: id(),
      personId: person.munch,
      placeId: stop.placeId,
      startDate: stop.startDate,
      endDate: stop.endDate,
      reason: stop.reason,
      reasonJa: stop.reasonJa,
      confidence: "probable" as const,
    })),
  );

  // ---- Works ------------------------------------------------------------
  const work = {
    starryNight: id(),
    eiffelTower: id(),
    symphonyNo1: id(),
    greatWave: id(),
    lesDemoiselles: id(),
    iAmACat: id(),
    theScream: id(),
    theThinker: id(),
    montSainteVictoire: id(),
    germinal: id(),
    clairDeLune: id(),
    takekurabe: id(),
    theDancingGirl: id(),
    theBookOfTea: id(),
    sunflowers: id(),
    theBedroom: id(),
    wheatfieldWithCrows: id(),
  };

  await db.insert(works).values([
    {
      id: work.starryNight,
      slug: "the-starry-night",
      title: "The Starry Night",
      titleJa: "星月夜",
      workType: "painting",
      workTypeJa: "絵画",
      category: "art",
      creationStartDate: "1889-06-01",
      displayDate: "June 1889",
      datePrecision: "approximate",
      creationPlaceId: place.saintRemy,
      medium: "Oil on canvas",
      mediumJa: "油彩、カンヴァス",
      dimensions: "73.7 cm × 92.1 cm",
      currentInstitution: "Museum of Modern Art, New York",
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
      workTypeJa: "建築物",
      category: "architecture",
      creationStartDate: "1887-01-28",
      creationEndDate: "1889-03-31",
      displayDate: "1887–1889",
      datePrecision: "exact",
      creationPlaceId: place.paris,
      currentLocationId: place.paris,
      dimensions: "330 m tall",
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
      workTypeJa: "音楽作品",
      category: "music",
      creationStartDate: "1888-01-01",
      displayDate: "1888, premiered 1889",
      datePrecision: "approximate",
      creationPlaceId: place.budapest,
      description: "Premiered in Budapest under the title 'Titan' to a puzzled audience.",
      descriptionJa: "「巨人」という題でブダペストにて初演されたが、聴衆の反応は芳しくなかった。",
      confidence: "verified",
    },
    {
      id: work.greatWave,
      slug: "the-great-wave-off-kanagawa",
      title: "The Great Wave off Kanagawa",
      titleJa: "神奈川沖浪裏",
      workType: "woodblock print",
      workTypeJa: "木版画",
      category: "art",
      creationStartDate: "1831-01-01",
      displayDate: "c. 1831",
      datePrecision: "approximate",
      creationPlaceId: place.edo,
      medium: "Woodblock print, ink and color on paper",
      mediumJa: "木版画、紙に墨・彩色",
      dimensions: "25.7 cm × 37.9 cm (ōban format, typical of the series)",
      description:
        "The best-known print from the Thirty-Six Views of Mount Fuji series, later widely collected and studied by European painters.",
      descriptionJa:
        "『富嶽三十六景』の中で最もよく知られる一枚。のちにヨーロッパの画家たちにも広く収集・研究された。",
      confidence: "approximate",
    },
    {
      id: work.lesDemoiselles,
      slug: "les-demoiselles-davignon",
      title: "Les Demoiselles d'Avignon",
      titleJa: "アヴィニョンの娘たち",
      workType: "painting",
      workTypeJa: "絵画",
      category: "art",
      creationStartDate: "1907-01-01",
      displayDate: "1907",
      datePrecision: "approximate",
      creationPlaceId: place.paris,
      medium: "Oil on canvas",
      mediumJa: "油彩、カンヴァス",
      dimensions: "243.9 cm × 233.7 cm",
      currentInstitution: "Museum of Modern Art, New York",
      description:
        "A sharp break from single-point perspective, widely regarded as a starting point for Cubism.",
      descriptionJa: "単一視点からの離脱を鮮烈に示した作品で、キュビスムの出発点のひとつとされる。",
      confidence: "verified",
    },
    {
      id: work.iAmACat,
      slug: "i-am-a-cat",
      title: "I Am a Cat",
      titleJa: "吾輩は猫である",
      workType: "book",
      workTypeJa: "書籍",
      category: "literature",
      creationStartDate: "1905-01-01",
      creationEndDate: "1906-01-01",
      displayDate: "1905–1906",
      datePrecision: "approximate",
      creationPlaceId: place.tokyo,
      description:
        "A satirical novel narrated by a nameless cat observing the household of a Meiji-era schoolteacher.",
      descriptionJa: "名もなき猫の視点から、明治期のある教師の家庭を風刺的に描いた小説。",
      confidence: "verified",
    },
    {
      id: work.theScream,
      slug: "the-scream",
      title: "The Scream",
      titleJa: "叫び",
      workType: "painting",
      workTypeJa: "絵画",
      category: "art",
      creationStartDate: "1893-01-01",
      displayDate: "1893",
      datePrecision: "approximate",
      creationPlaceId: place.kristiania,
      medium: "Oil, tempera and pastel on cardboard",
      mediumJa: "油彩・テンペラ・パステル、厚紙",
      currentInstitution: "National Museum of Norway, Oslo",
      description:
        "Painted after what Munch described as a moment of overwhelming anxiety on a walk at sunset.",
      descriptionJa: "日没時の散歩中に感じた強い不安の瞬間をもとに描かれたとムンク自身が語っている。",
      confidence: "verified",
    },
    {
      id: work.theThinker,
      slug: "the-thinker",
      title: "The Thinker",
      titleJa: "考える人",
      workType: "sculpture",
      workTypeJa: "彫刻",
      category: "art",
      creationStartDate: "1904-01-01",
      displayDate: "1904 (enlarged bronze cast)",
      datePrecision: "approximate",
      creationPlaceId: place.paris,
      medium: "Bronze",
      mediumJa: "ブロンズ",
      currentInstitution: "Musée Rodin, Paris",
      description:
        "Originally conceived as part of a larger door commission, later cast independently as its own work.",
      descriptionJa: "もともとは大型の扉の装飾の一部として構想され、のちに独立した作品として鋳造された。",
      confidence: "verified",
    },
    {
      id: work.montSainteVictoire,
      slug: "mont-sainte-victoire",
      title: "Mont Sainte-Victoire",
      titleJa: "サント=ヴィクトワール山",
      workType: "painting",
      workTypeJa: "絵画",
      category: "art",
      creationStartDate: "1904-01-01",
      displayDate: "1904",
      datePrecision: "approximate",
      creationPlaceId: place.aixEnProvence,
      medium: "Oil on canvas",
      mediumJa: "油彩、カンヴァス",
      description:
        "One of dozens of views Cézanne painted of the same mountain near his home in southern France.",
      descriptionJa: "南フランスの自宅近くにあるこの山を、セザンヌは生涯に何十枚と描いた。",
      confidence: "approximate",
    },
    {
      id: work.germinal,
      slug: "germinal",
      title: "Germinal",
      titleJa: "ジェルミナール",
      workType: "book",
      workTypeJa: "書籍",
      category: "literature",
      creationStartDate: "1885-01-01",
      displayDate: "1885",
      datePrecision: "approximate",
      creationPlaceId: place.paris,
      description:
        "A novel about a miners' strike in northern France, part of Zola's twenty-volume Rougon-Macquart cycle.",
      descriptionJa: "フランス北部の炭鉱ストライキを描いた小説。ゾラの大長編『ルーゴン=マッカール叢書』の一冊。",
      confidence: "verified",
    },
    {
      id: work.clairDeLune,
      slug: "clair-de-lune",
      title: "Clair de Lune",
      titleJa: "月の光",
      workType: "musical composition",
      workTypeJa: "音楽作品",
      category: "music",
      creationStartDate: "1890-01-01",
      creationEndDate: "1905-01-01",
      displayDate: "composed 1890, published 1905",
      datePrecision: "approximate",
      creationPlaceId: place.paris,
      description:
        "The best-known movement of the Suite bergamasque, composed years before its eventual publication.",
      descriptionJa: "組曲『ベルガマスク』の中で最もよく知られる曲。作曲から出版まで長い年月を経た。",
      confidence: "verified",
    },
    {
      id: work.takekurabe,
      slug: "takekurabe",
      title: "Child's Play",
      titleJa: "たけくらべ",
      workType: "book",
      workTypeJa: "書籍",
      category: "literature",
      creationStartDate: "1895-01-01",
      creationEndDate: "1896-01-01",
      displayDate: "1895–1896",
      datePrecision: "approximate",
      creationPlaceId: place.tokyo,
      description:
        "A novella following children on the cusp of adolescence in a Tokyo pleasure quarter, published serially.",
      descriptionJa: "東京の遊郭近くで暮らす、思春期を迎えつつある子どもたちを描いた連載小説。",
      confidence: "verified",
    },
    {
      id: work.theDancingGirl,
      slug: "the-dancing-girl",
      title: "The Dancing Girl",
      titleJa: "舞姫",
      workType: "book",
      workTypeJa: "書籍",
      category: "literature",
      creationStartDate: "1890-01-01",
      displayDate: "1890",
      datePrecision: "approximate",
      creationPlaceId: place.tokyo,
      description:
        "A short story drawing on the author's own years studying in Germany, narrated by a Japanese student in Berlin.",
      descriptionJa: "著者自身のドイツ留学経験をもとにした短編小説で、ベルリンに留学中の日本人学生を語り手とする。",
      confidence: "verified",
    },
    {
      id: work.theBookOfTea,
      slug: "the-book-of-tea",
      title: "The Book of Tea",
      titleJa: "茶の本",
      workType: "book",
      workTypeJa: "書籍",
      category: "literature",
      creationStartDate: "1906-01-01",
      displayDate: "1906",
      datePrecision: "approximate",
      creationPlaceId: place.boston,
      description:
        "An English-language essay introducing Japanese tea culture and aesthetics to a Western audience.",
      descriptionJa: "日本の茶文化と美意識を、英語で西洋の読者に向けて紹介したエッセイ。",
      confidence: "verified",
    },
    {
      id: work.sunflowers,
      slug: "sunflowers",
      title: "Sunflowers",
      titleJa: "ひまわり",
      workType: "painting",
      workTypeJa: "絵画",
      category: "art",
      creationStartDate: "1888-08-01",
      displayDate: "August 1888",
      datePrecision: "approximate",
      creationPlaceId: place.arles,
      medium: "Oil on canvas",
      mediumJa: "油彩、カンヴァス",
      dimensions: "92.1 cm × 73 cm",
      currentInstitution: "National Gallery, London",
      description:
        "One of a series painted to decorate the Yellow House ahead of a visit from Paul Gauguin.",
      descriptionJa: "ポール・ゴーギャンの訪問に備えて「黄色い家」を飾るために描かれた連作の一枚。",
      confidence: "verified",
    },
    {
      id: work.theBedroom,
      slug: "the-bedroom",
      title: "The Bedroom",
      titleJa: "アルルの寝室",
      workType: "painting",
      workTypeJa: "絵画",
      category: "art",
      creationStartDate: "1888-10-01",
      displayDate: "October 1888",
      datePrecision: "approximate",
      creationPlaceId: place.arles,
      medium: "Oil on canvas",
      mediumJa: "油彩、カンヴァス",
      dimensions: "72 cm × 90 cm",
      currentInstitution: "Van Gogh Museum, Amsterdam",
      description:
        "A view of his bedroom in the Yellow House; van Gogh painted three closely related versions of the scene.",
      descriptionJa: "「黄色い家」の自室を描いた作品で、ゴッホはこの構図を3点、近い形で描いている。",
      confidence: "verified",
    },
    {
      id: work.wheatfieldWithCrows,
      slug: "wheatfield-with-crows",
      title: "Wheatfield with Crows",
      titleJa: "カラスのいる麦畑",
      workType: "painting",
      workTypeJa: "絵画",
      category: "art",
      creationStartDate: "1890-07-01",
      displayDate: "July 1890",
      datePrecision: "approximate",
      creationPlaceId: place.auversSurOise,
      medium: "Oil on canvas",
      mediumJa: "油彩、カンヴァス",
      dimensions: "50.5 cm × 103 cm",
      currentInstitution: "Van Gogh Museum, Amsterdam",
      description:
        "Painted in the final weeks of his life; often, though not conclusively, linked to his death.",
      descriptionJa: "生涯最後の数週間に描かれた作品。彼の死と結びつけて語られることが多いが、確証はない。",
      confidence: "approximate",
    },
  ]);

  await db.insert(workCreators).values([
    { workId: work.starryNight, personId: person.vanGogh },
    { workId: work.eiffelTower, personId: person.eiffel },
    { workId: work.symphonyNo1, personId: person.mahler },
    { workId: work.greatWave, personId: person.hokusai },
    { workId: work.lesDemoiselles, personId: person.picasso },
    { workId: work.iAmACat, personId: person.soseki },
    { workId: work.theScream, personId: person.munch },
    { workId: work.theThinker, personId: person.rodin },
    { workId: work.montSainteVictoire, personId: person.cezanne },
    { workId: work.germinal, personId: person.zola },
    { workId: work.clairDeLune, personId: person.debussy },
    { workId: work.takekurabe, personId: person.higuchiIchiyo },
    { workId: work.theDancingGirl, personId: person.moriOgai },
    { workId: work.theBookOfTea, personId: person.okakuraTenshin },
    { workId: work.sunflowers, personId: person.vanGogh },
    { workId: work.theBedroom, personId: person.vanGogh },
    { workId: work.wheatfieldWithCrows, personId: person.vanGogh },
  ]);

  // ---- Events -------------------------------------------------------
  const event = {
    meijiConstitution: id(),
    expositionUniverselle: id(),
    nintendoFounded: id(),
    meijiRestoration: id(),
    radiumDiscovery: id(),
    columbianExposition: id(),
    declarationOfIndependence: id(),
    stormingOfTheBastille: id(),
    xinhaiRevolution: id(),
    generalRelativity: id(),
    unitedNationsFounded: id(),
    russoJapaneseWar: id(),
  };

  await db.insert(events).values([
    {
      id: event.meijiConstitution,
      slug: "promulgation-of-the-meiji-constitution",
      title: "Promulgation of the Meiji Constitution",
      titleJa: "大日本帝国憲法発布",
      category: "society",
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
      category: "technology",
      startDate: "1889-01-01",
      displayDate: "1889",
      description: "Began as a maker of handmade hanafuda playing cards.",
      descriptionJa: "手作りの花札（はなふだ）製造業として創業した。",
      significanceScore: 40,
      confidence: "approximate",
    },
    {
      id: event.meijiRestoration,
      slug: "meiji-restoration",
      title: "Meiji Restoration",
      titleJa: "明治維新",
      category: "history",
      startDate: "1868-01-03",
      displayDate: "1868",
      description:
        "Imperial rule was restored and Edo was renamed Tokyo, beginning Japan's rapid modernization.",
      descriptionJa: "王政復古が宣言され、江戸が東京と改称。日本の急速な近代化が始まった。",
      significanceScore: 95,
      confidence: "verified",
    },
    {
      id: event.radiumDiscovery,
      slug: "discovery-of-radium",
      title: "Discovery of radium",
      titleJa: "ラジウムの発見",
      category: "science",
      startDate: "1898-12-26",
      displayDate: "December 1898",
      description:
        "Marie and Pierre Curie announced the discovery of a new radioactive element, radium, isolated from pitchblende.",
      descriptionJa: "マリー・キュリーとピエール・キュリーが、瀝青ウラン鉱から新元素ラジウムを発見したと発表した。",
      significanceScore: 80,
      confidence: "verified",
    },
    {
      id: event.columbianExposition,
      slug: "worlds-columbian-exposition-1893",
      title: "World's Columbian Exposition",
      titleJa: "シカゴ万国博覧会",
      category: "technology",
      startDate: "1893-05-01",
      endDate: "1893-10-30",
      displayDate: "May–October 1893",
      description:
        "A world's fair whose grounds were lit by alternating current, a large-scale public demonstration of the technology.",
      descriptionJa: "会場全体が交流電力によって照明され、その技術を大規模に一般公開する場となった。",
      significanceScore: 75,
      confidence: "verified",
    },
    {
      id: event.declarationOfIndependence,
      slug: "us-declaration-of-independence",
      title: "Declaration of Independence",
      titleJa: "アメリカ独立宣言",
      category: "society",
      startDate: "1776-07-04",
      displayDate: "July 4, 1776",
      description:
        "Thirteen American colonies formally declared independence from Great Britain.",
      descriptionJa: "13の植民地がイギリスからの独立を正式に宣言した。",
      significanceScore: 90,
      confidence: "verified",
    },
    {
      id: event.stormingOfTheBastille,
      slug: "storming-of-the-bastille",
      title: "Storming of the Bastille",
      titleJa: "バスティーユ襲撃",
      category: "history",
      startDate: "1789-07-14",
      displayDate: "July 14, 1789",
      description:
        "A Paris uprising that became the symbolic beginning of the French Revolution.",
      descriptionJa: "パリでの蜂起で、フランス革命の象徴的な始まりとされる。",
      significanceScore: 90,
      confidence: "verified",
    },
    {
      id: event.xinhaiRevolution,
      slug: "xinhai-revolution",
      title: "Xinhai Revolution",
      titleJa: "辛亥革命",
      category: "society",
      startDate: "1911-10-10",
      endDate: "1912-02-12",
      displayDate: "1911–1912",
      description:
        "A revolution that ended over two thousand years of imperial rule in China and led to the founding of the Republic of China.",
      descriptionJa: "二千年以上続いた中国の帝政に終止符を打ち、中華民国建国につながった革命。",
      significanceScore: 90,
      confidence: "verified",
    },
    {
      id: event.generalRelativity,
      slug: "publication-of-general-relativity",
      title: "Publication of general relativity",
      titleJa: "一般相対性理論の発表",
      category: "science",
      startDate: "1915-11-25",
      displayDate: "November 1915",
      description:
        "Einstein presented the field equations of general relativity to the Prussian Academy of Sciences in Berlin.",
      descriptionJa: "アインシュタインがベルリンのプロイセン科学アカデミーで一般相対性理論の場の方程式を発表した。",
      significanceScore: 85,
      confidence: "verified",
    },
    {
      id: event.unitedNationsFounded,
      slug: "united-nations-founded",
      title: "Founding of the United Nations",
      titleJa: "国際連合の設立",
      category: "society",
      startDate: "1945-06-26",
      displayDate: "June 1945",
      description: "Fifty nations signed the UN Charter in San Francisco after the end of the Second World War.",
      descriptionJa: "第二次世界大戦終結後、サンフランシスコで50カ国が国連憲章に署名した。",
      significanceScore: 85,
      confidence: "verified",
    },
    {
      id: event.russoJapaneseWar,
      slug: "treaty-of-portsmouth",
      title: "Treaty of Portsmouth ends the Russo-Japanese War",
      titleJa: "ポーツマス条約(日露戦争終結)",
      category: "history",
      startDate: "1905-09-05",
      displayDate: "September 1905",
      description:
        "Ended a war in which Japan defeated a major European power, reshaping perceptions of Japan on the world stage.",
      descriptionJa: "日本がヨーロッパの大国を破って終結した戦争で、国際社会における日本の位置づけを大きく変えた。",
      significanceScore: 85,
      confidence: "verified",
    },
  ]);

  await db.insert(eventPlaces).values([
    { eventId: event.meijiConstitution, placeId: place.tokyo },
    { eventId: event.expositionUniverselle, placeId: place.paris },
    { eventId: event.nintendoFounded, placeId: place.kyoto },
    { eventId: event.meijiRestoration, placeId: place.tokyo },
    { eventId: event.radiumDiscovery, placeId: place.paris },
    { eventId: event.columbianExposition, placeId: place.chicago },
    { eventId: event.declarationOfIndependence, placeId: place.philadelphia },
    { eventId: event.stormingOfTheBastille, placeId: place.paris },
    { eventId: event.xinhaiRevolution, placeId: place.beijing },
    { eventId: event.generalRelativity, placeId: place.berlin },
    { eventId: event.unitedNationsFounded, placeId: place.sanFrancisco },
    { eventId: event.russoJapaneseWar, placeId: place.portsmouth },
  ]);
  await db.insert(eventParticipants).values([
    { eventId: event.nintendoFounded, personId: person.yamauchi },
    { eventId: event.radiumDiscovery, personId: person.curie },
    { eventId: event.columbianExposition, personId: person.tesla },
    { eventId: event.xinhaiRevolution, personId: person.sunYatSen },
    { eventId: event.generalRelativity, personId: person.einstein },
    { eventId: event.meijiConstitution, personId: person.itoHirobumi },
  ]);
  await db.insert(eventRelatedWorks).values([
    { eventId: event.expositionUniverselle, workId: work.eiffelTower },
  ]);

  // ---- Movements ------------------------------------------------------
  const movement = {
    impressionism: id(),
    ukiyoE: id(),
    cubism: id(),
    postImpressionism: id(),
  };

  await db.insert(movements).values([
    {
      id: movement.impressionism,
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
    {
      id: movement.ukiyoE,
      slug: "ukiyo-e",
      name: "Ukiyo-e",
      nameJa: "浮世絵",
      startDate: "1603-01-01",
      endDate: "1868-01-01",
      description:
        "Edo-period woodblock prints and paintings depicting everyday life, landscapes and actors — later collected widely in Europe.",
      descriptionJa: "江戸時代の木版画・絵画のジャンルで、日常や風景、役者絵などを描いた。のちにヨーロッパでも広く収集された。",
    },
    {
      id: movement.cubism,
      slug: "cubism",
      name: "Cubism",
      nameJa: "キュビスム",
      startDate: "1907-01-01",
      endDate: "1920-01-01",
      description:
        "An early-20th-century movement that broke subjects into geometric fragments viewed from multiple angles at once.",
      descriptionJa: "20世紀初頭の芸術運動。対象を幾何学的な断片に分解し、複数の視点から同時に描いた。",
    },
    {
      id: movement.postImpressionism,
      slug: "post-impressionism",
      name: "Post-Impressionism",
      nameJa: "後期印象派",
      startDate: "1886-01-01",
      endDate: "1905-01-01",
      description:
        "A loose successor to Impressionism that pushed toward more structured form and symbolic color rather than pure optical effect.",
      descriptionJa: "印象派の後を継ぎつつ、純粋な視覚効果よりも形の構造や象徴的な色彩を重視した緩やかな潮流。",
    },
  ]);

  await db.insert(movementPeople).values([
    { movementId: movement.impressionism, personId: person.monet },
    { movementId: movement.impressionism, personId: person.renoir },
    { movementId: movement.ukiyoE, personId: person.hokusai },
    { movementId: movement.cubism, personId: person.picasso },
    { movementId: movement.postImpressionism, personId: person.vanGogh },
    { movementId: movement.postImpressionism, personId: person.cezanne },
  ]);
  await db.insert(movementWorks).values([
    { movementId: movement.ukiyoE, workId: work.greatWave },
    { movementId: movement.cubism, workId: work.lesDemoiselles },
    { movementId: movement.postImpressionism, workId: work.starryNight },
    { movementId: movement.postImpressionism, workId: work.montSainteVictoire },
  ]);

  // ---- Relationships: documented cross-cultural influences ------------
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

  // ---- Image assets: only rights-cleared images, per spec section 19 --
  // All four are verified public domain on Wikimedia Commons. Les
  // Demoiselles d'Avignon is deliberately left without an image — Picasso
  // died in 1973, so the work is still under copyright in most
  // jurisdictions; its page renders the neutral rights-pending placeholder
  // instead, which is the system working as intended, not a gap.
  const commonsFilePath = (filename: string, width = 1200) =>
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;

  await db.insert(imageAssets).values([
    {
      id: id(),
      entityType: "work",
      entityId: work.starryNight,
      imageUrl: commonsFilePath("Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"),
      sourceName: "Wikimedia Commons",
      sourceRecordUrl:
        "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      creator: "Vincent van Gogh",
      rightsStatement: "Public domain — author died more than 100 years ago",
      license: "PD-old-100-expired",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "work",
      entityId: work.greatWave,
      imageUrl: commonsFilePath("Great_Wave_off_Kanagawa2.jpg"),
      sourceName: "Wikimedia Commons",
      sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Great_Wave_off_Kanagawa2.jpg",
      creator: "Katsushika Hokusai",
      rightsStatement: "Public domain — author died more than 100 years ago",
      license: "PD-old-100-expired",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "work",
      entityId: work.eiffelTower,
      imageUrl: commonsFilePath(
        "Eiffel_Tower,_looking_toward_Trocadéro_Palace,_Paris_Exposition,_1889_LCCN92519630.jpg",
      ),
      sourceName: "Wikimedia Commons (Library of Congress)",
      sourceRecordUrl:
        "https://commons.wikimedia.org/wiki/File:Eiffel_Tower,_looking_toward_Trocad%C3%A9ro_Palace,_Paris_Exposition,_1889_LCCN92519630.jpg",
      rightsStatement: "Public Domain Mark — Library of Congress collection",
      license: "PDM",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "person",
      entityId: person.curie,
      imageUrl: commonsFilePath("Marie_Curie,_portrait,_1900.jpg", 400),
      sourceName: "Wikimedia Commons",
      sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:Marie_Curie,_portrait,_1900.jpg",
      creator: "Unknown",
      rightsStatement: "Public Domain Mark",
      license: "PDM",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "work",
      entityId: work.theScream,
      imageUrl: commonsFilePath("The_Scream.jpg"),
      sourceName: "Wikimedia Commons",
      sourceRecordUrl: "https://commons.wikimedia.org/wiki/File:The_Scream.jpg",
      creator: "Edvard Munch",
      rightsStatement: "Public domain — author died more than 70 years ago",
      license: "PD-old-70-expired",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "work",
      entityId: work.theThinker,
      imageUrl: commonsFilePath("Auguste_Rodin,_The_Thinker_(Le_Penseur),_model_1880,_cast_1901,_NGA_1005.jpg"),
      sourceName: "Wikimedia Commons (National Gallery of Art)",
      sourceRecordUrl:
        "https://commons.wikimedia.org/wiki/File:Auguste_Rodin,_The_Thinker_(Le_Penseur),_model_1880,_cast_1901,_NGA_1005.jpg",
      creator: "Auguste Rodin",
      rightsStatement: "Public domain — author died more than 100 years ago",
      license: "PD-old-100-expired",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "work",
      entityId: work.sunflowers,
      imageUrl: commonsFilePath("Vincent_van_Gogh_-_Sunflowers_(1888,_National_Gallery_London).jpg"),
      sourceName: "Wikimedia Commons (National Gallery, London)",
      sourceRecordUrl:
        "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Sunflowers_(1888,_National_Gallery_London).jpg",
      creator: "Vincent van Gogh",
      rightsStatement: "Public domain — author died more than 100 years ago",
      license: "PD-old-100-expired",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "work",
      entityId: work.theBedroom,
      imageUrl: commonsFilePath("Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg"),
      sourceName: "Wikimedia Commons (Van Gogh Museum)",
      sourceRecordUrl:
        "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg",
      creator: "Vincent van Gogh",
      rightsStatement: "Public domain — author died more than 100 years ago",
      license: "PD-old-100-expired",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: id(),
      entityType: "work",
      entityId: work.wheatfieldWithCrows,
      imageUrl: commonsFilePath("Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg"),
      sourceName: "Wikimedia Commons (Van Gogh Museum)",
      sourceRecordUrl:
        "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Wheatfield_with_crows_-_Google_Art_Project.jpg",
      creator: "Vincent van Gogh",
      rightsStatement: "Public domain — author died more than 100 years ago",
      license: "PD-old-100-expired",
      publicDomain: true,
      commercialUseAllowed: true,
      derivativesAllowed: true,
      lastVerifiedAt: new Date().toISOString().slice(0, 10),
    },
  ]);

  // ---- Editorial Journey: Paris, 1889 (spec §18, matches homepage teaser) --
  const journeyId = id();
  await db.insert(journeys).values([
    {
      id: journeyId,
      slug: "paris-1889",
      title: "Paris, 1889",
      titleJa: "パリ、1889年",
      description:
        "A single year, seen from a tower still under suspicion, a night sky over Saint-Rémy, and a new constitution eight thousand kilometers away.",
      descriptionJa:
        "まだ物議を醸していた塔、サン=レミの夜空、そして8000キロ離れた地で公布された新しい憲法\u00A0— ひとつの年をめぐる物語。",
    },
  ]);

  await db.insert(journeySteps).values([
    {
      id: id(),
      journeyId,
      position: 0,
      stepType: "year",
      stepSlug: "1889",
      caption: "A year that looked entirely different depending on where you stood.",
      captionJa: "どこに立つかによって、まるで違う景色に見える一年だった。",
    },
    {
      id: id(),
      journeyId,
      position: 1,
      stepType: "work",
      stepSlug: "eiffel-tower",
      caption:
        "Newly finished for the Exposition Universelle, and still widely disliked by the Parisians who had to look at it.",
      captionJa: "万国博覧会に合わせて完成したばかりで、パリ市民の多くにはまだ不評だった。",
    },
    {
      id: id(),
      journeyId,
      position: 2,
      stepType: "event",
      stepSlug: "exposition-universelle-1889",
      caption: "The fair the tower was built for — a celebration of a century since the Revolution.",
      captionJa: "そのタワーが建てられた博覧会そのもの\u00A0— 革命から100年を祝う祭典だった。",
    },
    {
      id: id(),
      journeyId,
      position: 3,
      stepType: "work",
      stepSlug: "the-starry-night",
      caption:
        "Four hundred kilometers south, in an asylum courtyard, a very different kind of sky.",
      captionJa: "南へ400キロ、療養院の中庭からは、まったく違う種類の空が見えていた。",
    },
    {
      id: id(),
      journeyId,
      position: 4,
      stepType: "event",
      stepSlug: "promulgation-of-the-meiji-constitution",
      caption:
        "And on the other side of the world, a constitution was being promulgated the same February.",
      captionJa: "そして地球の反対側では、同じ年の2月に憲法が発布されていた。",
    },
  ]);

  // ---- Editorial Journey: Hokusai and the World Beyond Japan (spec §18) --
  const journeyHokusaiId = id();
  await db.insert(journeys).values([
    {
      id: journeyHokusaiId,
      slug: "hokusai-and-the-world-beyond-japan",
      title: "Hokusai and the World Beyond Japan",
      titleJa: "北斎、日本を越えて",
      description:
        "A print made in Edo, decades before Japan opened its ports, still found its way into a Dutch painter's collection.",
      descriptionJa:
        "日本が開国するずっと前、江戸で作られた一枚の版画は、それでもオランダの画家のコレクションにたどり着いた。",
    },
  ]);
  await db.insert(journeySteps).values([
    {
      id: id(),
      journeyId: journeyHokusaiId,
      position: 0,
      stepType: "person",
      stepSlug: "katsushika-hokusai",
      caption: "A woodblock print artist working in Edo, decades before Japan opened to the West.",
      captionJa: "日本が西洋に開かれるずっと前、江戸で活動した浮世絵師。",
    },
    {
      id: id(),
      journeyId: journeyHokusaiId,
      position: 1,
      stepType: "work",
      stepSlug: "the-great-wave-off-kanagawa",
      caption: "The best-known print from a series of thirty-six views of a single mountain.",
      captionJa: "ひとつの山を三十六通りに描いた連作の中で、最もよく知られる一枚。",
    },
    {
      id: id(),
      journeyId: journeyHokusaiId,
      position: 2,
      stepType: "movement",
      stepSlug: "ukiyo-e",
      caption: "Part of a wider genre of everyday scenes that European collectors began seeking out.",
      captionJa: "日常の情景を描く、より広いジャンルの一部。ヨーロッパの収集家たちがこぞって求めるようになった。",
    },
    {
      id: id(),
      journeyId: journeyHokusaiId,
      position: 3,
      stepType: "person",
      stepSlug: "vincent-van-gogh",
      caption: "One of the European painters who collected and studied prints like this one.",
      captionJa: "こうした版画を収集し、研究したヨーロッパの画家のひとり。",
    },
    {
      id: id(),
      journeyId: journeyHokusaiId,
      position: 4,
      stepType: "work",
      stepSlug: "the-starry-night",
      caption: "Painted decades later, half a world away — the influence stylistic, not personal.",
      captionJa: "数十年後、地球の反対側で描かれた作品 — つながりは様式的なもので、個人的な面識はない。",
    },
  ]);

  // ---- Editorial Journey: The Birth of Modern Science (spec §18) ---------
  const journeyScienceId = id();
  await db.insert(journeys).values([
    {
      id: journeyScienceId,
      slug: "the-birth-of-modern-science",
      title: "The Birth of Modern Science",
      titleJa: "近代科学の夜明け",
      description:
        "In a Paris laboratory, a new element was isolated — one that would reshape both physics and medicine.",
      descriptionJa: "パリの研究室で、新しい元素が単離された — それは物理学と医学の両方を変えることになる。",
    },
  ]);
  await db.insert(journeySteps).values([
    {
      id: id(),
      journeyId: journeyScienceId,
      position: 0,
      stepType: "person",
      stepSlug: "marie-curie",
      caption: "A physicist and chemist working in Paris, most of her career spent there.",
      captionJa: "パリを拠点に研究を続けた物理学者・化学者。",
    },
    {
      id: id(),
      journeyId: journeyScienceId,
      position: 1,
      stepType: "event",
      stepSlug: "discovery-of-radium",
      caption: "The announcement of a new radioactive element, isolated from pitchblende.",
      captionJa: "瀝青ウラン鉱から単離された、新しい放射性元素の発表。",
    },
    {
      id: id(),
      journeyId: journeyScienceId,
      position: 2,
      stepType: "year",
      stepSlug: "1898",
      caption: "The same year, seen from every other angle this atlas has recorded.",
      captionJa: "同じ年を、このアトラスに記録された他のすべての視点から見る。",
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
