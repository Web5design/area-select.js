/**
*  area-select.js
*  A simple js class to select rectabgular regions in DOM elements (image, canvas, video, etc..)
*
*  https://github.com/foo123/area-select.js
*
*  @author: Nikos M.  http://nikos-web-development.netai.net/
*
**/
(function(root, undef) {

    var abs = Math.abs,
        delay = 100
    ;

    function div(className) 
    {
        var d = document.createElement('div');
        if (className) d.className = className;
        return d;
    }
    
    // http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
    function triggerEvent(el, eventType) 
    {
        var event; // The custom event that will be created

        if (document.createEvent) 
        {
            event = document.createEvent("HTMLEvents");
            event.initEvent(eventType, true, true);
        } 
        else 
        {
            event = document.createEventObject();
            event.eventType = eventType;
        }

        event.eventName = eventType;

        if (document.createEvent) 
        {
            el.dispatchEvent(event);
        } 
        else 
        {
            el.fireEvent("on" + event.eventType, event);
        }
    }
    
    // http://stackoverflow.com/questions/704564/disable-drag-and-drop-on-html-elements
    // http://developer.nokia.com/Community/Wiki/How_to_disable_dragging_of_images_and_text_selection_in_web_pages
    function disableDrag(el) 
    {
        // this works for FireFox and WebKit in future according to http://help.dottoro.com/lhqsqbtn.php
        el.draggable = false;
        // this works for older web layout engines
        el.onmousedown = function(e) {
            e.preventDefault();
            return false;
        };
    }
    
    var AreaSelect = function(el, options) {
        
        options = options || {};
        
        var self = this;
        
        // http://stackoverflow.com/questions/704564/disable-drag-and-drop-on-html-elements
        this.setElement( el );
        
        this.selection = { x1: null, y1: null, x2: null, y2: null };
        
        var area = this.domElement = div( options.className || 'img-area-select' );
        area.style.position = 'absolute';
        area.style.display = 'none';
        // if supported in the browser
        // http://caniuse.com/#feat=pointer-events
        // http://stackoverflow.com/questions/1009753/pass-mouse-events-through-absolutely-positioned-element
        //area.style.pointerEvents = 'none';
        area.style.zIndex = options.zIndex || 100;
        area.style.left = 0 + 'px';
        area.style.top = 0 + 'px';
        area.style.width = 0 + 'px';
        area.style.height = 0 + 'px';
        
        this.container.appendChild( area );
        
        
        var w = 0, h = 0, left = 0, top = 0, curLeft = 0, curTop = 0, cursor;
        
        var onElMouseDown = function(e) {
            
            // http://stackoverflow.com/questions/6773481/how-to-get-the-mouseevent-coordinates-for-an-element-that-has-css3-transform
            // http://www.quirksmode.org/js/events_properties.html#position
            // http://stackoverflow.com/questions/5755312/getting-mouse-position-relative-to-content-area-of-an-element
            left = e.clientX - self.rect.left - self.el.clientLeft + self.el.scrollLeft;
            top = e.clientY - self.rect.top - self.el.clientTop + self.el.scrollTop;
            w = 0;
            h = 0;
            
            cursor = self.el.style.cursor || 'auto';
            self.el.style.cursor = area.style.cursor = 'se-resize';
            
            area.style.display = 'block';
            
            area.style.left = (self.el.offsetLeft + left) + 'px';
            area.style.top = (self.el.offsetTop + top) + 'px';
            area.style.width = w + 'px';
            area.style.height = h + 'px';
            
            self.el.addEventListener('mousemove', onElMouseMove, false);
            self.el.addEventListener('mouseup', onElMouseUp, false);
            
            return false;
        };
        
        var onElMouseMove = function(e) {
            
            var cursorX = 'e', cursorY = 's';
            curLeft = e.clientX - self.rect.left - self.el.clientLeft + self.el.scrollLeft;
            curTop = e.clientY - self.rect.top - self.el.clientTop + self.el.scrollTop;
            
            if (curLeft < left)
            {
                w = left - curLeft;
                area.style.left = (self.el.offsetLeft + curLeft) + 'px';
                cursorX = 'w';
            }
            else
            {
                if (curLeft == left)
                    cursorX = '';
                w = curLeft - left;
            }
            if (curTop < top)
            {
                h = top - curTop;
                area.style.top = (self.el.offsetTop + curTop) + 'px';
                cursorY = 'n';
            }
            else
            {
                if (curTop == top)
                    cursorY = '';
                h = curTop - top;
            }
            
            area.style.width = w + 'px';
            area.style.height = h + 'px';
            self.el.style.cursor = area.style.cursor = cursorY+cursorX+'-resize';
            
            return false;
        };
        
        var onElMouseUp = function(e) {
            
            self.selection = {
                x1: (curLeft < left) ? curLeft : left,
                y1: (curTop < top) ? curTop : top,
                x2: (curLeft > left) ? curLeft : left,
                y2: (curTop > top) ? curTop : top
            };
            left = top = curLeft = curTop = w = h = 0;
            
            self.el.style.cursor = cursor;
            area.style.cursor = 'auto';
            
            self.el.removeEventListener('mousemove', onElMouseMove);
            self.el.removeEventListener('mouseup', onElMouseUp);
            
            setTimeout(function(){
                
                if ( self.callback )
                    
                    self.callback.call( self, self.getSelection() );
            
            }, delay);
            
            return false;
        };
        
        var onThisMouseDown = function(e) {
            triggerEvent(self.el, 'mousedown');
            return false;
        };
        
        var onThisMouseUp = function(e) {
            triggerEvent(self.el, 'mouseup');
            return false;
        };
        
        if ( options.onSelection ) this.onSelection( options.onSelection );
        
        this.el.addEventListener('mousedown', onElMouseDown, false);
        area.addEventListener('mousedown', onThisMouseDown, false);
        area.addEventListener('mouseup', onThisMouseUp, false);
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
            disableDrag(this.el);
            this.container = this.el.parentNode;
            this.rect = this.el.getBoundingClientRect();
            return this;
        },
        
        refresh : function() {
            this.container = this.el.parentNode;
            this.rect = this.el.getBoundingClientRect();
            return this;
        },
        
        showSelection : function() {
            this.domElement.style.display = 'block';
            return this;
        },
        
        hideSelection : function() {
            this.domElement.style.display = 'none';
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
