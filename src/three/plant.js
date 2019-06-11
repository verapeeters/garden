import {Component} from 'react';
import * as THREE from 'three';



function debug(s) {
    //console.log(s);
}

//take into account that spritepictures are 65x65
const heightFactor = 100 / 65;

export class SpritePlant extends Component {
    constructor(props) {
        super(props);
        const {position, areaPosition} = this.props;
        const {maxHeight, spritePicture, spriteFlowerPicture} = this.props.plantProps;
        this.spriteWithoutFlower = this.createSprite(spritePicture, position, areaPosition, maxHeight);
        this.spriteWithFlower = this.createSprite(spriteFlowerPicture, position, areaPosition, maxHeight);

    }

    createSprite(spritePicture, position, areaPosition, maxHeight) {
        const loader = new THREE.TextureLoader();
        const spriteMap = loader.load(require('../' + spritePicture),
            undefined,
            undefined,
            (reason) => console.log('texture error' + JSON.stringify(reason)));
        const factoredMaxHeight = maxHeight * heightFactor;
        spriteMap.minFilter = THREE.LinearFilter;
        const spriteMaterial = new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff});
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(position.x+areaPosition.x, factoredMaxHeight / 2, position.z+areaPosition.z);
        sprite.scale.set(factoredMaxHeight, factoredMaxHeight, 1.0);
        return sprite;
    }

    componentDidMount() {
        debug("SpritePlant mount ");
        this.props.addInScene(this.spriteWithoutFlower);
        this.props.addInScene(this.spriteWithFlower);
    }

    componentWillUnmount() {
        debug("Plant unmount ");
        this.props.removeFromScene(this.spriteWithoutFlower);
        this.props.removeFromScene(this.spriteWithFlower);
    }

    render() {
        debug("SpritePlant render");
        const {weekNumber, showAllPlants, position, areaPosition} = this.props;
        const {maxHeight, timeLine} = this.props.plantProps;

        let scaleHeight = 0.01;
        if (timeLine.growStart < weekNumber && weekNumber < timeLine.growFinal) {
            scaleHeight = (weekNumber - timeLine.growStart) / (timeLine.growFinal - timeLine.growStart);
        } else if (timeLine.growFinal <= weekNumber && weekNumber <= timeLine.die) {
            scaleHeight = 1;
        }
        const factoredMaxHeight = maxHeight * heightFactor;
        const height = maxHeight * scaleHeight * heightFactor;
        let spriteToDisplay = this.spriteWithoutFlower;
        if (!showAllPlants) {
            this.spriteWithFlower.visible = false;
            this.spriteWithoutFlower.visible = false;
        }
        else if (timeLine.flowerStart <= weekNumber && weekNumber <= timeLine.flowerEnd) {
            spriteToDisplay = this.spriteWithFlower;
            this.spriteWithFlower.visible = true;
            this.spriteWithoutFlower.visible = false;
        } else {
            this.spriteWithFlower.visible = false;
            this.spriteWithoutFlower.visible = true;
        }
        spriteToDisplay.position.set(position.x+areaPosition.x, height / 2, position.z+areaPosition.z);
        spriteToDisplay.scale.set(factoredMaxHeight, height, 1.0);

        return null;
    }

}




