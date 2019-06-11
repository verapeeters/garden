// noinspection Annotator
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as THREE from 'three';
// noinspection JSFileReferences
// noinspection NpmUsedModulesInstalled
import Stats from 'stats.js';
import OrbitControls from './orbitControls';
import DragAreaControls from './dragAreaControls';
import {ContextDialog} from '../dialogs/contextDialog';
import {areAnyFixedWindowsActive} from '../utils/shownWindows';

import * as THREECOLORS from "../constants/threeColors.js";
import * as ACTIONS from '../actions.js';


const VIEW_ANGLE = 45, ASPECT = 1, NEAR = 0.1, FAR = 20000;

//===============================
// Create stuff for the world
function createStats(showDebugInfo) {
    let stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.right = "0px";
    stats.dom.style.left = "";
    stats.dom.style.display = showDebugInfo ? "block" : "none";
    return stats;
}

function createEarth() {
    let earthMaterial = new THREE.MeshLambertMaterial({
        color: THREECOLORS.WORLD_GRASS_GREEN,
        side: THREE.DoubleSide
    });
    //shadows don't cast on basic material
    const earthGeometry = new THREE.CircleGeometry(3000, 32);
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    earth.position.y = -2;
    earth.rotation.x = Math.PI / 2;
    earth.name = "earth";
    return earth;
}

function createSkyBox() {
    const skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    const skyBoxMaterial = new THREE.MeshBasicMaterial({color: THREECOLORS.WORLD_SKY_BLUE, side: THREE.BackSide});
    const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    skyBox.name = "skyBox";
    return skyBox;
}

function createFloor(floorWidth, floorLength) {
    let floorMaterial = new THREE.MeshLambertMaterial({
        color: THREECOLORS.WORLD_FLOOR_BROWN,
        side: THREE.DoubleSide
    });
    //shadows don't cast on basic material
    const floorGeometry = new THREE.PlaneGeometry(floorWidth, floorLength, 100, 100);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.position.y = 0;
    floor.rotation.x = Math.PI / 2;
    floor.name = "floor";
    return floor;
}

//===============================
// Helper functions
export function largeWindowForGardenThreeWorld(shownWindows, largerThenXXS) {
    return !areAnyFixedWindowsActive(shownWindows, largerThenXXS);
}

function calculateScreenHeight(media, largerThenXXS, screenBorder, shownWindows) {
    if (largeWindowForGardenThreeWorld(shownWindows, largerThenXXS)) {
        return Math.max(0, media.height - screenBorder - (largerThenXXS ? 72 : 87));
    } else {
        return Math.max(0, media.height - screenBorder - (largerThenXXS ? 350 : 310));
    }

}

//===============================
export class GardenThreeWorldComponent extends Component {
    constructor(props) {
        super(props);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        //this.renderer = new THREE.CanvasRenderer();
        this.stats = createStats(this.props.showDebugInfo);
        document.body.appendChild(this.stats.dom);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add(this.camera);
        this.camera.lookAt(this.scene.position);

        const floorWidth = 700;
        const floorLength = 700;

        this.scene.add(new THREE.AxesHelper(100));
        //this.scene.add( new THREE.GridHelper( floorWidth, 10 ) );
        this.scene.add(createEarth());
        this.scene.add(createSkyBox());
        const floor = createFloor(floorWidth, floorLength);
        this.scene.add(floor);
        //this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

        this.renderer.shadowMap.enabled = true;

        this.areaMeshes = [];
        //this.areaMeshes.push(floor);
        this.calculateSize = this.calculateSize.bind(this);
    }

    componentDidMount() {
        //console.log("componentDidMount" );

        this.domElement = document.getElementById('gardenThreeRenderer');
        this.domElement.appendChild(this.renderer.domElement);
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableKeys = false;

        this.dragAreaControls = new DragAreaControls(this.camera, this.scene, this.renderer.domElement,
            this.areaMeshes,
            this.props.changePositionForArea,
            this.props.changeWidthForArea,
            this.props.changeLengthForArea,
            this.props.toggleShowAreaContextMenuAction);

        window.onresize = this.props.windowSizeChangedAction;
        this.props.windowSizeChangedAction();
        this.animate();
    }

    componentWillReceiveProps(nextProps) {
        //console.log("gardenThreeWorld componentWillReceiveProps");
        if (nextProps.savingCameraPosition) {
            //console.log("gardenThreeWorld componentWillReceiveProps with newPositionName "+nextProps.savingCameraPosition);
            this.props.saveFetchedCameraPositionWithName(nextProps.cameraPositionNameToSave, this.camera.position);
        }
    }

    componentDidUpdate() {
        if (this.props.activeCameraPositionName) {
            this.props.modifyViewPointDone();
        }
    }

    componentWillUnmount() {
        this.orbitControls.dispose();
        this.dragAreaControls.dispose();
        this.renderer.dispose();
    }

