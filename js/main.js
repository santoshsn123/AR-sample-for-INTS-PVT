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
  });

  patternA = new THREE.Group();
  patternA.name = "marker2";
  scene.add(patternA);
  new THREEx.ArMarkerControls(arToolkitContext, patternA, {
    type: "pattern",
    patternUrl: "data/pattern-letterA.patt",
  });

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
  smoothedRoot.add(mesh1);
}

function update() {
  // update artoolkit on every frame
  if (arToolkitSource.ready !== false) {
    arToolkitContext.update(arToolkitSource.domElement);
  }
  // additional code for smoothed controls
  if (patternA.visible) {
    mesh1.rotateX(0.115);
  }
  smoothedControls.update(markerRoot1);
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  deltaTime = clock.getDelta();
  totalTime += deltaTime;
  update();
  render();
}
