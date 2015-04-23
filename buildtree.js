/*
 * Script from NETTUTS.com [by James Padolsey]
 * @requires jQuery($), jQuery UI & sortable/draggable UI modules
 */


    
//    jQuery : $,                                  /* Set's jQuery identifier: */

var orderTree0 = [];  // variable knows what's in the tree0
var orderTree1 = [];  // variable knows what's in the tree1

var myJsonObject = new Object();
myJsonObject.tree0 = {};
myJsonObject.tree0.criterion = '';
myJsonObject.tree0.cue0 = {};
myJsonObject.tree0.cue1 = {};
myJsonObject.tree0.cue2 = {};
myJsonObject.tree0.cue3 = {};
myJsonObject.tree0.cue4 = {};
myJsonObject.tree1 = {};
myJsonObject.tree1.criterion = '';
myJsonObject.tree1.cue0 = {};
myJsonObject.tree1.cue1 = {};
myJsonObject.tree1.cue2 = {};
myJsonObject.tree1.cue3 = {};
myJsonObject.tree1.cue4 = {};
    
console.log('JSON initial: ' + JSON.stringify(myJsonObject, null, "  "));

collapseCueButtons(); // activate the collapse buttons

function init() {                        // Function, which initialises methods to be run when page has loaded
    // The method which starts it all...
    this.attachStylesheet('buildtree.js.css');
    this.selectCriterion();
    this.makeSortable();
    
    //this.connectCues();
    
    
}

function attachStylesheet(href) {         // Creates new link element with specified href and appends to <head>, attaches the second CSS StyleSheet - for JavaScript, which dynamically adds these elements to the page
    var $ = this.jQuery;
    return $('<link href="' + href + '" rel="stylesheet" type="text/css" />').appendTo('head');
}

function insertExit(exitId) {
    var exitNode = '';
    switch(exitId) {
        case '0':
            exitNode =  '<li class="exit-left exit-widget color-blue">\
                            <div class="widget-head">\
                                <h3>EXIT</h3>\
                                <button id="icons" class="close-ui-exit ui-state-default ui-corner-all" title=".ui-icon-close"><span class="ui-icon ui-icon-close"></span></button>\
                            </div>\
                            <div class="widget-content">\
                                <p>Yes</p>\
                            </div>\
                        </li>';
            break;
        case '1':
            exitNode =  '<li class="exit-right exit-widget color-blue">\
                            <div class="widget-head">\
                                <h3>EXIT</h3>\
                                <button id="icons" class="close-ui-exit ui-state-default ui-corner-all" title=".ui-icon-close"><span class="ui-icon ui-icon-close"></span></button>\
                            </div>\
                            <div class="widget-content">\
                                <p>No</p>\
                            </div>\
                        </li>';
            break;
    }
    
    return exitNode;
}

function makeSortable() {                 // This function will make the widgets draggable-droppable using the jQuery UI 'sortable' module.
    
    //var newItemId = '';
    var criterCue = '';
    var origCue = '';
    var dragCue = '';
    var dragTree = '';  // variable knows the ID of the dropped tree
    //var orderTree0 = [];  // variable knows what's in the tree0
    //var orderTree1 = [];  // variable knows what's in the tree1
    var d = 10;  // not 0 to have always two characters for removal (3 characters with '-')
        
    $('.horiz_scroll').find('li').draggable({
        connectToSortable: ".trees",
        helper: 'clone',
        handle: '.widget-head',        // Set the handle to the top bar
        placeholder: 'widget-placeholder',
        revert: 'invalid',
        start: function(event,ui){
            //get ID form draggable item 
            origCue = $(this).attr('id');
            console.log("origCue: " + origCue);
        },
        stop: function(event,ui){
            //assign ID to clone
            dragCue = origCue+'-'+d;  // make the new ID for the cloned cue
            d = d+1; // prepare for the next dragCue
            ui.helper.attr('id',dragCue);  // rename the cloned cue
            console.log('dragCue: ' + dragCue);
                        
            $('#'+dragCue+' .criterion').remove(); // remove the radio button
            
            //reactivate CLOSE button - bug workaround?
            activateCloseCueButton(dragCue);
                        
            // add EXIT nodes, depending on which tree is dropped on
            console.log('on draggable STOP - setExitValues');
            var dragExits = setExitDirection(dragTree);
            setExitValues(dragCue, dragExits.yes, dragExits.no);
        }
    });
    
    // DISABLE dragging of all cues, until a criterion is selected
    $('.horiz_scroll li').draggable('disable');
      
    $('.trees').droppable({
        over : function(event, ui) {
            dragTree = $(this).attr('id');  // get the ID of the dropped-over tree
            console.log('dragTree: ' + dragTree);
        }
    });
        
    $('.trees').sortable({
        //connectWith: '.trees',
        helper: 'clone',
        placeholder: 'widget-placeholder',
        items: 'li:not(.unsortable)',
        revert: true,
        over: function() {
            $('#'+dragTree+' .placeholder').show();  //hide
        },
        out: function() {
            $('#'+dragTree+' .placeholder').show();
        },
        stop: function() {
            $('#'+dragTree+' .placeholder').show();  //remove
        },
        
        update: function (event,ui) {
                                    
            // take care of the EXIT nodes
            updateExitsForLastAndExLastCues(dragTree, dragCue);
            
            // update JSON dataset for the analysis algorithms
            updateJsonDataset();
            
        }
    }).disableSelection();      
}

