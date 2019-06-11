import {randomPointInAreaIntersection} from '../utils/areaUtils.js';

describe('randomPointInAreaIntersection', () => {
    test('all sizes 0', () => {
        expect(randomPointInAreaIntersection(0,   0, 0)).toEqual(-0);
        expect(randomPointInAreaIntersection(1,   0, 0)).toEqual(0);
        expect(randomPointInAreaIntersection(.5,  0, 0)).toEqual(0);
        expect(randomPointInAreaIntersection(.75, 0, 0)).toEqual(0);
    });
    test('prev size 0 - expect point in [-50 , 50]', () => {
        expect(randomPointInAreaIntersection(0,    0, 100)).toEqual(-50);
        expect(randomPointInAreaIntersection(0.25,  0, 100)).toEqual(-25);
        expect(randomPointInAreaIntersection(0.5,  0, 100)).toEqual(0);
        expect(randomPointInAreaIntersection(0.75, 0, 100)).toEqual(25);
        expect(randomPointInAreaIntersection(1,    0, 100)).toEqual(50);
    });
    test('prev size > 0, r<0.5 - expect point in [-50, -40]', () => {
        expect(randomPointInAreaIntersection(0,    80, 100)).toEqual(-50);
        expect(randomPointInAreaIntersection(0.25,  80, 100)).toEqual(-45);
        expect(randomPointInAreaIntersection(0.49, 80, 100)).toEqual(-40.2);
    });
    test('prev size > 0, r>=0.5 - expect point in  [40, 50]', () => {
        expect(randomPointInAreaIntersection(1,    80, 100)).toEqual(50);
        expect(randomPointInAreaIntersection(0.75, 80, 100)).toEqual(45);
        expect(randomPointInAreaIntersection(0.5,  80, 100)).toEqual(40);
    });
    test('prev size == size - expect point in [-50, 50]', () => {
        expect(randomPointInAreaIntersection(0,    100, 100)).toEqual(-50);
        expect(randomPointInAreaIntersection(0.3,  100, 100)).toEqual(-20);
        expect(randomPointInAreaIntersection(0.5,  100, 100)).toEqual(0);
        expect(randomPointInAreaIntersection(0.75, 100, 100)).toEqual(25);
        expect(randomPointInAreaIntersection(1,    100, 100)).toEqual(50);
    });
})