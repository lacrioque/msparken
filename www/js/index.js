/*
 * Licenced under the GPLv3
 * Full Licence to be found at http://www.gnu.org/licenses/gpl-3.0-standalone.html
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var cordova = function(){
     var location = {},
         device = {
            cordova: device.cordova,
            model: device.model,
            platform: device.platform,
            uuid: device.uuid,
            version: device.version
        },
         watchPositionOptions = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true },
         networkState = navigator.connection.type,
         saveHeading = function(heading){ location.heading = heading; }, 
         savePosition = function(position){ location.position = position; },
         watchLocation =  function(){
                navigator.compass.watchHeading(saveHeading, function(err){console.log(err);} );
                navigator.geolocation.watchPosition( savePosition, function(err){console.log(err);}, watchPositionOptions);     
            };
         watchLocation();
         return {
            getDevice: function(){
                return device;
            },
             
            getLocation: function(){
                return location;
            },

            checkOnline: function(){
                var online;
                switch(networkState){
                    case Connection.UNKNOWN : online = false; break;
                    case Connection.ETHERNET : online = true; break;
                    case Connection.WIFI : online = true; break;
                    case Connection.CELL_2G : online = true; break;
                    case Connection.CELL_3G : online = true; break;
                    case Connection.CELL_4G : online = true; break;
                    case Connection.CELL : online = true; break;
                    case Connection.NONE : online = false; break;
                    default : online = false; break;
                }

                return online;
            },

            vibrate: function(time){
                if(time === undefined ) { time=[2000]; }
                navigator.vibrate(time);
            },

            dialog: function(message, type){
                switch(type){
                    case 'alert' : 
                        navigator.notification.alert(message.message, message.callback, message.title, message.button); 
                        break;
                    case 'confirm' : 
                        navigator.notification.confirm(message.message, message.callback, message.title, message.button); 
                        break;
                    case 'prompt' : 
                        navigator.notification.prompt(message.message, message.callback, message.title, message.button, message.defaultText); 
                        break;
                    case 'beep': 
                        navigator.notification.beep(message.times); 
                        break;
                }

            }
         };
},

googleAPI = {
    calculateDistance : function(originArray, destArray) {
          var service = new google.maps.DistanceMatrixService(), 
              self = this,
              deferred = $.Deferred();
          service.getDistanceMatrix(
            {
              origins: originArray,
              destinations: destArray,
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
              avoidHighways: false,
              avoidTolls: false
            }, function(response, status){
                if (status != google.maps.DistanceMatrixStatus.OK) { return false;}
                var dist = response.rows[0].distance,
                    retObj = {distance : dist};
                deferred.resolve(retObj);
            });
            return deferred.promise();
        },
    createMap : function(mapObjID, position){
         var opts = {
            center: new google.maps.LatLng(position.latitude, position.longitude),
            zoom: 10
          };
          map = new google.maps.Map(document.getElementById('map-canvas'), opts);
            }

},    

    
router = function(base, default_site, routes){
    var href = window.location.href,
        url_parts = href.split('#!');
        site = url_parts[1],
        url = url_parts[0],
        current, 
        default_site;
        current = site === undefined ? default_site : site;
        url = base,
        pushState = function(stateObj, name, page){
            stateObj = stateObj === undefined ? {} : stateObj;
             name = name === undefined ? "" : name;
             page = page === undefined ? current : page;
             history.pushState(stateObj, name, page);
        };
        history.replaceState({online: true},'main',location.href+"#!"+'main');
    
        
    return {
         getURL : function(){return url;},
         getCurrent : function(){ return current; },
         popstate : function(popFunction){
            window.onpopstate = popFunction;
         },
         pushState: function(stateObj, name, page){
             pushState(stateObj, name, page);
         }

     };
 },

 msparken = {
     crdv : {},
     router : {},
     initialize: function(){
        var self = this, url, url_base;
         self.crdv = new cordova();
         self.router = new router(location.href, '#!main');
         url = self.router.getURL();
         url_base = url+"#!";
         router.popstate(self.popstate);
         if(!crdv.checkOnline){
            self.router.pushState({online: false}, 'offline', url_base+"offline");
         } else {
            self.router.pushState({online: true, position_finden: true}, 'Position Finden', url_base+"position_finden");
         }
         self.bindEvents();
         self.activate(router.getCurrent());
     },
     
     activateContainer: function(containerID){
        var self = this, url, object, html;
         switch (containerID){
             case 'position_finden': 
                    url = "";
                    locationNow : cordova.getLocation();
                    object = {
                        position : {
                            find : "Position finden",        
                            ready: "Position gefunden",
                            loading: "Laden",
                            lat: locationNow.location.coords.latitude,
                            lng: locationNow.location.coords.longitude
                        }
                             };
                 break;
             case 'parken_finden' : 
                 url = "";
                 object = {
                    parkhaus : {
                            holen : "Parkhäuser holen",
                            laden : "Laden"
                        }
                    };
                 break;
             case 'parkhaus': 
                 url = "http://parkleit-api.codeformuenster.org/";
                 var preobject = getSyncJSON(url);
                 object = {};
                 object.parkhaus = [];
                 for(var i=0,j=preobject.features.length, haueser = preobject.features; i<j; i++){
                    object.parkhaus.push({name : haueser.properties.name, freie_plaetze: haueser.properties.free})
                 
                 
                 }
                 object = 
        }
        html = new template_worker(containerID, object);
        $('#'+containerID).html(html.getHTML());
     },
     
     effekte: function(){
         var self = this, interval, i;
        $('.loading').on('start_loading', function(){
            var obj = $(this);
            i=1;
            interval = setInterval(function(){
                switch(i){
                    case 1: obj.html("&nbsp;<span style='color: red; font-size: 200%;'>.</span>&nbsp;.&nbsp;.&nbsp;"); i=2; break;
                    case 2: obj.html("&nbsp;.&nbsp;<span style='color: red; font-size: 200%;'>.</span>&nbsp;.&nbsp;"); i=3; break;
                    case 3: obj.html("&nbsp;.&nbsp;.&nbsp;<span style='color: red; font-size: 200%;'>.</span>&nbsp;"); i=1; break;
                }
            }, 100);
        });
        $('.loading').on('stop_loading', function(){
            var obj = $(this);
            interval = null;
            obj.html("!");
        });
     },
     
     bindEvents : function(){
         var self = this;
        $('#main_window').pulltorefresh();
        $('a.softlink').on('click', function(click){
                  click.preventDefault();
                    pushState($(this).data(), $(this).attr('title'), url+$(this).attr('href'));
                    self.activate($(this).data('subcontainer'));
                  }
                 );
         
     },
     activate: function(attrID, data_obj){
        $('.subcontainer').fadeOut(400);
        this.activateContainer(attrID);
        $('#'+attrID).fadeIn(400);
        this.effekte();
     }
};

document.addEventListener("deviceready", msparken.initialize, false);


var getSyncJSON = function(url){
     var retObj;
     $.ajax({
        async: false,
        url: url,
        dataType: 'json',
        success: function(data){
                retObj =  data;
            },
        error: function(errObj, status, text){
            retObj =  {error: errObj, status: status, text: text};
        }
    });
    return retObj;
};

$.fn.extend({
    display : function(display){
        if(display === undefined) {display = 'block';}
        $(this).css({display: display});
    }
});