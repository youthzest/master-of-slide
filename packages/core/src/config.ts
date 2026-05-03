export type OpenSlideBuildConfig = {
  showSlideBrowser?: boolean;
  showSlideUi?: boolean;
  allowHtmlDownload?: boolean;
};

export type OpenSlideConfig = {
  slidesDir?: string;
  port?: number;
  /**
   * BCP 47 document language tag used by the dev app and exported HTML/PDF.
   * Set to "ko" for Korean decks so browser line breaking, accessibility,
   * and font fallback choose Korean-friendly behavior.
   */
  lang?: string;
  build?: OpenSlideBuildConfig;
};
