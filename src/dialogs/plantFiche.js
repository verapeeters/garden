import React, {Component} from 'react';
import {connect} from 'react-redux';


import FaEye from 'react-icons/lib/fa/eye';
import MdAdd from 'react-icons/lib/md/add';
import MdDelete from 'react-icons/lib/md/delete';
import TiInfoLargeOutline from 'react-icons/lib/ti/info-large-outline';

import {GeneralDialog} from '../utils/generalDialog.js'
import {PlantTimeLine} from '../utils/plantTimeLine';
import {ButtonBar} from '../utils/buttonBar';

import * as DIALOGS from '../constants/dialogConstants';
import * as ACTIONS from '../actions.js';
import * as PLANTS from '../data/plants.data.js';
import * as SIZES from '../constants/sizes';

//================================================
class OneAreaValueInputComponent extends Component {
    render() {
        const {value, fieldName, areaKey} = this.props;
        const {changeFieldInGivenArea} = this.props;

        return <div className="AreaInfoCol">
            <input type="number" step="10" name={fieldName} value={value}
                   onChange={(e) => changeFieldInGivenArea(fieldName, areaKey, e.target.value)}/>
        </div>

    }
}

// Map Redux state to component props
function mapStateToProps_OneAreaValueInput(state, ownProps) {
    return {}
}

// Map Redux actions to component props
function mapDispatchToProps_OneAreaValueInput(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        changeFieldInGivenArea: (fieldName, areaKey, newValue) => dispatch(ACTIONS.changeFieldInGivenAreaAction(fieldName, areaKey, newValue)),

    }
}

// Connected Component (Redux container)
const OneAreaValueInput = connect(
    mapStateToProps_OneAreaValueInput,
    mapDispatchToProps_OneAreaValueInput
)(OneAreaValueInputComponent);

//================================================
class OneAreaForPlantFicheTitle extends Component {
    render() {
        return <div className="OneAreaForPlantTitle">
            <div className="colButton">&nbsp;</div>
            <div className="AreaInfoTitle">
                <div className="AreaInfoColTitle">x</div>
                <div className="AreaInfoColTitle">z</div>
                <div className="AreaInfoColTitle">width</div>
                <div className="AreaInfoColTitle">length</div>
            </div>
            <div className="colButton">&nbsp;</div>
            <div className="colButton">&nbsp;</div>
        </div>
    }
}

//================================================
class OneAreaForPlantFicheComponent extends Component {
    render() {
        const {area} = this.props;
        const {toggleShowOneArea, deleteArea, duplicateArea} = this.props;
        const areaShown = area.showArea;
        const titleForShowOneAreaButton = (areaShown ? "hide" : "show") + " this area";
        //console.log("OneAreaForPlantComponent render");

        return <div className="OneAreaForPlant">
            <div className="colButton">
                <button onClick={() => toggleShowOneArea(area.key)}
                        title={titleForShowOneAreaButton}
                        className={areaShown ? "buttonActive" : "buttonNotActiveButVisible"}><FaEye
                    size={SIZES.ICON_SIZE}/>
                </button>
            </div>
            <div className="AreaInfo">
                <OneAreaValueInput value={area.x} fieldName="x" areaKey={area.key}/>
                <OneAreaValueInput value={area.z} fieldName="z" areaKey={area.key}/>
                <OneAreaValueInput value={area.width} fieldName="width" areaKey={area.key}/>
                <OneAreaValueInput value={area.length} fieldName="length" areaKey={area.key}/>
            </div>
            <div className="colButton">
                <button onClick={() => deleteArea(area.key)}
                        title="delete this area" className="buttonNotActive"><MdDelete size={SIZES.ICON_SIZE}/></button>
            </div>
            <div className="colButton">
                <button onClick={() => duplicateArea(area.key)}
                        title="duplicate this area" className="buttonNotActive"><MdAdd size={SIZES.ICON_SIZE}/></button>
            </div>
        </div>
    }
}

// Map Redux state to component props
function mapStateToProps_OneAreaForPlantFiche(state, ownProps) {
    return {}
}

