var Scroll = {
    lastSectionNumber: null,
    currentBlock: 0,
    latency: 1100,
    lastEventTime: 0,
    mousewheel: (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel",
    scrollHeight: null,
    navPoints: null,

    touchStart: null,
    firstMove: null,

    applyCss: function() {
        this.triggerEvent('applyCss.BEFORE', {'slideIndex': Scroll.currentBlock});
        var translateY = 'translateY( -' + Scroll.scrollHeight * Scroll.currentBlock + 'px )';

        jQuery('#container').css({
            '-webkit-transform': translateY,
            '-moz-transform': translateY,
            '-ms-transform': translateY,
            'transform': translateY
        });

        jQuery('nav .active').removeClass('active');
        var a = Scroll.navPoints.get(Scroll.currentBlock);
        jQuery(a).addClass('active');
        this.triggerEvent('applyCss.AFTER', {'slideIndex': Scroll.currentBlock});
    },

    scroll: function(event, direction) {
        if ( direction < 0 ) { // down
            Scroll.currentBlock = ( Scroll.currentBlock == Scroll.lastSectionNumber ) ? Scroll.lastSectionNumber : Scroll.currentBlock + 1;
        } else { // up
            Scroll.currentBlock = ( Scroll.currentBlock == 0 ) ? 0 : Scroll.currentBlock - 1;
        }

        Scroll.applyCss();
        return false;
    },

    scrollToSlide: function(slideIndex) {
        Scroll.currentBlock = slideIndex;
        Scroll.applyCss();
    },

    setup: function() {
        var sections = jQuery('.section');

        sections.each(function() {
            jQuery('nav ul').append('<li><a slide="' + jQuery(this).attr('id') 
                                        + '" href="#"><span></span></a></li>');
        }); 
        Scroll.navPoints = jQuery('nav ul li a');

        Scroll.lastSectionNumber = sections.length - 1;
        Scroll.scrollHeight = sections.height();

        Scroll.navPoints.first().addClass('active');
        Scroll.navPoints.click(function() {
            Scroll.scrollToSlide( Scroll.navPoints.index(jQuery(this)) );
        });
    },
    listeners : {},
    addEventListener : function(eventType, callback) {
        if ( ! this.listeners.hasOwnProperty(eventType) ) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    },
    removeEventListener : function(eventType, callback) {
        var i;
        if ( this.listeners.hasOwnProperty(eventType) ) {
            for (i = 0; i < this.listeners[eventType].length; i++) {
                if (this.listeners[eventType][i] === callback) {
                    this.listeners[eventType].splice(i, 1);
                }
            }
        }
    },
    triggerEvent : function(eventType, args) {
        if ( this.listeners.hasOwnProperty(eventType) ) {
            var i, listeners = this.listeners[eventType];
            for (i = 0; i < listeners.length; i++) {
                listeners[i](args);
            }
        }
    }
}

jQuery(window).load(function(event) {
    Scroll.setup();

    jQuery(window).on(Scroll.mousewheel, function(event) {
        var direction = (Scroll.mousewheel == "DOMMouseScroll") ? -event.originalEvent.detail 
                                                          : event.originalEvent.wheelDelta;
        event.stopPropagation();
        event.preventDefault();
        if ( event.timeStamp - Scroll.lastEventTime < Scroll.latency ) {
            return false;
        }
        Scroll.lastEventTime = event.timeStamp;

        return Scroll.scroll(event, direction);
    });

    jQuery(window).on('touchstart', function(event) {
        event.stopPropagation();
        Scroll.firstMove = true;
        Scroll.touchStart = event.originalEvent.touches[0].clientY;
    });

    jQuery(window).on('touchmove', function(event) {
        event.stopPropagation();

        if ( Scroll.firstMove === false ) {
            event.preventDefault();
            return false;
        }
        Scroll.firstMove = false;

        var touchEnd = event.originalEvent.changedTouches[0].clientY;
        return Scroll.scroll(event, touchEnd - Scroll.touchStart);
    });
});

jQuery(window).resize(function() {
    Scroll.scrollHeight = jQuery('.section').height();
});
