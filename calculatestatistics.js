
function analyzeDataset(myTreeObj) {
    //console.log('ANALYSE!!! myTreeObj: ' + JSON.stringify(myTreeObj, null, "  "));
    
    var h = 0, m = 0, fa = 0, cr = 0;
    STEPS = 0, HITS = 0, MISS = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    
    var myTreeId = myTreeObj.tree;
    
    var myCriterionName = myTreeObj.criterion;
    //var myCriterionName = myJsonObj.trees[0].criterion;
    //console.log('myCriterCueId: '+myCriterionName);
    
    var DATASET = {};
    DATASET.records = myDataset.data;
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
        else
            UNDECIDED_NEG++;
    });
    
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
    
    CRIT_YES_SUM = HITS + MISS + UNDECIDED_POS;
    CRIT_NO_SUM = FALSE_ALARMS + CORRECT_REJECTIONS + UNDECIDED_NEG;
    
    PRED_YES_SUM = HITS + FALSE_ALARMS;
    PRED_NO_SUM = MISS + CORRECT_REJECTIONS;
    PRED_UND_SUM = UNDECIDED_POS + UNDECIDED_NEG;
    PRED_SUM_SUM = CRIT_YES_SUM + CRIT_NO_SUM;
    
    updateAnalysisView('stat_'+myTreeId);
    
    // do it only for the tree analysis (not individual cues in the cue list)
    if ( (myTreeId=='tree0') || (myTreeId=='tree1') ) {
       
        for (var c = 0; c < TREE.treeCuesList.length; c++) {
            
            var myCueId = TREE.treeCuesList[c].id;
            //console.log('TREE CUE myCueId:'+myCueId);
            
            myHITS = TREE.treeCuesList[c].hits;
            myMISS = TREE.treeCuesList[c].miss;
            myFALSE_ALARMS = TREE.treeCuesList[c].fals;
            myCORRECT_REJECTIONS = TREE.treeCuesList[c].corr;
            myUNDECIDED_POS = TREE.treeCuesList[c].un_p;
            myUNDECIDED_NEG = TREE.treeCuesList[c].un_n;
            mySTEPS = TREE.treeCuesList[c].step;
            
            myCRIT_YES_SUM = myHITS + myMISS + myUNDECIDED_POS;
            myCRIT_NO_SUM = myFALSE_ALARMS + myCORRECT_REJECTIONS + myUNDECIDED_NEG;
            
            myPRED_YES_SUM = myHITS + myFALSE_ALARMS;
            myPRED_NO_SUM = myMISS + myCORRECT_REJECTIONS;
            myPRED_UND_SUM = myUNDECIDED_POS + myUNDECIDED_NEG;
            myPRED_SUM_SUM = myCRIT_YES_SUM + myCRIT_NO_SUM;
        
            updateCueAnalysis(myCueId);
            
            if (c==0) {
                // update statistics of the tree up to the FIRST cue
                myTreeHITS = myHITS;
                myTreeMISS = myMISS;
                myTreeFALSE_ALARMS = myFALSE_ALARMS;
                myTreeCORRECT_REJECTIONS = myCORRECT_REJECTIONS;
                myTreeUNDECIDED_POS = myUNDECIDED_POS;
                myTreeUNDECIDED_NEG = myUNDECIDED_NEG;
                myTreeSTEPS = mySTEPS;
            } else {
                // update statistics of the tree up to OTHER cues
                myTreeHITS = myTreeHITS + myHITS;
                myTreeMISS = myTreeMISS + myMISS;
                myTreeFALSE_ALARMS = myTreeFALSE_ALARMS + myFALSE_ALARMS;
                myTreeCORRECT_REJECTIONS = myTreeCORRECT_REJECTIONS + myCORRECT_REJECTIONS;
                myTreeUNDECIDED_POS = myUNDECIDED_POS;
                myTreeUNDECIDED_NEG = myUNDECIDED_NEG;
                myTreeSTEPS = myTreeSTEPS + mySTEPS;
            }
            
            myTreeCRIT_YES_SUM = myTreeHITS + myTreeMISS + myTreeUNDECIDED_POS;
            myTreeCRIT_NO_SUM = myTreeFALSE_ALARMS + myTreeCORRECT_REJECTIONS + myTreeUNDECIDED_NEG;
            
            myTreePRED_YES_SUM = myTreeHITS + myTreeFALSE_ALARMS;
            myTreePRED_NO_SUM = myTreeMISS + myTreeCORRECT_REJECTIONS;
            myTreePRED_UND_SUM = myTreeUNDECIDED_POS + myTreeUNDECIDED_NEG;
            myTreePRED_SUM_SUM = myTreeCRIT_YES_SUM + myTreeCRIT_NO_SUM;
            
            updateTreeUpToThisCueAnalysis(myCueId);
        }
    }
    
}



