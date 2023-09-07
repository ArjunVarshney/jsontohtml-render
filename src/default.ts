import { JsonToHtmlOptionType } from './types';

export const defaultStyles: JsonToHtmlOptionType = {
  fontSize: '14px',
  space: '25px',
  space_from_left: '20px',
  links: true,
  colors: {
    background: 'black',
    keys: '#d54e50',
    values: {
      number: '#FF8811',
      string: '#b9ba1f',
      boolean: '#EDA2F2',
      function: '#FFC43D',
      undefined: '#06D6A0',
      null: '#B3B7EE',
      other: '#FFC43D',
      curly_brace: '#FFFFFF',
      square_brace: '#FFFFFF',
      comma_colon_quotes: '#FFFFFF',
    },
  },
  retractors: {
    show: true,
    color: '#8c8c8c',
    space_from_left: '-5px',
  },
  line_numbers: {
    show: true,
    color: '#5c749c',
    space_from_left: '40px',
  },
  bracket_pair_lines: {
    show: true,
    color: '#5c5c5c',
    space_from_left: '6px',
    type: 'solid',
  },
};
