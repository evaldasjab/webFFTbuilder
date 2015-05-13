// import CSV

var myDataset = {};
                                 
function handleFileSelect(evt) {
  var file = evt.target.files[0];

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      myDataset = results;
      console.log(JSON.stringify(myDataset, null, "  "));
      //console.log("fields, 0: "+results.meta['fields'][0]);
      //console.log("0, case: "+results.data[0]['case']);
      
      var myObject = myDataset.meta['fields'];
      var noOfFields = Object.keys(myObject).length;
      console.log("number of fields: "+noOfFields);
        
      $(document).ready(function() {
        for (var i = 0; i < noOfFields; i++) {
          //$("#cues_list").append('<div id="div'+ i +'" />');
          $("#cues_list").append('\
            <article>\
                <ul class="cues">\
                    <li id="cue'+i+'" name='+myDataset.meta['fields'][i]+' class="widget color-orange">\
                      <input type="hidden" id="hidden-exit-yes" value="exit"/> \
                      <input type="hidden" id="hidden-exit-no" value="exit"/> \
                        <div class="widget-head h3">\
                            <input type="radio" class="criterion" name="criterion" value="cue' +i+ '" />\
                            <span id="title' +i+ '">' +myDataset.meta['fields'][i]+ '</span>\
                            <button id="icons" class="collapse-ui-cue ui-state-default ui-corner-all" title=".ui-icon-carat-2-n-s"><span class="ui-icon ui-icon-carat-2-n-s"></span></button>\
                            <button id="icons" class="close-ui-cue ui-state-default ui-corner-all" title=".ui-icon-close"><span class="ui-icon ui-icon-close"></span></button>\
                        </div>\
                        <div class="widget-content">\
                          <ul class="stats stat_cue_header">Stats of this Cue\
                            <li class="stat_cue">\
                              <p>\
                                <table class="eval_table">\
                                    <tr><td></td><td></td><td colspan="3">Prediction</td></tr>\
                                    <tr><th></th><th></th><th>Yes</th><th>No</th><th>Und</th><th>Sum</th></tr>\
                                    <tr><td rowspan="3"><div class="rotate">Criterion</div></td><th>Yes</td><td class="success" id="hits">0</td><td class="fail" id="misses">0</td><td class="undecided" id="undecided_pos">0</td><td id="crit_yes_sum">0</td></tr>\
                                    <tr><th>No</td><td class="fail" id="falsealarms">0</td><td class="success" id="correctrejections">0</td><td class="undecided" id="undecided_neg">0</td><td id="crit_no_sum">0</td></tr>\
                                    <tr><th>Sum</th><td id="pred_yes_sum">0</td><td id="pred_no_sum">0</td><td id="pred_und_sum">0</td><td id="pred_sum_sum">0</td></tr>\
                                </table>\
                              </p>\
                              <p>\
                                <table class="eval_table">\
                                    <tr><th>p(Hits)</th><th>p(FA)</th><th>d"</th><th>Frug</th></tr>\
                                    <tr><td id="pHits">0</td><td id="pFA">0</td><td id="dprime">0</td><td id="frugality">0</td></tr>\
                                </table>\
                              </p>\
                              <p>\
                                <table class="eval_table">\
                                    <tr><th>A"</th><th>B"</th><th>B""</th><th>Bias</th></tr>\
                                    <tr><td id="aprime">0</td><td id="bprime">0</td><td id="bdprime">0</td><td id="bias">0</td></tr>\
                                </table>\
                              </p>\
                            </li>\
                          </ul>\
                          <ul class="stats stat_tree_header">Tree up to this Cue:\
                            <li class="stat_tree">\
                              <p>\
                                <table class="eval_table">\
                                    <tr><td></td><td></td><td colspan="3">Prediction</td></tr>\
                                    <tr><th></th><th></th><th>Yes</th><th>No</th><th>Und</th><th>Sum</th></tr>\
                                    <tr><td rowspan="3"><div class="rotate">Criterion</div></td><th>Yes</td><td class="success" id="hits">0</td><td class="fail" id="misses">0</td><td class="undecided" id="undecided_pos">0</td><td id="crit_yes_sum">0</td></tr>\
                                    <tr><th>No</td><td class="fail" id="falsealarms">0</td><td class="success" id="correctrejections">0</td><td class="undecided" id="undecided_neg">0</td><td id="crit_no_sum">0</td></tr>\
                                    <tr><th>Sum</th><td id="pred_yes_sum">0</td><td id="pred_no_sum">0</td><td id="pred_und_sum">0</td><td id="pred_sum_sum">0</td></tr>\
                                </table>\
                              </p>\
                              <p>\
                                <table class="eval_table">\
                                    <tr><th>p(Hits)</th><th>p(FA)</th><th>d"</th><th>Frug</th></tr>\
                                    <tr><td id="pHits">0</td><td id="pFA">0</td><td id="dprime">0</td><td id="frugality">0</td></tr>\
                                </table>\
                              </p>\
                              <p>\
                                <table class="eval_table">\
                                    <tr><th>A"</th><th>B"</th><th>B""</th><th>Bias</th></tr>\
                                    <tr><td id="aprime">0</td><td id="bprime">0</td><td id="bdprime">0</td><td id="bias">0</td></tr>\
                                </table>\
                              </p>\
                            </li>\
                          </ul>\
                        </div>\
                        <div>\
                          <canvas class="cue_canvas" width="150" height="75"></canvas>\
                        </div>\
                        <ul class="exits"\
                        </ul>\
                    </li>\
                </ul>\
            </article>'
          );
        }    
        
        //DISABLE FOR TESTING!!!
        collapseCueButtons(); // activate the collapse buttons (function in buildtree.js)
        
        // FIX THIS!
        //$('.stat_cue_header').hide();
        $('.stat_tree_header').hide();
        //$('.stat_tree').hide();
        
        // activate CLOSE buttons
        $( "li" ).each(function( index ) {
          var myCueId = $(this).closest('.widget').attr('id');
          //console.log('IMPORT myCueId: '+myCueId);
          activateCloseCueButton(myCueId);
        });
        
        init();
      });   
    }
  });
}

$(document).ready(function(){
  $("#csv-file").change(handleFileSelect);
});

