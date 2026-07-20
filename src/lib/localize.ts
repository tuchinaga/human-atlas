const PLACE_TYPE_JA: Record<string, string> = {
  city: "都市",
  town: "町",
};

const COUNTRY_JA: Record<string, string> = {
  France: "フランス",
  Japan: "日本",
  Netherlands: "オランダ",
  "United Kingdom": "イギリス",
  Hungary: "ハンガリー",
  Norway: "ノルウェー",
  "United States": "アメリカ合衆国",
  Germany: "ドイツ",
  China: "中国",
};

export function localizePlaceType(placeType: string | null, locale: "en" | "ja"): string | null {
  if (!placeType) return null;
  if (locale === "ja") return PLACE_TYPE_JA[placeType] ?? placeType;
  return placeType;
}

export function localizeCountry(country: string | null, locale: "en" | "ja"): string | null {
  if (!country) return null;
  if (locale === "ja") return COUNTRY_JA[country] ?? country;
  return country;
}
