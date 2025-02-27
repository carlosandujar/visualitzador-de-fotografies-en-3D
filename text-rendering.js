// based on  https://threejs.org/examples/webgl_geometry_text.html
import * as THREE from "three";

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
     fontWeight = 'bold'; // regular bold

const depth = 0.2,
    size = 0.7,
    hover = 0,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5;

var font;

function genText(text, x, y, z) {
    //console.log('Loading font', text);
    const loader = new FontLoader();
    //console.log('Loading font2');
    const url = "fonts/optimer_regular.typeface.json";
    //const url = 'fonts/' + fontName + '_' + fontWeight + '.typeface.json'
    loader.load( url, function ( response ) {
        font = response;
        //console.log("Font loaded");
        //console.log('Creating text', text);
        return createText(text, x, y, z);
    } );
    //console.log('Loading font3');
}

function createText(text, x, y, z) {
    //console.log('Inside creating text', text);
    const materials = [
        new THREE.MeshPhongMaterial( { color: 0xff0000, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xff0000 } ) // side
    ];
    var textGeo = new TextGeometry(text, {
        font: font,
        size: size,
        depth: depth,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: true
    } );

    textGeo.computeBoundingBox();

    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    var textMesh1 = new THREE.Mesh( textGeo, materials );

    textMesh1.position.x = x + centerOffset;
    textMesh1.position.y = y + hover;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    scene.add( textMesh1 );
    return textMesh1;
}

export { genText };