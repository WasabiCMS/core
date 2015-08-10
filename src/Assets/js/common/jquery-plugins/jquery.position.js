require(['jquery'], function($) {

  var cachedScrollbarWidth, supportsOffsetFractions,
    max = Math.max,
    abs = Math.abs,
    round = Math.round,
    rhorizontal = /left|center|right/,
    rvertical = /top|center|bottom/,
    roffset = /[\+\-]\d+(\.[\d]+)?%?/,
    rposition = /^\w+/,
    rpercent = /%$/,
    _position = $.fn.position;

  function getOffsets( offsets, width, height ) {
    return [
      parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
      parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
    ];
  }

  function parseCss( element, property ) {
    return parseInt( $.css( element, property ), 10 ) || 0;
  }

  function getDimensions( elem ) {
    var raw = elem[0];
    if ( raw.nodeType === 9 ) {
      return {
        width: elem.width(),
        height: elem.height(),
        offset: { top: 0, left: 0 }
      };
    }
    if ( $.isWindow( raw ) ) {
      return {
        width: elem.width(),
        height: elem.height(),
        offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
      };
    }
    if ( raw.preventDefault ) {
      return {
        width: 0,
        height: 0,
        offset: { top: raw.pageY, left: raw.pageX }
      };
    }
    return {
      width: elem.outerWidth(),
      height: elem.outerHeight(),
      offset: elem.offset()
    };
  }

  $.position = {
    scrollbarWidth: function() {
      if ( cachedScrollbarWidth !== undefined ) {
        return cachedScrollbarWidth;
      }
      var w1, w2,
        div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
        innerDiv = div.children()[0];

      $( "body" ).append( div );
      w1 = innerDiv.offsetWidth;
      div.css( "overflow", "scroll" );

      w2 = innerDiv.offsetWidth;

      if ( w1 === w2 ) {
        w2 = div[0].clientWidth;
      }

      div.remove();

      return (cachedScrollbarWidth = w1 - w2);
    },
    getScrollInfo: function( within ) {
      var overflowX = within.isWindow || within.isDocument ? "" :
          within.element.css( "overflow-x" ),
        overflowY = within.isWindow || within.isDocument ? "" :
          within.element.css( "overflow-y" ),
        hasOverflowX = overflowX === "scroll" ||
          ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
        hasOverflowY = overflowY === "scroll" ||
          ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
      return {
        width: hasOverflowY ? $.position.scrollbarWidth() : 0,
        height: hasOverflowX ? $.position.scrollbarWidth() : 0
      };
    },
    getWithinInfo: function( element ) {
      var withinElement = $( element || window ),
        isWindow = $.isWindow( withinElement[0] ),
        isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
      return {
        element: withinElement,
        isWindow: isWindow,
        isDocument: isDocument,
        offset: withinElement.offset() || { left: 0, top: 0 },
        scrollLeft: withinElement.scrollLeft(),
        scrollTop: withinElement.scrollTop(),

        // support: jQuery 1.6.x
        // jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
        width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
        height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
      };
    }
  };

  $.fn.position = function (options) {
    if (!options || !options.of) {
      return _position.apply(this, arguments);
    }

    // make a copy, we don't want to modify arguments
    options = $.extend({}, options);

    var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
      target = $(options.of),
      within = $.position.getWithinInfo(options.within),
      scrollInfo = $.position.getScrollInfo(within),
      collision = ( options.collision || "flip" ).split(" "),
      offsets = {};

    dimensions = getDimensions(target);
    if (target[0].preventDefault) {
      // force left top to allow flipping
      options.at = "left top";
    }
    targetWidth = dimensions.width;
    targetHeight = dimensions.height;
    targetOffset = dimensions.offset;
    // clone to reuse original targetOffset later
    basePosition = $.extend({}, targetOffset);

    // force my and at to have valid horizontal and vertical positions
    // if a value is missing or invalid, it will be converted to center
    $.each(["my", "at"], function () {
      var pos = ( options[this] || "" ).split(" "),
        horizontalOffset,
        verticalOffset;

      if (pos.length === 1) {
        pos = rhorizontal.test(pos[0]) ?
          pos.concat(["center"]) :
          rvertical.test(pos[0]) ?
            ["center"].concat(pos) :
            ["center", "center"];
      }
      pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
      pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";

      // calculate offsets
      horizontalOffset = roffset.exec(pos[0]);
      verticalOffset = roffset.exec(pos[1]);
      offsets[this] = [
        horizontalOffset ? horizontalOffset[0] : 0,
        verticalOffset ? verticalOffset[0] : 0
      ];

      // reduce to just the positions without the offsets
      options[this] = [
        rposition.exec(pos[0])[0],
        rposition.exec(pos[1])[0]
      ];
    });

    // normalize collision option
    if (collision.length === 1) {
      collision[1] = collision[0];
    }

    if (options.at[0] === "right") {
      basePosition.left += targetWidth;
    } else if (options.at[0] === "center") {
      basePosition.left += targetWidth / 2;
    }

    if (options.at[1] === "bottom") {
      basePosition.top += targetHeight;
    } else if (options.at[1] === "center") {
      basePosition.top += targetHeight / 2;
    }

    atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
    basePosition.left += atOffset[0];
    basePosition.top += atOffset[1];

    return this.each(function () {
      var collisionPosition, using,
        elem = $(this),
        elemWidth = elem.outerWidth(),
        elemHeight = elem.outerHeight(),
        marginLeft = parseCss(this, "marginLeft"),
        marginTop = parseCss(this, "marginTop"),
        collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
        collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
        position = $.extend({}, basePosition),
        myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

      if (options.my[0] === "right") {
        position.left -= elemWidth;
      } else if (options.my[0] === "center") {
        position.left -= elemWidth / 2;
      }

      if (options.my[1] === "bottom") {
        position.top -= elemHeight;
      } else if (options.my[1] === "center") {
        position.top -= elemHeight / 2;
      }

      position.left += myOffset[0];
      position.top += myOffset[1];

      // if the browser doesn't support fractions, then round for consistent results
      if (!supportsOffsetFractions) {
        position.left = round(position.left);
        position.top = round(position.top);
      }

      collisionPosition = {
        marginLeft: marginLeft,
        marginTop: marginTop
      };

      $.each(["left", "top"], function (i, dir) {
        if (_position[collision[i]]) {
          _position[collision[i]][dir](position, {
            targetWidth: targetWidth,
            targetHeight: targetHeight,
            elemWidth: elemWidth,
            elemHeight: elemHeight,
            collisionPosition: collisionPosition,
            collisionWidth: collisionWidth,
            collisionHeight: collisionHeight,
            offset: [atOffset[0] + myOffset[0], atOffset [1] + myOffset[1]],
            my: options.my,
            at: options.at,
            within: within,
            elem: elem
          });
        }
      });

      if (options.using) {
        // adds feedback as second argument to using callback, if present
        using = function (props) {
          var left = targetOffset.left - position.left,
            right = left + targetWidth - elemWidth,
            top = targetOffset.top - position.top,
            bottom = top + targetHeight - elemHeight,
            feedback = {
              target: {
                element: target,
                left: targetOffset.left,
                top: targetOffset.top,
                width: targetWidth,
                height: targetHeight
              },
              element: {
                element: elem,
                left: position.left,
                top: position.top,
                width: elemWidth,
                height: elemHeight
              },
              horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
              vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
            };
          if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
            feedback.horizontal = "center";
          }
          if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
            feedback.vertical = "middle";
          }
          if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
            feedback.important = "horizontal";
          } else {
            feedback.important = "vertical";
          }
          options.using.call(this, props, feedback);
        };
      }

      elem.offset($.extend(position, {using: using}));
    });
  };

  // fraction support test
  (function() {
    var testElement, testElementParent, testElementStyle, offsetLeft, i,
      body = document.getElementsByTagName( "body" )[ 0 ],
      div = document.createElement( "div" );

    //Create a "fake body" for testing based on method used in jQuery.support
    testElement = document.createElement( body ? "div" : "body" );
    testElementStyle = {
      visibility: "hidden",
      width: 0,
      height: 0,
      border: 0,
      margin: 0,
      background: "none"
    };
    if ( body ) {
      $.extend( testElementStyle, {
        position: "absolute",
        left: "-1000px",
        top: "-1000px"
      });
    }
    for (i in testElementStyle ) {
      testElement.style[ i ] = testElementStyle[ i ];
    }
    testElement.appendChild( div );
    testElementParent = body || document.documentElement;
    testElementParent.insertBefore( testElement, testElementParent.firstChild );

    div.style.cssText = "position: absolute; left: 10.7432222px;";

    offsetLeft = $( div ).offset().left;
    var supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

    testElement.innerHTML = "";
    testElementParent.removeChild( testElement );
  })();

});
