// Makes and activates buttons, adds htmls

function splitValueSliderChangeSwap(mySet, myTrueSet, mySplitValuesArray) {
    
    //myDataset.split_values.forEach(function(myObj) {
    mySplitValuesArray.forEach(function(mySplitObj) {
      
        //console.log('HERE CHECK BEFORE! myObj: '+JSON.stringify(myObj, null, "  "));
      
        var myCueId = mySplitObj.id;
        
        // update the values in the widget content
        $('#'+myCueId+' #yes_value').text(mySplitObj.yes);
        $('#'+myCueId+' #no_value').text(mySplitObj.no);
        $('#'+myCueId+' #split_value').val(mySplitObj.split);
        
        if ((mySplitObj.yes > mySplitObj.no)) {
            var minVal = mySplitObj.no;
            var maxVal = mySplitObj.yes;
            var reverseSlider = true;
        } else {
            var minVal = mySplitObj.yes;
            var maxVal = mySplitObj.no;
            var reverseSlider = false;
        }
        
        $('#'+myCueId+' .stat_slider').slider({
            isRTL: true,
            min: minVal,
            max: maxVal,
            value: mySplitObj.split,
            step: 0.1,
            slide: function(event, ui) {
                $('#'+myCueId+' #split_value').val(ui.value);
                //$( "input" ).val( "$" + ui.value );
            },
            change: function( event, ui ) {
                // change binary values of this cue/field in the dataset
                mySplitObj.split = ui.value;
                //console.log('HERE CHECK AFTER! myObj: '+JSON.stringify(myObj, null, "  "));
                var mySet = convertToBinary(myDataset, myTrueSet, [mySplitObj]);
                
                // update statistics, if there a criterion already selected
                if (criterCueId != '') {
                    updateJsonDataset('tree0'); // update JSON object and tree statistics
                    updateJsonDataset('tree1'); // update JSON object and tree statistics
                    updateStatForOneSingleCue(myCueId); //update statistics in the blue area
                }
            }
        });
        
        $('#'+myCueId+' #split_value').change(function () {
            //var value = this.value.substring(1);
            var value = $(this).val();
            $('#'+myCueId+' .stat_slider').slider("value", parseFloat(value));
        });
        
        $('#'+myCueId+' .button_swap').mouseup(function (e) {
            
            // swap the MAX and MIN values
            var myYesValue = mySplitObj.yes;
            var myNoValue = mySplitObj.no;
            //var mySplitValue = mySplitObj.split;
            mySplitObj.yes = myNoValue;
            mySplitObj.no = myYesValue;
            //mySplitObj.split = myYesValue - mySplitValue + myNoValue;
            
            //alert( 'mySplitObj: '+JSON.stringify(mySplitObj, null, "  ") );
            
            $('#'+myCueId+' #yes_value').text(mySplitObj.yes);
            $('#'+myCueId+' #no_value').text(mySplitObj.no);
            //$('#'+myCueId+' #split_value').val(mySplitObj.split);
                                             
            // swap the MAX and MIN labels
            var myYesLabel = $('#'+myCueId+' #yes_label').text();
            var myNoLabel = $('#'+myCueId+' #no_label').text();
            $('#'+myCueId+' #yes_label').text(myNoLabel);
            $('#'+myCueId+' #no_label').text(myYesLabel);
            
            // swap slider
            if ((mySplitObj.yes > mySplitObj.no)) {
                var minVal = mySplitObj.no;
                var maxVal = mySplitObj.yes;
                var reverseSlider = true;
            } else {
                var minVal = mySplitObj.yes;
                var maxVal = mySplitObj.no;
                var reverseSlider = false;
            }
            $('#'+myCueId+' .stat_slider').slider({
                isRTL: reverseSlider,
                min: minVal,
                max: maxVal,
                value: mySplitObj.split,
            });
            
            // update the dataset
            var mySet = convertToBinary(myDataset, myTrueSet, [mySplitObj]);
                
            // update statistics, if there a criterion already selected
            if (criterCueId != '') {
                updateJsonDataset('tree0'); // update JSON object and tree statistics
                updateJsonDataset('tree1'); // update JSON object and tree statistics
                //updateStatForOneSingleCue(myCueId); //update statistics in the blue area
            }
             
        });
    });
}

