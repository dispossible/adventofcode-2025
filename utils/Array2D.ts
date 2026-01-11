export default class Array2D<T = string> {
    constructor(private array: T[][]) {}

    get width() {
        return this.array[0]?.length || 0;
    }

    get height() {
        return this.array.length;
    }

    get values() {
        return this.array.map((row) => [...row]);
    }

    get(x: number, y: number): T | undefined {
        return this.array[y]?.[x];
    }
    getPosition(position: { x: number; y: number }): T | undefined {
        return this.get(position.x, position.y);
    }

    set(x: number, y: number, value: T): void {
        if (x < this.width && y < this.height) {
            this.array[y][x] = value;
        }
    }
    setPosition(position: { x: number; y: number }, value: T): void {
        this.set(position.x, position.y, value);
    }

    [Symbol.iterator](): Iterator<Array2DValue<T>> {
        let x = 0;
        let y = 0;
        return {
            next: () => {
                if (y >= this.height) {
                    return { done: true, value: undefined };
                }

                const value: Array2DValue<T> = {
                    value: this.array[y][x],
                    position: new Position(x, y),
                };

                x++;
                if (x >= this.width) {
                    x = 0;
                    y++;
                }

                return {
                    done: false,
                    value,
                };
            },
        };
    }

    clone(): Array2D<T> {
        return new Array2D(this.values);
    }

    log() {
        console.log(this.array.map((row) => row.join("")).join("\n"));
    }
}

export class Position {
    constructor(public x: number, public y: number) {}

    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }

    up(amount = 1): Position {
        return new Position(this.x, this.y - amount);
    }

    down(amount = 1): Position {
        return new Position(this.x, this.y + amount);
    }

    left(amount = 1): Position {
        return new Position(this.x - amount, this.y);
    }

    right(amount = 1): Position {
        return new Position(this.x + amount, this.y);
    }

    upLeft(amount = 1): Position {
        return new Position(this.x - amount, this.y - amount);
    }

    upRight(amount = 1): Position {
        return new Position(this.x + amount, this.y - amount);
    }

    downLeft(amount = 1): Position {
        return new Position(this.x - amount, this.y + amount);
    }

    downRight(amount = 1): Position {
        return new Position(this.x + amount, this.y + amount);
    }
}

export type Array2DValue<T> = {
    value: T;
    position: Position;
};
