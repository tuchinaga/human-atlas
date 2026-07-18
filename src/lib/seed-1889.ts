import type { CategoryKey } from "@/lib/categories";

export type YearCard = {
  category: CategoryKey;
  title: string;
  titleJa: string;
  person?: string;
  place: string;
  placeJa: string;
  context: string;
  contextJa: string;
  confidence: "verified" | "probable" | "approximate";
};

export const YEAR_1889_CARDS: YearCard[] = [
  {
    category: "art",
    title: "The Starry Night",
    titleJa: "星月夜",
    person: "Vincent van Gogh",
    place: "Saint-Rémy-de-Provence",
    placeJa: "サン=レミ=ド=プロヴァンス",
    context: "Painted from the asylum window, working from memory as much as sight.",
    contextJa: "療養院の窓から、記憶と観察の両方を頼りに描かれた。",
    confidence: "verified",
  },
  {
    category: "architecture",
    title: "Eiffel Tower",
    titleJa: "エッフェル塔",
    person: "Gustave Eiffel",
    place: "Paris",
    placeJa: "パリ",
    context: "Completed as the entrance arch for the Exposition Universelle.",
    contextJa: "万国博覧会の正面ゲートとして完成した。",
    confidence: "verified",
  },
  {
    category: "japan",
    title: "Promulgation of the Meiji Constitution",
    titleJa: "大日本帝国憲法発布",
    place: "Tokyo",
    placeJa: "東京",
    context: "Japan's first modern constitution, establishing a constitutional monarchy.",
    contextJa: "日本初の近代憲法で、立憲君主制の基礎を定めた。",
    confidence: "verified",
  },
  {
    category: "music",
    title: "Symphony No. 1",
    titleJa: "交響曲第1番",
    person: "Gustav Mahler",
    place: "Budapest",
    placeJa: "ブダペスト",
    context: "Premiered to a puzzled audience under the title 'Titan'.",
    contextJa: "「巨人」という題で初演されたが、聴衆の反応は芳しくなかった。",
    confidence: "verified",
  },
  {
    category: "history",
    title: "Exposition Universelle",
    titleJa: "パリ万国博覧会",
    place: "Paris",
    placeJa: "パリ",
    context: "A world's fair marking the centennial of the French Revolution.",
    contextJa: "フランス革命100周年を記念した万国博覧会。",
    confidence: "verified",
  },
  {
    category: "science",
    title: "Nintendo Koppai founded",
    titleJa: "任天堂骨牌 創業",
    person: "Fusajiro Yamauchi",
    place: "Kyoto",
    placeJa: "京都",
    context: "Began as a maker of handmade hanafuda playing cards.",
    contextJa: "手作りの花札（はなふだ）製造業として創業した。",
    confidence: "approximate",
  },
];

export const YEAR_1889_AGES: { name: string; nameJa: string; age: number }[] = [
  { name: "Vincent van Gogh", nameJa: "ヴィンセント・ファン・ゴッホ", age: 36 },
  { name: "Claude Monet", nameJa: "クロード・モネ", age: 48 },
  { name: "Pierre-Auguste Renoir", nameJa: "ピエール=オーギュスト・ルノワール", age: 48 },
  { name: "Gustav Mahler", nameJa: "グスタフ・マーラー", age: 29 },
  { name: "Natsume Sōseki", nameJa: "夏目漱石", age: 22 },
  { name: "Pablo Picasso", nameJa: "パブロ・ピカソ", age: 7 },
];
