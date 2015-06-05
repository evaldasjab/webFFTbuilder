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
myDataset = {};  //GLOBAL!

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
  trueDataset = jQuery.extend(true, {}, results);   //GLOBAL VARIABLE!
  
  // get split values - means (average of min and max) of every variable's values
  var splitValuesArray = getSplitdValues(results);
    
  // convert values to binary
  var binaryDataset = convertToBinary(results, trueDataset, splitValuesArray);
    
    myDataset = binaryDataset;  // GLOBAL VARIABLE!
  
    //split the results equally for TRAINING and TESTING
    var myLength = myDataset.data.length;
    var myHalf = Math.floor(myLength/2);
    var mySecondHalf = myLength - myHalf;
    console.log('myLength: '+myLength+', myHalf: '+myHalf);
    myDataAllCases = myDataset.data;  // GLOBAL VARIABLE!
    myDataForTraining = myDataset.data.slice(0,myHalf);  // GLOBAL VARIABLE!
    //console.log('myDataForTraining: '+JSON.stringify(myDataForTraining, null, "  "));
    myDataForTesting = myDataset.data.slice(myHalf,myLength);  // GLOBAL VARIABLE!
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
                    <div title="Expand/Collapse the Cue"> \
                    <svg class="button_controls button_expand" height="20" width="20"> \
                      <polyline class="down" points="3 7,10 14,17 7"/> \
                      <polyline class="up" points="3 13,10 6,17 13"/> \
                    </svg> \
                    </div> \
                    <div class="widget_title" > \
                      <span id="title'+i+'" title="'+myCueName+'">'+myCueName+'</span> \
                    </div> \
                    <input type="radio" id="button_radio_'+i+'" class="criterion_class" name="criterion_name" value="cue'+i+'" /> \
                    <label for="button_radio_'+i+'" class="button_controls criterion_label" title="Select as Criterion"> \
                      <svg class="button_radio" height="20" width="20"> \
                        <circle cx="10" cy="10" r="6"/> \
                      </svg> \
                    </label> \
                  </div> \
                  <div class="widget_content"> \
                        <div class="unsortable">\
                            <table class="split_table"> \
                                <tr><td class="table_title" colspan="5">SPLIT OF CUE VALUES</td></tr> \
                                <tr><th>min</th><td class="stats_slider" colspan="3"><div class="split_slider" title="Change the Split Value"></div></td><th>max</th></tr> \
                                <tr><td class="cell_values" id="min_value" title="Minimum Value">0</td><th class="cell_exit" id="split_label_left" title="Values between MIN (included) and SPLIT (included) are...">no</th><td class="cell_values"><input type="text" id="split_value" value="0" title="Split Value"></input></td><th class="cell_exit" id="split_label_right" title="Values between SPLIT (excluded) and MAX (included) are...">yes</th><td class="cell_values" id="max_value" title="Maximum Value">0</td></tr> \
                                <tr><th></th><td class="swap" colspan="3" title="Swap YES and NO Ranges"><svg class="button_swap" height="20" width="40"><polyline class="left" points="9 3,2 10,9 17"/><polyline class="right" points="31 3,38 10,31 17"/><line x1="2" y1="10" x2="38" y2="10"/></svg></td><th></th></tr> \
                            </table> \
                        </div> \
                        <ul class="stat_cue_header unsortable"> \
                          <li class="stat_inline stat_cue unsortable">\
                            <table class="eval_table"> \
                                <tr><td class="stats_header table_title" colspan="6">STATS OF SINGLE CUE TREE</td></tr> \
                                <tr><td class="cell_narrow"></td><td></td><td class="table_header" colspan="4">PREDICTION</td></tr> \
                                <tr><td></td><td></td><th>yes</th><th>no</th><th>und</th><th>sum</th></tr> \
                                <tr><td class="table_header_rotated" rowspan="3"><div class="rotate">CRITERION</div></td><th class="cell_narrow">yes</td><td class="success" id="hits" title="Hits">Hit</td><td class="fail" id="misses" title="Misses">Miss</td><td class="undecided" id="undecided_pos" title="Undecided Positive">0</td><td class="cell_values" id="crit_yes_sum">0</td></tr> \
                                <tr><th class="cell_narrow">no</th><td class="fail" id="falsealarms" title="False Alarms">FA</td><td class="success" id="correctrejections" title="Correct Rejections">CR</td><td class="undecided" id="undecided_neg" title="Undecided Negative">0</td><td class="cell_values" id="crit_no_sum">0</td></tr> \
                                <tr><th class="cell_narrow">sum</th><td class="cell_values" id="pred_yes_sum">0</td><td class="cell_values" id="pred_no_sum">0</td><td class="cell_values" id="pred_und_sum">0</td><td class="cell_values" id="pred_sum_sum">0</td></tr> \
                                <tr><th></th></tr> \
                                <tr><th colspan="2" title="Probability of Hits">p(Hits)</th><th title="Probability of False Alarms">p(FA)</th><th title="D prime">d&#8242</th><th title="Frugality">Frug</th><th title="C or Bias">Bias</th></tr> \
                                <tr><td colspan="2" class="cell_values" id="pHits" title="Probability of Hits">0</td><td class="cell_values" id="pFA" title="Probability of False Alarms">0</td><td class="cell_values" id="dprime" title="D prime">0</td><td class="cell_values" id="frugality" title="Frugality">0</td><td class="cell_values" id="bias" title="C or Bias">0</td></tr> \
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
    myData = myDataAllCases;  // GLOBAL VARIABLE!
    
    // reset the statistics
    resetTreeStatistics(); // if there was from previous csv upload
    
    // FIX THIS!!!
    updateStatisticsForSingleCues();
    $('.widget').each(function() {
      var myId = $(this).attr('id');
      resetDerivativeView(myId);
    });
    
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
    if (tour.getCurrentStep()<=0) {
      tour.goTo(1);
    }
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
    mySplitObj.min = myFieldMin;
    mySplitObj.max = myFieldMax;
    mySplitObj.split = myFieldMean;
    mySplitObj.minisno_maxisyes = true;
    mySplitValuesArray.push(mySplitObj);
  }
  
  //console.log('HERE MEANS! myFieldValuesArray: '+JSON.stringify(myFieldValuesArray, null, "  "));

  return mySplitValuesArray;
}

