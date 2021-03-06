// Selects a criterion, builds the tree by drag'n'drop of cues, displays exit nodes

//    jQuery : $,                                  /* Set's jQuery identifier: */

var d = 9;  // for unique cue IDs, not 0 to have always two characters for removal (3 characters with '-')
var c = 9;  // for unique exit IDs, not 0 to have always two characters for removal (3 characters with '-')
var criterCueId = '';

function init() {                        // Function, which initialises methods to be run when page has loaded
    // activate draggable and sortable
    makeSortable();
    selectCriterion();
    
}

function selectCriterion() {
    $('.criterion_class').change(function(){
        
        criterCueId = $( 'input:radio[name=criterion_name]:checked' ).val();
        criterCueName = $('#'+criterCueId).attr('name');
        console.log('criterCueId: '+criterCueId+', criterCueName: '+criterCueName);
        
        // remove the criterion cue from the trees, if there are some
        $('[name="'+criterCueName+'"] .button_close').click();
        
        // mark the cue adding the 'criterion_cue' class
        $('.widget').toggleClass('criterion_cue', false); // remove the class from other cues if previously was selected
        $('#'+criterCueId).toggleClass('criterion_cue', true);
        
        // ENABLE dragging of all cues except criterion
        makeSortable(); // RERUN - workaround, otherwise gives error
        $('.widget').draggable('enable');
        $('#'+criterCueId).draggable('disable');
        
        // show 'Drop the cues here!'
        $('.drophere').removeClass('disabled');
        
        updateJsonDataset('tree0'); // update JSON object and tree statistics
        updateJsonDataset('tree1'); // update JSON object and tree statistics
        updateStatisticsForSingleCues(); //update statistics in the blue area
        
        // reset deriv statistics for the criterion
        resetDerivativeView(criterCueId);
        
        // show next tooltip
        console.log('TIP 2');
        if (tour.getCurrentStep()<=1) {
            tour.goTo(2);
        }
    });
}

function makeSortable() {                 // This function will make the widgets draggable-droppable using the jQuery UI 'sortable' module.
    
    //var newItemId = '';
    var origCueId = '';
    dragCueId = '';
    var dragTreeId = '';  // variable knows the ID of the dropped tree
    //var orderTree0 = [];  // variable knows what's in the tree0
    //var orderTree1 = [];  // variable knows what's in the tree1
    
    $('.widget').draggable({   
        connectToSortable: ".trees",
        helper: 'clone',
        handle: '.widget_title',        // Set the handle to the top bar
        placeholder: 'widget_placeholder',
        forcePlaceholderSize: 'true',
        revert: 'invalid',
        start: function(event,ui){
            //get ID form draggable item 
            origCueId = $(this).attr('id');
            //console.log("origCueId: " + origCueId);
            
            // show next tooltip
            console.log('TIP 3 or ');
            if (tour.getCurrentStep()<=2) {
                tour.goTo(3);
            }
        },
        drag: function(event,ui){
            //hide the content, if expanded
            ui.helper.attr('id','myTempId');  // rename the cloned cue
            $('#myTempId').find('.widget_content').hide();
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
            
            // remove "split values" part from the stats table
            //$('#'+dragCueId+' .row_to_delete').remove();
            
            // reactivate split value slider, manual change and swap
            splitValueSliderChangeSwapReactivate(dragCueId, myDataset, trueDataset);
            
            // replace the radio button with close button
            $('#'+dragCueId+' .criterion_class').remove(); // remove the radio button
            $('#'+dragCueId+' .criterion_label').remove(); // remove the radio button label
            $('#'+dragCueId+' .widget_head').append( htmlButtonClose() );  // add close button
            activateButtonExpand(dragCueId);  // reactivate EXPAND BUTTON - bug workaround
            activateButtonCloseCue(dragCueId); // activate close button

            // add "TREE up to this cue" statistics table
            $('#'+dragCueId+' .stats_header').text('THIS CUE');    // rename the table to "stats of this cue"
            $('#'+dragCueId+' .stat_cue_header').prepend( htmlButtonStat() ); // add the button "stats of"
            $('#'+dragCueId+' .stat_cue_header').append( htmlStatTreeUpToThisCue() ); // add the table "stats of the tree up to this cue"
            
            activateButtonStat(dragCueId);            // activate the button "stats of"
            
            // update JSON dataset for the analysis algorithms
            updateJsonDataset(dragTreeId);
            
            // show next tooltip
            console.log('TIP 4 or 5 or 18');
            if (tour.getCurrentStep()<=3) {
                tour.goTo(4);
            } else if (tour.getCurrentStep()<=4){
                tour.goTo(5);
            } else if (tour.getCurrentStep()<=17){
                tour.goTo(18);
            }
        },
        update: function (event,ui) {
            
            // get id of dragged cue
            dragCueId = ui.item.attr("id");
                                                
            // take care of the EXIT nodes
            //console.log('updateExitsAndArrowsForAllCues. dragTreeId: '+dragTreeId+' dragCueId:'+dragCueId);
            updateExitsAndArrowsForAllCues(dragTreeId, dragCueId);
                        
            // update JSON dataset for the analysis algorithms
            updateJsonDataset(dragTreeId);            
        }
    }).disableSelection();
}


