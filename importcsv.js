// Imports CSV file, displays cues for building the tree

/*
// activate the upload CSV file button
buttonUploadCsvFile();

 activate the load CSV sample button - CHANGE THE URL!!!
buttonLoadCsvSample('https://dl.dropboxusercontent.com/u/15758787/data_infarction.csv');

function buttonUploadCsvFile() {
  $('#button_upload_csv_file').mouseup(function (e) {    
    // get the file
    document.getElementById('csv-file').click();
  });
}
*/

// FIX THIS!!!
myDataset = {};

function handleFileSelect(evt) {
  
  // activate select data buttons
  buttonsAllcasesTrainingTesting();

  var myFile = evt.target.files[0];

  Papa.parse(myFile, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log('UPLOADED CSV FILE: '+JSON.stringify(results, null, "  "));
        
      listCues(results); 
    }
  });
  // mark the button as selected
  $('#button_upload_csv_file').toggleClass('button_on', true);
  $('#button_load_csv_sample').toggleClass('button_on', false);
}

function listCues(results){
      
  // remove fields containing non 0 or 1 values
  //var myDatasetFilter = filterOutNonZerosAndOnes(results);
  //console.log('Filtered Dataset: '+JSON.stringify(myDatasetFilter, null, "  "));
  
  // DEEP COPY the original dataset!
  var trueDataset = jQuery.extend(true, {}, results); 
  
  // get split values - means (average of min and max) of every variable's values
  var splitValuesArray = getSplitdValues(results);
    
  // convert values to binary
  var binaryDataset = convertToBinary(results, trueDataset, splitValuesArray);
  
    myDataset = binaryDataset;
  
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
                    <svg class="button_controls button_expand" height="20" width="20"> \
                      <polyline class="down" points="3 7,10 14,17 7"/> \
                      <polyline class="up" points="3 13,10 6,17 13"/> \
                    </svg> \
                    <div class="widget_title" > \
                      <span id="title'+i+'" title="'+myCueName+'">'+myCueName+'</span> \
                    </div> \
                    <input type="radio" id="button_radio_'+i+'" class="criterion_class" name="criterion_name" value="cue'+i+'" /> \
                    <label for="button_radio_'+i+'" class="button_controls criterion_label"> \
                      <svg class="button_radio" height="20" width="20"> \
                        <circle cx="10" cy="10" r="6"/> \
                      </svg> \
                    </label> \
                  </div> \
                  <div class="widget_content"> \
                        <ul class="stat_cue_header"> \
                          <li class="stats stat_cue unsortable">\
                            <table class="eval_table"> \
                                <tr class="row_to_delete"><td class="stats_slider" colspan="6"><div class="stat_slider"></div></td></tr> \
                                <tr class="row_to_delete"><td class="cell_values" id="yes_value" colspan="2">0</td><td class="success">yes</td><td class="cell_values"><input type="text" id="split_value" value="0"></input></td><td class="fail">no</td><td class="cell_values" id="no_value">0</td></tr> \
                                <tr class="row_to_delete"><th id="yes_label" colspan="2">max</th><td class="swap" colspan="3"><svg class="button_swap" height="20" width="40"><polyline class="left" points="7 6,2 11,7 16"/><polyline class="right" points="34 6,39 11,34 16"/><line x1="2" y1="11" x2="39" y2="11"/></svg></td><th id="no_label">min</th></tr> \
                                <tr><td class="stats_header table_title" colspan="6">STATS OF SINGLE CUE TREE</td></tr> \
                                <tr><td class="cell_narrow"></td><td></td><td class="table_header" colspan="4">PREDICTION</td></tr> \
                                <tr><td></td><td></td><th>yes</th><th>no</th><th>und</th><th>sum</th></tr> \
                                <tr><td class="table_header_rotated" rowspan="3"><div class="rotate">CRITERION</div></td><th class="cell_narrow">yes</td><td class="success" id="hits">Hit</td><td class="fail" id="misses">Miss</td><td class="undecided" id="undecided_pos">0</td><td class="cell_values" id="crit_yes_sum">0</td></tr> \
                                <tr><th class="cell_narrow">no</th><td class="fail" id="falsealarms">FA</td><td class="success" id="correctrejections">CR</td><td class="undecided" id="undecided_neg">0</td><td class="cell_values" id="crit_no_sum">0</td></tr> \
                                <tr><th class="cell_narrow">sum</th><td class="cell_values" id="pred_yes_sum">0</td><td class="cell_values" id="pred_no_sum">0</td><td class="cell_values" id="pred_und_sum">0</td><td class="cell_values" id="pred_sum_sum">0</td></tr> \
                                <tr><th></th></tr> \
                                <tr><th colspan="2">p(Hits)</th><th>p(FA)</th><th>d&#8242</th><th>Frug</th><th>Bias</th></tr> \
                                <tr><td colspan="2" class="cell_values" id="pHits">0</td><td class="cell_values" id="pFA">0</td><td class="cell_values" id="dprime">0</td><td class="cell_values" id="frugality">0</td><td class="cell_values" id="bias">0</td></tr> \
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
    
    // TEST!!!
    //scrollTextInTitle();
    
    // stop the loading spinners
    $('.spinner').remove();
    
    // show the number of cases on the buttons
    document.getElementById("button_allcases").textContent = 'All Cases: '+myLength.toString();
    document.getElementById("button_training").textContent = 'Training: '+myHalf.toString();
    document.getElementById("button_testing").textContent = 'Testing: '+mySecondHalf.toString();
    
    // in the beginning, show statistics with TRAINING data
    myData = myDataAllCases;
    
    // reset the statistics
    resetTreeStatistics(); // if there was from previous csv upload
    
    // activate split value slider, manual change and swap
    splitValueSliderChangeSwap(myDataset, trueDataset, splitValuesArray);
    
    // activate the EXPAND ALL button in the blue area
    buttonExpandAll('button_expand_all_blue');
    
    // activate the expand buttons (function in buildtree.js)
    buttonsExpand(); 
    
    // activate (but disable until there is at least one cue in the tree) EXPORT TO SERVERS buttons under the statistics tables
    buttonsExportToServer();
    
    init();
    
    // show next tooltip
    console.log('TIP 1');
    tour.goTo(1);
  
}

