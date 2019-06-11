import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralDialog, GeneralDialogTextDivComponent} from '../utils/generalDialog.js'
import {ButtonBar} from '../utils/buttonBar';

import MdCheck from 'react-icons/lib/md/check';

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import * as SIZES from '../constants/sizes';


class CookieLawDialogComponent extends Component {
    render() {
        const {agreeWithCookieLaw} = this.props;

        return (
            <GeneralDialog title="Do you agree?"
                           dialogName={DIALOGS.COOKIE_LAW_DIALOG}
                           className="CookieLawDialog"
                           {...this.props}>
                <GeneralDialogTextDivComponent>We want to store data on your device to improve your customer experience.</GeneralDialogTextDivComponent>
                <GeneralDialogTextDivComponent>This data will not be shared with any third party.</GeneralDialogTextDivComponent>
                <GeneralDialogTextDivComponent>We use HTML5 local storage to store the data.</GeneralDialogTextDivComponent>
                <ButtonBar>
                        <button onClick={agreeWithCookieLaw} title="I agree">
                            <MdCheck size={SIZES.ICON_SIZE}/>
                        </button>
                </ButtonBar>

            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_CookieLawDialog(state) {
    return {}
}

// Map Redux actions to component props
function mapDispatchToProps_CookieLawDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        agreeWithCookieLaw: () => dispatch(ACTIONS.agreeWithCookieLawAction),
    }
}

// Connected Component (Redux container)
export const CookieLawDialog = connect(
    mapStateToProps_CookieLawDialog,
    mapDispatchToProps_CookieLawDialog
)(CookieLawDialogComponent);

