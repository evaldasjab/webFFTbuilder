// Makes and activates buttons, adds htmls

function splitValueSliderChangeSwap(mySet, myTrueSet) {
    
    var mySplitValuesArray = mySet.split_values;
    
    mySplitValuesArray.forEach(function(mySplitObj) {
        /*CONTENTS of mySplitValuesArray :
        mySplitObj.id = 'cue'+i;
        mySplitObj.name = myField;
        mySplitObj.min = myFieldMin;
        mySplitObj.max = myFieldMax;
        mySplitObj.split = myFieldMean;
        mySplitObj.minisno_maxisyes = true;
        */
        //console.log('HERE CHECK BEFORE! myObj: '+JSON.stringify(myObj, null, "  "));
      
        var myCueId = mySplitObj.id;
        var myTrueCueId = mySplitObj.id;
        var myCueName = mySplitObj.name;
        
        // update the values in the widget content
        $('#'+myCueId+' #min_value').text(mySplitObj.min);
        $('#'+myCueId+' #max_value').text(mySplitObj.max);
        $('#'+myCueId+' #split_value').val(mySplitObj.split);
        
        $('#'+myCueId+' .split_slider').slider({
            min: mySplitObj.min,
            max: mySplitObj.max,
            value: mySplitObj.split,
            step: 0.5,
            slide: function(event, ui) {
                $(this).closest('.widget').find('#split_value').val(ui.value);
                //$( "input" ).val( "$" + ui.value );
                //$('li[id^='+myTrueCueId+']').find('.split_slider').slider('refresh');
            },
            change: function( event, ui ) {
                
                // change binary values of this cue/field in the dataset
                mySplitObj.split = ui.value;
                
                // update slider and input field in ALL cues which start with the same id (cues in the trees), except the original cue (endless loop)
                $('li[id^='+myTrueCueId+']:not(#'+myCueId+') .split_slider').slider({value: mySplitObj.split});
                $('li[id^='+myTrueCueId+'] #split_value').val(mySplitObj.split);
                
                //console.log('HERE CHECK AFTER! myObj: '+JSON.stringify(myObj, null, "  "));
                
                // reconvert the dataset
                var mySet = convertToBinary(myDataset, myTrueSet, [mySplitObj]);
                
                // update statistics, if there a criterion already selected
                updateStatForOneSingleCue(myTrueCueId); //update statistics in the blue area
                
                if (criterCueId != '') {
                    // reset statistics of the criterion
                    resetDerivativeView(criterCueId);
                    updateJsonDataset('tree0'); // update JSON object and tree statistics
                    updateJsonDataset('tree1'); // update JSON object and tree statistics 
                } else {
                    resetDerivativeView(myTrueCueId);
                }
                
                // show next tooltip
                console.log('TIP 12');
                if (tour.getCurrentStep()<=11) {
                    tour.goTo(12);
                }
            }
        });
        
        $('li[id^='+myTrueCueId+'] #split_value').change(function () {
            //var value = this.value.substring(1);
            var myValue = $(this).val();
            $('li[id^='+myTrueCueId+'] .split_slider').slider("value", parseFloat(myValue));
        });
        
        $('#'+myTrueCueId+' .button_swap').mouseup(function () {
            
            // change the direction in the mySplitValuesArray
            mySplitObj.minisno_maxisyes = !mySplitObj.minisno_maxisyes;  // if true then false, if false then true
            
            // swap the YES and NO labels
            //$(this).closest('.widget').find('#split_label_left').toggleText('yes', 'no');
            //$(this).closest('.widget').find('#split_label_right').toggleText('no', 'yes');
            
            // swap the YES and NO labels in ALL cues which start with the same id (orig cue + cues in the trees)
            $('li[id^='+myTrueCueId+']').find('#split_label_left').toggleText('yes', 'no');
            $('li[id^='+myTrueCueId+']').find('#split_label_right').toggleText('no', 'yes');
            
            // update the dataset
            var mySet = convertToBinary(myDataset, myTrueSet, [mySplitObj]);
                
            // update statistics, if there a criterion already selected
            if (criterCueId != '') {
                updateJsonDataset('tree0'); // update JSON object and tree statistics
                updateJsonDataset('tree1'); // update JSON object and tree statistics
                updateStatForOneSingleCue(myTrueCueId); //update statistics in the blue area
            }
            
            // show next tooltip
            console.log('TIP 13');
            if (tour.getCurrentStep()<=12) {
                tour.goTo(13);
            }
            
        });
        $.fn.toggleText = function(t1, t2){
            if (this.text() == t1) this.text(t2);
            else                   this.text(t1);
            return this;
        };
    });
}
function splitValueSliderChangeSwapReactivate(myCueId, mySet, myTrueSet) {
    
    var mySplitValuesArray = mySet.split_values;
    var myTrueCueId = getTrueCueId(myCueId);
    
    // find in the array the object by the key
    var foundObjectsByKey = $.grep(mySplitValuesArray, function(e){ return e.id == myTrueCueId; });
    var mySplitObj = foundObjectsByKey[0];
    
    //console.log('mySplitObj: '+JSON.stringify(mySplitObj, null, "  "));
    
    /*CONTENTS of mySplitValuesArray :
    mySplitObj.id = 'cue'+i;
    mySplitObj.name = myField;
    mySplitObj.min = myFieldMin;
    mySplitObj.max = myFieldMax;
    mySplitObj.split = myFieldMean;
    mySplitObj.minisno_maxisyes = true;
    */
    //console.log('HERE CHECK BEFORE! myObj: '+JSON.stringify(myObj, null, "  "));

    $('#'+myCueId+' .split_slider').slider({
        min: mySplitObj.min,
        max: mySplitObj.max,
        value: mySplitObj.split,
        step: 0.5,
        slide: function(event, ui) {
            $(this).closest('.widget').find('#split_value').val(ui.value);
            //$('#'+myCueId+' #split_value').val(ui.value);
            //$( "input" ).val( "$" + ui.value );
        },
        change: function( event, ui ) {
            
            // find in the array the object by the key - true/orig cue id
            var mySplitValuesArray = myDataset.split_values;
            var myTrueCueId = getTrueCueId(myCueId);
            var foundObjectsByKey = $.grep(mySplitValuesArray, function(e){ return e.id == myTrueCueId; });
            var mySplitObj = foundObjectsByKey[0];
            
            if (mySplitObj.split != ui.value) {
                // change split value of this cue/field in the dataset
                mySplitObj.split = ui.value;
                //console.log('HERE CHECK AFTER! myObj: '+JSON.stringify(myObj, null, "  "));
                
                // update slider and input field in ALL cues which start with the same id (orig cue and cues in the trees), except the self (endless loop)
                $('li[id^='+myTrueCueId+'] #split_value').val(mySplitObj.split);
                $('li[id^='+myTrueCueId+']:not(#'+myCueId+') .split_slider').slider({value: mySplitObj.split});                        
            
                // update the dataset
                var mySet = convertToBinary(myDataset, myTrueSet, [mySplitObj]);
                
                // update statistics, if there a criterion already selected
                if (criterCueId != '') {
                    updateJsonDataset('tree0'); // update JSON object and tree statistics
                    updateJsonDataset('tree1'); // update JSON object and tree statistics
                    updateStatForOneSingleCue(myTrueCueId); //update statistics of the original cue in the blue area
                }
            }
        }
    });
    
    $('#'+myCueId+' #split_value').change(function () {
        //var value = this.value.substring(1);
        var myValue = $(this).val();
        $('li[id^='+myTrueCueId+'] .split_slider').slider("value", parseFloat(myValue));
    });
    
    $('#'+myCueId+' .button_swap').mouseup(function () {
                
        // find in the array the object by the key - true/orig cue id
        var mySplitValuesArray = myDataset.split_values;
        var myTrueCueId = getTrueCueId(myCueId);
        var foundObjectsByKey = $.grep(mySplitValuesArray, function(e){ return e.id == myTrueCueId; });
        var mySplitObj = foundObjectsByKey[0];
        
        //var myCueId = $(this).closest('.widget').attr('id');
        
        // change the direction in the mySplitValuesArray
        mySplitObj.minisno_maxisyes = !mySplitObj.minisno_maxisyes;  // if true then false, if false then true
                
        // swap the YES and NO labels in ALL cues which start with the same id (orig cue + cues in the trees)
        $('li[id^='+myTrueCueId+']').find('#split_label_left').toggleText('yes', 'no');
        $('li[id^='+myTrueCueId+']').find('#split_label_right').toggleText('no', 'yes');
        
        // swap the labels of the original cue in the blue area
        //$('#'+myTrueCueId+' #split_label_left').toggleText('yes', 'no');
        //$('#'+myTrueCueId+' #split_label_right').toggleText('no', 'yes');
        
        // update slider and input field of the original cue in the blue area
        //$('#'+myTrueCueId+' .split_slider').slider({value: mySplitObj.split});
        //$('#'+myTrueCueId+' #split_value').val(mySplitObj.split);
        
        // update the dataset
        var mySet = convertToBinary(myDataset, myTrueSet, [mySplitObj]);
            
        // update statistics, if a criterion is already selected
        if (criterCueId != '') {
            var myTreeId = $(this).closest('.trees').attr('id');
            updateJsonDataset('tree0'); // update JSON object and tree statistics
            updateJsonDataset('tree1'); // update JSON object and tree statistics
            updateStatForOneSingleCue(myTrueCueId); //update statistics of the original cue in the blue area
        }
         
    });
    $.fn.toggleText = function(t1, t2){
        if (this.html() == t1) this.text(t2);
        else                   this.text(t1);
        return this;
    };
}
function getTrueCueId(myCueId) {
    var mySlice = myCueId.slice(0,4);  // leave only the original cue id e.g."cue1" in "cue1-0"
    return mySlice;
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
        console.log('TIP 9');
        if (tour.getCurrentStep()<=8) {
            tour.goTo(9);
        }
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
        console.log('TIP 10');
        if (tour.getCurrentStep()<=9) {
            tour.goTo(10);
        }
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
            console.log('TIP 14 or 17');
            if (tour.getCurrentStep()<=13) {
                tour.goTo(14);
            } else if (tour.getCurrentStep()<=16){
                tour.goTo(17);
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
        console.log('TIP 11');
        if (tour.getCurrentStep()<=10) {
            tour.goTo(11);
        }
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
        console.log('TIP 15');
        if (tour.getCurrentStep()<=14) {
            tour.goTo(15);
        }
    });
}

