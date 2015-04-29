
function analyzeDataset() {
    console.log('ANALYSE!!!');
    
    var h = 0, m = 0, fa = 0, cr = 0;
    STEPS = 0, HITS = 0, MISS = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    
    var myCriterionName = myJsonObj.trees[0].criterion;
    //console.log('myCriterCueId: '+myCriterionName);
    
    var DATASET = {};
    DATASET.records = mydata.data;
    //console.log('DATASET: '+ JSON.stringify(DATASET, null, "  "));
    
    var TREE = {};
    TREE.treeCuesList = myJsonObj.trees[0].cues;
    
    //console.log('STAT myJsonObj: ' + JSON.stringify(myJsonObj, null, "  "));

    //var myList = TREE.treeCuesListAll.filter(function(n){ return n });  // remove empty elements in array
    //console.log('TREE.treeCuesList: '+ JSON.stringify(TREE.treeCuesList, null, "  "));
    //console.log('TREE.treeCuesList.length: '+ JSON.stringify(TREE.treeCuesList.length, null, "  "));
    
    // first count undecided cases
    DATASET.records.forEach(function (rec) {
        if (rec[myCriterionName] === 1)
            UNDECIDED_POS++;
        else
            UNDECIDED_NEG++;
    });
    // for each record
    DATASET.records.forEach(function (rec) {
        
        //console.log('rec: '+ JSON.stringify(rec, null, "  "));
        
        // e.g. "0 0 1 0"
        // checks cues of the tree sequentially until record exits
        h = 0;
        m = 0;
        fa = 0;
        cr = 0;
        var innerStep = 0;
        rec.cueByTreeEvaluation = [];
        for (var c = 0; c < TREE.treeCuesList.length; c++) {
            innerStep++;
            // STEPS++;
            var stepInfo = "STEP " + innerStep.toString() + ": ";
            var treeCue = TREE.treeCuesList[c].name;
            var recCueValue = rec[treeCue];
            
            if (recCueValue === 0 && TREE.treeCuesList[c].no == 'exit') {
                stepInfo += "EXIT on " + treeCue + " (Cue: 0 - ";
                if (rec[myCriterionName] === 0) {
                    cr = 1;
                    UNDECIDED_NEG--;
                    stepInfo += "Criterion: 0 => CORRECT REJECTION)";
                }
                else {
                    m = 1;
                    UNDECIDED_POS--;
                    stepInfo += "Criterion: 1 => MISS)";
                }
                rec.cueByTreeEvaluation.push(stepInfo);
                STEPS += innerStep;
                break;
            }
            else if (recCueValue === 0 && TREE.treeCuesList[c].no === 'continue') {
                stepInfo += "CONTINUE on " + treeCue + " (Exit: 1 - Cue: 0)";
            }
            else if (recCueValue === 1 && TREE.treeCuesList[c].yes === 'exit') {
                stepInfo += "EXIT on " + treeCue + " (Cue: 1 - ";
                if (rec[myCriterionName] === 0) {
                    fa = 1;
                    UNDECIDED_NEG--;
                    stepInfo += "Criterion: 0 => FALSE ALARM)";
                }
                else {
                    h = 1;
                    UNDECIDED_POS--;
                    stepInfo += "Criterion: 1 => HIT)";
                }
                rec.cueByTreeEvaluation.push(stepInfo);
                STEPS += innerStep;
                break;
            }
            else {
                stepInfo += "CONTINUE on " + treeCue + " (Exit: 0 - Cue: 1)";
            }
            rec.cueByTreeEvaluation.push(stepInfo);
        }
        //console.log('rec.cueByTreeEvaluation: ' + JSON.stringify(rec.cueByTreeEvaluation, null, "  "));
        
        HITS += h;
        MISS += m;
        CORRECT_REJECTIONS += cr;
        FALSE_ALARMS += fa;
    });
    console.log('HITS: ' + JSON.stringify(HITS, null, "  "));
    console.log('MISS: ' + JSON.stringify(MISS, null, "  "));
    console.log('CORRECT_REJECTIONS: ' + JSON.stringify(CORRECT_REJECTIONS, null, "  "));
    console.log('FALSE_ALARMS: ' + JSON.stringify(FALSE_ALARMS, null, "  "));
    
    CRIT_YES_SUM = HITS + CORRECT_REJECTIONS;
    CRIT_NO_SUM = MISS + FALSE_ALARMS;
    CRIT_UND_SUM = UNDECIDED_POS + UNDECIDED_NEG;
    
    updateAnalysisView();
}

function updateAnalysisView() {
    //$('.treestats #hits').text(HITS.toString());
    document.getElementById("hits").textContent = HITS.toString();
    document.getElementById("misses").textContent = MISS.toString();
    document.getElementById("falsealarms").textContent = FALSE_ALARMS.toString();
    document.getElementById("correctrejections").textContent = CORRECT_REJECTIONS.toString();
    document.getElementById("undecided_pos").textContent = UNDECIDED_POS.toString();
    document.getElementById("undecided_neg").textContent = UNDECIDED_NEG.toString();
    document.getElementById("crit-yes-sum").textContent = CRIT_YES_SUM.toString();
    document.getElementById("crit-no-sum").textContent = CRIT_NO_SUM.toString();
    document.getElementById("crit-und-sum").textContent = CRIT_UND_SUM.toString();
    
    var ts = new TreeStatistics();
    ts.setHitCount(HITS);
    ts.setMissCount(MISS);
    ts.setFaCount(FALSE_ALARMS);
    ts.setCrCount(CORRECT_REJECTIONS);
    ts.setStepsSum(STEPS);
    document.getElementById("pHits").textContent = (Math.round(ts.getHitsProbability() * 1000) / 1000).toString();
    document.getElementById("pFA").textContent = (Math.round(ts.getFalseAlarmsProbability() * 1000) / 1000).toString();
    document.getElementById("dprime").textContent = (Math.round(ts.getDPrime() * 1000) / 1000).toString();
    document.getElementById("frugality").textContent = (Math.round(ts.frugality() * 1000) / 1000).toString();
    document.getElementById("aprime").textContent = (Math.round(ts.getAPrime() * 1000) / 1000).toString();
    document.getElementById("bprime").textContent = (Math.round(ts.getBPrime() * 1000) / 1000).toString();
    document.getElementById("bdprime").textContent = (Math.round(ts.getBDoublePrime() * 1000) / 1000).toString();
    document.getElementById("bias").textContent = (Math.round(ts.getBias() * 1000) / 1000).toString();
}