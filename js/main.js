var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext, smoothedControls;

var markerRoot1, patternA;

var mesh1;

initialize();
animate();

function initialize() {
  scene = new THREE.Scene();

  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  scene.add(ambientLight);

  camera = new THREE.Camera();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  renderer.setSize(640, 480);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();
  deltaTime = 0;
  totalTime = 0;

  ////////////////////////////////////////////////////////////
  // setup arToolkitSource
  ////////////////////////////////////////////////////////////

  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
  });

  function onResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
    }
  }

  arToolkitSource.init(function onReady() {
    onResize();
  });

  // handle resize event
  window.addEventListener("resize", function () {
    onResize();
  });

  ////////////////////////////////////////////////////////////
  // setup arToolkitContext
  ////////////////////////////////////////////////////////////

  // create atToolkitContext
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "data/camera_para.dat",
    detectionMode: "mono",
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  ////////////////////////////////////////////////////////////
  // Setup Markers
  ////////////////////////////////////////////////////////////

  markerRoot1 = new THREE.Group();
  scene.add(markerRoot1);

  new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
    type: "pattern",
    patternUrl: "data/hiro.patt",
    // patternUrl: "http://localhost:8081/uploaded-image/hiro.patt",
  });

  // patternA = new THREE.Group();
  // patternA.name = "marker2";
  // scene.add(patternA);
  // new THREEx.ArMarkerControls(arToolkitContext, patternA, {
  //   type: "pattern",
  //   patternUrl: "data/pattern-letterA.patt",
  // });

  // interpolates from last position to create smoother transitions when moving.
  // parameter lerp values near 0 are slow, near 1 are fast (instantaneous).
  let smoothedRoot = new THREE.Group();
  scene.add(smoothedRoot);
  smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
    lerpPosition: 0.8,
    lerpQuaternion: 0.8,
    lerpScale: 1,
  });

  let geometry1 = new THREE.CubeGeometry(1, 1, 1);
  let material1 = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });

  mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.position.y = 0.5;

  // markerRoot1.add( mesh1 );

  // smoothedRoot.add(mesh1);
  // scene.add(mesh1);



  //Text
  var loader = new THREE.FontLoader();
loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/gentilis_bold.typeface.json', function ( font ) {
    var textGeo = new THREE.TextGeometry( "Xiafen Gu", {
        font: font,
        size: 0.1, // font size
        height: 0.1, // how much extrusion (how thick / deep are the letters)
        curveSegments: 1,
    });
    textGeo.computeBoundingBox();
    var textMaterial = new THREE.MeshStandardMaterial( { color: 0xbf6f48 } );
    var mesh = new THREE.Mesh( textGeo, textMaterial );
    // mesh.position.x = -1;
    // mesh.position.y = 0;
    // mesh.position.z = -2;
    mesh.position.set(1.2,1,-1.6);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotation.x=-1.3;
    smoothedRoot.add( mesh );
});

//Plane
const PlaneGeometry = new THREE.PlaneGeometry( 1.5, 0.6, 20 );
const PlaneMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide,opacity:0.1,} );
const plane = new THREE.Mesh( PlaneGeometry, PlaneMaterial );
plane.position.set(1.8,1,-1.6);
plane.rotation.x = Math.PI / 2;
smoothedRoot.add( plane );


//Line
const linematerial = new THREE.LineBasicMaterial( { color: 0xffffff } );
const points = [];
points.push( new THREE.Vector3( 0, 0, 0 ) );
points.push( new THREE.Vector3( 1.2,1,-1.6 ) );
const linegeometry = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( linegeometry, linematerial );
smoothedRoot.add( line );


var texture = new THREE.TextureLoader().load( 'images/image1.png' );
var imgmaterial = new THREE.MeshPhongMaterial({map: texture, color: 0xFFFFFF});
imgmaterial.transparent = true
var plane1 = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.3333),imgmaterial);
plane1.position.set(3,0.1,0);
 plane1.rotation.x = 17;
smoothedRoot.add(plane1);

//Line
const linematerial1 = new THREE.LineBasicMaterial( { color: 0xffffff } );
const points1 = [];
points1.push( new THREE.Vector3( 0, 0, 0 ) );
points1.push( new THREE.Vector3( 3,0,0 ) );
const linegeometry1 = new THREE.BufferGeometry().setFromPoints( points1 );
const line1 = new THREE.Line( linegeometry1, linematerial1 );
smoothedRoot.add( line1 );
}
function update() {
  // update artoolkit on every frame
  if (arToolkitSource.ready !== false) {
    arToolkitContext.update(arToolkitSource.domElement);
  }
  smoothedControls.update(markerRoot1);
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  
  deltaTime = clock.getDelta();
  totalTime += deltaTime;
  update();
  render();
  requestAnimationFrame(animate);
}
