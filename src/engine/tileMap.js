import { resolveTile } from "./assetLoader.js";
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

export function renderLayer(ctx, layer, tilesets, tileSize) {
    for (let i = 0; i < layer.data.length; i++) {
        const gid = layer.data[i];
        const dx = (i % layer.width) * tileSize - camera.x;
        const dy = Math.floor(i / layer.width) * tileSize - camera.y;

        if (gid === 0) continue;

        const tile = resolveTile(gid, tilesets);
        if (!tile) {
            console.log('unresolved gid:', gid, gid.toString(16));
            continue;
        }

        if (tile.flipH || tile.flipV || tile.flipD) {
            ctx.save();
            ctx.translate(dx + tileSize / 2, dy + tileSize / 2);

            if (tile.flipD) {
                ctx.rotate(-Math.PI / 2);
                ctx.scale(1, -1);
            }
            if (tile.flipH) ctx.scale(-1, 1);
            if (tile.flipV) ctx.scale(1, -1);

            ctx.drawImage(
                tile.sourceImage, 
                tile.srcX, tile.srcY, tile.tw, tile.th,
                -tileSize / 2, -tileSize / 2,
                tileSize, tileSize
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                tile.sourceImage,
                tile.srcX, tile.srcY, tile.tw, tile.th,
                dx, dy,
                tileSize, tileSize
            );
        }
    }
}