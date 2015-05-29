// Makes and activates buttons, adds htmls

function helpButton() {
    
    $('.button_help').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('START TOUR! TIP 0');
        //tour.start(true);
        // Start the tour
        tour.restart(true);
        tour.goTo(0); // after reload of page not always restarts from teh beginning
    });
}

function trainingTestingButtons() {
    
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


function expandAllButtons() {
    
    //console.log('ACTIVATE EXPANSION!');
    
    // hide icon by default
    $('.button_expand_all .up').hide();
    
    $('.button_expand_all').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        
        // if there is no cue with expanded stats, expand all
        if ($(this).parent('.page_area').find('.widget_content:visible').length == 0) {
            $(this).parent('.page_area').find('.widget_content').animate({height:'show',width:'show'});
            // change the icon
            $(this).find('.up').delay(1000).show(0);
            $(this).find('.down').delay(1000).hide(0);
            
        // if there is at least one expanded, collapse all
        } else {
            $(this).parent('.page_area').find('.widget_content').animate({height:'hide',width:'hide'});
            // change the icon
            $(this).find('.up').delay(1000).hide(0);
            $(this).find('.down').delay(1000).show(0);
            
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
function expandButtons() {
    
    // hide icon by default
    $('.button_expand .up').hide();
    
    //console.log('ACTIVATE EXPANSION!');
    
    $('.button_expand').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        
        //var myCueId = $(this).parents('.widget')
        // if the widget content is hidden, expand
        if ( $(this).closest('.widget').find('.widget_content').is(':hidden') ) {
            console.log('EXPAND!');
            
            $(this).closest('.widget').find('.widget_content').animate({height:'show',width:'show'});
            // change the icon
            $(this).find('.up').delay(300).show(0);
            $(this).find('.down').delay(300).hide(0);
            
        // if the widget content is shown, collapse
        } else {
            console.log('COLLAPSE!');
            
            $(this).closest('.widget').find('.widget_content').animate({height:'hide',width:'hide'});
            // change the icon
            $(this).find('.up').delay(300).hide(0);
            $(this).find('.down').delay(300).show(0);
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
function activateExpandButton(myCueId) {
        
    $('#'+myCueId+' .button_expand').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('EXPAND!');
        $(this).parents('.widget').find('.widget_content').slideToggle('slow');
        
        // show next tooltip
        console.log('TIP 8');
        tour.goTo(8);
    });
}

function closeButtonHtml() {
    var myHtml = '<svg class="button_close" height="20" width="20"> \
                          <line x1="6" y1="6" x2="15" y2="15"/> \
                          <line x1="6" y1="15" x2="15" y2="6"/> \
                        </svg>'
    return myHtml;
}


function activateCloseCueButton(myCueId) {  
    
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
function activateCloseExitButton(myCueId, myExitClass) {
    
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

function statButtonHtml() {
    var myHtml = '<button class="button_stat">STATISTICS OF</button>';
    return myHtml;
}
function statTreeUpToThisCueHtml() {
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
function activateStatButton(myCueId) {
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

function exportToServerButtons() {
    
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


        