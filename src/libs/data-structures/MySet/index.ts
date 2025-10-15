export default class MySet<T> {
  private items: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator?: (a: T, b: T) => number) {
    this.items = [];
    this.comparator =
      comparator ||
      ((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
  }

  add(value: T): void {
    // if (!this.has(value)) {
    //   this.items.push(value);
    //   this.items.sort(this.comparator);
    // }
    this.items.push(value);
    this.items.sort(this.comparator);
  }

  delete(value: T): void {
    const index = this.items.indexOf(value);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  has(value: T): boolean {
    return this.items.includes(value);
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  values(): T[] {
    return [...this.items];
  }

  print(): void {
    console.log(this.items.join(" "));
  }
}
