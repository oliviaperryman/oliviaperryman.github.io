//prompt("Hello");

/**
*
*
*/

var word = '';
var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;


$(document).ready(function(){
	renderHeader();

});


function letterClick(e){
    if(e.innerText == 'L'){
        word = 'L';
    }
    else{
        word += e.innerText;
    }

    if(word == "LOVE"){
        console.log("I love you");
        renderHeart();
    }

}

function renderHeart(){
    animateHeader = false;
    heart = [];
    var p1 = {x: width/2, originX: width/2, y: height/3, originY: height/3};
    var p2 = {x: width*0.65, originX: width*0.65, y: height/5, originY: height/5};
    var p3 = {x: width*0.9, originX: width*0.9, y: height/3.5, originY: height/3.5};
    var p4 = {x: width*0.9, originX: width*0.9, y: height/2, originY: height/2};
    var p5 = {x: width*0.5, originX: width*0.5, y: height*0.8, originY: height*0.8};
    var p6 = {x: width*0.1, originX: width*0.1, y: height/2, originY: height/2};
    var p7 = {x: width*0.1, originX: width*0.1, y: height/3.5, originY: height/3.5};
    var p8 = {x: width*0.35, originX: width*0.35, y: height/5, originY: height/5};
    

    p1.closest = [p2];
    p2.closest = [p3];
    p3.closest = [p4];
    p4.closest = [p5];
    p5.closest = [p6];
    p6.closest = [p7];
    p7.closest = [p8];
    p8.closest = [p1];
    heart.push(p1);
    heart.push(p2);
    heart.push(p3);
    heart.push(p4);
    heart.push(p5);
    heart.push(p6);
    heart.push(p7);
    heart.push(p8);

    // assign a circle to each point
    for(var i in heart) {
        var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.5)');
        heart[i].circle = c;
    }

    ctx.clearRect(0,0,width,height);

    for(var i in heart) {
        heart[i].active = 0.2;
        heart[i].circle.active = 0.6;
        heart[i].circle.draw();
        TweenLite.to(heart[i], 1, {width:10, height:10});
        drawLines(heart[i]);
    }

}


function renderHeader(){
    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }


    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
            canvas.addEventListener('mousedown', mouseDown);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
    	count = 0;
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function mouseDown(e){
        animateHeader = !animateHeader;
        //canvas.hidden = !canvas.hidden;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 2+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }



    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
}

function Circle(pos,rad,color) {
    var _this = this;

    // constructor
    (function() {
        _this.pos = pos || null;
        _this.radius = rad || null;
        _this.color = color || null;
    })();

    this.draw = function() {
        if(!_this.active) return;
        ctx.beginPath();
        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(256,256,256,'+ _this.active+')';
        ctx.fill();
    };
}

// Canvas manipulation
function drawLines(p) {
    if(!p.active) return;
    for(var i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = 'rgba(256,256,256,'+ p.active+')';
        ctx.stroke();
    }
}