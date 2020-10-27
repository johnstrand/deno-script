import { readLines } from "https://deno.land/std@0.74.0/io/mod.ts";

export class Grapheme {
  row: number;
  column: number;
  value: string;

  constructor(value: string, row: number, column: number) {
    this.value = value;
    this.column = column;
    this.row = row;
  }

  isWhitespace() {
    return this.match(/\s/);
  }

  isIdentifierHead() {
    return this.match(/[a-zA-Z_$]/);
  }

  isIdentifierBody() {
    return this.match(/[\w_$]/);
  }

  isNumeric() {
    return this.match(/[\d|.]/);
  }

  match(value: string): boolean;
  match(pattern: RegExp): boolean;
  match(valueOrPattern: string | RegExp) {
    return typeof valueOrPattern === "string"
      ? this.value === valueOrPattern
      : this.value.match(valueOrPattern);
  }
}

export class Scanner {
  private lines: string[] = [];
  private row: number = 0;
  private column: number = 0;

  eof() {
    return this.row === this.lines.length;
  }

  read(): Grapheme {
    if (this.eof()) {
      throw new Error("Unexpected end of data");
    }

    const value = this.lines[this.row][this.column];
    const { row, column } = this;
    this.column++;
    if (this.column === this.lines[this.row].length) {
      this.row++;
      this.column = 0;
    }

    if (value === "\r") {
      return this.read();
    }

    return new Grapheme(value, row + 1, column + 1);
  }

  skipRow() {
    if (this.eof()) {
      throw new Error("Unexpected end of data");
    }

    this.row++;
    this.column = 0;
  }

  peek(): Grapheme {
    if (this.eof()) {
      throw new Error("Unexpected end of data");
    }

    return new Grapheme(
      this.lines[this.row][this.column],
      this.row + 1,
      this.column + 1
    );
  }

  match(value: string): Grapheme | null;
  match(pattern: RegExp): Grapheme | null;
  match(valueOrPattern: string | RegExp) {
    const next = this.peek();

    if (next.match(valueOrPattern as string)) {
      return this.read();
    }

    return null;
  }

  async loadFile(file: string) {
    const reader = await Deno.open(file);
    for await (const line of readLines(reader)) {
      this.lines.push(line);
    }
    return this;
  }
}
