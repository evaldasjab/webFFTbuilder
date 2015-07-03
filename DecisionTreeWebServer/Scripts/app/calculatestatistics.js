// Calculates statistics and displays in the tables

function analyzeDataset(myTreeObj) {
    //console.log('ANALYSE!!! myTreeObj: ' + JSON.stringify(myTreeObj, null, "  "));
    
    var h = 0, m = 0, fa = 0, cr = 0;
    STEPS = 0, HITS = 0, MISS = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    
    var myTreeId = myTreeObj.tree;
    
    var myCriterionName = myTreeObj.criterion;
    //var myCriterionName = myJsonObj.trees[0].criterion;
    //console.log('myCriterCueId: '+myCriterionName);
    
    var DATASET = {};
    DATASET.records = myData;
    //console.log('DATASET: '+ JSON.stringify(DATASET, null, "  "));
    
    var TREE = {};
    TREE.treeCuesList = myTreeObj.cues;
    //TREE.treeCuesList = myJsonObj.trees[0].cues;
    //console.log('TREE.treeCuesList: ' + JSON.stringify(TREE.treeCuesList, null, "  "));
    
    //console.log('STAT myJsonObj: ' + JSON.stringify(myJsonObj, null, "  "));

    //var myList = TREE.treeCuesListAll.filter(function(n){ return n });  // remove empty elements in array
    //console.log('TREE.treeCuesList: '+ JSON.stringify(TREE.treeCuesList, null, "  "));
    //console.log('TREE.treeCuesList.length: '+ JSON.stringify(TREE.treeCuesList.length, null, "  "));
        
    DATASET.records.forEach(function (rec) {
                    
        // first count undecided cases
        if (rec[myCriterionName] === 1)
            UNDECIDED_POS++;
        else if (rec[myCriterionName] === 0) 
            UNDECIDED_NEG++;
    });
    
    var mySplitValuesArray = myDataset.split_values;
    
    // for each record
    DATASET.records.forEach(function (rec) {
        
        //console.log('DATASET LOOP rec: '+ JSON.stringify(rec, null, "  "));
        
        // e.g. "0 0 1 0"
        // checks cues of the tree sequentially until record exits
        h = 0;
        m = 0;
        fa = 0;
        cr = 0;
        var innerStep = 0;
        rec.cueByTreeEvaluation = [];
        
        for (var c = 0; c < TREE.treeCuesList.length; c++) {
        
            var treeCue = TREE.treeCuesList[c].name;
            //console.log('TREE LOOP treeCue: '+treeCue);
            
            // find in the array the object by the key
            var foundObjectsByKey = $.grep(mySplitValuesArray, function(e){ return e.name == treeCue; });
            var mySplitObj = foundObjectsByKey[0];
            //console.log('HERE: '+JSON.stringify(mySplitObj, null, "  "));
            TREE.treeCuesList[c].minValue = mySplitObj.min;
            TREE.treeCuesList[c].maxValue = mySplitObj.max;
            TREE.treeCuesList[c].splitValue = mySplitObj.split;
            TREE.treeCuesList[c].isFlipped = !mySplitObj.minisno_maxisyes;   // reverse true to false
            
            innerStep++;
            // STEPS++;
            var stepInfo = "STEP " + innerStep.toString() + ": ";
            
            var recCueValue = rec[treeCue];
            
            if (recCueValue === 0 && TREE.treeCuesList[c].no == 'exit') {
                stepInfo += "EXIT on " + treeCue + " (Cue: 0 - ";
                if (rec[myCriterionName] === 0) {
                    cr = 1;
                    UNDECIDED_NEG--;
                    stepInfo += "Criterion: 0 => CORRECT REJECTION)";
                    TREE.treeCuesList[c].corr++; // for the cue, count correct rejection cases
                }
                else {
                    m = 1;
                    UNDECIDED_POS--;
                    stepInfo += "Criterion: 1 => MISS)";
                    TREE.treeCuesList[c].miss++;  // for the cue, count miss cases
                }
                rec.cueByTreeEvaluation.push(stepInfo);
                STEPS += innerStep;
                TREE.treeCuesList[c].step += innerStep;  // for the cue, count steps
                break;
            }
            else if (recCueValue === 0 && TREE.treeCuesList[c].no === 'continue') {
                stepInfo += "CONTINUE on " + treeCue + " (Exit: 1 - Cue: 0)";
                if (rec[myCriterionName] === 1) // for the cue, count undecided cases, split to positive and negative (by criterion value)
                    TREE.treeCuesList[c].un_p++;
                else
                    TREE.treeCuesList[c].un_n++;
            }
            else if (recCueValue === 1 && TREE.treeCuesList[c].yes === 'exit') {
                stepInfo += "EXIT on " + treeCue + " (Cue: 1 - ";
                if (rec[myCriterionName] === 0) {
                    fa = 1;
                    UNDECIDED_NEG--;
                    stepInfo += "Criterion: 0 => FALSE ALARM)";
                    TREE.treeCuesList[c].fals++; // for the cue, count false alarm cases
                }
                else {
                    h = 1;
                    UNDECIDED_POS--;
                    stepInfo += "Criterion: 1 => HIT)";
                    TREE.treeCuesList[c].hits++; // for the cue, count hit cases
                }
                rec.cueByTreeEvaluation.push(stepInfo);
                STEPS += innerStep;
                TREE.treeCuesList[c].step += innerStep;  // for the cue, count steps
                break;
            }
            else {
                stepInfo += "CONTINUE on " + treeCue + " (Exit: 0 - Cue: 1)";
                if (rec[myCriterionName] === 1) // for the cue, count undecided cases, split to positive and negative (by criterion value)
                    TREE.treeCuesList[c].un_p++;
                else
                    TREE.treeCuesList[c].un_n++;
            }
            rec.cueByTreeEvaluation.push(stepInfo);
            
            // save the statistics for the update of individual cues
            //var myCueId = $([name=treeCue]).attr('id');
            //console.log('GET myCueId BY NAME: '+myCueId);
        }
        //console.log('rec.cueByTreeEvaluation: ' + JSON.stringify(rec.cueByTreeEvaluation, null, "  "));
        
        //console.log('END OF TREE LOOP TREE.treeCuesList: ' + JSON.stringify(TREE.treeCuesList, null, "  "));
        
        HITS += h;
        MISS += m;
        CORRECT_REJECTIONS += cr;
        FALSE_ALARMS += fa;
        
        //console.log('REC HITS: ' + JSON.stringify(HITS, null, "  "));
        //console.log('REC MISS: ' + JSON.stringify(MISS, null, "  "));
        //console.log('REC CORRECT_REJECTIONS: ' + JSON.stringify(CORRECT_REJECTIONS, null, "  "));
        //console.log('REC FALSE_ALARMS: ' + JSON.stringify(FALSE_ALARMS, null, "  "));
        //console.log('REC UNDECIDED_POS: ' + JSON.stringify(UNDECIDED_POS, null, "  "));
        //console.log('REC UNDECIDED_NEG: ' + JSON.stringify(UNDECIDED_NEG, null, "  "));
        
        //alert("ONE CUE DONE! myCueName: "+treeCue); 
    });
    
    //console.log('TREE HITS: ' + JSON.stringify(HITS, null, "  "));
    //console.log('TREE MISS: ' + JSON.stringify(MISS, null, "  "));
    //console.log('TREE CORRECT_REJECTIONS: ' + JSON.stringify(CORRECT_REJECTIONS, null, "  "));
    //console.log('TREE FALSE_ALARMS: ' + JSON.stringify(FALSE_ALARMS, null, "  "));
    //console.log('TREE UNDECIDED_POS: ' + JSON.stringify(UNDECIDED_POS, null, "  "));
    //console.log('TREE UNDECIDED_NEG: ' + JSON.stringify(UNDECIDED_NEG, null, "  "));
    
    getDerivativeStatistics();
    
    updateAnalysisView(myTreeId);
    
    // do it only for the tree analysis (not individual cues in the cue list)
    if ( (myTreeId=='tree0') || (myTreeId=='tree1') ) {
        
        updateAnalysisView('stat_'+myTreeId);
        
        // calculate and display statistics for the cues in the tree
        for (var c = 0; c < TREE.treeCuesList.length; c++) {
            
            var myCueId = TREE.treeCuesList[c].id;
            //console.log('TREE CUE myCueId:'+myCueId);
            
            HITS = TREE.treeCuesList[c].hits;
            MISS = TREE.treeCuesList[c].miss;
            FALSE_ALARMS = TREE.treeCuesList[c].fals;
            CORRECT_REJECTIONS = TREE.treeCuesList[c].corr;
            UNDECIDED_POS = TREE.treeCuesList[c].un_p;
            UNDECIDED_NEG = TREE.treeCuesList[c].un_n;
            STEPS = TREE.treeCuesList[c].step;
            
            getDerivativeStatistics();
        
            updateAnalysisView(myCueId);
            
            if (c==0) {
                // update statistics of the tree up to the FIRST cue
                treeHITS = HITS;
                treeMISS = MISS;
                treeFALSE_ALARMS = FALSE_ALARMS;
                treeCORRECT_REJECTIONS = CORRECT_REJECTIONS;
                treeUNDECIDED_POS = UNDECIDED_POS;
                treeUNDECIDED_NEG = UNDECIDED_NEG;
                treeSTEPS = STEPS;
            } else {
                // update statistics of the tree up to OTHER cues
                treeHITS = treeHITS + HITS;
                treeMISS = treeMISS + MISS;
                treeFALSE_ALARMS = treeFALSE_ALARMS + FALSE_ALARMS;
                treeCORRECT_REJECTIONS = treeCORRECT_REJECTIONS + CORRECT_REJECTIONS;
                treeUNDECIDED_POS = UNDECIDED_POS;
                treeUNDECIDED_NEG = UNDECIDED_NEG;
                treeSTEPS = treeSTEPS + STEPS;
            }
            
            STEPS = treeSTEPS;
            HITS = treeHITS;
            MISS = treeMISS;
            FALSE_ALARMS = treeFALSE_ALARMS;
            CORRECT_REJECTIONS = treeCORRECT_REJECTIONS;
            UNDECIDED_POS = treeUNDECIDED_POS;
            UNDECIDED_NEG = treeUNDECIDED_NEG;
            
            getDerivativeStatistics();
            
            updateAnalysisView(myCueId+' .stat_tree');
        }
    }   
}

