import React, {Component} from 'react';
import {connect} from 'react-redux';

import {ButtonBar} from '../utils/buttonBar';
import {areAnyFixedWindowsActive} from '../utils/shownWindows';

import MdLocalFlorist from 'react-icons/lib/md/local-florist';
import FaEye from 'react-icons/lib/fa/eye';
import MdAdd from 'react-icons/lib/md/add';
import FaSortAmountAsc from 'react-icons/lib/fa/sort-amount-asc';
import FaLock from 'react-icons/lib/fa/lock';
import FaUnLock from 'react-icons/lib/fa/unlock';

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import * as SIZES from '../constants/sizes';


//================================================
class GlobalButtonBarComponent extends Component {
    render() {
        const {orbitControlsActive, shownWindows, media} = this.props;
        const {toggleAddNewPlantDialog, toggleOrderPlantListDialog, toggleShowHideDialog, toggleOrbitControls, togglePlantListDialog} = this.props;

        const toggleOrbitControlsTitle = orbitControlsActive ? "disable camera movements" : "enable camera movements";
        const toggleOrbitControlsIcon = orbitControlsActive ?
            <FaLock size={SIZES.ICON_SIZE}/> :
            <FaUnLock size={SIZES.ICON_SIZE}/>;
        const className = areAnyFixedWindowsActive(shownWindows, media.largerThenXXS) ? "globalButtonBar": "globalButtonBarAtBottom";
        return (
            <ButtonBar className={className}>
                <button onClick={toggleOrbitControls} title={toggleOrbitControlsTitle}>
                    {toggleOrbitControlsIcon}
                </button>
                <button onClick={toggleOrderPlantListDialog} title="order plant lists">
                    <FaSortAmountAsc size={SIZES.ICON_SIZE}/>
                </button>
                <button onClick={toggleShowHideDialog} title="show/hide">
                    <FaEye size={SIZES.ICON_SIZE}/>
                </button>
                <button onClick={toggleAddNewPlantDialog} title="add new plant to your garden">
                    <MdAdd size={SIZES.ICON_SIZE}/>
                </button>
                <button onClick={togglePlantListDialog} title="list of plants in this garden">
                    <MdLocalFlorist size={SIZES.ICON_SIZE}/>
                </button>
            </ButtonBar>
        );
    }
}

// Map Redux state to component props
function mapStateToProps_PlantListButtons(state) {
    return {
        orbitControlsActive: state.gardenThreeWorldReducer.orbitControlsActive,
        media: state.gardenReducer.media,
        shownWindows: state.shownWindowsReducer.shownWindows,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_PlantListButtons(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        toggleAddNewPlantDialog: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.NEW_PLANTS_DIALOG)),
        toggleOrderPlantListDialog: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.ORDER_PLANT_LIST_DIALOG)),
        toggleShowHideDialog: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.SHOW_HIDE_DIALOG)),
        toggleOrbitControls: () => dispatch(ACTIONS.toggleOrbitControlsAction),
        togglePlantListDialog: () => dispatch(ACTIONS.dialogWindowToggleAction(DIALOGS.PLANT_LIST_DIALOG)),

    }
}

// Connected Component (Redux container)
export const GlobalButtonBar = connect(
    mapStateToProps_PlantListButtons,
    mapDispatchToProps_PlantListButtons
)(GlobalButtonBarComponent);

