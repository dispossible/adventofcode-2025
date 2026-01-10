import { parseNumberList, readFile } from "../utils/file";
import * as fs from "fs/promises";

(async () => {
    console.log(await partOne("./06/test.txt")); // 4277556
    console.log(await partOne("./06/input.txt"));
    console.log(await partTwo("./06/test.txt")); // 3263827
    console.log(await partTwo("./06/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    const operations = input[input.length - 1]
        .split(" ")
        .map((o) => o.trim())
        .filter((o) => !!o);

    const values = input.slice(0, -1).map((line) => parseNumberList(line, " "));

    let sum = 0;

    for (let i = 0; i < operations.length; i++) {
        switch (operations[i]) {
            case "+":
                sum += values.reduce((a, b) => a + b[i], 0);
                break;
            case "*":
                sum += values.reduce((a, b) => a * b[i], 1);
                break;
        }
    }

    return sum;
}

export async function readEntireFile(fileName: string): Promise<string> {
    const file = await fs.readFile(fileName, { encoding: "utf-8" });
    return file.replaceAll("\r\n", "\n");
}

async function partTwo(path: string): Promise<number> {
    const files = await readEntireFile(path);
    const lines = files.split("\n");

    const length = Math.max(...lines.map((line) => line.length));
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].padEnd(length + 1, " ");
    }

    const operations = lines[lines.length - 1];
    const rawValues = lines.slice(0, -1);

    let sum = 0;

    let values: number[] = [];
    let operation = "";

    for (let i = 0; i < operations.length; i++) {
        const op = operations[i];
        if (op === "+" || op === "*") {
            operation = op;
        }

        const numbers = rawValues
            .map((line) => line[i])
            .join("")
            .trim();

        if (numbers === "") {
            switch (operation) {
                case "+":
                    sum += values.reduce((a, b) => a + b);
                    break;
                case "*":
                    sum += values.reduce((a, b) => a * b);
                    break;
            }
            values = [];
            operation = "";
        } else {
            values.push(parseInt(numbers.trim(), 10));
        }
    }

    return sum;
}
