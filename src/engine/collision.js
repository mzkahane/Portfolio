export function canMoveTo(layer, tileX, tileY) {
    if (tileY < 0 || tileY >= layer.height || tileX < 0 || tileX >= layer.width) {
        return false;
    }

    const i = (tileY * layer.width) + tileX

    return layer.data[i] === 0;
}