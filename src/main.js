import './style.css';
import { startLoop } from './engine/gameLoop';
import { renderLayer } from './engine/tileMap';
import { testMap } from './data/maps/testMap';
import { update as playerUpdate, draw as playerDraw, getPlayerPos, setStart, loadSprite } from './engine/player';
import { applyScale } from './engine/scale';
import { follow } from "./engine/camera";
import { loadMap, loadTilesets } from "./engine/assetLoader";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Tile size in pixels and map dimensions in tiles
const TILE_SIZE = 16;

canvas.width = 240;
canvas.height = 160;

function update(dt) {
    playerUpdate(dt, TILE_SIZE, data.layers[2]);
    const { x, y } = getPlayerPos();
    follow(x, y, canvas.width, canvas.height, TILE_SIZE);
    return;
}

applyScale();
window.addEventListener('resize', applyScale);

const data = await loadMap('/assets/maps/portfolio-ext.json');
await loadTilesets(data.tilesets);

setStart(46, 46, TILE_SIZE);

await loadSprite('/assets/sprites/custom-trainer.png');

startLoop(update, () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const layer of data.layers[0].layers) {
        renderLayer(ctx, layer, data.tilesets, TILE_SIZE);
    }

    playerDraw(ctx, TILE_SIZE);

    for (const layer of data.layers[1].layers) {
        renderLayer(ctx, layer, data.tilesets, TILE_SIZE);
    }
});