function updateExitsAndArrowsForAllCues(myTreeId) {
    
    //var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    
    // get the last and ex-last cue
    var myTreeArray = $('#'+myTreeId).sortable('toArray');  // get the order of active tree
    myTreeArray = myTreeArray.filter(function(n){ return n != '' });  // remove empty elements in array
    //console.log('myTreeArray: '+myTreeArray);
    var myLastCueId = $(myTreeArray).get(-1);                     // get the last cue
    //var myExLastCueId = $(myTreeArray).get(-2);                     // get the exlast cue
    //console.log('myLastCueId: '+myLastCueId);
    //console.log('myExLastCueId: '+myExLastCueId);
    

    myTreeArray.forEach(function(myCueId){
        
        //console.log('UPDATE EXITS AN ARROWS myCueId: '+myCueId);
        //console.log('myLastCueId: '+myLastCueId);
        
        // do for each cue in the tree, except the last cue
        if (myCueId != myLastCueId) {
            
            // check if Exit nodes exist
            //var myExitLeftId = $('#'+myCueId+' .exit_left').attr('id');
            //var myExitRightId = $('#'+myCueId+' .exit_right').attr('id');
            // check if it has at both 'exit' values in hidden YES and NO fields
            //var myYesOld = $('#'+myCueId+' #hidden-exit_yes').val();
            //var myNoOld = $('#'+myCueId+' #hidden-exit_no').val();
            
            // check which EXIT nodes exist
            var myExitValues = getExitValues(myCueId, 'from updateExitsAndArrowsForAllCues, myTreeArray loop, if myCueId is last cue');   // returns .myLeft and .myRight
            
            // do only if the cue has both EXITS (used to be the last cue) or no EXITS (new cue)
            if ( (myExitValues.myLeft == myExitValues.myRight) ) {
                
                // set only one EXIT node according to the treeID: in tree0 exit-yes, in tree1 exit-no  
                var myExits = setExitDirection(myTreeId);
                setExitNodes(myCueId, myExits.myYes, myExits.myNo);
                
                // add close EXIT button to the Exit node
                $('#'+myCueId+' .exit_widget').append( htmlButtonSwitch(myExits.myExitClass) );  // add close button
                activateButtonSwitchExit(myCueId, myExits.myExitClass);
                
                // draw arrow to the next cue
                drawArrowToNextCue(myCueId, myExits.myYes, myExits.myNo);
            }
        // do for the last cue
        } else {
            // add the second EXIT node
            setExitNodes(myLastCueId, 'exit', 'exit');
            // remove CLOSE buttons from EXIT nodes of the last cue
            $('#'+myLastCueId+' .exit_widget .button_switch').remove();
            // remove the arrow to the next cue
            $('#'+myLastCueId+' .cue_arrow').remove();
        } 
    });
}
function drawArrowToNextCue(myCueId, myYes, myNo) {
    
    //get info about Exit nodes
    //var myExitLeftId = $('#'+myCueId+' .exit_left').attr('id');
    //var myExitRightId = $('#'+myCueId+' .exit_right').attr('id');
    //console.log('DRAW ARROW myCueId: '+myCueId);
    //console.log('myEes: '+myYes);
    //console.log('myNo: '+myNo);
    //var myYes = $('#'+myCueId+' #hidden-exit_yes').val();
    //var myNo = $('#'+myCueId+' #hidden-exit_no').val();  // we don't need that actually
    
    // depending on the existing EXIT nodes, choose the right label for the arrow "continue"
    if (myYes == 'exit' && myNo == 'continue') {  // double check if one of them is 'continue'
        var myLabelText = 'no';
    } else if (myYes == 'continue' && myNo == 'exit') {
        var myLabelText = 'yes';
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

function setExitDirection(myTreeId) {
    switch (myTreeId) {
        case 'tree0':
            var myYes = 'exit';
            var myNo = 'continue';
            var myExitClass = 'exit_right';
            break;
        case 'tree1':
            var myYes = 'continue';
            var myNo = 'exit';
            var myExitClass = 'exit_left';
            break;
    }
    return {
        myYes: myYes,
        myNo: myNo,
        myExitClass: myExitClass
    }
}

function setExitNodes(myCueId, myYes, myNo) {
    
    // check if Exit nodes exist
    var myExitLeftId = $('#'+myCueId+' .exit_left').attr('id');
    var myExitRightId = $('#'+myCueId+' .exit_right').attr('id');
    //console.log('myExitLeft: '+myExitLeftId);
    //console.log('myExitRight: '+myExitRightId);

    switch (myYes) {  // arrow YES goes to...
        case 'exit':                                        // if YES arrow should go to EXIT on RIGHT
            if (myExitRightId == undefined) {                // and if there is NO exit node on RIGHT
                addExitNode(myCueId, 'exit_right');    // creare the exit node on RIGHT
            }
        break;
        case 'continue':                                    // if YES arrow should go to the next cue
            if (myExitRightId != undefined) {                // and if there IS exit node to RIGHT
            removeExitNode(myCueId, 'exit_right');     // remove RIGHT exit node
            }
        break;
    }
    switch (myNo) {    // arrow NO goes to...
        case 'exit':                                        // if NO arrow should go to EXIT on LEFT
            if (myExitLeftId == undefined) {               // and if there is NO exit node on LEFT
                addExitNode(myCueId, 'exit_left');     // creare the exit node on LEFT
            }
        break;
        case 'continue':                                    // if NO arrow should go to the next cue
            if (myExitLeftId != undefined) {                // and if there IS exit node to LEFT
            removeExitNode(myCueId, 'exit_left');      // remove LEFT exit node
            }
        break;
    }
    
    // update the hidden values
    //$('#'+myCueId+' #hidden-exit_yes').val(myYes);  // FIX THIS!!!
    //$('#'+myCueId+' #hidden-exit_no').val(myNo);    // FIX THIS!!!
}

function addExitNode(myCueId, myExitClass) {
    //console.log('ADD EXIT NODE! '+myCueId+' '+myHiddenExitId);
    
    var myTreeId = $('#'+myCueId).closest('.trees').attr('id');
    var myTreeInt = getTreeInt(myTreeId);
    //console.log('EXIT myTreeId: '+myTreeId+' '+myTreeInt);
    
    //var myCriterionName = myJsonObj.trees[myTreeInt].criterion;
    
    
    switch(myExitClass) {
        case 'exit_left':
            //var myExitDir = 'exit_left';
            var myExitText = 'no';
            var myArrowHtml =  '<line x1="0" y1="45" x2="45" y2="0"/> \
                                <line x1="1" y1="25" x2="1" y2="44"/> \
                                <line x1="1" y1="44" x2="20" y2="44"/> \
                                <text x="15" y="25" stroke-width="1" stroke="none" fill="black">'+myExitText+'</text>';
            
            break;
        case 'exit_right':
            //var myExitDir = 'exit_right';
            var myExitText = 'yes';
            var myArrowHtml =  '<line x1="0" y1="0" x2="45" y2="45"/> \
                                <line x1="44" y1="25" x2="44" y2="44"/> \
                                <line x1="25" y1="44" x2="44" y2="44"/> \
                                <text x="17" y="25" stroke-width="1" stroke="none" fill="black">'+myExitText+'</text>';
            
            break;
    }
    
    c++; // prepare for the next dragCueId
    var myExitNodeId = 'exit_'+d+'-'+c;  // d - the same as cueID, c - unique for exit nodes
    
    var exitNode =  '<li id='+myExitNodeId+' class="'+myExitClass+' exit_widget unsortable"> \
                        '+htmlButtonSwitch(myExitClass)+' \
                        <div class="exit_widget_title"> \
                            <span>EXIT</span> \
                        </div> \
                        <svg class="exit_arrow" height="45" width="45"> \
                          '+myArrowHtml+' \
                        </svg> \
                    </li>';
    //$('#'+myCueId+' .exits').append(exitNode);
    $(exitNode).hide().appendTo('#'+myCueId+' .exits').fadeIn(300);
    
    // activate the EXIT close button
    activateButtonSwitchExit(myCueId, myExitClass);  // activate the close button
}
function getTreeInt(myTreeId) {
    var mySlice = myTreeId.slice(4,5);  // leave only the number e.g."1" in "cue1-0"
    var myInt = parseInt(mySlice);
    return myInt;
}
function removeExitNode (myCueId, myExitClass) {
    //console.log('REMOVE EXIT NODE: '+myCueId+' '+myHiddenExitId);
    //switch(myHiddenExitId) {
    //    case 'hidden-exit_yes':
    //        var myExitDir = 'exit_left';
    //        break;
    //    case 'hidden-exit_no':
    //        var myExitDir = 'exit_right';
    //        break;
    //}
    
    $('#'+myCueId+' .'+myExitClass ).remove();                                           // When sliding up has finished, remove widget from DOM
    
}
function switchExitDirection(myCueId, myExitClass) {
    
    //console.log('SWITCH EXIT DIRECTION! myCueId: '+myCueId);
    
    switch(myExitClass) {   // depending on which EXIT close button was clicked
        case 'exit_right':  
            setExitNodes(myCueId, 'continue', 'exit'); // yes , no
            drawArrowToNextCue(myCueId, 'continue', 'exit');  // redraw the arrow and the label to the next cue
            break;
        case 'exit_left':
            setExitNodes(myCueId, 'exit', 'continue'); // yes , no
            drawArrowToNextCue(myCueId, 'exit', 'continue');  // redraw the arrow and the label to the next cue
            break;
    }
}

function getExitValues(myCueId, cameFrom) {
    //console.log('FUNCTION getExitValues, came: '+cameFrom);
    
    // check if Exit nodes exist
    var myExitLeftId = $('#'+myCueId+' .exit_left').attr('id');
    var myExitRightId = $('#'+myCueId+' .exit_right').attr('id');
    
    //console.log('CHECK myCueId: '+myCueId+' myExitLeftId: '+myExitLeftId+' myExitRightId: '+myExitRightId);
    
    //alert('stop');
    
    if (myExitLeftId == myExitRightId) {   // if both or none EXIT nodes exist
        var myLeft = 'exit';
        var myRight = 'exit';
    } else {
        if (myExitLeftId != undefined) {  // if left EXIT node exists
            var myLeft = 'exit';
        } else {
            var myLeft = 'continue';
        }
        if (myExitRightId != undefined) {  // if right EXIT node exists
            var myRight = 'exit';
        } else {
            var myRight = 'continue';
        }
    }
    //console.log('CHECK myCueId: '+myCueId+' myLeft: '+myLeft+' myRight: '+myRight);
    
    return {
        myLeft: myLeft,
        myRight: myRight
    }
}

$(window).scroll(function(){
  $('#footer').css('left',394-$(window).scrollLeft());    // css position left: 394px
});

// Right at the very end of buildtree.js
//init();
