// Imports CSV file, displays cues for building the tree

// initiate the tooltips tour
showTooltipsTour();
helpButton(); //activate HELP button
                                 
function handleFileSelect(evt) {
  
  var myFile = evt.target.files[0];

  Papa.parse(myFile, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function(results) {
        
      $(document).ready(function() {
        
        console.log('Initial Dataset: '+JSON.stringify(results, null, "  "));
        //console.log("fields, 0: "+results.meta['fields'][0]);
        //console.log("0, case: "+results.data[0]['case']);
        
        // remove fields containing non 0 or 1 values
        myDataset = filterOutNonZerosAndOnes(results);
        console.log('Filtered Dataset: '+JSON.stringify(myDataset, null, "  "));
        
        // check if there is valid data left after filtering
        if (Object.keys(myDataset.data[0])==0) {
          alert('Invalid data: variables with only 1 or 0 values not found. Please upload another CSV file!');
        } else {
        
          //split the results equally for TRAINING and TESTING
          var myLength = myDataset.data.length;
          var myHalf = Math.floor(myLength/2);
          var mySecondHalf = myLength - myHalf;
          console.log('myLength: '+myLength+', myHalf: '+myHalf);
          myDataAllCases = myDataset.data;
          myDataForTraining = myDataset.data.slice(0,myHalf);
          //console.log('myDataForTraining: '+JSON.stringify(myDataForTraining, null, "  "));
          myDataForTesting = myDataset.data.slice(myHalf,myLength);
          //console.log('myDataForTesting: '+JSON.stringify(myDataForTesting, null, "  "));
          
          var noOfFields = Object.keys(myDataAllCases[0]).length;  // get it from the first object in the data array, not from "meta" object, because there are all fields including removed
          console.log("number of fields: "+noOfFields);
           
          console.log("names of fields: "+Object.keys(myDataset.data[0]));
          
          // remove old cues if there are, clear data in the stat
          document.getElementById('cues_list').innerHTML = "";
          document.getElementById('tree0').innerHTML = "";
          document.getElementById('tree1').innerHTML = "";
          
          for (var i = 0; i < noOfFields; i++) {
            
            var myCueName = Object.keys(myDataset.data[0])[i];
            
            $("#cues_list").append('\
              <article> \
                  <ul class="cues"> \
                      <li id="cue'+i+'" name='+myCueName+' class="widget"> \
                        <div class="widget_head"> \
                          <svg class="button_expand" height="20" width="20"> \
                            <polyline points="3 8,10 15,17 8"/> \
                          </svg> \
                          <div class="widget_title" > \
                            <span id="title'+i+'" title="'+myCueName+'">'+myCueName+'</span> \
                          </div> \
                          <input type="radio" id="button_radio_'+i+'" class="criterion_class" name="criterion_name" value="cue'+i+'" /> \
                          <label for="button_radio_'+i+'" class="criterion_label"> \
                            <svg class="button_radio" height="20" width="20"> \
                              <circle cx="10" cy="10" r="6"/> \
                            </svg> \
                          </label> \
                        </div> \
                        <div class="widget_content"> \
                              <ul class="stat_cue_header"> \
                                <li class="stats stat_cue unsortable">\
                                  <table class="eval_table" id="stat_cue'+i+'"> \
                                      <tr><td></td><td></td><td class="stats_header table_title" colspan="4">STATS OF SINGLE CUE TREE</td></tr> \
                                      <tr><td class="cell_narrow"></td><td></td><td class="table_header" colspan="4">PREDICTION</td></tr> \
                                      <tr><td></td><td></td><th>yes</th><th>no</th><th>und</th><th>sum</th></tr> \
                                      <tr><td class="table_header_rotated" rowspan="3"><div class="rotate">CRITERION</div></td><th class="cell_narrow">yes</td><td class="success" id="hits">Hit</td><td class="fail" id="misses">Miss</td><td class="undecided" id="undecided_pos">0</td><td class="cell_values" id="crit_yes_sum">0</td></tr> \
                                      <tr><th class="cell_narrow">no</th><td class="fail" id="falsealarms">FA</td><td class="success" id="correctrejections">CR</td><td class="undecided" id="undecided_neg">0</td><td class="cell_values" id="crit_no_sum">0</td></tr> \
                                      <tr><th class="cell_narrow">sum</th><td class="cell_values" id="pred_yes_sum">0</td><td class="cell_values" id="pred_no_sum">0</td><td class="cell_values" id="pred_und_sum">0</td><td class="cell_values" id="pred_sum_sum">0</td></tr> \
                                      <tr><th></th></tr> \
                                      <tr><td></td><td></td><th>p(Hits)</th><th>p(FA)</th><th>d"</th><th>Frug</th></tr> \
                                      <tr><td></td><td></td><td class="cell_values" id="pHits">0</td><td class="cell_values" id="pFA">0</td><td class="cell_values" id="dprime">0</td><td class="cell_values" id="frugality">0</td></tr> \
                                  </table> \
                                </li \
                              </ul> \
                        </div> \
                        <ul class="exits" \
                        </ul> \
                      </li> \
                  </ul> \
              </article>'
            );
          }    
          
          // show the number of cases on the buttons
          document.getElementById("button_allcases_id").textContent = 'All Cases: '+myLength.toString();
          document.getElementById("button_training_id").textContent = 'Training: '+myHalf.toString();
          document.getElementById("button_testing_id").textContent = 'Testing: '+mySecondHalf.toString();
          
          // in the beginning, show statistics with TRAINING data
          myData = myDataAllCases;
          // change the look of the buttons
          document.getElementById('button_allcases_id').className = "button_selectdata button_allcases button_t_on";
          document.getElementById('button_training_id').className = "button_selectdata button_training button_t_off";
          document.getElementById('button_testing_id').className = "button_selectdata button_testing button_t_off";
          // activate buttons to switch the data
          trainingTestingButtons();
          
          // update the statistics
          resetTreeStatistics(); // if there was from previous csv upload
          
          //DISABLE FOR TESTING!!!
          expandButtons(); // activate the expand buttons (function in buildtree.js)
          
          // activate EXPAND ALL button
          expandAllButtons();
          
          // activare EXPORT TO SERVERS buttons under the statistics tables
          exportToServerButtons();
          
          init();
          
          // show next tooltip
          console.log('TIP 1');
          tour.goTo(1);
        }  
        
      });   
    }
  });
}

