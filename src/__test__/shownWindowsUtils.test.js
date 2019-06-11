import {getWindowsForMedia, areAnyFixedWindowsActive, toggleWindowInShownWindowsXXS} from '../utils/shownWindows';

function dummyFunction() {
}

function windowForType(windowType) {
    return {windowType: windowType, key: windowType};
}

const registeredWindows = {
    onlyFloating: {createWindowFunction: dummyFunction},
    floatingAndFixed: {createWindowFunction: dummyFunction, doesWindowSupportFixed: true},
    floatingAndFixed2: {createWindowFunction: dummyFunction, doesWindowSupportFixed: true},
    onlyFixed: {createWindowFunction: dummyFunction, doesWindowSupportFixed: true, isWindowAlwaysFixed: true},
};

describe('getWindowsForMedia XSS', () => {

    test('empty', () => {
        expect(getWindowsForMedia([], {}, false)).toEqual([]);
    });
    test('1 floating-only window', () => {
        const shownWindows = [windowForType( "onlyFloating") ];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false), shownWindows);
    });
    test('1 floating-only window - doesWindowSupportFixed is undefined', () => {
        const registeredWindows = {
            onlyFloating: {createWindowFunction: dummyFunction, doesWindowSupportFixed: undefined},
        };
        const shownWindows = [windowForType( "onlyFloating") ];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false), shownWindows);
    });
    test('2 floating-only windows', () => {
        const shownWindows = [windowForType( "onlyFloating"), windowForType( "onlyFloating")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false)).toEqual(shownWindows);
    });
    test('1 floating-and-fixed window', () => {
        const shownWindows = [windowForType( "floatingAndFixed")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false)).toEqual(shownWindows);
    });
    test('1 fixed-only window', () => {
        const shownWindows = [windowForType( "onlyFixed")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false)).toEqual(shownWindows);
    });
    test('2 floating-and-fixed windows: only last one is shown', () => {
        const shownWindows = [windowForType( "floatingAndFixed"), windowForType( "floatingAndFixed2")];
        const expected = [windowForType( "floatingAndFixed2")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false)).toEqual(expected);
    });
    test('1 floating-and-fixed and 1 fixed-only windows: only last one is shown', () => {
        const shownWindows = [windowForType( "floatingAndFixed"), windowForType( "onlyFixed")];
        const expected = [windowForType( "onlyFixed")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false)).toEqual(expected);
    });
    test('1 floating-and-fixed and 1 fixed-only windows: only last one is shown', () => {
        const shownWindows = [windowForType( "onlyFixed"), windowForType( "floatingAndFixed")];
        const expected = [windowForType( "floatingAndFixed")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false)).toEqual(expected);
    });
    test('mix of floating-only and floating-and-fixed', () => {
        const shownWindows = [
            windowForType( "onlyFloating"),
            windowForType( "onlyFloating"),
            windowForType( "floatingAndFixed"),
            windowForType( "floatingAndFixed2")];
        const expected = [
            windowForType( "onlyFloating"),
            windowForType( "onlyFloating"),
            windowForType( "floatingAndFixed2")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, false)).toEqual(expected);
    });
    test('function does not modify shownWindows', () => {
        const shownWindows = [
            windowForType( "onlyFloating"),
            windowForType( "onlyFloating"),
            windowForType( "floatingAndFixed"),
            windowForType( "floatingAndFixed2")];
        const expectedShownWindowsAfterCall = [
            windowForType( "onlyFloating"),
            windowForType( "onlyFloating"),
            windowForType( "floatingAndFixed"),
            windowForType( "floatingAndFixed2")];
        getWindowsForMedia(shownWindows, registeredWindows, false);
        expect(shownWindows).toEqual(expectedShownWindowsAfterCall);
    });
});

