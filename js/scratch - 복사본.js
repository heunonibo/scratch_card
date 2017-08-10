var _pic = 0;
var cvsNm = 'gameCvs';
var erase = false;
var dragImg;
var brush;
var conC;
var context;

function init() {
	cvs = document.getElementById('gameCvs');
	conC = document.getElementById('canvast').getContext('2d');
	context = cvs.getContext('2d');

	setKey();
	onload();

};

function onload() {
	$('#canvast').css('display', 'none');
	$('#bgImg').css('display', 'none');
	$('#endPic').css('display', 'none');

	dragImg = new Image();
	dragImg.src = './img/scratch/bg_scratch_normal.png';

	$('#bgImg').attr('src' , 'img/scratch/giveaway/giveaway00.jpg');
	$('#endPic').attr('src' , 'img/scratch/giveaway/giveaway00.jpg');

	dragImg.onload = function() {
		brush = new Image();
		brush.src = './img/scratch/brush.png';
		brush.onload = function() {
			resetCvs();
		};
	};
};

function moveFn(event) {
	event.preventDefault();

	var mousePos = relMouseCoords(event);
	var px = mousePos.x;
	var py = mousePos.y;

	if(erase) {
		context.save();
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.drawImage(brush, px - brush.width / 2, py - brush.height / 2);
		context.fill();
		context.restore();

		conC.save();
		conC.fillRect(px, py, 50, 50);
		conC.restore();
	};

	ckCvs();

};

function relMouseCoords(event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = document.getElementById(cvsNm);

	var ratioW = 1;
	var ratioH = 1;

	do {
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	} while (currentElement = currentElement.offsetParent);

	if(event.pageX) {
		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;
	} else {
		canvasX = event.changedTouches[0].pageX - totalOffsetX;
		canvasY = event.changedTouches[0].pageY - totalOffsetY;
	};

	if(event.pageX) {
		canvasX = ((584 * canvasX) / $('#' + cvsNm).outerWidth()) * ratioW;
		canvasY = ((328 *canvasY) / $('#' + cvsNm).outerHeight()) * ratioH;
	} else {
		canvasX = ((584 * canvasX) / $('#' + cvsNm).outerWidth()) * ratioW;
		canvasY = ((328 *canvasY) / $('#' + cvsNm).outerHeight()) * ratioH;
	};

	return {x : canvasX, y : canvasY};

};

function ckCvs() {
	var canvas = document.getElementById('canvast');
	var hits = 0;
	var imageData = conC.getImageData(0, 0, canvas.width, canvas.height);

	for(var i=0, ii=imageData.data.length; i < ii; i=i+4) {
		if(!(imageData.data[i] == 0 && imageData.data[i+1] == 0 && imageData.data[i+2] == 0 && imageData.data[i+3] == 0)) {
			hits++;
		};
	};

	var pixels = (canvas.width * canvas.height);

	if(parseInt((hits / pixels) * 100) > 20) {
		end();
	};
};

function end() {
	$('#endPic').css('display', 'block');
};

function resetCvs() {
	$('#bgImg').css('display', 'block');

	context.save();
	context.globalCompositeOperation = 'source-over';
	context.drawImage(dragImg, 0, 0);
	context.globalCompositeOperation = 'destination-over';
	context.restore();

	conC.save();
	conC.clearRect(0,0,584,328);
	conC.restore();

};

function setKey() {
	document.getElementById('scratch_div').addEventListener('mousedown', function(event) {
		erase = true;
	}, false);
	document.getElementById('scratch_div').addEventListener('mouseup', function(event) {
		erase = false;
		//ckCvs();
	}, false);
	document.getElementById('scratch_div').addEventListener('mousemove', moveFn, false);
};

init();