    animate() {
        //console.log("animate");

        requestAnimationFrame(() => this.animate());
        this.stats.begin();
        this.renderScene();
        this.update();
        this.stats.end();
    }

    update() {
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    calculateSize() {
        const {activeCameraPositionName, savedCameraPositions, orbitControlsActive} = this.props;
        const {media, shownWindows} = this.props;

        if (this.renderer) {
            //console.log("calculateSize ww=" + window.innerWidth + " wh=" + window.innerHeight);
            //console.log("              mw=" + media.width + " mh=" + media.height);
            const largerThenXXS = media.largerThenXXS;
            const screenBorder = (largerThenXXS ? 50 : 10);
            const screenWidth = media.width - screenBorder;
            const screenHeight = calculateScreenHeight(media, largerThenXXS, screenBorder, shownWindows);
            //console.log("              sw=" + screenWidth + " sh=" + screenHeight);
            if (this.renderer.domElement) {
                this.renderer.setSize(screenWidth, screenHeight);
                this.camera.aspect = screenWidth / screenHeight;
                this.camera.updateProjectionMatrix();
            }
            if (this.orbitControls) {
                if (activeCameraPositionName) {
                    const newCoordinates = savedCameraPositions[activeCameraPositionName];
                    this.setCameraPositionCoordinates(newCoordinates);
                }
                this.orbitControls.enabled = orbitControlsActive;
                this.dragAreaControls.enable(!orbitControlsActive);
            }

        }
    }

    logWorldProps(title) {
        //console.log(title + " - "+JSON.stringify(this.renderer.info.memory)+" "+JSON.stringify(this.renderer.info.render));
    }

    addMeshInScene(mesh, isArea) {
        this.scene.add(mesh);
        if (isArea) {
            //console.log("area added in scene");
            this.areaMeshes.push(mesh);
        } else {
            //console.log("something else added in scene");
        }
    }

    removeMeshFromScene(mesh) {
        this.scene.remove(mesh);
    }

    setCameraPositionCoordinates(newCoordinates) {
        this.camera.position.set(newCoordinates.x, newCoordinates.y, newCoordinates.z);
        if (this.orbitControls)
            this.orbitControls.update();
    }

    render() {
        const {children} = this.props;
        //console.log("GardenThreeWorldComponent render");
        //this.logWorldProps("gardenThreeWorld render");
        this.calculateSize();

        const childWithProp = React.Children.map(children, (child) => {
            return React.cloneElement(child,
                {
                    addInScene: (mesh, isArea) => this.addMeshInScene(mesh, isArea),
                    removeFromScene: (mesh) => this.removeMeshFromScene(mesh)
                });
        });
        //console.log("gardenThreeWorld render done");
        this.stats.dom.style.display = this.props.showDebugInfo ? "block" : "none";

        return (
            <div id="gardenThreeRenderer" className="gardenThreeWorld ">
                {childWithProp} {/* instead of this.props.children */}
                <ContextDialog/>
            </div>
        );
    }
}

//=============================== redux

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        activeCameraPositionName: state.gardenThreeWorldReducer.activeCameraPositionName,
        cameraPositionNameToSave: state.gardenThreeWorldReducer.cameraPositionNameToSave,
        savingCameraPosition: state.gardenThreeWorldReducer.savingCameraPosition,
        savedCameraPositions: state.gardenThreeWorldReducer.savedCameraPositions,
        showDebugInfo: state.gardenReducer.showDebugInfo,
        orbitControlsActive: state.gardenThreeWorldReducer.orbitControlsActive,

        media: state.gardenReducer.media,
        shownWindows: state.shownWindowsReducer.shownWindows,
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {
        modifyViewPointDone: () => dispatch(ACTIONS.modifyViewPointDoneAction),
        saveFetchedCameraPositionWithName: (newPositionName, coordinates) => dispatch(ACTIONS.saveFetchedCameraPositionWithNameAction(newPositionName, coordinates)),
        changePositionForArea: (areaKey, newX, newZ) => dispatch(ACTIONS.changePositionForAreaAction(areaKey, newX, newZ)),
        changeWidthForArea: (areaKey, newWidth) => dispatch(ACTIONS.changeFieldInGivenAreaAction("width", areaKey, newWidth)),
        changeLengthForArea: (areaKey, newLength) => dispatch(ACTIONS.changeFieldInGivenAreaAction("length", areaKey, newLength)),
        toggleShowAreaContextMenuAction: (areaKey, x, y) => dispatch(ACTIONS.toggleShowAreaContextMenuAction(areaKey, x, y)),
        windowSizeChangedAction: () => dispatch(ACTIONS.windowSizeChangedAction()),
    }
}

// Connected Component
export const GardenThreeWorld = connect(
    mapStateToProps,
    mapDispatchToProps
)(GardenThreeWorldComponent);