function getSplitdValues(mySet) {
  
  var mySplitValuesArray = [];
  
  // pick a field
  for (i in mySet.meta['fields']) {   // or mySet.data[0] ???
    var myField = mySet.meta['fields'][i];  // or mySet.data[0][i] ???
    //console.log('HERE! myField: '+myField);
    
    // initial values based on the first case
    var myFieldMin = mySet.data[0][myField];
    var myFieldMax = mySet.data[0][myField];
    
    // go through every object (case/row) in the data array
    // and find MIN and MAX values
    mySet.data.forEach(function(myObj) {  
      //console.log('HERE CHECK! myObj: '+JSON.stringify(myObj, null, "  "));
      
      // get MIN and MAX values
      if (myObj[myField] < myFieldMin) {
        myFieldMin = myObj[myField];
      }
      if (myObj[myField] > myFieldMax) {
        myFieldMax = myObj[myField];
      }
    });
    var myFieldMean = (myFieldMax + myFieldMin) / 2;
    
    var mySplitObj = {};
    mySplitObj.id = 'cue'+i;
    mySplitObj.name = myField;
    mySplitObj.yes = myFieldMax;
    mySplitObj.no = myFieldMin;
    mySplitObj.split = myFieldMean;
    mySplitValuesArray.push(mySplitObj);
  }
  
  //console.log('HERE MEANS! myFieldValuesArray: '+JSON.stringify(myFieldValuesArray, null, "  "));

  return mySplitValuesArray;
}

