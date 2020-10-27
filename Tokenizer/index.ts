import { Grapheme, Scanner } from "../Scanner/index.ts";
import { StringBuilder } from "../Utils/StringBuilder.ts";
import {
  Token,
  OperatorToken,
  BlockToken,
  ValueToken,
  KeywordToken,
  IdentifierToken,
} from "./Tokens.ts";

export class Tokenizer {
  tokens: Token[];
  index: number = 0;

  get previous() {
    return this.tokens[this.index - 1];
  }

  get current() {
    return this.tokens[this.index];
  }

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  eof() {
    return this.index === this.tokens.length;
  }

  advance<T extends Token>() {
    if (!this.eof()) {
      this.index++;
    }

    return this.previous as T;
  }

  match<T extends Token>(type: T["type"]) {
    if (this.current.type === type) {
      return this.advance();
    }
    return null;
  }

  add(...tokens: Token[]) {
    this.tokens.push(...tokens);
  }

  static create(scanner: Scanner) {
    const tokenizer = new Tokenizer([]);
    while (!scanner.eof()) {
      const next = scanner.read();
      if (next.isWhitespace()) {
        // Ignore whitespace
      } else if (next.match("#")) {
        // Comment, skip the rest of the row
        scanner.skipRow();
      } else if (Token.isOperator(next.value)) {
        const candidate = scanner.peek();
        // Check if the current char is part of a two-character operator
        if (Token.isOperator(next.value + candidate.value)) {
          // Read and discard the second character
          scanner.read();
          tokenizer.add(new OperatorToken(next.value + candidate.value));
        } else {
          tokenizer.add(new OperatorToken(next.value));
        }
      } else if (Token.isBlock(next.value)) {
        tokenizer.add(new BlockToken(next.value));
      } else if (next.match('"')) {
        const str = new StringBuilder();
        let g: Grapheme;
        // Read characters until we find a " (then exit the loop and discard the closing ")
        while (!(g = scanner.read()).match('"')) {
          // TODO: Escape sequences
          str.append(g.value);
        }
        tokenizer.add(new ValueToken(str.toString()));
      } else if (next.isNumeric()) {
        const num = new StringBuilder(next.value);
        while (!scanner.eof() && scanner.peek().isNumeric()) {
          num.append(scanner.read().value);
        }
        tokenizer.add(new ValueToken(parseFloat(num.toString())));
      } else if (next.isIdentifierHead()) {
        const ident = new StringBuilder(next.value);
        while (!scanner.eof() && scanner.peek().isIdentifierBody()) {
          ident.append(scanner.read().value);
        }
        const value = ident.toString();
        if (Token.isKeyword(value)) {
          tokenizer.add(new KeywordToken(value));
        } else {
          tokenizer.add(new IdentifierToken(value));
        }
      } else {
        throw new Error(`Unknown character ${next.value}`);
      }
    }
    return tokenizer;
  }
}
