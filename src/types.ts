/**
 * Typings for data used around in the application.
 *
 * Some data returned by Directus is omitted intentionally, as it would
 * be of no use, e.g. with bidirectional relations, data can be infinitely
 * nested.
 */

export const LANGUAGE_KEYS = { 'fi-FI': 'fi', 'en-US': 'en' };
export const LANGUAGES = ['fi', 'en'] as const;
export type LanguageCode = typeof LANGUAGES[number];

/** Returned by Directus on successful authentication or refresh */
export type AuthenticationResponse = {
  access_token: string;
  expires: number;
  refresh_token: string;
};

/** User wrapped by Directus */
export type User = {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar: string;
  description?: string;
  language: LanguageCode;
};

/** Data required to submit a comment */
export type CommentFormData = {
  body: string;
  article: number;
  parent_comment?: number;
};

/** Data required to like an article */
export type LikeFormData = {
  articles_id: number;
  directus_users_id: string;
};

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
  user_default_picture: string;
  article_default_picture: string;

  prodeko_link: string;
  alumni_link: string;
  department_link: string;
  privacy_policy_link: string;
  facebook_link: string;
  instagram_link: string;
  linkedin_link: string;

  translations: Translated<{
    id: number;
    site_title: string;
    site_tagline: string;

    no_user_placeholder: string;
    log_in_link_text: string;
    log_out_link_text: string;
    my_info_link_text: string;

    alumni_link_text: string;
    department_link_text: string;
    privacy_policy_link_text: string;

    video_icon_alternative_text: string;
    podcast_icon_alternative_text: string;
    blog_post_icon_alternative_text: string;
    rainbow_icon_alternative_text: string;
    comment_icon_alternative_text: string;

    video_slug: string;
    podcast_slug: string;
    blog_post_slug: string;

    comment_section_title: string;
    like_count_text: string;
    log_in_to_comment_prompt: string;
    no_comments_yet: string;
    user_not_found: string;
    reply_button_text: string;
    new_comment_button_text: string;
    new_comment_title: string;
    send_button_text: string;
    cancel_button_text: string;
  }>;
};

export type Comment = {
  id: number;
  user_created?: User;
  date_created: string;
  body: HTMLString;
  article: number;
  parent_comment: number;
  subcomments: Comment[];
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

export type Like = {
  id: number;
  articles_id: number;
  directus_users_id: string;
};

export const ARTICLE_TYPES = ['blog_post', 'podcast', 'video'] as const;
export type ArticleType = typeof ARTICLE_TYPES[number];

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
  comments: Comment[];
  liked_by: Like[];
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
  template: 'front';
  date_updated?: string;
  background_banner: string;
  main_logo: string;
  translations: Translated<{
    id: number;
    slug: string;
    navigation_title: string;
    logo_alternative_text: string;
    videos_title: string;
    podcasts_title: string;
    blog_posts_title: string;
  }>;
  highlighted_articles: Article[];
};

export type InfoPageData = {
  id: number;
  template: 'info';
  date_updated?: string;
  background_banner: string;
  main_logo: string;
  translations: Translated<{
    id: number;
    slug: string;
    navigation_title: string;
    page_title: string;
    body: HTMLString;
  }>;
};

export type ArchivePageData = {
  id: number;
  template: 'archive';
  date_updated?: string;
  articles: Article[];
  translations: Translated<{
    page_title: string;
    slug: string;
    navigation_title: string;
    sort_order_label: string;
    filter_label: string;
    newest_first: string;
    oldest_first: string;
  }>;
};

/** Array of routes in the site that should be displayed in navbar */
export type PageRoutes = Translated<
  {
    title: string;
    slug: string;
  }[]
>;

type BasePageData = {
  language: LanguageCode;
  commonData: CommonData;
  routes: PageRoutes;
};

/**
 * Data to be passed down to global context and currently rendered page
 * If new pages are added, append the appropriate template and prop data
 * types here
 */
export type PageData = BasePageData &
  (
    | {
        template: 'front';
        data: FrontPageData;
      }
    | {
        template: 'info';
        data: InfoPageData;
      }
    | {
        template: 'archive';
        data: ArchivePageData;
      }
    | {
        template: 'article';
        data: Article;
      }
    | {
        template: 'notFound';
      }
  );