function convertToBinary(mySet, myTrueSet, mySplitValuesArray) {
   
  //console.log('BEFORE Dataset: '+JSON.stringify(mySet, null, "  "));
    
  // pick a field
  for (i in mySplitValuesArray) {
    //console.log(i+'i LOOP! myFieldValues: '+JSON.stringify(myFieldValues, null, "  "));
    
    var myFieldValues = mySplitValuesArray[i];
    
    // go through every object (case/row) in the ORIGINAL data array (results)
    // and replace value to 0 or 1, based on the split value in the BINARY data array (myDataset)

    //mySet.data.forEach(function(myObj) {
    for (c in mySet.data) {  
      
      var myTrueObj = myTrueSet.data[c];
      var myObj = mySet.data[c];
      //console.log(c+'c LOOP! myTrueObj: '+JSON.stringify(myTrueObj, null, "  "));
      //console.log(c+'c LOOP! myObj: '+JSON.stringify(myObj, null, "  "));
            
      // replace value to 0, if it's in range of SPLIT (included) and NO (included) values
      if ( (myTrueObj[myFieldValues.name] >= Math.min(myFieldValues.split, myFieldValues.no) ) &&
           (myTrueObj[myFieldValues.name] <= Math.max(myFieldValues.split, myFieldValues.no) ) ) {
        
        myObj[myFieldValues.name] = 0;
        
      // replace value to 1, if it's in range of YES (included) and SPLIT (excluded) values 
      } else {
        myObj[myFieldValues.name] = 1;
      }
    };
  }
  
  // add OR update the processed split_value to the dataset
  if (mySet.split_values == undefined) {
    mySet.split_values = mySplitValuesArray;
  } else {
    var mySplitId = mySplitValuesArray[0].id;
    var result = $.grep(mySet.split_values, function(e){ return e.id == mySplitId; });
    result[0] = mySplitValuesArray[0];
  }  
  
  console.log('AFTER Dataset: '+JSON.stringify(mySet, null, "  "));
  //console.log('TRUE Dataset: '+JSON.stringify(myTrueSet, null, "  "));
    
  return mySet;
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
  
  return mySet;
}
  
function scrollTextInTitle() {
  
  
  
$('.widget_title').on('mouseenter', function(e){
  
  console.log('WHAT IS THIS 1: '+this);
  
    var $this = $(this);
    
    console.log('WHAT IS THIS: '+e.target.childNodes[0].toString() );
    
    console.log('STRINGIFY: '+JSON.stringify(e.target.childNodes[0].nodeValue, null, "  "));

    if(this.offsetWidth < this.scrollWidth){
        
        $(function() {
          for (var i = 0; i < $('.widget_title').length; i++) {
              var this_el = $('.widget_title').eq(i);
              var interval = null;
              
                $(this_el).on("mouseenter",function() {
                  var that = $(this);
                  var this_indent = 0;
                    
                  interval = setInterval(function(){
                    this_indent--;
                      if(this_indent < -150) {
                          this_indent = 100;
                      }
                    $(that).css('text-indent', this_indent);
                  },20);
                  $(this).data("interval",interval);
                    
                });
                
                $(this_el).on("mouseleave",function() {
                    clearInterval($(this).data("interval"));
                    $(this).css("text-indent",0);
                });
              
          }
        });
        
        
    }



});
    
      
}

$(document).ready(function(){
  
    // initiate the tooltips tour
    showTooltipsTour();
    //activate HELP button
    buttonHelp();
    // activate EXPAND ALL buttons
    //buttonsExpandAll();
  
    $('#button_upload_csv_file').mouseup(function (e) {    
      // get the file
      document.getElementById('csv-file').click();
    });
  
    $("#csv-file").change(handleFileSelect);

    //$('#button_load_csv_sample').mouseup(function (e) {
    $('#button_load_csv_sample').selectmenu({
        change: function() {
          var selectedSample = $(this).val();
          switch (selectedSample) {
            case 'data_infarction':
              //var myUrl = './data/data_infarction.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_infarction.csv';
              break;
            case 'data_cmc':
              //var myUrl = './data/data_cmc.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_cmc.csv';
              break;
            default:
              return false;  // if none is selected
          }
          
          // activate select data buttons
          buttonsAllcasesTrainingTesting();
      
          //var myUrl = './data/data_infarction.csv';
          //var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_infarction.csv';
          Papa.parse(myUrl, {
              download: true,
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
              complete: function (results) {
                  console.log('LOADED CSV SAMPLE: ' + JSON.stringify(results, null, "  "));
  
                  listCues(results);
              },
              error: function (e) {
                  console.log(e);
              }
          });
          // mark the button as selected
          $('#button_upload_csv_file').toggleClass('button_on', false);
          $('#button_load_csv_sample').toggleClass('button_on', true);
                
        }
    });
});

