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
    console.log('UDPDATE! myTreeCuesArray: ' + myTreeCuesArray.toString());
    
    //var myJsonObj = new Object();
    //myJsonObj.trees = [];
            
    var myTreeObj = createTreeObj(myTreeId, myTreeCuesArray);
    
    //myJsonObj.trees[t] = myTreeObj;
    //myJsonObj.trees.push(myTreeObj);
    
    console.log('JSON UPDATE! myTreeId: '+myTreeId+', myTreeObj: ' + JSON.stringify(myTreeObj, null, "  "));
    
    // from uwe fftreeStatistics/fftree.js, now in calculatestatistics.js
    analyzeDataset(myTreeObj);
    
    return myTreeObj;
        
    //console.log('TEST: '+myDataset.meta['fields'][0]);
    //console.log('results fields: ' + myDataset.meta['fields']);
    
    //if (dragTreeId == "tree0") {
    //     $("#"+clonedCueId).append(insertExit(0));
    
    
    //console.log("JSON.stringify: " + JSON.stringify(order1 + order2));
    //alert("order1:" + order1 + "\n order2:" + order2); //Just showing update

    //$("#info").html(JSON.stringify($("#sortable").sortable('toArray')));
    //var params = '{order:"' + str[0].title + ',' + str[1].title + ',' + str[2].title + '"}';
    //data : params, // in $.ajax
    
    //$.ajax({
    //    type: "POST",
    //    url: "/echo/json/",
    //    data: "order1=" + order1 + "&order2=" + order2,
    //    dataType: "json",
    //    success: function (data) {
    //    }
    //});
}

function createTreeObj(myTreeId, myTreeCuesArray) {
    
    console.log('CREATE TREE OBJ myTreeId: '+myTreeId+', myTreeCuesArray: '+JSON.stringify(myTreeCuesArray, null, "  ") );
    
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
    console.log('create myTreeObj: '+JSON.stringify(myTreeObj, null, "  "));
    
    return myTreeObj;
}

function selectCriterion() {
    $('.criterion').change(function(){
        criterCue = $( 'input:radio[name=criterion]:checked' ).val();
        console.log('criterCue: ' + criterCue);
        $('.horiz_scroll li').draggable('enable'); // ENABLE dragging of all cues
        $('.horiz_scroll #'+criterCue).draggable('disable'); // DISABLE draggable of the cue, which is selected as criterion
        
        updateJsonDataset('tree0'); // update JSON object because we have a criterion
        updateJsonDataset('tree1'); // update JSON object because we have a criterion
        
        updateStatisticsForSingleCues();
    });
}

