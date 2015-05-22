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
        //$('.horiz_scroll .widget').draggable('enable'); // ENABLE dragging of all cues
        //$('.horiz_scroll #'+criterCue).draggable('disable'); // DISABLE draggable of the cue, which is selected as criterion
        
        updateJsonDataset('tree0'); // update JSON object because we have a criterion
        updateJsonDataset('tree1'); // update JSON object because we have a criterion
        
        updateStatisticsForSingleCues();
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
    var origCue = '';
    var dragCue = '';
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
            origCue = $(this).attr('id');
            //console.log("origCue: " + origCue);
        },
        stop: function(event,ui){
            //assign ID to clone
            d++; // prepare for the next dragCue
            dragCue = origCue+'-'+d;  // make the new ID for the cloned cue
            //console.log('d: '+d);
            ui.helper.attr('id',dragCue);  // rename the cloned cue
            //console.log('dragCue: ' + dragCue);
                        
            // replace the radio button with close button
            $('#'+dragCue+' .criterion_class').remove(); // remove the radio button
            $('#'+dragCue+' .criterion_label').remove(); // remove the radio button label
            $('#'+dragCue+' .widget_head').append( closeButtonHtml() );  // add close button
            activateExpandButton(dragCue);  // reactivate EXPAND BUTTON - bug workaround
            activateCloseCueButton(dragCue); // activate close button
            
            //hide the content, if expanded
            //$('#'+dragCue).find('.widget_content').hide();
                        
            // add EXIT nodes, depending on which tree is dropped on
            $('#'+dragCue+' #hidden-exit_yes').val('continue'); // 'reset' exit values - bug workaround
            $('#'+dragCue+' #hidden-exit_no').val('continue'); // 'reset' exit values - bug workaround
            var dragExits = setExitDirection(dragTreeId);
            setExitValues(dragCue, dragExits.yes, dragExits.no);
            
            // FIX THIS!!!
            // add "TREE up to this cue" statistics table
            $('#'+dragCue).find('.stat_cue_header').show();
            $('#'+dragCue).find('.stat_tree_header').show();
            //$('#'+dragCue).find('.stat_tree').show();
            
            // FIX THIS!!!
            activateStatsSlideToggle(dragCue);
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
        placeholder: 'widget_placeholder',
        forcePlaceholderSize: 'true',
        items: 'li:not(.unsortable)',
        revert: true,
        start: function(event,ui){
        },
        over: function() {
            //$('#'+dragTreeId+' .placeholder').show();  //show or hide the text "drag'n'drop cues here"
            
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
            updateExitsForLastAndExLastCues(dragTreeId, dragCue);
            
            // draw lines between CUES and EXIT nodes
            //connectNodes(dragCue);
                        
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
        $('#'+myLastCueId+' .button_close_exit').remove();
        // remove the arrow to the next cue
        $('#'+myLastCueId+' .cue_canvas').clearCanvas();
    }
    
    if (myExLastCueId != undefined) {  // if the last cue is not the only cue
        // remove the second EXIT node
        var dragExits = setExitDirection(myTreeId);
        setExitValues(myExLastCueId, dragExits.yes, dragExits.no);
        // add CLOSE button to EXIT node of ex-last cue
        $('#'+myExLastCueId+' .exit_widget').append( closeExitButtonHtml() );
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
            break;
        case 'hidden-exit_no':
            var myExitClass = 'exit_right';
            var myExitText = 'No';
            break;
    }
    
    c++; // prepare for the next dragCue
    var myExitNodeId = 'exit_'+d+'-'+c;  // d - the same as cueID, c - unique for exit nodes
    
    var exitNode =  '<li id='+myExitNodeId+' class="'+myExitClass+' exit_widget unsortable">\
                        '+closeExitButtonHtml()+' \
                        <div class="exit_widget_title">\
                            <span>EXIT</span>\
                        </div>\
                        <div>\
                            <canvas class="exit_canvas" width="160" height="50"></canvas>\
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
    
    // clear canvas
    $('#'+myCueId+' .cue_canvas').clearCanvas();
    
    var myX1 = 20;
    var myY1 = 40;
    var myX2 = 20;
    var myY2 = 0;
    var myLabelX = 20;
    var myLabelY = 20;
    
    $('#'+myCueId+' .cue_canvas').drawLine({
        strokeStyle: '#A9A9A9',
        strokeWidth: 3,
        rounded: true,
        startArrow: true,
        arrowRadius: 15,
        arrowAngle: 90,
        x1: myX1, y1: myY1,
        x2: myX2, y2: myY2
    });
    
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

function closeButtonHtml() {
    var myHtml = '<button class="button_close">&#10005</button>'
    return myHtml;
}

function closeExitButtonHtml() {
    var myHtml = '<button class="button_close_exit">&#10005</button>'
    return myHtml;
}

function activateCloseExitButton(myCueId) {
    
    //console.log('ACTIVATE EXIT BUTTON! myCueId: '+myCueId);
    
    //$('.close_exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
    $('#'+myCueId).find('.button_close_exit').mouseup(function (e) {  // Create new anchor element with class of 'remove'
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

function expandButtons() {
    
    console.log('ACTIVATE EXPANSION!');
    
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
                updateExitsForLastAndExLastCues(myTreeId, myCueId); // take care of the EXIT nodes
                updateJsonDataset(myTreeId); // update the changed exit direction
            });
        });
        return false;                                            // Return false, prevent default action
    })
}


// Right at the very end of buildtree.js
//iNettuts.init();
init();
