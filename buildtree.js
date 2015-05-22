/*
 * Script from NETTUTS.com [by James Padolsey]
 * @requires jQuery($), jQuery UI & sortable/draggable UI modules
 */


    
//    jQuery : $,                                  /* Set's jQuery identifier: */

var d = 9;  // for unique cue IDs, not 0 to have always two characters for removal (3 characters with '-')
var c = 9;  // for unique exit IDs, not 0 to have always two characters for removal (3 characters with '-')
var criterCue = '';
/*

var orderTree0 = [];  // variable knows what's in the tree0
var orderTree1 = [];  // variable knows what's in the tree1

var myJsonObj = new Object();
myJsonObj.trees = []; 
//console.log('JSON NEW initial: ' + JSON.stringify(myJsonObj, null, "  "));

*/

function init() {                        // Function, which initialises methods to be run when page has loaded
    // The method which starts it all...
    //this.attachStylesheet('buildtree.js.css');
    this.selectCriterion();
    this.makeSortable();
}

//function attachStylesheet(href) {         // Creates new link element with specified href and appends to <head>, attaches the second CSS StyleSheet - for JavaScript, which dynamically adds these elements to the page
//    var $ = this.jQuery;
//    return $('<link href="' + href + '" rel="stylesheet" type="text/css" />').appendTo('head');
//}

function updateJsonDataset(myTreeId) {
        
    // get the order of the cues in the trees
    var myTreeCuesArray = $('#'+myTreeId).sortable('toArray');
    myTreeCuesArray = myTreeCuesArray.filter(function(n){ return n != "" });  // remove empty elements in array

    //orderTree0 = $('#tree0').sortable('toArray');
    //orderTree1 = $('#tree1').sortable('toArray');
    //orderTree0 = orderTree0.filter(function(n){ return n != "" });  // remove empty elements in array
    //orderTree1 = orderTree1.filter(function(n){ return n != "" });  // remove empty elements in array
    //console.log('UDPDATE! myTreeCuesArray: ' + myTreeCuesArray.toString());
    
    //var myJsonObj = new Object();
    //myJsonObj.trees = [];
            
    var myTreeObj = createTreeObj(myTreeId, myTreeCuesArray);
    
    //myJsonObj.trees[t] = myTreeObj;
    //myJsonObj.trees.push(myTreeObj);
    
    console.log('JSON UPDATE! myTreeId: '+myTreeId+', myTreeObj: ' + JSON.stringify(myTreeObj, null, "  "));
    
    // from uwe fftreeStatistics/fftree.js, now in calculatestatistics.js
    analyzeDataset(myTreeObj);
    
    return myTreeObj;
}

function createTreeObj(myTreeId, myTreeCuesArray) {
    
    //console.log('CREATE TREE OBJ myTreeId: '+myTreeId+', myTreeCuesArray: '+JSON.stringify(myTreeCuesArray, null, "  ") );
    
    var myTreeObj = new Object();
    
    myTreeObj.tree = myTreeId;
    
    //myTreeObj.criterion = 'cue1'; // ONLY FOR TESTING!!!
    if (criterCue != '') {
        myTreeObj.criterion = myDataset.meta['fields'][getInt(criterCue)];  // get the name of criterion cue by id
    } else {
        myTreeObj.criterion = '';
    }
    
    myTreeObj.cues = [];
        
    for(var e = 0; e < myTreeCuesArray.length; e++) {    // go through the tree's elements
        
        var myCueObj = new Object();
        
        var myCueId = myTreeCuesArray[e];
        //var myBasicCueId = getBasicCueId(myCueId);     // getBasicCueId(myFullCueId)
        myCueObj.id = myCueId;
        //console.log('myCueObj.name: ' + myCueObj.name);
        
        if (myCueObj.id != undefined) {
            
            myCueObj.name = getCueName(myCueId);  // getCueName(myCueId)
            myCueObj.yes = getExitValue( myCueId, 'yes' );      // getExitValue(myCueId, myDir)
            myCueObj.no = getExitValue( myCueId, 'no' );      // getExitValue(myCueId, myDir)
            myCueObj.hits = 0;
            myCueObj.miss = 0;
            myCueObj.fals = 0;
            myCueObj.corr = 0;
            myCueObj.un_p = 0;
            myCueObj.un_n = 0;
            myCueObj.step = 0;
            
            myTreeObj.cues.push(myCueObj);
        }
    }
    //console.log('create myTreeObj: '+JSON.stringify(myTreeObj, null, "  "));
    
    return myTreeObj;
}