function updateAnalysisView(myId) {
    
    $('#'+myId+' #hits').text(HITS.toString());
    $('#'+myId+' #misses').text(MISS.toString());
    $('#'+myId+' #falsealarms').text(FALSE_ALARMS.toString())
    $('#'+myId+' #correctrejections').text(CORRECT_REJECTIONS.toString())
    $('#'+myId+' #undecided_pos').text(UNDECIDED_POS.toString())
    $('#'+myId+' #undecided_neg').text(UNDECIDED_NEG.toString())
    $('#'+myId+' #crit_yes_sum').text(CRIT_YES_SUM.toString())
    $('#'+myId+' #crit_no_sum').text(CRIT_NO_SUM.toString())
    $('#'+myId+' #pred_yes_sum').text(PRED_YES_SUM.toString())
    $('#'+myId+' #pred_no_sum').text(PRED_NO_SUM.toString())
    $('#'+myId+' #pred_und_sum').text(PRED_UND_SUM.toString())
    $('#'+myId+' #pred_sum_sum').text(PRED_SUM_SUM.toString())
    
    var ts = new TreeStatistics();
    ts.setHitCount(HITS);
    ts.setMissCount(MISS);
    ts.setFaCount(FALSE_ALARMS);
    ts.setCrCount(CORRECT_REJECTIONS);
    ts.setStepsSum(STEPS);
    
    $('#'+myId+' #pHits').text((Math.round(ts.getHitsProbability() * 1000) / 1000).toString());
    $('#'+myId+' #pFA').text((Math.round(ts.getFalseAlarmsProbability() * 1000) / 1000).toString());
    $('#'+myId+' #dprime').text((Math.round(ts.getDPrime() * 1000) / 1000).toString());
    $('#'+myId+' #frugality').text((Math.round(ts.frugality() * 1000) / 1000).toString());
    $('#'+myId+' #aprime').text((Math.round(ts.getAPrime() * 1000) / 1000).toString());
    $('#'+myId+' #bprime').text((Math.round(ts.getBPrime() * 1000) / 1000).toString());
    $('#'+myId+' #bdprime').text((Math.round(ts.getBDoublePrime() * 1000) / 1000).toString());
    $('#'+myId+' #bias').text((Math.round(ts.getBias() * 1000) / 1000).toString());
}