function changeBinaryValues(myFieldValues) {
    
    // go through every object (case/row) in the data array
    // and replace value to 0 or 1, based on the split value
    myDataset.data.forEach(function(myObj) {
      
      //console.log('HERE CHECK! myObj: '+JSON.stringify(myObj, null, "  "));
      
      // replace value to 0, if it's in range of SPLIT (included) and NO (included) values
      if ( (myObj[myFieldValues.name] >= Math.min(myFieldValues.split, myFieldValues.no) ) && (myObj[myFieldValues.name] <= Math.max(myFieldValues.split, myFieldValues.no) ) ) {
        myObj[myFieldValues.name] = 0;
      // replace value to 1, if it's in range of YES (included) and SPLIT (excluded) values 
      } else {
        myObj[myFieldValues.name] = 1;
      }
    });

    console.log('UPDATED BINARY! myDataset: '+JSON.stringify(myDataset, null, "  "));
}

function buttonHelp() {
    
    $('.button_help').mouseup(function (e) {  
        console.log('START TOUR! TIP 0');
        //tour.start(true);
        // Start the tour
        tour.restart(true);
        tour.goTo(0); // after reload of page not always restarts from teh beginning
    });
}

function buttonsAllcasesTrainingTesting() {
    
    // enable the buttons
    $('.button_selectdata').removeClass('disabled');
    
    // create loading spinners
    showSpinner('button_allcases');
    showSpinner('button_training');
    showSpinner('button_testing');
    // show loading spinners if hidden
    //$('#loading_spinner_all').show();
    //$('#loading_spinner_train').show();
    //$('#loading_spinner_test').show();
    
    $('#button_allcases').mouseup(function (e) {  
        console.log('ALL CASES!');
        // switch the data
        myData = myDataAllCases;
        // change the look of the buttons
        $('#button_allcases').toggleClass('button_on', true);
        $('#button_training').toggleClass('button_on', false);
        $('#button_testing').toggleClass('button_on', false);
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
    });
    
    $('#button_training').mouseup(function (e) {  
        console.log('TRAINING!');
        // switch the data
        myData = myDataForTraining;
        // change the look of the buttons
        $('#button_allcases').toggleClass('button_on', false);
        $('#button_training').toggleClass('button_on', true);
        $('#button_testing').toggleClass('button_on', false);
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
        
        // show next tooltip
        console.log('TIP 2');
        tour.goTo(2);
    });
    
     $('#button_testing').mouseup(function (e) {  
        console.log('TESTING!');
        // switch the data
        myData = myDataForTesting;
        // change the look of the buttons
        $('#button_allcases').toggleClass('button_on', false);
        $('#button_training').toggleClass('button_on', false);
        $('#button_testing').toggleClass('button_on', true);
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
        
        // show next tooltip
        console.log('TIP 16');
        tour.goTo(16);
    });
}
function deactivateButtonsAllcasesTrainingTesting() {
    
    // disable the buttons
    $('.button_selectdata').addClass('disabled');
    
    // stop the loading spinners
    $('.spinner').remove();
    
    // hide loading spinners
    //$('#loading_spinner_all').hide();
    //$('#loading_spinner_train').hide();
    //$('#loading_spinner_test').hide();
    
    // remove numbers of cases on the buttons
    //document.getElementById("button_allcases").textContent = 'All Cases: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    //document.getElementById("button_training").textContent = 'Training: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    //document.getElementById("button_testing").textContent = 'Testing: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
}

function showSpinner(myLocationId) {
    var opts = {
      lines: 8 // The number of lines to draw
    , length: 15 // The length of each line
    , width: 10 // The line thickness
    , radius: 12 // The radius of the inner circle
    , scale: 0.25 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: 'Grey' // #rgb or #rrggbb or array of colors
    , opacity: 0.10 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
    }
    var target = document.getElementById(myLocationId)
    spinner = new Spinner(opts).spin(target);
}


function buttonExpandAll(myButtonId) {
    
    //console.log('ACTIVATE EXPANSION!');
    
    // remove event if already was activated
    $('#'+myButtonId).unbind('mouseup');
    
    // remove class 'disabled'
    $('#'+myButtonId).attr('class', 'buttons_controls button_expand_all'); 
    
    // hide icon UP by default
    $('.button_expand_all .up').hide();
    $('.button_expand_all .down').show();
    
    $('#'+myButtonId).mouseup(function (e) {  
        
        // if there is no cue with expanded stats, expand all
        if ($(this).parent('.page_area').find('.widget_content:visible').length == 0) {
            $(this).parent('.page_area').find('.widget_content').animate({height:'show',width:'show'});
            
            // change the icons - individual and 'expand all'
            $(this).parent('.page_area').find('.button_expand .up').show(300);
            $(this).parent('.page_area').find('.button_expand .down').hide();
            $(this).find('.up').show(300);
            $(this).find('.down').hide();
            
        // if there is at least one expanded, collapse all
        } else {
            $(this).parent('.page_area').find('.widget_content').animate({height:'hide',width:'hide'});
            
            // change the icons - individual and 'expand all'
            $(this).parent('.page_area').find('.button_expand .up').hide();
            $(this).parent('.page_area').find('.button_expand .down').show(300);
            $(this).find('.up').hide();
            $(this).find('.down').show(300);
            
            // show next tooltip
            console.log('TIP 5 or 10');
            if (tour.getCurrentStep()<=4) {
                tour.goTo(5);
            } else {
                tour.goTo(10);
            }
        }
    });
}

