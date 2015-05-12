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
     activate: function(attrID){
        $('.subcontainer').fadeOut(400);
        $('#'+attrID).fadeIn(400);
     }
};

document.addEventListener("deviceready", msparken.initialize, false);

$.fn.extend({
    display : function(display){
        if(display === undefined) {display = 'block';}
        $(this).css({display: display});
    }
});