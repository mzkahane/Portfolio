import { camera } from "./camera.js";

export const tileLookup = {
    0: '#7ec850',
    1: '#d4a853',
    2: '#3890e8'
};

export function renderMap(ctx, map, tileSize) {

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            ctx.fillStyle = tileLookup[map[y][x]];
            ctx.fillRect((x * tileSize) - camera.x, (y * tileSize) - camera.y, tileSize, tileSize);
        }
    }
}