import { JsonToHtmlOptionType } from './src/types';
import { defaultStyles } from './src/default';

let num = 0;

const tags = {
  div: (data: string, style?: string): string => `<div ${style ? `style="${style}"` : ''}>${data}</div>`,
  span: (data: string, style?: string): string => `<span ${style ? `style="${style}"` : ''}>${data}</span>`,
  comment: (data: string, styles: JsonToHtmlOptionType): string =>
    styles.comments!.show
      ? `<i style="
    color:${styles.comments!.color};
    position:absolute;
    margin-left:${styles.comments!.space_from_left};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    ">${data}</i>`
      : '',
  br: () => `<br>`,
  code: (data: (...args: any[]) => any | string, styles: JsonToHtmlOptionType, style?: string) =>
    `<pre style="
    margin: 0 0 0 0;
    display:inline;
    color:${styles.colors!.values!.function};
    "><code style="
    font-family:${styles.font!};
    ${style || ''}
    ">${data}</code></pre>`,
  number: (styles: JsonToHtmlOptionType, style?: string) =>
    styles.line_numbers!.show
      ? `<span style="
    position:absolute;
    left:${styles.line_numbers!.space_from_left};
    color:${styles!.line_numbers!.color};
    background:${styles.colors!.background!};
    font-size:calc(${styles.fontSize} - 1px);
    translate: -100% 1px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
      ${style || ''}"
      >${++num}</span>`
      : '',
  curlyBrace: (data: string, styles: JsonToHtmlOptionType) =>
    `<span style="
    color:${styles.colors!.values!.curly_brace}
    ">${data}</span>`,
  squareBrace: (data: string, styles: JsonToHtmlOptionType) =>
    `<span style="
    color:${styles.colors!.values!.square_brace}
    ">${data}</span>`,
  comma_colon_quotes: (data: string, styles: JsonToHtmlOptionType) =>
    `<span style="
    color:${styles.colors!.values!.comma_colon_quotes};
    ${data === ':' && 'margin-right:3px;'}
    ">${data}</span>`,
  closeButton: (styles: JsonToHtmlOptionType) =>
    styles.retractors!.show
      ? `<button style="
        color:${styles.retractors!.color};
        position:absolute;
        left:${styles.retractors!.space_from_left};
        translate:0 -${styles.fontSize!};
        background: ${styles.colors!.background};
	      border: none;
	      padding: 0;
	      outline: inherit;
        overflow: hidden;
        font-size: ${styles.fontSize};
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        "
        onclick="(function(e){
          const entries = e.target.parentElement.querySelector('div');
          if(entries.style.display === 'block' || entries.style.display === ''){
            entries.style.display = 'none';
            e.target.parentElement.style.display = 'inline-block'
            e.target.innerText = '▾';
          }else {
            entries.style.display = 'block';
            e.target.parentElement.style.display = 'block'
            e.target.innerText = '▴';
          }
        return false;
        })(arguments[0]);return false;">▴</button>`
      : '',
};

const parseOperations = {
  object: (data: object, styles: JsonToHtmlOptionType): string => {
    if (Object.entries(data).length === 0) return tags.number(styles) + tags.curlyBrace('{}', styles);

    const html = tags.number(styles) + tags.curlyBrace('{', styles);

    let values = '';
    for (const [key, value] of Object.entries(data)) {
      values +=
        (!(value instanceof Object) || value instanceof Array ? tags.number(styles) : '') +
        tags.div(
          tags.comma_colon_quotes('"', styles) +
            tags.span(key, `color:${styles.colors!.keys!};`) +
            tags.comma_colon_quotes('"', styles) +
            tags.comma_colon_quotes(':', styles) +
            parseJson(value, styles) +
            tags.comma_colon_quotes(',', styles),
          `padding-left:${styles.space!}`,
        );
    }

    return (
      html +
      tags.div(
        tags.closeButton(styles) + tags.div(values),
        `${
          styles.bracket_pair_lines!.show
            ? `margin-left:${styles.bracket_pair_lines!.space_from_left};
            border-left:1px ${styles.bracket_pair_lines!.type} ${styles.bracket_pair_lines!.color};`
            : ''
        }`,
      ) +
      tags.number(styles) +
      tags.curlyBrace('}', styles) +
      tags.comment(` // ${Object.entries(data).length} entries`, styles)
    );
  },
  array: (data: any[], styles: JsonToHtmlOptionType): string => {
    if (data.length === 0) {
      return tags.squareBrace('[]', styles);
    }

    let html = '';
    for (const [_, value] of Object.entries(data)) {
      html += tags.div(
        parseJson(value, styles, true) + tags.comma_colon_quotes(',', styles),
        `padding-left:${styles.space!};`,
      );
    }

    return (
      tags.squareBrace('[', styles) +
      tags.div(
        tags.closeButton(styles) + tags.div(html),
        `${
          styles.bracket_pair_lines!.show
            ? `margin-left:${styles.bracket_pair_lines!.space_from_left};
            border-left:1px ${styles.bracket_pair_lines!.type} ${styles.bracket_pair_lines!.color};`
            : ''
        }`,
      ) +
      tags.number(styles) +
      tags.squareBrace(']', styles) +
      tags.comment(` // ${data.length} elements`, styles)
    );
  },
  string: (data: string, styles: JsonToHtmlOptionType): string => {
    return tags.span(`"${data}"`, `color:${styles.colors!.values!.string};`);
  },
  number: (data: number, styles: JsonToHtmlOptionType): string => {
    return tags.span(`${data}`, `color:${styles.colors!.values!.number};`);
  },
  boolean: (data: boolean, styles: JsonToHtmlOptionType): string => {
    return tags.span(`${data}`, `color:${styles.colors!.values!.boolean};`);
  },
  undefined: (styles: JsonToHtmlOptionType): string => {
    return tags.span('undefined', `color:${styles.colors!.values!.undefined};`);
  },
  function: (data: (...args: any[]) => any, styles: JsonToHtmlOptionType) => {
    return tags.code(data, styles);
  },
  null: (styles: JsonToHtmlOptionType): string => {
    return tags.span('null', `color:${styles.colors!.values!.null};`);
  },
  other: (data: any, styles: JsonToHtmlOptionType) => {
    return tags.div(JSON.stringify(data), `color:${styles.colors!.values!.function}`);
  },
};

