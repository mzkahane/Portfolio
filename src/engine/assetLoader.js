export async function loadMap(url) {
    const response = await fetch(url);
    return await response.json();
}

export async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

export async function loadTilesets(tilesets) {
    const imgs = tilesets.map(t => loadImage(t.image));
    
    const loaded = await Promise.all(imgs);

    for (let i = 0; i < tilesets.length; i++) {
        tilesets[i].image = loaded[i];
    }
}

export function resolveTile(gid, tilesets) {
    if (gid === 0) return null;

    const flipH = (gid & 0x80000000) !== 0;
    const flipV = (gid & 0x40000000) !== 0;
    const flipD = (gid & 0x20000000) !== 0;

    gid = gid & 0x1FFFFFFF;

    for (const tileset of tilesets) {
        if (tileset.firstgid <= gid && gid < tileset.firstgid + tileset.tilecount) {
            
            const localIndex = gid - tileset.firstgid;
            const row = Math.floor(localIndex / tileset.columns);
            const col = localIndex % tileset.columns;

            return {
                sourceImage: tileset.image,
                srcX: col * tileset.tilewidth,
                srcY: row * tileset.tileheight,
                tw: tileset.tilewidth,
                th: tileset.tileheight,
                flipH,
                flipV,
                flipD,
            }

        }
    }
}