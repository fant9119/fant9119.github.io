var App = {
    animationTime: 500,
   // animationShort: 150,
    windowWidth: $(window).width(),
    windowHeight: $(window).height(),
    isMobile: null,

	actions: function() {
        /* $('.central-button').click(function() {
            var link = jQuery(this).attr('permalink');
            if ( typeof link != 'undefined' && link != '#') {
                window.location.href = link;
            }
        }); */

        $('#header .fa-graduation-cap').click(App.menuOpen);
        jQuery('#contact-left-menu .close').click(App.menuClose);

        /* jQuery('.contact-us, .blogmenu-item a[title^=contact], .menu-item[slug=contact], .topmenu-item a[href=#]').click(function() {
            App.menuClose();
            //jQuery('#contact-container, .contact-overlay').fadeIn('slow');
            jQuery('body').addClass('contact-container-on');
        }); */

        /* jQuery('#contact-close').click(function() {
            //jQuery('#contact-container, .contact-overlay').fadeOut('slow');
            jQuery('body').removeClass('contact-container-on');
        }); */
    },
	
	menuClose: function() {
        jQuery('body').removeClass('contact-menu-on');
        /*topMenuHeight = '-100vh';

        jQuery('#main-menu').animate({ 
            top: topMenuHeight
        }, { 
            queue: false, 
            duration: App.animationTime,
            complete: function() { 
                // jQuery('.main-block').addClass('fp-section');
                jQuery('#fp-nav').show();

                if ( App.windowWidth > 600 && !App.isMobile ) {
                    jQuery('#header .fa-graduation-cap, #header .player.active').show();
                } else {
                    jQuery('#header .bars').show();
                    // jQuery('#header .fa-bars').show();
                }
            }
        });*/
    },
	
	menuOpen: function() {
        $('html').css('overflow', 'hidden');
        $('#header .fa, nav').hide();

        $('#contact-left-menu').animate({ 
            top: '0' 
        }, { 
            queue: false, 
            duration: App.animationTime,
            complete: function() { 
                    $('#contact-left-menu').on(Scroll.mousewheel, function(event) {
                        event.stopPropagation();
                    });
                // $('.main-block').removeClass('fp-section');
            }
        });
    },
	
	videoSetup: function() {
        var video = document.getElementById('sky-video');

		if (video == null) {
		
		}
		var now = new Date();
		var hour = now.getHours();
		
		if(hour >= 6 && hour < 12) {
			video.setAttribute('src','resources/video/morning/a ('+ (Math.floor(Math.random()*2) + 1)+').mp4');
		} else if (hour >= 12 && hour < 17) {
			video.setAttribute('src','resources/video/day/a ('+ (Math.floor(Math.random()*4) + 1)+').mp4'); 
		} else if(hour >= 17 && hour < 21) {
			video.setAttribute('src','resources/video/evening/a ('+ (Math.floor(Math.random()*6) + 1)+').mp4');
		} else {
			video.setAttribute('src','resources/video/night/a (25).mp4');
		}
			
		checkLoad();
				
		function checkLoad() {
            if (video.readyState === 4) {
                video.play();
				App.start();
            } else {
                setTimeout(checkLoad, 100);
            }
        }
    },

	start: function() {
		$('.burning').burn();
		$('body').addClass('loaded');
    }
}


$(window).resize(function() {

});

$(window).load(function() {
    App.windowHeight = $(window).height();
    App.windowWidth = $(window).width();
    App.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    NodeList.prototype.forEach = Array.prototype.forEach;
   
    if(window.Scroll) Scroll.setBodyClass();

	App.actions();
    $('#content').wrap('<div id="content-wrapper">');
	$('#contact-menu-toggle')
        .click(function(){
            $('body').toggleClass('contact-menu-on');
        })
        .add('#contact-right-menu, #contact-left-menu')
        .on('touchstart', function(e){e.stopPropagation();})
        .on('touchend', function(e){e.stopPropagation();});
	
	App.videoSetup();
});

