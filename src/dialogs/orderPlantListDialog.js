import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GeneralTextButton} from '../utils/generalTextButton';
import {GeneralDialog} from '../utils/generalDialog.js'

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';


class OrderPlantListDialogComponent extends Component {
    render() {
        const {orderPlantListBy} = this.props;

        return (
            <GeneralDialog title="order plant list"
                           dialogName={DIALOGS.ORDER_PLANT_LIST_DIALOG}
                           className="OrderPlantListDialog"
                           {...this.props}>
                <GeneralTextButton buttonText="by name"
                                   buttonAction={() => orderPlantListBy("name")}/>
                <GeneralTextButton buttonText="by start of grow time"
                                   buttonAction={() => orderPlantListBy("timeLine.growStart")}/>
                <GeneralTextButton buttonText="by end of grow time"
                                   buttonAction={() => orderPlantListBy("timeLine.growEnd")}/>
                <GeneralTextButton buttonText="by flower color"
                                   buttonAction={() => orderPlantListBy("flowerColor")}/>
                <GeneralTextButton buttonText="by start of flower time"
                                   buttonAction={() => orderPlantListBy("timeLine.flowerStart")}/>
                <GeneralTextButton buttonText="by end of flower time"
                                   buttonAction={() => orderPlantListBy("timeLine.flowerEnd")}/>
            </GeneralDialog>
        );
    }
}


// Map Redux state to component props
function mapStateToProps_OrderPlantListDialog(state) {
    return {}
}

// Map Redux actions to component props
function mapDispatchToProps_OrderPlantListDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        orderPlantListBy: (plantlist_order_field) => dispatch(ACTIONS.orderPlantListByAction(plantlist_order_field)),
    }
}

// Connected Component (Redux container)
export const OrderPlantListDialog = connect(
    mapStateToProps_OrderPlantListDialog,
    mapDispatchToProps_OrderPlantListDialog
)(OrderPlantListDialogComponent);

