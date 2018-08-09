var settings = {
    tools: {
        active: 'brush',
        select: {},
        brush: {
            fill: 'red',
            fillOpacity: '0',
            stroke: 'red',
            strokeWidth: '1'
        }
    }
};

$('#' + settings.tools.active).addClass('active-tool');

$('#toolbar').draggable({
    handle: '.bar',
    containment: 'body',
    opacity: 0.5
});

$('.tool').click(function() {
    settings.tools.active = $(this).attr('id');
    $(this).addClass('active-tool').siblings().removeClass('active-tool');
});

function addListeners(evt) {
    var draggedElm, selectedElm, hoveredElm, offset, transform;
    var points, path;

    var svg = evt.target;
    svg.addEventListener('mousedown', mousedown);
    svg.addEventListener('mousemove', mousemove);
    svg.addEventListener('mouseup', mouseup);
    svg.addEventListener('mouseleave', mouseup);
    svg.addEventListener('mouseover', mouseover);
    svg.addEventListener('mouseout', mouseout);
    svg.addEventListener('touchstart', mousedown);
    svg.addEventListener('touchmove', mousemove);
    svg.addEventListener('touchend', mouseup);
    svg.addEventListener('touchleave', mouseup);
    svg.addEventListener('touchcancel', mouseup);

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        if (evt.touches) { e = evt.touches[0]; }
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function createElm(tag, attrs) {
        var elm = document.createElementNS('http://www.w3.org/2000/svg', tag);
        if (attrs) {
            elm = setElmAttr(elm, attrs);
        }
        return elm;
    }

    function setElmAttr(elm, attrs) {
        for (var i in attrs) {
            if (attrs.hasOwnProperty(i)) {
                elm.setAttribute(i, attrs[i]);
            }
        }
        return elm;
    }

    function setPoints() {
        path.setAttribute('d', 'M ' + points.join(' L '));
    }

    function mousedown(evt) {
        if (settings.tools.active === 'select') {
            if (evt.target.classList.contains('draggable')) {
                draggedElm = evt.target;
                offset = getMousePosition(evt);
                // make sure the first transform on the element is a translate transform
                var transforms = draggedElm.transform.baseVal;
                if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                    // create a transform that translates by (0, 0)
                    var translate = svg.createSVGTransform();
                    translate.setTranslate(0, 0);
                    draggedElm.transform.baseVal.insertItemBefore(translate, 0);
                }
                // get initial translation
                transform = transforms.getItem(0);
                offset.x -= transform.matrix.e;
                offset.y -= transform.matrix.f;
            }
        }
        if (settings.tools.active === 'brush') {
            // get the first x and y
            points = [
                [evt.offsetX, evt.offsetY]
            ];
            // create a path
            path = createElm('path', {
                'class': 'draggable',
                'fill': settings.tools.brush.fill,
                'fill-opacity': settings.tools.brush.fillOpacity,
                'stroke': settings.tools.brush.stroke,
                'stroke-width': settings.tools.brush.strokeWidth
            });
            setPoints();
            svg.appendChild(path);
        }
    }

    function mousemove(evt) {
        if (settings.tools.active === 'select') {
            if (draggedElm) {
                evt.preventDefault();
                var coord = getMousePosition(evt);
                transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
            }
        }
        if (settings.tools.active === 'brush') {
            // return if no path is being drawn
            if (!path) return;
            // get x and y
            var pt = [evt.offsetX, evt.offsetY];
            // push to points array
            points.push(pt);
            // add point to path
            setPoints();
        }
    }

    function mouseup(evt) {
        if (settings.tools.active === 'select') {
            if (evt.type !== 'mouseleave') {
                selectedElm = draggedElm;
            }
            draggedElm = null;
            console.log(selectedElm);
        }
        if (settings.tools.active === 'brush') {
            // return if no path is being drawn
            if (!path) return;
            points = [];
            path = null;
        }
    }

    function mouseover(evt) {
        // if (settings.tools.active === 'select') {
        //     if (evt.target.classList.contains('draggable')) {
        //         hoveredElm = evt.target;
        //         var bbox = hoveredElm.getBBox();
        //         $('#hover-box')
        //             .attr('visibility', 'visible')
        //             .attr('x', bbox.x)
        //             .attr('y', bbox.y)
        //             .attr('width', bbox.width)
        //             .attr('height', bbox.height);
        //     }
        // }
    }

    function mouseout(evt) {
        // if (settings.tools.active === 'select') {
        //     hoveredElm = null;
        //     $('#hover-box')
        //         .attr('visibility', 'hidden');
        // }
    }
}