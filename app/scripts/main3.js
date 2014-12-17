"use strict";

var height = window.innerHeight,
	width = window.innerWidth; 

var first = true;


window.onload = function() {
	$('svg path').remove();
	var boxes = $('.drag');
	var connectedBoxes = [];

	boxes.each(function() {
		$(this).css({
			top: Math.round((Math.random()*(height-100))/25)*25,
			left: Math.round((Math.random()*(width-100))/25)*25
		});

		if (first){
			(new Draggabilly(this,{grid: [25,25]})).on('dragEnd', function(){
				$('svg path').remove();
				drawGrid(boxes);
				connectBoxes(connectedBoxes);
			});
		}
	});

	first = false;

	for (var i = 0; i < 2+Math.round(Math.random()*4);) {
		var rA = Math.floor(Math.random()*boxes.length),
			rB = Math.floor(Math.random()*boxes.length);
		if (rA !== rB) {
			connectedBoxes.push({a: $(boxes[rA]), b: $(boxes[rB])});
			++i;
		}
	}

	drawGrid(boxes);
	connectBoxes(connectedBoxes);
};

var connectBoxes = function(list) {
	list.forEach(function(t){
		connect(t.a, t.b);
	})
}

var connect = function(bA, bB) {

	var posA = bA.position(),
		posB = bB.position();


	var startA = {
		x: posA.top + bA.width()/2,
		y: posA.left + bA.height()/2
	},
	startB = {
		x: posB.top + bB.width()/2,
		y: posB.left + bB.height()/2
	};

	var lineFunction = d3.svg.line()
		.x(function(d){return d.y;})
		.y(function(d){return d.x;})
		.interpolate("linear");

	var svg = d3.select("svg");
	var line = svg.append("path")
		.attr("d", lineFunction([startA, startB]))
		.attr("stroke-width", 3)
		.attr("stroke", "brown");
}

var drawGrid = function(boxes){
	return;
	var vertical = [0, window.innerWidth];
	var horizontal = [0, window.innerHeight];

	var svg = d3.select("svg");

	var lineFunction = d3.svg.line()
		.x(function(d){return d.y;})
		.y(function(d){return d.x;})
		.interpolate("linear");

	boxes.each(function(){
		var jthis = $(this);
		var pos = jthis.position(),
			height = jthis.height(),
			width = jthis.width();

		horizontal.push(pos.top);
		horizontal.push(pos.top+height);
		vertical.push(pos.left);
		vertical.push(pos.left+width);
	});

	vertical.sort();

	console.log(vertical);

	vertical.forEach(function(t){
		var line = svg.append("path")
			.attr("d", lineFunction([
				{x: 0, y: t}, {x: window.innerHeight, y:t}]))
			.attr("stroke", "aqua");
	});
	horizontal.forEach(function(t){
		var line = svg.append("path")
			.attr("d", lineFunction([
				{y: 0, x: t}, {y: window.innerWidth, x:t}]))
			.attr("stroke", "orange");
	});
}