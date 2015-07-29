var App = {
    animationTime: 500,
    animationShort: 150,
    windowWidth: jQuery(window).width(),
    windowHeight: jQuery(window).height(),
    isMobile: null,

    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return "";
    },

    resizeElements: function() {
        App.windowWidth = jQuery(window).width();
        App.windowHeight = jQuery(window).height();

        jQuery('.main-block, .about-experience').each( function() {
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
        var video = document.getElementById('landing-video'),
            audio = document.getElementById('landing-audio');

        function checkLoad() {
            if (video.readyState === 4) {
                video.play();

                if ( App.getCookie('player') == 'play' ) {
                    setTimeout(function() {
                        audio.play();
                    }, 100);                
                }
            } else {
                setTimeout(checkLoad, 100);
            }
        }

        jQuery('.player.play').click( function(event) {
            audio.play();
            document.cookie="player=play";
            jQuery('.player.play').removeClass('active').hide();
            jQuery('.player.pause').addClass('active').show();
        });

        jQuery('.player.pause').click( function(event) {
            audio.pause();
            document.cookie="player=pause";
            jQuery('.player.play').addClass('active').show();
            jQuery('.player.pause').removeClass('active-client').hide();
        });

        jQuery("#loading").fadeOut(500, function() {
            jQuery("#landing *, #block1 *, .blog").fadeIn(500, function() {
                var cookiePlayer = App.getCookie('player');

                jQuery('#loading .spinner-holder').fadeOut(500);
                jQuery("#loading").hide();

                if ( video && !App.isMobile ) {
                    if ( cookiePlayer.length == 0 || cookiePlayer == 'pause' ) {
                        // jQuery('.player').removeClass('play').addClass('pause');
                        jQuery('.player.play').addClass('active').show();
                        jQuery('.player.pause').removeClass('active').hide();
                    }
                    
                    checkLoad();
                } else {
                    jQuery('#header .player').hide();
                }
                jQuery('#header, #moveUp').fadeIn(500);
            });
        });
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

