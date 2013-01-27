ProximityApp.directive('proxMenu', function(){
  var linkFn = function(scope, element, attrs){
    scope.$watch('global.menuEnabled()', function(val){
      if(val){
        element.css('height', '275px');
      } else {
        element.css('height', '0px');
      }
    });
  };

  return { restrict: 'A', link: linkFn };
});

ProximityApp.directive('proxSwipe', function(){
  var linkFn = function(scope, element, attrs){
    var swiper; // initialized below
    var options = attrs.proxSwipe ? attrs.proxSwipe.split(':') : [];
    var controlsPosition, $swipeControls, $dotsContainer;
    var $container = element;
    if (options.length > 0){
      // opted to use dots
      controlsPosition = options[0];
      $swipeControls = $('<div class="swipe-controls"><div class="dots-container"></div></div>');
      $dotsContainer = $swipeControls.find('div.dots-container');
    }

    scope.$evalAsync(function(){
        if ($dotsContainer){
          $.each(element.find('.item'), function(index, value){
            var $dot = $('<a href="javascript:void(0)"></a>');
            if (index == 0){
              $dot.addClass('active');
            }
            $dotsContainer.append($dot);
          });
        }

        if (controlsPosition == 'top'){
          $swipeControls.insertBefore(element);
        } else if (controlsPosition == 'bottom'){
          $swipeControls.insertAfter(element);
        }

        scope.global.$timeout(function(){
          swiper = new Swipe(document.getElementById(attrs.id), {
            auto:5000,
            callback: function(event, index, elem){
              // runs at the end of any slide change
              scope.$emit('swipe', {id: $(elem).data('id'), swipeIndex: index});


              if ($swipeControls){
                $swipeControls.find('a').removeClass('active'); // reset
                $swipeControls.find('a').eq(index).addClass('active');
              }
            }
          });

          $container.find('.carousel-control').bind('click', function(e){
            e.stopPropagation();
            if($(e.target).hasClass('left')){
              swiper.prev();
            } else {
              swiper.next();
            }
          });
        }, 100);

        if ($swipeControls){
          $swipeControls.find('a:not(.swipe-hint)').bind('click', function(){
            $swipeControls.find('a').removeClass('active'); // reset
            $(this).addClass('active');
            swiper.slide($swipeControls.find('a').index($(this)));
          });
        }
      });
  };

  return { restrict: 'A', link: linkFn };
});