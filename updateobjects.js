// Makes and updates objects for statistics and JSON export 


function updateJsonDataset(myTreeId) {
        
    // get the order of the cues in the trees
    var myTreeCuesArray = $('#'+myTreeId).sortable('toArray');
    myTreeCuesArray = myTreeCuesArray.filter(function(n){ return n != "" });  // remove empty elements in array

    console.log('UDPDATE JSON! myTreeCuesArray: ' + myTreeCuesArray.toString());
    
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
        myTreeObj.criterion = Object.keys(myDataset.data[0])[getInt(criterCue)];  // get the name of criterion cue by id
    } else {
        myTreeObj.criterion = '';
    }
    
    myTreeObj.cues = [];
        
    for(var e = 0; e < myTreeCuesArray.length; e++) {    // go through the tree's elements
        
        var myCueObj = new Object();
        
        var myCueId = myTreeCuesArray[e];
        myCueObj.id = myCueId;
                
        console.log('myCueId: ' + myCueId);
        
        var myExitValues = getExitValues(myCueId, 'from createTreeObject, loop in myTreeCuesArray');
        console.log('myExitValues.myLeft: ' + myExitValues.myLeft);
        console.log('myExitValues.myRight: ' + myExitValues.myRight);
                
        if (myCueObj.id != undefined) { // if there is at least one cue
            
            myCueObj.name = getCueName(myCueId);  // getCueName(myCueId)
            //myCueObj.yes = getExitValue( myCueId, 'yes' );      // getExitValue(myCueId, myDir)
            myCueObj.yes = myExitValues.myLeft;   // returns .myLeft and .myRight
            //myCueObj.no = getExitValue( myCueId, 'no' );      // getExitValue(myCueId, myDir)
            myCueObj.no = myExitValues.myRight;   // returns .myLeft and .myRight
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
function getInt(myCueId) {
    var mySlice = myCueId.slice(3,4);  // leave only the number e.g."1" in "cue1-0"
    var myInt = parseInt(mySlice);
    return myInt;
}
function getCueName(myCueId) {
    //var myCueId = getCueId(myTreeId,myTreeElementId);
    if (myCueId != undefined) {
        var myInt = getInt(myCueId);
        var myName = Object.keys(myDataset.data[0])[myInt];
        //var myName = 'test';  // FOR TESTING!!!
    }
    return myName;
}
//function getExitValue(myCueId, myDir) {
//    //var myCueId = getCueId(myTreeId,myTreeElementId);
//    switch (myDir) {
//        case 'yes':
//            var myExit = $('#'+myCueId+' #hidden-exit_yes').val();
//        break;
//        case 'no':
//            var myExit = $('#'+myCueId+' #hidden-exit_no').val();
//        break;
//    }
//    return myExit;
//}

function updateStatisticsForSingleCues() {
    
    $('#cues_list .widget').each(function( index ) {

        var myCueId = $(this).attr('id');
        //console.log('SINGLECUE myCueId: '+myCueId);
      
        var myOneCueTreeObj = createTreeObj(myCueId, [myCueId]);
        //console.log('SINGLECUE myOneCueTreeObj: '+JSON.stringify(myOneCueTreeObj, null, "  ") );
    
        analyzeDataset(myOneCueTreeObj);
    });   
}