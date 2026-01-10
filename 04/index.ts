import Array2D from "../utils/Array2D";
import { readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./04/test.txt")); // 13
    console.log(await partOne("./04/input.txt"));
    console.log(await partTwo("./04/test.txt")); // 43
    console.log(await partTwo("./04/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    const map = new Array2D(input.map((line) => line.split("")));

    let accessibleCount = 0;

    for (const { value, position } of map) {
        if (value === "@") {
            let count = 0;
            if (map.getPosition({ x: position.x - 1, y: position.y - 1 }) === "@") count++;
            if (map.getPosition({ x: position.x, y: position.y - 1 }) === "@") count++;
            if (map.getPosition({ x: position.x + 1, y: position.y - 1 }) === "@") count++;
            if (map.getPosition({ x: position.x - 1, y: position.y }) === "@") count++;
            if (map.getPosition({ x: position.x + 1, y: position.y }) === "@") count++;
            if (map.getPosition({ x: position.x - 1, y: position.y + 1 }) === "@") count++;
            if (map.getPosition({ x: position.x, y: position.y + 1 }) === "@") count++;
            if (map.getPosition({ x: position.x + 1, y: position.y + 1 }) === "@") count++;

            if (count < 4) {
                accessibleCount++;
            }
        }
    }

    return accessibleCount;
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    let map = new Array2D(input.map((line) => line.split("")));

    let rollsRemoved = 0;

    while (true) {
        const nextMap = map.clone();
        let changed = false;

        for (const { value, position } of map) {
            if (value === "@") {
                let count = 0;
                if (map.getPosition({ x: position.x - 1, y: position.y - 1 }) === "@") count++;
                if (map.getPosition({ x: position.x, y: position.y - 1 }) === "@") count++;
                if (map.getPosition({ x: position.x + 1, y: position.y - 1 }) === "@") count++;
                if (map.getPosition({ x: position.x - 1, y: position.y }) === "@") count++;
                if (map.getPosition({ x: position.x + 1, y: position.y }) === "@") count++;
                if (map.getPosition({ x: position.x - 1, y: position.y + 1 }) === "@") count++;
                if (map.getPosition({ x: position.x, y: position.y + 1 }) === "@") count++;
                if (map.getPosition({ x: position.x + 1, y: position.y + 1 }) === "@") count++;

                if (count < 4) {
                    rollsRemoved++;
                    nextMap.setPosition(position, "X");
                    changed = true;
                }
            }
        }

        map = nextMap;

        if (!changed) {
            break;
        }
    }

    return rollsRemoved;
}
