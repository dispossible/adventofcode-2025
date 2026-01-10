import { readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./01/test.txt")); // 3
    console.log(await partOne("./01/input.txt"));
    console.log(await partTwo("./01/test.txt")); // 6
    console.log(await partTwo("./01/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    let count = 0;
    let position = 50;

    for (const command of input) {
        const dir = command[0];
        const value = parseInt(command.slice(1), 10);

        if (dir === "L") {
            position -= value;
        } else {
            position += value;
        }

        if (position % 100 === 0) {
            count++;
        }
    }

    return count;
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    let count = 0;
    let position = 50;
    let positions = [position];

    for (const command of input) {
        const dir = command[0];
        const value = parseInt(command.slice(1), 10);
        const prevPosition = positions[positions.length - 1];
        const prevPrevPosition = positions[positions.length - 2];

        if (dir === "L") {
            position -= value;
        } else {
            position += value;
        }

        const rot = Math.floor(position / 100);
        const prevRot = Math.floor(prevPosition / 100);
        const diff = Math.abs(rot - prevRot);

        count += diff;

        if (prevPosition % 100 === 0 && prevPrevPosition > prevPosition && position > prevPosition) {
            count++;
        }

        if (prevPosition % 100 === 0 && prevPrevPosition < prevPosition && position < prevPosition) {
            count--;
        }

        // console.log(
        //     `${prevPosition} -> ${command} -> ${position} | rot: ${rot}, prevRot: ${prevRot}, diff: ${diff} | count: ${count}`
        // );

        positions.push(position);
    }

    return count;
}
