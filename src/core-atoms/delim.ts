import { Atom, AtomJson, ToLatexOptions } from '../core/atom-class';
import { Box, BoxType } from '../core/box';
import { Context } from '../core/context';
import { makeSizedDelim } from '../core/delimiters';
import { Style } from '../public/core';

export class DelimAtom extends Atom {
  size: 1 | 2 | 3 | 4;
  constructor(
    command: string,
    delim: string,
    options: {
      size: 1 | 2 | 3 | 4;
      style: Style;
    }
  ) {
    super('delim', { command, style: options?.style });
    this.value = delim;
    this.size = options?.size;
  }

  static fromJson(json: AtomJson): DelimAtom {
    return new DelimAtom(json.command, json.delim, json as any);
  }

  toJson(): AtomJson {
    return { ...super.toJson(), delim: this.value, size: this.size };
  }

  render(_context: Context): Box {
    const box = new Box(null);
    box.delim = this.value;
    return box;
  }

  serialize(_options: ToLatexOptions): string {
    if (this.value.length === 1) return this.command + this.value;

    return `${this.command}{${this.value}}`;
  }
}

export class SizedDelimAtom extends Atom {
  protected delimClass: BoxType;
  private readonly size: 1 | 2 | 3 | 4;
  constructor(
    command: string,
    delim: string,
    options: {
      delimClass: BoxType;
      size: 1 | 2 | 3 | 4;
      style: Style;
    }
  ) {
    super('sizeddelim', { command, style: options.style });
    this.value = delim;
    this.delimClass = options.delimClass;
    this.size = options.size;
  }

  static fromJson(json: AtomJson): SizedDelimAtom {
    return new SizedDelimAtom(json.command, json.delim, json as any);
  }

  toJson(): AtomJson {
    return {
      ...super.toJson(),
      delim: this.value,
      size: this.size,
      delimClass: this.delimClass,
    };
  }

  render(context: Context): Box | null {
    let result = makeSizedDelim(this.value, this.size, context, {
      classes: this.delimClass,
    });
    if (!result) return null;
    result = this.bind(context, result);
    if (this.caret) result.caret = this.caret;
    return result;
  }

  serialize(_options: ToLatexOptions): string {
    if (this.value.length === 1) return this.command + this.value;

    return `${this.command}{${this.value}}`;
  }
}
