import React, {Component} from 'react';
import {connect} from 'react-redux';

import MdChevronLeft from 'react-icons/lib/md/chevron-left';
import MdChevronRight from 'react-icons/lib/md/chevron-right';

import {TUTORIAL_TEXT} from '../data/tutorial.data.js';
import {GeneralDialog, GeneralDialogTextDivComponent} from '../utils/generalDialog.js'

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import * as SIZES from '../constants/sizes';


class TutorialDialogComponent extends Component {
    render() {
        const {tutorialStep} = this.props;
        const {tutorialPreviousStep, tutorialNextStep} = this.props;
        const textForThisStep = TUTORIAL_TEXT[tutorialStep];
        if (!textForThisStep) return null;
        const nrOfTutorialSteps = TUTORIAL_TEXT.length;

        return (
            <GeneralDialog title="Tutorial"
                           className="Tutorial"
                           dialogName={DIALOGS.TUTORIAL_DIALOG}
                           {...this.props}>
                <div className="text">
                    {textForThisStep.map((text, i) =>
                        <GeneralDialogTextDivComponent key={i}>{text}</GeneralDialogTextDivComponent>
                    )}
                </div>
                <div className="colRow">
                    <button onClick={tutorialPreviousStep} title="previous" className="left">
                        <MdChevronLeft size={SIZES.ICON_SIZE}/>
                    </button>
                    <div className="middle"> {tutorialStep+1}/{nrOfTutorialSteps} </div>
                    <button onClick={tutorialNextStep} title="next" className="right">
                        <MdChevronRight size={SIZES.ICON_SIZE}/>
                    </button>
                </div>

            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_TutorialDialog(state) {
    return {
        tutorialStep: state.gardenReducer.tutorialStep,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_TutorialDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        tutorialNextStep: () => dispatch(ACTIONS.tutorialNextStepAction),
        tutorialPreviousStep: () => dispatch(ACTIONS.tutorialPreviousStepAction),
    }
}

// Connected Component (Redux container)
export const TutorialDialog = connect(
    mapStateToProps_TutorialDialog,
    mapDispatchToProps_TutorialDialog
)(TutorialDialogComponent);