function getDerivativeStatistics() {
    
    CRIT_YES_SUM = HITS + MISS + UNDECIDED_POS;
    CRIT_NO_SUM = FALSE_ALARMS + CORRECT_REJECTIONS + UNDECIDED_NEG;
    
    PRED_YES_SUM = HITS + FALSE_ALARMS;
    PRED_NO_SUM = MISS + CORRECT_REJECTIONS;
    PRED_UND_SUM = UNDECIDED_POS + UNDECIDED_NEG;
    PRED_SUM_SUM = CRIT_YES_SUM + CRIT_NO_SUM;
    
    var ts = new TreeStatistics();
    ts.setHitCount(HITS);
    ts.setMissCount(MISS);
    ts.setFaCount(FALSE_ALARMS);
    ts.setCrCount(CORRECT_REJECTIONS);
    ts.setStepsSum(STEPS);
    
    PHITS = Math.round(ts.getHitsProbability() * 1000) / 1000;
    PFA = Math.round(ts.getFalseAlarmsProbability() * 1000) / 1000;
    PHITSMINUSPFA = Math.round((PHITS - PFA) * 1000) / 1000;
    DPRIME = Math.round(ts.getDPrime() * 1000) / 1000;
    FRUGALITY = Math.round(ts.frugality() * 1000) / 1000;
    APRIME = Math.round(ts.getAPrime() * 1000) / 1000;
    BPRIME = Math.round(ts.getBPrime() * 1000) / 1000;
    BDPRIME = Math.round(ts.getBDoublePrime() * 1000) / 1000;
    BIAS = Math.round(ts.getBias() * 1000) / 1000;
}

