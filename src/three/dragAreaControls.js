import {highlightColor} from "../utils/colorUtils";

import * as THREE from "three";

const DRAGGING_ACTION_MOVE = 1;
const DRAGGING_ACTION_RESIZE_VERTICAL = 2;
const DRAGGING_ACTION_RESIZE_HORIZONTAL = 3;

export default class DragAreaControls {
    constructor(camera, scene, domElement, areaMeshes,
                changePositionForArea, changeWidthForArea, changeLengthForArea, toggleShowAreaContextMenuAction) {
        // noinspection JSUnusedGlobalSymbols
        this.camera = camera;
        // noinspection JSUnusedGlobalSymbols
        this.scene = scene;
        // noinspection JSUnusedGlobalSymbols
        this.domElement = domElement;
        this.changePositionForArea = changePositionForArea;
        this.changeWidthForArea = changeWidthForArea;
        this.changeLengthForArea = changeLengthForArea;
        this.toggleShowAreaContextMenuAction = toggleShowAreaContextMenuAction;
        this.areaMeshes = areaMeshes;

        this.active = false;
        this.selectedThreeArea = null;
        this.draggingAction = null;
        this.saveColor = null;
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 3);
        //this.scene.add(new THREE.PlaneHelper(this.plane, 500, 0xffff00));
        this.intersection = new THREE.Vector3();
        this.offset = new THREE.Vector3();

        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
        this.onDocumentTouchDown = this.onDocumentTouchDown.bind(this);
        this.onDocumentTouchMove = this.onDocumentTouchMove.bind(this);
        this.onDocumentTouchUp = this.onDocumentTouchUp.bind(this);
    }

    dispose() {
        this.enable(false);
    }

    getNormalizedMouseCoordinates(event) {
        const mouse = new THREE.Vector2();
        mouse.x = ((event.offsetX - this.domElement.scrollLeft) / this.domElement.scrollWidth) * 2 - 1;
        mouse.y = -((event.offsetY - -this.domElement.scrollTop) / this.domElement.scrollHeight) * 2 + 1;
        return mouse;
    }

    getNormalizedTouchCoordinates(event) {
        const rect = event.target.getBoundingClientRect();
        const touch = new THREE.Vector2();
        touch.x = ((event.touches[0].pageX - rect.left) / this.domElement.scrollWidth) * 2 - 1;
        touch.y = -((event.touches[0].pageY - rect.top) / this.domElement.scrollHeight) * 2 + 1;
        return touch;
    }

    static clickedOnVerticalBorder(selected, intersectPoint) {
        const areaPosX = selected.position.x;
        const areaWidth = selected.scale.x * selected.geometry.parameters.width;
        const horizontalDistance = Math.abs(areaPosX - intersectPoint.x);
        return (Math.abs(horizontalDistance - areaWidth / 2) < 25);
    }

    static clickedOnHorizontalBorder(selected, intersectPoint) {
        const areaPosZ = selected.position.z;
        const areaLength = selected.scale.y * selected.geometry.parameters.height;
        const verticalDistance = Math.abs(areaPosZ - intersectPoint.z);
        return (Math.abs(verticalDistance - areaLength / 2) < 25);
    }


    onDocumentMouseDown(event) {
        const mouse = this.getNormalizedMouseCoordinates(event);
        this.raycaster.setFromCamera(mouse, this.camera);

        if (!this.selectedThreeArea) {
            const foundIntersections = this.raycaster.intersectObjects(this.areaMeshes);
            if (foundIntersections.length > 0) {
                event.preventDefault();
                const selectedThreeArea = foundIntersections[0].object;
                if (event.button === 2) {
                    this.toggleShowAreaContextMenuAction(selectedThreeArea.name, event.offsetX + 10, event.offsetY + 10);
                    event.preventDefault();
                } else {
                    const intersectPoint = foundIntersections[0].point;
                    if (DragAreaControls.clickedOnVerticalBorder(selectedThreeArea, intersectPoint)) {
                        this.domElement.style.cursor = 'ew-resize';
                        this.draggingAction = DRAGGING_ACTION_RESIZE_HORIZONTAL;
                    } else if (DragAreaControls.clickedOnHorizontalBorder(selectedThreeArea, intersectPoint)) {
                        this.domElement.style.cursor = 'ns-resize';
                        this.draggingAction = DRAGGING_ACTION_RESIZE_VERTICAL;
                    } else {
                        this.domElement.style.cursor = 'move';
                        this.draggingAction = DRAGGING_ACTION_MOVE;
                    }
                    if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                        this.offset.copy(this.intersection).sub(selectedThreeArea.position);
                    }
                    this.saveColor = selectedThreeArea.material.color.getHex();
                    const selectedColor = highlightColor(this.saveColor);
                    selectedThreeArea.material.color.set(selectedColor);
                    this.selectedThreeArea = selectedThreeArea;
                }
            }
        }
    }

    onDocumentTouchDown(event) {
        event.preventDefault();
        const mouse = this.getNormalizedTouchCoordinates(event);
        this.raycaster.setFromCamera(mouse, this.camera);

        if (!this.selectedThreeArea) {
            const foundIntersections = this.raycaster.intersectObjects(this.areaMeshes);
            if (foundIntersections.length > 0) {
                const selectedThreeArea = foundIntersections[0].object;
                if (event.button === 2) {
                    this.toggleShowAreaContextMenuAction(selectedThreeArea.name, event.offsetX + 10, event.offsetY + 10);
                    event.preventDefault();
                } else {
                    const intersectPoint = foundIntersections[0].point;
                    if (DragAreaControls.clickedOnVerticalBorder(selectedThreeArea, intersectPoint)) {
                        this.domElement.style.cursor = 'ew-resize';
                        this.draggingAction = DRAGGING_ACTION_RESIZE_HORIZONTAL;
                    } else if (DragAreaControls.clickedOnHorizontalBorder(selectedThreeArea, intersectPoint)) {
                        this.domElement.style.cursor = 'ns-resize';
                        this.draggingAction = DRAGGING_ACTION_RESIZE_VERTICAL;
                    } else {
                        this.domElement.style.cursor = 'move';
                        this.draggingAction = DRAGGING_ACTION_MOVE;
                    }
                    if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                        this.offset.copy(this.intersection).sub(selectedThreeArea.position);
                    }
                    this.saveColor = selectedThreeArea.material.color.getHex();
                    const selectedColor = highlightColor(this.saveColor);
                    selectedThreeArea.material.color.set(selectedColor);
                    this.selectedThreeArea = selectedThreeArea;
                }
            }
        }
    }

    onDocumentMouseMove(event) {
        event.preventDefault();
        if (this.selectedThreeArea) {
            const mouse = this.getNormalizedMouseCoordinates(event);
            this.raycaster.setFromCamera(mouse, this.camera);

            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                switch (this.draggingAction) {
                    case DRAGGING_ACTION_MOVE: {
                        const newPosition = this.intersection.sub(this.offset);
                        this.changePositionForArea(this.selectedThreeArea.name, Math.floor(newPosition.x), Math.floor(newPosition.z));
                        break;
                    }
                    case DRAGGING_ACTION_RESIZE_HORIZONTAL: {
                        const newWidth = Math.floor(Math.abs(this.selectedThreeArea.position.x - this.intersection.x) * 2);
                        this.changeWidthForArea(this.selectedThreeArea.name, newWidth);
                        break;
                    }
                    case DRAGGING_ACTION_RESIZE_VERTICAL: {
                        const newLength = Math.floor(Math.abs(this.selectedThreeArea.position.z - this.intersection.z) * 2);
                        this.changeLengthForArea(this.selectedThreeArea.name, newLength);
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }

    onDocumentTouchMove(event) {
        event.preventDefault();
        if (this.selectedThreeArea) {
            const mouse = this.getNormalizedTouchCoordinates(event);
            this.raycaster.setFromCamera(mouse, this.camera);

            if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
                switch (this.draggingAction) {
                    case DRAGGING_ACTION_MOVE: {
                        const newPosition = this.intersection.sub(this.offset);
                        this.changePositionForArea(this.selectedThreeArea.name, Math.floor(newPosition.x), Math.floor(newPosition.z));
                        break;
                    }
                    case DRAGGING_ACTION_RESIZE_HORIZONTAL: {
                        const newWidth = Math.floor(Math.abs(this.selectedThreeArea.position.x - this.intersection.x) * 2);
                        this.changeWidthForArea(this.selectedThreeArea.name, newWidth);
                        break;
                    }
                    case DRAGGING_ACTION_RESIZE_VERTICAL: {
                        const newLength = Math.floor(Math.abs(this.selectedThreeArea.position.z - this.intersection.z) * 2);
                        this.changeLengthForArea(this.selectedThreeArea.name, newLength);
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }

    onDocumentMouseUp(event) {
        event.preventDefault();
        if (this.selectedThreeArea) {
            this.selectedThreeArea.material.color.set(this.saveColor);
            this.saveColor = null;
            this.selectedThreeArea = null;
            this.draggingAction = null;
            this.domElement.style.cursor = 'auto';
        }
    }

    onDocumentTouchUp(event) {
        event.preventDefault();
        if (this.selectedThreeArea) {
            this.selectedThreeArea.material.color.set(this.saveColor);
            this.saveColor = null;
            this.selectedThreeArea = null;
            this.draggingAction = null;
            this.domElement.style.cursor = 'auto';
        }
    }

    enable(active) {
        if (this.active !== active) {
            this.active = active;
            if (active) {
                this.domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
                this.domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
                this.domElement.addEventListener('mouseup', this.onDocumentMouseUp, false);
                this.domElement.addEventListener('touchstart', this.onDocumentTouchDown, false);
                this.domElement.addEventListener('touchmove', this.onDocumentTouchMove, false);
                this.domElement.addEventListener('touchend', this.onDocumentTouchUp, false);
            } else {
                this.domElement.removeEventListener('mousedown', this.onDocumentMouseDown, false);
                this.domElement.removeEventListener('mousemove', this.onDocumentMouseMove, false);
                this.domElement.removeEventListener('mouseup', this.onDocumentMouseUp, false);
                this.domElement.removeEventListener('touchstart', this.onDocumentTouchDown, false);
                this.domElement.removeEventListener('touchmove', this.onDocumentTouchMove, false);
                this.domElement.removeEventListener('touchend', this.onDocumentTouchUp, false);
            }
        }
    }

}
