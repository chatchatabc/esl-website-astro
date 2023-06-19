
export type PageMetaTag = {
  title: string;
  description: string;
  keywords: string;
  author: string;
}
export type OpenGraphMetaTag = {
  title: string;
  type: string;
  image: string;
  description: string;
}

export type TwitterMetaTag = {
  cardType: string,
  title: string,
  description: string,
  image: string,
}
export type MetaTag = {
  page: PageMetaTag
  openGraph : OpenGraphMetaTag
  twitter: TwitterMetaTag
}
