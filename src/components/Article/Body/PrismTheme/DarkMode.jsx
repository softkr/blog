import { createGlobalStyle, css } from 'styled-components';
import CommonStyle from './CommonStyle';

const Theme = css`
  /**
   * prism.js tomorrow night eighties for JavaScript, CoffeeScript, CSS and HTML
   * Based on https://github.com/chriskempson/tomorrow-theme
   * @author Rose Pritchard
   */
  & code[class*='language-'],
  & pre[class*='language-'] {
    background-color: #222222;
  }

  .token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #999;
  }

  .token.punctuation {
    color: #ccc;
  }

  .token.tag,
  .token.attr-name,
  .token.namespace,
  .token.deleted {
    color: #e2777a;
  }

  .token.function-name {
    color: #6196cc;
  }

  .token.boolean,
  .token.number,
  .token.function {
    color: #f08d49;
  }

  .token.property,
  .token.class-name,
  .token.constant,
  .token.symbol {
    color: #f8c555;
  }

  .token.selector,
  .token.important,
  .token.atrule,
  .token.keyword,
  .token.builtin {
    color: #cc99cd;
  }

  .token.string,
  .token.char,
  .token.attr-value,
  .token.regex,
  .token.variable {
    color: #7ec699;
  }

  .token.operator,
  .token.entity,
  .token.url {
    color: #67cdcc;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.inserted {
    color: green;
  }
`;

const DarkMode = createGlobalStyle`
  ${CommonStyle}
  ${Theme}
`;

export default DarkMode;