function htmlButtonClose() {
    var myHtml = '<div title="Remove Cue from the Tree"><svg class="button_controls button_close" height="20" width="20"> \
                          <line x1="6" y1="6" x2="15" y2="15"/> \
                          <line x1="6" y1="15" x2="15" y2="6"/> \
                        </svg></div>'
    return myHtml;
}

function htmlButtonSwitch(myExitClass) {
    
    switch(myExitClass) {
        case 'exit_left':
            var myIconHtml =  '<div title="Switch EXIT Direction"><svg class="button_controls button_switch switch_to_right" height="20" width="20"> \
                                    <polyline class="right" points="7 3,14 10,7 17"/> \
                               </svg></div>';
            break;
        case 'exit_right':
            var myIconHtml =  '<div title="Switch EXIT Direction"><svg class="button_controls button_switch switch_to_left" height="20" width="20"> \
                                    <polyline class="left" points="13 3,6 10,13 17"/> \
                               </svg></div>';
            break;
    }
    return myIconHtml;
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
        console.log('TIP 8');
        if (tour.getCurrentStep()<=7) {
            tour.goTo(8);
        }
        return false;                                            // Return false, prevent default action
    })
}
function activateButtonSwitchExit(myCueId, myExitClass) {
    
    //$('.close_exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
    $('#'+myCueId+' .'+myExitClass+' .button_switch').mouseup(function (e) { 
        console.log('EXIT BUTTON! myCueId: '+myCueId);
    
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
        
        // create EXIT node on another side        
        switchExitDirection(myCueId, myExitClass);
        
        var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
        updateJsonDataset(myTreeId); // update the changed exit direction
        
        // show next tooltip
        console.log('TIP 7');
        if (tour.getCurrentStep()<=6) {
            tour.goTo(7);
        }    
        return false;                                            // Return false, prevent default action
    })
}

