"use strict";

var height = window.innerHeight,
	width = window.innerWidth; 

var first = true;

window.onload = function() {
	$('svg path, svg rect').remove();
	var boxes = $('.drag');
	var connectedBoxes = [];

	boxes.each(function() {
		$(this).css({
			top: Math.round((Math.random()*(height-100))/25)*25,
			left: Math.round((Math.random()*(width-100))/25)*25
		});

		if (first){
			(new Draggabilly(this,{grid: [25,25]})).on('dragEnd', function(){
				$('svg path, svg rect').remove();
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

	if (posA.left > posB.left) {
		var posC = posB;
		posB = posA;
		posA =  posC;
	}


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

	var newLine = [startA, {
		y: posA.left + (bA.width() * (startA.y > startB.y ? 2 : 2)),
		x: startA.x
	}, {
		y: posB.left - 100,
		x: startB.x,
	}, startB] 
	var line = svg.append("path")
		.attr("d", lineFunction(newLine))
		.attr("stroke-width", 3)
		.attr("stroke", "orange");
}

var drawGrid = function(boxes){
	var vertical = [0, window.innerWidth];
	var horizontal = [0, window.innerHeight];

	var svg = d3.select("svg");

	var lineFunction = d3.svg.line()
		.x(function(d){return d.y;})
		.y(function(d){return d.x;})
		.interpolate("linear");

	var computedBoxes = [];

	boxes.each(function(){
		var jthis = $(this);
		var pos = jthis.position(),
			height = jthis.height(),
			width = jthis.width();

		horizontal.push(pos.top);
		horizontal.push(pos.top+height);
		vertical.push(pos.left);
		vertical.push(pos.left+width);

		computedBoxes.push({
			startX: pos.left,
			startY: pos.top,
			endX: pos.left+width,
			endY: pos.top+height,
			centerX: pos.left+width/2,
			centerY: pos.top+height/2
		});
	});

	var sortFunction = function(a,b) {
		return a - b;
	}

	var newVertical = [], last = null;
	vertical.sort(sortFunction).forEach(function(t) {
		if (t !== last) {
			for (var i = last + 50; i < t; i += 50) {
				newVertical.push(i);
			}
			newVertical.push(t);
			last = t;
		}
	});
	vertical = newVertical;

	var newHorizontal = [];
	last = null;
	horizontal.sort(sortFunction).forEach(function(t) {
		if (t !== last) {
			for (var i = last + 50; i < t; i += 50) {
				newHorizontal.push(i);
			}
			newHorizontal.push(t);
			last = t;
		}
	});

	horizontal = newHorizontal;

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
			.attr("stroke", "aqua");
	});

	console.log(vertical, horizontal);
	var grid = [], astarGrid = [];

	for (var i = 1, l = horizontal.length; i < l; ++i) {
		var row = [], astarRow = [];

		for (var ii = 1, ll = vertical.length; ii < ll; ++ii) {

			var startY = horizontal[i-1],
				startX = vertical[ii-1],
				endY = horizontal[i],
				endX = vertical[ii],
				centerX = (startX+endX)/2,
				centerY = (startY+endY)/2,
				score = 0;

			computedBoxes.forEach(function(boxe){
				// console.log(boxe.startX == startX, boxe.startY == startY,
						// boxe.endX == endX, boxe.endY == endY);
				// if (boxe.startX === startX)
				// console.log(boxe.startX, startX, boxe.endX, endX)
				// console.log(boxe.startY, startY, boxe.endY, endY)
				if (startX >= boxe.startX && startY >= boxe.startY &&
					endX <= boxe.endX && endY <= boxe.endY) {
					score += 5;
				} else {
					var distance = (centerX - boxe.centerX) * (centerX - boxe.centerX)
						+ (centerY - boxe.centerY) * (centerY - boxe.centerY);

					var c = 1/(distance/5000);
					if (c > 0.05)
						score += c*1.33;
				}
			});

			svg.append("rect")
				.attr("fill", score > 1 ? "red" : "blue")
				.attr("opacity", Math.min(0.3, score/5))
				.attr("x", startX)
				.attr("y", startY)
				.attr("width", endX-startX)
				.attr("height", endY-startY);

			row.push({
				startX: startX,
				startY: startY,
				endX: endX,
				endY: endY,
				score: score,
				centerX: (startX + endX)/2,
				centerY: (startY + endY)/2
			});

			astarRow.push((score+1));
		}
		grid.push(row);
		astarGrid.push(astarRow);
	}


	console.log(grid);

	var astarGraph = new Graph(astarGrid);
	var getCost = function(old) {
		if (!old.t) old.t = 1;
		if (old.x === this.x) {
			// console.log("VERTICAL");
			this.d = 1;
		} else if (old.y === this.y) {
			// console.log("HORIZONTAL");
			this.d = 2;
		}
		if (old.d !== this.d) {
			this.t = old.t + 1;
		} else {
			this.t = old.t;
		}
		return this.type * 10 + this.t;
	}
	astarGraph.nodes.forEach(function(n){
		n.getCost = getCost;
	});
	var search = astar.search(
		astarGraph,
		astarGraph.grid[0][0],
		astarGraph.grid[grid.length-3][grid[0].length-3],
		{
			heuristic: function(a,b){
				return 0;
				var cellA = grid[a.x][a.y],
					cellB = grid[b.x][b.y];
				// 	console.log(cellA, cellB)
				var d1 = Math.abs(cellB.centerX - cellA.centerX);
				var d2 = Math.abs(cellB.centerY - cellA.centerY);
				// // console.log(b.x, a.x);
				// if (b.x != a.x || b.y != a.y) {
				// 	d1 += 100;
				// }
				return d1 + d2;
			}
		});
	console.log(search);

	var lineFunction = d3.svg.line()
		.x(function(d){return d.x;})
		.y(function(d){return d.y;})
		.interpolate("linear");

	var lineData = [];

	search.unshift(astarGraph.grid[0][0]);
	search.forEach(function(t) {
		var cell = grid[t.x][t.y];
		svg.append("rect")
			.attr("fill", "green")
			.attr("opacity", 0.5)
			.attr("x", cell.startX)
			.attr("y", cell.startY)
			.attr("width", cell.endX-cell.startX)
			.attr("height", cell.endY-cell.startY);
		lineData.push({
			x: cell.centerX,
			y: cell.centerY
		})

	});

	console.log(lineData.length)
	lineData = simplify(lineData, 40);
	console.log(lineData.length)
	svg.append("path")
		.attr("d", lineFunction(lineData))
		.attr("stroke-width", 3)
		.attr("stroke", "green");
}