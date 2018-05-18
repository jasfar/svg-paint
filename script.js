var p = new Pencil();

function Pencil() {
	var svg = createElement('svg');
	svg.setAttributeNS(null, 'width', window.innerWidth);
	svg.setAttributeNS(null, 'height', window.innerHeight);
	document.body.appendChild(svg);

	this.svg = svg;
	this.a = null;
	this.path = null;
	this.points = [];

	this.fill = 'none';
	this.stroke = 'black';
	this.strokeWidth = '1';

	var self = this;
	window.addEventListener('resize', function() { self._onresize() });
	window.addEventListener('mousedown', function(e) { self._onmousedown(e) });
	window.addEventListener('mousemove', function(e) { self._onmousemove(e) });
	window.addEventListener('mouseup', function(e) { self._onmouseup(e) });
}

Pencil.prototype._onresize = function() {
	this.svg.setAttributeNS(null, 'width', window.innerWidth);
	this.svg.setAttributeNS(null, 'height', window.innerHeight);
};

Pencil.prototype._onmousedown = function(e) {
	var x = e.offsetX, y = e.offsetY;

	this.a = createElement('a');
	this.a.setAttribute('href', 'https://www.google.com/');
	this.svg.appendChild(this.a);

	this.points = [[ x, y ]];
	this.path = createElement('path');
	this.path.setAttribute('fill', this.fill);
	this.path.setAttribute('stroke', this.stroke);
	this.path.setAttribute('stroke-width', this.strokeWidth);

	this._setPoints();

	this.a.appendChild(this.path);
};

Pencil.prototype._onmousemove = function(e) {
	if (!this.path) return;

	var pt = [ e.offsetX, e.offsetY ];
	this.points.push(pt);
	this._setPoints();
};

Pencil.prototype._onmouseup = function(e) {
	if (!this.path) return;

	this.points = [];
	this.path = null;
};

Pencil.prototype._setPoints = function() {
	this.path.setAttribute('d', 'M ' + this.points.join(' L '));
};

function createElement(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}