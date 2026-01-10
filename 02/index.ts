import { range } from "../utils/array";
import { readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./02/test.txt")); // 1227775554
    console.log(await partOne("./02/input.txt"));
    console.log(await partTwo("./02/test.txt")); // 4174379265
    console.log(await partTwo("./02/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    let sum = 0;
    const ranges = input[0].split(",").map((r) => r.trim());

    for (const idRange of ranges) {
        const [start, end] = idRange.split("-");

        if (start.length === end.length && start.length % 2 !== 0) {
            continue;
        }

        const startVal = parseInt(start, 10);
        const endVal = parseInt(end, 10);

        for (let value = startVal; value <= endVal; value++) {
            const strValue = value.toString();

            if (strValue.length % 2 === 0) {
                const mid = Math.ceil(strValue.length / 2);
                const firstHalf = strValue.slice(0, mid);
                const secondHalf = strValue.slice(mid);
                if (firstHalf === secondHalf) {
                    sum += value;
                }
            }
        }
    }

    return sum;
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    let sum = 0;
    const ranges = input[0].split(",").map((r) => r.trim());

    for (const idRange of ranges) {
        const [start, end] = idRange.split("-");

        const startVal = parseInt(start, 10);
        const endVal = parseInt(end, 10);

        for (let value = startVal; value <= endVal; value++) {
            const strValue = value.toString();

            const repeats = /^(\d+?)\1+$/;
            if (repeats.test(strValue)) {
                sum += value;
            }
        }
    }

    return sum;
}
