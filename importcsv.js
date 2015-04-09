// import CSV

var mydata = {};
                                 
function handleFileSelect(evt) {
  var file = evt.target.files[0];

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      mydata = results;
      console.log(JSON.stringify(mydata, null, "  "));
      //console.log("fields, 0: "+results.meta['fields'][0]);
      //console.log("0, case: "+results.data[0]['case']);
      
      var myObject = results.meta['fields']
      var noOfFields = Object.keys(myObject).length
      console.log("number of fields: "+noOfFields);

        
      $(document).ready(function() {
        for (var i = 0; i < noOfFields; i++) {
          //$("#cues_list").append('<div id="div'+ i +'" />');
          $("#cues_list").append('\
            <article>\
                <ul class="cues">\
                    <li id="cue' +i+ '" class="widget color-orange">\
                      <input type="hidden" id="hidden-exit-dir" value="2"/> \
                        <div class="widget-head">\
                            <h3><span id="title' +i+ '">' +mydata.meta['fields'][i]+ '</span>\
                            <input type="radio" class="criterion" name="criterion" value="cue' +i+ '" /></h3>\
                        </div>\
                        <div class="widget-content">\
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>\
                        </div>\
                        <ul class="exits"\
                        </ul>\
                    </li>\
                </ul>\
            </article>'
          );
        }    
        
        init();
      });   
        
      
      
    }
  });
}

$(document).ready(function(){
  $("#csv-file").change(handleFileSelect);
});

