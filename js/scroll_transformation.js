DOMTokenList.prototype.filter = Array.prototype.filter;
DOMTokenList.prototype.forEach = Array.prototype.forEach;

var Scroll = {
    lastSectionNumber: null,
    currentBlock: 0,
    latency: 100,
    lastEventTime: 0,
    mousewheel: (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel",
    scrollHeight: null,
    navPoints: null,

    touchStart: null,
    firstMove: null,
    setBodyClass: function(){
        document.body
            .classList
            .filter(function(c){return /^color_/.test(c);})
            .forEach(function(c){document.body.classList.remove(c);});
        $('.section')
            .get(Scroll.currentBlock || 0)
            .classList
            .filter(function(c){return /^color_/.test(c);})
            .forEach(function(c){document.body.classList.add(c);});
        this.triggerEvent('applyCss.BEFORE', {'slideIndex': Scroll.currentBlock});
    },
    applyCss: function() {
        Scroll.setBodyClass();
        var translateY = 'translateY( -' + Scroll.scrollHeight * Scroll.currentBlock + 'px )';

        $('#content').css({
            '-webkit-transform': translateY,
            '-moz-transform': translateY,
            '-ms-transform': translateY,
            'transform': translateY
        });

        $('nav .active').removeClass('active');
        var a = Scroll.navPoints.get(Scroll.currentBlock);
        $(a).addClass('active');
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
    key: null,
    keyDown: function (event) {
        if (event.keyCode == 38 || event.keyCode == 33) { // up
            Scroll.currentBlock = ( Scroll.currentBlock == 0 ) ? 0 : Scroll.currentBlock - 1;
            Scroll.scrollToSlide(Scroll.currentBlock);
            Scroll.key = event.keyCode;
            $(window)
                .off('keydown', Scroll.keyDown)
                .on('keyup', Scroll.keyUp);
        }
        else if (event.keyCode == 40 || event.keyCode == 34) { // down
            Scroll.currentBlock = ( Scroll.currentBlock == Scroll.lastSectionNumber ) ? Scroll.lastSectionNumber : Scroll.currentBlock + 1;
            Scroll.scrollToSlide(Scroll.currentBlock);
            Scroll.key = event.keyCode;
            $(window)
                .off('keydown', Scroll.keyDown)
                .on('keyup', Scroll.keyUp);
        }
        else if(event.keyCode == 35) { // end
            Scroll.currentBlock = Scroll.lastSectionNumber;
            Scroll.scrollToSlide(Scroll.currentBlock);
            Scroll.key = event.keyCode;
            $(window)
                .off('keydown', Scroll.keyDown)
                .on('keyup', Scroll.keyUp);
        }
        else if(event.keyCode == 36) { // home
            Scroll.currentBlock = 0;
            Scroll.scrollToSlide(Scroll.currentBlock);
            Scroll.key = event.keyCode;
            $(window)
                .off('keydown', Scroll.keyDown)
                .on('keyup', Scroll.keyUp);
        }
        else if(event.keyCode == 13) { // enter
            return false;
        }
    },
    keyUp: function(event){
        if(Scroll.key == event.keyCode){
            $(window)
                .on('keydown', Scroll.keyDown)
                .off('keyup', Scroll.keyUp);
        }
    },
    setup: function() {
        var sections = $('.section');

        sections.each(function() {
            $('nav ul').append('<li><a slide="' + $(this).attr('id') 
                                        + '" href="#"><span></span></a></li>');
        });
        Scroll.navPoints = $('nav ul li a');

        Scroll.lastSectionNumber = sections.length - 1;
        Scroll.scrollHeight = sections.height();

        Scroll.navPoints.first().addClass('active');
        Scroll.navPoints.click(function() {
            Scroll.scrollToSlide( Scroll.navPoints.index($(this)) );
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

$(window).load(function(event) {
    Scroll.setup();

    $(window).on(Scroll.mousewheel, function (event) {
        if ($('body').hasClass('pad-shown') || $('body').hasClass('contact-menu-on'))
            $('body').removeClass('pad-shown').removeClass('contact-menu-on');
        var direction = (Scroll.mousewheel == "DOMMouseScroll") ? -event.originalEvent.detail
            : event.originalEvent.wheelDelta;
        var deltaYdirection = event.originalEvent.deltaY > 0 ? 1 : (event.originalEvent.deltaY < 0 ? -1 : 0);
        event.stopPropagation();
        event.preventDefault();
        if (event.timeStamp - Scroll.lastEventTime < Scroll.latency && (deltaYdirection == Scroll.direction)) {
            Scroll.lastEventTime = event.timeStamp;
            Scroll.direction = deltaYdirection;
            return false;
        }

        Scroll.lastEventTime = event.timeStamp;
        Scroll.direction = deltaYdirection;

        return Scroll.scroll(event, direction);
    });

    $(window).on('touchstart', function (event) {
        event.stopPropagation();
        Scroll.firstMove = true;
        Scroll.touchStart = event.originalEvent.touches[0].clientY;
    });

    $(window).on('touchmove', function (event) {
        event.stopPropagation();

        if (Scroll.firstMove === false) {
            event.preventDefault();
            return false;
        }
        Scroll.firstMove = false;

        var touchEnd = event.originalEvent.changedTouches[0].clientY;
        return Scroll.scroll(event, touchEnd - Scroll.touchStart);
    });

    $(window).on('keydown', Scroll.keyDown);

});

$(window).resize(function() {
    Scroll.scrollHeight = $('.section').height();
});
