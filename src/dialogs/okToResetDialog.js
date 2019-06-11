import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralDialog, GeneralDialogTextDivComponent} from '../utils/generalDialog.js'
import {ButtonBar} from '../utils/buttonBar';

import MdCheck from 'react-icons/lib/md/check';

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import * as SIZES from '../constants/sizes';


class OkToResetDialogComponent extends Component {
    render() {
        const {resetGardenToDefault} = this.props;
        return (
            <GeneralDialog title="Reset all garden data?"
                           dialogName={DIALOGS.OK_TO_RESET_DIALOG}
                           className="OkToResetDialog"
                           {...this.props}>
                <GeneralDialogTextDivComponent>All garden data in your HTML5 local storage will be cleared.</GeneralDialogTextDivComponent>
                <GeneralDialogTextDivComponent>Are you sure?</GeneralDialogTextDivComponent>
                <ButtonBar>
                        <button onClick={resetGardenToDefault} title="yes do it">
                            <MdCheck size={SIZES.ICON_SIZE}/>
                        </button>
                </ButtonBar>

            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps(state) {
    return {}
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        resetGardenToDefault: () => dispatch(ACTIONS.resetGardenToDefaultAction()),
    }

}

// Connected Component (Redux container)
export const OkToResetDialog = connect(
    mapStateToProps,
    mapDispatchToProps
)(OkToResetDialogComponent);