function deactivateButtonExpandAll(myButtonId) {
        
    // remove event 
    $('#'+myButtonId).unbind('mouseup');
    
    // add class 'disabled'
    $('#'+myButtonId).attr('class', 'buttons_controls button_expand_all disabled'); 
    
}

function buttonsExpand() {
    
    // hide icon UP by default
    $('.button_expand .up').hide();
    
    //console.log('ACTIVATE EXPANSION!');
    
    $('.button_expand').mouseup(function (e) {  
        
        // if the widget content is hidden, expand
        if ( $(this).closest('.widget').find('.widget_content').is(':hidden') ) {
            console.log('EXPAND!');
            
            $(this).closest('.widget').find('.widget_content').animate({height:'show',width:'show'});
            
            // change the icons - individual and 'expand all'
            $(this).find('.up').show(300);
            $(this).find('.down').hide();
            $(this).closest('.page_area').find('.button_expand_all .up').show(300);
            $(this).closest('.page_area').find('.button_expand_all .down').hide();
            
        // if the widget content is shown, collapse
        } else {
            console.log('COLLAPSE!');
            
            $(this).closest('.widget').find('.widget_content').animate({height:'hide',width:'hide'});
            
            // change the icons - individual and 'expand all'
            $(this).find('.up').hide();
            $(this).find('.down').show(300);
            $(this).closest('.page_area').find('.button_expand_all .up').hide();
            $(this).closest('.page_area').find('.button_expand_all .down').show(300);
        }
        
        // show next tooltip
        console.log('TIP 4');
        tour.goTo(4);
    });
    
    // hide the content by default
    $('.horiz_scroll').find('.widget_content').hide();  // DISABLE FOR TESTING!!!
    
    //$('.horiz_scroll, .trees').on('click', '.button_expand', function (e) {  
    //    $(this).parents('.widget').find('.widget_content').slideToggle('slow');
    //});
}
function activateButtonExpand(myCueId) {
    
    // hide icon UP by default
    $('#'+myCueId+' .button_expand .up').hide();
    $('#'+myCueId+' .button_expand .down').show();
    
    $('#'+myCueId+' .button_expand').mouseup(function (e) { 

        // if the widget content is hidden, expand
        if ( $(this).closest('.widget').find('.widget_content').is(':hidden') ) {
            console.log('EXPAND!');
            
            $(this).closest('.widget').find('.widget_content').animate({height:'show'});
            
            // change the icons - individual and 'expand all'
            $(this).find('.up').show(300);
            $(this).find('.down').hide();
            $(this).closest('.page_area').find('.button_expand_all .up').show(300);
            $(this).closest('.page_area').find('.button_expand_all .down').hide();
            
        // if the widget content is shown, collapse
        } else {
            console.log('COLLAPSE!');
            
            $(this).closest('.widget').find('.widget_content').animate({height:'hide'});
            
            // change the icons - individual and 'expand all'
            $(this).find('.up').hide();
            $(this).find('.down').show(300);
            $(this).closest('.page_area').find('.button_expand_all .up').hide();
            $(this).closest('.page_area').find('.button_expand_all .down').show(300);
        }
        
        // show next tooltip
        console.log('TIP 8');
        tour.goTo(8);
    });
}

function htmlButtonClose() {
    var myHtml = '<svg class="button_controls button_close" height="20" width="20"> \
                          <line x1="6" y1="6" x2="15" y2="15"/> \
                          <line x1="6" y1="15" x2="15" y2="6"/> \
                        </svg>'
    return myHtml;
}