function updateExitsForLastAndExLastCues(myTreeId, myCueId) {
    
    //var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    console.log('EXIT-UPDATE myTreeId: '+myTreeId);
    console.log('EXIT-UPDATE myCueId: '+myCueId);
    
    // get the last and ex-last cue
    var myTreeArray = $('#'+myTreeId).sortable('toArray');  // get the order of active tree
    myTreeArray = myTreeArray.filter(function(n){ return n != '' });  // remove empty elements in array
    var myLastCueId = $(myTreeArray).get(-1);                     // get the last cue
    var myExLastCueId = $(myTreeArray).get(-2);                     // get the last cue
    console.log('myLastCueId: '+myLastCueId);
    console.log('myExLastCueId: '+myExLastCueId);
    
    // last cue must have two EXIT nodes, ex-last must have one EXIT node
    //if (myCueId == myLastCueId) {                             // if active cue is last cue
                
        console.log('LAST CUE -> setExitValues');
        // add the second EXIT node
        setExitValues(myLastCueId, 'exit', 'exit');              
        
        // remove the second EXIT node
        console.log('EX-LAST CUE -> setExitValues');
        var dragExits = setExitDirection(myTreeId);
        setExitValues(myExLastCueId, dragExits.yes, dragExits.no);
    //}
}

