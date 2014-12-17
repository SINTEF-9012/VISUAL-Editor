console.log('\'Allo \'Allo!');

interact('.drag')
.draggable({
	max: Infinity,
	onmove: function (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        // target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
        // target.style.left = x+'px';
        // target.style.top = y+'px';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
	},
	snap: {
		targets: [
		// create a function that snaps to a grid
	     	interact.createSnapGrid({
		        x: 100, 
		        y: 100, 
		        range: 25
     		}),
     		function (x, y) {
     			console.log("j'aime les lapins mais les vaches aussi")
     			return {
     				x: 0,
     				y: 0,
     				range: 0
     			}
     		}
	    ],
	    /*relativePoints: [{
	    	x:0.5, y:0.5
	    }]*/
	}
  })

interact.maxInteractions(Infinity);