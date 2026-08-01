const WALKABLE      = 0;
const FULL_BLOCK    = 11025;
const SOUTH         = 11026;
const NORTH         = 11027;
const WEST          = 11028;
const EAST          = 11029;

export function canMoveTo(layer, tileX, tileY, dx, dy) {
    if (tileY < 0 || tileY >= layer.height || tileX < 0 || tileX >= layer.width) {
        return false;
    }

    const target = (tileY * layer.width) + tileX

    const gid = layer.data[target] & 0x1FFFFFFF;

    switch (gid) {
        case WALKABLE:      return true;
        case FULL_BLOCK:    return false;
        case SOUTH:         return dy === 1;
        case NORTH:         return dy === -1;
        case WEST:          return dx === -1;
        case EAST:          return dx === 1;
        default:            return false;
    }
}