function convertToBinary(mySet, myTrueSet, mySplitValuesArray) {
   
  console.log('CONVERT mySplitValuesArray: '+JSON.stringify(mySplitValuesArray, null, "  "));
  //console.log('BEFORE Dataset: '+JSON.stringify(mySet, null, "  "));
  //console.log('TRUE Dataset: '+JSON.stringify(myTrueSet, null, "  "));
    
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
          
      // replace value to 0, if it's in range of MIN (included) and SPLIT (included)
      if ( (myTrueObj[myFieldValues.name] >= myFieldValues.min) && (myTrueObj[myFieldValues.name] <= myFieldValues.split) ) {
        //console.log('MIN-SPLIT');
        switch (myFieldValues.minisno_maxisyes) {
          case true:
            //console.log('TRUE, so 0');
            myObj[myFieldValues.name] = 0;
            break;
          case false:
            //console.log('FALSE, so 1');
            myObj[myFieldValues.name] = 1;
            break;
        }
      // replace value to 1, if it's in range of SPLIT (excluded) and MAX (included)
      } else if ( (myTrueObj[myFieldValues.name] > myFieldValues.split) && (myTrueObj[myFieldValues.name] <= myFieldValues.max) ) {
        //console.log('SPLIT-MAX');
        switch (myFieldValues.minisno_maxisyes) {
          case true:
            //console.log('TRUE, so 1');
            myObj[myFieldValues.name] = 1;
            break;
          case false:
            //console.log('FALSE, so 0');
            myObj[myFieldValues.name] = 0;
            break;
        }          
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
            case 'data_ccu_FFTorg':
              //var myUrl = './data/data_ccu_FFTorg.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_ccu_FFTorg.csv';
              break;
            case 'data_ccu_89':
              //var myUrl = './data/data_ccu_89.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_ccu_89.csv';
              break;
            case 'data_ccu_89_rand':
              //var myUrl = './data/data_ccu_89_rand.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_ccu_89_rand.csv';
              break;
            case 'data_ccu_10':
              //var myUrl = './data/data_ccu_10.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_ccu_10.csv';
              break;
            case 'data_cmc_1cue':
              //var myUrl = './data/data_cmc_1cue.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_cmc_1cue.csv';
              break;
            case 'data_cmc_v1_1cue':
              //var myUrl = './data/data_cmc_v1_1cue.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_cmc_v1_1cue.csv';
              break;
            case 'data_cmc_FFT':
              //var myUrl = './data/data_cmc_FFT.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_cmc_FFT.csv';
              break;
            case 'data_cmc_v1_FFT':
              //var myUrl = './data/data_cmc_v1_FFT.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_cmc_v1_FFT.csv';
              break;
            case 'data_cmc_village2':
              //var myUrl = './data/data_cmc_village2.csv';
              var myUrl = 'https://dl.dropboxusercontent.com/u/15758787/data_csv/data_cmc_village2.csv';
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

