import { readFile, readEntireFile, parseNumberList } from "../utils/file";

(async () => {
    console.log(await partOne("./05/test.txt")); // 3
    console.log(await partOne("./05/input.txt"));
    console.log(await partTwo("./05/test.txt")); // 14
    console.log(await partTwo("./05/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const [rulesList, idList] = input.trim().split("\n\n");

    const ids = parseNumberList(idList, "\n");

    const rules = rulesList.split("\n").map((line) => {
        const [from, to] = line.split("-").map((v) => parseInt(v, 10));
        return {
            from,
            to,
            contains: (value: number) => {
                return value >= from && value <= to;
            },
        };
    });

    let fresh = 0;

    for (const id of ids) {
        for (const rule of rules) {
            if (rule.contains(id)) {
                fresh++;
                break;
            }
        }
    }

    return fresh;
}

async function partTwo(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const [rulesList] = input.trim().split("\n\n");

    const rules = rulesList
        .split("\n")
        .map((line) => {
            const [from, to] = line.split("-").map((v) => parseInt(v, 10));
            return {
                from,
                to,
                contains: (from: number, value: number, to: number) => {
                    return value >= from && value <= to;
                },
            };
        })
        .sort((a, b) => a.from - b.from);

    for (const rule of rules) {
        for (const otherRule of rules) {
            if (rule === otherRule) continue;
            if (otherRule.contains(otherRule.from, rule.from, otherRule.to)) {
                rule.from = otherRule.to + 1;
            }
            if (otherRule.contains(otherRule.from, rule.to, otherRule.to)) {
                rule.to = otherRule.from - 1;
            }
        }
    }

    let validIds = 0;

    for (const rule of rules) {
        if (rule.to < rule.from) {
            continue;
        }
        const range = rule.to - rule.from + 1;
        validIds += range;
    }

    return validIds;
}