function selectCriterion() {
    $('.criterion_class').change(function(){
        criterCue = $( 'input:radio[name=criterion_name]:checked' ).val();
        console.log('criterCue: ' + criterCue);
        // ENABLE dragging of all cues
        $('.widget').draggable('enable'); 
        $('#'+criterCue).draggable('disable'); // DISABLE draggable of the cue, which is selected as criterion
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
    });
}

function updateStatisticsForSingleCues() {
    
    $('#cues_list .widget').each(function( index ) {

        var myCueId = $(this).attr('id');
        //console.log('SINGLECUE myCueId: '+myCueId);
      
        var myOneCueTreeObj = createTreeObj(myCueId, [myCueId]);
        //console.log('SINGLECUE myOneCueTreeObj: '+JSON.stringify(myOneCueTreeObj, null, "  ") );
    
        analyzeDataset(myOneCueTreeObj);
    });
    
    
        
}

function getCueName(myCueId) {
    //var myCueId = getCueId(myTreeId,myTreeElementId);
    if (myCueId != undefined) {
        var myInt = getInt(myCueId);
        var myName = myDataset.meta['fields'][myInt];
        //var myName = 'test';  // FOR TESTING!!!
    }
    return myName;
}

function getBasicCueId(myFullCueId) {
    var myBasicCueId = myFullCueId.slice(0,4);  // leave only the basic cue id e.g."cue1" in "cue1-0"
    return myBasicCueId;
}

function getInt(myCueId) {
    var mySlice = myCueId.slice(3,4);  // leave only the number e.g."1" in "cue1-0"
    var myInt = parseInt(mySlice);
    return myInt;
}

function getTreeInt(myTreeId) {
    var mySlice = myTreeId.slice(4,5);  // leave only the number e.g."1" in "cue1-0"
    var myInt = parseInt(mySlice);
    return myInt;
}

function getExitValue(myCueId, myDir) {
    //var myCueId = getCueId(myTreeId,myTreeElementId);
    switch (myDir) {
        case 'yes':
            var myExit = $('#'+myCueId+' #hidden-exit_yes').val();
        break;
        case 'no':
            var myExit = $('#'+myCueId+' #hidden-exit_no').val();
        break;
    }
    return myExit;
}

