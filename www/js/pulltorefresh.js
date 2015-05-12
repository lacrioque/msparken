var pull = function() {
  var pullToRefresh,
      refreshing,
      contentStartY,
      success, 
      start, 
      cancel,
      startY,
      ptr_object = $("<div id='pull_to_refresh' style='line-height: 50px; text-align: center'>Pull and release to refresh</div>"),
      refresh_object = $("<div style='display: none; line-height: 50px; text-align: center' id='refreshing'><img src='data:image/gif;base64,R0lGODlhEAAQAMQAAP%2F%2F%2F%2B7u7t3d3bu7u6qqqpmZmYiIiHd3d2ZmZlVVVURERDMzMyIiIhEREQARAAAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQFBwAQACwAAAAAEAAQAAAFdyAkQgGJJOWoQgIjBM8jkKsoPEzgyMGsCjPDw7ADpkQBxRDmSCRetpRA6Rj4kFBkgLC4IlUGhbNQIwXOYYWCXDufzYPDMaoKGBoKb886OjAKdgZAAgQkfCwzAgsDBAUCgl8jAQkHEAVkAoA1AgczlyIDczUDA2UhACH5BAUHABAALAAAAAAPABAAAAVjICSO0IGIATkqIiMKDaGKC8Q49jPMYsE0hQdrlABCGgvT45FKiRKQhWA0mPKGPAgBcTjsspBCAoH4gl%2BFmXNEUEBVAYHToJAVZK%2FXWoQQDAgBZioHaX8igigFKYYQVlkCjiMhACH5BAUHABAALAAAAAAQAA8AAAVgICSOUGGQqIiIChMESyo6CdQGdRqUENESI8FAdFgAFwqDISYwPB4CVSMnEhSej%2BFogNhtHyfRQFmIol5owmEta%2FfcKITB6y4choMBmk7yGgSAEAJ8JAVDgQFmKUCCZnwhACH5BAUHABAALAAAAAAQABAAAAViICSOYkGe4hFAiSImAwotB%2Bsi6Co2QxvjAYHIgBAqDoWCK2Bq6A40iA4yYMggNZKwGFgVCAQZotFwwJIF4QnxaC9IsZNgLtAJDKbraJCGzPVSIgEDXVNXA0JdgH6ChoCKKCEAIfkEBQcAEAAsAAAAABAADgAABUkgJI7QcZComIjPw6bs2kINLB5uW9Bo0gyQx8LkKgVHiccKVdyRlqjFSAApOKOtR810StVeU9RAmLqOxi0qRG3LptikAVQEh4UAACH5BAUHABAALAAAAAAQABAAAAVxICSO0DCQKBQQonGIh5AGB2sYkMHIqYAIN0EDRxoQZIaC6bAoMRSiwMAwCIwCggRkwRMJWKSAomBVCc5lUiGRUBjO6FSBwWggwijBooDCdiFfIlBRAlYBZQ0PWRANaSkED1oQYHgjDA8nM3kPfCmejiEAIfkEBQcAEAAsAAAAABAAEAAABWAgJI6QIJCoOIhFwabsSbiFAotGMEMKgZoB3cBUQIgURpFgmEI0EqjACYXwiYJBGAGBgGIDWsVicbiNEgSsGbKCIMCwA4IBCRgXt8bDACkvYQF6U1OADg8mDlaACQtwJCEAIfkEBQcAEAAsAAABABAADwAABV4gJEKCOAwiMa4Q2qIDwq4wiriBmItCCREHUsIwCgh2q8MiyEKODK7ZbHCoqqSjWGKI1d2kRp%2BRAWGyHg%2BDQUEmKliGx4HBKECIMwG61AgssAQPKA19EAxRKz4QCVIhACH5BAUHABAALAAAAAAQABAAAAVjICSOUBCQqHhCgiAOKyqcLVvEZOC2geGiK5NpQBAZCilgAYFMogo%2FJ0lgqEpHgoO2%2BGIMUL6p4vFojhQNg8rxWLgYBQJCASkwEKLC17hYFJtRIwwBfRAJDk4ObwsidEkrWkkhACH5BAUHABAALAAAAQAQAA8AAAVcICSOUGAGAqmKpjis6vmuqSrUxQyPhDEEtpUOgmgYETCCcrB4OBWwQsGHEhQatVFhB%2FmNAojFVsQgBhgKpSHRTRxEhGwhoRg0CCXYAkKHHPZCZRAKUERZMAYGMCEAIfkEBQcAEAAsAAABABAADwAABV0gJI4kFJToGAilwKLCST6PUcrB8A70844CXenwILRkIoYyBRk4BQlHo3FIOQmvAEGBMpYSop%2FIgPBCFpCqIuEsIESHgkgoJxwQAjSzwb1DClwwgQhgAVVMIgVyKCEAIfkECQcAEAAsAAAAABAAEAAABWQgJI5kSQ6NYK7Dw6xr8hCw%2BELC85hCIAq3Am0U6JUKjkHJNzIsFAqDqShQHRhY6bKqgvgGCZOSFDhAUiWCYQwJSxGHKqGAE%2F5EqIHBjOgyRQELCBB7EAQHfySDhGYQdDWGQyUhADs%3D'> Refreshing</div>"),
      track = false,
      refresh = false;
    
    
  var removeTransition = function() {
    content.style['-webkit-transition-duration'] = 0;
  };

      content = jQuery(this);
      content.prepend(refresh_object);
      content.prepend(ptr_object);
      pullToRefresh = $('#pullToRefresh');
      refreshing = $('#refreshing');
      success = function(work){
            work();
            setTimeout(function(){location.reload();}, 2000);
          };
      cancel = function(){};

      content.on('touchstart', function(e) {
        e.preventDefault();
        console.log(e);
        contentStartY = content.offset().top;
        startY = e.touches[0].screenY;
      });

      content.on('touchend', function(e) {
        if(refresh) {
          content.css('-webkit-transition-duration','.5s');
          content.offset({top: 50, left: content.offset().left});
          
          pullToRefresh.css('display','none');
          refreshing.css('display','block');

          success(function() { // pass down done callback
            pullToRefresh.css('display','block');
            refreshing.css('display', 'none');
            content.offset({top : '0', left: content.offset().left});
            content.on('transitionEnd', removeTransition);
          });

          refresh = false;
        } else if(track) {
          content.css({'-webkit-transition-duration' : '.25s'});
          content.offest({top : 0, left: content.offset().left});
          content.on('transitionEnd', removeTransition);

          cancel();
        }

        track = false;
      });

      content.on('touchmove', function(e) {
        var move_to = contentStartY - (startY - e.changedTouches[0].screenY);
        if(move_to > 0) track = true; // start tracking if near the top 
        content.offset({ top: move_to, left: content.offset().left });
          console.log(e);
        if(move_to > 50) {
          refresh = true;
        } else {
          content.css({'-webkit-transition': ''});
          refresh = false;
        }
      });
    };


$.fn.extend({
    pulltorefresh: pull
});
