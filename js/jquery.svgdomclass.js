(function ($) {
  var core_rspace = " ",
      rclass = /[\t\r\n]/g;

  function addClass(value) {
    var classNames, i, l, elem,
        setClass, c, cl;

    if ( $.isFunction( value ) ) {
      return this.each(function( j ) {
        $( this ).addClass( value.call(this, j, this.className) );
      });
    }

    if ( value && typeof value === "string" ) {
      classNames = value.split( core_rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];

        if ( elem.nodeType === 1 ) {
          if ( !elem.getAttribute("class") && classNames.length === 1 ) {
            elem.setAttribute("class", value);

          } else {
            setClass = " " + elem.getAttribute("class") + " ";

            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
              if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
                setClass += classNames[ c ] + " ";
              }
            }
            elem.setAttribute("class", $.trim( setClass ));
          }
        }
      }
    }

    return this;
  }

  function removeClass( value ) {
    var removes, className, elem, c, cl, i, l;

    if ( $.isFunction( value ) ) {
      return this.each(function( j ) {
        $( this ).removeClass( value.call(this, j, this.className) );
      });
    }
    if ( (value && typeof value === "string") || value === undefined ) {
      removes = ( value || "" ).split( core_rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];
        if ( elem.nodeType === 1 && elem.getAttribute("class") ) {

          className = (" " + elem.getAttribute("class") + " ").replace( rclass, " " );

          // loop over each item in the removal list
          for ( c = 0, cl = removes.length; c < cl; c++ ) {
            // Remove until there is nothing to remove,
            while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
              className = className.replace( " " + removes[ c ] + " " , " " );
            }
          }
          elem.setAttribute("class", value ? $.trim( className ) : "");
        }
      }
    }

    return this;
  }

  function toggleClass( value, stateVal ) {
    var type = typeof value,
      isBool = typeof stateVal === "boolean";

    if ( $.isFunction( value ) ) {
      return this.each(function( i ) {
        $( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
      });
    }

    return this.each(function() {
      if ( type === "string" ) {
        // toggle individual class names
        var className,
          i = 0,
          self = $( this ),
          state = stateVal,
          classNames = value.split( core_rspace );

        while ( (className = classNames[ i++ ]) ) {
          // check each className given, space separated list
          state = isBool ? state : !self.hasClass( className );
          self[ state ? "addClass" : "removeClass" ]( className );
        }

      } else if ( type === "undefined" || type === "boolean" ) {
        if ( this.className ) {
          // store className if set
          $._data( this, "__className__", this.className );
        }

        // toggle whole className
        this.setAttribute("class", this.getAttribute("class") || value === false ? "" : $._data( this, "__className__" ) || "");
      }
    });
  }

  function hasClass( selector ) {
    var className = " " + selector + " ",
      i = 0,
      l = this.length;
    for ( ; i < l; i++ ) {
      if ( this[i].nodeType === 1 && (" " + this[i].getAttribute("class") + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
        return true;
      }
    }

    return false;
  }

  $.fn.removeClass = removeClass;
  $.fn.addClass = addClass;
  $.fn.toggleClass = toggleClass;
  $.fn.hasClass = hasClass;
})(jQuery);
