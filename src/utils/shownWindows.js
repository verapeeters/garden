import React, {Component} from 'react';
import {connect} from 'react-redux';

let registeredWindows = {};

//================================================
// API
export function registerWindowType(windowType,
                                   createWindowFunction, doesWindowSupportFixed, isWindowAlwaysFixed) {
    registeredWindows[windowType] = {
        createWindowFunction: createWindowFunction,
        doesWindowSupportFixed: doesWindowSupportFixed,
        isWindowAlwaysFixed: isWindowAlwaysFixed,
    };
}

function doesWindowSupportFixed(window, registeredWindowsPar) {
    const locRegisteredWindows = registeredWindowsPar || registeredWindows;
    return locRegisteredWindows[window.windowType].doesWindowSupportFixed;
}

function isWindowAlwaysFixed(window, registeredWindowsPar) {
    const locRegisteredWindows = registeredWindowsPar || registeredWindows;
    return locRegisteredWindows[window.windowType].isWindowAlwaysFixed;
}

export function windowFor(windowType, windowKey) {
    return {windowType: windowType, key: windowKey ? windowKey : windowType};
}

export function getWindowsFor(defaultWindowNames) {
    return defaultWindowNames.map((w) => windowFor(w));
}

export function areAnyFixedWindowsActive(shownWindows, mediaLargerThenXss, registeredWindowsPar) {
    const locRegisteredWindows = registeredWindowsPar || registeredWindows;
    if (shownWindows.length === 0) return false;
    if (mediaLargerThenXss)
        return shownWindows.findIndex((w) => isWindowAlwaysFixed(w, locRegisteredWindows)) >= 0;
    else
        return shownWindows.findIndex((w) => doesWindowSupportFixed(w, locRegisteredWindows)) >= 0;
}

function isThisWindowForTypeAndKey(window, windowType, windowKey) {
    return window.windowType === windowType && (!windowKey || window.key === windowKey);
}

export function toggleWindowInShownWindows(shownWindows, windowType, windowKey) {
    const newShownWindows = shownWindows.slice();
    const foundIndex = newShownWindows.findIndex((el) => isThisWindowForTypeAndKey(el, windowType, windowKey));
    if (foundIndex !== -1) {
        newShownWindows.splice(foundIndex, 1);
    }
    else {
        const newWindow = windowFor(windowType, windowKey);
        newShownWindows.push(newWindow);
    }
    return newShownWindows;
}

function equals(wl, wr) {
    return wl.type === wr.type && (wl.key === wr.key);
}
export function toggleWindowInShownWindowsXXS(shownWindows, windowType, windowKey, registeredWindowsPar) {
    const locRegisteredWindows = registeredWindowsPar || registeredWindows;
    const newShownWindows = shownWindows.slice();
    const foundIndex = newShownWindows.findIndex((el) => isThisWindowForTypeAndKey(el, windowType, windowKey));
    if (foundIndex !== -1) {
        console.log("found");
        const toggledWindow = newShownWindows[foundIndex];
        const onlyFixedWindows = newShownWindows.filter((el) => doesWindowSupportFixed(el, locRegisteredWindows));
        newShownWindows.splice(foundIndex, 1);
        if (onlyFixedWindows.length > 1 && !equals(onlyFixedWindows[onlyFixedWindows.length-1], toggledWindow)) {
            //it is not the last fixed window in array
            newShownWindows.push(toggledWindow);
        }
    }
    else {
        const newWindow = windowFor(windowType, windowKey);
        newShownWindows.push(newWindow);
    }
    //console.log("newShownWindows: "+JSON.stringify(newShownWindows));
    return newShownWindows;
}

export function addWindowInShownWindows(shownWindows, windowType, windowKey) {
    const newShownWindows = shownWindows.slice();
    const foundIndex = newShownWindows.findIndex((el) => isThisWindowForTypeAndKey(el, windowType, windowKey));
    if (foundIndex === -1) {
        const newWindow = windowFor(windowType, windowKey);
        newShownWindows.push(newWindow);
    }
    return newShownWindows;
}


//================================================
class WindowComponent extends Component {
    render() {
        const {window, fixedIfPossible} = this.props;
        const createWindowFunctions = registeredWindows[window.windowType];
        //console.log("WindowComponent " + window.windowType + " " + window.key);
        if (createWindowFunctions) {
            const createWindow = createWindowFunctions.createWindowFunction;
            return createWindow({
                ...this.props,
                fixed: fixedIfPossible && createWindowFunctions.doesWindowSupportFixed
            });
        } else {
            //console.log("WARNING: unknown window component type " + window.windowType);
            return null;
        }
    }
}

//================================================
// Helper functions
//export for test purposes
export function getWindowsForMedia(shownWindows, registeredWindows, mediaLargerThenXss) {
    if (mediaLargerThenXss) {
        return shownWindows;
    }
    //logShownWindows(shownWindows);
    //only 1 FIXED window is shown in case of NOT mediaLargerThenXss
    const lastFixedWindow = shownWindows.slice().reverse().find((w) => doesWindowSupportFixed(w, registeredWindows));
    if (lastFixedWindow) {
        //console.log("lastFixedWindow " + lastFixedWindow.windowType + " " + lastFixedWindow.key);
        const nonFixedWindows = shownWindows.filter((w) => !doesWindowSupportFixed(w, registeredWindows));
        return nonFixedWindows.concat([lastFixedWindow]);
    }
    else {
        return shownWindows;
    }
}

function logShownWindows(shownWindows) {
    //shownWindows.forEach((window) => console.log(`     ${window.windowType} ${window.key} `));
}

//================================================
class ShownWindowsComponent extends Component {
    render() {
        const {shownWindows, media} = this.props;
        //console.log("ShownWindowsComponent");
        logShownWindows(shownWindows);
        const windowsForMedia = getWindowsForMedia(shownWindows, registeredWindows, media.largerThenXXS);
        return (
            <div>
                {windowsForMedia.map((window, i) => <WindowComponent key={window.key} window={window} index={i}
                                                                     fixedIfPossible={!media.largerThenXXS}/>)}
            </div>
        );
    }
}

// Map Redux state to component props
function mapStateToProps_ShownWindows(state) {
    return {
        shownWindows: state.shownWindowsReducer.shownWindows,
        media: state.gardenReducer.media,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_ShownWindows(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {}
}

// Connected Component (Redux container)
export const ShownWindows = connect(
    mapStateToProps_ShownWindows,
    mapDispatchToProps_ShownWindows
)(ShownWindowsComponent);
