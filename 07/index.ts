import { readFile } from "../utils/file";
import Array2D from "../utils/array2d";

(async () => {
    console.log(await partOne("./07/test.txt")); // 21
    console.log(await partOne("./07/input.txt"));
    console.log(await partTwo("./07/test.txt")); // 40
    console.log(await partTwo("./07/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    const rawMap = input.map((line) => line.split(""));
    const map = new Array2D(rawMap);

    let splits = 0;

    for (const { value, position } of map) {
        const above = map.getPosition(position.up());

        if (value === "^" && above === "|") {
            map.setPosition(position.left(), "|");
            map.setPosition(position.right(), "|");
            splits++;
        } else if (above === "|" || above === "S") {
            map.setPosition(position, "|");
        }
    }

    return splits;
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    const rawMap = input.map((line) => line.split(""));
    const map = new Array2D<string | number>(rawMap);

    for (const { value, position } of map) {
        const above = map.getPosition(position.up());

        if (value === "^" && typeof above === "number") {
            const left = map.getPosition(position.left());
            if (typeof left === "number") {
                map.setPosition(position.left(), left + above);
            } else {
                map.setPosition(position.left(), above);
            }
            map.setPosition(position.right(), above);
        } else if (above === "S") {
            map.setPosition(position, 1);
        } else if (typeof above === "number") {
            if (typeof value === "number") {
                map.setPosition(position, value + above);
            } else {
                map.setPosition(position, above);
            }
        }
    }

    const base = map.values[map.height - 1];
    const sum = base.reduce((acc: number, val) => {
        if (typeof val === "number") {
            return acc + val;
        }
        return acc;
    }, 0);

    return sum;
}