function resetTreeStatistics() {
    
    STEPS = 0;
    HITS = 'Hit';
    MISS = 'Miss';
    FALSE_ALARMS = 'FA';
    CORRECT_REJECTIONS = 'CR';
    UNDECIDED_POS = 0;
    UNDECIDED_NEG = 0;
    CRIT_YES_SUM = 0;
    CRIT_NO_SUM = 0;
    PRED_YES_SUM = 0;
    PRED_NO_SUM = 0;
    PRED_UND_SUM = 0;
    PRED_SUM_SUM = 0;
    PHITS = 0;
    PFA = 0;
    PHITSMINUSPFA = 0;
    DPRIME = 0;
    FRUGALITY = 0;
    APRIME = 0;
    BPRIME = 0;
    BDPRIME = 0;
    BIAS = 0;
    
    updateAnalysisView('stat_tree0');
    updateAnalysisView('stat_tree1');
}

function resetDerivativeView(myId) {
    
    $('#'+myId+' #pHits').text('0');
    $('#'+myId+' #pFA').text('0');
    $('#'+myId+' #pHitsMinuspFA').text('0');
    $('#'+myId+' #dprime').text('0');
    $('#'+myId+' #frugality').text('0');
    $('#'+myId+' #aprime').text('0');
    $('#'+myId+' #bprime').text('0');
    $('#'+myId+' #bdprime').text('0');
    $('#'+myId+' #bias').text('0');
}

function updateAnalysisView(myId) {
    
    //alert('updateAnalysisView: '+myId);
    
    $('#'+myId+' #hits').text(HITS.toString());
    $('#'+myId+' #misses').text(MISS.toString());
    $('#'+myId+' #falsealarms').text(FALSE_ALARMS.toString());
    $('#'+myId+' #correctrejections').text(CORRECT_REJECTIONS.toString());
    $('#'+myId+' #undecided_pos').text(UNDECIDED_POS.toString());
    $('#'+myId+' #undecided_neg').text(UNDECIDED_NEG.toString());
    $('#'+myId+' #crit_yes_sum').text(CRIT_YES_SUM.toString());
    $('#'+myId+' #crit_no_sum').text(CRIT_NO_SUM.toString());
    $('#'+myId+' #pred_yes_sum').text(PRED_YES_SUM.toString());
    $('#'+myId+' #pred_no_sum').text(PRED_NO_SUM.toString());
    $('#'+myId+' #pred_und_sum').text(PRED_UND_SUM.toString());
    $('#'+myId+' #pred_sum_sum').text(PRED_SUM_SUM.toString());

    $('#'+myId+' #pHits').text(PHITS.toString());
    $('#'+myId+' #pFA').text(PFA.toString());
    $('#'+myId+' #pHitsMinuspFA').text(PHITSMINUSPFA.toString());
    $('#'+myId+' #dprime').text(DPRIME.toString());
    $('#'+myId+' #frugality').text(FRUGALITY.toString());
    $('#'+myId+' #aprime').text(APRIME.toString());
    $('#'+myId+' #bprime').text(BPRIME.toString());
    $('#'+myId+' #bdprime').text(BDPRIME.toString());
    $('#'+myId+' #bias').text(BIAS.toString());
}
