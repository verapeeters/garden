// noinspection Annotator
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {WeekNumberSlider} from "./dialogs/weekNumberSlider";
import {GardenThreeWorld} from './three/gardenThreeWorld.js';
import {GlobalButtonBar} from './utils/globalButtonBar';
import {SunMeshContainer} from './three/sun.js';
import {PlantAreas} from "./three/area.js";
import {ShownWindows} from "./utils/shownWindows.js";

import * as ACTIONS from './actions.js';
import * as SIZES from './constants/sizes';





//================================================
export class GardenComponent extends Component {
    constructor(props) {
        super(props);
        this.mediaQueryLargerThenXssChanges = this.mediaQueryLargerThenXssChanges.bind(this);
        this.mediaQueryHoverChanges = this.mediaQueryHoverChanges.bind(this);
    }

    componentWillMount() {
        this.mediaQueryLargerThenXss = window.matchMedia("only screen and (min-width: "+String(SIZES.SCREEN_WIDTH_XS)+"px)");
        this.mediaQueryLargerThenXss.addListener(this.mediaQueryLargerThenXssChanges);

        this.mediaQueryHover = window.matchMedia("only screen and (hover: hover)");
        this.mediaQueryHover.addListener(this.mediaQueryHoverChanges);

        //const mediaQueryPointerFine = window.matchMedia("only screen and (pointer: fine)");
        //console.log("mediaQuery pointer fine " + mediaQueryPointerFine.matches);

        this.props.initializeDataAction(this.mediaQueryLargerThenXss.matches, this.mediaQueryHover.matches);
    }

    componentWillUnmount() {
        this.mediaQueryLargerThenXss.removeListener(this.mediaQueryLargerThenXssChanges);
    }

    mediaQueryLargerThenXssChanges(e) {
        //console.log("GardenComponent mediaQueryLargerThenXssChanges "+e.matches);
        this.props.modifyMediaXssAction(e.matches);
    }
    mediaQueryHoverChanges(e) {
        //console.log("GardenComponent mediaQueryHoverChanges "+e.matches);
        this.props.modifyMediaHoverAction(e.matches);
    }

    render() {
        const {
            areas,
        } = this.props;
        return (
            <div id="three-react-garden">
                <WeekNumberSlider/>
                <GardenThreeWorld>
                    <SunMeshContainer/>
                    <PlantAreas areas={areas}/>
                </GardenThreeWorld>
                {/*<PlantList/>*/}
                <GlobalButtonBar/>
                <ShownWindows/>
            </div>
        )
    }

}


// Map Redux state to component props
function mapStateToProps(state) {
    return {
        weekNumber: state.weekNumberReducer.weekNumber,
        areas: state.gardenReducer.areas, /* areas defined for this garden */
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        initializeDataAction: (largerThenXXS, hover) => dispatch(ACTIONS.initializeDataAction(largerThenXXS, hover)),
        modifyMediaXssAction: (largerThenXXS) => dispatch(ACTIONS.modifyMediaXssAction(largerThenXXS)),
        modifyMediaHoverAction: (hover) => dispatch(ACTIONS.modifyMediaHoverAction(hover)),
        handleClickSunPosition: (positionName, newValue) => dispatch(ACTIONS.clickSunPositionAction(positionName, newValue)),
        handleWeekNumberChange: (newValue) => dispatch(ACTIONS.weekNumberChangeAction(newValue)),
    }
}

// Connected Component
export const Garden = connect(
    mapStateToProps,
    mapDispatchToProps
)(GardenComponent);