describe('getWindowsForMedia larger then XSS', () => {
    test('empty', () => {
        expect(getWindowsForMedia([], {}, true)).toEqual([]);
    });
    test('1 floating-only window', () => {
        const shownWindows = [windowForType( "onlyFloating")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, true), shownWindows);
    });
    test('2 floating-and-fixed windows: all are shown for larger than XSS', () => {
        const shownWindows = [windowForType( "floatingAndFixed"), windowForType( "floatingAndFixed2")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, true)).toEqual(shownWindows);
    });
    test('mix of floating-only and floating-and-fixed', () => {
        const shownWindows = [
            windowForType( "onlyFloating"),
            windowForType( "onlyFloating"),
            windowForType( "floatingAndFixed"),
            windowForType( "floatingAndFixed2")];
        expect(getWindowsForMedia(shownWindows, registeredWindows, true)).toEqual(shownWindows);
    });
});

describe('areAnyFixedWindowsActive XSS', () => {
    test('empty', () => {
        expect(areAnyFixedWindowsActive([], false)).toEqual(false);
    });
    test('1 floating-only window', () => {
        const shownWindows = [windowForType( "onlyFloating")];
        expect(areAnyFixedWindowsActive(shownWindows, false, registeredWindows)).toEqual(false);
    });
    test('1 floating-and-fixed window', () => {
        const shownWindows = [windowForType( "floatingAndFixed")];
        expect(areAnyFixedWindowsActive(shownWindows, false, registeredWindows)).toEqual(true);
    });
    test('1 fixed-only window', () => {
        const shownWindows = [windowForType( "onlyFixed")];
        expect(areAnyFixedWindowsActive(shownWindows, false, registeredWindows)).toEqual(true);
    });

});

describe('areAnyFixedWindowsActive larger then XSS', () => {
    test('empty', () => {
        expect(areAnyFixedWindowsActive([], true)).toEqual(false);
    });
    test('1 floating-only window', () => {
        const shownWindows = [windowForType( "onlyFloating")];
        expect(areAnyFixedWindowsActive(shownWindows, true, registeredWindows)).toEqual(false);
    });
    test('1 floating-and-fixed window', () => {
        const shownWindows = [windowForType( "floatingAndFixed")];
        expect(areAnyFixedWindowsActive(shownWindows, true, registeredWindows)).toEqual(false);
    });
    test('1 fixed-only window', () => {
        const shownWindows = [windowForType( "onlyFixed")];
        expect(areAnyFixedWindowsActive(shownWindows, true, registeredWindows)).toEqual(true);
    });

});

describe('toggleWindowInShownWindowsXXS', () => {
    test('fixed windowType exists at the back of the list: result: it is removed', () => {
        const originalShownWindows = [windowForType( "floatingAndFixed")];
        const expectedShownWindows = [];
        expect(toggleWindowInShownWindowsXXS(originalShownWindows, "floatingAndFixed", undefined, registeredWindows)).toEqual(expectedShownWindows);
    });
    test('only 1 fixed windowType exists somewhere else in the list: result for XSS: it is removed', () => {
        const originalShownWindows = [windowForType( "floatingAndFixed"), windowForType( "onlyFloating")];
        const expectedShownWindows = [windowForType( "onlyFloating")];
        expect(toggleWindowInShownWindowsXXS(originalShownWindows, "floatingAndFixed", undefined, registeredWindows)).toEqual(expectedShownWindows);
    });
    test('2 fixed windowType exist and last one is toggled: result for XSS: it is removed', () => {
        const originalShownWindows = [windowForType( "floatingAndFixed"), windowForType( "floatingAndFixed2")];
        const expectedShownWindows = [windowForType( "floatingAndFixed")];
        expect(toggleWindowInShownWindowsXXS(originalShownWindows, "floatingAndFixed2", undefined, registeredWindows)).toEqual(expectedShownWindows);
    });
    test('2 fixed windowType exist and FIRST one is toggled: result for XSS: it comes to front (to end of array)', () => {
        const originalShownWindows = [windowForType( "floatingAndFixed"), windowForType( "floatingAndFixed2")];
        const expectedShownWindows = [windowForType( "floatingAndFixed2"), windowForType( "floatingAndFixed"),];
        expect(toggleWindowInShownWindowsXXS(originalShownWindows, "floatingAndFixed", undefined, registeredWindows)).toEqual(expectedShownWindows);
    });

});
