import {Component} from 'react';
import {connect} from 'react-redux';

import * as THREE from 'three';



export class SunMesh extends Component {
    constructor(props) {
        super(props);
        const position = this.props.sunPosition;
        this.spotLight = SunMesh.createSpotlight(position);
        this.props.addInScene(this.spotLight);

        this.pointLight = SunMesh.createPointLight(300, 200, 300);
        this.props.addInScene(this.pointLight);
        this.pointLight = SunMesh.createPointLight(-300, 200, -300);
        this.props.addInScene(this.pointLight);

        //let ambientLight = new THREE.AmbientLight(0xd0d090, 0.5);
        //this.props.addInScene(ambientLight);

        this.sphere = SunMesh.createSphere(position);
        this.props.addInScene(this.sphere);
    }

    static createPointLight(x, y, z) {
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.intensity = 1;
        pointLight.position.set(x, y, z);
        return pointLight;
    }

    static createSpotlight(position) {
        const spotlight = new THREE.SpotLight(0xffff00);
        spotlight.position.set(position.x || 0, position.y || 0, position.z || 0);
        spotlight.intensity = 2;
        spotlight.distance = 1400;
        spotlight.decay = 1;
        // must enable shadow casting ability for the light
        spotlight.castShadow = true;
        return spotlight;
    }

    static createSphere(position) {
        const sphereGeometry = new THREE.SphereGeometry(10, 16, 8);
        const darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
        const wireframeMaterial = new THREE.MeshBasicMaterial(
            {color: 0xffff00, wireframe: true, transparent: true});
        const sun = THREE.SceneUtils.createMultiMaterialObject(
            sphereGeometry, [darkMaterial, wireframeMaterial]);
        if (position) sun.position.set(position.x || 0, position.y || 0, position.z || 0);
        sun.name = "sun";
        return sun;
    }

    render() {
        const position = this.props.sunPosition;
        if (position) {
            this.spotLight.position.set(position.x, position.y, position.z);
            //this.pointLight.position.set(position.x, position.y, position.z);

            this.sphere.position.set(position.x, position.y, position.z);
        }
        return null;
    }
}


//=============================== redux

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        sunPosition: state.sunMeshReducer.sunPosition,
    }
}

// Map Redux actions to component props
// noinspection JSUnusedLocalSymbols
function mapDispatchToProps(dispatch) {
    return {
    }
}

// Connected Component
export const SunMeshContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SunMesh);
