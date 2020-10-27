import { Unwrap } from "../types.ts";

export enum TokenType {
  value = "value",
  operator = "operator",
  keyword = "keyword",
  block = "block",
  identifier = "identifier",
}

export abstract class Token {
  abstract type: TokenType;
  static isOperatorToken(token: Token): token is OperatorToken {
    return token.type === TokenType.operator;
  }

  static isOperator(thing: string) {
    return OperatorToken.operators.includes(thing as Operator);
  }

  static isKeywordToken(token: Token): token is KeywordToken {
    return token.type === TokenType.keyword;
  }

  static isKeyword(thing: string) {
    return KeywordToken.keywords.includes(thing as Keyword);
  }

  static isBlockToken(token: Token): token is BlockToken {
    return token.type === TokenType.block;
  }

  static isBlock(thing: string) {
    return BlockToken.blockDelimiters.includes(thing as BlockDelimeter);
  }

  static isIdentifierToken(token: Token): token is IdentifierToken {
    return token.type === TokenType.identifier;
  }
}

export class IdentifierToken extends Token {
  type = TokenType.identifier;

  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class ValueToken extends Token {
  type = TokenType.value;

  value: string | number | boolean;

  get valueType() {
    return typeof this.value as "string" | "number" | "boolean";
  }

  constructor(value: string | number | boolean) {
    super();
    this.value = value;
  }
}

export type BlockDelimeter = Unwrap<typeof BlockToken.blockDelimiters>;

export class BlockToken extends Token {
  type = TokenType.block;

  delimeter: BlockDelimeter;

  constructor(delimeter: string) {
    super();
    this.delimeter = delimeter as BlockDelimeter;
  }

  static blockDelimiters = [
    "(" as const,
    ")" as const,
    "[" as const,
    "]" as const,
    "{" as const,
    "}" as const,
  ];
}

type Keyword = Unwrap<typeof KeywordToken.keywords>;

export class KeywordToken extends Token {
  type = TokenType.keyword;
  keyword: Keyword;

  constructor(keyword: string) {
    super();
    this.keyword = keyword as Keyword;
  }

  static keywords = [
    "cond" as const,
    "return" as const,
    "while" as const,
    "true" as const,
    "false" as const,
    "for" as const,
    "void" as const,
    "default" as const,
    "const" as const,
    "let" as const,
  ];
}

type Operator = Unwrap<typeof OperatorToken.operators>;

export class OperatorToken extends Token {
  type = TokenType.operator;
  operator: Operator;

  constructor(operator: string) {
    super();
    this.operator = operator as Operator;
  }

  static operators = [
    "+" as const,
    "-" as const,
    "*" as const,
    "/" as const,
    "%" as const,
    "~" as const,
    "^" as const,
    "!" as const,
    "." as const,
    ".." as const,
    "->" as const,
    "=" as const,
    ":" as const,
    "==" as const,
    "!=" as const,
    "=~" as const,
    "!~" as const,
    "&" as const,
    "|" as const,
    "&&" as const,
    "||" as const,
    "|>" as const,
    ">" as const,
    "<" as const,
    ">=" as const,
    "<=" as const,
    "," as const,
    ";" as const,
  ];
}
