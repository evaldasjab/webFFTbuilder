/*
 * Script from NETTUTS.com [by James Padolsey]
 * @requires jQuery($), jQuery UI & sortable/draggable UI modules
 */


    
//    jQuery : $,                                  /* Set's jQuery identifier: */


function init() {                        // Function, which initialises methods to be run when page has loaded
    // The method which starts it all...
    this.attachStylesheet('buildtree.js.css');
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
                            </div>\
                            <div class="close-exit">x</div>\
                            <div class="widget-content">\
                                <p>Negative</p>\
                            </div>\
                        </li>';
            break;
        case '1':
            exitNode =  '<li class="exit-right exit-widget color-blue">\
                            <div class="widget-head">\
                                <h3>EXIT</h3>\
                            </div>\
                            <div class="close-exit">x</div>\
                            <div class="widget-content">\
                                <p>Positive</p>\
                            </div>\
                        </li>';
            break;
    }
    return exitNode;
}

function makeSortable() {                 // This function will make the widgets draggable-droppable using the jQuery UI 'sortable' module.
        
    var myJsonObject = new Object();
    myJsonObject.tree0 = {};
    myJsonObject.tree0.criterion = '';
    myJsonObject.tree0.cue0 = {'name':'','exit':''};
    myJsonObject.tree0.cue1 = {'name':'','exit':''};
    myJsonObject.tree0.cue2 = {'name':'','exit':''};
    myJsonObject.tree0.cue3 = {'name':'','exit':''};
    myJsonObject.tree0.cue4 = {'name':'','exit':''};
    myJsonObject.tree1 = {};
    myJsonObject.tree1.criterion = '';
    myJsonObject.tree1.cue0 = {'name':'','exit':''};
    myJsonObject.tree1.cue1 = {'name':'','exit':''};
    myJsonObject.tree1.cue2 = {'name':'','exit':''};
    myJsonObject.tree1.cue3 = {'name':'','exit':''};
    myJsonObject.tree1.cue4 = {'name':'','exit':''};
    
    console.log('JSON initial: ' + JSON.stringify(myJsonObject, null, "  "));
    
    //var newItemId = '';
    var criterCue = '';
    var origCue = '';
    var dragCue = '';
    var dragTree = '';  // variable knows the ID of the dropped tree
    var orderTree0 = [];  // variable knows what's in the tree0
    var orderTree1 = [];  // variable knows what's in the tree1
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
            
            $('#' +dragCue+ ' .criterion').remove(); // remove the radio button
            addCloseButton(dragCue);                       // add CLOSE button
                        
            // add EXIT nodes, depending on which tree is dropped on
            switch (dragTree) {
                case 'tree0':
                    $('#'+dragCue+' .exits').append(insertExit('0'));
                    $('#'+dragCue+' #hidden-exit-dir').val('0');  // change the value in cue's hidden input field
                    break;
                case 'tree1':
                    $('#'+dragCue+' .exits').append(insertExit('1'));
                    $('#'+dragCue+' #hidden-exit-dir').val('1');  // change the value in cue's hidden input field
                    break;
            }
            closeExitButton();  // activate the close buttons
        }
    });
    
    // off dragging of all cues, until a criterion is selected
    $('.horiz_scroll li').draggable('disable');
    
    // disable draggable, if the cue is selected as criterion
    $('.criterion').change(function(){
        criterCue = $( 'input:radio[name=criterion]:checked' ).val();
        myJsonObject.tree0.criterion = criterCue; // update JSON object
        myJsonObject.tree1.criterion = criterCue; // update JSON object
        console.log('criterCue: ' + criterCue);
        $('.horiz_scroll li').draggable('enable');
        $('.horiz_scroll #'+criterCue).draggable('disable');
    });
    
    
    
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
            
            
                
                    // get the order of the cues in the trees
                    orderTree0 = $('#tree0').sortable('toArray');
                    orderTree1 = $('#tree1').sortable('toArray');
                    orderTree0 = orderTree0.filter(function(n){ return n != "" });  // remove empty elements in array
                    orderTree1 = orderTree1.filter(function(n){ return n != "" });  // remove empty elements in array
                    console.log('orderTree0: ' + orderTree0.toString());
                    console.log('orderTree1: ' + orderTree1);
                    
                    // for the last cue, replace one EXIT with two, and ex-last cue back to one EXIT
                    orderDragTree = $('#'+dragTree).sortable('toArray');  // get the order of active tree
                    orderDragTree = orderDragTree.filter(function(n){ return n != '' });  // remove empty elements in array
                    lastCueId = $(orderDragTree).get(-1);                     // get the last cue
                    
                    if (dragCue == lastCueId) {                             // if active cue is last cue
                        
                        exLastCueId = $(orderDragTree).get(-2);                     // get the cue, which previously was last
                        var exitDir = $('#'+exLastCueId+' #hidden-exit-dir').val()
                        
                        switch (exitDir) {
                            case '0':
                                $( '#'+exLastCueId+' .exit-right' ).animate({                           // Animate widget to an opacity of 0
                                    opacity: 0    
                                },function () {                                                     // When animation (opacity) has finished
                                    $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
                                        $(this).remove();                                           // When sliding up has finished, remove widget from DOM
                                    });
                                });
                            break;
                            case '1':
                                $( '#'+exLastCueId+' .exit-left' ).animate({                           // Animate widget to an opacity of 0
                                    opacity: 0    
                                },function () {                                                     // When animation (opacity) has finished
                                    $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
                                        $(this).remove();                                           // When sliding up has finished, remove widget from DOM
                                    });
                                });
                            break;
                        }
                        
                        var exitDir = $('#'+dragCue+' #hidden-exit-dir').val()
                        
                        switch (exitDir) {
                            case '0': $('#'+lastCueId+' .exits').append(insertExit('1')); break;
                            case '1': $('#'+lastCueId+' .exits').append(insertExit('0')); break;
                        }
                        
                        // remove CLOSE buttons from EXIT nodes of the last cue
                        $('#'+lastCueId+' .close-exit').remove();
                        
                        // add CLOSE button to the EXIT node of exLastCue
                        $('#'+exLastCueId+' .widget-head').append('<div class="close-exit">x</div>');
                        closeExitButton();  // activate the close buttons
                    }
                    
                    // update JSON dataset
                    //for (var key in myJsonObjectTree0) {
                    //    if (myJsonObjectTree0.hasOwnProperty(key)) {
                    //        console.log('key: ' + key + " -> " + myJsonObjectTree0[key]);
                    //    }
                    //for(var i = 0; i < 5; i++) {
                    
                    //var name = mydata.meta['fields'][parseInt (orderTree0[0].slice(3,orderTree0[0].length-3)) ];
                    
                    
                    console.log("CALL0 0 N");
                    myJsonObject.tree0.cue0.name = getName(0,0);
                    console.log("CALL0 0 E");
                    myJsonObject.tree0.cue0.exit = getExit(0,0);
                    console.log("CALL0 1 N");
                    myJsonObject.tree0.cue1.name = getName(0,1);
                    console.log("CALL0 1 E");
                    myJsonObject.tree0.cue1.exit = getExit(0,1);
                    console.log("CALL0 2 N");
                    myJsonObject.tree0.cue2.name = getName(0,2);
                    console.log("CALL0 2 E");
                    myJsonObject.tree0.cue2.exit = getExit(0,2);
                    console.log("CALL0 3 N");
                    myJsonObject.tree0.cue3.name = getName(0,3);
                    console.log("CALL0 3 E");
                    myJsonObject.tree0.cue3.exit = getExit(0,3);
                    console.log("CALL0 4 N");
                    myJsonObject.tree0.cue4.name = getName(0,4);
                    console.log("CALL0 4 E");
                    myJsonObject.tree0.cue4.exit = getExit(0,4);
                    console.log("CALL0 END");
                    
                    myJsonObject.tree1.cue0.name = getName(1,0);
                    myJsonObject.tree1.cue0.exit = getExit(1,0);
                    myJsonObject.tree1.cue1.name = getName(1,1);
                    myJsonObject.tree1.cue1.exit = getExit(1,1);
                    myJsonObject.tree1.cue2.name = getName(1,2);
                    myJsonObject.tree1.cue2.exit = getExit(1,2);
                    myJsonObject.tree1.cue3.name = getName(1,3);
                    myJsonObject.tree1.cue3.exit = getExit(1,3);
                    myJsonObject.tree1.cue4.name = getName(1,4);
                    myJsonObject.tree1.cue4.exit = getExit(1,4);
                    
                    function getName(myTree,myId) {
                        console.log("CALL INSIDE!");
                        switch (myTree) {
                            case 0:
                                var myCue = orderTree0[myId]; console.log('myCue: '+myCue);
                            break;
                            case 1:
                                var myCue = orderTree0[myId]; console.log('myCue: '+myCue);
                            break;
                        }
                        if (myCue != undefined) {
                            var mySlice = myCue.slice(3,myCue.length-3);
                            var myInt = parseInt(mySlice);
                            var myName = mydata.meta['fields'][myInt];
                        }
                        return myName;
                    }
                    
                    function getExit(myTree,myId) {
                        switch (myTree) {
                            case 0:
                                var myExit = $('#'+orderTree0[myId]+' #hidden-exit-dir').val();
                            break;
                            case 1:
                                var myExit = $('#'+orderTree1[myId]+' #hidden-exit-dir').val();
                            break;
                        }
                        return myExit;
                    }
                    
                    console.log('JSON updated: ' + JSON.stringify(myJsonObject, null, "  "));
                    
                    console.log('TEST: '+mydata.meta['fields'][0]);
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
    }).disableSelection();      
}

