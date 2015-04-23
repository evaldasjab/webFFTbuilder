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
                    <li id="cue'+i+'" class="widget color-orange">\
                      <input type="hidden" id="hidden-exit-yes" value="continue"/> \
                      <input type="hidden" id="hidden-exit-no" value="continue"/> \
                        <div class="widget-head h3">\
                            <input type="radio" class="criterion" name="criterion" value="cue' +i+ '" />\
                            <span id="title' +i+ '">' +mydata.meta['fields'][i]+ '</span>\
                            <button id="icons" class="collapse-ui-cue ui-state-default ui-corner-all" title=".ui-icon-carat-2-n-s"><span class="ui-icon ui-icon-carat-2-n-s"></span></button>\
                            <button id="icons" class="close-ui-cue ui-state-default ui-corner-all" title=".ui-icon-close"><span class="ui-icon ui-icon-close"></span></button>\
                        </div>\
                        <div class="widget-content">\
                            <p>\
                              <table class="evaluation" style="width:100%">\
                                  <tr>\
                                    <td></td>\
                                    <td></td>\
                                    <td colspan="3">Criterion</td>\
                                  </tr>\
                                  <tr>\
                                    <th></th>\
                                    <th></th>\
                                    <th>Yes</th>\
                                    <th>No</th>\
                                    <th>Sum</th>\
                                  </tr>\
                                  <tr>\
                                    <td rowspan="3"><div class="rotate">Prediction</div></td>\
                                    <th>Yes</td>\
                                    <td>0</td>\
                                    <td>0</td>\
                                    <td>0</td>\
                                  </tr>\
                                  <tr>\
                                    <th>No</td>\
                                    <td>0</td>\
                                    <td>0</td>\
                                    <td>0</td>\
                                  </tr>\
                                  <tr>\
                                    <th>Sum</th>\
                                    <td>0</td>\
                                    <td>0</td>\
                                    <td>0</td>\
                                  </tr>\
                              </table>\
                            </p>\
                            <p>\
                              <table class="evaluation" style="width:100%">\
                                  <tr>\
                                    <th>Prob</th>\
                                    <th>H</th>\
                                    <th>FA</th>\
                                    <th>H-FA</th>\
                                  </tr>\
                                  <tr>\
                                    <th>0</td>\
                                    <td>0</td>\
                                    <td>0</td>\
                                    <td>0</td>\
                                  </tr>\
                              </table>\
                            </p>\
                            <p>\
                              <table class="evaluation" style="width:100%">\
                                  <tr>\
                                    <th>Frugality</th>\
                                    <th>d-prime</th>\
                                  </tr>\
                                  <tr>\
                                    <td>0</td>\
                                    <td>0</td>\
                                  </tr>\
                              </table>\
                            </p>\
                        </div>\
                        <ul class="exits"\
                        </ul>\
                    </li>\
                </ul>\
            </article>'
          );
        }    
        
        //collapseCueButtons(); // activate the collapse buttons (function in buildtree.js)
        closeCueButtons();  // activate the close buttons (function in buildtree.js)
                
        init();
      });   
        
      
      
    }
  });
}

$(document).ready(function(){
  $("#csv-file").change(handleFileSelect);
});

