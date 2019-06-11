import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import ReactGA from 'react-ga';

import {version} from '../package.json'
import * as CONFIG from './data/config.json'

import './scss/App.css';
import "normalize.css"
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import {store} from './reducers/reduxStore.js'
import {Garden} from './garden.js'
import {GardenMenuButtonContainer} from './gardenMenu.js'

import {registerWindowType} from "./utils/shownWindows";
import {CookieLawDialog} from "./dialogs/cookieLawDialog.js";
import {ExportGardenAsJsonDialog} from "./dialogs/exportGardenAsJsonDialog.js";
import {ImportFileSelectorDialog} from "./dialogs/importFileSelectorDialog.js";
import {NewPlantDialog} from "./dialogs/newPlantDialog.js";
import {OrderPlantListDialog} from "./dialogs/orderPlantListDialog.js";
import {OkToResetDialog} from "./dialogs/okToResetDialog.js";
import {PlantFiche} from "./dialogs/plantFiche.js";
import {PlantList} from "./dialogs/plantList.js";
import {SaveCameraPositionDialog} from "./dialogs/saveCameraPositionDialog.js";
import {ShowHideDialog} from "./dialogs/showHideDialog.js";
import {TutorialDialog} from "./dialogs/tutorialDialog.js";

import * as DIALOGS from './constants/dialogConstants';


registerWindowType(DIALOGS.COOKIE_LAW_DIALOG, (props) => <CookieLawDialog {...props}/>);
registerWindowType(DIALOGS.EXPORT_GARDEN_AS_JSON_DIALOG, (props) => <ExportGardenAsJsonDialog {...props}/>);
registerWindowType(DIALOGS.IMPORT_FILE_SELECTOR_DIALOG, (props) => <ImportFileSelectorDialog {...props}/>);
registerWindowType(DIALOGS.NEW_PLANTS_DIALOG, (props) => <NewPlantDialog {...props} />, true);
registerWindowType(DIALOGS.OK_TO_RESET_DIALOG, (props) => <OkToResetDialog {...props}/>);
registerWindowType(DIALOGS.ORDER_PLANT_LIST_DIALOG, (props) => <OrderPlantListDialog {...props}/>);
registerWindowType(DIALOGS.PLANT_FICHE_DIALOG, (props) => <PlantFiche {...props} />, true);
registerWindowType(DIALOGS.PLANT_LIST_DIALOG, (props) => <PlantList {...props} />, true, true);
registerWindowType(DIALOGS.SAVE_CAMERA_POSITION_DIALOG, (props) => <SaveCameraPositionDialog {...props}/>);
registerWindowType(DIALOGS.SHOW_HIDE_DIALOG, (props) => <ShowHideDialog {...props}/>);
registerWindowType(DIALOGS.TUTORIAL_DIALOG, (props) => <TutorialDialog {...props}/>);


//=============================== Debug Info

class DebugInfo extends Component {
    render() {
        const {showDebugInfo, media} = this.props;
        if (!showDebugInfo) return null;

        const threereactgarden_element = document.getElementById("three-react-garden");
        const threereactgarden_element_width = threereactgarden_element && threereactgarden_element.offsetWidth;
        return <span className="debuginfo">{media.width} {threereactgarden_element_width}</span>;
    }
}

//=============================== redux store

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        layoutSize: state.gardenThreeWorldReducer.layoutSize,
        showDebugInfo: state.gardenReducer.showDebugInfo,
        media: state.gardenReducer.media,
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {}
}

// Connected Component
export const DebugInfoContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugInfo);

//=============================== Main App

class App extends Component {
    constructor() {
        super();

        ReactGA.initialize(CONFIG.GA_CODE);
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <header className="App-header">
                        <GardenMenuButtonContainer/>
                        <h1 className="App-title">Garden</h1>
                    </header>
                    <Garden/>
                    <header className="App-footer">
                        <DebugInfoContainer/>
                        <h1 className="App-version">{version}</h1>
                    </header>
                </div>
            </Provider>
        );
    }
}

export default App;
