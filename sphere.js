import * as THREE from "three";
import {
    getAllImages,
    clearSelection,
    getSelectedImages,
    paintRangeImages,
    clearRangeImages,
} from "./interaction";
import { create, all, range } from "mathjs";
import { saveSphere } from "./inspect";

import { genText } from "./text-rendering";

const math = create(all, {});

var radius = 0.5;
//var C;
var scene;
var sphereObject;

function setScene(sce) {
    scene = sce;
}

function openSphericalImages() {
    console.time('computeCoords');
    let images = getAllImages();
    let json = [];

    images.forEach((object) => {
        let P_inter = object.userData.intersection;
        let P_real = object.position;
        if (P_inter == null) return;
        if (sphereObject.position.distanceTo(P_real) < radius) {
            const real_pos = get2DCoords(P_real);
            const inter_pos = get2DCoords(P_inter);
            json.push({
                name: object.name,
                x_real: real_pos.x,
                y_real: real_pos.y,
                x_inter: inter_pos.x,
                y_inter: inter_pos.y,
                isLandscape: object.userData.isLandscape,
                heightToWidthRatio: object.userData.heightToWidthRatio,
                zoom: object.userData.zoom,
            });
        }
    });

    let jsonContent = JSON.stringify(json);
    localStorage.setItem("images", jsonContent);
    const url = "openseadragon.html?mode=spherical";

    window.open(url, "blank");
    clearSelection();
    console.timeEnd('computeCoords')
}

function get2DCoords(P) {
    const V = new THREE.Vector3().subVectors(P, sphereObject.position).normalize();
    const phi = math.acos(V.y);
    const theta = math.atan2(V.x, V.z);
    return { x: -theta, y: phi }; // TODO: Check if it is correct
}

function applySphericalRadius(r) {
    clearRangeImages();
    sphereObject.scale.set(1 / radius, 1 / radius, 1 / radius);
    sphereObject.scale.set(r, r, r);
    radius = r;
    paintRange();
}

function createSphere() {
    var imagesSelected = getSelectedImages();
    if (imagesSelected.size != 1) {
        console.log("You need to select exactly 1 image");
        return;
    }
    const images = Array.from(imagesSelected);
    
    const geometry = new THREE.SphereGeometry(1, 30, 30);
    const material = new THREE.MeshPhongMaterial({
        color: 0xaaaaff,
        transparent: true,
        opacity: 0.7,
        specular: 0xffffff,
        shininess: 120,
        twosided: true,
        wireframe: false,
    });
    sphereObject = new THREE.Mesh(geometry, material);
    
    scene.add(sphereObject);

    sphereObject.scale.set(radius, radius, radius);
    sphereObject.position.set(images[0].position.x, images[0].position.y, images[0].position.z);
    sphereObject.name = "SphereShape";

    scene.draggableObjects.push(sphereObject);

    clearSelection();
    paintRange();

    const groupNameInput = document.getElementById("groupName");
    const groupName = groupNameInput.value.trim();
    //var text = genText(groupName, C.x, C.y, C.z);

}

function cancelSphere() {
    scene.remove(sphereObject);
    scene.draggableObjects.pop();
    console.log("Sphere removed", scene.draggableObjects);
    clearSelection();
    sphereObject = null;
    clearRangeImages();
}

function paintRange() {
    console.log("Painting range");
    let images = getAllImages();
    let rangeImages = new Set();
    images.forEach((object) => {
        const P = object.position;
        if (sphereObject.position.distanceTo(P) < radius) {
            rangeImages.add(object);
        }
    });
    paintRangeImages(rangeImages);
}

function saveSphereToInspectMode() {
    saveSphere(sphereObject.position, radius);
}

export {
    openSphericalImages,
    createSphere,
    cancelSphere,
    applySphericalRadius,
    setScene,
    saveSphereToInspectMode,
    paintRange,
    clearRangeImages,
};
