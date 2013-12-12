/**
*  area-select.js
*  A simple js class to select rectabgular regions in DOM elements (image, canvas, video, etc..)
*
*  https://github.com/foo123/area-select.js
*
*  @author: Nikos M.  http://nikos-web-development.netai.net/
*
**/
//
// IN PROGRESS
//
(function(root, undef) {

    var abs = Math.abs,
        max = Math.max,
        min = Math.min,
        round = Math.round
    ;

    function div(className) {
        var d = document.createElement('div');
        if (className) d.className = className;
        return d;
    }

    var AreaSelect = function(el, options) {
        
        options = options || {};
        
        var self = this;
        
        this.setElement( el );
        
        this.domElement = div( options.className || 'img-area-select' );
        this.domElement.style.position = 'absolute';
        this.domElement.style.visibility = 'hidden';
        this.domElement.style.zIndex = 10;
        this.domElement.style.left = this.rect.left + 'px';
        this.domElement.style.top = this.rect.top + 'px';
        this.domElement.style.width = 0 + 'px';
        this.domElement.style.height = 0 + 'px';
        
        this.container.appendChild( this.domElement );
        
        this.selection = { x1: null, y1: null, x2: null, y2: null };
        
        
        /*var click = function(e) {
            console.log([e.clientX, e.clientY]);
            console.log([self.img.clientLeft, self.img.clientTop]);
            console.log([self.rect.left, self.rect.top]);
            console.log([self.img.scrollLeft, self.img.scrollTop]);
            console.log([e.clientX - self.rect.left - self.img.clientLeft + self.img.scrollLeft, e.clientY - self.rect.top - self.img.clientTop + self.img.scrollTop]);
        };*/
        
        //this.img.addEventListener('click', click, false);
        
        var onMouseDown = function(e) {
            // http://stackoverflow.com/questions/6773481/how-to-get-the-mouseevent-coordinates-for-an-element-that-has-css3-transform
            // http://www.quirksmode.org/js/events_properties.html#position
            // http://stackoverflow.com/questions/5755312/getting-mouse-position-relative-to-content-area-of-an-element
            self.selection.x1 = e.clientX - self.rect.left - self.el.clientLeft + self.el.scrollLeft;
            self.selection.y1 = e.clientY - self.rect.top - self.el.clientTop + self.el.scrollTop;
            
            self.domElement.style.visibility = 'visible';
            self.domElement.style.left = (self.el.offsetLeft + self.selection.x1) + 'px';
            self.domElement.style.top = (self.el.offsetTop + self.selection.y1) + 'px';
            self.domElement.style.width = 0 + 'px';
            self.domElement.style.height = 0 + 'px';
            
            self.el.addEventListener('mousemove', onMouseMove, false);
            self.el.addEventListener('mouseup', onMouseUp, false);
        };
        
        var onMouseMove = function(e) {
            self.selection.x2 = e.clientX - self.rect.left - self.el.clientLeft + self.el.scrollLeft;
            self.selection.y2 = e.clientY - self.rect.top - self.el.clientTop + self.el.scrollTop;
            
            self.domElement.style.width = (self.selection.x2 - self.selection.x1) + 'px';
            self.domElement.style.height = (self.selection.y2 - self.selection.y1) + 'px';
        };
        
        var onMouseUp = function(e) {
            self.el.removeEventListener('mousemove', onMouseMove);
            self.el.addEventListener('mouseup', onMouseUp);
            
            if ( self.callback )
            {
                self.callback.call( self, self.getSelection() );
            }
        };
        
        if (options.onSelection) this.onSelection( options.onSelection );
        
        this.el.addEventListener('mousedown', onMouseDown, false);
    };
    
    AreaSelect.prototype = {
        
        constructor : AreaSelect,
        
        el : null,
        container : null,
        rect : null,
        domElement : null,
        selection : null,
        callback : null,
        
        setElement : function(el) {
            this.el = el;
            this.container = this.el.parentNode;
            this.rect = this.el.getBoundingClientRect();
            return this;
        },
        
        showSelection : function() {
            this.domElement.style.visibility = 'visible';
            return this;
        },
        
        hideSelection : function() {
            this.domElement.style.visibility = 'hidden';
            return this;
        },
        
        getSelection : function() {
            var sel = this.selection;
            return {
                x1: sel.x1, 
                y1: sel.y1,
                x2: sel.x2, 
                y2: sel.y2, 
                width: abs(sel.x2-sel.x1), 
                height: abs(sel.y2-sel.y1)
            };
        },
        
        onSelection : function(callback) {
            this.callback = callback;
            return this;
        },
        
        deselect : function() {
            this.selection = {x1:null, y1:null, x2:null, y2:null};
            return this.hideSelection();
        }
    };
    
    // export it
    root.AreaSelect = AreaSelect;
    
})(window);