function filterOutNonZerosAndOnes(mySet) {
  
  // pick a field
  for (i in mySet.meta['fields']) {
    var myField = mySet.meta['fields'][i];
    //console.log('HERE! myField: '+myField);
    
    // go through every object in the data array
    mySet.data.every(function(myObj) {   // can't use forEach because it has no 'break'
      //console.log('HERE CHECK! myObj: '+JSON.stringify(myObj, null, "  "));
      
      // check if the field has values only 0 or 1
      if (myObj[myField] !=0 && myObj[myField] !=1) {
        console.log('HERE! myField TO BE REMOVED: '+myField);
        
        // if not, delete the field from all objects in the data array
        mySet.data.forEach(function(myObjForDelete) {
          delete myObjForDelete[myField];
        });
        //console.log('HERE FILTERED! myDataset: '+JSON.stringify(myDataset, null, "  "));
        
        // break - don't look for other values of this field
        return false;
      };  
      return true; // needed for .every
    });
  }
  
  // remove empty objects in the data array
  //var myCopyData = mySet.data;
  //for (var i in myCopyData) {
  //  if (Object.keys(myCopyData[i])==0) {
  //    console.log('TRUE!');
  //    delete myCopyData[i];
  //  }          
  //}
  //myCopyData = myCopyData.filter(function(n){ return n != null }); // alternative is to use splice()
  //console.log('HERE! myCopyData: '+JSON.stringify(myCopyData, null, "  "));
  //alert('stop');
  //mySet.data = myCopyData;
  
  //console.log('HERE FINISHED! myDataset: '+JSON.stringify(myDataset, null, "  "));
  return mySet;
}

$(document).ready(function(){
  $("#csv-file").change(handleFileSelect);
});