// Map Redux actions to component props
function mapDispatchToProps_OneAreaForPlantFiche(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        toggleShowOneArea: (key) => dispatch(ACTIONS.toggleShowOneAreaAction(key)),
        deleteArea: (areaKey) => dispatch(ACTIONS.deleteAreaAction(areaKey)),
        duplicateArea: (areaKey) => dispatch(ACTIONS.duplicateAreaAction(areaKey)),

    }
}

// Connected Component (Redux container)
const OneAreaForPlantFiche = connect(
    mapStateToProps_OneAreaForPlantFiche,
    mapDispatchToProps_OneAreaForPlantFiche
)(OneAreaForPlantFicheComponent);

//================================================
class AllAreasForPlantFiche extends Component {
    render() {
        const {allAreasForPlant} = this.props;
        return <div className="AllAreasForPlant">
            <OneAreaForPlantFicheTitle key={0}/>
            {allAreasForPlant.map((area, i) => {
                    return <OneAreaForPlantFiche key={area.key} area={area}/>
                }
            )}
        </div>
    }
}

//================================================
class PlantInfoLink extends Component {
    render() {
        const {link} = this.props;
        if (!link) return null;

        return <div className="buttonLink">
            <a href={link}
               title="more info on www.vasteplant.be" target="_blank" rel="noopener noreferrer">
                <TiInfoLargeOutline size={SIZES.ICON_SIZE}/></a>
        </div>
    }
}


//================================================
class PlantFicheComponent extends Component {
    render() {
        const {areas, fixed} = this.props;
        const plantId = this.props.window.key;
        const {toggleShowAreasForPlant, createNewAreaForPlant} = this.props;
        const plantPropsFromCatalog = PLANTS.getPlantProps(plantId);
        const allAreasForThisPlant = areas.filter((area) => (area.plant === plantId));
        const areAllAreasForThisPlantShown = allAreasForThisPlant.reduce((accum, area) => accum && area.showArea, true);
        const titleForShowAreasButton = (areAllAreasForThisPlantShown ? "hide" : "show") + " all areas for " + plantPropsFromCatalog.name;

        return <GeneralDialog dialogName={plantId}
                              windowType={DIALOGS.PLANT_FICHE_DIALOG}
                              className={fixed ? "PlantFicheFixed" : "PlantFicheFloating"}
                              calcPositionFromIndex={true}
                              {...this.props}>

            <div className="PlantPicture">
                <img src={require('../' + plantPropsFromCatalog.spriteFlowerPicture)} alt=""/>
            </div>
            <div className="PlantFicheHeader">
                <div className="PlantName">
                    {plantPropsFromCatalog.name}
                </div>

                <PlantTimeLine plantProps={plantPropsFromCatalog}/>
            </div>
            <div className="PlantFicheContent">
                <AllAreasForPlantFiche allAreasForPlant={allAreasForThisPlant}/>
            </div>

            <ButtonBar>
                <PlantInfoLink link={plantPropsFromCatalog.linkWithInfo}/>
                <button onClick={() => createNewAreaForPlant(plantId)}
                        title="add new area">
                    <MdAdd size={SIZES.ICON_SIZE}/>
                </button>
                <button onClick={() => toggleShowAreasForPlant(plantId)}
                        title={titleForShowAreasButton}>
                    <FaEye size={SIZES.ICON_SIZE}/>
                </button>
            </ButtonBar>
        </GeneralDialog>
    }
}

// Map Redux state to component props
function mapStateToProps_PlantFiche(state) {
    return {
        areas: state.gardenReducer.areas, /* areas defined for this garden */
    }
}

// Map Redux actions to component props
function mapDispatchToProps_PlantFiche(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        toggleShowAreasForPlant: (plantId) => dispatch(ACTIONS.toggleShowAreasForPlantAction(plantId)),
        windowToFront: (windowKey) => dispatch(ACTIONS.dialogWindowToFrontAction(windowKey)),
        createNewAreaForPlant: (plantId) => dispatch(ACTIONS.createNewAreaForPlantAction(plantId)),

    }
}

// Connected Component (Redux container)
export const PlantFiche = connect(
    mapStateToProps_PlantFiche,
    mapDispatchToProps_PlantFiche
)(PlantFicheComponent);