function addCloseButton(myDragCue) {  

    $('#'+myDragCue+' .widget-head').append('<div class="close-cue">x</div>');
    
    $('.close-cue').mousedown(function (e) {  // Create new anchor element with class of 'remove'
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
    
    $('.close-exit').mousedown(function (e) {  // Create new anchor element with class of 'remove'
        
        // change the direction of EXIT
        var myCue = $(this).closest('.widget').attr('id');
        var myExitDir = $('#'+myCue+' #hidden-exit-dir').val();
        switch (myExitDir) {
            case '0': newExitDir = '1'; break;
            case '1': newExitDir = '0'; break;
        };
        $('#'+myCue+' #hidden-exit-dir').val(newExitDir);
        $('#'+myCue+' .exits').append(insertExit(newExitDir));
        closeExitButton();  // activate the close button
        
        e.stopPropagation();                                                // Stop event bubbling (don't initiate other actions triggered by "mousedown", e.g. dragging)
    }).click(function () {
        $(this).parents('.exit-widget').animate({                           // Animate widget to an opacity of 0
            opacity: 0    
        },function () {                                                     // When animation (opacity) has finished
            $(this).wrap('<div/>').parent().slideUp(function () {           // Wrap in DIV (explained below) and slide up
                $(this).remove();                                           // When sliding up has finished, remove widget from DOM
            });
        });
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
