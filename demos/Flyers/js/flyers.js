/* 
code based on plugin: https://github.com/codrops/Windy
created by Codrops
License: http://tympanus.net/codrops/licensing/

Background Pattern(s) from http://subtlepatterns.com/
http://creativecommons.org/licenses/by-sa/3.0/deed.en_US

normalize.css by Nicolas Gallagher: http://github.com/necolas/normalize.css
*/


var Flyers = {
  $container: $("body"),
  
  firstCall : true,

  contentArray : [],

  init: function($container){
    console.log('creating flying images');
    Flyers.$container = $container;
    Flyers.layout();
    Flyers.windy = $('#wi-el').windy();
    Flyers.startSpinner();
    sentimentHub.on('Data', Flyers.onData);
    sentimentHub.on('Done', Flyers.onDataDone);
    sentimentHub.fetch();
  },

  startSpinner: function(){
    var opts = {
      lines: 11, // The number of lines to draw
      length: 28, // The length of each line
      width: 13, // The line thickness
      radius: 32, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 50, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 81, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };
    Flyers.spinner = new Spinner(opts).spin(Flyers.$container.get(0));
   },

  // Triggered when data for a particular network is available
  onData: function(network, data){

  },

  // Triggered when we are done fetching data
  onDataDone: function(data){
    var sortedData = Flyers.sortItems(data);
    Flyers.spinner.stop();
    $.each(sortedData, function(key, item){
      Flyers.drawItem(item, key);

      // let the library know we have used this item
      sentimentHub.markDataItemAsUsed(item);

      Flyers.playIfShared(item);
    });


  },

  sortItems : function(data, fieldName, ascending, filter){
    
      var randomize = function(array){
        var result = [];
        var index;
        while (array.length>0){
          index = Math.floor(Math.random()*array.length);
          result.push(array[index]);
          array.splice(index,1);
        }
        return result;
      };

      var sortByField = function(array, fieldName, ascending, filter){
        // temp placeholder
        return randomize(array);
      };


    if (fieldName===undefined){
      return randomize(data);
    } else {
      return sortByField (data, fieldname, ascending, filter); 
    }

  },

  playIfShared: function(item){
    var contentId = $.cookie("vgvidid");
    if (contentId && item.id == contentId){
      ga_events.sboxShareReferral(item.network, item.id);
      if (item.type != 'video'){
        player.hidePlayerMessage();
        player.play(item);
        ga_events.shareReferral('content:'+item.network, item.id);
        $.cookie("vgvidid", '', {
          expires: 0,
          domain: cookieDomain,
          path: '/'
        });
      }
    }
  },


  // draw the items as desired
  drawItem: function(item, key){

    var $listItem = $('<li></li>').css("height","100%");

    // add image to list item
    var photo = item.image || item.thumb || item.profilePic;
    var $imgWrapper = $('<div class="imgWrapper">')
    .css('background-image','url(' + photo + ')');
    $listItem.append($imgWrapper);

    //add icon to image corner
    var icons =  { 
      VGVideo : 'ion-ios7-videocam',
      Photo: 'ion-ios7-camera',
      Twitter: 'ion-social-twitter',
      Instagram: 'ion-social-facebook',
      Youtube: 'ion-social-youtube'
    };
    $imgWrapper.append($('<i class="icon ' + icons[item.network] + '">'));


    // add contributor name to list item
    $listItem.append($('<h4>' + item.contribName + '</h4>'));

    // add text to list item
    $listItem.append($('<div class="info text"></div>')
    .append(item.textHtml));

    // add list item to unsorted list
    $('#wi-el').append($listItem);

    if (key === 0 && Flyers.firstCall){
      Flyers.windy = $('#wi-el').windy();
      Flyers.firstCall = false;
    } else {
      Flyers.windy.update();
    }

  },


  layout: function(){

    // add list to container
    var $List = $('<ul id="wi-el" class="wi-container"></ul>');
    Flyers.$container.append($List);

    // add navigation buttons to container
    $navig = $("<nav>");
    Flyers.$container.append($navig);
    $navig.append('<div id="nav-prev"><i class="icon ion-chevron-left"></i></div>');
    $navig.append('<div id="record-button"><i class="icon ion-ios7-videocam"></i></div>');
    $navig.append('<div id="nav-next"><i class="icon ion-chevron-right"></i></div>');

    Flyers.setNavigation($( '#wi-el' ));

  },


  setNavigation: function($element){
    var allownavnext = false;
    allownavprev = false;

    $( '#nav-prev' ).on( 'vmousedown', function( event ) {
      event.preventDefault();
      allownavprev = true;
      navprev();
    })
    .on( 'vmouseup vmouseleave', function( event ) {
      event.preventDefault();
      allownavprev = false;
    });

    $( '#nav-next' ).on( 'vmousedown', function( event ) {
      event.preventDefault();
      allownavnext = true;
      navnext();
    })
    .on( 'vmouseup vmouseleave', function( event ) {
      event.preventDefault();
      allownavnext = false;
    });

    function navnext() {
      if( allownavnext ) {
        Flyers.windy.next();
        setTimeout( function() {  
          navnext();
        }, 150 );
      }
    }
    
    function navprev() {
      if( allownavprev ) {
        Flyers.windy.prev();
        setTimeout( function() {  
          navprev();
        }, 150 );
      }
    }

  }

};

