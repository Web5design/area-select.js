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
        delay = 100,
        window = root
    ;

    function div(className) 
    {
        var d = document.createElement('div');
        if (className) d.className = className;
        return d;
    }
    
    function addEvent(el, event, handler)
    {
        // DOM standard
        if ( el.addEventListener ) 
            el.addEventListener(event, handler, false);
        
        // IE
        else if ( el.attachEvent ) 
            el.attachEvent('on'+event, handler);
    }
    
    function removeEvent(el, event, handler) 
    {
        // DOM standard
        if ( el.removeEventListener ) 
            el.removeEventListener(event, handler, false);
        
        // IE
        else if ( el.detachEvent )
            el.detachEvent ('on'+event, handler); 
    }
    
    // http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
    /*function triggerEvent(el, event) 
    {
        var e; // The custom event that will be created

        if ( document.createEvent ) 
        {
            e = document.createEvent("HTMLEvents");
            e.initEvent(event, true, true);
            e.eventName = event;
            el.dispatchEvent(e);
        } 
        else 
        {
            e = document.createEventObject();
            e.eventType = event;
            e.eventName = event;
            el.fireEvent("on" + e.eventType, e);
        }
    }*/
    
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
    
    // http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    /*function getOffset( el ) 
    {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) 
        {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }    
    
    function getRect( el ) 
    {
        return el.getBoundingClientRect();    
    }*/   
    
    var AreaSelect = function(el, options) {
        
        options = options || {};
        
        var self = this;
        
        this.setElement( el );
        
        this.selection = null;
        
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
            
            e = e || window.event;
            
            var el = self.el;
            // http://stackoverflow.com/questions/6773481/how-to-get-the-mouseevent-coordinates-for-an-element-that-has-css3-transform
            // http://www.quirksmode.org/js/events_properties.html#position
            // http://stackoverflow.com/questions/5755312/getting-mouse-position-relative-to-content-area-of-an-element
            //left = e.clientX + window.pageXOffset - rect.left;
            //top = e.clientY + window.pageYOffset - rect.top;
            
            var target = el, //e.target || e.srcElement,
                style = target.currentStyle || window.getComputedStyle(target, null),
                borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
                borderTopWidth = parseInt(style['borderTopWidth'], 10),
                rect = target.getBoundingClientRect()
            ;

            left = e.clientX - borderLeftWidth - rect.left;
            top = e.clientY - borderTopWidth - rect.top;
            
            if (left < 0) left = 0;
            else if (left > el.offsetWidth) left = el.offsetWidth;
            if (top < 0) top = 0;
            else if (top > el.offsetHeight) top = el.offsetHeight;
            
            w = 0;
            h = 0;
            
            cursor = el.style.cursor;
            el.style.cursor = area.style.cursor = 'se-resize';
            
            area.style.display = 'block';
            
            area.style.left = (el.offsetLeft - el.scrollLeft + left) + 'px';
            area.style.top = (el.offsetTop - el.scrollTop + top) + 'px';
            area.style.width = w + 'px';
            area.style.height = h + 'px';
            
            addEvent(el, 'mousemove', onElMouseMove);
            addEvent(el, 'mouseup', onElMouseUp);
            addEvent(area, 'mousemove', onElMouseMove);
            addEvent(area, 'mouseup', onElMouseUp);
            
            return false;
        };
        
        var onElMouseMove = function(e) {
            
            e = e || window.event;
            
            var el = self.el;
            var cursorX = 'e', cursorY = 's';
            
            //curLeft = e.clientX + window.pageXOffset - rect.left;
            //curTop = e.clientY + window.pageYOffset - rect.top;
            
            var target = el, //e.target || e.srcElement,
                style = target.currentStyle || window.getComputedStyle(target, null),
                borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
                borderTopWidth = parseInt(style['borderTopWidth'], 10),
                rect = target.getBoundingClientRect()
            ;

            curLeft = e.clientX - borderLeftWidth - rect.left;
            curTop = e.clientY - borderTopWidth - rect.top;
            
            if (curLeft < 0) curLeft = 0;
            else if (curLeft > el.offsetWidth) curLeft = el.offsetWidth;
            if (curTop < 0) curTop = 0;
            else if (curTop > el.offsetHeight) curTop = el.offsetHeight;
            
            if ( curLeft < left )
            {
                area.style.left = (el.offsetLeft - el.scrollLeft + curLeft) + 'px';
                w = left - curLeft;
                cursorX = 'w';
            }
            else
            {
                if ( curLeft == left )  cursorX = '';
                area.style.left = (el.offsetLeft - el.scrollLeft + left) + 'px';
                w = curLeft - left;
            }
            
            if ( curTop < top )
            {
                area.style.top = (el.offsetTop - el.scrollTop + curTop) + 'px';
                h = top - curTop;
                cursorY = 'n';
            }
            else
            {
                if ( curTop == top )  cursorY = '';
                area.style.top = (el.offsetTop - el.scrollTop + top) + 'px';
                h = curTop - top;
            }
            
            area.style.width = w + 'px';
            area.style.height = h + 'px';
            el.style.cursor = area.style.cursor = cursorY+cursorX+'-resize';
            
            return false;
        };
        
        var onElMouseUp = function(e) {
            
            e = e || window.event;
            
            self.selection = {
                x1: (curLeft < left) ? curLeft : left,
                y1: (curTop < top) ? curTop : top,
                x2: (curLeft > left) ? curLeft : left,
                y2: (curTop > top) ? curTop : top
            };
            left = top = curLeft = curTop = w = h = 0;
            
            self.el.style.cursor = cursor;
            area.style.cursor = 'auto';
            
            removeEvent(self.el, 'mousemove', onElMouseMove);
            removeEvent(self.el, 'mouseup', onElMouseUp);
            removeEvent(area, 'mousemove', onElMouseMove);
            removeEvent(area, 'mouseup', onElMouseUp);
            
            setTimeout(function(){
                
                if ( self.callback )
                    
                    self.callback.call( self, self.getSelection() );
            
            }, delay);
            
            return false;
        };
        /*
        var onThisMouseDown = function(e) {
            triggerEvent(self.el, 'mousedown');
            return false;
        };
        
        var onThisMouseMove = function(e) {
            triggerEvent(self.el, 'mousemove');
            return false;
        };
        
        var onThisMouseUp = function(e) {
            triggerEvent(self.el, 'mouseup');
            return false;
        };
        */
        if ( options.onSelection ) this.onSelection( options.onSelection );
        
        addEvent(self.el, 'mousedown', onElMouseDown);
        /*addEvent(area, 'mousedown', onThisMouseDown);
        addEvent(area, 'mousemove', onThisMouseMove);
        addEvent(area, 'mouseup', onThisMouseUp);*/
        addEvent(area, 'mousedown', onElMouseDown);
    };
    
    AreaSelect.prototype = {
        
        constructor : AreaSelect,
        
        el : null,
        container : null,
        //rect : null,
        domElement : null,
        selection : null,
        callback : null,
        
        setElement : function(el) {
            this.el = el;
            disableDrag(this.el);
            this.container = this.el.parentNode;
            //this.rect = getOffset( this.el );
            return this;
        },
        
        refresh : function() {
            this.container = this.el.parentNode;
            //this.rect = getOffset( this.el );
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
            return (sel) ? {
                x1: sel.x1, 
                y1: sel.y1,
                x2: sel.x2, 
                y2: sel.y2, 
                width: abs(sel.x2-sel.x1), 
                height: abs(sel.y2-sel.y1)
            } : null;
        },
        
        onSelection : function(callback) {
            this.callback = callback;
            return this;
        },
        
        deselect : function() {
            this.selection = null;
            return this.hideSelection();
        }
    };
    
    // export it
    root.AreaSelect = AreaSelect;
    
})(window);
