// 为markdown-it-custom-attrs模块添加类型声明
declare module 'markdown-it-custom-attrs' {
  import MarkdownIt from 'markdown-it';
  
  interface CustomAttrsOptions {
    [key: string]: string | boolean | number;
  }
  
  function customAttrs(md: MarkdownIt, tag: string, attrs: CustomAttrsOptions): void;
  
  export default customAttrs;
}

// 为vitepress主题配置添加类型
declare module 'vitepress' {
  import { DefaultTheme } from 'vitepress/theme';

  export interface ThemeConfig extends DefaultTheme.Config {
    posts?: any[];
    website?: string;
    comment?: {
      repo: string;
      themes: string;
      issueTerm: string;
    };
    externalLinkIcon?: boolean;
  }

  export interface UserConfig {
    title?: string;
    titleTemplate?: string;
    base?: string;
    cacheDir?: string;
    description?: string;
    ignoreDeadLinks?: boolean;
    lastUpdated?: boolean;
    markdown?: {
      config?: (md: any) => void;
      image?: {
        lazyLoading?: boolean;
      };
    };
    head?: any[];
    themeConfig?: ThemeConfig;
    srcExclude?: string[];
    vite?: {
      server?: {
        port?: number;
      };
    };
  }

  export function defineConfig(config: UserConfig): UserConfig;
}