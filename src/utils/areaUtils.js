export function randomPointInAreaIntersection(randomNumber, prevSize, size) {
    if (prevSize === size || prevSize === 0) {
        return (randomNumber - 0.5) * size;
    } else {
        if (randomNumber >= 0.5) {
            return size / 2 - (1 - randomNumber) * (size - prevSize);
        } else {
            return -(size / 2 - randomNumber * (size - prevSize));
        }
    }
}