function makeSortable() {                 // This function will make the widgets draggable-droppable using the jQuery UI 'sortable' module.
    
    //var newItemId = '';
    var origCueId = '';
    var dragCueId = '';
    var dragTreeId = '';  // variable knows the ID of the dropped tree
    //var orderTree0 = [];  // variable knows what's in the tree0
    //var orderTree1 = [];  // variable knows what's in the tree1
    
    $('#cues_list').find('.widget').draggable({
        connectToSortable: ".trees",
        helper: 'clone',
        handle: '.widget_title',        // Set the handle to the top bar
        placeholder: 'widget_placeholder',
        forcePlaceholderSize: 'true',
        revert: 'invalid',
        start: function(event,ui){
            //hide the content, if expanded
            //$(this).find('.widget_content').hide();
            
            //get ID form draggable item 
            origCueId = $(this).attr('id');
            //console.log("origCueId: " + origCueId);
        },
        stop: function(event,ui){
            // no good, fires even when the dragged object is returned/reverted (not dropped)!!!
            //assign ID to the clone
            d++; // prepare for the next dragCueId
            dragCueId = origCueId+'-'+d;  // make the new ID for the cloned cue
            console.log('dragCueId: '+dragCueId);
            ui.helper.attr('id',dragCueId);  // rename the cloned cue
        }
    }).disableSelection();
    
    // DISABLE dragging of all cues, until a criterion is selected
    $('.widget').draggable('disable'); // DISABLE FOR TESTING!!!
      
    $('.trees').droppable({
        over : function(event, ui) {
            dragTreeId = $(this).attr('id');  // get the ID of the dropped-over tree
            console.log('dragTreeId: ' + dragTreeId);
        },
        drop : function(event, ui) {
            // no good, fires twice!!!
        }
    });
        
    $('.trees').sortable({
        //connectWith: '.trees',
        helper: 'clone',
        handle: '.widget_title',        // Set the handle to the top bar
        placeholder: 'widget_placeholder',
        forcePlaceholderSize: 'true',
        items: 'li:not(.unsortable)',
        revert: true,
        beforeStop: function (event, ui) {
            // no good, fires when rearranging cues inside the tree!!!
        },
        receive: function(event,ui) {
            
            // replace the radio button with close button
            $('#'+dragCueId+' .criterion_class').remove(); // remove the radio button
            $('#'+dragCueId+' .criterion_label').remove(); // remove the radio button label
            $('#'+dragCueId+' .widget_head').append( closeButtonHtml() );  // add close button
            activateExpandButton(dragCueId);  // reactivate EXPAND BUTTON - bug workaround
            activateCloseCueButton(dragCueId); // activate close button
            
            //hide the content, if expanded
            //$('#'+dragCueId).find('.widget_content').hide();
                        
            // add EXIT nodes, depending on which tree is dropped on
            $('#'+dragCueId+' #hidden-exit_yes').val('continue'); // 'reset' exit values - bug workaround
            $('#'+dragCueId+' #hidden-exit_no').val('continue'); // 'reset' exit values - bug workaround
            //var dragExits = setExitDirection(dragTreeId);
            //setExitValues(dragCueId, dragExits.yes, dragExits.no);
            
            // draw the arrow to the next cue
            drawArrowToNextCue(dragCueId);
            
            // FIX THIS!!!
            //$('#'+dragCueId).find('.stat_cue_header').show();
            //$('#'+dragCueId).find('.stat_tree_header').show();
            //$('#'+dragCueId).find('.stat_tree').show();
            //activateStatsSlideToggle(dragCueId);

            // add "TREE up to this cue" statistics table
            $('#'+dragCueId+' .stats_header').text('THIS CUE');    // rename the table to "stats of this cue"
            $('#'+dragCueId+' .stat_cue_header').append( statTreeUpToThisCueHtml() ); // add the table "stats of the tree up to this cue"
            $('#'+dragCueId+' .widget_content').prepend( statButtonHtml() ); // add the button "stats of"
            activateStatButton(dragCueId);            // activate the button "stats of"
        },
        update: function (event,ui) {
            
            // get id of dragged cue
            dragCueId = ui.item.attr("id");
                                                
            // take care of the EXIT nodes
            updateExitsForAllCues(dragTreeId, dragCueId);
                        
            // update JSON dataset for the analysis algorithms
            updateJsonDataset(dragTreeId);
            
        }
    }).disableSelection();
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
    });
}

function updateExitsForAllCues(myTreeId) {
    
    //var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    
    // get the last and ex-last cue
    var myTreeArray = $('#'+myTreeId).sortable('toArray');  // get the order of active tree
    myTreeArray = myTreeArray.filter(function(n){ return n != '' });  // remove empty elements in array
    //console.log('myTreeArray: '+myTreeArray);
    var myLastCueId = $(myTreeArray).get(-1);                     // get the last cue
    //var myExLastCueId = $(myTreeArray).get(-2);                     // get the exlast cue
    //console.log('myLastCueId: '+myLastCueId);
    //console.log('myExLastCueId: '+myExLastCueId);
    
    // do for each cue in the tree, except the last cue
    myTreeArray.forEach(function(myCueId){
        if (myCueId != myLastCueId) {
            // check if it has at both 'exit' values in hidden YES and NO fields
            var myYesOld = $('#'+myCueId+' #hidden-exit_yes').val();
            var myNoOld = $('#'+myCueId+' #hidden-exit_no').val();
            if (myYesOld == 'exit' && myNoOld == 'exit') {
                // set exit values according to the treeID: in tree0 exit-yes, in tree1 exit-no  
                var myExits = setExitDirection(myTreeId);
                setExitValues(myCueId, myExits.yes, myExits.no);
            }
        } else {
            // add the second EXIT node
            setExitValues(myLastCueId, 'exit', 'exit');
            // remove CLOSE buttons from EXIT nodes of the last cue
            $('#'+myLastCueId+' .exit_widget .button_close').remove();
            // remove the arrow to the next cue
            $('#'+myLastCueId+' .cue_arrow').remove();
        } 
    });
}

