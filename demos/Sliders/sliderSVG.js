var Sliders = {
  //$container: $("body"),
  
  init: function($container){
      Sliders.$container = $container;

      sentimentHub.on('Data', Sliders.onData);
      sentimentHub.on('Done', Sliders.onDataDone);
      sentimentHub.fetch();
 
      myArray = [];

      for (var i=0; i<30; i++) {
        myImage = { id: "id" + i,
                    index: i,
                    x: 1,
                    y: 75,
                    width: 200,
                    height: 150,
                    image: "http://localhost/videogenie/storybox/testimage.jpg",
                    thumb: "http://localhost/videogenie/storybox/testimage.jpg"
                  };
        myArray.push(myImage);
      }
  },
  
  drawSliders : function (data){
   console.log(data);
    
    var checkImage = function(src) {

        var img = new Image();
        console.log(src);
        img.src = src;
        img.onload = function(){ console.log("good");};
        img.onerror = function(){ console.log("bad");};

    };

    var modData = function(data) {
      var img;

      for (var i = 0; i < data.length; i++) {
        data[i].id = "id" + data[i].id;
        data[i].index = i;
        data[i].x = 1;
        data[i].y = 75;
        data[i].width = 200;
        data[i].height = 150;
      }
      return data;
    };

    data = modData(data);

    var positionsFilled = {};
    var positionKeys = [];
    
    var positioner = function(index) {


      //make columns if non-existant
      if (Object.keys(positionsFilled).length === 0) {
        var columns = Math.floor(document.documentElement.clientWidth / 225);
        // console.log(columns);
        for (var i=0; i<columns; i++) {
          positionsFilled[(Math.floor(document.documentElement.clientWidth/columns) * i)] = false;
        }
        for (var key in positionsFilled) {
          positionKeys.push(key);
        }
        return getNewPosition(index);
      } else {
        return getNewPosition(index);
      }
       
    };

      var getNewPosition = function(index) {
        for (var i=positionKeys.length-1; i>=0; i--) {
          if (positionsFilled[positionKeys[i]] === false) {
            positionsFilled[positionKeys[i]] = ["index" + index];
            return positionKeys[i];
          }
        }
        positionsFilled['0'].push("index" + index);
        return positionKeys[0];
      };


    var svg = d3.select("body").append("svg")
      .attr("width", document.documentElement.clientWidth)
      .attr("height", 300)
      .attr("class", "graph-svg-component")
      .style("background", "black");

    var nodeGroup = svg.selectAll("svg")
      .data(data)
      .enter()
      .append("g")
      .attr("id", function(d) {return d.id; })
      .attr("class", function(d) {return d.id; })
      .attr("x", function(d) { return d.x; } )
      .attr("y", function(d) { return d.y; } );
      
     // nodeGroup.append("ellipse")
     //  .attr("cx", 50)
     //  .attr("cy", 50)
     //  .attr("rx", 25)
     //  .attr("ry", 10)
     //  .style("fill", "#AAA");


    nodeGroup.append("rect")
      .attr("id", function(d) { return "textbox" + d.id; } )
      // .attr("class", function(d) {return d.id; })
      .attr("x", function(d) { return d.x;} )
      .attr("y", function(d) { return d.y;} )
      .attr("width", 180 )
      .attr("height", 150 )
      .style("stroke", "white")
      .style("stroke-width", 15)
      .style("fill", function(d) { return d.color; } );


      nodeGroup.append("foreignObject")
      .attr("id", function(d) { return "textElement" + d.id; })
      .attr("class", function(d) {return d.id; })
      .attr("width", 50)
      .attr("height", 120)
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .style("font", "15px 'Helvetica Neue'")
      .style("color","#000")
      .html( function(d) { return d.textHtml; });


    nodeGroup.append("rect")
      .attr("id", function(d) { return d.id; } )
      .attr("class", function(d) {return d.id; })
      .attr("x", function(d) { return d.x; } )
      .attr("y", function(d) { return d.y;} )
      .attr("width", 200 )
      .attr("height", 150 )
      .style("stroke", "white")
      .style("stroke-width", 15)
      .style("fill", function(d) { return d.color; } );

    nodeGroup.append("clipPath")
      .attr("id", function(d) { return "innerClipPath" + d.id; })
      .append("rect")
      .attr("id", function(d) { return "innerRect" + d.id; })
      .attr("x", 10 )
      .attr("y", 85 )
      .attr("width", 178)
      .attr("height", 130);

    nodeGroup.append("image")
      .attr("id", function(d) {return d.id; })
      .attr("class", function(d) {return d.id; })
      .attr("xlink:href", function(d) { return d.thumb; })
      .attr("clip-path", function(d) { return "url(#innerClipPath" + d.id + ")";})
      .attr("x",  function(d) { return d.x; })
      .attr("y",  function(d) { return d.y; })
      .attr("width", 210)
      .attr("height", 190)
      .style("stroke", "black")
      .on("mouseover", function() {
        d3.selectAll("." + d3.select(this).attr("class"))
        .transition()
        .attr("y", function(d) { return d.y -60; } )
        .attr("width", 360 )
        .attr("height", 270 )
        .duration(1000)
        .delay(50);



        d3.selectAll("#innerRect" + d3.select(this).attr("id")).transition()
        .attr("y", 25 )
        .attr("width", 350)
        .attr("height", 250)
        .duration(1000)
        .delay(50);

        // for zoom
        d3.selectAll("#textbox" + d3.select(this).attr("id")).transition()
        //.attr("x", parseInt(d3.select(this).attr("x"), 10))
        .attr("y", function(d) { return d.y -60; } )
        .attr("width", 360)
        .attr("height", 270)
        .style("fill", "#BBB" )
        .duration(1000)
        .delay(50);

        // for slide out
        d3.selectAll("[id=textbox" + d3.select(this).attr("id") + "]").transition()
        .attr("x", parseInt(d3.select(this).attr("x"), 10) + 300 )
        .attr("y", function(d) { return d.y -60; } )
        .attr("width", 360)
        .attr("height", 270)
        .style("fill", "#BBB" )
        .duration(2000)
        .delay(500);

        d3.selectAll("[id=textElement" + d3.select(this).attr("id") + "]").transition()
        .attr("x", parseInt(d3.select(this).attr("x"), 10) + 380 )
        .attr("y", function(d) { return d.y - 30; } )
        .attr("width", 270)
        .attr("height", 220)
        .style("fill", "#BBB" )
        .duration(2000)
        .delay(500);


      })
      .on("mouseout", function() {
        d3.selectAll("." + d3.select(this).attr("class"))
        .transition()
        .attr("y", function(d) { return d.y; } )
        .attr("width", function(d) { return d.width; } )
        .attr("height", function(d) { return d.height; } )
        .duration(1000)
        .delay(500);

        d3.selectAll("#innerRect" + d3.select(this).attr("id")).transition()
        .attr("y", 85 )
        .attr("width", 178)
        .attr("height", 130)
        .duration(1000)
        .delay(500);



        // d3.selectAll("[id=textbox" + d3.select(this).attr("id") + "]").transition()
        // .transition()
        // .attr("y", function(d) { return d.y; } )
        // .attr("width", function(d) { return d.width; } )
        // .attr("height", function(d) { return d.height; } )
        // .duration(1000)
        // .delay(1000);


        d3.selectAll("[id=textbox" + d3.select(this).attr("id") + "]").transition()
        .attr("x",  parseInt(d3.select(this).attr("x"),10))
        .attr("y",  function(d) { return d.y; })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .duration(1000)
        .delay(10);

        d3.selectAll("[id=textElement" + d3.select(this).attr("id") + "]").transition()
        .attr("x",  parseInt(d3.select(this).attr("x"),10))
        .attr("y",  function(d) { return d.y; })
        .attr("width", 180)
        .attr("height", 150)
        .duration(1000)
        .delay(10);



      });
    var newXPos = 0;
    for (var j=0; j<data.length; j++) {
      newXPos = positioner(j);
      d3.selectAll("." + data[j].id).transition()
            .attr("x", newXPos)
            .attr("index", "index" + j)
            .duration(2000)
            .delay(500);

      d3.selectAll("#textbox" + data[j].id).transition()
            .attr("x", newXPos)
            .attr("index", "index" + j)
            .duration(2000)
            .delay(500);


      d3.selectAll("#innerRect" + data[j].id).transition()
            .attr("x", parseInt(newXPos,10)+10 )
            // .attr("index", "index" + j)
            .duration(2000)
            .delay(500);

    }



//right nav
    d3.selectAll("svg").append("text")
      .attr("x", document.documentElement.clientWidth-60 )
      .attr("y", 160)
      .style("font-family", "sans-serif")
      .style("font-size", 50)
      .style("text-anchor", "middle" )
      .style("fill", "#FFF")
      .text(">");

    d3.selectAll("svg").append("rect")
      .attr("id", "rightButton" ) //move items left
      .attr("x", document.documentElement.clientWidth-100 )
      .attr("y", 0)
      .attr("width", 100 )
      .attr("height", d3.select("svg").attr("height"))
      .style("opacity", 0.2)
      .style("fill", "black")
      .on("click", function() {
        
        var findCurrentPosition = function(index) {
           var usedPositions = [];
           var checkIndex = 0;

           for (var i = 0; i < positionKeys.length; i++) {
             usedPositions = positionsFilled[positionKeys[i]];
             checkIndex = usedPositions.indexOf(index);
               if (checkIndex !== -1) {
                 return positionKeys[i];
              }
           }
        };

        for (var i = 0; i < positionKeys.length; i++) {
          if ((positionsFilled[positionKeys[i]].length > 0) && (positionsFilled[positionKeys[i-1]] !== undefined)) {
             positionsFilled[positionKeys[i-1]].unshift(positionsFilled[positionKeys[i]].shift());
          }
        }

        for (var j = 0; j<data.length; j++) {
          d3.selectAll("[index=index" + j + "]").transition()
                .attr("x", findCurrentPosition("index" + j))
                .duration(1000)
                .delay(0);

          d3.selectAll("#innerRect" + data[j].id).transition()
                .attr("x", parseInt(findCurrentPosition("index" + j),10) +10)
                .duration(1000)
                .delay(0);

        }
      });



//left nav
    d3.selectAll("svg").append("text")
      .attr("x", 60 )
      .attr("y", 160)
      .style("font-family", "sans-serif")
      .style("font-size", 50)
      .style("text-anchor", "middle" )
      .style("fill", "#FFF")
      .text("<");

    d3.selectAll("svg").append("rect")
      .attr("id", "leftButton" )
      .attr("x", 0 )
      .attr("y", 0)
      .attr("width", 100 )
      .attr("height", d3.select("svg").attr("height"))
      .style("opacity", 0.2)
      .style("fill", "black" )
      .on("click", function() {
        
        var findCurrentPosition = function(index) {
          if (index === "index0") {
            console.log(positionKeys[i]);
          }
           var usedPositions = [];
           var checkIndex = 0;
           // console.log(index);

           for (var i = 0; i < positionKeys.length; i++) {
             // console.log(positionsFilled);
             // console.log(positionKeys);

             usedPositions = positionsFilled[positionKeys[i]];
             checkIndex = usedPositions.indexOf(index);
             // console.log(index, checkIndex);
               if (checkIndex !== -1) {
                 console.log(positionKeys[i]);
                 return positionKeys[i];
              }
           }
        };
        for (var i = positionKeys.length-1; i >= 0; i--) {
          if ((positionsFilled[positionKeys[i]].length >= 0 ) && (positionsFilled[positionKeys[i+1]] !== undefined)) {
             positionsFilled[positionKeys[i+1]].unshift(positionsFilled[positionKeys[i]].shift());
          }
        }
        for (var j = 0; j<data.length; j++) {
          d3.selectAll("[index=index" + j + "]").transition()
                .attr("x", findCurrentPosition("index" + j))
                .duration(1000)
                .delay(0);

          d3.selectAll("#innerRect" + data[j].id).transition()
                .attr("x", parseInt(findCurrentPosition("index" + j),10) +10)
                .duration(1000)
                .delay(0);
        }
      });
  },

  onData: function(network, data){
        $.each(data, function(key, item){
            // Sliders.drawItem(network, item);
            
            // let the library know we have used this item
            // sentimentHub.markDataItemAsUsed(item);
            
            // Sliders.playIfShared(item);
        });
    },
    
    // Triggered when we are done fetching data
    onDataDone: function(data){
      Sliders.drawSliders(data);
  
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
    drawItem: function(network, item){
        
        // For this example I am creating a separate network div for each network data and
        // append the items to the network div...
        var $networkDiv = $("."+network, Sliders.$container);
        if ($networkDiv.length < 1)
            $networkDiv = $("<div></div>").addClass("network").addClass(network)
                .append($("<h2></h2>").html(network))
                .appendTo(Sliders.$container);
        
        console.log("Item:", item);
        
        // create a div and attach the raw item data so we can use it to open the player popup on click
        var photo = item.image || item.thumb || item.profilePic;
        $networkDiv.append(
            $("<div></div>").addClass("item")
                .append(photo? $("<img />").attr({src: photo}) : '')
                .append($("<div></div>").addClass("info").html(item.text))
                .click(function(){
                    player.play(item);
                })
                .data({item: item})
        );
    }
};


    