function updateCueAnalysis(myId) {
    
    $('#'+myId+' #hits').text(myHITS.toString());
    $('#'+myId+' #misses').text(myMISS.toString());
    $('#'+myId+' #falsealarms').text(myFALSE_ALARMS.toString())
    $('#'+myId+' #correctrejections').text(myCORRECT_REJECTIONS.toString())
    $('#'+myId+' #undecided_pos').text(myUNDECIDED_POS.toString())
    $('#'+myId+' #undecided_neg').text(myUNDECIDED_NEG.toString())
    $('#'+myId+' #crit_yes_sum').text(myCRIT_YES_SUM.toString())
    $('#'+myId+' #crit_no_sum').text(myCRIT_NO_SUM.toString())
    $('#'+myId+' #pred_yes_sum').text(myPRED_YES_SUM.toString())
    $('#'+myId+' #pred_no_sum').text(myPRED_NO_SUM.toString())
    $('#'+myId+' #pred_und_sum').text(myPRED_UND_SUM.toString())
    $('#'+myId+' #pred_sum_sum').text(myPRED_SUM_SUM.toString())
    
    var ts = new TreeStatistics();
    ts.setHitCount(myHITS);
    ts.setMissCount(myMISS);
    ts.setFaCount(myFALSE_ALARMS);
    ts.setCrCount(myCORRECT_REJECTIONS);
    ts.setStepsSum(mySTEPS);
    
    $('#'+myId+' #pHits').text((Math.round(ts.getHitsProbability() * 1000) / 1000).toString());
    $('#'+myId+' #pFA').text((Math.round(ts.getFalseAlarmsProbability() * 1000) / 1000).toString());
    $('#'+myId+' #dprime').text((Math.round(ts.getDPrime() * 1000) / 1000).toString());
    $('#'+myId+' #frugality').text((Math.round(ts.frugality() * 1000) / 1000).toString());
    $('#'+myId+' #aprime').text((Math.round(ts.getAPrime() * 1000) / 1000).toString());
    $('#'+myId+' #bprime').text((Math.round(ts.getBPrime() * 1000) / 1000).toString());
    $('#'+myId+' #bdprime').text((Math.round(ts.getBDoublePrime() * 1000) / 1000).toString());
    $('#'+myId+' #bias').text((Math.round(ts.getBias() * 1000) / 1000).toString());
}

function updateTreeUpToThisCueAnalysis(myId) {
    
    $('#'+myId+' .stat_tree #hits').text(myTreeHITS.toString());
    $('#'+myId+' .stat_tree #misses').text(myTreeMISS.toString());
    $('#'+myId+' .stat_tree #falsealarms').text(myTreeFALSE_ALARMS.toString())
    $('#'+myId+' .stat_tree #correctrejections').text(myTreeCORRECT_REJECTIONS.toString())
    $('#'+myId+' .stat_tree #undecided_pos').text(myTreeUNDECIDED_POS.toString())
    $('#'+myId+' .stat_tree #undecided_neg').text(myTreeUNDECIDED_NEG.toString())
    $('#'+myId+' .stat_tree #crit_yes_sum').text(myTreeCRIT_YES_SUM.toString())
    $('#'+myId+' .stat_tree #crit_no_sum').text(myTreeCRIT_NO_SUM.toString())
    $('#'+myId+' .stat_tree #pred_yes_sum').text(myTreePRED_YES_SUM.toString())
    $('#'+myId+' .stat_tree #pred_no_sum').text(myTreePRED_NO_SUM.toString())
    $('#'+myId+' .stat_tree #pred_und_sum').text(myTreePRED_UND_SUM.toString())
    $('#'+myId+' .stat_tree #pred_sum_sum').text(myTreePRED_SUM_SUM.toString())
    
    var ts = new TreeStatistics();
    ts.setHitCount(myTreeHITS);
    ts.setMissCount(myTreeMISS);
    ts.setFaCount(myTreeFALSE_ALARMS);
    ts.setCrCount(myTreeCORRECT_REJECTIONS);
    ts.setStepsSum(myTreeSTEPS);
    
    $('#'+myId+' .stat_tree #pHits').text((Math.round(ts.getHitsProbability() * 1000) / 1000).toString());
    $('#'+myId+' .stat_tree #pFA').text((Math.round(ts.getFalseAlarmsProbability() * 1000) / 1000).toString());
    $('#'+myId+' .stat_tree #dprime').text((Math.round(ts.getDPrime() * 1000) / 1000).toString());
    $('#'+myId+' .stat_tree #frugality').text((Math.round(ts.frugality() * 1000) / 1000).toString());
    $('#'+myId+' .stat_tree #aprime').text((Math.round(ts.getAPrime() * 1000) / 1000).toString());
    $('#'+myId+' .stat_tree #bprime').text((Math.round(ts.getBPrime() * 1000) / 1000).toString());
    $('#'+myId+' .stat_tree #bdprime').text((Math.round(ts.getBDoublePrime() * 1000) / 1000).toString());
    $('#'+myId+' .stat_tree #bias').text((Math.round(ts.getBias() * 1000) / 1000).toString());
}