function setExitDirection(myTree) {
    switch (myTree) {
        case 'tree0':
            var myYes = 'exit';
            var myNo = 'continue';
            break;
        case 'tree1':
            var myYes = 'exit';
            var myNo = 'continue';
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
    
    console.log('SETEXITVALUES! '+myCueId+' '+myYes+' '+myNo);
    console.log('myYesOld: '+myYesOld);
    console.log('myNoOld: '+myNoOld);
    
    if (myYesOld != myYes) {
        console.log('SETEXITVALUES! myYesOld skiriasi nuo myYes: '+myYesOld+' '+myYes);
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
        console.log('SETEXITVALUES! myNoOld skiriasi nuo myNo: '+myNoOld+' '+myNo);
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

function addExitNode(myCueId, myExitId) {
    switch(myExitId) {
        case 'hidden-exit-yes':
            var myExitClass = 'exit-left';
            var myExitText = 'Yes';
            break;
        case 'hidden-exit-no':
            var myExitClass = 'exit-right';
            var myExitText = 'No';
            break;
    }
    var exitNode =  '<li class="'+myExitClass+' exit-widget color-blue">\
                            <div class="widget-head">\
                                <h3>EXIT</h3>\
                                <button id="icons" class="close-ui-exit ui-state-default ui-corner-all" title=".ui-icon-close"><span class="ui-icon ui-icon-close"></span></button>\
                            </div>\
                            <div class="widget-content">\
                                <p>'+myExitText+'</p>\
                            </div>\
                        </li>';
    //$('#'+myCueId+' .exits').append(exitNode);
    $(exitNode).hide().appendTo('#'+myCueId+' .exits').fadeIn(300);
    
    // activate the close button
    activateCloseExitButton(myCueId, myExitId);  // activate the close button
}

function activateCloseExitButton(myCueId, myExitId) {
    
    console.log('ACTIVATE myCueId: '+myCueId);
    console.log('ACTIVATE myExitId: '+myExitId);
    
    //$('.close-ui-exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
    $('#'+myCueId).find('.close-ui-exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
                
        console.log('MOUSEDOWN myExitId: '+myExitId);
        
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        removeExitNode(myCueId, myExitId);
        
        switchExitDirection(myCueId, myExitId);
        
        updateJsonDataset(); // update the changed exit direction
        
        return false;                                            // Return false, prevent default action
    })
}

function switchExitDirection(myCueId, myExitId) {
    switch(myExitId) {
        case 'hidden-exit-yes':
            setExitValues(myCueId, 'continue', 'exit');
            break;
        case 'hidden-exit-no':
            setExitValues(myCueId, 'exit', 'continue');
            break;
    }
}

function removeExitNode (myCueId, myExitId) {
    console.log('REMOVE EXIT NODE: '+myCueId+' '+myExitId);
    switch(myExitId) {
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

function selectCriterion() {
    $('.criterion').change(function(){
        criterCue = $( 'input:radio[name=criterion]:checked' ).val();
        console.log('criterCue: ' + criterCue);
        $('.horiz_scroll li').draggable('enable'); // ENABLE dragging of all cues
        $('.horiz_scroll #'+criterCue).draggable('disable'); // DISABLE draggable of the cue, which is selected as criterion
        
        updateJsonDataset() // update JSON object because we have a criterion
    });
}

function updateJsonDataset() {
        
    // update JSON dataset
    //for (var key in myJsonObjectTree0) {
    //    if (myJsonObjectTree0.hasOwnProperty(key)) {
    //        console.log('key: ' + key + " -> " + myJsonObjectTree0[key]);
    //    }
    //for(var i = 0; i < 5; i++) {
    
    //var name = mydata.meta['fields'][parseInt (orderTree0[0].slice(3,orderTree0[0].length-3)) ];
    
    // get the order of the cues in the trees
    orderTree0 = $('#tree0').sortable('toArray');
    orderTree1 = $('#tree1').sortable('toArray');
    orderTree0 = orderTree0.filter(function(n){ return n != "" });  // remove empty elements in array
    orderTree1 = orderTree1.filter(function(n){ return n != "" });  // remove empty elements in array
    console.log('orderTree0 UPDATE: ' + orderTree0.toString());
    console.log('orderTree1 UPDATE: ' + orderTree1);
    
    myJsonObject.tree0.criterion = mydata.meta['fields'][getInt(criterCue)];
    
    myJsonObject.tree0.cue0.name = getName(0,0);
    myJsonObject.tree0.cue0.yes = getExit(0,0,'yes');
    myJsonObject.tree0.cue0.no = getExit(0,0,'no');
    myJsonObject.tree0.cue1.name = getName(0,1);
    myJsonObject.tree0.cue1.yes = getExit(0,1,'yes');
    myJsonObject.tree0.cue1.no = getExit(0,1,'no');
    myJsonObject.tree0.cue2.name = getName(0,2);
    myJsonObject.tree0.cue2.yes = getExit(0,2,'yes');
    myJsonObject.tree0.cue2.no = getExit(0,2,'no');
    myJsonObject.tree0.cue3.name = getName(0,3);
    myJsonObject.tree0.cue3.yes = getExit(0,3,'yes');
    myJsonObject.tree0.cue3.no = getExit(0,3,'no');
    myJsonObject.tree0.cue4.name = getName(0,4);
    myJsonObject.tree0.cue4.yes = getExit(0,4,'yes');
    myJsonObject.tree0.cue4.no = getExit(0,4,'no');
    
    myJsonObject.tree1.criterion = mydata.meta['fields'][getInt(criterCue)];
    
    myJsonObject.tree1.cue0.name = getName(1,0);
    myJsonObject.tree1.cue0.yes = getExit(1,0,'yes');
    myJsonObject.tree1.cue0.no = getExit(1,0,'no');
    myJsonObject.tree1.cue1.name = getName(1,1);
    myJsonObject.tree1.cue1.yes = getExit(1,1,'yes');
    myJsonObject.tree1.cue1.no = getExit(1,1,'no');
    myJsonObject.tree1.cue2.name = getName(1,2);
    myJsonObject.tree1.cue2.yes = getExit(1,2,'yes');
    myJsonObject.tree1.cue2.no = getExit(1,2,'no');
    myJsonObject.tree1.cue3.name = getName(1,3);
    myJsonObject.tree1.cue3.yes = getExit(1,3,'yes');
    myJsonObject.tree1.cue3.no = getExit(1,3,'no');
    myJsonObject.tree1.cue4.name = getName(1,4);
    myJsonObject.tree1.cue4.yes = getExit(1,4,'yes');
    myJsonObject.tree1.cue4.no = getExit(1,4,'no');
    
    function getName(myTree,myId) {
        var myCue = getCue(myTree,myId);
        if (myCue != undefined) {
            var myInt = getInt(myCue);
            var myName = mydata.meta['fields'][myInt];
        }
        return myName;
    }
    
    function getCue(myTree,myId) {
        switch (myTree) {
            case 0:
                var myCue = orderTree0[myId];
                //console.log('myCue: '+myCue);
            break;
            case 1:
                var myCue = orderTree1[myId];
                //console.log('myCue: '+myCue);
            break;
        }
        return myCue;
    }
    
    function getInt(myCue) {
        var mySlice = myCue.slice(3,4);  // leave only the number e.g."1" in "cue1-0"
        var myInt = parseInt(mySlice);
        return myInt;
    }
    
    function getExit(myTree,myId, myDir) {
        var myCue = getCue(myTree,myId);
        switch (myDir) {
            case 'yes':
                var myExit = $('#'+myCue+' #hidden-exit-yes').val();
            break;
            case 'no':
                var myExit = $('#'+myCue+' #hidden-exit-no').val();
            break;
        }
        return myExit;
    }
    
    console.log('JSON updated: ' + JSON.stringify(myJsonObject, null, "  "));
    
    //console.log('TEST: '+mydata.meta['fields'][0]);
    //console.log('results fields: ' + mydata.meta['fields']);
    
    //if (dragTree == "tree0") {
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



function collapseCueButtons() {
    
    //$('.collapse-ui-cue').click(function (e) {  // Create new anchor with a class of 'collapse'
    //    $(this).parents('.widget').find('.widget-content').slideToggle('slow');
    //});
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

function activateCloseCueButton(myCueId) {  
    
    var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    console.log('closeCueButton myTreeId: '+myTreeId);
    console.log('closeCueButton myCueId: '+myCueId);
    
    $('#'+myCueId+' .close-ui-cue').mousedown(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        $(this).parents('.widget').animate({                           // Animate widget to an opacity of 0
            opacity: 0    
        },function () {                                                     // When animation (opacity) has finished
            $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
                $(this).remove();                                           // When sliding up has finished, remove widget from DOM
                console.log('REMOVED myCueId: '+myCueId);
                updateExitsForLastAndExLastCues(myTreeId, myCueId); // take care of the EXIT nodes
                updateJsonDataset(); // update the changed exit direction
            });
        });
        return false;                                            // Return false, prevent default action
    })
}

function closeCueButtons() {  
    
    $('.close-ui-cue').mousedown(function (e) {  // Create new anchor element with class of 'remove'
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        $(this).parents('.widget').animate({                           // Animate widget to an opacity of 0
            opacity: 0    
        },function () {                                                     // When animation (opacity) has finished
            $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
                $(this).remove();                                           // When sliding up has finished, remove widget from DOM
            });
        });
        return false;                                            // Return false, prevent default action
    })
}

function closeExitButton() {  
    
    //$('.close-ui-exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
    $('.widget-head').on('click', '.close-ui-exit', function (e) {
                
        // change the direction of EXIT
        var myCue = $(this).closest('.widget').attr('id');
        var myExitDir = $('#'+myCue+' #hidden-exit-dir').val();
        console.log('myCue: '+myCue);
        console.log('myExit: '+myExitDir);
        
        switch (myExitDir) {
            case '0': newExitDir = '1'; break;
            case '1': newExitDir = '0'; break;
        };
        $('#'+myCue+' #hidden-exit-dir').val(newExitDir);
        $('#'+myCue+' .exits').append(insertExit(newExitDir));
        
        updateJsonDataset(); // update the changed exit direction
        
        closeExitButton();  // activate the close button
        
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        removeExitNode('#'+myCue+' .exit-widget');
        return false;                                            // Return false, prevent default action
    })
}


function connectCues() {                
        
    var endpointOptions = { isSource:true, isTarget:true }; 
    var div1Endpoint = jsPlumb.addEndpoint('cue1', { anchor:'TopCenter' }, endpointOptions );  
    var div2Endpoint = jsPlumb.addEndpoint('cue2', { anchor:'BottomCenter' }, endpointOptions );  
    jsPlumb.connect({ 
        source:div1Endpoint,
        target:div2Endpoint,
        connector: [ 'Bezier', 175 ],
        paintStyle:{ lineWidth:5, strokeStyle:'red' }
    }); 
}

// Right at the very end of buildtree.js
//iNettuts.init();
init();
