import { range } from "../utils/array";
import Array2D from "../utils/Array2D";
import { parseNumberList, readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./09/test.txt")); // 50
    console.log(await partOne("./09/input.txt"));
    console.log(await partTwo("./09/test.txt")); // 24
    console.log(await partTwo("./09/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    let largestArea = 0;

    for (let i = 0; i < input.length; i++) {
        const [x1, y1] = parseNumberList(input[i], ",");

        for (let ii = i + 1; ii < input.length; ii++) {
            const [x2, y2] = parseNumberList(input[ii], ",");

            const width = Math.abs(x1 - x2) + 1;
            const height = Math.abs(y1 - y2) + 1;

            const area = width * height;

            if (area > largestArea) {
                largestArea = area;
            }
        }
    }

    return largestArea;
}

type Box = {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
};

type Point = {
    x: number;
    y: number;
};

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    let boxes: Box[] = [];
    const coords: Point[] = [];

    for (let i = 0; i < input.length; i++) {
        const [x1, y1] = parseNumberList(input[i], ",");
        coords.push({
            x: x1,
            y: y1,
        });

        for (let ii = i + 1; ii < input.length; ii++) {
            const [x2, y2] = parseNumberList(input[ii], ",");

            boxes.push({
                top: Math.min(y1, y2),
                left: Math.min(x1, x2),
                bottom: Math.max(y1, y2),
                right: Math.max(x1, x2),
                width: Math.abs(x1 - x2) + 1,
                height: Math.abs(y1 - y2) + 1,
            });
        }
    }

    for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const next = coords[(i + 1) % coords.length];

        const dir = coord.x === next.x ? "V" : "H";
        const start = dir === "H" ? coord.x : coord.y;
        const end = dir === "H" ? next.x : next.y;
        const inverse = start > end;

        for (let step = start; step !== end; step += inverse ? -1 : 1) {
            const point = {
                x: dir === "H" ? step : coord.x,
                y: dir === "H" ? coord.y : step,
            };

            boxes = boxes.filter((box) => {
                return !(box.left < point.x && box.top < point.y && box.right > point.x && box.bottom > point.y);
            });
        }
        console.log(i / coords.length);
    }

    let largestArea = 0;
    for (const box of boxes) {
        const area = box.width * box.height;
        if (area > largestArea) {
            largestArea = area;
        }
    }

    return largestArea;
}
