export interface JsonToHtmlOptionType {
  fontSize?: string;
  font?: string;
  space?: string;
  space_from_left?: string;
  links?: boolean;
  colors?: {
    background?: string;
    keys?: string;
    values?: {
      number?: string;
      string?: string;
      boolean?: string;
      function?: string;
      undefined?: string;
      null?: string;
      other?: string;
      curly_brace?: string;
      square_brace?: string;
      comma_colon_quotes?: string;
    };
  };
  line_numbers?: {
    show?: boolean;
    color?: string;
    space_from_left?: string;
  };
  retractors?: {
    show?: boolean;
    color?: string;
    space_from_left?: string;
  };
  bracket_pair_lines?: {
    show?: boolean;
    color?: string;
    space_from_left?: string;
    type?: 'dotted' | 'dashed' | 'solid' | 'none';
  };
}
