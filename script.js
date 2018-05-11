var p = new Pencil();

function Pencil() {
	var svg = createElement('svg');
	document.body.appendChild(svg);

	this.element = svg;
	this.path = null;
	this.points = [];

	this.fill = 'none';
    this.stroke = 'black';
    this.strokeWidth = '1';

	var self = this;
	this.root = window;
	this.root.addEventListener('mousedown', function(e) { self._onmousedown(e) });
	this.root.addEventListener('mousemove', function(e) { self._onmousemove(e) });
	this.root.addEventListener('mouseup', function(e) { self._onmouseup(e) });
}

Pencil.prototype._onmousedown = function(e) {
	var x = e.offsetX, y = e.offsetY;

	this.points = [[ x, y ]];
	this.path = createElement('path');
	this.path.setAttribute('fill', this.fill);
	this.path.setAttribute('stroke', this.stroke);
	this.path.setAttribute('stroke-width', this.strokeWidth);
    
    this._setPoints();

    this.element.appendChild(this.path);
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