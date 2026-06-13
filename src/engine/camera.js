export const camera = {
    x: 0,
    y: 0,
}

// safe because all dimensions are even
export function follow(playerX, playerY, viewW, viewH, tileSize) {
    camera.x = Math.floor(playerX - (viewW / 2) + (tileSize / 2));
    camera.y = Math.floor(playerY - (viewH / 2) + (tileSize / 2));
}