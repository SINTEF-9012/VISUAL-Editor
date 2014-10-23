console.log('\'Allo \'Allo!');

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
	v = 'translate3d(0,0,0)';
	if (val > 0.99 && val < 1.01) {
	} else {
		v += ' scale3d(' + val + ', ' + val + ', 1)';
	}
	el.style.mozTransform =
	el.style.msTransform =
	el.style.webkitTransform =
	el.style.transform = v;
}

function trimSpace(element) {
 for (var i = 0; i < element.childNodes.length; i++) {
   var node = element.childNodes[i];
   if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
     element.removeChild(node);
 }
}

var item = null, secondItem = null;

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


var roger = null;

new Sortable(el, {
	group: "canard",
	draggable: '.visual-touchpoint',
	onStart: function(e) {
		item = null;
		secondItem = null;
		//spring.setCurrentValue(-1);
		spring.setEndValue(-1);
		roger.options.group = "laaaaaapin";
	},
	onEnd: function(e) {
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
		item = null;
		secondItem = null;
		parentTool = e.item.parentNode;
		//spring.setCurrentValue(-1);
		spring.setEndValue(-1);
	},
	onEnd: function(e) {
		item = e.item;
		spring.setEndValue(0);
	}
});

