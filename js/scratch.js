var context; 
var ctx;     
var dragImg;
var brush;
var erase = false;
var cvsNm = 'gameCvs';


function init() {
	canvas = document.getElementById('gameCvs');
	context = canvas.getContext('2d');
	ctx = document.getElementById('canvast').getContext('2d');

	onload();
	setKey();
};

function onload() {
	dragImg = new Image();
	dragImg.src = './img/scratch/bg_scratch_normal.png';

	$('#bgImg').css('display', 'none');
	$('#endPic').css('display', 'none');

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
		context.drawImage(brush, px - brush.width / 2, py - brush.height / 2); 
		context.restore();

		ctx.save();
		ctx.fillRect(px, py, 50, 50);
		ctx.restore();
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
		canvasX = event.pageX - totalOffsetX;  // canvasX 순 영역 구하기 : event.pageX(브라우저 좌측에서 마우스 선택된 값) -  totalOffsetX (브라우저 좌측에서부터 canvas 영역까지의 좌표)
		canvasY = event.pageY - totalOffsetY;
	} else {
		canvasX = event.changedTouches[0].pageX - totalOffsetX;
		canvasY = event.changedTouches[0].pageY - totalOffsetY;
	};
	
	if(event.pageX) {
		canvasX = ((584 * canvasX) / $('#' + cvsNm).outerWidth()) * ratioW;  
		canvasY = ((328 * canvasY) / $('#' + cvsNm).outerHeight()) * ratioH;
	} else {
		canvasX = ((584 * canvasX) / $('#' + cvsNm).outerWidth()) * ratioW;
		canvasY = ((328 * canvasY) / $('#' + cvsNm).outerHeight()) * ratioH;
	};

	return {
		x : canvasX,
		y : canvasY
	};
	
};

function ckCvs() {
	console.log('ckCvs실행');
	var canvas = document.getElementById('canvast');
	var hits = 0;
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	for(var i=0, ii=imageData.data.length; i < ii; i=i+4) {
		if(!(imageData.data[i] == 0 && imageData.data[i+1] == 0 && imageData.data[i+2] == 0 && imageData.data[i+3] == 0)) {
			hits++;
		};
	};

	var pixels = (canvas.width * canvas.height);

	if(parseInt((hits / pixels) * 100) > 40) {
		end();
	};
};

function end() {
	$('#endPic').css('display', 'block');
};

function resetCvs() {
	$('#canvast').css('display', 'none');
	$('#bgImg').css('display', 'block');

	context.save();
	context.drawImage(dragImg, 0, 0);
	context.globalCompositeOperation = 'destination-over';  
	context.restore();

	ctx.save();
	ctx.clearRect(0,0,584,328);
	ctx.restore();
};

function setKey() {
	document.getElementById('scratch_div').addEventListener('mousedown', function(event) {
		erase = true;
	}, false);
	document.getElementById('scratch_div').addEventListener('mousemove', moveFn, false);
	document.getElementById('scratch_div').addEventListener('mouseup', function(event) {
		erase = false;
		ckCvs();
	}, false);
};

init();