function updateStatisticsForSingleCues() {
    
    $('#cues_list .widget').each(function( index ) {

        var myCueId = $(this).attr('id');
        console.log('SINGLECUE myCueId: '+myCueId);
      
        var myOneCueTreeObj = createTreeObj(myCueId, [myCueId]);
        console.log('SINGLECUE myOneCueTreeObj: '+JSON.stringify(myOneCueTreeObj, null, "  ") );
    
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
            var myExit = $('#'+myCueId+' #hidden-exit-yes').val();
        break;
        case 'no':
            var myExit = $('#'+myCueId+' #hidden-exit-no').val();
        break;
    }
    return myExit;
}

function makeSortable() {                 // This function will make the widgets draggable-droppable using the jQuery UI 'sortable' module.
    
    //var newItemId = '';
    var origCue = '';
    var dragCueId = '';
    var dragTreeId = '';  // variable knows the ID of the dropped tree
    //var orderTree0 = [];  // variable knows what's in the tree0
    //var orderTree1 = [];  // variable knows what's in the tree1
        
    $('.horiz_scroll').find('li').draggable({
        connectToSortable: ".trees",
        helper: 'clone',
        handle: '.widget-head',        // Set the handle to the top bar
        placeholder: 'widget-placeholder',
        forcePlaceholderSize: 'true',
        revert: 'invalid',
        start: function(event,ui){
            //get ID form draggable item 
            origCue = $(this).attr('id');
            console.log("origCue: " + origCue);
        },
        stop: function(event,ui){
            //assign ID to clone
            d++; // prepare for the next dragCueId
            dragCueId = origCue+'-'+d;  // make the new ID for the cloned cue
            //console.log('d: '+d);
            ui.helper.attr('id',dragCueId);  // rename the cloned cue
            console.log('dragCueId: ' + dragCueId);
                        
            $('#'+dragCueId+' .criterion').remove(); // remove the radio button
            
            //hide the content, if expanded
            //$('#'+dragCueId).find('.widget-content').hide();
            
            //reactivate CLOSE button - bug workaround?
            activateCloseCueButton(dragCueId);
                        
            // add EXIT nodes, depending on which tree is dropped on
            $('#'+dragCueId+' #hidden-exit-yes').val('continue'); // 'reset' exit values - bug workaround
            $('#'+dragCueId+' #hidden-exit-no').val('continue'); // 'reset' exit values - bug workaround
            var dragExits = setExitDirection(dragTreeId);
            setExitValues(dragCueId, dragExits.yes, dragExits.no);
            
            // FIX THIS!!!
            // add "TREE up to this cue" statistics table
            $('#'+dragCueId).find('.stat_cue_header').show();
            $('#'+dragCueId).find('.stat_tree_header').show();
            //$('#'+dragCueId).find('.stat_tree').show();
            
            // FIX THIS!!!
            activateStatsSlideToggle(dragCueId);
        }
    });
    
    // DISABLE dragging of all cues, until a criterion is selected
    //$('.horiz_scroll li').draggable('disable'); // DISABLE FOR TESTING!!!
      
    $('.trees').droppable({
        over : function(event, ui) {
            dragTreeId = $(this).attr('id');  // get the ID of the dropped-over tree
            console.log('dragTreeId: ' + dragTreeId);
        }
    });
        
    $('.trees').sortable({
        //connectWith: '.trees',
        helper: 'clone',
        placeholder: 'widget-placeholder',
        forcePlaceholderSize: 'true',
        items: 'li:not(.unsortable)',
        revert: true,
        start: function(event,ui){
        },
        over: function() {
            //$('#'+dragTreeId+' .placeholder').show();  //show or hide the text "drag'n'drop cues here"
            
            // this is supposed to make jsPlumb lines draggable
            $(this).find('._jsPlumb_endpoint_anchor_').each(function(i,event){ 
                if($(event).hasClass("connect"))
                    jsPlumb.repaint($(event).parent());
                else
                    jsPlumb.repaint($(event));
            });
            
        },
        out: function() {
            //$('#'+dragTreeId+' .placeholder').show();  //show or hide the text "drag'n'drop cues here"
        },
        stop: function() {
            //$('#'+dragTreeId+' .placeholder').show();  //show or hide, or remove the text "drag'n'drop cues here"
        },
        
        update: function (event,ui) {
                              
            //console.log('SORTABLE UPDATE!');
                  
            // take care of the EXIT nodes
            updateExitsForLastAndExLastCues(dragTreeId, dragCueId);
            
            // draw lines between CUES and EXIT nodes
            //connectNodes(dragCueId);
            
            // update connecting lines!
            jsPlumb.draggable(dragCueId);
            
            // update JSON dataset for the analysis algorithms
            updateJsonDataset(dragTreeId);
            
        }
    }).disableSelection();      
}

function updateExitsForLastAndExLastCues(myTreeId, myCueId) {
    
    //var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    //console.log('LAST CUE EXITS! myTreeId: '+myTreeId);
    //console.log('LAST CUE EXITS! myCueId: '+myCueId);
    
    // get the last and ex-last cue
    var myTreeArray = $('#'+myTreeId).sortable('toArray');  // get the order of active tree
    myTreeArray = myTreeArray.filter(function(n){ return n != '' });  // remove empty elements in array
    //console.log('myTreeArray: '+myTreeArray);
    var myLastCueId = $(myTreeArray).get(-1);                     // get the last cue
    var myExLastCueId = $(myTreeArray).get(-2);                     // get the last cue
    //console.log('myLastCueId: '+myLastCueId);
    //console.log('myExLastCueId: '+myExLastCueId);
                     
    if (myLastCueId != undefined) {  // if the is at least one (last) cue
        // add the second EXIT node
        setExitValues(myLastCueId, 'exit', 'exit');
        // remove CLOSE buttons from EXIT nodes of the last cue
        $('#'+myLastCueId+' .close-ui-exit').remove();
        // remove the arrow to the next cue
        $('#'+myLastCueId+' .cue_canvas').clearCanvas();
    }
    
    if (myExLastCueId != undefined) {  // if the last cue is not the only cue
        // remove the second EXIT node
        var dragExits = setExitDirection(myTreeId);
        setExitValues(myExLastCueId, dragExits.yes, dragExits.no);
        // add CLOSE button to EXIT node of ex-last cue
        $('#'+myExLastCueId+' .exit-widget .widget-head').append( closeExitButtonHtml() );
        // activate the close exit button
        activateCloseExitButton(myExLastCueId);  // activate the close button for Exit node
        // draw arrow to the next cue
        drawArrowToNextCue(myExLastCueId);
    } else {
        //console.log('NO EX-LAST CUE!');
    }
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
    var myYesOld = $('#'+myCueId+' #hidden-exit-yes').val();
    var myNoOld = $('#'+myCueId+' #hidden-exit-no').val();
    
    //console.log('SET EXIT VALUES! '+myCueId+' '+myYes+' '+myNo);
    //console.log('myYesOld: '+myYesOld);
    //console.log('myNoOld: '+myNoOld);
    
    if (myYesOld != myYes) {
        //console.log('SET EXIT VALUES! myYesOld <> myYes: '+myYesOld+' '+myYes);
        switch (myYes) {
            case 'exit':
                addExitNode(myCueId, 'hidden-exit-yes');
            break;
            case 'continue':
                removeExitNode(myCueId, 'hidden-exit-yes');
            break;
        }
        $('#'+myCueId+' #hidden-exit-yes').val(myYes); // add ".trigger('change')" if you need to track this change and then do something with "$('#hidden-exit-yes').change(function(){do smth. here}"
    }
    
    if (myNoOld != myNo) {
        //console.log('SET EXIT VALUES! myNoOld <> myNo: '+myNoOld+' '+myNo);
        switch (myNo) {
            case 'exit':
                addExitNode(myCueId, 'hidden-exit-no');
            break;
            case 'continue':
                removeExitNode(myCueId, 'hidden-exit-no');
            break;
        }
        $('#'+myCueId+' #hidden-exit-no').val(myNo); // add ".trigger('change')" if you need to track this change and then do something with "$('#hidden-exit-yes').change(function(){do smth. here}"
    }

}

function addExitNode(myCueId, myHiddenExitId) {
    //console.log('ADD EXIT NODE! '+myCueId+' '+myHiddenExitId);
    
    var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    var myTreeInt = getTreeInt(myTreeId);
    console.log('EXIT myTreeId: '+myTreeId+' '+myTreeInt);
    
    //var myCriterionName = myJsonObj.trees[myTreeInt].criterion;
    
    
    switch(myHiddenExitId) {
        case 'hidden-exit-yes':
            var myExitClass = 'exit-left';
            var myExitText = 'Yes';
            break;
        case 'hidden-exit-no':
            var myExitClass = 'exit-right';
            var myExitText = 'No';
            break;
    }
    
    c++; // prepare for the next dragCueId
    var myExitNodeId = 'exit-'+d+'-'+c;  // d - the same as cueID, c - unique for exit nodes
    
    var exitNode =  '<li id='+myExitNodeId+' class="'+myExitClass+' exit-widget unsortable color-blue">\
                        <div class="widget-head h3">\
                            <span>Prediction: '+myExitText+'</span>\
                            '+closeExitButtonHtml()+'\
                        </div>\
                        <div>\
                            <canvas class="exit_canvas" width="220" height="75"></canvas>\
                        </div>\
                    </li>';
    //$('#'+myCueId+' .exits').append(exitNode);
    $(exitNode).hide().appendTo('#'+myCueId+' .exits').fadeIn(300);
    
    //draw arrow to the Exit Node
    drawArrowToExit(myExitNodeId, myExitClass);
    
    // activate the close button
    activateCloseExitButton(myCueId);  // activate the close button
}

function drawArrowToExit(myExitNodeId, myExitClass) {
    
    switch(myExitClass) {
        case 'exit-left':
            var myX1 = 160;
            var myY1 = 65;
            var myX2 = 220;
            var myY2 = 5;
            var myLabelText = 'yes';
            var myLabelX = 180;
            var myLabelY = 30;
            break;
        case 'exit-right':
            var myX1 = 60;
            var myY1 = 65;
            var myX2 = 5;
            var myY2 = 5;
            var myLabelText = 'no';
            var myLabelX = 40;
            var myLabelY = 30;
            break;
    }
    
    $('#'+myExitNodeId+' .exit_canvas').drawLine({
        strokeStyle: '#000',
        strokeWidth: 2,
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
    
    // clear canvas
    $('#'+myCueId+' .cue_canvas').clearCanvas();
    
    var myX1 = 75;
    var myY1 = 65;
    var myX2 = 75;
    var myY2 = 10;
    var myLabelX = 65;
    var myLabelY = 35;
    
    $('#'+myCueId+' .cue_canvas').drawLine({
        strokeStyle: '#000',
        strokeWidth: 2,
        rounded: true,
        startArrow: true,
        arrowRadius: 15,
        arrowAngle: 90,
        x1: myX1, y1: myY1,
        x2: myX2, y2: myY2
    });
    
    //get Exit values
    var myYes = $('#'+myCueId+' #hidden-exit-yes').val();
    //var myNo = $('#'+myCueId+' #hidden-exit-no').val();  // we don't need that actually
    
    switch (myYes) {
        case 'exit':
            var myLabelText = 'no';
        break;
        case 'continue':
            var myLabelText = 'yes';
        break;
    }
    
    $('#'+myCueId+' .cue_canvas').drawText({
        fillStyle: '#000',
        //strokeStyle: 'white',
        //strokeWidth: 1,
        x: myLabelX, y: myLabelY,
        fontSize: 12,
        fontFamily: 'Verdana, sans-serif',
        text: myLabelText
    });
}

function closeExitButtonHtml() {
    var myHtml = '<button id="icons" class="close-ui-exit ui-state-default ui-corner-all" title=".ui-icon-close"><span class="ui-icon ui-icon-close"></span></button>'
    return myHtml;
}

function activateCloseExitButton(myCueId) {
    
    //console.log('ACTIVATE EXIT BUTTON! myCueId: '+myCueId);
    
    //$('.close-ui-exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
    $('#'+myCueId).find('.close-ui-exit').mouseup(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
        
        //removeExitNode(myCueId, myHiddenExitId);
        
        switchExitDirection(myCueId);
        
        var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
        updateJsonDataset(myTreeId); // update the changed exit direction
        
        jsPlumb.repaintEverything();
        
        return false;                                            // Return false, prevent default action
    })
}

function switchExitDirection(myCueId) {
    
    //console.log('SWITCH EXIT DIRECTION! myCueId: '+myCueId);
    
    //get hidden exit values
    var myYesOld = $('#'+myCueId+' #hidden-exit-yes').val();
    var myNoOld = $('#'+myCueId+' #hidden-exit-no').val();
    
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
        case 'hidden-exit-yes':
            var myExitClass = 'exit-left';
            break;
        case 'hidden-exit-no':
            var myExitClass = 'exit-right';
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


function collapseCueButtons() {
    
    //$('.collapse-ui-cue').click(function (e) {  // Create new anchor with a class of 'collapse'
    //    $(this).parents('.widget').find('.widget-content').slideToggle('slow');
    //});
    
    // hide the content by default
    $('.horiz_scroll').find('.widget-content').hide();
    
    $('.horiz_scroll, .trees').on('click', '.collapse-ui-cue', function (e) {  
        $(this).parents('.widget').find('.widget-content').slideToggle('slow');
    });
}

//function collapseCueButtonsOLD() {
    
//    $('.collapse-ui-cue').mousedown(function (e) {  // Create new anchor with a class of 'collapse'
//        e.stopPropagation();                             // Stop event bubbling
//    }).toggle(function () {                              // Toggle: (1st State)
//        $(this).parents('.widget').find('.widget-content').hide();  // Find content within widget and HIDE it
//        return false;                                    // Return false, prevent default action
//    },function () {                                      // Toggle: (2nd State)
//        $(this).parents('.widget').find('.widget-content').show();  // Find content within widget and SHOW it
//        return false;                                    // Return false, prevent default action
//    }).prependTo($('.widget-head',this));       // Prepend that 'collapse' button to the widget's handle
//}

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
    
    $('#'+myCueId+' .close-ui-cue').mousedown(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        $(this).parents('.widget').animate({                           // Animate widget to an opacity of 0
            opacity: 0    
        },function () {                                                     // When animation (opacity) has finished
            $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
                $(this).remove();                                           // When sliding up has finished, remove widget from DOM
                //console.log('REMOVED myCueId: '+myCueId);
                updateExitsForLastAndExLastCues(myTreeId, myCueId); // take care of the EXIT nodes
                updateJsonDataset(myTreeId); // update the changed exit direction
            });
        });
        return false;                                            // Return false, prevent default action
    })
}


