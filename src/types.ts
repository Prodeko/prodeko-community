export const LANGUAGE_KEYS = { 'fi-FI': 'fi', 'en-US': 'en' };
export const LANGUAGES = ['fi', 'en'] as const;
export type LanguageCode = typeof LANGUAGES[number];

type Translated<Data> = {
  [key in LanguageCode]: Data;
};

/** Output string of a WYSIWYG interface which should be injected instead of rendering */
type HTMLString = string;

export type CommonData = {
  id: number;
  date_updated?: string;
  logo: string;
  prodeko_logo: string;
  prodeko_link: string;
  alumni_link: string;
  department_link: string;
  privacy_policy_link: string;
  facebook_link: string;
  instagram_link: string;
  linkedin_link: string;
  translations: Translated<{
    id: number;
    alumni_link_text: string;
    department_link_text: string;
    my_info_link_text: string;
    log_out_link_text: string;
    privacy_policy_link_text: string;
    video_icon_alternative_text: string;
    podcast_icon_alternative_text: string;
    blog_post_icon_alternative_text: string;
    rainbow_icon_alternative_text: string;
    comment_icon_alternative_text: string;
  }>;
};

export type Author = {
  id: number;
  date_updated?: string;
  name: string;
  photo: string;
  translations: Translated<{
    id: number;
    biography: HTMLString;
  }>;
};

type ArticleType = 'blog_post' | 'podcast' | 'video';

type ArticleBase = {
  id: number;
  date_updated?: string;
  publish_date: string;
  type: ArticleType;
  photo: string;
  author?: Author;
  translations: Translated<{
    id: number;
    title: string;
    ingress?: string;
    tagline: string;
    body: HTMLString;
    slug: string;
  }>;
  comments: []; // TODO: Comments type
};

interface BlogPost extends ArticleBase {
  type: 'blog_post';
}

interface Podcast extends ArticleBase {
  type: 'podcast';
  spotify_embed: string;
}

interface Video extends ArticleBase {
  type: 'video';
  youtube_embed: string;
}

export type Article = BlogPost | Podcast | Video;

export type FrontPageData = {
  id: number;
  date_updated?: string;
  background_banner: string;
  main_logo: string;
  translations: Translated<{
    id: number;
    logo_alternative_text: string;
    videos_title: string;
    podcasts_title: string;
    blog_posts_title: string;
  }>;
  highlighted_articles: Article[];
};
