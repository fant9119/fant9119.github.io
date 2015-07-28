var App = {
    animationTime: 500,
    animationShort: 150,
    windowWidth: jQuery(window).width(),
    windowHeight: jQuery(window).height(),
    isMobile: null,

    actions: function() {
        jQuery('.central-button').click(function() {
            var link = jQuery(this).attr('permalink');
            if ( typeof link != 'undefined' && link != '#') {
                window.location.href = link;
            }
        });

        jQuery('#header .fa-cloud, #header .bars').click(App.menuOpen);
        jQuery('#main-menu .close').click(App.menuClose);

        jQuery('.contact-us, .blogmenu-item a[title^=contact], .menu-item[slug=contact], .topmenu-item a[href=#]').click(function() {
            App.menuClose();
            jQuery('#contact-container, .contact-overlay').fadeIn('slow');
        });

        jQuery('#contact-close').click(function() {
            jQuery('#contact-container, .contact-overlay').fadeOut('slow');
        });
    },

    contactFormSetup: function() {
        jQuery('#contact .contact-input').each(function() {
            var self = jQuery(this);
            self.attr('size', self.attr('placeholder').length);
        }).keyup(function() { 
            App.resizeInput(jQuery(this)) 
        } ).each(function() { 
            App.resizeInput(jQuery(this)) 
        });

        jQuery('#footer .placeholder').each(function() {
            var self = jQuery(this);
            jQuery('#' + self.attr('input')).width(self.width()+4);
            self.hide();
        });
    },

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

    menuClose: function() {
        topMenuHeight = '-100vh';

        jQuery('#main-menu').animate({ 
            top: topMenuHeight
        }, { 
            queue: false, 
            duration: App.animationTime,
            complete: function() { 
                // jQuery('.main-block').addClass('fp-section');
                jQuery('#fp-nav').show();

                if ( App.windowWidth > 600 && !App.isMobile ) {
                    jQuery('#header .fa-cloud, #header .player.active').show();
                } else {
                    jQuery('#header .bars').show();
                    // jQuery('#header .fa-bars').show();
                }
            }
        });
    },

    menuOpen: function() {
        jQuery('html').css('overflow', 'hidden');
        jQuery('#header .fa, #header .bars, #header .player, #fp-nav').hide();

        jQuery('#main-menu').animate({ 
            top: '0' 
        }, { 
            queue: false, 
            duration: App.animationTime,
            complete: function() { 
                    jQuery('#main-menu').on(Scroll.mousewheel, function(event) {
                        event.stopPropagation();
                    });
                // jQuery('.main-block').removeClass('fp-section');
            }
        });
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

    resizeInput: function(inputField) {
        var width = inputField.val().length;
        if ( width == 0 ) {
            width = inputField.attr('placeholder').length;
        } 
        inputField.css('width', width * 10 + 'px');
    },

    titleResize: function() {
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

    topOffset: function() {
        // ivan
        // var offset = jQuery('#wpadminbar').outerHeight() + 10 + 'px';
        // jQuery('#header').css('top', offset);
        // // jQuery('#header .bars').css('margin-top', adminBarHeight + 10 + 'px');
        // jQuery('.blog-popup, #main-menu .menu-right').css('padding-top', offset);
        // jQuery('#main-menu .logo').css('top', offset);
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

// function shiftColor(color, shift) {
//     if ( color[0] == "#" ) {
//         color = color.slice(1);

//         var num = parseInt(color,16);
//         var r = ((num >> 16) + shift)%255;
//         var b = (((num >> 8) & 0x00FF) + shift)%255;
//         var g = ((num & 0x0000FF) + shift)%255;

//         return "#" + (g | (b << 8) | (r << 16)).toString(16);
//     } else if ( color.indexOf("rgb") > -1 ) {
//         var regExp = /\(([^)]+)\)/;
//         var colors = regExp.exec(color);
//         colors = colors[1].split(', ');

//         var r = (parseInt(colors[0]) + shift)%255;
//         var b = (parseInt(colors[1]) + shift)%255;
//         var g = (parseInt(colors[2]) + shift)%255;

//         return "rgb(" + r + ', ' + g + ', ' + b + ')';
//     }
// }

jQuery(window).resize(function() {
    App.windowWidth = jQuery(window).width();
    App.windowHeight = jQuery(window).height();

    App.titleResize();
    App.resizeElements();
});

jQuery(window).load(function() {
    App.windowHeight = jQuery(window).height();
    App.windowWidth = jQuery(window).width();
    App.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    App.contactFormSetup();
    App.actions();
    App.videoSetup();
    App.resizeElements();
    App.titleResize();
    App.topOffset();
});