function setExitDirection(myTreeId) {
    switch (myTreeId) {
        case 'tree0':
            var myYes = 'exit';
            var myNo = 'continue';
            break;
        case 'tree1':
            var myYes = 'continue';
            var myNo = 'exit';
            break;
    }
    return {
        yes: myYes,
        no: myNo
    }
}

function setExitValues(myCueId, myYes, myNo) {
    
    //get old Exit values
    var myYesOld = $('#'+myCueId+' #hidden-exit_yes').val();
    var myNoOld = $('#'+myCueId+' #hidden-exit_no').val();
    
    //console.log('SET EXIT VALUES! '+myCueId+' '+myYes+' '+myNo);
    //console.log('myYesOld: '+myYesOld);
    //console.log('myNoOld: '+myNoOld);
    
    if (myYesOld != myYes) {
        //console.log('SET EXIT VALUES! myYesOld <> myYes: '+myYesOld+' '+myYes);
        switch (myYes) {
            case 'exit':
                addExitNode(myCueId, 'hidden-exit_yes');
            break;
            case 'continue':
                removeExitNode(myCueId, 'hidden-exit_yes');
            break;
        }
        $('#'+myCueId+' #hidden-exit_yes').val(myYes); // add ".trigger('change')" if you need to track this change and then do something with "$('#hidden-exit_yes').change(function(){do smth. here}"
    }
    
    if (myNoOld != myNo) {
        //console.log('SET EXIT VALUES! myNoOld <> myNo: '+myNoOld+' '+myNo);
        switch (myNo) {
            case 'exit':
                addExitNode(myCueId, 'hidden-exit_no');
            break;
            case 'continue':
                removeExitNode(myCueId, 'hidden-exit_no');
            break;
        }
        $('#'+myCueId+' #hidden-exit_no').val(myNo); // add ".trigger('change')" if you need to track this change and then do something with "$('#hidden-exit_yes').change(function(){do smth. here}"
    }

}

function addExitNode(myCueId, myHiddenExitId) {
    //console.log('ADD EXIT NODE! '+myCueId+' '+myHiddenExitId);
    
    var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    var myTreeInt = getTreeInt(myTreeId);
    //console.log('EXIT myTreeId: '+myTreeId+' '+myTreeInt);
    
    //var myCriterionName = myJsonObj.trees[myTreeInt].criterion;
    
    
    switch(myHiddenExitId) {
        case 'hidden-exit_yes':
            var myExitClass = 'exit_left';
            var myExitText = 'Yes';
            var myArrowHtml =  '<line x1="0" y1="45" x2="45" y2="0"/> \
                                <line x1="1" y1="25" x2="1" y2="44"/> \
                                <line x1="1" y1="44" x2="20" y2="44"/> \
                                <text x="15" y="25" stroke-width="1" stroke="none" fill="black">yes</text>';
            break;
        case 'hidden-exit_no':
            var myExitClass = 'exit_right';
            var myExitText = 'No';
            var myArrowHtml =  '<line x1="0" y1="0" x2="45" y2="45"/> \
                                <line x1="44" y1="25" x2="44" y2="44"/> \
                                <line x1="25" y1="44" x2="44" y2="44"/> \
                                <text x="17" y="25" stroke-width="1" stroke="none" fill="black">no</text>';
            break;
    }
    
    c++; // prepare for the next dragCueId
    var myExitNodeId = 'exit_'+d+'-'+c;  // d - the same as cueID, c - unique for exit nodes
    
    var exitNode =  '<li id='+myExitNodeId+' class="'+myExitClass+' exit_widget unsortable"> \
                        '+closeButtonHtml()+' \
                        <div class="exit_widget_title"> \
                            <span>EXIT</span> \
                        </div> \
                        <svg class="exit_arrow" height="45" width="45"> \
                          '+myArrowHtml+' \
                        </svg> \
                    </li>';
    //$('#'+myCueId+' .exits').append(exitNode);
    $(exitNode).hide().appendTo('#'+myCueId+' .exits').fadeIn(300);
    
    //draw arrow to the Exit Node
    //drawArrowToExit(myExitNodeId, myExitClass);
    
    // activate the close button
    activateCloseExitButton(myCueId);  // activate the close button
}

