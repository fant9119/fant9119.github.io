var App = {
    animationShort: 150,
    windowWidth: jQuery(window).width(),
    windowHeight: jQuery(window).height(),
    isMobile: null,

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
        }
    },

    videoSetup: function() {
        var video = document.getElementById('landing-video');

		var now = new Date();
		var hour = now.getHours();
		
		if(hour >= 6 && hour < 12) {
			video.setAttribute('src','video/morning/a ('+ (Math.floor(Math.random()*2) + 1)+').mp4');
		} else if (hour >= 12 && hour < 17) {
			video.setAttribute('src','video/day/a ('+ (Math.floor(Math.random()*4) + 1)+').mp4'); 
		} else if(hour >= 17 && hour < 21) {
			video.setAttribute('src','video/evening/a ('+ (Math.floor(Math.random()*6) + 1)+').mp4');
		} else {
			video.setAttribute('src','video/night/a (25).mp4');
		}
			
		checkLoad();
				
		function checkLoad() {
            if (video.readyState === 4) {
                video.play();
				jQuery('#loader').fadeOut('slow');
            } else {
                setTimeout(checkLoad, 100);
            }
        }
    },
	
	landingHide: function() {
		jQuery('#landing').hide();
	}
};



jQuery(window).resize(function() {
    App.windowWidth = jQuery(window).width();
    App.windowHeight = jQuery(window).height();
    App.resizeElements();
});

jQuery(window).load(function() {
    App.windowHeight = jQuery(window).height();
    App.windowWidth = jQuery(window).width();
    App.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    App.videoSetup();
    App.resizeElements();
});