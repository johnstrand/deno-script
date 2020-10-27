import { Scanner } from "./Scanner/index.ts";
import { Tokenizer } from "./Tokenizer/index.ts";

const scanner = await new Scanner().loadFile("./test.ds");

const tokenizer = Tokenizer.create(scanner);

console.log(tokenizer.tokens);
