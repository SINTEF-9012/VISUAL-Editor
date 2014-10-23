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


	val = Math.pow(val, 1.42);
	var height = canard.height();
	var ratioHeight = (height+10)*(1-val)*-0.75;
	v = 'translate3d(0,'+ratioHeight+'px,0)'
		+' scale3d(' + val + ', ' + val + ', 1)';
	canard[0].style.transform = v;

	height = lapin.height();
	ratioHeight = (height+10)*(1-val)*0.75;
	v = 'translate3d(0,'+ratioHeight+'px,0)'
		+' scale3d(' + val + ', ' + val + ', 1)';
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
	}, 300);
}

$(document).click(function(e) {
	if (!e.target.classList.contains("visual-touchpoint") ||
		e.target.classList.contains("visual-touchpoint-template")) {
		hidePopover();
	}
	//if (!$(this).hasClass('visual-touchpoint')) {
	//}
});

var lastSelectedTouchpoint = null;

for (var i = 0,
	t = el.getElementsByClassName('visual-touchpoint'),
	l = t.length; i < l; ++i) {
	(function(e) {
		e.addEventListener('click', function(){
			if (closeDelay !== 0) {
				window.clearTimeout(closeDelay);
				closeDelay = 0;
			}

			lastSelectedTouchpoint = e;
			movePopover(e);
			//console.log("click");
		});
	})(t[i]);
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
});*/


var roger = null;


new Sortable(el, {
	group: "canard",
	draggable: '.visual-touchpoint',
	onUpdate: function(e) {
		hasBeenUpdated = true;
	},
	onStart: function(e) {
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

