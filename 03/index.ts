import { parseNumberList, readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./03/test.txt")); // 357
    console.log(await partOne("./03/input.txt"));
    console.log(await partTwo("./03/test.txt")); // 3121910778619
    console.log(await partTwo("./03/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    let sum = 0;

    for (const bank of input) {
        const charges = parseNumberList(bank, "");

        const highestIndex = charges.indexOf(Math.max(...charges.slice(0, charges.length - 1)));
        const remainingDigits = charges.slice(highestIndex + 1);
        const nextHighestIndex = remainingDigits.indexOf(Math.max(...remainingDigits)) + highestIndex + 1;

        const joltage = `${charges[highestIndex]}${charges[nextHighestIndex]}`;

        sum += parseInt(joltage, 10);
    }

    return sum;
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    let sum = 0;

    for (const bank of input) {
        const charges = parseNumberList(bank, "");

        let digitsRemaining = 12;
        let joltage = "";
        let remainingCharges = [...charges];
        while (digitsRemaining) {
            const possibleCharges = remainingCharges.slice(0, remainingCharges.length - digitsRemaining + 1);
            const highestIndex = possibleCharges.indexOf(Math.max(...possibleCharges));

            joltage += `${possibleCharges[highestIndex]}`;

            remainingCharges = remainingCharges.slice(highestIndex + 1);
            digitsRemaining--;
        }

        sum += parseInt(joltage, 10);
    }

    return sum;
}
