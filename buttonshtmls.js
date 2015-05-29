// Makes and activates buttons, adds htmls

function buttonHelp() {
    
    $('.button_help').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
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
    
    $('#button_allcases').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
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
    
    $('#button_training').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
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
    
     $('#button_testing').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
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
    
    $('#'+myButtonId).mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        
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
    
    $('.button_expand').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        
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
                        <tr><td></td><td></td><td class="table_title" colspan="4">TREE UP TO THIS CUE</td></tr> \
                        <tr><td class="cell_narrow"></td><td></td><td class="table_header" colspan="4">PREDICTION</td></tr> \
                        <tr><td></td><td></td><th>yes</th><th>no</th><th>und</th><th>sum</th></tr> \
                        <tr><td class="table_header_rotated" rowspan="3"><div class="rotate">CRITERION</div></td><th class="cell_narrow">yes</td><td class="success" id="hits">0</td><td class="fail" id="misses">0</td><td class="undecided" id="undecided_pos">0</td><td class="cell_values" id="crit_yes_sum">0</td></tr> \
                        <tr><th class="cell_narrow">no</th><td class="fail" id="falsealarms">0</td><td class="success" id="correctrejections">0</td><td class="undecided" id="undecided_neg">0</td><td class="cell_values" id="crit_no_sum">0</td></tr> \
                        <tr><th class="cell_narrow">sum</th><td class="cell_values" id="pred_yes_sum">0</td><td class="cell_values" id="pred_no_sum">0</td><td class="cell_values" id="pred_und_sum">0</td><td class="cell_values" id="pred_sum_sum">0</td></tr> \
                        <tr><th></th></tr> \
                        <tr><td></td><td></td><th>p(Hits)</th><th>p(FA)</th><th>d"</th><th>Frug</th></tr> \
                        <tr><td></td><td></td><td class="cell_values" id="pHits">0</td><td class="cell_values" id="pFA">0</td><td class="cell_values" id="dprime">0</td><td class="cell_values" id="frugality">0</td></tr> \
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
    
    $('.button_export').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
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


        