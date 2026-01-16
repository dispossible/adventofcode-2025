import { parseNumberList, readFile } from "../utils/file";

(async () => {
    console.log(await partOne("Day9/test.txt")); // 50
    console.log(await partOne("Day9/input.txt"));
    console.log(await partTwo("Day9/test.txt")); // 24
    console.log(await partTwo("Day9/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);
    const points = parsePoints(input);

    let largestArea = 0;

    for (let i = 0; i < points.length; i++) {
        for (let ii = i + 1; ii < points.length; ii++) {
            const area = rectangleArea(points[i], points[ii]);

            if (area > largestArea) {
                largestArea = area;
            }
        }
    }

    return largestArea;
}

type Point = {
    x: number;
    y: number;
};

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);
    const points = parsePoints(input);

    const { prefix, xIndex, yIndex } = buildPrefix(points);

    let largestArea = 0;

    for (let i = 0; i < points.length; i++) {
        for (let ii = i + 1; ii < points.length; ii++) {
            const a = points[i];
            const b = points[ii];
            const area = rectangleArea(a, b);

            const x0 = getIndex(xIndex, 2 * Math.min(a.x, b.x) - 1);
            const x1 = getIndex(xIndex, 2 * Math.max(a.x, b.x) + 1);
            const y0 = getIndex(yIndex, 2 * Math.min(a.y, b.y) - 1);
            const y1 = getIndex(yIndex, 2 * Math.max(a.y, b.y) + 1);

            const filled = queryPrefix(prefix, y0, y1, x0, x1);

            if (filled === area && area > largestArea) {
                largestArea = area;
            }
        }
    }

    return largestArea;
}

function rectangleArea(a: Point, b: Point): number {
    return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
}

function parsePoints(lines: string[]): Point[] {
    const points: Point[] = [];

    for (const line of lines) {
        if (!line.trim()) {
            continue;
        }

        const [x, y] = parseNumberList(line, ",");
        points.push({ x, y });
    }

    return points;
}

type AxisCompression = {
    spans: number[];
    index: Map<number, number>;
    coords: number[];
};

function compressAxis(values: number[]): AxisCompression {
    const raw = new Set<number>();
    for (const value of values) {
        raw.add(2 * value - 1);
        raw.add(2 * value + 1);
    }

    const sorted = [...raw].sort((a, b) => a - b);
    if (sorted.length === 0) {
        throw new Error("Unable to compress empty axis");
    }
    const coords = [sorted[0] - 2, ...sorted, sorted[sorted.length - 1] + 2];
    const index = new Map<number, number>();
    coords.forEach((value, idx) => index.set(value, idx));

    const spans: number[] = [];
    for (let i = 0; i < coords.length - 1; i++) {
        spans.push((coords[i + 1] - coords[i]) / 2);
    }

    return { spans, index, coords };
}

type MaskResult = {
    mask: number[][];
    xSpan: number[];
    ySpan: number[];
    xIndex: Map<number, number>;
    yIndex: Map<number, number>;
};

function buildMasks(points: Point[]): MaskResult {
    const xValues = points.map((point) => point.x);
    const yValues = points.map((point) => point.y);
    const { spans: xSpan, index: xIndex } = compressAxis(xValues);
    const { spans: ySpan, index: yIndex } = compressAxis(yValues);

    const width = xSpan.length;
    const height = ySpan.length;

    const mask = Array.from({ length: height }, () => new Array<number>(width).fill(0));

    const loop = [...points, points[0]];
    for (let i = 0; i < loop.length - 1; i++) {
        const current = loop[i];
        const next = loop[i + 1];

        if (current.x === next.x) {
            const xi = getIndex(xIndex, 2 * current.x - 1);
            const yStart = getIndex(yIndex, 2 * Math.min(current.y, next.y) - 1);
            const yEnd = getIndex(yIndex, 2 * Math.max(current.y, next.y) + 1);
            for (let y = yStart; y < yEnd; y++) {
                mask[y][xi] = 1;
            }
        } else {
            const yiStart = getIndex(yIndex, 2 * current.y - 1);
            const yiEnd = getIndex(yIndex, 2 * current.y + 1);
            const xStart = getIndex(xIndex, 2 * Math.min(current.x, next.x) - 1);
            const xEnd = getIndex(xIndex, 2 * Math.max(current.x, next.x) + 1);
            for (let y = yiStart; y < yiEnd; y++) {
                for (let x = xStart; x < xEnd; x++) {
                    mask[y][x] = 1;
                }
            }
        }
    }

    const queue: Array<{ x: number; y: number }> = [];

    const push = (y: number, x: number) => {
        if (y < 0 || y >= height || x < 0 || x >= width) {
            return;
        }
        if (mask[y][x] !== 0) {
            return;
        }

        mask[y][x] = -1;
        queue.push({ x, y });
    };

    for (let x = 0; x < width; x++) {
        push(0, x);
        push(height - 1, x);
    }
    for (let y = 0; y < height; y++) {
        push(y, 0);
        push(y, width - 1);
    }

    while (queue.length) {
        const current = queue.shift()!;
        push(current.y + 1, current.x);
        push(current.y - 1, current.x);
        push(current.y, current.x + 1);
        push(current.y, current.x - 1);
    }

    return { mask, xSpan, ySpan, xIndex, yIndex };
}

type PrefixResult = {
    prefix: number[][];
    xIndex: Map<number, number>;
    yIndex: Map<number, number>;
};

function buildPrefix(points: Point[]): PrefixResult {
    const { mask, xSpan, ySpan, xIndex, yIndex } = buildMasks(points);
    const height = mask.length;
    const width = mask[0].length;
    const prefix = Array.from({ length: height + 1 }, () => new Array<number>(width + 1).fill(0));

    for (let y = 0; y < height; y++) {
        let rowSum = 0;
        for (let x = 0; x < width; x++) {
            if (mask[y][x] !== -1) {
                rowSum += xSpan[x] * ySpan[y];
            }
            prefix[y + 1][x + 1] = prefix[y][x + 1] + rowSum;
        }
    }

    return { prefix, xIndex, yIndex };
}

function queryPrefix(prefix: number[][], y0: number, y1: number, x0: number, x1: number): number {
    return prefix[y1][x1] - prefix[y0][x1] - prefix[y1][x0] + prefix[y0][x0];
}

function getIndex(index: Map<number, number>, key: number): number {
    const value = index.get(key);
    if (value === undefined) {
        throw new Error(`Missing index for key ${key}`);
    }
    return value;
}
