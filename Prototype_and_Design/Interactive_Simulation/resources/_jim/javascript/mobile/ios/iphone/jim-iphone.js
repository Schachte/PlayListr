/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function(window, undefined) {
	  var zoomLevels = [50, 75, 100, 150];
		
	  /* rotate */
	  jQuery("#rotateDevice").bind("click", function(event) {
	    var isPortrait = jQuery('#jim-container.portrait');
		if(isPortrait && isPortrait.length===1) {
		  if($.browser.msie) {
			  rotateToLandscape();			  
			  jimMobile.resetWidgets();
			  if($.browser.version<9)
				  restoreZoom(jimMobile.getZoom());
			  jQuery('.orientationlandscape').trigger("orientationlandscape");
			  jQuery(window).trigger("resize");
			  jQuery(window).trigger("reloadScrollBars");
		  }
		  else {
			  $('#jim-mobile').fadeOut('slow', function() { 
				  rotateToLandscape();
				  $('#jim-mobile').fadeIn("slow", function() {
					jimMobile.resetWidgets();
					jQuery('.orientationlandscape').trigger("orientationlandscape");
					jQuery(window).trigger("resize");
					jQuery(window).trigger("reloadScrollBars");
				  });
			  });
		  }
		}
		else {
		  if($.browser.msie) {
			  rotateToPortrait();
			  jimMobile.resetWidgets();
			  if($.browser.version<9)
				  restoreZoom(jimMobile.getZoom());
			  jQuery('.orientationportrait').trigger("orientationportrait");
		      jQuery(window).trigger("resize");
		      jQuery(window).trigger("reloadScrollBars");
		  }
		  else {
			  $('#jim-mobile').fadeOut('slow', function() {
				  rotateToPortrait();
				  $('#jim-mobile').fadeIn("slow", function() {
					jimMobile.resetWidgets();
					jQuery('.orientationportrait').trigger("orientationportrait");
					jQuery(window).trigger("resize");
					jQuery(window).trigger("reloadScrollBars");
				  });
			  });
		  }
		}
	  });
	  
	  function rotateToLandscape() {
		  var transX = parseFloat(50 / ((parseInt(jQuery("#jim-mobile").css("width")) + ".0") / (parseInt(jQuery("#jim-mobile").css("height")) + ".0")));
		  if(jQuery("#jim-body").hasClass("mobilecustom")) {
			  jQuery('#jim-case').css('-moz-transform', "rotate(90deg)");
			  jQuery('#jim-case').css('-webkit-transform', "rotate(90deg)");
			  jQuery('#jim-case').css('transform', "rotate(90deg)");
			  jQuery('#jim-case').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1);');
			  jQuery('#jim-case').css('-moz-transform-origin', transX + "% 50% 0");
			  jQuery('#jim-case').css('-webkit-transform-origin', transX + "% 50% 0");
			  jQuery('#jim-case').css('transform-origin', transX + "% 50% 0");
		  }
		  
		  var width = jQuery("#jim-mobile").css("width");
		  jQuery("#jim-mobile").css('width', jQuery("#jim-mobile").css("height"));
		  jQuery("#jim-mobile").css('height', width);
		  jQuery('#jim-mobile').addClass("landscape").removeClass("portrait");
		  jQuery('#jim-container').addClass("landscape").removeClass("portrait");
		  jQuery('#jim-case').addClass("landscape").removeClass("portrait");
	  }
	  
	  function rotateToPortrait() {
		  if(jQuery("#jim-body").hasClass("mobilecustom")) {
			  jQuery('#jim-case').css('-moz-transform', "rotate(0deg)");
			  jQuery('#jim-case').css('-webkit-transform', "rotate(0deg)");
			  jQuery('#jim-case').css('transform', "rotate(0deg)");
			  jQuery('#jim-case').css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0);');
			  jQuery('#jim-case').css('-moz-transform-origin', "");
			  jQuery('#jim-case').css('-webkit-transform-origin', "");
			  jQuery('#jim-case').css('transform-origin', "");
		  }
		  
		  var width = jQuery("#jim-mobile").css("width");
		  jQuery("#jim-mobile").css('width', jQuery("#jim-mobile").css("height"));
		  jQuery("#jim-mobile").css('height', width);
		  jQuery('#jim-mobile').addClass("portrait").removeClass("landscape");
		  jQuery('#jim-container').addClass("portrait").removeClass("landscape");
		  jQuery('#jim-case').addClass("portrait").removeClass("landscape");
	  } 
	  
	  /* gesture tool */
	  jQuery("#gestureTool").val(0);
	  if($.browser.msie) {
		$(document).ready(function() {
		  document.getElementById('gestureTool').selectedIndex=0;
		});
	  }
	  
	  jQuery("#gestureTool").change(function(event) {
	    var tools = jQuery("#gestureTool").prop("selectedIndex");
	    disableLastTool();
		switch(tools) {
		  case 0:
			enableTouchTool();
			jimMobile.tool = "touch";
		    break;
		  case 1:
			enablePinchTool();
			jimMobile.tool = "pinch";
		    break;
		  case 2:
			enableRotateTool();
			jimMobile.tool = "rotate";
		    break;
		  default:
			break;
		}
		
	  });
	
	  function enableTouchTool() {
		  jQuery("#jim-container").addClass("touch");
	  };
	  
	  function enablePinchTool() {
		  $page = jQuery("#jim-container");
		  var cursor1 = '<div id="cursor1" class="cursor"></div>';
		  var cursor2 = '<div id="cursor2" class="cursor"></div>';	
		  var m1, m2, doPinch=false;
		  var Y, target;
		  var zoomLev = jimMobile.getZoom();
		  
		  $page.bind("mousemove", function(e, data) {
			if(doPinch === false) {
				$("#cursor1").css({left:(e.pageX - $page.offset().left)*zoomLev-50, top:(e.pageY - $page.offset().top)*zoomLev+50});
				$("#cursor2").css({left:(e.pageX - $page.offset().left)*zoomLev+50, top:(e.pageY - $page.offset().top)*zoomLev-50});
		    }
			else {
				Y = ((e.pageY - $page.offset().top)*zoomLev - m2);
				if(Y<-35)
				Y=-35;
				else if(Y>35)
				Y=35;
				$("#cursor1").css({left:m1-50-Y, top:m2+50+Y});
				$("#cursor2").css({left:m1+50+Y, top:m2-50-Y});
			}
		  });
		  
		  $page.bind("drag", function(e, data) {
			return true;
		  });
			
		  $page.bind("dragstart", function(e, data) {
			m1 = (e.pageX - $page.offset().left)*zoomLev; //pos actual del ratón
			m2 = (e.pageY - $page.offset().top)*zoomLev;
			doPinch=true;
			target = e.target;
			return true;
		  });
			
		  $page.bind("mouseup", function(e, data) {
			  if(doPinch) {
				 doPinch=false;
			   if(m2-((e.pageY - $page.offset().top)*zoomLev)<0)
				 jQuery(target).closest(".firer").trigger("pinchopen");
			   else if(m2-((e.pageY - $page.offset().top)*zoomLev)>0) 
				 jQuery(target).closest(".firer").trigger("pinchclose");
			  }
		  });
		  
		  $page.bind("mouseenter", function(e, data) {
			if(doPinch===false) {
				$page.append(cursor1+cursor2);
				zoomLev = jimMobile.getZoom();
			}
		  });
		  
		  $page.bind("mouseleave", function(e, data) {
			if(doPinch===false) {
				jQuery("#cursor1").remove();
				jQuery("#cursor2").remove();
			}
		  });  
	  };
	
	  function enableRotateTool() {
		  $page = jQuery("#jim-container");
		  var cursor1 = '<div id="cursor1" class="cursor"></div>';
		  var cursor2 = '<div id="cursor2" class="cursor"></div>';
		  var m1, m2, doRotate=false;
		  var angleRad, target;
		  var distance = 142;
		  var zoomLev = jimMobile.getZoom();
		  
		  $page.bind("mousemove", function(e, data) {
			if(doRotate === false) {
				$("#cursor1").css({left:(e.pageX - $page.offset().left)*zoomLev-50, top:(e.pageY - $page.offset().top)*zoomLev+50});
				$("#cursor2").css({left:(e.pageX - $page.offset().left)*zoomLev+50, top:(e.pageY - $page.offset().top)*zoomLev-50});
		    }
			else {
				var v1x=m1-50;
				var v1y=m2+50;
				var v2x=(e.pageX - $page.offset().left)*zoomLev;
				var v2y=(e.pageY - $page.offset().top)*zoomLev;
				var distX = v2x - v1x;
				var distY = v1y - v2y;
				angleRad = Math.atan(distY/distX);
				if(distX<0)
				  angleRad= angleRad + Math.PI;	
				  
				if(angleRad>(3*Math.PI/4))
				  angleRad=3*Math.PI/4;
				else if(angleRad<-(Math.PI/4))
				  angleRad=-Math.PI/4;
				
				var X = Math.round(distance * Math.cos( angleRad ) );
				var Y = Math.round(distance * Math.sin( angleRad ) );
				
				$("#cursor1").css({left:m1-50, top:m2+50});
				$("#cursor2").css({left:m1-50+X, top:m2+50-Y});
			}
		  });
		  
		  $page.bind("drag", function(e, data) {
			return true;
		  });
			
		  $page.bind("dragstart", function(e, data) {
			m1 = (e.pageX - $page.offset().left)*zoomLev; //pos actual del ratón
			m2 = (e.pageY - $page.offset().top)*zoomLev;
			doRotate=true;
			target = e.target;
			return true;
		  });
			
		  $page.bind("mouseup", function(e, data) {
			if(doRotate) {
			  doRotate=false;
			  if((angleRad*180/Math.PI)<45)
				jQuery(target).closest(".firer").trigger("rotateright");
			  else if((angleRad*180/Math.PI)>45) 
				jQuery(target).closest(".firer").trigger("rotateleft");
			}
		  });
		  
		  $page.bind("mouseenter", function(e, data) {
			if(doRotate===false) {
			  $page.append(cursor1+cursor2);
			  zoomLev = jimMobile.getZoom();
			}
		  });
		  
		  $page.bind("mouseleave", function(e, data) {
			if(doRotate===false) {
				jQuery("#cursor1").remove();
				jQuery("#cursor2").remove();
			}
		  }); 
	  };
	  
	  function disableLastTool() {
		$page = jQuery("#jim-container");
		$page.removeClass("touch");
		jQuery("#cursor1").remove();
		jQuery("#cursor2").remove();
		$page.unbind('mousemove');
		$page.unbind('drag');
		$page.unbind('dragstart');
		$page.unbind('mouseup');
		$page.unbind('mouseenter');
		$page.unbind('mouseleave');
		jimMobile.hideWidgets();
		jimMobile.resetWidgets();
	  };  
	
	  /* zoom */
	  if($.browser.msie && $.browser.version<9) {
		  jQuery(".zoomcontrol").attr("title", "Your browser doesn't support the zoom feature");
	  }
	  else {
		  jQuery("#addZoom").bind("click", function(event) {
			var value = jQuery("#zoomValue").text();
			var currentZoomIndex = indexOf(zoomLevels, value);
			if(currentZoomIndex+1<zoomLevels.length) {
			  var zoomLev = zoomLevels[currentZoomIndex+1];
			  setZoom(zoomLev/100);
			  jQuery("#zoomValue").text(zoomLev + "%");
			}
		  });
		  jQuery("#removeZoom").bind("click", function(event) {
		    var value = jQuery("#zoomValue").text();
			var currentZoomIndex = indexOf(zoomLevels, value);
			if(currentZoomIndex-1>=0) {
			  var zoomLev = zoomLevels[currentZoomIndex-1];
			  setZoom(zoomLev/100);
			  jQuery("#zoomValue").text(zoomLev + "%");
			}
		  });
	  }
		 
	  function setZoom(zoomLev) {
		  var $mobile = jQuery('#jim-mobile');
		  $mobile.css('-webkit-transform-origin', '50% 0 0');
		  $mobile.css('-webkit-transform', "scale(" + zoomLev + ")");
		  $mobile.css('-moz-transform-origin', '50% 0 0');
		  $mobile.css('-moz-transform', "scale(" + zoomLev + ")");
		  $mobile.css('-o-transform-origin', '50% 0 0');
		  $mobile.css('-o-transform', "scale(" + zoomLev + ")");
		  $mobile.css('-ms-transform-origin', '50% 0'); //IE9
		  $mobile.css('-ms-transform', "scale(" + zoomLev + ")");
		  $mobile.css('transform-origin', '50% 0');
		  $mobile.css('transform', "scale(" + zoomLev + ")");
		  
		  if($.browser.msie && $.browser.version<9) {
			  var $container = jQuery('#jim-container'),
			  oldZoom = 1/jimMobile.getZoom();
			  $mobile.css('zoom', zoomLev);
			  $container.css('top', parseInt(((parseInt($container.css("top"))/oldZoom) *zoomLev)));
			  $container.css('left', parseInt(((parseInt($container.css("left"))/oldZoom) *zoomLev)));
		  }
		  
		  //TODO
		  //Change the cursor images if touch to give the "zoom" to mouse pointer. 
	  };
	  
	  function restoreZoom(zoomLev) {
		  var zoom = 1/zoomLev,
		  $container = jQuery('#jim-container'),
		  $mobile = jQuery('#jim-mobile'),
		  oldZoom = 1/jimMobile.getZoom();
		  
		  $container.css("top", "");
		  $container.css("left", "");

		  var top = $container.css("top");
		  var left = $container.css("left");
		  $mobile.css("width", "");
		  $mobile.css("height", "");
			  
		  if(oldZoom===1 && zoomLev===1) {}
		  else {
			  $container.css('top', parseInt(parseInt((parseInt(top)) *zoom)));
			  $container.css('left', parseInt(parseInt((parseInt(left)) *zoom)));
		  }
	  }
	  
	  function indexOf(zoomLevels, currentLevel) {
		  var value = parseInt(currentLevel);
		  for (var i=0; i < zoomLevels.length; i++) {
			if (zoomLevels[i] == value)
			  return i;
		  }
		  return -1;
	  };

	  
	  /* other */
	  var jimMobile = {
		"orientation": function() {
			var width = parseInt(jQuery("#simulation").css("width"));
			var height = parseInt(jQuery("#simulation").css("height"));
			return (width<height) ? "portrait" : "landscape";
		},
		"isMobileDevice": function() {
			var userAgent = navigator.userAgent;
			var mobileTypes = {
			  android: userAgent.match(/Android/),
			  ios: userAgent.match(/(iPhone|iPad|iPod)/),
			  windows: userAgent.match(/Windows Phone/)
			};

			if(mobileTypes.android || mobileTypes.ios || mobileTypes.windows)
			  return true;
			else
			  return false;
		 },
		 "isiOSDevice": function() {
			var userAgent = navigator.userAgent;
			var mobileTypes = {
			  ios: userAgent.match(/(iPhone|iPad|iPod)/)
			};

			if(mobileTypes.ios)
			  return true;
			else
			  return false;
		 },
		"tool": "touch",
		"load": function() {
		  if(jimMobile.isMobileDevice()) {
			if(jQuery("#jim-mobile").length) {
				var simulation = jQuery("#simulation");
				jQuery("#jim-mobile").detach();
				jQuery("#jim-body").append(simulation);
			}
			jQuery("#toppanel").removeClass("open hidden").addClass("hidden");
			jQuery("#sidepanel").removeClass("open hidden").addClass("hidden");
			jQuery("#jim-body").removeClass("controlled full").addClass("full");
		  }
		  jQuery("body").css("display", "block");
		},
		"loadComponents": function() {
			if(!jimMobile.isMobileDevice()) {
			  if(jQuery("#jim-ipad-kb").length===0 && jQuery("#jim-iphone-kb").length===0) {
			      jimMobile.loadKeyboard();
			      jimMobile.loadDropDown();
			      jimMobile.loadDate();
			      jimMobile.loadTime();
			      jimMobile.loadDateTime();
			  }
		      jimMobile.loadScrollBars();
		    }
		 },
		 "unloadComponents": function() {
			if(!jimMobile.isMobileDevice()) {
			  jimMobile.unloadKeyboard();
			  jimMobile.unloadDropDown();
			  jimMobile.unloadDate();
			  jimMobile.unloadTime();
			  jimMobile.unloadDateTime();
		    }
		 },
		 "getZoom": function() {
			var value = jQuery("#zoomValue").text();
			return 1/(parseInt(value.substring(0, value.indexOf("%")))/100);
		 },
		 "isIOS": function() {
			 return jQuery(".iphone4, .iphone5, .ipad").length>0;
		 }
	  };
	  window.jimMobile = jimMobile; /* expose to the global object */

})(window);
/**
 * Overscroll v1.6.4
 *  A jQuery Plugin that emulates the iPhone scrolling experience in a browser.
 *  http://azoffdesign.com/overscroll
 *
 * Intended for use with the latest jQuery
 *  http://code.jquery.com/jquery-latest.js
 *
 * Copyright 2012, Jonathan Azoff
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://jquery.org/license
 *
 * For API documentation, see the README file
 *  http://azof.fr/pYCzuM
 *
 * Date: Thursday, October 10 2012
 */

