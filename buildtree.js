/*
 * Script from NETTUTS.com [by James Padolsey]
 * @requires jQuery($), jQuery UI & sortable/draggable UI modules
 */


    
//    jQuery : $,                                  /* Set's jQuery identifier: */

var d = 9;  // for unique cue IDs, not 0 to have always two characters for removal (3 characters with '-')
var c = 9;  // for unique exit IDs, not 0 to have always two characters for removal (3 characters with '-')

var orderTree0 = [];  // variable knows what's in the tree0
var orderTree1 = [];  // variable knows what's in the tree1

var myJsonObj = new Object();
myJsonObj.trees = []; 
//console.log('JSON NEW initial: ' + JSON.stringify(myJsonObj, null, "  "));

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

function updateJsonDataset() {
        
    // get the order of the cues in the trees
    orderTree0 = $('#tree0').sortable('toArray');
    orderTree1 = $('#tree1').sortable('toArray');
    orderTree0 = orderTree0.filter(function(n){ return n != "" });  // remove empty elements in array
    orderTree1 = orderTree1.filter(function(n){ return n != "" });  // remove empty elements in array
    console.log('orderTree0 UPDATE: ' + orderTree0.toString());
    console.log('orderTree1 UPDATE: ' + orderTree1);
    
    //var myJsonObj = new Object();
    myJsonObj.trees = [];
    
    for(var t = 0; t < 2; t++) {  // go through the trees
        
        var myTreeObj = new Object();
        
        //myTreeObj.criterion = 'cue1'; // ONLY FOR TESTING!!!
        myTreeObj.criterion = mydata.meta['fields'][getInt(criterCue)];
        
        myTreeObj.cues = [];
    
        for(var e = 0; e < 5; e++) {    // go through the tree's elements
            
            var myCueObj = new Object();
            
            myCueObj.name = getCueName( 'tree'+t ,e );  // getCueName(myTreeId,myTreeElementId)
            myCueObj.yes = getExitValue( 'tree'+t, e, 'yes' );      // getExitValue(myTreeId,myTreeElementId, myDir)
            myCueObj.no = getExitValue( 'tree'+t, e, 'no' );      // getExitValue(myTreeId,myTreeElementId, myDir)
            
            //myTreeObj.cues[e] = myCueObj;
            if (myCueObj.name != undefined) {
                myTreeObj.cues.push(myCueObj);
            }
        }
        
        //myJsonObj.trees[t] = myTreeObj;
        myJsonObj.trees.push(myTreeObj);
    }
    
    console.log('JSON NEW updated: ' + JSON.stringify(myJsonObj, null, "  "));
    
    // from uwe fftreeStatistics/fftree.js, now in calculatestatistics.js
    analyzeDataset();
        
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

function getCueName(myTreeId,myTreeElementId) {
    var myCueId = getCueId(myTreeId,myTreeElementId);
    if (myCueId != undefined) {
        var myInt = getInt(myCueId);
        var myName = mydata.meta['fields'][myInt];
        //var myName = 'test';  //CHANGED FOR TESTING!!!
    }
    return myName;
}

function getCueId(myTreeId,myTreeElementId) {
    switch (myTreeId) {
        case 'tree0':
            var myCueId = orderTree0[myTreeElementId];
            //console.log('myCueId: '+myCueId);
        break;
        case 'tree1':
            var myCueId = orderTree1[myTreeElementId];
            //console.log('myCueId: '+myCueId);
        break;
    }
    return myCueId;
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

function getExitValue(myTreeId,myTreeElementId, myDir) {
    var myCueId = getCueId(myTreeId,myTreeElementId);
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
    var criterCue = '';
    var origCue = '';
    var dragCue = '';
    var dragTree = '';  // variable knows the ID of the dropped tree
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
            d++; // prepare for the next dragCue
            dragCue = origCue+'-'+d;  // make the new ID for the cloned cue
            //console.log('d: '+d);
            ui.helper.attr('id',dragCue);  // rename the cloned cue
            console.log('dragCue: ' + dragCue);
                        
            $('#'+dragCue+' .criterion').remove(); // remove the radio button
            
            //hide the content, if expanded
            //$('#'+dragCue).find('.widget-content').hide();
            
            //reactivate CLOSE button - bug workaround?
            activateCloseCueButton(dragCue);
                        
            // add EXIT nodes, depending on which tree is dropped on
            var dragExits = setExitDirection(dragTree);
            setExitValues(dragCue, dragExits.yes, dragExits.no);
        }
    });
    
    // DISABLE dragging of all cues, until a criterion is selected
    //$('.horiz_scroll li').draggable('disable'); // DISABLE FOR TESTING!!!
      
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
        forcePlaceholderSize: 'true',
        items: 'li:not(.unsortable)',
        revert: true,
        start: function(event,ui){
        },
        over: function() {
            //$('#'+dragTree+' .placeholder').show();  //show or hide the text "drag'n'drop cues here"
            
            // this is supposed to make jsPlumb lines draggable
            $(this).find('._jsPlumb_endpoint_anchor_').each(function(i,event){ 
                if($(event).hasClass("connect"))
                    jsPlumb.repaint($(event).parent());
                else
                    jsPlumb.repaint($(event));
            });
            
        },
        out: function() {
            //$('#'+dragTree+' .placeholder').show();  //show or hide the text "drag'n'drop cues here"
        },
        stop: function() {
            //$('#'+dragTree+' .placeholder').show();  //show or hide, or remove the text "drag'n'drop cues here"
        },
        
        update: function (event,ui) {
                              
            //console.log('SORTABLE UPDATE!');
                  
            // take care of the EXIT nodes
            updateExitsForLastAndExLastCues(dragTree, dragCue);
            
            // draw lines between CUES and EXIT nodes
            //connectNodes(dragCue);
            
            // update connecting lines!
            jsPlumb.draggable(dragCue);
            
            // update JSON dataset for the analysis algorithms
            updateJsonDataset();
            
        }
    }).disableSelection();      
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
            Connector : [ "Bezier", { curviness: 150 } ],
            Anchors : [ "BottomCenter", "TopCenter" ]
        });
        
        //set a container
        jsPlumb.setContainer($("tree0"));
          
        firstInstance.connect({
            source:"cue0-10",   //source:"element1", 
            target:"exit-10-10",   //target:"element2",
            scope:"someScope" 
        });
        
        firstInstance.draggable(['cue0-10', 'exit-10-10']);
        
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
    
    // last cue must have two EXIT nodes, ex-last must have one EXIT node
    //if (myCueId == myLastCueId) {                             // if active cue is last cue
                        
        // add the second EXIT node
        setExitValues(myLastCueId, 'exit', 'exit');
        // remove CLOSE buttons from EXIT nodes of the last cue
        $('#'+myLastCueId+' .close-ui-exit').remove();
        
        if (myExLastCueId != undefined) {  // if the last cue is not the only cue
            // remove the second EXIT node
            var dragExits = setExitDirection(myTreeId);
            setExitValues(myExLastCueId, dragExits.yes, dragExits.no);
            // add CLOSE button to EXIT node of ex-last cue
            $('#'+myExLastCueId+' .exit-widget .widget-head').append( closeExitButtonHtml() );
            // activate the close exit button
            activateCloseExitButton(myExLastCueId);  // activate the close button
        } else {
            //console.log('NO EX-LAST CUE!');
        }
    //}
}

