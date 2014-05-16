
var Tilers = {

  $container: $("body"),
  imgBaseWidth:100,
 

  init: function($container){
    Tilers.$container = $container;
    var $msnryContainer = $('<div id="container"</div>');
    Tilers.$container.append($msnryContainer);
    Tilers.initMasonry();
    sentimentHub.on('Data', Tilers.onData);
    sentimentHub.on('Done', Tilers.onDataDone);
    sentimentHub.fetch();
  },

  // Triggered when data for a particular network is available
  onData: function(network, data){

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


  // Triggered when we are done fetching data
  onDataDone: function(data){
    var sortedData = Tilers.sortItems(data);

    $.each(sortedData, function(key, item){
      Tilers.drawItem(item);
      // let the library know we have used this item
      sentimentHub.markDataItemAsUsed(item);
    });
    Tilers.msnry.layout();
  },

  playIfShared: function(item){

  },

  // draw the items as desired
  drawItem: function(item, msnry){
    var $Item = $('<div class="item"></div>');

    var itemType = {
      VGVideo: 'vid',
      Photo: 'pic',
      Twitter: 'pic',
      Instagram: 'pic',
      Youtube: 'vid'
    };
    
    $Item.addClass(itemType[item.network]);
    // add image to list item
    var photo = item.image || item.thumb || item.profilePic;
    var $imgWrapper = $('<div class="imgWrapper">')
    .css('background-image','url(' + photo + ')');
    $Item.append($imgWrapper);

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
    // $Item.append($('<h4 class="caption">' + item.network + '</h4>'));

    // add text to list item
    if(item.textHtml.length > 0){
      $Item.append($('<div class="info text"></div>')
      .append(item.textHtml));
      if(item.textHtml.length > 180){
        $Item.addClass('largeText');
      }
    }

    // add video placeholder to list item
    $vid = $('<div class="viddiv"></div>');
    $vid.text('video placeholder');
    $Item.append($vid);


    // add list item to unsorted list
    $('#container').append($Item);
    /* this can be optimized by appending in batch but single draw used here for modularization
    var items = document.getElementsByClassName($Items.get());
    $('#container').msnry( 'appended', $Item.get());
    */
    Tilers.msnry.appended($Item.get());

    Tilers.enableHovering($Item);
    Tilers.enableClick($Item);

  },

  initMasonry: function(){
    // add list to container
    var container = document.querySelector('#container');
    Tilers.msnry = new Masonry( container, {
      itemSelector: '.item',
      gutter: 2,
      transitionDuration: '0.5s',
      isFitWidth: true

    });
  },

  enableHovering : function($elem){
    $elem.mouseenter(function(){
      $(this).addClass('featured');
      // Tilers.msnry.layout(); //uncomment to get layout recalculated
    });
    $elem.mouseleave(function(){
      $(this).removeClass('featured');
      // Tilers.msnry.layout();  //uncomment to get layout recalculated
    });
  },

  enableClick : function ($elem){
    $elem.click( function() {
      $(this).toggleClass('is-expanded');
      Tilers.msnry.layout();
    });
  }

};