/*jslint onevar: true, strict: true */

/*global window, document, setTimeout, clearTimeout, jQuery */

(function(global, dom, browser, math, wait, cancel, namespace, $, none){

	// We want to run this plug-in in strict-mode
	// so that we may benefit from any optimizations
	// strict execution
	'use strict';

	// The key used to bind-instance specific data to an object
	var datakey = 'overscroll',

	// runs feature detection for overscroll
	compat = (function(){
		var b  = $.browser, fallback,
		agent = browser.userAgent,
		style  = dom.createElement(datakey).style,
		prefix = b.webkit ? 'webkit' : (b.mozilla ? 'moz' : (b.msie ? 'ms' : (b.opera ? 'o' : ''))),
		cssprefix = prefix ? ['-','-'].join(prefix) : '';
		compat = { prefix: prefix, overflowScrolling: false };
		$.each(prefix ? [prefix, ''] : [prefix], function(i, prefix){
			var animator = prefix ? (prefix + 'RequestAnimationFrame') : 'requestAnimationFrame',
			scroller = prefix ? (prefix + 'OverflowScrolling') : 'overflowScrolling';

			// check to see if requestAnimationFrame is available
			if (global[animator] !== none) {
				compat.animate = function(callback){
					global[animator].call(global, callback);
				};
			}

			// check to see if overflowScrolling is available
			if (style[scroller] !== none) {
				// Chrome 19 introduced overflow scrolling. Unfortunately, their touch
				// implementation is incomplete. Hence, we act like it is not supported
				// for chrome. #59
				if (agent.indexOf('Chrome') < 0) {
					compat.overflowScrolling = cssprefix + 'overflow-scrolling';
				}
			}
		});

		// check to see if the client supports touch
		compat.touchEvents = 'ontouchstart' in global;

		// fallback to set timeout for no animation support
		if (!compat.animate) {
			compat.animate = function(callback) {
				wait(callback, 1000/60);
			};
		}

//		// firefox and webkit browsers support native grabbing cursors
//		if (prefix === 'moz' || prefix === 'webkit') {
//			compat.cursorGrab     = cssprefix + 'grab';
//			compat.cursorGrabbing = cssprefix + 'grabbing';
//
//		// other browsers can user google's assets
//		} else {
//			fallback = 'https://mail.google.com/mail/images/2/';
//			compat.cursorGrab     = 'url('+fallback+'openhand.cur), default';
//			compat.cursorGrabbing = 'url('+fallback+'closedhand.cur), default';
//		}
		return compat;
	})(),

	// These are all the events that could possibly
	// be used by the plug-in
	events = {
		drag:       'mousemove touchmove',
		end:        'mouseup mouseleave click touchend touchcancel',
		hover:      'mouseenter mouseleave',
		ignored:    'select dragstart drag',
		scroll:     'scroll',
		start:      'mousedown touchstart',
		wheel:      'mousewheel DOMMouseScroll'
	},

	// These settings are used to tweak drift settings
	// for the plug-in
	settings = {
		captureThreshold:   3,
		driftDecay:         1.1,
		driftSequences:     22,
		driftTimeout:       100,
		scrollDelta:        15,
		thumbOpacity:       0.7,
		thumbThickness:     6,
		thumbTimeout:       400,
		wheelDelta:         20
	},

	// These defaults are used to complement any options
	// passed into the plug-in entry point
	defaults = {
		cancelOn:       'input:not([readonly]), textarea:not([readonly])',
		direction:      'multi',
		dragHold:       false,
		hoverThumbs:    false,
		scrollDelta:    settings.scrollDelta,
		showThumbs:     true,
		persistThumbs:  false,
		wheelDelta:     settings.wheelDelta,
		wheelDirection: 'vertical',
		zIndex:         999,
		hasHorizontal:	true,
		hasVertical:	true
	},

	// Triggers a DOM event on the overscrolled element.
	// All events are namespaced under the overscroll name
	triggerEvent = function (event, target) {
		target.trigger('overscroll:' + event);
	},

	// Utility function to return a timestamp
	time = function() {
		return (new Date()).getTime();
	},

	// Captures the position from an event, modifies the properties
	// of the second argument to persist the position, and then
	// returns the modified object
	capturePosition = function (event, position, index) {
		position.x = event.pageX;
		position.y = event.pageY;
		position.time = time();
		position.index = index;
		return position;
	},

	// Used to move the thumbs around an overscrolled element
	moveThumbs = function (thumbs, sizing, left, top) {
		var ml, mt;
		
		if (thumbs && thumbs.added) {
			if(left + sizing.container.width > sizing.container.scrollWidth) {
			  left = sizing.container.scrollWidth - sizing.container.width;
			}
			if(top + sizing.container.height > sizing.container.scrollHeight) {
			  top = sizing.container.scrollHeight - sizing.container.height;
			} 	
			if (thumbs.horizontal) {
				ml = left * (1 + sizing.container.width / sizing.container.scrollWidth);
				mt = top + sizing.thumbs.horizontal.top;
				if(ml + sizing.thumbs.horizontal.width > sizing.container.scrollWidth) {
				  ml = sizing.container.scrollWidth - sizing.thumbs.horizontal.width;
				}
				thumbs.horizontal.css('margin', mt + 'px 0 0 ' + ml + 'px');
			}
			if (thumbs.vertical) {
				ml = left + sizing.thumbs.vertical.left;
				mt = top * (1 + sizing.container.height / sizing.container.scrollHeight);
				if(mt + sizing.thumbs.vertical.height > sizing.container.scrollHeight) {
				  mt = sizing.container.scrollHeight - sizing.thumbs.vertical.height;
				}
				thumbs.vertical.css('margin', mt + 'px 0 0 ' + ml + 'px');
			}
		}

	},

	// Used to toggle the thumbs on and off
	// of an overscrolled element
	toggleThumbs = function (thumbs, options, dragging, sizing) {
		if (thumbs && thumbs.added && !options.persistThumbs) {
			if (dragging) {
				if (thumbs.vertical && sizing.container.height!==sizing.container.scrollHeight) {
					thumbs.vertical.stop(true, true).fadeTo('fast', settings.thumbOpacity);
				}
				if (thumbs.horizontal && sizing.container.width!==sizing.container.scrollWidth) {
					thumbs.horizontal.stop(true, true).fadeTo('fast', settings.thumbOpacity);
				}
			} else {
				if (thumbs.vertical && sizing.container.height!==sizing.container.scrollHeight) {
					thumbs.vertical.fadeTo('fast', 0);
				}
				if (thumbs.horizontal && sizing.container.width!==sizing.container.scrollWidth) {
					thumbs.horizontal.fadeTo('fast', 0);
				}
			}
		}
	},

	// Defers click event listeners to after a mouseup event.
	// Used to avoid unintentional clicks
	deferClick = function (target) {
		var clicks, key = 'events';
		var events = $._data ? $._data(target[0], key) : target.data(key);
		if (events && events.click) {
			clicks = events.click.slice();
			target.off('click').one('click', function(event){
				$.each(clicks, function(i, click){
					target.click(click);
				}); return false;
			});
		}
	},

	// Toggles thumbs on hover. This event is only triggered
	// if the hoverThumbs option is set
	hover = function (event) {
		var data = event.data,
		thumbs   = data.thumbs,
		options  = data.options,
		sizing	 = data.sizing,
		dragging = event.type === 'mouseenter';
		toggleThumbs(thumbs, options, dragging, sizing);
	},

	// This function is only ever used when the overscrolled element
	// scrolled outside of the scope of this plugin.
	scroll = function (event) {
		var data = event.data;
		if (!data.flags.dragged) {
			moveThumbs(data.thumbs, data.sizing, this.scrollLeft, this.scrollTop);
		}
	},

	// handles mouse wheel scroll events
	wheel = function (event) {

		// prevent any default wheel behavior
		event.preventDefault();

		var data = event.data,
		options = data.options,
		sizing = data.sizing,
		thumbs = data.thumbs,
		wheel = data.wheel,
		flags = data.flags, delta,
		original = event.originalEvent;

		// stop any drifts
		flags.drifting = false;

		// calculate how much to move the viewport by
		// TODO: let's base this on some fact somewhere...
		if (original.wheelDelta) {
			delta = original.wheelDelta / (compat.prefix === 'o' ? -120 : 120);
		} if (original.detail) {
			delta = -original.detail / 3;
		} delta *= options.wheelDelta;

		// initialize flags if this is the first tick
		if (!wheel) {
			data.target.data(datakey).dragging = flags.dragging = true;
			data.wheel = wheel = { timeout: null };
			toggleThumbs(thumbs, options, true, sizing);
		}

		// actually modify scroll offsets
		if (options.wheelDirection === 'horizontal') {
			this.scrollLeft -= delta;
		} else {
			this.scrollTop -= delta;
		}

		if (wheel.timeout) { cancel(wheel.timeout); }

		moveThumbs(thumbs, sizing, this.scrollLeft, this.scrollTop);

		wheel.timeout = wait(function() {
			data.target.data(datakey).dragging = flags.dragging = false;
			toggleThumbs(thumbs, options, data.wheel = null, sizing);
		}, settings.thumbTimeout);

	},

	// updates the current scroll offset during a mouse move
	drag = function (event) {

		if(jimMobile.tool!=="touch")
			return;
		
		var $target = jQuery(event.target || event.srcElement);
		if($target) {
			if($target.closest(".firer").is(".drag, .dragstart")) {
				stop(event);
				return;
			}
			else if(event.data.options.direction !== 'vertical' && $target.closest(".firer").is(".swipeleft, .swiperight")) {
				stop(event);
				return;
			}
			else if(event.data.options.direction !== 'horizontal' && $target.closest(".firer").is(".swipeup, .swipedown")) {
				stop(event);
				return;
			}
			else if(event.data.options.direction === 'multi' && $target.closest(".firer").is(".swipeleftdown, .swipeleftup, .swiperightdown, .swiperightup")) {
				stop(event);
				return;
			}
		}
		
		event.preventDefault();
		event.stopPropagation();

		var data = event.data,
		touches  = event.originalEvent.touches,
		options  = data.options,
		sizing   = data.sizing,
		thumbs   = data.thumbs,
		position = data.position,
		flags    = data.flags,
		target   = data.target.get(0);


		// correct page coordinates for touch devices
		if (compat.touchEvents && touches && touches.length) {
			event = touches[0];
		}

		if (!flags.dragged) {
			toggleThumbs(thumbs, options, true, sizing);
		}

		flags.dragged = true;
		flags.hasDragged = true;

		sizing.container.width = parseInt($(target).css("width"));
		sizing.container.height = parseInt($(target).css("height"));

		if (options.direction !== 'vertical') {
			target.scrollLeft -= (event.pageX - position.x);
		}
		if (data.options.direction !== 'horizontal') {
			target.scrollTop -= (event.pageY - position.y);
		}
		
		capturePosition(event, data.position);

		if (--data.capture.index <= 0) {
			data.target.data(datakey).dragging = flags.dragging = true;
			capturePosition(event, data.capture, settings.captureThreshold);
		}
		moveThumbs(thumbs, sizing, target.scrollLeft, target.scrollTop);

	},

	// sends the overscrolled element into a drift
	drift = function (target, event, callback) {

		var data   = event.data, dx, dy, xMod, yMod,
		capture    = data.capture,
		options    = data.options,
		sizing     = data.sizing,
		thumbs     = data.thumbs,
		elapsed    = time() - capture.time,
		scrollLeft = target.scrollLeft,
		scrollTop  = target.scrollTop,
		decay      = settings.driftDecay;

		// only drift if enough time has passed since
		// the last capture event
		if (elapsed > settings.driftTimeout) {
			return callback(data);
		}

		// determine offset between last capture and current time
		dx = options.scrollDelta * (event.pageX - capture.x);
		dy = options.scrollDelta * (event.pageY - capture.y);

		// update target scroll offsets
		if (options.direction !== 'vertical') {
			scrollLeft -= dx;
		} if (options.direction !== 'horizontal') {
			scrollTop -= dy;
		}

		// split the distance to travel into a set of sequences
		xMod = dx / settings.driftSequences;
		yMod = dy / settings.driftSequences;

		triggerEvent('driftstart', data.target);

		data.drifting = true;

		// animate the drift sequence
		compat.animate(function render() {
			if (data.drifting) {
				var min = 1, max = -1;
				data.drifting = false;
				if (yMod > min && target.scrollTop > scrollTop || yMod < max && target.scrollTop < scrollTop) {
					data.drifting = true;
					target.scrollTop -= yMod;
					yMod /= decay;
				}
				if (xMod > min && target.scrollLeft > scrollLeft || xMod < max && target.scrollLeft < scrollLeft) {
					data.drifting = true;
					target.scrollLeft -= xMod;
					xMod /= decay;
				}
				moveThumbs(thumbs, sizing, target.scrollLeft, target.scrollTop);
				compat.animate(render);
			} else {
				triggerEvent('driftend', data.target);
				callback(data);
			}
		});

	},

	// starts the drag operation and binds the mouse move handler
	start = function (event) {

		if(jimMobile.tool!=="touch")
			return;
		
		var data = event.data,
		target   = data.target,
		start    = data.start = $(event.target),
		flags    = data.flags;

		// stop any drifts
		flags.drifting = false;
		flags.hasDragged = false;

		// only start drag if the user has not explictly banned it.
		if (start.size() && !start.is(data.options.cancelOn)) {
			if($.browser.msie && $.browser.version<9) {
				//don't execute the prevent as IE8 don't drag the images' ghost.
			}
			else {
				if($("input").is(":focus") || $("textarea").is(":focus")) {
					//to trigger the focusout event from the input
				}
				else if(start.is("img")) {
					event.target.onmousedown = event.preventDefault();
				}
			}

			// without this the simple "click" event won't be recognized on touch clients
			if (!compat.touchEvents && jimMobile.isMobileDevice()) {
				event.preventDefault();
			}

//			target.css('cursor', compat.cursorGrabbing);
			target.data(datakey).dragging = flags.dragging = flags.dragged = false;

			// apply the drag listeners to the doc or target
			if(data.options.dragHold) {
				$(document).on(events.drag, data, drag);
			} else {
				target.on(events.drag, data, drag);
			}
			
			data.sizing = getSizing(target, data.options, data.sizing);
			resizeThumbs(data.thumbs, data.sizing, data.options);

			data.position = capturePosition(event, {});
			data.capture = capturePosition(event, {}, settings.captureThreshold);
			triggerEvent('dragstart', target);
		}
		if (start.size() && start.is(data.options.cancelOn)) {
			if(event.type==="mousedown") {
				event.type="click";
				$(event.target).parent().parent().trigger(event);
			}
		}

	},

	// ends the drag operation and unbinds the mouse move handler
	stop = function (event) {

		var data = event.data,
		target = data.target,
		options = data.options,
		sizing = data.sizing,
		flags = data.flags,
		thumbs = data.thumbs,

		// hides the thumbs after the animation is done
		done = function () {
			if (thumbs && !options.hoverThumbs) {
				toggleThumbs(thumbs, options, false, sizing);
			}
		};

		// remove drag listeners from doc or target
		if(options.dragHold) {
			$(document).unbind(events.drag, drag);
		} else {
			target.unbind(events.drag, drag);
		}

		// only fire events and drift if we started with a
		// valid position
		if (data.position) {

			triggerEvent('dragend', target);

			// only drift if a drag passed our threshold
			if (flags.dragging) {
				drift(target.get(0), event, done);
			} else {
				done();
			}

		}

		// only if we moved, and the mouse down is the same as
		// the mouse up target do we defer the event
		if (flags.dragging && data.start && data.start.is(event.target)) {
			deferClick(data.start);
		}
		
		if(flags.hasDragged) {
			event.preventDefault();
			if(event.type==="click")
				event.stopPropagation();
		}

		// clear all internal flags and settings
		target.data(datakey).dragging =
			data.start     =
			data.capture   =
			data.position  =
			flags.dragged  =
			flags.dragging = false;

		// set the cursor back to normal
//		target.css('cursor', compat.cursorGrab);

	},

	// Ensures that a full set of options are provided
	// for the plug-in. Also does some validation
	getOptions = function(options) {

		// fill in missing values with defaults
		options = $.extend({}, defaults, options);

		// check for inconsistent directional restrictions
		if (options.direction !== 'multi' && options.direction !== options.wheelDirection) {
			options.wheelDirection = options.direction;
		}

		// ensure positive values for deltas
		options.scrollDelta = math.abs(options.scrollDelta);
		options.wheelDelta  = math.abs(options.wheelDelta);

		// fix values for scroll offset
		options.scrollLeft = options.scrollLeft === none ? 0 : math.abs(options.scrollLeft);
		options.scrollTop  = options.scrollTop  === none ? 0 : math.abs(options.scrollTop);

		return options;

	},

	// Returns the sizing information (bounding box) for the
	// target DOM element
	getSizing = function (target, options, sizing) {

		var $target  = $(target),
		width        = parseInt($target.parent().css("width")) - parseInt($target.css("border-left-width")) - parseInt($target.css("border-right-width")),
		height       = parseInt($target.parent().css("height")) - parseInt($target.css("border-top-width")) - parseInt($target.css("border-bottom-width")),
		scrollWidth, scrollHeight;
		
		if($target.is(".radiobuttonlist, .checkboxlist, .selectionlist, .multiselectionlist")) {
			width = parseInt($target.css("width")) - parseInt($target.css("border-left-width")) - parseInt($target.css("border-right-width"));
			height = parseInt($target.css("height")) - parseInt($target.css("border-top-width")) - parseInt($target.css("border-bottom-width"));
		}
		
		if(target.scrollWidth!=undefined || target.scrollHeight!=undefined) {
			scrollWidth  = width >= target.scrollWidth ? width : target.scrollWidth,
			scrollHeight = height >= target.scrollHeight ? height : target.scrollHeight;
		}
		else if(sizing) {
			scrollWidth = $target[0].scrollWidth ? $target[0].scrollWidth : sizing.container.scrollWidth;
			scrollHeight = $target[0].scrollHeight ? $target[0].scrollHeight : sizing.container.scrollHeight;
		}

		return {
			valid: options.showThumbs,
			container: {
				width: width,
				height: height,
				scrollWidth: scrollWidth,
				scrollHeight: scrollHeight
			},
			thumbs: {
				horizontal: {
					width: width * width / scrollWidth,
					height: settings.thumbThickness,
					corner: settings.thumbThickness / 2,
					left: 0,
					top: height - settings.thumbThickness
				},
				vertical: {
					width: settings.thumbThickness,
					height: height * height / scrollHeight,
					corner: settings.thumbThickness / 2,
					left: width - settings.thumbThickness,
					top: 0
				}
			}
		};

	},

	// Attempts to get (or implicitly creates) the
	// remover function for the target passed
	// in as an argument
	getRemover = function (target, orCreate) {

		var $target = $(target), thumbs,
		data        = $target.data(datakey) || {},
		style       = $target.attr('style'),
		fallback    = orCreate ? function () {

			data = $target.data(datakey);
			thumbs = data.thumbs;

			// restore original styles (if any)
			if (style) {
				$target.attr('style', style);
			} else {
				$target.removeAttr('style');
			}

			// remove any created thumbs
			if (thumbs) {
				if (thumbs.horizontal) { thumbs.horizontal.remove(); }
				if (thumbs.vertical)   { thumbs.vertical.remove();   }
			}

			// remove any bound overscroll events and data
			$target
				.removeData(datakey)
				//.off(events.wheel,      wheel)
				.off(events.start,      start)
				.off(events.end,        stop)
				.off(events.ignored,    false);
			jQuery(window)
				.off("reloadScrollBars", reloadScroll);
			
		} : $.noop;

		return $.isFunction(data.remover) ? data.remover : fallback;

	},

	// Genterates CSS specific to a particular thumb.
	// It requires sizing data and options
	getThumbCss = function(size, options) {
		return {
			position: 'absolute',
			opacity: options.persistThumbs ? settings.thumbOpacity : 0,
			'background-color': 'black',
			width: size.width + 'px',
			height: size.height + 'px',
			'border-radius': size.corner + 'px',
			'margin': size.top + 'px 0 0 ' + size.left + 'px',
			'z-index': options.zIndex
		};
	},

	// Creates the DOM elements used as "thumbs" within
	// the target container.
	createThumbs = function(target, sizing, options) {
		var div,
		thumbs  = {},
		css     = false;

		if (options.hasHorizontal && options.direction !== 'vertical') {
			css = getThumbCss(sizing.thumbs.horizontal, options);
			div = "<div class='horizontalScroll'/>";
			thumbs.horizontal = $(div).css(css).prependTo(target);
		}
		if (options.hasVertical && options.direction !== 'horizontal') {
			css = getThumbCss(sizing.thumbs.vertical, options);
			div = "<div class='verticalScroll'/>";
			thumbs.vertical = $(div).css(css).prependTo(target);
		}

		thumbs.added = !!css;

		return thumbs;

	},
	
	resizeThumbs = function(thumbs, sizing, options) {
		var css;
		
		if (options.hasHorizontal && options.direction !== 'vertical') {
			css = getThumbCss(sizing.thumbs.horizontal, options);
			thumbs.horizontal.css("width", css.width);
		}
		if (options.hasVertical && options.direction !== 'horizontal') {
			css = getThumbCss(sizing.thumbs.vertical, options);
			thumbs.vertical.css("height", css.height);
		}
	},
	
	reloadScroll = function(event) {
		var target = event.data.target,
		data = event.data;
		target.children(".horizontalScroll").css("width", 0);
		target.children(".horizontalScroll").css("margin-top", 0);
		target.children(".horizontalScroll").css("opacity", 0);
		target.children(".verticalScroll").css("height", 0);
		target.children(".verticalScroll").css("margin-top", 0);
		target.children(".verticalScroll").css("margin-left", 0);
		target.children(".verticalScroll").css("opacity", 0);
		data.sizing = getSizing(target[0], data.options, data.sizing);
		resizeThumbs(data.thumbs, data.sizing, data.options); 
	},

	// This function takes a jQuery element, some
	// (optional) options, and sets up event metadata
	// for each instance the plug-in affects
	setup = function(target, options) {

		// create initial data properties for this instance
		options = getOptions(options);
		var sizing = getSizing(target, options, undefined),
		thumbs, data = {
			options: options, sizing: sizing,
			flags: { dragging: false },
			remover: getRemover(target, true)
		};

		// only apply handlers if the overscrolled element
		// actually has an area to scroll
		if (true) {
			// provide a circular-reference, enable events, and
			// apply any required CSS
			data.target = target = $(target).css({
				overflow: 'hidden'
//				,cursor: compat.cursorGrab
			})//.on(events.wheel, data, wheel)
			  .on(events.start, data, start)
			  .on(events.end, data, stop)
			  .on(events.scroll, data, scroll);
			
			jQuery(window).on("reloadScrollBars", data, reloadScroll);

			// apply the stop listeners for drag end
			if(options.dragHold) {
				$(document).on(events.end, data, stop);
			} else {
				data.target.on(events.end, data, stop);
			}

			// apply any user-provided scroll offsets
			if (options.scrollLeft !== null) {
				target.scrollLeft(options.scrollLeft);
			} if (options.scrollTop !== null) {
				target.scrollTop(options.scrollTop);
			}

			// add thumbs and listeners (if we're showing them)
			data.thumbs = thumbs = createThumbs(target, sizing, options);
			if (thumbs.added) {
				moveThumbs(thumbs, sizing, target.scrollLeft(), target.scrollTop());
				if (options.hoverThumbs) {
					target.on(events.hover, data, hover);
				}
			}
			target.data(datakey, data);
		}

	},

	// Removes any event listeners and other instance-specific
	// data from the target. It attempts to leave the target
	// at the state it found it.
	teardown = function(target) {
		getRemover(target)();
	},

	// This is the entry-point for enabling the plug-in;
	// You can find it's exposure point at the end
	// of this closure
	overscroll = function(options) {
		return this.removeOverscroll().each(function() {
			setup(this, options);
		});
	},

	// This function applies touch-specific CSS to enable
	// the behavior that Overscroll emulates. This function is
	// called instead of overscroll if the device supports it
	touchscroll = function(options) {
		return this.removeOverscroll().each(function() {
			var target = $(this).data(datakey, {
				remover: getRemover(this)
			}).css(compat.overflowScrolling, 'touch')
			  .css('overflow', 'auto');
			options = getOptions(options);
			if (options.scrollLeft !== null) {
				target.scrollLeft(options.scrollLeft);
			} if (options.scrollTop !== null) {
				target.scrollTop(options.scrollTop);
			}
		});
	},

	// This is the entry-point for disabling the plug-in;
	// You can find it's exposure point at the end
	// of this closure
	removeOverscroll = function() {
		return this.each(function () {
			teardown(this);
		});
	};

	// Extend overscroll to expose settings to the user
	overscroll.settings = settings;

	// Extend jQuery's prototype to expose the plug-in.
	// If the supports native overflowScrolling, overscroll will not
	// attempt to override the browser's built in support
	$.extend(namespace, {
		overscroll:         compat.overflowScrolling ? touchscroll : overscroll,
		removeOverscroll:   removeOverscroll
	});

})(window, document, navigator, Math, setTimeout, clearTimeout, jQuery.fn, jQuery);
﻿/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function($) {
	$.fn.caret=function(options){
		var txtbox=this[0];
		if(options) {
			if ($.browser.msie) {
		    	var selRange = txtbox.createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', options.start);
				selRange.moveEnd('character', options.end);
				selRange.select();
		    } else {
		    	txtbox.selectionStart=options.start;
		    	txtbox.selectionEnd=options.end;
		    }
			txtbox.focus();
			return this;
		}
		else {
			if ($.browser.msie) {
				return getCaretPosIE(txtbox);
		    } else {
		        return getCaretPosGecko(txtbox);
		    }
		}
		
	    function getCaretPosGecko(txtbox) {
	    	txtbox.focus();
	        return {start:txtbox.selectionStart, end:txtbox.selectionEnd};
	    }
		
	    function getCaretPosIE(txtbox) {        
	        return {start:txtbox.value.length, end:txtbox.value.length};
	    }	
	}
})(jQuery);
/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function (window, undefined) {
  jQuery("#simulation")
  .on('mousedown', ".radiobutton", function(event) {
	var $target = jQuery(event.target),
	target = event.target,
	disabled = $target.attr("disabled") && $target.attr("disabled").length>0;
	
	if(!disabled) {
		if(!$target.attr("name")) {
			$target.attr("checked", true);
		}
		else {
			//radios inside groups
			radioGroup($target).each(function() { 
		      if (this===target) { 
		          $(this).attr("checked", true);
		      } else { 
		          $(this).attr("checked", false);
		          jimUtil.forceReflow();
		      } 
		    });
			//radiobutton list
			radioList($target).each(function() { 
		      if (this===target) { 
		          $(this).attr("checked", true);
		      } else { 
		          $(this).attr("checked", false);
		          jimUtil.forceReflow();
		      } 
		    });
		}
	}
  })
  .on('mousedown', ".checkbox", function(event) {
	var $target = jQuery(event.target),
	disabled = $target.attr("disabled") && $target.attr("disabled").length>0,
	selected = ($target.attr("checked") && ($target.attr("checked")==="checked" || $target.attr("checked")===true));
	
	if(!disabled) {
		if(selected===undefined || selected===false) {
			$target.attr("checked", true);
		}
		else if(selected===true) {
			$target.attr("checked", false);
		}
	}
  });
  
  radioGroup = function($radio) { 
	var name = $radio.attr("name"), 
	form = jQuery("#simulation"), 
	radios = $( [] ); 
	if (name) { 
	  if (form) { 
	    radios = $(form).find( "[name='" + name + "']" ); 
	  } else { 
	    radios = $( "[name='" + name + "']", radio.ownerDocument ) 
	    .filter(function() { 
	       return !this.form; 
	    }); 
	  } 
	} 
	return radios; 
  }; 
  
  radioList = function($radio) { 
    var form = $radio.closest(".collapse"), 
	radios = $( [] ); 
	if (form) { 
	  radios = $(form).find(".radiobutton"); 
	} else { 
	  radios.add($radio);
	} 
	return radios; 
  }; 

})(window);/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function (window, undefined) {
  jQuery("#simulation")
  .on("click", ".nativedropdown > *", function(event, data) {
	var $target = jQuery(event.target.parentElement || event.srcElement.parentElement).closest(".nativedropdown");
	$target.removeClass("pressed").addClass("pressed");
  })
})(window);/*!
 * Copyright 2013 Justinmind. All rights reserved.
 */

