import React, {Component} from 'react';
import {connect} from 'react-redux';

import {hexColorToCssColor} from './colorUtils';

import * as ACTIONS from '../actions.js';
import * as THREECOLORS from "../constants/threeColors.js";



//================================================
function TimeLineButtonComponent(props) {
    const {weekNumber, handleWeekNumberChange} = props;
    const title = "move timeline to week " + weekNumber;
    return <div className="timeLineButton"><a onClick={() => handleWeekNumberChange(weekNumber)}
                                              title={title}>{weekNumber}</a></div>
}

// Map Redux actions to component props
function mapDispatchToProps_TimeLineButton(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        handleWeekNumberChange: (newValue) => dispatch(ACTIONS.weekNumberChangeAction(newValue)),
    }
}

// Connected Component (Redux container)
export const TimeLineButton = connect(
    null,
    mapDispatchToProps_TimeLineButton
)(TimeLineButtonComponent);

//================================================
class PlantTimeLineComponent extends Component {

    render() {
        const {plantProps} = this.props;
        const growStart = plantProps.timeLine.growStart;
        const die = plantProps.timeLine.die;
        const flowerStart = plantProps.timeLine.flowerStart;
        const flowerEnd = plantProps.timeLine.flowerEnd;
        return <div className="plantTimeLine">
            <div className="showColor"
                 style={{backgroundColor: hexColorToCssColor(plantProps.color || THREECOLORS.GREEN)}}/>
            <div className="plantProps">
                <TimeLineButton weekNumber={growStart}/>
                <span>-</span>
                <TimeLineButton weekNumber={die}/></div>
            &nbsp;
            <div className="showColor"
                 style={{backgroundColor: hexColorToCssColor(plantProps.flowerColor)}}/>
            <div className="plantProps">
                <TimeLineButton weekNumber={flowerStart}/>
                <span>-</span>
                <TimeLineButton weekNumber={flowerEnd}/></div>
        </div>
    }
}

// Map Redux actions to component props
function mapDispatchToProps_PlantTimeLine(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        handleWeekNumberChange: (newValue) => dispatch(ACTIONS.weekNumberChangeAction(newValue)),
    }
}

// Connected Component (Redux container)
export const PlantTimeLine = connect(
    null,
    mapDispatchToProps_PlantTimeLine
)(PlantTimeLineComponent);

