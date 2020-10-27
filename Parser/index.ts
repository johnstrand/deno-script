import { Tokenizer } from "../Tokenizer/index.ts";
import { Token, TokenType } from "../Tokenizer/Tokens.ts";

const createParser = (tokenizer: Tokenizer) => {
  const statement = () => {
    const next = tokenizer.advance();
    if (Token.isKeywordToken(next)) {
    } else {
      const expr = expression();
      const semicolon = tokenizer.match(TokenType.operator);
      if (
        !semicolon ||
        !Token.isOperatorToken(semicolon) ||
        semicolon.operator !== ";"
      ) {
        throw new Error("Expected ;");
      }
      return expr;
    }
  };

  return () => {
    const tree: Syntax[] = [];
    while (!tokenizer.eof()) {}
    return tree;
  };
};

export class SyntaxParser {
  static parse(tokenizer: Tokenizer): Syntax[] {
    const parser = createParser(tokenizer);
    return parser();
  }
}

export abstract class Syntax {}
