///<reference path="fftreeStatistics.ts" />
var Cue = (function () {
    function Cue(cuename, iscriterion, cuevalue, exitonyes, exitonno) {
        this.cuename = cuename;
        this.iscriterion = iscriterion;
        this.cuevalue = cuevalue;
        this.exitonyes = exitonyes;
        this.exitonno = exitonno;
        this.cueName = cuename;
        this.isCriterion = iscriterion;
        if (cuevalue !== undefined)
            this.cueValue = cuevalue;
        if (!iscriterion) {
            this.setDefaultExitStructure(exitonyes, exitonno);
        }
    }
    Cue.prototype.setDefaultExitStructure = function (exit_y, exit_n) {
        if (exit_y === undefined) {
            this.exitOnYes = (Math.random() <= 0.5) ? true : false;
            this.exitOnNo = !this.exitOnYes;
        }
        else {
            this.exitOnYes = exit_y;
        }
        if (exit_n === undefined) {
            if (this.exitOnYes === undefined) {
                this.exitOnNo = (Math.random() <= 0.5) ? true : false;
                this.exitOnYes != this.exitOnNo;
            }
            else {
                this.exitOnNo != this.exitOnYes;
            }
        }
        else {
            this.exitOnNo = exit_n;
        }
    };
    return Cue;
})();
var Tree = (function () {
    function Tree(criterion, cuelist) {
        this.criterion = criterion;
        this.cuelist = cuelist;
        this.treeCuesList = [];
        this.criterionCue = criterion;
        if (!(cuelist === null || cuelist === undefined))
            this.treeCuesList = cuelist;
    }
    Tree.prototype.addNode = function (cue) {
        if (this.treeCuesList.length > 0 && this.treeCuesList[this.treeCuesList.length - 1].exitOnYes && this.treeCuesList[this.treeCuesList.length - 1].exitOnNo) {
            alert("Last node has two exits, thus the tree is complete. Before adding a new cue, you need to remove the last cue or at least one exit of it.");
            return;
        }
        this.treeCuesList.push(cue);
    };
    Tree.prototype.finalize = function () {
        this.treeCuesList[this.treeCuesList.length - 1].exitOnYes = true;
        this.treeCuesList[this.treeCuesList.length - 1].exitOnNo = true;
    };
    return Tree;
})();
var DataRecord = (function () {
    function DataRecord(recordNumber, criterion, cues) {
        this.recordNumber = recordNumber;
        this.record = recordNumber;
        this.criterionCue = criterion;
        this.ordinaryCues = cues;
        this.cueByTreeEvaluation = [];
    }
    return DataRecord;
})();
var DataSet = (function () {
    function DataSet(criterionname, recordSet) {
        this.criterionname = criterionname;
        this.recordSet = recordSet;
        this.criterionName = criterionname;
        this.records = recordSet;
    }
    return DataSet;
})();
var CUELIST = [new Cue("Infarct", false), new Cue("ST", false), new Cue("CP", false), new Cue("OC", false), new Cue("PQ", false)];
var TREE;
var DATARECORDS;
var DATASET;
var STEPS = 0, HITS = 0, MISS = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
function initCueList() {
    CUELIST = [];
}
function addCueToList(cuename) {
    var cue = new Cue(cuename, false);
    if (CUELIST === null)
        initCueList();
    CUELIST.push(cue);
}
function setCueList(cues) {
    CUELIST = cues;
}
function createEmptyTree(criterion) {
    TREE = new Tree(criterion);
}
function addCueToTree(cue) {
    if (TREE === undefined) {
        alert("Tree is undefined. Create a new empty tree with a criterion first, then add cues.");
        return;
    }
    TREE.addNode(cue);
}
function removeCueFromTree(cuename) {
    var tmpCueList = [];
    TREE.treeCuesList.forEach(function (x) {
        if (x.cueName != cuename)
            tmpCueList.push(x);
    });
    TREE.treeCuesList = tmpCueList;
}
function finalizeTree() {
    TREE.finalize();
}
function getRandomBinary() {
    if (Math.random() <= 0.5)
        return 0;
    else
        return 1;
}
function importDataset(csvfilename, separator, ignoreCasesColumn, useCueNamesRow) {
    if (useCueNamesRow) {
    }
}
function createRandomTestDataset() {
    var randomCuesList;
    var randomCriterion;
    DATARECORDS = [];
    var num = parseInt(prompt("How many cases?"));
    for (var i = 1; i <= num; i++) {
        randomCuesList = [];
        for (var j = 0; j < CUELIST.length; j++) {
            if (CUELIST[j].cueName != TREE.criterionCue.cueName)
                randomCuesList.push(new Cue(CUELIST[j].cueName, false, getRandomBinary()));
        }
        randomCriterion = new Cue(TREE.criterionCue.cueName, true, getRandomBinary(), false, false);
        DATARECORDS.push(new DataRecord(i, randomCriterion, randomCuesList));
    }
    DATASET = new DataSet(randomCriterion.cueName, DATARECORDS);
}
function getCue(rec, name) {
    var foundCue = null;
    rec.ordinaryCues.forEach(function (c) {
        if (name === c.cueName) {
            foundCue = c;
            return;
        }
    });
    return foundCue;
}
function analyzeDataset() {
    var h = 0, m = 0, fa = 0, cr = 0;
    STEPS = 0, HITS = 0, MISS = 0, FALSE_ALARMS = 0, CORRECT_REJECTIONS = 0, UNDECIDED_POS = 0, UNDECIDED_NEG = 0;
    
    console.log('DATASET: ' + JSON.stringify(DATASET, null, "  "));
    
    console.log('TREE: ' + JSON.stringify(TREE, null, "  "));
    
    console.log('CUELIST: ' + JSON.stringify(CUELIST, null, "  "));
    
    // first count undecided cases
    DATASET.records.forEach(function (rec) {
        if (rec.criterionCue.cueValue === 1) {
            UNDECIDED_POS++;
            console.log('UNDECIDED_POS: ' + UNDECIDED_POS );
        } else {
            UNDECIDED_NEG++;
            console.log('UNDECIDED_NEG: ' + UNDECIDED_NEG );
        }
    });
    
    
    
    // for each record
    DATASET.records.forEach(function (rec) {
        // e.g. "0 0 1 0"
        // checks cues of the tree sequentially until record exits
        h = 0;
        m = 0;
        fa = 0;
        cr = 0;
        var innerStep = 0;
        rec.cueByTreeEvaluation = [];
        for (var c = 0; c <= TREE.treeCuesList.length - 1; c++) {
            innerStep++;
            // STEPS++;
            var stepInfo = "STEP " + innerStep.toString() + ": ";
            var recCue = getCue(rec, TREE.treeCuesList[c].cueName);
            if (recCue.cueValue === 0 && TREE.treeCuesList[c].exitOnNo === true) {
                stepInfo += "EXIT on " + recCue.cueName + " (Cue: 0 - ";
                if (rec.criterionCue.cueValue === 0) {
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
            else if (recCue.cueValue === 0 && TREE.treeCuesList[c].exitOnNo === false) {
                stepInfo += "CONTINUE on " + recCue.cueName + " (Exit: 1 - Cue: 0)";
            }
            else if (recCue.cueValue === 1 && TREE.treeCuesList[c].exitOnYes === true) {
                stepInfo += "EXIT on " + recCue.cueName + " (Cue: 1 - ";
                if (rec.criterionCue.cueValue === 0) {
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
                stepInfo += "CONTINUE on " + recCue.cueName + " (Exit: 0 - Cue: 1)";
            }
            rec.cueByTreeEvaluation.push(stepInfo);
        }
        HITS += h;
        MISS += m;
        CORRECT_REJECTIONS += cr;
        FALSE_ALARMS += fa;
    });
}
//# sourceMappingURL=fftree.js.map