function setExitDirection(myTreeId) {
    switch (myTreeId) {
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
    
    var myCriterionName = myJsonObj.trees[myTreeInt].criterion;
    
    
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
    
    c++; // prepare for the next dragCue
    var myExitNodeId = 'exit-'+d+'-'+c;  // d - the same as cueID, c - unique for exit nodes
    
    var exitNode =  '<li id='+myExitNodeId+' class="'+myExitClass+' exit-widget unsortable color-blue">\
                        <div class="widget-head h3">\
                            <span>'+myCriterionName+': '+myExitText+'</span>\
                            '+closeExitButtonHtml()+'\
                        </div>\
                    </li>';
    //$('#'+myCueId+' .exits').append(exitNode);
    $(exitNode).hide().appendTo('#'+myCueId+' .exits').fadeIn(300);
    
    // activate the close button
    activateCloseExitButton(myCueId);  // activate the close button
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
        
        updateJsonDataset(); // update the changed exit direction
        
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

function selectCriterion() {
    $('.criterion').change(function(){
        criterCue = $( 'input:radio[name=criterion]:checked' ).val();
        console.log('criterCue: ' + criterCue);
        $('.horiz_scroll li').draggable('enable'); // ENABLE dragging of all cues
        $('.horiz_scroll #'+criterCue).draggable('disable'); // DISABLE draggable of the cue, which is selected as criterion
        
        updateJsonDataset() // update JSON object because we have a criterion
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
                updateJsonDataset(); // update the changed exit direction
            });
        });
        return false;                                            // Return false, prevent default action
    })
}



// Right at the very end of buildtree.js
//iNettuts.init();
init();