(function(window, undefined) {
	
	
	var iphone_kb = {
		letters : [
			[ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p" ],
			[ "a", "s", "d", "f", "g", "h", "j", "k", "l" ],
			[ "shift", "z", "x", "c", "v", "b", "n", "m", "backspace" ], 
			[ "numbers", "space", "return" ] 
		],
		numbers : [
			[ "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" ],
			[ "&#150;", "&#47;", "&#58;", "&#59;", "&#40;", "&#41;", "&#36;", "&#38;", "&#64;", "&#34;" ],
			[ "signs", "&#46;", "&#44;", "&#63;", "&#33;", "&#39;", "backspace" ],
			[ "letters", "space", "return" ]
		],
		signs: [
			[ "&#91;", "&#93;", "&#123;", "&#125;", "&#35;", "&#37;", "&#136;", "&#42;", "&#43;", "&#61;" ],
			[ "&#95;", "&#92;", "&#124;", "&#126;", "&#60;", "&#62;", "&#128;", "&#163;", "&#165;", "&#149;" ],
			[ "numbers", "&#46;", "&#44;", "&#63;", "&#33;", "&#39;", "backspace" ],
			[ "letters", "space", "return" ]
		]
	},
	months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
	daysCompressed = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
	monthsCompressed = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
	periods = [ "AM", "PM" ],
	input,
	initialInputValue,
	pressedTarget, 
	ddSize, currentMonth, currentWeekday, currentDay, currentYear,
	dragStart=false;
	
	
	/*********************** START KEYBOARD METHODS ************************/
	
	function createKeyboard() {
		var key="";
		var html = '<div id="jim-iphone-kb" onselectstart="return false;">';
		$.each(iphone_kb, function(key, value) {
			html += ('<div id="' + key + '">');
			$.each(this, function(key, value) {
				html += '<ul>';
				$.each(this, function(key, value) {
					if(value==="." || value==="," || value==="?" || value==="!" || value==="'")
						html += ('<li class="' + value + ' .bubble"></li>');
					else html += ('<li class="' + value + '"></li>');
				});
				html += '</ul>';
			});
			html += '</div>';
		});
		html += '</div>';
		
		jQuery("#jim-container").append(html);
	}
	
	function bindKeyboard() {
		jQuery("#jim-iphone-kb").on("mouseup", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "SPAN") {
				realTarget = jQuery(realTarget.parentElement.parentElement).context;
			}
			if (realTarget.tagName === "LI" && realTarget===pressedTarget) {
				var key = realTarget.className;
				if(key) {
					switch(key){
						case "letters":
							jQuery("#letters").css('display', 'block');
							jQuery("#numbers").css('display', 'none');
							jQuery("#signs").css('display', 'none');
							deactivateSpecialKeys();
							break;
						case "numbers":
							jQuery("#numbers").css('display', 'block');
							jQuery("#signs").css('display', 'none');
							deactivateSpecialKeys();
							break;
						case "signs":
							jQuery("#signs").css('display', 'block');
							deactivateSpecialKeys();
							break;
						default:
							changeValueByKeyboard(input, key);
							break;
					}
				}
			}
			jQuery(".divBubble").remove();
			jQuery(".divBubbleBig").remove();
		});
		
		jQuery("#jim-iphone-kb").on("mousedown", function(event, data) {
			var realTarget = event.target || event.srcElement;
			pressedTarget = realTarget;
			if (realTarget.tagName === "LI") {
				var key = realTarget.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "space":
						jQuery(".space").removeClass("pressed").addClass("pressed");
						break;
					case "backspace":
						jQuery(".backspace").removeClass("pressed").addClass("pressed");
						break;
					case "return":
						jQuery(".return").removeClass("pressed").addClass("pressed");
						break;
					default:
						if(key.length===1) {
							var keyBubble = "",
							zoom = jimMobile.getZoom();
							if(key==="." || key==="," || key==="?" || key==="!" || key==="'") {
								var topPos = (jQuery(pressedTarget).position().top*zoom)-60;
								var leftPos = (jQuery(pressedTarget).position().left*zoom)-3;
								if(jimMobile.orientation()==="landscape") {
									topPos-=11;
								}
								var marginLeft = parseInt(jQuery(pressedTarget).css('margin-left'));
								keyBubble = "<div class='divBubbleBig' ";
							}
							else {
								var topPos = (jQuery(pressedTarget).position().top*zoom)-66;
								var leftPos = (jQuery(pressedTarget).position().left*zoom)-16;
								if(jimMobile.orientation()==="landscape") {
									topPos-=1;
									leftPos+=2;
								}
								var marginLeft = parseInt(jQuery(pressedTarget).css('margin-left'));
								keyBubble = "<div class='divBubble' ";
							}
							keyBubble += " style='top: " + topPos + "px; left: " + leftPos + "px; margin-left:" + marginLeft +"px; position: absolute;'><span class='keyBubble'>" + key.toUpperCase() + "</span></div>";
							jQuery(pressedTarget).append(keyBubble);
						}
						break;
				}
				event.preventDefault();
			}
		});
		
		jQuery("#jim-iphone-kb").on("dblclick", function(event, data) {
			if (event.target.tagName === "LI") {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				if(key === "shift") {
					var hasCaps = jQuery(".shift.caps");
					var hasCapsLock = jQuery(".shift.capsLock");
					if(hasCaps.length>0)
						jQuery(".shift").removeClass("caps").addClass("capsLock");
					else if(hasCapsLock.length>0)
						jQuery(".shift").removeClass("capsLock");
					else 
						jQuery(".shift").addClass("capsLock");
				}
			}
		});
		
		jQuery("#jim-iphone-kb").on("mouseleave", function(event, data) {
		  if(pressedTarget) {
			jQuery(".divBubble").remove();
		    jQuery(".divBubbleBig").remove();
		    pressedTarget=null;
		  }
		});
	}

	function deactivateSpecialKeys() {
		jQuery(".shift").removeClass("caps").removeClass("capsLock");
		jQuery(".space").removeClass("pressed");
		jQuery(".backspace").removeClass("pressed");
		jQuery(".return").removeClass("pressed");
	}

	function changeValueByKeyboard($target, newKey) {
		var action, type, oldValue = "", startPos=0;
	    type = $target.jimGetType();
		switch(type) {
		  case itemType.text:
		  case itemType.password:
			oldValue = $target.find("input").val();
			startPos = $target.find("input").caret().start;
			action = applyNewValue(oldValue, newKey, $target.find("input"));
			if(action.key==="return")
				$target.find("input").val(jimUtil.fromHTML(action.newValue));
			else $target.find("input").val(jimUtil.fromHTML(action.newValue)).caret({start: startPos+action.caretDespl, end:startPos+action.caretDespl});
			break;
		  case itemType.textarea:
			oldValue = $target.val();
			startPos = $target.caret().start;
			action = applyNewValue(oldValue, newKey, $target);
			if(action.key==="return") 
				$target.val(jimUtil.fromHTML(action.newValue));
			else $target.val(jimUtil.fromHTML(action.newValue)).caret({start: startPos+action.caretDespl, end:startPos+action.caretDespl});
			break;
		}
		input.closest(".firer").trigger("keyup.jim", [{"preventTrigger": true, "altKey":false, "ctrlKey":false, "shiftKey":false, "which": newKey.toLowerCase().charCodeAt(0)-32 }]);
	}

	function applyNewValue(oldValue, newKey, $target) {
		var newValue, hasCaps, beforeCaret, afterCaret, caretDespl;
		newValue=oldValue;
		hasCaps = jQuery(".shift.caps, .shift.capsLock");
		if(newKey.indexOf(" ")>0)
			newKey=newKey.substring(0, newKey.indexOf(" "));
		if(hasCaps.length>0 && newKey.length===1)
			newKey = newKey.toUpperCase();
			
		//calculate value before and after caret	
		beforeCaret = oldValue.substring(0, $target.caret().start);
		afterCaret = oldValue.substring($target.caret().end);
			
		switch(newKey) {
			case "space":
				newValue = beforeCaret + " " + afterCaret;
				jQuery(".space").removeClass("pressed");
				caretDespl = 1;
				break;
			case "backspace":
				newValue = (beforeCaret.length>0) ? beforeCaret.substring(0, beforeCaret.length-1) : "";
				newValue += afterCaret; 
				jQuery(".backspace").removeClass("pressed");
				caretDespl = -1;
				break;
			case "shift":
				if(hasCaps.length>0)
					jQuery(".shift").removeClass("caps").removeClass("capsLock");
				else jQuery(".shift").addClass("caps");
				caretDespl = 0;
				break;
			case "return":
				jQuery("#jim-iphone-kb").hide("slide", { direction: "down" }, 450);
				deactivateSpecialKeys();
				if(initialInputValue!==newValue) {
					input.closest(".firer").trigger("change");
				}
				input.find("input:focus").blur();
				caretDespl = 0;
				break;
			default:
				newValue = beforeCaret + newKey + afterCaret;
				jQuery(".shift").removeClass("caps");
				caretDespl = 1;
				break;
		}
		
		return {newValue: newValue, caretDespl: caretDespl, key: newKey};
	}

	function setStartCaretPosition($target) {
		var endPos=0;
		type = $target.jimGetType();
		switch(type) {
		  case itemType.text:
		  case itemType.password:
			endPos = $target.find("input").val().length;
			$target.find("input").caret({start: endPos, end: endPos});
			break;
		  case itemType.textarea:
			endPos = $target.val().length;
			$target.caret({start: endPos, end: endPos});
			break;
		}
	}
	
	/*********************** END KEYBOARD METHODS ************************/
	
	/*********************** START DROPDOWN METHODS ************************/
	
	function createDropDown() {
		var html = '<div id="jim-iphone-dd" onselectstart="return false;"><div id="jim-iphone-dd_controls"><div class="dd_controls-done"></div></div><div id="jim-iphone-dd_options"><div class="dd_options"></div></div></div>';
		jQuery("#jim-container").append(html);
		jQuery('.dd_options').draggable({ axis: "y" });
	}
	
	function bindDropDown() {
		jQuery("#jim-iphone-dd").on("mouseup", function(event, data) {
			var realTarget = event.target || event.srcElement,
			zoom = jimMobile.getZoom();
			if(dragStart) {
				dragStart = false;
				var topPos=-5,
				childHeight = parseInt(jQuery(".options").height()) + parseInt(jQuery(".options").css('padding-top'));
				
				if(jQuery("#jim-case").hasClass("portrait") && parseInt(jQuery(".dd_options").position().top)*zoom>77)
					topPos = 77;
				else if(jQuery("#jim-case").hasClass("landscape") && parseInt(jQuery(".dd_options").position().top)*zoom>51)
					topPos = 51;
				else if(jQuery("#jim-case").hasClass("portrait") && parseInt(jQuery(".dd_options").position().top)*zoom<-(((ddSize-3)*childHeight)-7))
					topPos = -(childHeight*(ddSize-3))-7;
				else if(jQuery("#jim-case").hasClass("landscape") && parseInt(jQuery(".dd_options").position().top)*zoom<-(((ddSize-3)*childHeight)-33))
					topPos = -(childHeight*(ddSize-3))-33;
				else {
					var calc = parseInt(jQuery(".dd_options").css('top'))*zoom;
					for(var i=0; i<jQuery(".dd_options").children().length; i++) {
						var child = jQuery(".dd_options").children()[i];
						if(calc<0 && calc+childHeight>0) {
							if(jQuery("#jim-case").hasClass("portrait"))
								topPos = -(childHeight*(i+1))-5;
							else topPos = -(childHeight*(i+1))+9; 
							break;
						}
						calc += childHeight;
					}
				}
				
				jQuery(".dd_options").animate({ "top" : topPos + "px"});
			}
			else if (realTarget.tagName === "DIV" && !dragStart) {
				var key = realTarget.className;
				if(key) {
					if(key.indexOf(" ")>0)
						key=key.substring(0, key.indexOf(" "));
					switch(key) {
						case "dd_options":
						case "tock":
							//case for IE on option without value
							if(jQuery(".dd_options .pressed").position()===undefined)
								break;
						case "options":
							jQuery(".dd_options .selected").removeClass("selected");
							var $target = jQuery(".dd_options .pressed");
							$target.removeClass("pressed").addClass("selected");
							jQuery(".dd_options .tock").remove();
							$target.append('<div class="tick"></div>');
							if(jQuery("#jim-case").hasClass("portrait"))
								jQuery(".dd_options").animate({ "top" : 77-($target.position().top*zoom) + "px"});
							else jQuery(".dd_options").animate({ "top" : 51-($target.position().top*zoom) + "px"});
							setDropDrownValue(input);
							var value = $target.text();
							if(initialInputValue!==value) {
								input.closest(".firer").trigger("change");
								initialInputValue = value;
							}
							break;
						case "dd_controls-done":
							jQuery(".dd_controls-done").removeClass("pressed");
							jQuery("#jim-iphone-dd").hide("slide", { direction: "down" }, 450);
							break;
					}
				}
			}
		});
		
		jQuery("#jim-iphone-dd").on("mousedown", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && !dragStart) {
				var key = event.target.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "tick":
					case "tock":
						//case for IE on option without value
					case "options":
						var $target = jQuery(event.target).closest(".options"),
						$currentPressed = jQuery(".dd_options .selected");
						
						if($target[0]===$currentPressed[0]) {
							jQuery("#jim-iphone-dd_options .dd_options .tick").removeClass("tick").addClass("tock");
							jQuery("#jim-iphone-dd_options .dd_options .pressed").removeClass("pressed");
							$target.removeClass("pressed").addClass("pressed");
						}
						else {
							jQuery("#jim-iphone-dd_options .dd_options .tick").removeClass("tick").addClass("tock").hide();
							jQuery("#jim-iphone-dd_options .dd_options .pressed").removeClass("pressed");
							$target.removeClass("pressed").addClass("pressed");			
						}
						break;
					case "dd_controls-done":
						jQuery(".dd_controls-done").removeClass("pressed").addClass("pressed");
						jQuery(".nativedropdown").removeClass("pressed");
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
		
		
		
		jQuery("#jim-iphone-dd").on("dragstart", function(event, data) {
			if(jQuery(event.target).closest("#jim-iphone-dd_options").length>0) {
				jQuery("#jim-iphone-dd_options .dd_options .pressed").removeClass("pressed");
				jQuery("#jim-iphone-dd_options .dd_options .tock").removeClass("tock").addClass("tick").show();
				dragStart = true;
			}
		});
		
		jQuery("#jim-iphone-dd").on("drag", function(event, data) {
			if(dragStart) {
				var offset = jQuery("#jim-iphone-dd_options").offset(),
				dd_width = parseInt(jQuery("#jim-iphone-dd_options").css('width')),
				dd_height = parseInt(jQuery("#jim-iphone-dd_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					var childHeight = parseInt(jQuery(".options").height()) + parseInt(jQuery(".options").css('padding-top'));
					if(jQuery("#jim-case").hasClass("portrait"))
						jQuery("#jim-iphone-dd_options .dd_options").animate({ "top" : -(childHeight*(ddSize-3))-7 +"px"});
					else jQuery("#jim-iphone-dd_options .dd_options").animate({ "top" : -(childHeight*(ddSize-3))-33 +"px"});
					dragStart=false;
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					if(jQuery("#jim-case").hasClass("portrait"))
						jQuery("#jim-iphone-dd_options .dd_options").animate({ "top" : 77 + "px"});
					else jQuery("#jim-iphone-dd_options .dd_options").animate({ "top" : 51 + "px"});
					dragStart=false;
				}
			}
			
		});
		
	}
	
	function fillDropDownOptions($target) {
		var type = $target.jimGetType();
		jQuery(".dd_options >").remove();
		switch(type) {
			case itemType.dropdown:
			case itemType.nativedropdown:
				var html = "";
				$holder = jQuery("#"+$target.attr("id")+"-options");
	            $options = $holder.find(".option");
	            ddSize = $options.length;
	            defaultValue = $target.children(".valign").children(".value").text();
	            var newOption, selectedPos=0;
	            for(i=0, iLen=ddSize; i<iLen; i++) {
	            	newOption = "<div class='options";
	            	if(defaultValue === jQuery($options[i]).text()) {
	            		selectedPos = i;
	            		newOption += " selected'>" + jQuery($options[i]).text() + "<div class='tick'></div></div>";		
	            	}
	            	else {
	            		newOption += "'>" + jQuery($options[i]).text() + "</div>";
	            	}
	            	html += newOption;
	            }
				jQuery(".dd_options").append(html);
				
				var childHeight = parseInt(jQuery(".options").height()) + parseInt(jQuery(".options").css('padding-top'));
				if(jQuery("#jim-case").hasClass("portrait"))
					jQuery(".dd_options").animate({ "top" : -(selectedPos*childHeight) + 77 + "px"});
				else jQuery(".dd_options").animate({ "top" : -(selectedPos*childHeight) + 51 + "px"});
				
				break;
		}
	}
	
	function setDropDrownValue($target) {
		var type = $target.jimGetType();
		switch(type) {
			case itemType.dropdown:
			case itemType.nativedropdown:
				$options = $target.children(".dropdown-options").children(".option").removeClass("selected").removeAttr("selected");
				var value = jQuery(".dd_options .options.selected").text();
				for(o=0, oLen=$options.length; o<oLen; o+=1) {
				  option = $options[o];
				  if(option.textContent === value || option.innerText === value) {
				    jQuery(option).addClass("selected");
				    jQuery(option).attr("selected","selected");
				    $target.find(".value").html(jimUtil.toHTML(value));
				    return false;
				  }
				}
				break;
		}
	}
	
	/*********************** END DROPDOWN METHODS ************************/
	
	/*********************** START DATE METHODS ************************/
	
	function createDate() {
		var html = "";
		if($.browser.msie)
			html = '<div id="jim-iphone-da" onselectstart="return false;"><div id="jim-iphone-da_options"><div class="jim-iphone-da_mark"></div><div class="da_months"></div><div class="da_days"></div><div class="da_years"></div></div></div>';
		else html = '<div id="jim-iphone-da"><div id="jim-iphone-da_options"><div class="da_months"></div><div class="da_days"></div><div class="da_years"></div></div><div class="jim-iphone-da_mark"></div></div>';
		jQuery("#jim-container").append(html);
		
		jQuery('#jim-iphone-da_options .da_months').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery('#jim-iphone-da_options .da_days').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery('#jim-iphone-da_options .da_years').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
	}
	
	function bindDate() {
		bindDays();
		bindMonths();
		bindYears();
	}
	
	/** DAYS **/
	function bindDays() {
		jQuery("#jim-iphone-da_options .da_days").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				
				var ddTop = parseInt(jQuery("#jim-iphone-da_options .da_days").css('top'));
				if((ddTop+214)>21) {
					var offset = -214-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-da_options .da_days").animate({'top' : -214-(despl*42) + 'px'}, function() {
						restoreDefaultDADays(despl);
						jQuery("#jim-iphone-da_options .da_days").css('top', -214 + 'px');
						autoCorrectDate();
					});
				}
				else if((ddTop+214)<-21) {
					var offset = -214-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-da_options .da_days").animate({'top' : -214-(despl*42) + 'px'}, function() {
						restoreDefaultDADays(despl);
						jQuery("#jim-iphone-da_options .da_days").css('top', -214 + 'px');
						autoCorrectDate();
					});
				}
				else jQuery("#jim-iphone-da_options .da_days").animate({'top': -214 + 'px'}, function() {
					setDateValue();
				});
			}
		});
		
		jQuery('#jim-iphone-da_options .da_days').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-da_options .da_days').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-da_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-da_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-da_options .da_days").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-da_options .da_days").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function autoCorrectDate() {
		var disabled = jQuery("#jim-iphone-da_options .da_days :nth-child(8)").hasClass("disabled");
		
		if(disabled) {
			moveDigits(jQuery("#jim-iphone-da_options .da_days :nth-child(8)"));
		}
		else setDateValue();
	}

	function moveDigits(disabledSelected) {
		var day = parseInt(disabledSelected.text());
		var disabledDays = 1;
		for(var i=8;i<=9;i++) {
			if(jQuery("#jim-iphone-da_options .da_days :nth-child(" + (jQuery("#jim-iphone-da_options .da_days").children().length-i) +")").hasClass("disabled"))
				disabledDays++;
		} 
		
		jQuery("#jim-iphone-da_options .da_days").animate({'top' : -214+(42*disabledDays)+'px'}, function() {
			restoreDefaultDADays(-disabledDays);
			setDateValue();
		});
	}

	function restoreDefaultDADays(offset) {

		var currentDayList = jQuery("#jim-iphone-da_options .da_days").children();
		var firstDay = parseInt(jQuery("#jim-iphone-da_options .da_days :first-child").text(), 10);
		var newStartDay = firstDay+offset;
		
		for(var i=0; i<currentDayList.length; i++) {
			var item = jQuery(currentDayList[i]);
			var value = (newStartDay + i);
			value = (value+31)%31;
			if(value==0) value=31;
			var oldValue = (firstDay + i)
			oldValue = (oldValue+31)%31;
			if(oldValue==0) oldValue=31;
			
			
			item.removeClass("day" + oldValue);
			item.removeClass("selected").removeClass("disabled");
			item.addClass("day" + value);
			item.text(value);
		}

		checkDate();	
		jQuery("#jim-iphone-da_options .da_days").css('top', -214 + 'px');

	}

	function checkDate() {
		var month = jQuery("#jim-iphone-da_options .da_months :nth-child(8)").text();
		var day = parseInt(jQuery("#jim-iphone-da_options .da_days :nth-child(8)").text(), 10);
		var year = parseInt(jQuery("#jim-iphone-da_options .da_years :nth-child(8)").text());
		jQuery("#jim-iphone-da_options .days").removeClass("disabled");
		
		monthPos = jQuery.inArray(month, months);
		if(monthPos<7 && monthPos%2===1) {
			jQuery("#jim-iphone-da_options .day31").addClass("disabled");
		}
		else if(monthPos>=7 && monthPos%2===0) {
			jQuery("#jim-iphone-da_options .day31").addClass("disabled");
		}
		
		if(month==="February") {
			jQuery("#jim-iphone-da_options .day30").addClass("disabled");
		}
		
		if(year%4!==0 && month==="February") {
			jQuery("#jim-iphone-da_options .day29").addClass("disabled");
		}
		
		var currentDate = new Date(),
		currentMonth = currentDate.getMonth(),
		currentDay = currentDate.getDate(),
		currentYear = currentDate.getFullYear();
		jQuery(".da_days .days.day" + currentDay).addClass("selected");
		jQuery(".da_months .months.month" + currentMonth).addClass("selected");
		jQuery(".da_years .years.year" + currentYear).addClass("selected");	
	}

	/** MONTHS **/
	function bindMonths() {
		jQuery("#jim-iphone-da_options .da_months").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				
				var ddTop = parseInt(jQuery("#jim-iphone-da_options .da_months").css('top'));
				if((ddTop+214)>21) {
					var offset = -214-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-da_options .da_months").animate({'top' : -214-(despl*42) + 'px'}, function() {
						restoreDefaultDAMonths(despl);
						jQuery("#jim-iphone-da_options .da_months").css('top', -214 + 'px');
						autoCorrectDate();
					});
				}
				else if((ddTop+214)<-21) {
					var offset = -214-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-da_options .da_months").animate({'top' : -214-(despl*42) + 'px'}, function() {
						restoreDefaultDAMonths(despl);
						jQuery("#jim-iphone-da_options .da_months").css('top', -214 + 'px');
						autoCorrectDate();
					});
				}
				else jQuery("#jim-iphone-da_options .da_months").animate({'top': -214 + 'px'}, function() {
					setDateValue();
				});
			}
		});

		jQuery('#jim-iphone-da_options .da_months').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-da_options .da_months').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-da_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-da_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-da_options .da_months").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-da_options .da_months").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDAMonths(offset) {
		var currentMonthList = jQuery("#jim-iphone-da_options .da_months").children();
		var firstMonth = jQuery("#jim-iphone-da_options .da_months :first-child").text();
		var newStartMonth = jQuery.inArray(firstMonth, months)+offset;
		var oldStartMonth = jQuery.inArray(firstMonth, months);
		
		for(var i=0; i<currentMonthList.length; i++) {
			var item = jQuery(currentMonthList[i]);
			var value = (newStartMonth + i);
			value = (value+12)%12;
			if(value==12) value=0;
			var oldValue = (oldStartMonth + i)
			oldValue = (oldValue+12)%12;
			if(oldValue==12) oldValue=0;
			
			item.removeClass("month" + oldValue);
			item.removeClass("selected");
			item.addClass("month" + value);
			item.text(months[value]);
		}

		checkDate();	
		jQuery("#jim-iphone-da_options .da_months").css('top', -214 + 'px');

	}

	/** YEARS **/
	function bindYears() {
		jQuery("#jim-iphone-da_options .da_years").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				
				var ddTop = parseInt(jQuery("#jim-iphone-da_options .da_years").css('top'));
				if((ddTop+214)>21) {
					var offset = -214-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-da_options .da_years").animate({'top' : -214-(despl*42) + 'px'}, function() {
						restoreDefaultDAYears(despl);
						jQuery("#jim-iphone-da_options .da_years").css('top', -214 + 'px');
						autoCorrectDate();
					});
				}
				else if((ddTop+214)<-21) {
					var offset = -214-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-da_options .da_years").animate({'top' : -214-(despl*42) + 'px'}, function() {
						restoreDefaultDAYears(despl);
						jQuery("#jim-iphone-da_options .da_years").css('top', -214 + 'px');
						autoCorrectDate();
					});
				}
				else jQuery("#jim-iphone-da_options .da_years").animate({'top': -214 + 'px'}, function() {
					setDateValue();
				});
			}
		});
		
		jQuery('#jim-iphone-da_options .da_years').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-da_options .da_years').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-da_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-da_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-da_options .da_years").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-da_options .da_years").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDAYears(offset) {
		var currentYearList = jQuery("#jim-iphone-da_options .da_years").children();
		var firstYear = parseInt(jQuery("#jim-iphone-da_options .da_years :first-child").text());
		var newStartYear = firstYear+offset;
		
		for(var i=0; i<currentYearList.length; i++) {
			var item = jQuery(currentYearList[i]);
			var value = (newStartYear + i);
			var oldValue = (firstYear + i)
			
			item.removeClass("year" + oldValue);
			item.removeClass("selected");
			item.addClass("year" + value);
			item.text(value);
		}

		checkDate();	
		jQuery("#jim-iphone-da_options .da_years").css('top', -214 + 'px');

	}

	function fillDate() {
		var currentMonth, currentDay, currentYear, html = "";
		var currentValue = input.find("input").val();
		if(currentValue==="") {
			var currentDate = new Date();
			currentMonth = currentDate.getMonth();
			currentDay = currentDate.getDate();
			currentYear = currentDate.getFullYear();
		}
		else {
			currentMonth = parseInt(currentValue.substring(0, currentValue.indexOf("/")), 10)-1;
			currentDay = parseInt(currentValue.substring(currentValue.indexOf("/")+1, currentValue.lastIndexOf("/")), 10);
			currentYear = parseInt(currentValue.substring(currentValue.lastIndexOf("/")+1), 10);
		}
		
		//months
		for(var i=currentMonth-7;i<=currentMonth+7;i++) {
			var val = i;
			val = (val+12)%12;
			if(val===12) val=0;
			html += "<div class='months month" + val + "'>" + months[val] + "</div>";
		}
		jQuery("#jim-iphone-da_options .da_months").html(html);
		jQuery("#jim-iphone-da_options .da_months .months.month" + new Date().getMonth()).addClass("selected");
		
		//days
		html = "";
		for(var i=currentDay-7;i<=currentDay+7;i++) {
			var val = i;
			val = (val+31)%31;
			if(val===0) val=31;
			html += "<div class='days day" + val + "'>" + val + "</div>"; 
		}
		jQuery("#jim-iphone-da_options .da_days").html(html);
		jQuery("#jim-iphone-da_options .da_days .days.day" + new Date().getDate()).addClass("selected");
		
		//years
		html = "";
		for(var i=currentYear-7;i<=currentYear+7;i++) {
			var val = i;
			html += "<div class='years year" + val + "'>" + val + "</div>"; 
		}
		jQuery("#jim-iphone-da_options .da_years").html(html);
		jQuery("#jim-iphone-da_options .da_years .years.year" + new Date().getFullYear()).addClass("selected");
		
		checkDate();
		setDateValue();
	}
	
	function setDateValue() {
		var month = jQuery("#jim-iphone-da_options .da_months :nth-child(8)").text(),
		day = parseInt(jQuery("#jim-iphone-da_options .da_days :nth-child(8)").text()),
		year = parseInt(jQuery("#jim-iphone-da_options .da_years :nth-child(8)").text());
		var value = jQuery.inArray(month, months)+1;
		if(value.toString().length===1) value = "0" + value;
		if(day.toString().length===1) day = "0" + day;
		value = value + "/" + day + "/" + year;
		
		input.find("input").val(jimUtil.fromHTML(value));
		if(initialInputValue!==value) {
			input.closest(".firer").trigger("change");
			initialInputValue = value;
		}
	}
	
	/*********************** END DATE METHODS ************************/
	
	/*********************** START TIME METHODS ************************/
	
	function createTime() {
		var html = "";
		if($.browser.msie)
			html = '<div id="jim-iphone-ti" onselectstart="return false;"><div id="jim-iphone-ti_controls"><div class="ti_controls-clear"></div><div class="ti_controls-done"></div></div><div id="jim-iphone-ti_options"><div class="jim-iphone-ti_mark"></div><div class="ti_hours"></div><div class="ti_minutes"></div><div class="ti_periods"></div></div></div>';
		else html = '<div id="jim-iphone-ti"><div id="jim-iphone-ti_controls"><div class="ti_controls-clear"></div><div class="ti_controls-done"></div></div><div id="jim-iphone-ti_options"><div class="ti_hours"></div><div class="ti_minutes"></div><div class="ti_periods"></div></div><div class="jim-iphone-ti_mark"></div></div>';
		jQuery("#jim-container").append(html);
		
		jQuery('#jim-iphone-ti_options .ti_hours').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery('#jim-iphone-ti_options .ti_minutes').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery('#jim-iphone-ti_options .ti_periods').draggable({ axis: "y" });
	}
	
	function bindTime() {
		bindTimeHours();
		bindTimeMinutes();
		bindTimePeriods();
	}
	
	/** CONTROLS **/
	function bindTimeControls() {
		jQuery("#jim-iphone-ti").on("mouseup", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && !dragStart) {
				var key = realTarget.className;
				if(key) {
					if(key.indexOf(" ")>0)
						key=key.substring(0, key.indexOf(" "));
					switch(key) {
						case "ti_controls-clear":
							jQuery("#jim-iphone-ti_controls .ti_controls-clear").removeClass("pressed");
							clearTimeValue(input);
							break;
						case "ti_controls-done":
							jQuery("#jim-iphone-ti_controls .ti_controls-done").removeClass("pressed");
							jQuery("#jim-iphone-ti").hide("slide", { direction: "down" }, 450);
							input.find("input").blur();
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery("#jim-iphone-ti").on("mousedown", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && !dragStart) {
				var key = realTarget.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "ti_controls-clear":
					case "ti_controls-done":
						jQuery(event.target).removeClass("pressed").addClass("pressed");
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
	}
	
	/** HOURS **/
	function bindTimeHours() {
		jQuery("#jim-iphone-ti_options .ti_hours").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var value = 214;
				
				if(jQuery("#jim-case").hasClass("landscape"))
					value = 238;
				
				var ddTop = parseInt(jQuery("#jim-iphone-ti_options .ti_hours").css('top'));
				if((ddTop+value)>21) {
					var offset = -value-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-ti_options .ti_hours").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultTIHours(despl);
						jQuery("#jim-iphone-ti_options .ti_hours").css('top', -value + 'px');
						setTimeValue(input);
					});
				}
				else if((ddTop+value)<-21) {
					var offset = -value-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-ti_options .ti_hours").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultTIHours(despl);
						jQuery("#jim-iphone-ti_options .ti_hours").css('top', -value + 'px');
						setTimeValue(input);
					});
				}
				else jQuery("#jim-iphone-ti_options .ti_hours").animate({'top': -value + 'px'}, function() {
					setTimeValue(input);
				});
			}
		});

		jQuery('#jim-iphone-ti_options .ti_hours').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-ti_options .ti_hours').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-ti_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-ti_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-ti_options .ti_hours").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-ti_options .ti_hours").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}
	
	function restoreDefaultTIHours(offset) {
		var currentHourList = jQuery("#jim-iphone-ti_options .ti_hours").children();
		var firstHour = parseInt(jQuery("#jim-iphone-ti_options .ti_hours :first-child").text(), 10);
		var newStartHour = firstHour+offset;
		
		for(var i=0; i<currentHourList.length; i++) {
			var item = jQuery(currentHourList[i]);
			var value = (newStartHour + i + 12)%12;
			if(value===0) value=12;
			if(value.toString().length===1) value = "0"+value;
			var oldValue = (firstHour + i + 12)%12;
			if(oldValue===0) oldValue=12;
			if(oldValue.toString().length===1) oldValue = "0"+oldValue;
			
			item.removeClass("hour" + oldValue);
			item.addClass("hour" + value);
			item.text(value);
		}
		
		var value = 214;
		if(jQuery("#jim-case").hasClass("landscape"))
			value = 238;

		jQuery("#jim-iphone-ti_options .ti_hours").css('top', -value + 'px');

	}
	
	/** MINUTES **/
	function bindTimeMinutes() {
		jQuery("#jim-iphone-ti_options .ti_minutes").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var value = 214;
				
				if(jQuery("#jim-case").hasClass("landscape"))
					value = 238;
				
				var ddTop = parseInt(jQuery("#jim-iphone-ti_options .ti_minutes").css('top'));
				if((ddTop+value)>21) {
					var offset = -value-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-ti_options .ti_minutes").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultTIMinutes(despl);
						jQuery("#jim-iphone-ti_options .ti_minutes").css('top', -value + 'px');
						setTimeValue(input);
					});
				}
				else if((ddTop+value)<-21) {
					var offset = -value-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-ti_options .ti_minutes").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultTIMinutes(despl);
						jQuery("#jim-iphone-ti_options .ti_minutes").css('top', -value + 'px');
						setTimeValue(input);
					});
				}
				else jQuery("#jim-iphone-ti_options .ti_minutes").animate({'top': -value + 'px'}, function() {
					setTimeValue(input);
				});
			}
		});

		jQuery('#jim-iphone-ti_options .ti_minutes').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-ti_options .ti_minutes').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-ti_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-ti_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-ti_options .ti_minutes").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-ti_options .ti_minutes").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultTIMinutes(offset) {
		var currentMinuteList = jQuery("#jim-iphone-ti_options .ti_minutes").children();
		var firstMinute = parseInt(jQuery("#jim-iphone-ti_options .ti_minutes :first-child").text(), 10);
		var newStartMinute = firstMinute+offset;
		
		for(var i=0; i<currentMinuteList.length; i++) {
			var item = jQuery(currentMinuteList[i]);
			var value = (newStartMinute + i + 60)%60;
			if(value.toString().length===1) value = "0"+value;
			var oldValue = (firstMinute + i + 60)%60;
			if(oldValue.toString().length===1) oldValue = "0"+oldValue;
			
			item.removeClass("minute" + oldValue);
			item.addClass("minute" + value);
			item.text(value);
		}

		var value = 214;
		if(jQuery("#jim-case").hasClass("landscape"))
			value = 238;
		
		jQuery("#jim-iphone-ti_options .ti_minutes").css('top', -value + 'px');
	}
	
	
	/** PERIODS **/
	function bindTimePeriods() {
		jQuery("#jim-iphone-ti_options .ti_periods").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var value = 80;
				
				if(jQuery("#jim-case").hasClass("landscape"))
					value = 56;
				
				var ddTop = parseInt(jQuery("#jim-iphone-ti_options .ti_periods").css('top'));
				if((value-ddTop)>21) {
					jQuery("#jim-iphone-ti_options .ti_periods").animate({'top' : value-(42) + 'px'}, function() {
						setTimeValue(input);
					});
				}
				else if((value-ddTop)<-21) {
					jQuery("#jim-iphone-ti_options .ti_periods").animate({'top' : value + 'px'}, function() {
						setTimeValue(input);
					});
				}
				else jQuery("#jim-iphone-ti_options .ti_periods").animate({'top': value + 'px'}, function() {
					setTimeValue(input);
				});
			}
		});

		jQuery('#jim-iphone-ti_options .ti_periods').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-ti_options .ti_periods').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-ti_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-ti_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-ti_options .ti_periods").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-ti_options .ti_periods").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}
	
	function fillTime() {
		var currentHour, currentMinute, currentPeriod, html = "";
		var currentValue = input.find("input").val();
		if(currentValue==="") {
			var currentDate = new Date();
			currentHour = currentDate.getHours();
			currentMinutes = currentDate.getMinutes();
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
		}
		else {
			currentHour = parseInt(currentValue.substring(0, currentValue.indexOf(":")), 10);
			currentMinutes = parseInt(currentValue.substring(currentValue.indexOf(":")+1), 10);
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
		}

		//hours
		var html = "";
		for(var i=currentHour-7;i<=currentHour+7;i++) {
			var val = i;
			val = (val+12)%12;
			if(val===0) val=12;
			if(val.toString().length===1) val = "0"+val;
			html += "<div class='hours hour" + val + "'>" + val + "</div>"; 
		}
		jQuery("#jim-iphone-ti_options .ti_hours").html(html);
		
		//minutes
		html = "";
		for(var i=currentMinutes-7;i<=currentMinutes+7;i++) {
			var val = i;
			val = (val+60)%60;
			if(val===0) val=0;
			if(val.toString().length===1) val = "0"+val;
			html += "<div class='minutes minute" + val + "'>" + val + "</div>";
		}
		jQuery("#jim-iphone-ti_options .ti_minutes").html(html);
		
		//period
		html = "";
		$.each(periods, function(key, index) {
			html += "<div class='periods'>" + this + "</div>";
		});
		jQuery("#jim-iphone-ti_options .ti_periods").html(html);
		
		setTimeout(function() {
			if(currentPeriod===periods[1]) {
				var value = 38;
				if(jQuery("#jim-case").hasClass("landscape")) {
					value = 14;
				}			
				jQuery("#jim-iphone-ti_options .ti_periods").css("top", value + "px");
			}
			setTimeValue();
		}, 100);
	}
	
	function setTimeValue() {
		var hour = parseInt(jQuery("#jim-iphone-ti_options .ti_hours :nth-child(8)").text(), 10),
		minute = parseInt(jQuery("#jim-iphone-ti_options .ti_minutes :nth-child(8)").text(), 10),
		period = (parseInt(jQuery("#jim-iphone-ti_options .ti_periods").css("top"))>=56) ? periods[0] : periods[1];
		hour = (period===periods[0] && hour===12) ? 0 : hour;
		hour = (period===periods[1] && hour<12) ? hour+12 : hour;
		if(hour.toString().length===1) hour = "0" + hour;
		if(minute.toString().length===1) minute = "0" + minute;
				
		value = hour + ":" + minute; 
		input.find("input").val(jimUtil.fromHTML(value));
		if(initialInputValue!==value) {
			input.closest(".firer").trigger("change");
			initialInputValue = value;
		}
	}
	
	function clearTimeValue() {
		input.find("input").val(jimUtil.fromHTML(""));
		if(initialInputValue!=="") {
			input.closest(".firer").trigger("change");
			initialInputValue = "";
		}
	}
	
	/*********************** END TIME METHODS ************************/

	/*********************** START DATETIME METHODS ************************/
	
	function createDateTime() {
		var html = "";
		if($.browser.msie)
			html = '<div id="jim-iphone-dt" onselectstart="return false;"><div id="jim-iphone-dt_controls"><div class="dt_controls-clear"></div><div class="dt_controls-done"></div></div><div id="jim-iphone-dt_options"><div class="jim-iphone-dt_mark"></div><div class="dt_date"><div class="dt_weekday"></div><div class="dt_day"></div><div class="dt_year"></div></div><div class="dt_hours"></div><div class="dt_minutes"></div><div class="dt_periods"></div></div></div>';
		else html = '<div id="jim-iphone-dt"><div id="jim-iphone-dt_controls"><div class="dt_controls-clear"></div><div class="dt_controls-done"></div></div><div id="jim-iphone-dt_options"><div class="dt_date"><div class="dt_weekday"></div><div class="dt_day"></div><div class="dt_year"></div></div><div class="dt_hours"></div><div class="dt_minutes"></div><div class="dt_periods"></div></div><div class="jim-iphone-dt_mark"></div></div>';
		jQuery("#jim-container").append(html);
		
		jQuery('#jim-iphone-dt_options .dt_date').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery('#jim-iphone-dt_options .dt_hours').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery('#jim-iphone-dt_options .dt_minutes').draggable({ 
			axis: "y",
			drag: function(evt, ui) { correctDragDateWithZoom(evt, ui) }
		});
		jQuery('#jim-iphone-dt_options .dt_periods').draggable({ axis: "y" });
	}
	
	function bindDateTime() {
		bindDateTimeDate();
		bindDateTimeHours();
		bindDateTimeMinutes();
		bindDateTimePeriods();
	}
	
	/** CONTROLS **/
	function bindDateTimeControls() {
		jQuery("#jim-iphone-dt").on("mouseup", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && !dragStart) {
				var key = realTarget.className;
				if(key) {
					if(key.indexOf(" ")>0)
						key=key.substring(0, key.indexOf(" "));
					switch(key) {
						case "dt_controls-clear":
							jQuery("#jim-iphone-dt_controls .dt_controls-clear").removeClass("pressed");
							clearDateTimeValue(input);
							break;
						case "dt_controls-done":
							jQuery("#jim-iphone-dt_controls .dt_controls-done").removeClass("pressed");
							jQuery("#jim-iphone-dt").hide("slide", { direction: "down" }, 450);
							input.find("input").blur();
							break;
						default:
							break;
					}
				}
			}
		});
		
		jQuery("#jim-iphone-dt").on("mousedown", function(event, data) {
			var realTarget = event.target || event.srcElement;
			if (realTarget.tagName === "DIV" && !dragStart) {
				var key = realTarget.className;
				if(key.indexOf(" ")>0)
					key=key.substring(0, key.indexOf(" "));
				switch(key) {
					case "dt_controls-clear":
					case "dt_controls-done":
						jQuery(event.target).removeClass("pressed").addClass("pressed");
						break;
					default:
						break;
				}
				event.preventDefault();
			}
		});
	}
	
	/** DATE **/
	function bindDateTimeDate() {
		jQuery("#jim-iphone-dt_options .dt_date").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var value = 214;
				
				if(jQuery("#jim-case").hasClass("landscape"))
					value = 238;
				
				var ddTop = parseInt(jQuery("#jim-iphone-dt_options .dt_date").css('top'));
				if((ddTop+value)>21) {
					var offset = -value-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-dt_options .dt_date").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultDTDate(despl);
						jQuery("#jim-iphone-dt_options .dt_date").css('top', -value + 'px');
						setDateTimeValue(input);
					});
				}
				else if((ddTop+value)<-21) {
					var offset = -value-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-dt_options .dt_date").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultDTDate(despl);
						jQuery("#jim-iphone-dt_options .dt_date").css('top', -value + 'px');
						setDateTimeValue(input);
					});
				}
				else jQuery("#jim-iphone-dt_options .dt_date").animate({'top': -value + 'px'}, function() {
					setDateTimeValue(input);
				});
			}
		});
		
		jQuery('#jim-iphone-dt_options .dt_date').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-dt_options .dt_date').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-dt_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-dt_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_date").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_date").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDTDate(offset) {
		var currentWeekdayList = jQuery("#jim-iphone-dt_options .dt_date .dt_weekday").children(),
		currentDayList = jQuery("#jim-iphone-dt_options .dt_date .dt_day").children(),
		currentYearList = jQuery("#jim-iphone-dt_options .dt_date .dt_year").children(),
		firstDay = parseInt(jQuery("#jim-iphone-dt_options .dt_date .date.day:first-child").text().substring(4), 10),
		newStartDay = firstDay+offset,
		dayArray = getFullDayOffsetArray(offset),
		currentDate = new Date();
		
		//weekday
		for(var i=0; i<currentWeekdayList.length; i++) {
			var item = jQuery(currentWeekdayList[i]);
			var value = dayArray[i];
			if(value.weekday===currentDate.getDay() && value.month===currentDate.getMonth() && value.day===currentDate.getDate() && value.year===currentDate.getFullYear()) {
				item.removeClass("weekday").text("");
			}
			else {
				item.removeClass("weekday").addClass("weekday").text(daysCompressed[value.weekday-1]);
			}
		}
		
		//day
		for(var i=0; i<currentDayList.length; i++) {
			var item = jQuery(currentDayList[i]);
			var value = dayArray[i];
			if(value.weekday===currentDate.getDay() && value.month===currentDate.getMonth() && value.day===currentDate.getDate() && value.year===currentDate.getFullYear()) {
				item.removeClass("weekday, day").addClass("today").text("Today");
			}
			else {
				item.removeClass("day, today").addClass("day").text(monthsCompressed[value.month] + " " + value.day);
			}
		}
		
		//year
		for(var i=0; i<currentYearList.length; i++) {
			var item = jQuery(currentYearList[i]);
			var value = dayArray[i];
			item.text(value.year);
		}
		
		var value = 214;
		if(jQuery("#jim-case").hasClass("landscape"))
			value = 238;
		
		jQuery("#jim-iphone-dt_options .dt_days").css('top', -value + 'px');
	}
	
	/** HOURS **/
	function bindDateTimeHours() {
		jQuery("#jim-iphone-dt_options .dt_hours").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var value = 214;
				
				if(jQuery("#jim-case").hasClass("landscape"))
					value = 238;
				
				var ddTop = parseInt(jQuery("#jim-iphone-dt_options .dt_hours").css('top'));
				if((ddTop+value)>21) {
					var offset = -value-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-dt_options .dt_hours").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultDTHours(despl);
						jQuery("#jim-iphone-dt_options .dt_hours").css('top', -value + 'px');
						setDateTimeValue(input);
					});
				}
				else if((ddTop+value)<-21) {
					var offset = -value-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-dt_options .dt_hours").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultDTHours(despl);
						jQuery("#jim-iphone-dt_options .dt_hours").css('top', -value + 'px');
						setDateTimeValue(input);
					});
				}
				else jQuery("#jim-iphone-dt_options .dt_hours").animate({'top': -value + 'px'}, function() {
					setDateTimeValue(input);
				});
			}
		});

		jQuery('#jim-iphone-dt_options .dt_hours').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-dt_options .dt_hours').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-dt_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-dt_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_hours").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_hours").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}
	
	function restoreDefaultDTHours(offset) {
		var currentHourList = jQuery("#jim-iphone-dt_options .dt_hours").children(),
		firstHour = parseInt(jQuery("#jim-iphone-dt_options .dt_hours :first-child").text(), 10),
		newStartHour = firstHour+offset;
		
		for(var i=0; i<currentHourList.length; i++) {
			var item = jQuery(currentHourList[i]);
			var value = (newStartHour + i + 12)%12;
			if(value===0) value=12;
			if(value.toString().length===1) value = "0"+value;
			var oldValue = (firstHour + i + 12)%12;
			if(oldValue===0) oldValue=12;
			if(oldValue.toString().length===1) oldValue = "0"+oldValue;
			
			item.removeClass("hour" + oldValue);
			item.addClass("hour" + value);
			item.text(value);
		}
		
		var value = 214;
		if(jQuery("#jim-case").hasClass("landscape"))
			value = 238;

		jQuery("#jim-iphone-dt_options .dt_hours").css('top', -value + 'px');

	}
	
	/** MINUTES **/
	function bindDateTimeMinutes() {
		jQuery("#jim-iphone-dt_options .dt_minutes").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var value = 214;
				
				if(jQuery("#jim-case").hasClass("landscape"))
					value = 238;
				
				var ddTop = parseInt(jQuery("#jim-iphone-dt_options .dt_minutes").css('top'));
				if((ddTop+value)>21) {
					var offset = -value-ddTop-21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-dt_options .dt_minutes").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultDTMinutes(despl);
						jQuery("#jim-iphone-dt_options .dt_minutes").css('top', -value + 'px');
						setDateTimeValue(input);
					});
				}
				else if((ddTop+value)<-21) {
					var offset = -value-ddTop+21;
					var despl = parseInt(offset/42);
					jQuery("#jim-iphone-dt_options .dt_minutes").animate({'top' : -value-(despl*42) + 'px'}, function() {
						restoreDefaultDTMinutes(despl);
						jQuery("#jim-iphone-dt_options .dt_minutes").css('top', -value + 'px');
						setDateTimeValue(input);
					});
				}
				else jQuery("#jim-iphone-dt_options .dt_minutes").animate({'top': -value + 'px'}, function() {
					setDateTimeValue(input);
				});
			}
		});

		jQuery('#jim-iphone-dt_options .dt_minutes').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-dt_options .dt_minutes').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-dt_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-dt_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_minutes").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_minutes").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}

	function restoreDefaultDTMinutes(offset) {
		var currentMinuteList = jQuery("#jim-iphone-dt_options .dt_minutes").children();
		var firstMinute = parseInt(jQuery("#jim-iphone-dt_options .dt_minutes :first-child").text(), 10);
		var newStartMinute = firstMinute+offset;

		for(var i=0; i<currentMinuteList.length; i++) {
			var item = jQuery(currentMinuteList[i]);
			var value = (newStartMinute + i + 60)%60;
			if(value.toString().length===1) value = "0"+value;
			var oldValue = (firstMinute + i + 60)%60;
			if(oldValue.toString().length===1) oldValue = "0"+oldValue;
			
			item.removeClass("minute" + oldValue);
			item.addClass("minute" + value);
			item.text(value);
		}

		var value = 214;
		if(jQuery("#jim-case").hasClass("landscape"))
			value = 238;
		
		jQuery("#jim-iphone-dt_options .dt_minutes").css('top', -value + 'px');
	}
	
	
	/** PERIODS **/
	function bindDateTimePeriods() {
		jQuery("#jim-iphone-dt_options .dt_periods").on("mouseup", function(event, data) {
			if(dragStart) {
				dragStart = false;
				var value = 80;
				
				if(jQuery("#jim-case").hasClass("landscape"))
					value = 56;
				
				var ddTop = parseInt(jQuery("#jim-iphone-dt_options .dt_periods").css('top'));
				if((value-ddTop)>21) {
					jQuery("#jim-iphone-dt_options .dt_periods").animate({'top' : value-(42) + 'px'}, function() {
						setDateTimeValue(input);
					});
				}
				else if((value-ddTop)<-21) {
					jQuery("#jim-iphone-dt_options .dt_periods").animate({'top' : value + 'px'}, function() {
						setDateTimeValue(input);
					});
				}
				else jQuery("#jim-iphone-dt_options .dt_periods").animate({'top': value + 'px'}, function() {
					setDateTimeValue(input);
				});
			}
		});

		jQuery('#jim-iphone-dt_options .dt_periods').on('dragstart', function(event, data) {
			topP = data.position.top;
			originalTop = data.originalPosition.top;
			dragStart = true;		
		});
		
		jQuery('#jim-iphone-dt_options .dt_periods').on('drag', function(event, data) {
			if(dragStart) {
				topP = data.position.top;
				
				var offset = jQuery("#jim-iphone-dt_options").offset(),
				dd_height = parseInt(jQuery("#jim-iphone-dt_options").css('height')),
				zoom = jimMobile.getZoom(),
				posX = event.pageX,
				posY = event.pageY;
				
				if(posY<offset.top) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_periods").trigger('mouseup');
				}
				else if(posY>offset.top+(dd_height/zoom)) {
					event.preventDefault();
					jQuery("#jim-iphone-dt_options .dt_periods").trigger('mouseup');
				}
				
			}
			else event.preventDefault();
			
		});
	}
	
	function fillDateTime() {
		var htmlWeek = "", htmlDay = "", htmlYear = "", html = "",
		currentHour, currentMinute, currentPeriod,
		currentValue = input.find("input").val();
		
		var currentDate = new Date();
		if(currentValue==="") {
			currentMonth = currentDate.getMonth();
			currentWeekday = currentDate.getDay();
			currentDay = currentDate.getDate();
			currentYear = currentDate.getFullYear()
			currentHour = currentDate.getHours();
			currentMinutes = currentDate.getMinutes();
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
		}
		else {
			currentMonth = parseInt(currentValue.substring(0, currentValue.indexOf("/")), 10)-1;
			currentDay = parseInt(currentValue.substring(currentValue.indexOf("/")+1, currentValue.lastIndexOf("/")), 10);
			currentYear = parseInt(currentValue.substring(currentValue.lastIndexOf("/")+1, currentValue.indexOf(" ")), 10);
			currentHour = parseInt(currentValue.substring(currentValue.indexOf(" "), currentValue.indexOf(":")), 10);
			currentMinutes = parseInt(currentValue.substring(currentValue.indexOf(":")+1), 10);
			currentPeriod = (currentHour<12) ? periods[0] : periods[1];
			currentWeekday = parseInt(new Date(currentYear, currentMonth, currentDay).getDay(), 10);

			currentHour = (currentHour+12)%12;
			if(currentHour===0) currentHour=12;
		}
		
		//date
		var dayArray = getFullDayArray(currentDay, currentMonth, currentWeekday, currentYear);
		for(var i=0;i<dayArray.length;i++) {
			var value = dayArray[i];
			if(value.weekday===currentDate.getDay() && value.month===currentDate.getMonth() && value.day===currentDate.getDate() && value.year===currentDate.getFullYear()) {
				htmlWeek += "<div class='date'></div>";
				htmlDay += "<div class='date today'>Today</div>";
				htmlYear += "<div class='date year'>" + value.year + "</div>";
			}
			else {
				htmlWeek += "<div class='date weekday'>" + daysCompressed[value.weekday-1] + "</div>";
				htmlDay += ("<div class='date day'>" + monthsCompressed[value.month] + " " + value.day + "</div>");
				htmlYear += "<div class='date year'>" + value.year + "</div>";
			}
		}
		jQuery("#jim-iphone-dt_options .dt_weekday").html(htmlWeek);
		jQuery("#jim-iphone-dt_options .dt_day").html(htmlDay);
		jQuery("#jim-iphone-dt_options .dt_year").html(htmlYear);
		
		//hours
		var html = "";
		for(var i=currentHour-7;i<=currentHour+7;i++) {
			var val = i;
			val = (val+12)%12;
			if(val===0) val=12;
			if(val.toString().length===1) val = "0"+val;
			html += "<div class='hours hour" + val + "'>" + val + "</div>"; 
		}
		jQuery("#jim-iphone-dt_options .dt_hours").html(html);
		
		//minutes
		html = "";
		for(var i=currentMinutes-7;i<=currentMinutes+7;i++) {
			var val = i;
			val = (val+60)%60;
			if(val===0) val=0;
			if(val.toString().length===1) val = "0"+val;
			html += "<div class='minutes minute" + val + "'>" + val + "</div>";
		}
		jQuery("#jim-iphone-dt_options .dt_minutes").html(html);
		
		//period
		html = "";
		$.each(periods, function(key, index) {
			html += "<div class='periods'>" + this + "</div>";
		});
		
		jQuery("#jim-iphone-dt_options .dt_periods").html(html);
		setTimeout(function() {
			if(currentPeriod===periods[1]) {
				var value = 38;
				if(jQuery("#jim-case").hasClass("landscape")) {
					value = 14;
				}
				jQuery("#jim-iphone-dt_options .dt_periods").css("top", value + "px");
			}
			setDateTimeValue(input);
		}, 100);
	}
	
	function getFullDayArray(currentDay, currentMonth, currentWeekday, currentYear) {
		var calculatedDay = parseInt(currentDay, 10),
		calculatedMonth = parseInt(currentMonth, 10),
		calculatedWeekday = parseInt(currentWeekday, 10),
		calculatedYear = parseInt(currentYear, 10),
		fullDayArray = new Array(14); 
		
		//Before
		for(var i=0;i>=-6;i--) {
			calculatedDay = (calculatedDay-(1)+31)%31;
			if(calculatedDay===0) calculatedDay=31;
			
			//month before!
			if(calculatedDay<=31 && currentDay>=1 && currentDay<calculatedDay) {
				calculatedMonth = (currentMonth-(1)+12)%12;
				if(calculatedMonth===11 && currentMonth===0)
					calculatedYear = currentYear-1;
			}
			if(calculatedDay===31 && ((calculatedMonth<6 && calculatedMonth%2===1) || (calculatedMonth>=6 && calculatedMonth%2===0))) {
				calculatedDay=30;
			}
			if(calculatedDay >=30 && calculatedMonth===1) {
				calculatedDay=29;
			}
			if(calculatedDay >=29 && calculatedYear%4!==0 && calculatedMonth===1) {
				calculatedDay=28;
			}
			
			calculatedWeekday = (calculatedWeekday-(1)+7)%7;
			if(calculatedWeekday===0) calculatedWeekday=7;
			
			fullDayArray[i+6] = { "weekday": calculatedWeekday, "day": calculatedDay, "month": calculatedMonth, "year": calculatedYear };
		}
		
		//Today
		if(currentWeekday===0) currentWeekday=7;
		fullDayArray[7] = { "weekday": currentWeekday, "day": currentDay, "month": currentMonth, "year": currentYear };
		
		calculatedDay = currentDay;
		calculatedMonth = currentMonth;
		calculatedWeekday = currentWeekday;
		calculatedYear = currentYear;
		
		//After
		for(var i=1;i<8;i++) {
			calculatedDay = (calculatedDay+(1)+31)%31;
			if(calculatedDay===0) calculatedDay=31;
			
			if(calculatedDay===31 && ((calculatedMonth<6 && calculatedMonth%2===1) || (calculatedMonth>=6 && calculatedMonth%2===0))) {
				calculatedDay=1;
			}
			if(calculatedDay >=30 && calculatedMonth===1) {
				calculatedDay=1;
			}
			if(calculatedDay >=29 && calculatedYear%4!==0 && calculatedMonth===1) {
				calculatedDay=1;
			}
			
			//month after!
			if(calculatedDay>=1 && currentDay<=31 && currentDay>calculatedDay) {
				calculatedMonth = (currentMonth+(1)+12)%12;
				if(calculatedMonth===0)
					calculatedYear = currentYear+1;
			}
			
			calculatedWeekday = (calculatedWeekday+(1))%7;
			if(calculatedWeekday===0) calculatedWeekday=7;
			
			fullDayArray[i+7] = { "weekday": calculatedWeekday, "day": calculatedDay, "month": calculatedMonth, "year": calculatedYear };
		}

		return fullDayArray;
	}

	function getFullDayOffsetArray(offset) {
		var dayTxt = jQuery("#jim-iphone-dt_options .dt_date .date.day:nth-child(" + (8+offset) + ")").text();
		var weekdayTxt = jQuery("#jim-iphone-dt_options .dt_date .date.weekday:nth-child(" + (8+offset) + ")").text();
		var yearTxt = jQuery("#jim-iphone-dt_options .dt_date .date.year:nth-child(" + (8+offset) + ")").text();

		var month="";
		var day="";
		var year="";
		if(weekdayTxt==="") {
			month = monthsCompressed[currentMonth];
			day = currentDay;
			weekdayTxt = daysCompressed[currentWeekday-1];
			year=currentYear;
		}
		else {
			month = dayTxt.substring(0,3);
			day = dayTxt.substring(4);
			year=parseInt(yearTxt);
		}
		
		var calculatedDay = parseInt(day, 10);
		var calculatedMonth = jQuery.inArray(month, monthsCompressed);
		var calculatedWeekday = jQuery.inArray(weekdayTxt, daysCompressed)+1;
		var calculatedYear = year;

		return getFullDayArray(calculatedDay, calculatedMonth, calculatedWeekday, calculatedYear);
	}
	
	function setDateTimeValue() {
		var month, day,
		year = parseInt(jQuery("#jim-iphone-dt_options .dt_year :nth-child(8)").text()),
		hour = parseInt(jQuery("#jim-iphone-dt_options .dt_hours :nth-child(8)").text(), 10),
		minute = parseInt(jQuery("#jim-iphone-dt_options .dt_minutes :nth-child(8)").text(), 10),
		period = (parseInt(jQuery("#jim-iphone-dt_options .dt_periods").css("top"))>=56) ? periods[0] : periods[1],
		hour = (period===periods[0] && hour===12) ? 0 : hour;
		hour = (period===periods[1] && hour<12) ? hour+12 : hour;
		if(hour.toString().length===1) hour = "0" + hour;
		if(minute.toString().length===1) minute = "0" + minute;
				
		var date = jQuery("#jim-iphone-dt_options .dt_day :nth-child(8)").text();
		if(date==="Today") {
			month = currentMonth;
			day = currentDay;
		}
		else {
			month = jQuery.inArray(date.substring(0, 3), monthsCompressed)+1;
			day = parseInt(date.substring(4));
		}
		if(month.toString().length===1) month = "0" + month;
		if(day.toString().length===1) day = "0" + day;
		
		value = month + "/" + day + "/" + year + " " + hour + ":" + minute; 
		input.find("input").val(jimUtil.fromHTML(value));
		if(initialInputValue!==value) {
			input.closest(".firer").trigger("change");
			initialInputValue = value;
		}
	}
	
	function clearDateTimeValue() {
		input.find("input").val(jimUtil.fromHTML(""));
		if(initialInputValue!=="") {
			input.closest(".firer").trigger("change");
			initialInputValue = "";
		}
	}
	
	
	/*********************** END DATETIME METHODS ************************/
	
	
	/*********************** START OTHER METHODS ************************/
	
	function checkExternalClick(event, data) {
		var $target = $(event.target || event.srcElement);
		if(input && ( (($target.closest(".text")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) || 
				(($target.closest(".password")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) || 
				(($target.closest(".textarea")[0]!==input[0]) && ($target.closest(".text").length===0 && $target.closest(".password").length===0 && $target.closest(".textarea").length===0)) )
				&& $target[0].id != $("#jim-iphone-kb") && !$target.closest("#jim-iphone-kb").length && $("#jim-iphone-kb").css("display")!=="none" && !$("#jim-iphone-kb:animated").length) {
			jQuery("#jim-iphone-kb").hide("slide", { direction: "down" }, 450);
			deactivateSpecialKeys();
			
			var value = "";
			if(input.find("input").length>0)
				value = input.find("input").val();
			else if(input.find("textarea").length>0)
				value = input.val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
			input.find("textarea:focus").blur();
		}
		if(input && ($target.closest(".dropdown, .nativedropdown")[0]!==input[0]) && !$target.is(".dropdown, .nativedropdown") && $target[0].id != $("#jim-iphone-dd") && !$target.closest("#jim-iphone-dd").length && $("#jim-iphone-dd").css("display")!=="none" && !$("#jim-iphone-dd:animated").length) {
			jQuery("#jim-iphone-dd").hide("slide", { direction: "down" }, 450);
			jQuery(".dropdown, .nativedropdown").removeClass("pressed");
			var value = input.children(".valign").children(".value").text();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
		}
		if(input && ($target.closest(".date")[0]!==input[0]) && $target.closest(".date").length===0 && $target[0].id != $("#jim-iphone-da") && !$target.closest("#jim-iphone-da").length && $("#jim-iphone-da").css("display")!=="none" && !$("#jim-iphone-da:animated").length) {
			jQuery("#jim-iphone-da").hide("slide", { direction: "down" }, 450);
			var value = input.find("input").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
		}
		if(input && ($target.closest(".time")[0]!==input[0]) && $target.closest(".time").length===0 && $target[0].id != $("#jim-iphone-ti") && !$target.closest("#jim-iphone-ti").length && $("#jim-iphone-ti").css("display")!=="none" && !$("#jim-iphone-ti:animated").length) {
			jQuery("#jim-iphone-ti").hide("slide", { direction: "down" }, 450);
			var value = input.find("input").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
		}
		if(input && ($target.closest(".datetime")[0]!==input[0]) && $target.closest(".datetime").length===0 && $target[0].id != $("#jim-iphone-dt") && !$target.closest("#jim-iphone-dt").length && $("#jim-iphone-dt").css("display")!=="none" && !$("#jim-iphone-dt:animated").length) {
			jQuery("#jim-iphone-dt").hide("slide", { direction: "down" }, 450);
			var value = input.find("input").val();
			if(initialInputValue!==value) {
				input.closest(".firer").trigger("change");
			}
			input.find("input:focus").blur();
		}
		
		dragStart=false;
	}
	
	function checkExternalTap(event, data) {
		var $target = $(event.target || event.srcElement);
		if($target.closest(".dropdown, .nativedropdown")[0]===undefined || !$target.is(".dropdown, .nativedropdown")) {
		  jQuery(".dropdown, .nativedropdown").removeClass("pressed");
		  event.stopPropagation();
		}
		
		dragStart=false;
	}
	
	function correctDragDateWithZoom(evt, ui) {
        // zoom fix
    	var zoom = jimMobile.getZoom();
    	ui.position.top = -214 + (ui.position.top+214) * zoom;
    }
	
	function isComponentAssociatedinDataGrid(newInput) {
		hasDatagridParent = newInput.parents(".datagrid"),
		isOAAssociated = newInput.find("input[name]"),
		OAName = isOAAssociated ? (isOAAssociated.attr("name")!="") ? isOAAssociated.attr("name") : undefined : undefined;
		if(hasDatagridParent && OAName)
			return true;
		else return false;
	}
	
	/*********************** END OTHER METHODS ************************/
	
	
	/*********************** START STATIC ACCESS METHODS ************************/
	
	$("#jim-container").mousedown(checkExternalClick);
	if(window.jimMobile && window.jimMobile.isMobileDevice()) {
		$("#simulation").mousedown(checkExternalTap);
	}
	
	jQuery.extend(jimMobile, {
		"loadKeyboard": function() {
			createKeyboard();
			bindKeyboard();

			jQuery("#simulation").delegate(".text input:not([readonly]), .password input:not([readonly]), textarea:not([readonly])", "click, focusin", function(event, data) {
				if(!jQuery("#jim-iphone-kb").css("display") || jQuery("#jim-iphone-kb").css("display") === "none") {
					jQuery("#jim-iphone-kb").show("slide", { direction: "down" }, 450);
				}
				var newInput = jQuery(this).closest(".text");
				initialInputValue = newInput.find("input").val();
				if(newInput.length===0) {
					newInput = jQuery(this).closest(".password");
					initialInputValue = newInput.find("input").val(); 
				}
				if(newInput.length===0) {
					newInput = jQuery(this).closest(".textarea");
					initialInputValue = newInput.val();
				}
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					jimMobile.resetWidgets();
					setStartCaretPosition(input);
					//input.closest(".firer").trigger("focusin");
				}
			});
		},
		"unloadKeyboard": function() {
			if(jQuery("#jim-iphone-kb").length>0) {
				jQuery("#simulation").undelegate(".text", "click");
				if(jQuery("#jim-iphone-kb").css("display") !== "none") {
					jQuery("#jim-iphone-kb").hide();
					//jQuery("#jim-iphone-kb").hide("slide", { direction: "down" }, 450);
				}
				jQuery("#jim-iphone-kb").remove();
			}
		},
		"loadDropDown": function() {
			createDropDown();
			bindDropDown();

			jQuery("#simulation").delegate(".dropdown:not([readonly]), .nativedropdown:not([readonly])", "click", function(event, data) {
				jimMobile.resetWidgets();
				fillDropDownOptions($(event.target.parentElement));
				if(!jQuery("#jim-iphone-dd").css("display") || jQuery("#jim-iphone-dd").css("display") === "none") {
					jQuery("#jim-iphone-dd").show("slide", { direction: "down" }, 450);
				}
				var newInput = jQuery(this);
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					if(input) {
						jQuery(".dropdown, .nativedropdown").removeClass("pressed");
					}
					input = newInput;
				}
				initialInputValue = input.children(".valign").children(".value").text();
				//input.closest(".firer").trigger("focusin");
			});
		},
		"unloadDropDown": function() {
			if(jQuery("#jim-iphone-dd").length>0) {
				jQuery("#simulation").undelegate(".dropdown, .nativedropdown", "click");
				if(jQuery("#jim-iphone-dd").css("display") !== "none")
					jQuery("#jim-iphone-kb").hide();
					//jQuery("#jim-iphone-dd").hide("slide", { direction: "down" }, 450);
				jQuery("#jim-iphone-dd").remove();
			}
		},
		"loadDate": function() {
			createDate();
			bindDate();

			jQuery("#simulation").delegate(".date input:not([readonly])", "click, focusin", function(event, data) {
				var newInput = jQuery(this).closest(".date");
				if(isComponentAssociatedinDataGrid(newInput))
					return;
				
				jimMobile.resetWidgets();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					//input.closest(".firer").trigger("focusin");
				}
				fillDate();
				initialInputValue = newInput.find("input").val();
				if(!jQuery("#jim-iphone-da").css("display") || jQuery("#jim-iphone-da").css("display") === "none") {
					jQuery("#jim-iphone-da").show("slide", { direction: "down" }, 450);
				}
			});
		},
		"unloadDate": function() {
			if(jQuery("#jim-iphone-da").length>0) {
				jQuery("#simulation").undelegate(".date", "click");
				if(jQuery("#jim-iphone-da").css("display") !== "none")
					jQuery("#jim-iphone-da").hide();
					//jQuery("#jim-iphone-da").hide("slide", { direction: "down" }, 450);
				jQuery("#jim-iphone-da").remove();
			}
		},
		"loadTime": function() {
			createTime();
			bindTime();
			bindTimeControls();

			jQuery("#simulation").delegate(".time input:not([readonly])", "click, focusin", function(event, data) {
				var newInput = jQuery(this).closest(".time");
				if(isComponentAssociatedinDataGrid(newInput))
					return;
				
				jimMobile.resetWidgets();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					//input.closest(".firer").trigger("focusin");
				}
				fillTime();
				initialInputValue = newInput.find("input").val();
				if(!jQuery("#jim-iphone-ti").css("display") || jQuery("#jim-iphone-ti").css("display") === "none") {
					jQuery("#jim-iphone-ti").show("slide", { direction: "down" }, 450);
				}
			});
		},
		"unloadTime": function() {
			if(jQuery("#jim-iphone-ti").length>0) {
				jQuery("#simulation").undelegate(".time", "click");
				if(jQuery("#jim-iphone-ti").css("display") !== "none")
					jQuery("#jim-iphone-ti").hide();
					//jQuery("#jim-iphone-ti").hide("slide", { direction: "down" }, 450);
				jQuery("#jim-iphone-ti").remove();
			}
		},	
		"loadDateTime": function() {
			createDateTime();
			bindDateTime();
			bindDateTimeControls();

			jQuery("#simulation").delegate(".datetime input:not([readonly])", "click, focusin", function(event, data) {
				var newInput = jQuery(this).closest(".datetime");
				if(isComponentAssociatedinDataGrid(newInput))
					return;
				
				jimMobile.resetWidgets();
				if(!input || (newInput.length>0 && input[0]!==newInput[0])) {
					input = newInput;
					//input.closest(".firer").trigger("focusin");
				}
				fillDateTime();
				initialInputValue = newInput.find("input").val();
				if(!jQuery("#jim-iphone-dt").css("display") || jQuery("#jim-iphone-dt").css("display") === "none") {
					jQuery("#jim-iphone-dt").show("slide", { direction: "down" }, 450);
				}
			});
		},
		"unloadDateTime": function() {
			if(jQuery("#jim-iphone-dt").length>0) {
				jQuery("#simulation").undelegate(".datetime", "click");
				if(jQuery("#jim-iphone-dt").css("display") !== "none")
					jQuery("#jim-iphone-dt").hide();
					//jQuery("#jim-iphone-dt").hide("slide", { direction: "down" }, 450);
				jQuery("#jim-iphone-dt").remove();
			}
		},
		"resetWidgets": function() {
			//keyboard
			jQuery("#jim-iphone-kb #letters").css('display', 'block');
			jQuery("#jim-iphone-kb #numbers").css('display', 'none');
			jQuery("#jim-iphone-kb #signs").css('display', 'none');
			deactivateSpecialKeys();
			//dropdown
			var topPos = parseInt(jQuery("#jim-iphone-dd .dd_options").css("top"), 10);
			if(jQuery("#jim-case").hasClass("portrait"))
				jQuery("#jim-iphone-dd .dd_options").css("top", topPos+26 + "px");
			else jQuery("#jim-iphone-dd .dd_options").css("top", topPos-26 + "px");
			//date
			jQuery("#jim-iphone-da .da_months").css("top", "");
			jQuery("#jim-iphone-da .da_days").css("top", "");
			jQuery("#jim-iphone-da .da_years").css("top", "");
			//time
			jQuery("#jim-iphone-ti .ti_hours").css("top", "");
			jQuery("#jim-iphone-ti .ti_minutes").css("top", "");
			jQuery("#jim-iphone-ti .ti_periods").css("top", "");
			//datetime
			jQuery("#jim-iphone-dt .dt_date").css("top", "");
			jQuery("#jim-iphone-dt .dt_hours").css("top", "");
			jQuery("#jim-iphone-dt .dt_minutes").css("top", "");
			jQuery("#jim-iphone-dt .dt_periods").css("top", "");
		},
		"hideWidgets": function() {
			//keyboard
			jQuery("#jim-iphone-kb").css('display', 'none');
			//dropdown
			jQuery("#jim-iphone-dd").css('display', 'none');
			//date
			jQuery("#jim-iphone-da").css('display', 'none');
			//time
			jQuery("#jim-iphone-ti").css('display', 'none');
			//datetime
			jQuery("#jim-iphone-dt").css('display', 'none');
		}
	});
	
	/*********************** END STATIC ACCESS METHODS ************************/
	
}) (window);