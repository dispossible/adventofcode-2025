import { parseNumberList, readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./08/test.txt", 10)); // 40
    console.log(await partOne("./08/input.txt", 1000));
    console.log(await partTwo("./08/test.txt")); // 25272
    console.log(await partTwo("./08/input.txt"));
})();

type Point = {
    x: number;
    y: number;
    z: number;
    id: number;
};
type Connection = {
    distance: number;
    nodeA: Point;
    nodeB: Point;
    connected: boolean;
};

async function partOne(path: string, connections: number): Promise<number> {
    const input = await readFile(path);

    let networks = parseNetworks(input);
    const connectionMap: Connection[] = createConnectionMap(networks);

    for (let i = 0; i < connections; i++) {
        let closestConnection: Connection | null = null;

        for (const connection of connectionMap) {
            if (connection.distance < (closestConnection?.distance ?? Infinity) && !connection.connected) {
                closestConnection = connection;
            }
        }

        if (closestConnection) {
            const indexA = networks.findIndex((network) => network.includes(closestConnection.nodeA));
            const indexB = networks.findIndex((network) => network.includes(closestConnection.nodeB));

            if (indexA !== indexB) {
                const oldNetworkA = networks[indexA];
                const oldNetworkB = networks[indexB];
                const otherNetworks = networks.filter((_, i) => indexA !== i && indexB !== i);
                networks = [...otherNetworks, [...oldNetworkA, ...oldNetworkB]];
            }
            closestConnection.connected = true;
        }
    }

    networks.sort((a, b) => b.length - a.length);
    return networks[0].length * networks[1].length * networks[2].length;
}

function parseNetworks(input: string[]): Point[][] {
    return input.map((line, i) => {
        const values = parseNumberList(line, ",");
        return [
            {
                x: values[0],
                y: values[1],
                z: values[2],
                id: i,
            },
        ];
    });
}

function createConnectionMap(networks: Point[][]): Connection[] {
    const connectionMap: Connection[] = [];
    for (let networkIndex = 0; networkIndex < networks.length; networkIndex++) {
        const network = networks[networkIndex];
        for (const node of network) {
            for (let otherNetworkIndex = networkIndex + 1; otherNetworkIndex < networks.length; otherNetworkIndex++) {
                const otherNetwork = networks[otherNetworkIndex];
                for (const otherNode of otherNetwork) {
                    const distance = calculateDistance(node, otherNode);
                    connectionMap.push({
                        distance,
                        nodeA: node,
                        nodeB: otherNode,
                        connected: false,
                    });
                }
            }
        }
    }
    return connectionMap;
}

function calculateDistance(a: Point, b: Point): number {
    const x = Math.pow(b.x - a.x, 2);
    const y = Math.pow(b.y - a.y, 2);
    const z = Math.pow(b.z - a.z, 2);
    return Math.sqrt(x + y + z);
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    let networks = parseNetworks(input);
    const connectionMap: Connection[] = createConnectionMap(networks);

    while (networks.length > 1) {
        let closestConnection: Connection | null = null;

        for (const connection of connectionMap) {
            if (connection.distance < (closestConnection?.distance ?? Infinity) && !connection.connected) {
                closestConnection = connection;
            }
        }

        if (closestConnection) {
            const indexA = networks.findIndex((network) => network.includes(closestConnection.nodeA));
            const indexB = networks.findIndex((network) => network.includes(closestConnection.nodeB));

            if (indexA !== indexB) {
                const oldNetworkA = networks[indexA];
                const oldNetworkB = networks[indexB];
                const otherNetworks = networks.filter((_, i) => indexA !== i && indexB !== i);
                networks = [...otherNetworks, [...oldNetworkA, ...oldNetworkB]];

                if (networks.length === 1) {
                    return closestConnection.nodeA.x * closestConnection.nodeB.x;
                }
            }
            closestConnection.connected = true;
        }
    }

    return 0;
}