function drawPlumbLines(){
    
    jsPlumb.ready(function () {
        
        var myCueId = 'cue0-10';
        var myExitNodeId = 'exit-10-10';
        //var myExitNodeId = $('#'+myCueId).find('.exit-widget')[0] ;
    
        // setup some defaults for jsPlumb.
        var instance = jsPlumb.getInstance({
            Endpoint: ["Dot", {radius: 2}],
            HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
            ConnectionOverlays: [
                [ "Arrow", {
                    location: 1,
                    id: "arrow",
                    length: 14,
                    foldback: 0.8
                } ],
                [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
            ],
            Container: "two_trees"
        });
    
        window.jsp = instance;
        //console.log('instance: '+JSON.stringify(instance, null, "  ") );
    
        var windows = jsPlumb.getSelector(".horiz_scroll .widget");
    
        // initialise draggable elements.
        instance.draggable(windows);
    
        // bind a click listener to each connection; the connection is deleted. you could of course
        // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
        // happening.
        //instance.bind("click", function (c) {
        //    instance.detach(c);
        //});
    
        // bind a connection listener. note that the parameter passed to this function contains more than
        // just the new connection - see the documentation for a full list of what is included in 'info'.
        // this listener sets the connection's internal
        // id as the label overlay's text.
        instance.bind("connection", function (info) {
            info.connection.getOverlay("label").setLabel(info.connection.id);
        });
    
    
        // suspend drawing and initialise.
        instance.batch(function () {
            instance.makeSource(windows, {
                filter: ".ep",
                anchor: "Continuous",
                connector: [ "StateMachine", { curviness: 20 } ],
                connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
                maxConnections: 5,
                onMaxConnections: function (info, e) {
                    alert("Maximum connections (" + info.maxConnections + ") reached");
                }
            });
    
            // initialise all '.widget' elements as connection targets.
            instance.makeTarget(windows, {
                dropOptions: { hoverClass: "dragHover" },
                anchor: "Continuous",
                allowLoopback: true
            });
    
            // and finally, make a couple of connections
            instance.connect({ source: myCueId, target: myExitNodeId });
            //instance.connect({ source: "phone1", target: "phone1" });
            //instance.connect({ source: "phone1", target: "inperson" });
        });
    
        jsPlumb.fire("jsPlumbDemoLoaded", instance);
    
    });
};

function connectNodes() {                
    // jsPlumb "state machine"
    
    jsPlumb.ready(function() {
            
        var firstInstance = jsPlumb.getInstance();
        
        firstInstance.importDefaults({
            //Connector : [ "Bezier", { curviness: 150 } ],
            Anchors : [ "BottomCenter", "TopCenter" ]
        });
        
        //set a container
        jsPlumb.setContainer($("cue2-10"));
          
        firstInstance.connect({
            source:"cue2-10",   //source:"element1", 
            target:"exit-10-10",   //target:"element2",
            scope:"someScope" 
        });
        
        firstInstance.draggable(['cue2-10', 'exit-10-10']);
        
        /*
        var myExitNodeId = $('#'+myCueId).find('.exit-widget')[0] ;
        
        // define if the endpoints are visible
        var endpointOptions = {
            isSource:true,
            isTarget:true
        };
        
        var div1Endpoint = jsPlumb.addEndpoint(myCueId, { anchor:'AutoDefault' }, endpointOptions );  
        var div2Endpoint = jsPlumb.addEndpoint(myExitNodeId, { anchor:'AutoDefault' }, endpointOptions );  
        
        //var myConnect = jsPlumb.connect({ 
        jsPlumb.connect({ 
            source:div1Endpoint,
            target:div2Endpoint,
            connector: [ 'Straight' ],
            //label: 'FOO'
            overlays:[
                [ "Arrow", { foldback:1, location:1, id:"arrow" } ], 
                [ "Label", {label:"Yes", id:"label"}]
            ] 
            //paintStyle:{ lineWidth:2, strokeStyle:'black' }
        });
        
        */
        
        //myInstanceOfJsPlumb.draggable(myExitNodeId);
        
        //var label = myConnect.getOverlay("label");
        //console.log("Label is currently", label.getLabel());
        //label.setLabel("BAR");
        //console.log("Label is now", label.getLabel());
    });
}

// Right at the very end of buildtree.js
//iNettuts.init();
init();
