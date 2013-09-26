ProximityApp.directive('proxMenu', function(){
  var linkFn = function(scope, element, attrs){
    scope.$watch('global.menuEnabled()', function(val){
      if(val){
        element.css('height', '165px');
      } else {
        element.css('height', '0px');
      }
    });
  };

  return { restrict: 'A', link: linkFn };
});

ProximityApp.directive('scrollTopLink', ['$location', '$rootScope', function($location, $rootScope){
  var link = function(scope, element, attrs){
    //Click event to scroll to top
    element.bind('click', function(){
      $rootScope.safeApply(function(){
        $location.hash('');
      });

      $('html, body').animate({scrollTop: 0}, 500);
      return false;
    });
  };

  return { restrict: 'A', link: link };

}]);

// CHANGE APPSTORE BADGE LINK in HERE
ProximityApp.directive('appstore', ['$rootScope',  function($rootScope){
  var link = function(scope, element, attrs){
    var today = new Date();
    if(today.getMonth() >= 5 && today.getDate() >= 17 && today.getFullYear() >= 2013){
      // release date :)
      element.attr('href', 'https://itunes.apple.com/us/app/sxproximity/id627348605?ls=1&mt=8');
      element.attr('target', '_blank');
    } else{
      element.bind('click', function(){
        $rootScope.safeApply(function(){
          $rootScope.showMsg('Coming soon to an app store near you on June 17!');
        });

      });
    }
  };

  return {
    restrict: 'A',
    replace:true,
    template:'<a class="appstore-badge"></a> ',
    link: link
  };

}]);

ProximityApp.directive('proxSwipe', ['$timeout', function($timeout){
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

    $timeout(function(){
        if ($dotsContainer){
          $.each(element.find('.item'), function(index, value){
            var $dot = $('<a href="javascript:void(0)"></a>');
            if (index == 0){
              $dot.addClass('active');
            }
            $dotsContainer.append($dot);
          });

          if (controlsPosition == 'top'){
            $swipeControls.insertBefore(element);
          } else if (controlsPosition == 'bottom'){
            $swipeControls.insertAfter(element);
          }
        }




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


        if ($swipeControls){
          $swipeControls.find('a:not(.swipe-hint)').bind('click', function(){
            $swipeControls.find('a').removeClass('active'); // reset
            $(this).addClass('active');
            swiper.slide($swipeControls.find('a').index($(this)));
          });
        }
      }, 300);
  };

  return { restrict: 'A', link: linkFn };
}]);