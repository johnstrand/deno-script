export class StringBuilder {
  private parts: string[];

  constructor(...parts: string[]) {
    this.parts = parts;
  }

  append(part: string) {
    this.parts.push(part);
  }

  any() {
    return this.parts.length > 0;
  }

  toString() {
    return this.parts.join("");
  }
}
