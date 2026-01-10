export default class Array2D<T = string> {
    constructor(private array: T[][]) {}

    get width() {
        return this.array[0]?.length || 0;
    }

    get height() {
        return this.array.length;
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
                    position: { x, y },
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
        const newArray = this.array.map((row) => [...row]);
        return new Array2D(newArray);
    }

    log() {
        console.log(this.array.map((row) => row.join("")).join("\n"));
    }
}

export type Position = {
    x: number;
    y: number;
};

export type Array2DValue<T> = {
    value: T;
    position: Position;
};
