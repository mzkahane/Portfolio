import './style.css';
import { startLoop } from './engine/gameLoop';
import { renderMap } from './engine/tileMap';
import { testMap } from './data/maps/testMap';
import { update as playerUpdate, draw as playerDraw, getPlayerPos } from './engine/player';
import { applyScale } from './engine/scale';
import { follow } from "./engine/camera.js";

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Tile size in pixels and map dimensions in tiles
const TILE_SIZE = 16;

canvas.width = 240;
canvas.height = 160;

function update(dt) {
    playerUpdate(dt, TILE_SIZE);
    const { x, y } = getPlayerPos();
    follow(x, y, canvas.width, canvas.height, TILE_SIZE);
    return;
}

applyScale();
window.addEventListener('resize', applyScale);

startLoop(update, () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderMap(ctx, testMap, TILE_SIZE);
    playerDraw(ctx, TILE_SIZE);
});
