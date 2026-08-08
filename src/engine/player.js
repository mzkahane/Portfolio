import { isKeyDown } from "./input";
import { canMoveTo } from "./collision";
import { camera } from "./camera.js";
import { loadImage } from "./assetLoader.js";

let spriteImage = null;

const SPRITE_W = 16;
const SPRITE_H = 19;

const FRAMES = {
    down:   { still: 0, walkA: 1, walkB: 2 },
    up:     { still: 3, walkA: 4, walkB: 5 },
    side:   { still: 6, walkA: 7, walkB: 8 },
};

const MOVE_SPEED = 3;

const player = {
    tileX: 0, 
    tileY: 0, 
    pixelX: 0, 
    pixelY: 0, 
    moving: false, 
    moveProgress: 0, 
    startPixelX: 0, 
    startPixelY: 0, 
    targetTileX: 0, 
    targetTileY: 0,
    facing: "down",
    frame: "still",
    stepParity: false,
}; 

export async function loadSprite(url) {
    spriteImage = await loadImage(url);
}

function startMove(map, dx, dy) {
    player.stepParity = !player.stepParity;

    if (dx > 0) {
        player.facing = "right";
    } else if (dx < 0) {
        player.facing = "left";
    } else if (dy > 0) {
        player.facing = "down";
    } else if (dy < 0) {
        player.facing = "up";
    }

    player.targetTileX = player.tileX + dx;
    player.targetTileY = player.tileY + dy;

    player.startPixelX = player.pixelX;
    player.startPixelY = player.pixelY;
    player.moving = canMoveTo(map, player.targetTileX, player.targetTileY, dx, dy);
    player.moveProgress = 0;
}

export function setStart(tileX, tileY,tileSize) {
    player.tileX = tileX;
    player.tileY = tileY;
    player.pixelX = tileX * tileSize;
    player.pixelY = tileY * tileSize;
}

export function getPlayerPos() {
    return {x: player.pixelX, 
            y: player.pixelY};
}

// LERP formula: startPixel = (targetPixel - startPixel) * moveProgress
export function update(dt, tileSize, map) {
    if (!player.moving) {
        if (isKeyDown('w') || isKeyDown('ArrowUp')) {
            startMove(map, 0, -1);
        } else if (isKeyDown('a') || isKeyDown('ArrowLeft')) {
            startMove(map, -1, 0);
        } else if (isKeyDown('s') || isKeyDown('ArrowDown')) {
            startMove(map, 0, 1);
        } else if (isKeyDown('d') || isKeyDown('ArrowRight')) {
            startMove(map, 1, 0);
        }

    } else if (player.moving) {
        if (player.moveProgress < 1) {
            if (player.moveProgress < 0.5) {
                player.frame = "still";
            } else {
                player.frame = player.stepParity ? "walkA" : "walkB";
            }
            

            player.moveProgress += dt * MOVE_SPEED;
            player.pixelX = player.startPixelX + ((player.targetTileX * tileSize) - player.startPixelX) * player.moveProgress;
            player.pixelY = player.startPixelY + ((player.targetTileY * tileSize) - player.startPixelY) * player.moveProgress;

            if (player.moveProgress >= 1) {
                player.tileX = player.targetTileX;
                player.tileY = player.targetTileY;
                player.pixelX = player.targetTileX * tileSize;
                player.pixelY = player.targetTileY * tileSize;
                player.moving = false;
                player.frame = "still";
            }
        }

    }
}

export function draw(ctx, tileSize) {
    let drawX = Math.floor(player.pixelX - camera.x);
    let drawY = Math.floor(player.pixelY - camera.y);

    let col;
    let flip = false;
    switch (player.facing) {
        case "up":
            col = FRAMES.up[player.frame];
            break;
        case "down":
            col = FRAMES.down[player.frame];
            break;
        case "left":
            col = FRAMES.side[player.frame];
            break;
        case "right":
            col = FRAMES.side[player.frame];
            flip = true;
            break;
    }

    if (flip) {
        ctx.save();
        ctx.translate(Math.floor(player.pixelX - camera.x) + SPRITE_W, Math.floor(player.pixelY - camera.y));
        ctx.scale(-1, 1);
        drawX = 0; 
        drawY = 0;
    }

    if (player.frame === "walkA" || player.frame === "walkB") {
        drawY += 1;
    }

    ctx.drawImage(
        spriteImage,
        col * SPRITE_W, 0,
        SPRITE_W, SPRITE_H,
        drawX, drawY,
        SPRITE_W, SPRITE_H
    );

    if (flip) {
        ctx.restore();
    }
}