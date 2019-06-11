import React, {Component} from 'react';
import moment from "moment/moment";
import {connect} from "react-redux";

import {ButtonBar} from '../utils/buttonBar';
import * as SIZES from '../constants/sizes';
import * as ACTIONS from "../actions";
import FaPlay from 'react-icons/lib/fa/play';
import FaPause from 'react-icons/lib/fa/pause';


export class WeekNumberSliderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
        };
    }

    tick() {
        //console.log(" -- tick ");
        const {weekNumberIncrement} = this.props;
        weekNumberIncrement();
    }

    weekNumberPlayToggle() {
        //console.log("weekNumberPlayToggle - playing becomes " + (this.state.timer===null));
        let newTimer = null;
        if (this.state.timer) {
            clearInterval(this.state.timer);
        } else {
            newTimer = setInterval(() => this.tick(), 1000);
        }
        this.setState({timer: newTimer});
    }

    render() {
        const {weekNumber, handleWeekNumberChange} = this.props;
        const week = moment(weekNumber, "ww");
        const month = week.format("MMM");
        const isPlaying = (this.state.timer !== null);
        const playButtonIcon = isPlaying ? <FaPause size={SIZES.ICON_SIZE}/> : <FaPlay size={SIZES.ICON_SIZE} className="PlayButtonSvg"/>;
        const playButtonTitle = isPlaying ? "stop time" : "start time";

        return (
            <div className="sliderGroup">
                <ButtonBar>
                    <button title={playButtonTitle} onClick={() => this.weekNumberPlayToggle()}>
                        {playButtonIcon}
                    </button>
                </ButtonBar>
                <div className="sliderAndTitle">
                    <div className="title">week {weekNumber} ({month})</div>
                    <div className="sliderRow">
                        <input type="range" value={weekNumber} min="1" max="52" step="1"
                               onChange={(e) => handleWeekNumberChange(e.target.value)}/>
                    </div>
                </div>
            </div>

        );
    }
}


// Map Redux state to component props
function mapStateToProps(state) {
    return {
        weekNumber: state.weekNumberReducer.weekNumber,
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        handleWeekNumberChange: (newValue) => dispatch(ACTIONS.weekNumberChangeAction(newValue)),
        weekNumberIncrement: () => dispatch(ACTIONS.weekNumberIncrementAction),
    }
}

// Connected Component
export const WeekNumberSlider = connect(
    mapStateToProps,
    mapDispatchToProps
)(WeekNumberSliderComponent);