const parseJson = (data: any, styles: JsonToHtmlOptionType, addNumber?: boolean): string => {
  if (typeof data === 'object' && data instanceof Object && !(data instanceof Array))
    return parseOperations.object(data, styles);
  else if (typeof data === 'object' && data instanceof Array) {
    const html = `${num === 0 || addNumber ? tags.number(styles) : ''}` + parseOperations.array(data, styles);
    return html;
  } else if (typeof data === 'string') {
    const html = `${num === 0 ? tags.number(styles) : ''}` + parseOperations.string(data, styles);
    return html;
  } else if (typeof data === 'object' && JSON.stringify(data) === 'null') {
    const html = `${num === 0 ? tags.number(styles) : ''}` + parseOperations.null(styles);
    return html;
  } else if (typeof data === 'number') {
    const html = `${num === 0 ? tags.number(styles) : ''}` + parseOperations.number(data, styles);
    return html;
  } else if (typeof data === 'boolean') {
    const html = `${num === 0 ? tags.number(styles) : ''}` + parseOperations.boolean(data, styles);
    return html;
  } else if (typeof data === 'undefined') {
    const html = `${num === 0 ? tags.number(styles) : ''}` + parseOperations.undefined(styles);
    return html;
  } else if (typeof data === 'function') {
    const html = `${num === 0 ? tags.number(styles) : ''}` + parseOperations.function(data, styles);
    return html;
  }

  return parseOperations.other(data, styles);
};

export function jsontohtml(data: any, options?: JsonToHtmlOptionType): string {
  num = 0;
  const styles: JsonToHtmlOptionType = {
    ...defaultStyles,
    ...options,
    colors: {
      ...defaultStyles.colors,
      ...options?.colors,
    },
    comments: {
      ...defaultStyles.comments,
      ...options?.comments,
    },
    line_numbers: {
      ...defaultStyles.line_numbers,
      ...options?.line_numbers,
    },
    retractors: {
      ...defaultStyles.retractors,
      ...options?.retractors,
    },
    bracket_pair_lines: {
      ...defaultStyles.bracket_pair_lines,
      ...options?.bracket_pair_lines,
    },
  };

  styles.retractors!.space_from_left = styles.retractors!.show ? styles.retractors!.space_from_left : '0px';

  styles.line_numbers!.space_from_left = styles.line_numbers!.show ? styles.line_numbers!.space_from_left : '0px';

  styles.bracket_pair_lines!.space_from_left = styles.bracket_pair_lines!.show
    ? styles.bracket_pair_lines!.space_from_left
    : '0px';

  return `
  <div style="
  position:relative;
  padding-left:${styles.space_from_left};
  background:${styles.colors!.background};
  font-size:${styles.fontSize} !important;
  ${styles.font ? `font-family:${styles.font}` : ''}
  ">
  ${parseJson(data, styles)}
  </div>
  `.replace(
    /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g,
    `${
      styles.links ? `<a target="_blank" style='color:#3891ff; text-decoration:"underline";' href="$1">$1</a>` : '$1'
    }`,
  );
}