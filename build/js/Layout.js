/* Layout()
 * ========
 * Implements AdminLTE layout.
 * Fixes the layout height in case min-height fails.
 *
 * @usage activated automatically upon window load.
 *        Configure any options by passing data-option="value"
 *        to the body tag.
 */
+ function ($) {
  'use strict';

  var DataKey = 'lte.layout';

  var Default = {
    resetHeight: true
  };

  var Selector = {
    wrapper: '.wrapper',
    contentWrapper: '.content-wrapper',
    layoutBoxed: '.layout-boxed',
    mainFooter: '.main-footer',
    mainHeader: '.main-header',
    sidebar: '.sidebar',
    controlSidebar: '.control-sidebar',
    csOpen: '.control-sidebar-open',
    fixed: '.fixed',
    sidebarMenu: '.sidebar-menu',
    logo: '.main-header .logo'
  };

  var ClassName = {
    fixed: 'fixed',
    holdTransition: 'hold-transition'
  };

  var Layout = function (options) {
    this.options = options;
    this.bindedResize = false;
    this.activate();
  };



  Layout.prototype.activate = function () {
    this.fix();
    this.hideHeader();
    var touchSideSwipe = new TouchSideSwipe({
      elementID: 'main-sidebar',
      elementWidth: 300, //px
      elementMaxWidth: 0.9, // *100%
      sideHookWidth: 15, //px
      moveSpeed: 0.3,
      opacityBackground: 0.6,
      shiftForStart: 15,
      windowMaxWidth: 768,
    });

    if ($(window).width() < 767) {
      new SimpleBar($('.main-sidebar')[0]);
    }

    if ($('body').hasClass(ClassName.fixed)) {
      new SimpleBar($('.main-sidebar')[0]);
      new SimpleBar($('.control-sidebar')[0]);
    }

    $('.scroll').each(function (i, obj) {
      new SimpleBar($(obj)[0]);
    });

    $('.chat-box').each(function (i, obj) {
      new SimpleBar($(obj)[0]);
    });

    $('body').removeClass(ClassName.holdTransition);

    if (this.options.resetHeight) {
      $('body, html, ' + Selector.wrapper).css({
        'height': 'auto',
        'min-height': '100%'
      });
    }

    if (!this.bindedResize) {
      $(window).resize(function () {
        this.fix();

        $(Selector.logo + ', ' + Selector.sidebar).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
          this.fix();
        }.bind(this));
      }.bind(this));

      this.bindedResize = true;
    }

    $(Selector.sidebarMenu).on('expanded.tree', function () {
      this.fix();
    }.bind(this));

    $(Selector.sidebarMenu).on('collapsed.tree', function () {
      this.fix();
    }.bind(this));
  };

  Layout.prototype.fix = function () {
    var bd = document.getElementsByClassName("control-sidebar-backdrop");
    if ($(window).width() < 767 && $(Selector.controlSidebar).is(Selector.csOpen)) {
      bd[0].style.zIndex = 999;
      bd[0].style.opacity = 0.5;
    } else {
      bd[0].style.zIndex = -999;
      bd[0].style.opacity = 0;
    }
    // Remove overflow from .wrapper if layout-boxed exists
    $(Selector.layoutBoxed + ' > ' + Selector.wrapper).css('overflow', 'hidden');

    // Get window height and the wrapper height
    var footerHeight = $(Selector.mainFooter).outerHeight() || 0;
    var headerHeight = $(Selector.mainHeader).outerHeight() || 0;
    var neg = headerHeight + footerHeight;
    var windowHeight = $(window).height();
    var sidebarHeight = $(Selector.sidebar).height() || 0;

    // Set the min-height of the content and sidebar based on
    // the height of the document.
    if ($('body').hasClass(ClassName.fixed)) {
      $(Selector.contentWrapper).css('min-height', windowHeight - footerHeight);
    } else {
      var postSetHeight;

      if (windowHeight >= sidebarHeight + headerHeight) {
        $(Selector.contentWrapper).css('min-height', windowHeight - neg);
        postSetHeight = windowHeight - neg;
      } else {
        $(Selector.contentWrapper).css('min-height', sidebarHeight);
        postSetHeight = sidebarHeight;
      }

      // Fix for the control sidebar height
      var $controlSidebar = $(Selector.controlSidebar);
      if (typeof $controlSidebar !== 'undefined') {
        if ($controlSidebar.height() > postSetHeight)
          $(Selector.contentWrapper).css('min-height', $controlSidebar.height());
      }
    }
  };

  Layout.prototype.hideHeader = function () {
    if ($(window).width() <= 767) {
      var lastScrollTop = 0;
      $(window).scroll(function (event) {
        var currentTop = parseInt($('.main-header').css("top").replace('px', ''));
        var st = $(this).scrollTop();
        if (st > lastScrollTop) {
          // downscroll code
          currentTop -= (st - lastScrollTop);
          currentTop = (currentTop > -72 ? currentTop : -72);
          $('.main-header').css({
            top: currentTop
          });
        } else {
          // upscroll code
          currentTop += (lastScrollTop - st);
          currentTop = (currentTop < 0 ? currentTop : 0);
          $('.main-header').css({
            top: currentTop
          });
        }
        lastScrollTop = st;
      });
    }
  }

  // Plugin Definition
  // =================
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data(DataKey);

      if (!data) {
        var options = $.extend({}, Default, $this.data(), typeof option === 'object' && option);
        $this.data(DataKey, (data = new Layout(options)));
      }

      if (typeof option === 'string') {
        if (typeof data[option] === 'undefined') {
          throw new Error('No method named ' + option);
        }
        data[option]();
      }
    });
  }

  var old = $.fn.layout;

  $.fn.layout = Plugin;
  $.fn.layout.Constuctor = Layout;

  // No conflict mode
  // ================
  $.fn.layout.noConflict = function () {
    $.fn.layout = old;
    return this;
  };

  // Layout DATA-API
  // ===============
  $(window).on('load', function () {
    Plugin.call($('body'));
  });
}(jQuery);