function drawArrowToExit(myExitNodeId, myExitClass) {
    
    switch(myExitClass) {
        case 'exit_left':
            var myX1 = 110;
            var myY1 = 45;
            var myX2 = 150;
            var myY2 = 0;
            var myLabelText = 'yes';
            var myLabelX = 130;
            var myLabelY = 22;
            break;
        case 'exit_right':
            var myX1 = 50;
            var myY1 = 45;
            var myX2 = 10;
            var myY2 = 0;
            var myLabelText = 'no';
            var myLabelX = 30;
            var myLabelY = 22;
            break;
    }
    
    $('#'+myExitNodeId+' .exit_canvas').drawLine({
        strokeStyle: '#A9A9A9',
        strokeWidth: 3,
        rounded: true,
        startArrow: true,
        arrowRadius: 15,
        arrowAngle: 90,
        x1: myX1, y1: myY1,
        x2: myX2, y2: myY2
    });
    
    $('#'+myExitNodeId+' .exit_canvas').drawText({
        fillStyle: '#000',
        //strokeStyle: 'white',
        //strokeWidth: 1,
        x: myLabelX, y: myLabelY,
        fontSize: 12,
        fontFamily: 'Verdana, sans-serif',
        text: myLabelText
    });
}

function drawArrowToNextCue(myCueId) {
    
    //get Exit values
    var myYes = $('#'+myCueId+' #hidden-exit_yes').val();
    //var myNo = $('#'+myCueId+' #hidden-exit_no').val();  // we don't need that actually
    
    switch (myYes) {
        case 'exit':
            var myLabelText = 'no';
        break;
        case 'continue':
            var myLabelText = 'yes';
        break;
    }
    
    // remove the old arrow if there was
    $('#'+myCueId+' .cue_arrow').remove();
    
    // set the html code
    var myHtml =  '<svg class="cue_arrow" height="40" width="40"> \
                        <line x1="20" y1="0" x2="20" y2="40"/> \
                        <line x1="5" y1="25" x2="20" y2="40"/> \
                        <line x1="35" y1="25" x2="20" y2="40"/> \
                        <text x="13" y="23" stroke-width="1" stroke="none" fill="black">'+myLabelText+'</text> \
                    </svg>';
    
    // draw the SVG arrow
    $('#'+myCueId).append( myHtml );
}

function closeButtonHtml() {
    var myHtml = '<svg class="button_close" height="20" width="20"> \
                          <line x1="6" y1="6" x2="15" y2="15"/> \
                          <line x1="6" y1="15" x2="15" y2="6"/> \
                        </svg>'
    return myHtml;
}

function activateCloseExitButton(myCueId) {
    
    //console.log('ACTIVATE EXIT BUTTON! myCueId: '+myCueId);
    
    //$('.close_exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
    $('#'+myCueId+' .exit_widget .button_close').mouseup(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
        
        // create EXIT node on another side        
        switchExitDirection(myCueId);
        
        var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
        updateJsonDataset(myTreeId); // update the changed exit direction
                
        return false;                                            // Return false, prevent default action
    })
}

