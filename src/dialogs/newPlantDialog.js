import React, {Component} from 'react';
import {connect} from 'react-redux';

import {PlantName} from '../utils/plantNameButton';
import {PlantTimeLine} from '../utils/plantTimeLine';

import {plantsNotUsed, orderPlantListBy} from '../utils/plantListUtils.js';
import {GeneralDialog} from '../utils/generalDialog.js'

import * as DIALOGS from '../constants/dialogConstants';
import * as PLANTS from '../data/plants.data.js';


class NewPlantDialogComponent extends Component {
    render() {
        const {fixed, plants, plantlist_order_direction, plantlist_order_field} = this.props;

        const plantsFromCatalogNotUsed = plantsNotUsed(plants, PLANTS.CATALOG);
        const orderedPlantsFromCatalogNotUsed = orderPlantListBy(plantsFromCatalogNotUsed, plantlist_order_direction === "asc", plantlist_order_field);
        return (
            <GeneralDialog title="Choose a new plant for your garden"
                           className={fixed ? "NewPlantDialogFixed" : "NewPlantDialogFloating"}
                           dialogName={DIALOGS.NEW_PLANTS_DIALOG}
                           {...this.props}>
                {
                    (orderedPlantsFromCatalogNotUsed.length === 0)
                        ? "all plants are used in this garden"
                        : <div className="allPlants">
                            {orderedPlantsFromCatalogNotUsed
                                .map((plant) => (
                                    <div className="PlantRow" key={plant.plantId}>
                                        <PlantName plantId={plant.plantId}/>
                                        <PlantTimeLine plantProps={PLANTS.getPlantProps(plant.plantId)}/>
                                    </div>))
                            }
                        </div>
                }
            </GeneralDialog>
        );
    }
}

// Map Redux state to component props
function mapStateToProps_NewPlantDialog(state) {
    return {
        plants: state.gardenReducer.plants,
        plantlist_order_direction: state.gardenReducer.plantlist_order_direction,
        plantlist_order_field: state.gardenReducer.plantlist_order_field,
    }
}

// Map Redux actions to component props
function mapDispatchToProps_NewPlantDialog(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {}
}

// Connected Component (Redux container)
export const NewPlantDialog = connect(
    mapStateToProps_NewPlantDialog,
    mapDispatchToProps_NewPlantDialog
)(NewPlantDialogComponent);


//================================================