function htmlButtonStat() {
    var myHtml = '<button class="buttons_grey button_stat">STATISTICS OF</button>';
    return myHtml;
}
function htmlStatTreeUpToThisCue() {
    var myHtml = '<li class="stat_inline stat_tree">\
                    <table class="eval_table"> \
                        <tr><td class="table_title" colspan="6">TREE UP TO THIS CUE</td></tr> \
                        <tr><td class="cell_narrow"></td><td></td><td class="table_header" colspan="4">PREDICTION</td></tr> \
                        <tr><td></td><td></td><th>yes</th><th>no</th><th>und</th><th>sum</th></tr> \
                        <tr><td class="table_header_rotated" rowspan="3"><div class="rotate">CRITERION</div></td><th class="cell_narrow">yes</td><td class="success" id="hits" title="Hits">0</td><td class="fail" id="misses" title="Misses">0</td><td class="undecided" id="undecided_pos" title="Undecided Positive">0</td><td class="cell_values" id="crit_yes_sum">0</td></tr> \
                        <tr><th class="cell_narrow">no</th><td class="fail" id="falsealarms" title="False Alarms">0</td><td class="success" id="correctrejections" title="Correct Rejections">0</td><td class="undecided" id="undecided_neg" title="Undecided Negative">0</td><td class="cell_values" id="crit_no_sum">0</td></tr> \
                        <tr><th class="cell_narrow">sum</th><td class="cell_values" id="pred_yes_sum">0</td><td class="cell_values" id="pred_no_sum">0</td><td class="cell_values" id="pred_und_sum">0</td><td class="cell_values" id="pred_sum_sum">0</td></tr> \
                        <tr><th></th></tr> \
                    </table> \
                    <table class="eval_table"> \
                        <tr><th colspan="2" title="Probability of Hits">p(H)</th><th title="Probability of Hits - Probability of False Alarms">p(H)-p(FA)</th><th title="D prime">d&#8242</th><th title="Frugality">Frug</th><th title="C or Bias">Bias</th></tr> \
                        <tr><td colspan="2" class="cell_values" id="pHits" title="Probability of Hits">0</td><td class="cell_values" id="pHitsMinuspFA" title="Probability of Hits - Probability of False Alarms">0</td><td class="cell_values" id="dprime" title="D prime">0</td><td class="cell_values" id="frugality" title="Frugality">0</td><td class="cell_values" id="bias" title="C or Bias">0</td></tr> \
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
        console.log('TIP 16');
        if (tour.getCurrentStep()<=15) {
            tour.goTo(16);
        }
    });
}

function buttonsExportToServer() {
    
    $('.button_export').mouseup(function (e) {  
        console.log('EXPORT TO SERVER!');
        
        // show next tooltip
        console.log('TIP 19');
        if (tour.getCurrentStep()<=18) {
            tour.goTo(19);
        }
        
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


        