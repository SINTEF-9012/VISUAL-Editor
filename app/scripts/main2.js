console.log('\'Allo \'Allo!');





var scene, camera, renderer;
var geometry, material, mesh;
var targetRotation = 0.0, targetRotationOnMouseDown = 0.0;
var postprocessing = {};

var clock = new THREE.Clock();
var controls;

init();
animate();

function init() {

    scene = new THREE.Scene();

    var width = window.innerWidth,
    	height = window.innerHeight;
    // camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0, 1000);//window.innerWidth / window.innerHeight, 1, 10000 );
    //camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0, 1000);//window.innerWidth / window.innerHeight, 1, 10000 );
    camera = new THREE.PerspectiveCamera(70, width/height, 1, 1000);
    // camera.position.z = 400;
    camera.position.y = 400;
    camera.position.z = 100;
    camera.rotation.x = -Math.PI/2+0.2;
    // camera.rotation.y = 0.1;

    controls = new THREE.FlyControls(camera);
    controls.movementSpeed = 100;
    // controls.domElement = document.body;
    // controls.rollSpeed = Math.PI/24;
    // controls.autoForward = false;
    // controls.dragToLook = false;
    // controls.dragT

    geometry = new THREE.BoxGeometry( 100, 100, 100 );
    /*geometry = new THREE.TextGeometry("VISUAL", {
    	size: 16,
    	font: "Arial"
    });*/
    //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    material = new THREE.MeshPhongMaterial( {
    	color: 0xaa0000,
    	ambiant: 0xaa0000,
    	specular: 0xaa00000,
    	//perPixel: true,
    	vertexColors: THREE.FaceColors,
    	//combine: THREE.MixOperation,
    	reflectivity: 0.05,
	     wireframe: false}
	);
    material2 = new THREE.MeshPhongMaterial( {
    	color: 0x0000aa,
    	ambiant: 0x0000aa,
    	specular: 0x0000aa,
    	//perPixel: true,
    	vertexColors: THREE.FaceColors,
    	//combine: THREE.MixOperation,
    	reflectivity: 0.05,
	     wireframe: false}
	);

    //material.emissive.setHSV(0, 0, 0.35);
    mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
    scene.add( mesh );

    ground = new THREE.PlaneBufferGeometry(4000, 4000);
    meshGround = new THREE.Mesh(ground, new THREE.MeshBasicMaterial({
    	color: 0xffffff,
    	opacity: 1,
    	reflectivity: 1.06
    	//transparent:true
    }));
    meshGround.rotation.x = -Math.PI/2;
    meshGround.position.y = -50;
    ground.doubleSided = true;
    meshGround.receiveShadow = true;
    //meshGround.castShadow = true;
    scene.add(meshGround);

    // LIGHTS

	var ambient = new THREE.AmbientLight( 0x111111);
	scene.add( ambient );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
	directionalLight.position.set( -0.6, 1, -0.5 ).normalize();
	directionalLight.castShadow = true;
	// directionalLight.shadowCameraNear = 0.1;
	// directionalLight.shadowCameraFar = 50;
	directionalLight.shadowDarkness = 0.5;
	directionalLight.shadowMapWidth = 128;
	directionalLight.shadowMapHeight = 128;

	/*var d = 15;
	directionalLight.shadowCameraLeft = -d * 2;
	directionalLight.shadowCameraRight = d * 2;
	directionalLight.shadowCameraTop = d;
	directionalLight.shadowCameraBottom = -d;*/
	scene.add( directionalLight );
	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
	directionalLight.position.set( -0.5, 0.5, -0.2 ).normalize();
	directionalLight.castShadow = true;
	directionalLight.shadowDarkness = 0.2;
	directionalLight.shadowMapWidth = 128;
	directionalLight.shadowMapHeight = 128;
	scene.add( directionalLight );

	// directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	// directionalLight.position.set( -2, 1.2, -10 ).normalize();
	// scene.add( directionalLight );

	pointLight = new THREE.PointLight( 0xffaa00, 2 );
	pointLight.position.set( 1,-4,1).normalize();
	//pointLight.castShadow = true;
	pointLight.shadowDarkness = 0.25;
	pointLight.shadowCameraVisible = true;
	scene.add( pointLight );

	scene.fog = new THREE.Fog( 0x000000, 10, 3000 );

    renderer = new THREE.WebGLRenderer({
    	antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( scene.fog.color, 1 );
    renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.physicallyBasedShading = true;
	renderer.autoClear = false;

	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft  = true;

	// postprocessing
				
	//composer = new THREE.EffectComposer( renderer );
	//composer.addPass( new THREE.RenderPass( scene, camera ) );

	/*depthTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
	
	var effect = new THREE.ShaderPass( THREE.SSAOShader );
	effect.uniforms[ 'tDepth' ].value = depthTarget;
	effect.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
	effect.uniforms[ 'cameraNear' ].value = camera.near;
	effect.uniforms[ 'cameraFar' ].value = camera.far;
	effect.renderToScreen = true;
	composer.addPass( effect );*/
				

    document.body.appendChild( renderer.domElement );

    /*function onDocumentMouseDown( event ) {

		event.preventDefault();

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mouseout', onDocumentMouseUp, false );

		mouseXOnMouseDown = event.clientX - window.innerWidth/2;
		targetRotationOnMouseDown = targetRotation;

	}

	function onDocumentMouseMove( event ) {

		mouseX = event.clientX - window.innerWidth/2;

		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

	}

	function onDocumentMouseUp( event ) {

		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		document.removeEventListener( 'mouseout', onDocumentMouseUp, false );

	}

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );*/

	/*var renderPass = new THREE.RenderPass( scene, camera );

	var bokehPass = new THREE.BokehPass( scene, camera, {
		focus: 		0.7,
		aperture:	0.085,
		maxblur:	1.0,

		width: width,
		height: height
	} );

	bokehPass.renderToScreen = true;

	var composer = new THREE.EffectComposer( renderer );

	composer.addPass( renderPass );
	composer.addPass( bokehPass );

	postprocessing.composer = composer;
	postprocessing.bokeh = bokehPass;*/
}

function animate() {

    requestAnimationFrame( animate, renderer.domElement);

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y = targetRotation;
    //camera.position.z = targetRotation*100;
    //camera.rotation.z = targetRotation/2;

	//camera.lookAt({x:0, y:0, z:0})
    // postprocessing.composer.render( 0.1 );

    controls.update(clock.getDelta());
    renderer.render( scene, camera );

}









/*
window.createSpring = function createSpring(springSystem, friction, tension, rawValues) {
	var spring = springSystem.createSpring();
	var springConfig;
	if (rawValues) {
		springConfig = new rebound.SpringConfig(friction, tension);
	} else {
		springConfig = rebound.SpringConfig.fromOrigamiTensionAndFriction(friction, tension);
	}
	spring.setSpringConfig(springConfig);
	spring.setCurrentValue(0);
	return spring;
}
var springSystem = new rebound.SpringSystem();
var spring = createSpring(springSystem, 40, 3);

window.mapValueFromRangeToRange = function(value, fromLow, fromHigh, toLow, toHigh) {
	fromRangeSize = fromHigh - fromLow;
	toRangeSize = toHigh - toLow;
	valueScale = (value - fromLow) / fromRangeSize;
	return toLow + (valueScale * toRangeSize);
}

window.scale = function scale(el, val) {
	//if (!el) return;

	v = 'translate3d(0,0,0)';
	if (val > 0.99 && val < 1.01) {
	} else {
		v += ' scale3d(' + val + ', ' + val + ', 1)';
	}

	if (el.style.transform == v) return;

	el.style.mozTransform =
	el.style.msTransform =
	el.style.webkitTransform =
	el.style.transform = v;

	//canard[0].style.transform = v;
	//lapin[0].style.transform = v;
	if (val > 0.99 && val < 1.01) {
		canard[0].style.transform = 'translate3d(0,0,0)';
		lapin[0].style.transform = 'translate3d(0,0,0)';
		return;
	}


	var pval = val;//Math.pow(val, 1.42);
	var height = canard.outerHeight()+10;

	var touchPointGeorge = touchpointHeight * (1-val) * 0.5;

	// console.log(touchPointGeorge)

	var ratioHeight = (height+10)*(1-val)*-0.5 - touchPointGeorge;
	v = 'translate3d(0,'+ratioHeight+'px,0)'
		+' scale3d(' + pval + ', ' + pval + ', 1)';
	canard[0].style.transform = v;

	height = lapin.outerHeight()+10;
	ratioHeight = (height)*(1-val)*0.5 + touchPointGeorge;
	v = 'translate3d(0,'+ratioHeight+'px,0)'
		+' scale3d(' + pval + ', ' + pval + ', 1)';
	lapin[0].style.transform = v;
}

function trimSpace(element) {
 for (var i = 0; i < element.childNodes.length; i++) {
   var node = element.childNodes[i];
   if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
     element.removeChild(node);
 }
}

var item = null, secondItem = null;

spring.setCurrentValue(-1);
spring.addListener({
	el: null,
	onSpringUpdate: function(spring) {
		if (!item) return;
		var val = spring.getCurrentValue();
		val = mapValueFromRangeToRange(val, 0, -1, 1, 0.5);
		scale(item, val);
		if (secondItem != null) {
			scale(secondItem, val);
		}
	}
});


var el = document.getElementById('main-touchpoints');

trimSpace(el);

var closeDelay = 0;

var lapin = $('.popover:first'),
	canard = $('.popover:last');

var uselessTouchpoint = $('.visual-touchpoint:first');
var touchpointWidth = uselessTouchpoint.outerWidth(),
	touchpointHeight = uselessTouchpoint.outerHeight();

var hidePopoverTimeout =0;

function movePopover(e) {
	if (hidePopoverTimeout) {
		window.clearTimeout(hidePopoverTimeout);
		hidePopoverTimeout = 0;
	}

	var val = spring.getCurrentValue();
	val = mapValueFromRangeToRange(val, 0, -1, 1, 0.5);

	// scalePopover = false;
	if (val != 1.0) {
		scale(e, 1.0);
	}
	var r = $(e);
	var o = r.offset();

	lapin.show();
	canard.show();

	lapin.offset({
		top: o.top-lapin.outerHeight()-10,
		left: o.left+touchpointWidth/2-lapin.outerWidth()/2
	});
	canard.offset({
		top: o.top+touchpointHeight+10,
		left: o.left+touchpointWidth/2-canard.outerWidth()/2
	})


	lapin.addClass('in');
	canard.addClass('in');
	// scalePopover = true;
	if (val != 1.0) {
		scale(e, val);
	}
}

function hidePopover() {
	//console.log("hide");
	lapin.removeClass('in');
	canard.removeClass('in');
	hidePopoverTimeout = window.setTimeout(function() {
		lapin.hide();
		canard.hide();
		lastSelectedTouchpoint = null;// todo soir
	}, 300);
}

$(document).click(function(e) {
	if ((!e.target.classList.contains("visual-touchpoint") ||
		e.target.classList.contains("visual-touchpoint-template")) && e.target.tagName != 'BUTTON') {
		hidePopover();
	}
	//if (!$(this).hasClass('visual-touchpoint')) {
	//}
});

var lastSelectedTouchpoint = null;

function addTouchpointListeners(touchpoint) {
	touchpoint.addEventListener('click', function(e){
		if (e.target.tagName === "TEXTAREA") {
			return;
		}
		if (closeDelay !== 0) {
			window.clearTimeout(closeDelay);
			closeDelay = 0;
		}

		lastSelectedTouchpoint = touchpoint;
		movePopover(touchpoint);
		//console.log("click");
	});
};

for (var i = 0,
	t = el.getElementsByClassName('visual-touchpoint'),
	l = t.length; i < l; ++i) {
		addTouchpointListeners(t[i]);
}

$(window).resize(function() {
	if (lastSelectedTouchpoint) {
		movePopover(lastSelectedTouchpoint);
	}
});


/*$(el).children('.visual-touchpoint').popover({
	content:'canard2',
	title: 'lapin',
	animation:true,
	placement: 'top',
	container: 'body'
});*-/


var roger = null;


new Sortable(el, {
	group: "canard",
	draggable: '.visual-touchpoint',
	filter: "textarea",
	onAdd: function(e) {
		console.log("aaad?", e.item);
		e.item.classList.remove('visual-touchpoint-template');
		addTouchpointListeners(e.item);
	},
	onUpdate: function(e) {
		hasBeenUpdated = true;
	},
	onStart: function(e) {
		console.log("start");
		if (e.item !== item && item) {
			scale(item, 1.0);
		}
		item = null;
		secondItem = null;
		//spring.setCurrentValue(-1);
		spring.setEndValue(-1);
		//console.log("start");
		$('.visual-touchpoint').not(e.item).popover('hide'); 
		closeDelay = window.setTimeout(function() {
			//$(e.item).popover('hide');
			lapin.removeClass('in');
			canard.removeClass('in');
			closeDelay = 0;
		}, 100);
		roger.options.group = "laaaaaapin";
	},
	onEnd: function(e) {
		console.log("end");
		item = e.item;
		spring.setEndValue(0);
		roger.options.group = "canard";
	}
});


var parentTool = null;

roger = new Sortable(document.getElementsByClassName("tool")[0], {
	group: "canard",
	onAdd: function(e) {
		console.log("AAAAAD", e.item);
	},
	onRemove: function(e) {
		console.log("REMOVEEEE", e.item);
		var item = e.item.cloneNode(true);
		parentTool.appendChild(item);
		secondItem = item; 
	},
	onStart: function(e) {
		if (e.item !== item && item) {
			scale(item, 1.0);
		}
		item = null;
		secondItem = null;
		parentTool = e.item.parentNode;
		hidePopover();
		//$('.visual-touchpoint').popover('hide'); 
		//spring.setCurrentValue(-1);
		spring.setEndValue(-1);
	},
	onEnd: function(e) {
		item = e.item;
		spring.setEndValue(0);
	}
});

$('button.popover-btn').click(function() {
	if (!item) {
		console.log("todo see");
		return;
	}

	var t = document.getElementsByClassName('visual-touchpoint-template');

	if (this.classList.contains("popover-actor-btn")) {
		item.style.borderColor = this.style.backgroundColor;
		if (t.length) {
			t[0].style.borderColor = this.style.backgroundColor; 
		}
		return;	
	}

	item.className = this.firstChild.className;

	if (t.length) {
		t[0].className = item.className + " visual-touchpoint-template";
	}
});*/