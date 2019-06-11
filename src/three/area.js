import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as THREE from 'three';

import {SpritePlant} from "./plant.js";
import * as PLANTS from '../data/plants.data.js';
import {randomPointInAreaIntersection} from '../utils/areaUtils.js';

function debug(s) {
    //console.log(s);
}


export class GenericPlantAreaComponent extends Component {
    constructor(props) {
        debug("area construcor");

        super(props);

        const {x, z, width, length, plant: plantId, key} = this.props.area;
        this.plantProps = PLANTS.getPlantProps(plantId);

        const flowerColor = this.plantProps && this.plantProps.flowerColor;
        let areaColoredMaterial = new THREE.MeshBasicMaterial({
            color: flowerColor,
            side: THREE.DoubleSide
        });
        this.geometry = new THREE.PlaneGeometry(width, length);

        this.areaMesh = new THREE.Mesh(this.geometry, areaColoredMaterial);
        this.areaMesh.receiveShadow = true;
        //this.areaMesh.castShadow = true;
        this.areaMesh.position.x = x;
        this.areaMesh.position.y = 0.3;
        this.areaMesh.position.z = z;
        this.areaMesh.rotation.x = Math.PI / 2;
        this.areaMesh.name = key;

        this.state = {
            plantProps: this.plantProps,
            area: {width, length},
            positions: GenericPlantAreaComponent.repositionPlants(this.props.area, [], this.plantProps, {
                width: 0,
                length: 0
            })
        };
    }


    static repositionPlants(area, oldPositions, plantProps, prevArea) {
        debug("repositionPlants for area ");
        const {width, length} = area;

        const plantsPerM2 = plantProps ? plantProps.plantsPerM2 : 0;
        const areaSize = width * length / 10000;
        const numberOfPlants = Math.floor(areaSize * plantsPerM2);

        if (oldPositions.length < numberOfPlants) {
            debug("-- add plants for area " + area.key + " areaSize=" + areaSize + " existing pos=" + oldPositions.length + " -- wanted pos=" + numberOfPlants);
            const newPositions = oldPositions.slice();
            for (let i = newPositions.length; i < numberOfPlants; ++i) {
                const posX = randomPointInAreaIntersection(Math.random(), prevArea.width, width);
                const posZ = randomPointInAreaIntersection(Math.random(), prevArea.length, length);
                newPositions.push({x: posX, z: posZ})
            }
            return newPositions;
        } else if (oldPositions.length > numberOfPlants) {
            debug("-- remove plants for area " + area.key + " areaSize=" + areaSize + " existing pos=" + oldPositions.length + " -- wanted pos=" + numberOfPlants);
            return oldPositions.filter((p) =>
                Math.abs(p.x) <= width / 2 && Math.abs(p.z) <= length / 2);
        }
        debug("-- no changes for area " + area.key + " areaSize=" + areaSize + " existing pos=" + oldPositions.length + " -- wanted pos=" + numberOfPlants);
        return oldPositions;

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        debug("area getDerivedStateFromProps");
        return {
            ...prevState,
            positions: GenericPlantAreaComponent.repositionPlants(nextProps.area, prevState.positions, prevState.plantProps, prevState.area),
            area: nextProps.area,
        };
    }

    componentDidMount() {
        debug("area mount");
        this.props.addInScene(this.areaMesh, true);
    }

    componentDidUpdate(prevProps) {
        const {area} = this.props;
        debug("area componentDidUpdate");

        this.areaMesh.position.x = area.x;
        this.areaMesh.position.z = area.z;
        this.areaMesh.scale.x = area.width / this.areaMesh.geometry.parameters.width;
        this.areaMesh.scale.y = area.length / this.areaMesh.geometry.parameters.height;
    }

    componentWillUnmount() {
        this.props.removeFromScene(this.areaMesh);
        this.geometry.dispose();
    }


    render() {
        const {weekNumber, showAllPlants, area, addInScene, removeFromScene} = this.props;

        this.areaMesh.visible = area.showArea || false;
        debug("area render ");
        const areaPosition = {x: area.x, z: area.z};
        const plantJsxPerPosition = this.state.positions.map((pos, index) => (
            <SpritePlant key={index}
                         position={pos}
                         areaPosition={areaPosition}
                         weekNumber={weekNumber}
                         showAllPlants={showAllPlants}
                         addInScene={addInScene}
                         removeFromScene={removeFromScene}
                         plantProps={this.plantProps}/>));

        return <div>{plantJsxPerPosition}</div>

    }
}

// Map Redux state to component props
function mapStateToProps(state, ownProps) {
    return {
        weekNumber: state.weekNumberReducer.weekNumber,
        showAllPlants: state.gardenReducer.showAllPlants,
        area: state.gardenReducer.areas[ownProps.areaIndex],
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    // noinspection JSUnusedGlobalSymbols
    return {}
}

// Connected Component
export const
    GenericPlantArea = connect(
        mapStateToProps,
        mapDispatchToProps
    )(GenericPlantAreaComponent);


//=============================== PlantAreas
export class PlantAreas
    extends Component {
    render() {
        const {areas, addInScene, removeFromScene} = this.props;
        return <div>
            {
                areas && areas.map(
                    (areaProps, i) => <GenericPlantArea
                        key={areaProps.key}
                        areaIndex={i}
                        addInScene={addInScene}
                        removeFromScene={removeFromScene}
                    />)
            }
        </div>;
    }
}
