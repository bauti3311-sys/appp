/**
 * Bounded recursive descent parser: never evaluates arbitrary code or eval().
 * Preserves exact logic from Kotlin Calculator.kt with math functions, powers, and percentages.
 */
export class Calculator {
  static evaluate(input: string): string | null {
    try {
      if (!input || input.length > 240) return null;
      let s = input
        .trim()
        .toLowerCase()
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '.')
        .replace(/√/g, 'sqrt')
        .replace(/π/g, 'pi');

      // Percent match: e.g. "25% de 800" or "15 % de 200"
      const percentMatch = s.match(/^([0-9.]+)\s*%\s+de\s+([0-9.]+)$/);
      if (percentMatch) {
        s = `${percentMatch[1]}/100*${percentMatch[2]}`;
      }

      // Check if expression looks like a math formula
      const hasDigit = /\d/.test(s);
      const hasConstant = s.includes('pi') || s.includes('e');
      const hasOperator = /[+\-*/^%()]/.test(s);
      const mathPrefixes = ['sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', 'abs', 'exp'];
      const hasPrefix = mathPrefixes.some(p => s.startsWith(p));

      if ((!hasDigit && !hasConstant) || (!hasOperator && !hasPrefix && s !== 'pi' && s !== 'e')) {
        return null;
      }

      const parser = new Parser(s.replace(/\s+/g, ''));
      const result = parser.expression();
      if (!parser.done() || !Number.isFinite(result)) {
        return null;
      }

      // Format result nicely, strip trailing zeros
      const formatted = Math.abs(result) < 1e-12 ? '0' : parseFloat(result.toPrecision(12)).toString();
      return formatted;
    } catch {
      return null;
    }
  }
}

class Parser {
  private s: string;
  private i: number = 0;

  constructor(s: string) {
    this.s = s;
  }

  done(): boolean {
    return this.i === this.s.length;
  }

  private eat(c: string): boolean {
    if (this.i < this.s.length && this.s[this.i] === c) {
      this.i++;
      return true;
    }
    return false;
  }

  expression(): number {
    let v = this.term();
    while (true) {
      if (this.eat('+')) {
        v += this.term();
      } else if (this.eat('-')) {
        v -= this.term();
      } else {
        return v;
      }
    }
  }

  private term(): number {
    let v = this.unary();
    while (true) {
      if (this.eat('*')) {
        v *= this.unary();
      } else if (this.eat('/')) {
        const d = this.unary();
        if (d === 0) throw new Error('Division by zero');
        v /= d;
      } else {
        return v;
      }
    }
  }

  private unary(): number {
    if (this.eat('+')) return this.unary();
    if (this.eat('-')) return -this.unary();
    return this.power();
  }

  private power(): number {
    let v = this.atom();
    if (this.eat('^')) {
      v = Math.pow(v, this.unary());
    }
    while (this.eat('%')) {
      v /= 100;
    }
    return v;
  }

  private atom(): number {
    const functions = [
      'asin', 'acos', 'atan', 'sqrt', 'sind', 'cosd', 'tand',
      'sin', 'cos', 'tan', 'log', 'abs', 'exp', 'ln'
    ];

    for (const name of functions) {
      if (this.s.startsWith(name, this.i)) {
        this.i += name.length;
        const value = this.atom();
        switch (name) {
          case 'sind': return Math.sin((value * Math.PI) / 180);
          case 'cosd': return Math.cos((value * Math.PI) / 180);
          case 'tand': return Math.tan((value * Math.PI) / 180);
          case 'sin': return Math.sin(value);
          case 'cos': return Math.cos(value);
          case 'tan': return Math.tan(value);
          case 'asin': return Math.asin(value);
          case 'acos': return Math.acos(value);
          case 'atan': return Math.atan(value);
          case 'sqrt': return Math.sqrt(value);
          case 'ln': return Math.log(value);
          case 'log': return Math.log10(value);
          case 'abs': return Math.abs(value);
          default: return Math.exp(value);
        }
      }
    }

    if (this.s.startsWith('pi', this.i)) {
      this.i += 2;
      return Math.PI;
    }
    if (this.s.startsWith('e', this.i)) {
      this.i++;
      return Math.E;
    }

    if (this.eat('(')) {
      const v = this.expression();
      if (!this.eat(')')) throw new Error('Missing closing parenthesis');
      return v;
    }

    const start = this.i;
    while (this.i < this.s.length && (/\d/.test(this.s[this.i]) || this.s[this.i] === '.')) {
      this.i++;
    }
    if (this.i <= start) {
      throw new Error(`Unexpected character: ${this.s[this.i]}`);
    }
    return parseFloat(this.s.substring(start, this.i));
  }
}