function switchExitDirection(myCueId) {
    
    //console.log('SWITCH EXIT DIRECTION! myCueId: '+myCueId);
    
    //get hidden exit values
    var myYesOld = $('#'+myCueId+' #hidden-exit_yes').val();
    var myNoOld = $('#'+myCueId+' #hidden-exit_no').val();
    
    switch(myYesOld) {
        case 'exit':
            setExitValues(myCueId, 'continue', 'exit'); // yes , no
            break;
        case 'continue':
            setExitValues(myCueId, 'exit', 'continue'); // yes , no
            break;
    }
    switch(myNoOld) {
        case 'exit':
            setExitValues(myCueId, 'exit', 'continue'); // yes , no
            break;
        case 'continue':
            setExitValues(myCueId, 'continue', 'exit'); // yes , no
            break;
    }
    // redraw the arrow and the label to the next cue
    drawArrowToNextCue(myCueId);
}

function removeExitNode (myCueId, myHiddenExitId) {
    //console.log('REMOVE EXIT NODE: '+myCueId+' '+myHiddenExitId);
    switch(myHiddenExitId) {
        case 'hidden-exit_yes':
            var myExitClass = 'exit_left';
            break;
        case 'hidden-exit_no':
            var myExitClass = 'exit_right';
            break;
    }
    $('#'+myCueId+' .'+myExitClass ).animate({                           // Animate widget to an opacity of 0
        opacity: 0    
    },function () {                                                     // When animation (opacity) has finished
        $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
            $(this).remove();                                           // When sliding up has finished, remove widget from DOM
        });
    });
}

function trainingTestingButtons() {
    
    $('.button_allcases').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('ALL CASES!');
        // switch the data
        myData = myDataAllCases;
        // change the look of the buttons
        document.getElementById('button_allcases_id').className = "button_selectdata button_allcases button_t_on";
        document.getElementById('button_training_id').className = "button_selectdata button_training button_t_off";
        document.getElementById('button_testing_id').className = "button_selectdata button_testing button_t_off";
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
    });
    
    $('.button_training').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('TRAINING!');
        // switch the data
        myData = myDataForTraining;
        // change the look of the buttons
        document.getElementById('button_allcases_id').className = "button_selectdata button_allcases button_t_off";
        document.getElementById('button_training_id').className = "button_selectdata button_training button_t_on";
        document.getElementById('button_testing_id').className = "button_selectdata button_testing button_t_off";
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
    });
    
     $('.button_testing').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('TESTING!');
        // switch the data
        myData = myDataForTesting;
        // change the look of the buttons
        document.getElementById('button_allcases_id').className = "button_selectdata button_allcases button_t_off";
        document.getElementById('button_training_id').className = "button_selectdata button_training button_t_off";
        document.getElementById('button_testing_id').className = "button_selectdata button_testing button_t_on";
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
    });
}

function expandButtons() {
    
    //console.log('ACTIVATE EXPANSION!');
    
    $('.button_expand').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('EXPAND!');
        $(this).parents('.widget').find('.widget_content').slideToggle('slow');
    });
    
    // hide the content by default
    $('.horiz_scroll').find('.widget_content').hide();
    
    //$('.horiz_scroll, .trees').on('click', '.button_expand', function (e) {  
    //    $(this).parents('.widget').find('.widget_content').slideToggle('slow');
    //});
}

function activateExpandButton(myCueId) {
        
    $('#'+myCueId+' .button_expand').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('EXPAND!');
        $(this).parents('.widget').find('.widget_content').slideToggle('slow');
    });
}

function activateStatsSlideToggle(myCueId) {  
    
    $('#'+myCueId+' .stat_cue_header').mousedown(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        $(this).find('.stat_cue').slideToggle('slow')
    });
    
    $('#'+myCueId+' .stat_tree_header').mousedown(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        $(this).find('.stat_tree').slideToggle('slow')
    });
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
                updateExitsForAllCues(myTreeId); // take care of the EXIT nodes
                updateJsonDataset(myTreeId); // update the changed exit direction
            });
        });
        return false;                                            // Return false, prevent default action
    })
}

function exportToServerButtons() {
    
    $('.button_export').mouseup(function (e) {  // Create new anchor with a class of 'collapse'
        console.log('EXPORT TO SERVER!');
        
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


// Right at the very end of buildtree.js
//iNettuts.init();
init();
