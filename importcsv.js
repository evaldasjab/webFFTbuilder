// import CSV

var myDataset = {};
                                 
function handleFileSelect(evt) {
  var myFile = evt.target.files[0];

  Papa.parse(myFile, {
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
            <article> \
                <ul class="cues"> \
                    <li id="cue'+i+'" name='+myDataset.meta['fields'][i]+' class="widget"> \
                      <div class="widget_head"> \
                        <input type="hidden" id="hidden-exit_yes" value="exit"/> \
                        <input type="hidden" id="hidden-exit_no" value="exit"/> \
                        <button class="button_expand">&#9661</button> \
                        <input type="radio" id="button_radio_'+i+'" class="criterion_class" name="criterion_name" value="cue'+i+'" /> \
                        <label for="button_radio_'+i+'" class="criterion_label">&#9898</label> \
                        <div class="widget_title" > \
                          <span id="title'+i+'">'+myDataset.meta['fields'][i]+'</span> \
                        </div> \
                      </div> \
                      <div class="widget_content"> \
                            <ul class="stat_cue_header"> \
                              <li class="stats stat_cue">\
                                <table class="eval_table" id="stat_cue'+i+'"> \
                                    <tr><td></td><td></td><td class="stats_header table_header" colspan="4">STATS OF SINGLE CUE TREE</td></tr> \
                                    <tr><td class="cell_narrow"></td><td></td><td class="table_header cell_grey" colspan="4">PREDICTION</td></tr> \
                                    <tr><td></td><td></td><th>yes</th><th>no</th><th>und</th><th>sum</th></tr> \
                                    <tr><td class="table_header_rotated" rowspan="3"><div class="rotate">CRITERION</div></td><th class="cell_narrow">yes</td><td class="success" id="hits">0</td><td class="fail" id="misses">0</td><td class="undecided" id="undecided_pos">0</td><td class="cell_grey" id="crit_yes_sum">0</td></tr> \
                                    <tr><th class="cell_narrow">no</th><td class="fail" id="falsealarms">0</td><td class="success" id="correctrejections">0</td><td class="undecided" id="undecided_neg">0</td><td class="cell_grey" id="crit_no_sum">0</td></tr> \
                                    <tr><th class="cell_narrow">sum</th><td class="cell_grey" id="pred_yes_sum">0</td><td class="cell_grey" id="pred_no_sum">0</td><td class="cell_grey" id="pred_und_sum">0</td><td class="cell_grey" id="pred_sum_sum">0</td></tr> \
                                    <tr><th></th></tr> \
                                    <tr><td></td><td></td><th>p(Hits)</th><th>p(FA)</th><th>d"</th><th>Frug</th></tr> \
                                    <tr><td></td><td></td><td class="cell_grey" id="pHits">0</td><td class="cell_grey" id="pFA">0</td><td class="cell_grey" id="dprime">0</td><td class="cell_grey" id="frugality">0</td></tr> \
                                </table> \
                              </li \
                            </ul> \
                      </div> \
                      <div> \
                        <canvas class="cue_canvas" width="40" height="40"></canvas> \
                      </div> \
                      <ul class="exits" \
                      </ul> \
                    </li> \
                </ul> \
            </article>'
          );
        }    
        
        //DISABLE FOR TESTING!!!
        //collapseCueButtons(); // activate the collapse buttons (function in buildtree.js)
        expandButtons(); // activate the expand buttons (function in buildtree.js)
        
        // activare EXPORT TO SERVERS buttons under the statistics tables
        exportToServerButtons();
        
        // FIX THIS!
        //$('.stat_cue_header').hide();
        //$('.stat_tree_header').hide();
        //$('.stat_tree').hide();
        
        // activate CLOSE buttons
        //$( "li" ).each(function( index ) {
        //  var myCueId = $(this).closest('.widget').attr('id');
          //console.log('IMPORT myCueId: '+myCueId);
        //  activateCloseCueButton(myCueId);
        //});
        
        init();
      });   
    }
  });
}

$(document).ready(function(){
  $("#csv-file").change(handleFileSelect);
});

