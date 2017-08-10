var context; // Canvas : #gameCvs
var ctx;     // Canvas : #canvast
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
	console.log('onload 실행');
	dragImg = new Image();
	dragImg.src = './img/scratch/bg_scratch_normal.png';

	//dragImg.crossOrigin = 'Anonymous';

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
		context.globalCompositeOperation = 'destination-out';  //기존 도형에서 새 도형과 겹치는 부분은 사라지고 겹치지 않는 부분만 남는다.
		context.drawImage(brush, px - brush.width / 2, py - brush.height / 2); // erase 가 true 일때 bragImg 와 brush 사이에서 겹치지 않는 부분만 남는다.
		context.restore();

		ctx.save();
		ctx.fillRect(px, py, 50, 50);
		ctx.restore();
	};

	ckCvs();
};

//Canvas 요소에서 Mouse 좌표 얻는 함수 : relMouseCoords()
function relMouseCoords(event) {
	var totalOffsetX = 0; //브라우저 좌측영역부터 currentElement 까지의 거리.
	var totalOffsetY = 0; //브라우저 상단영역부터 currentElement 까지의 거리
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = document.getElementById(cvsNm);
	var ratioW = 1;
	var ratioH = 1;

	do {
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	} while (currentElement = currentElement.offsetParent)
	/*
		offsetTop, offsetLeft : offsetParent 속성에 해당하는 Parent 개체에 대한 상대적인 개체의 x, y 좌표를 나타내는 속성.
		offsetParent : offsetParent 요소를 기준으로 offset 된 픽셀 수를 반환.
		               첫번째로 매칭되는 부모를 선택 (가장 가까운 위치에 있는 Position(Relative or Absoulte)를 가지고 있는 부모를 선택.)
	*/


	if(event.pageX) {
		canvasX = event.pageX - totalOffsetX;  // canvasX 순 영역 구하기 : event.pageX(브라우저 좌측에서 마우스 선택된 값) -  totalOffsetX (브라우저 좌측에서부터 canvas 영역까지의 좌표)
		canvasY = event.pageY - totalOffsetY;
	} else {
		canvasX = event.changedTouches[0].pageX - totalOffsetX;
		canvasY = event.changedTouches[0].pageY - totalOffsetY;
	};

	/*
		pageX : 브라우저 좌측에서부터 x좌표값 노출.
		pageY : 브라우저 상단에서부터 y좌표값 노출.
		changedTouches : changedTouches 속성에 배열 형태로 저장되며, 터치한 손가락에 개수에 따라 배열의 크기가 결정된다.
	*/

	// console.log(584 * canvasX);
	// console.log($('#' + cvsNm).outerWidth());

	console.log(canvasX);
	console.log(canvasY);

	if(event.pageX) {
		canvasX = ((584 * canvasX) / $('#' + cvsNm).outerWidth()) * ratioW;  // canvasX(캔버스순영역) 에서 584 를 곱하고, 화면 크기만큼 나눵. 왜???
		canvasY = ((328 * canvasY) / $('#' + cvsNm).outerHeight()) * ratioH;
	} else {
		canvasX = ((584 * canvasX) / $('#' + cvsNm).outerWidth()) * ratioW;
		canvasY = ((328 * canvasY) / $('#' + cvsNm).outerHeight()) * ratioH;
	}

	console.log(canvasX);
	console.log(canvasY);

	/*
	 $('#' + cvsNm).outerWidth() : cvsNm 엘리먼트의 크기.
		outerWidth(), outerHeight() : 엘리먼트의 너비 (margin 제외한 border, padding, scrollBar 포함);
	*/

	return {
		x : canvasX,
		y : canvasY
	};
};

// mousemove 후, mouseup 후에 ckCvs() 함수 실행 : 캔버스 영역를 픽셀화하여 이벤트 제어.
function ckCvs() {
	console.log('ckCvs실행');
	var canvas = document.getElementById('canvast');
	var hits = 0;
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	/*
		getImageData : 이미지의 래스터 데이터를 얻는다.
		               좌표와 폭 높이를 주면 이 영역의 이미지 정보를 가지는 ImageData 가 리턴된다.
									 ImageData 객체의 width, height 속성은 너비와 높이값을 가지며 data는 래스터 정보이다.
									 래스터정보는 한 점당 R, G, B, A 요소의 각각에 대해 4바이트씩 값을 가지며,
									 이런 픽셀 정보가 좌에서 우로, 위에서 아래로 나열된다.
									 이미지 자체는 2차원 픽셀 배열이지만, 래스터 데이터는 1차원 픽셀 배열이다.
									 래스터 정보는 캔버스의 출력물에 대한 사본을 뜬 것이며,
									 이후 화면과는 상관없이 독립적으로 조작할 수 있다.
									 개별 색상 요소의 값을 바꾸거나 교환할 수 있고 주변 픽셀값까지 고려하여 조작하기도 한다.
	*/
	for(var i=0, ii=imageData.data.length; i < ii; i=i+4) {
		if(!(imageData.data[i] == 0 && imageData.data[i+1] == 0 && imageData.data[i+2] == 0 && imageData.data[i+3] == 0)) {
			hits++;
		};
	};

	var pixels = (canvas.width * canvas.height);

	if(parseInt((hits / pixels) * 100) > 10) {
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
	context.globalCompositeOperation = 'destination-over';  //새 도형은 기존 도형 뒤에 그려짐.
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
