var App = {
    animationTime: 500,
    animationShort: 150,
    windowWidth: jQuery(window).width(),
    windowHeight: jQuery(window).height(),
    isMobile: null,

    actions: function() {
        jQuery('header .fa-graduation-cap').click(App.menuOpen);
        jQuery('#certificates .close').click(App.menuClose);
    },

    menuClose: function() {
        topMenuHeight = '-100vh';

        jQuery('#certificates').animate({ 
            top: topMenuHeight
        }, { 
            queue: false, 
            duration: App.animationTime,
            complete: function() { 
				jQuery('header .fa-graduation-cap').show();
                if ( App.windowWidth > 1024 && !App.isMobile ) {
                    jQuery('nav').show();
                } 
            }
        });
    },

    menuOpen: function() {
        jQuery('html').css('overflow', 'hidden');
        jQuery('header .fa, nav').hide();

        jQuery('#certificates').animate({ 
            top: '0' 
        }, { 
            queue: false, 
            duration: App.animationTime,
            complete: function() { 
                    jQuery('#certificates').on(Scroll.mousewheel, function(event) {
                        event.stopPropagation();
                    });
            }
        });
    },

    resizeElements: function() {
        App.windowWidth = jQuery(window).width();
        App.windowHeight = jQuery(window).height();

        jQuery('.main-block').each( function() {
            var block = jQuery(this);

            var img = new Image();
            img.src = jQuery(this).css('background-image').replace('url(', '').replace(')', '').replace('"', '').replace('"', '');
            img.onload = function() {
                var imgWidth = img.width,
                    imgHeight = img.height;

                var bgSize;
                if ( App.windowWidth > App.windowHeight ) {
                    if ( App.windowWidth / App.windowHeight > imgWidth / imgHeight ) {
                        bgSize = '100vw auto';
                    } else {
                        bgSize = 'auto 100vh';
                    }
                } else {
                    bgSize = 'auto 100vh';
                }

                block.css('background-size', bgSize);
            }();
        });
/* 
        if ( App.windowWidth > 768 ) {
            jQuery('.central-button').hover(function(event) {
                var self = jQuery(this);
                self.find('.overlay').stop().animate({height:'100%'}, App.animationShort, function() {
                    self.css('background', self.css('color'));
                });
            },
            function(event) {
                var self = jQuery(this),
                    bgColor = self.hasClass('start-button') ? 'rgba(255, 255, 255, 0.3)' : 'transparent';

                self.css('background', bgColor);
                jQuery(this).find('.overlay').stop().animate({height:'0'}, App.animationShort);
            });
        } else {
            jQuery('.central-button').unbind('mouseenter mouseleave');
        } */
    },

    /* resizeInput: function(inputField) {
        var width = inputField.val().length;
        if ( width == 0 ) {
            width = inputField.attr('placeholder').length;
        } 
        inputField.css('width', width * 10 + 'px');
    }, */

    /* titleResize: function() {
        jQuery('.case-to-top').each(function(){
            var 
                self = jQuery(this),
                title = self.find('.title'),
                width = title.outerWidth(true) + 10,
                height = title.height();

            self.find('.svg-title').attr('width', width);
            // if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
            if(navigator.userAgent.match(/(iPhone|iPod)/g)) {
                self.find('.svg-title').attr('height', height);
            }

        });

        if(/(?:iOS|Android)/.test(navigator.userAgent)) {
        //     if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        //         jQuery('mask text').attr('dy', '20%');
        //     } else {
                jQuery('mask text').attr('dy', '40%');
        //     }
        }
    },
 */
    loadingSetup: function() {
		jQuery('.burning').burn();
		jQuery(document).ready(function() {
			jQuery("#loader").fadeOut("slow")
		});
    }

};

jQuery(window).resize(function() {
    App.windowWidth = jQuery(window).width();
    App.windowHeight = jQuery(window).height();

  //  App.titleResize();
    App.resizeElements();
});

jQuery(window).load(function() {
    App.windowHeight = jQuery(window).height();
    App.windowWidth = jQuery(window).width();
    App.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    App.actions();
    App.loadingSetup();
    App.resizeElements();
  //  App.titleResize();
});