function activateButtonCloseCue(myCueId) {  
    
    var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    //console.log('closeCueButton myTreeId: '+myTreeId);
    //console.log('closeCueButton myCueId: '+myCueId);
    
    $('#'+myCueId+' .button_close').mousedown(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        $(this).parents('.widget').animate({                           // Animate widget to an opacity of 0
            opacity: 0    
        },function () {                                                     // When animation (opacity) has finished
            $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
                $(this).remove();                                           // When sliding up has finished, remove widget from DOM
                //console.log('REMOVED myCueId: '+myCueId);
                updateExitsAndArrowsForAllCues(myTreeId); // take care of the EXIT nodes and ARROWS
                updateJsonDataset(myTreeId); // update statistics
            });
        });
        
        // show next tooltip
        console.log('TIP 14');
        tour.goTo(14);
                
        return false;                                            // Return false, prevent default action
    })
}
function activateButtonCloseExit(myCueId, myExitClass) {
    
    //$('.close_exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
    $('#'+myCueId+' .'+myExitClass+' .button_close').mouseup(function (e) {  // Create new anchor element with class of 'remove'
        console.log('EXIT BUTTON! myCueId: '+myCueId);
    
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
        
        // create EXIT node on another side        
        switchExitDirection(myCueId, myExitClass);
        
        var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
        updateJsonDataset(myTreeId); // update the changed exit direction
        
        // show next tooltip
        console.log('TIP 13');
        tour.goTo(13);
                
        return false;                                            // Return false, prevent default action
    })
}

function htmlButtonStat() {
    var myHtml = '<button class="buttons_grey button_stat">STATISTICS OF</button>';
    return myHtml;
}
function htmlStatTreeUpToThisCue() {
    var myHtml = '<li class="stats stat_tree">\
                    <table class="eval_table"> \
                        <tr><td class="table_title" colspan="6">TREE UP TO THIS CUE</td></tr> \
                        <tr><td class="cell_narrow"></td><td></td><td class="table_header" colspan="4">PREDICTION</td></tr> \
                        <tr><td></td><td></td><th>yes</th><th>no</th><th>und</th><th>sum</th></tr> \
                        <tr><td class="table_header_rotated" rowspan="3"><div class="rotate">CRITERION</div></td><th class="cell_narrow">yes</td><td class="success" id="hits">0</td><td class="fail" id="misses">0</td><td class="undecided" id="undecided_pos">0</td><td class="cell_values" id="crit_yes_sum">0</td></tr> \
                        <tr><th class="cell_narrow">no</th><td class="fail" id="falsealarms">0</td><td class="success" id="correctrejections">0</td><td class="undecided" id="undecided_neg">0</td><td class="cell_values" id="crit_no_sum">0</td></tr> \
                        <tr><th class="cell_narrow">sum</th><td class="cell_values" id="pred_yes_sum">0</td><td class="cell_values" id="pred_no_sum">0</td><td class="cell_values" id="pred_und_sum">0</td><td class="cell_values" id="pred_sum_sum">0</td></tr> \
                        <tr><th></th></tr> \
                        <tr><th colspan="2">p(Hits)</th><th>p(FA)</th><th>d&#8242</th><th>Frug</th><th>Bias</th></tr> \
                        <tr><td colspan="2" class="cell_values" id="pHits">0</td><td class="cell_values" id="pFA">0</td><td class="cell_values" id="dprime">0</td><td class="cell_values" id="frugality">0</td><td class="cell_values" id="bias">0</td></tr> \
                    </table> \
                  </li>';
    return myHtml;
}
function activateButtonStat(myCueId) {
    // hide the statistics of the tree
    $('#'+myCueId).find('.stat_tree').hide();
    
    // on mouse click, toggle between cue and tree statistics
    $('#'+myCueId+' .button_stat').mouseup(function() {
        $(this).parent().find('.stat_cue').animate({width: 'toggle'});
        $(this).parent().find('.stat_tree').animate({width: 'toggle'});
        
        // show next tooltip
        console.log('TIP 9');
        tour.goTo(9);
    });
}

function buttonsExportToServer() {
    
    $('.button_export').mouseup(function (e) {  
        console.log('EXPORT TO SERVER!');
        
        // show next tooltip
        console.log('TIP 17');
        tour.goTo(17);
        
        var myTreeId = $(this).attr('value');
        console.log('myTreeId: '+myTreeId);
        
        var myTreeObj = updateJsonDataset(myTreeId);
        console.log('myTreeObj: '+JSON.stringify(myTreeObj, null, "  "));
        
        //remove properties used for statistics
        delete myTreeObj.tree;
        myTreeObj.cues.forEach(function(obj){
            delete obj.id;
            delete obj.hits;
            delete obj.miss;
            delete obj.fals;
            delete obj.corr;
            delete obj.un_p;
            delete obj.un_n;
            delete obj.step;
        });
        
        console.log('myTreeObj DELETED: '+JSON.stringify(myTreeObj, null, "  "));
        
        // Johannes code
        DecisionWebTree.Common.SaveTree(myTreeObj);  
    
    });
}


        