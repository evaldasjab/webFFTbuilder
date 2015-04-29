function resetAll() {
    TREE = null;
    if (DATASET != undefined)
        DATASET = undefined;
    document.getElementById("treeinfo").innerHTML = "";
    document.getElementById("datasetinfo").innerHTML = "";
    document.getElementById("chkCue1").checked = false;
    document.getElementById("chkCue1").disabled = false;
    document.getElementById("chkCue2").checked = false;
    document.getElementById("chkCue2").disabled = false;
    document.getElementById("chkCue3").checked = false;
    document.getElementById("chkCue3").disabled = false;
    document.getElementById("chkCue4").checked = false;
    document.getElementById("chkCue4").disabled = false;
    document.getElementById("chkCue5").checked = false;
    document.getElementById("chkCue5").disabled = false;
    document.getElementById("chkCritCue1").checked = false;
    document.getElementById("chkCritCue2").checked = false;
    document.getElementById("chkCritCue3").checked = false;
    document.getElementById("chkCritCue4").checked = false;
    document.getElementById("chkCritCue5").checked = false;
    document.getElementById("btnFinalize").disabled = true;
    document.getElementById("btnDatasetInfo").disabled = true;
    document.getElementById("btnResultInfo").disabled = true;
    document.getElementById("hits").textContent = "0";
    document.getElementById("falsealarms").textContent = "0";
    document.getElementById("misses").textContent = "0";
    document.getElementById("correctrejections").textContent = "0";
    document.getElementById("undecided_pos").textContent = "0";
    document.getElementById("undecided_neg").textContent = "0";
    document.getElementById("pHits").textContent = "";
    document.getElementById("pFA").textContent = "";
    document.getElementById("dprime").textContent = "";
    document.getElementById("frugality").textContent = "";
    document.getElementById("aprime").textContent = "";
    document.getElementById("bprime").textContent = "";
    document.getElementById("bdprime").textContent = "";
    document.getElementById("bias").textContent = "";
}
function setCueListView() {
    document.getElementById("cue1").textContent = CUELIST[0].cueName;
    document.getElementById("cue2").textContent = CUELIST[1].cueName;
    document.getElementById("cue3").textContent = CUELIST[2].cueName;
    document.getElementById("cue4").textContent = CUELIST[3].cueName;
    document.getElementById("cue5").textContent = CUELIST[4].cueName;
}
function chooseCriterion(num) {
    var cue;
    var btnToDisable;
    var currChkName = "chkCue" + num.toString();
    var currCueName = CUELIST[num - 1].cueName;
    cue = new Cue(currCueName, true);
    document.getElementById("chkCue1").disabled = false;
    document.getElementById("chkCue2").disabled = false;
    document.getElementById("chkCue3").disabled = false;
    document.getElementById("chkCue4").disabled = false;
    document.getElementById("chkCue5").disabled = false;
    document.getElementById(currChkName).disabled = true;
    createEmptyTree(cue);
}
function addCueByNumberToTree(cb, num) {
    var cue;
    var cuename = CUELIST[num - 1].cueName;
    if (cb.checked) {
        cue = new Cue(cuename, false);
        addCueToTree(cue);
    }
    else
        removeCueFromTree(cuename);
    showTree();
}
function showTree() {
    var info = "";
    info += "<p>Tree contains " + TREE.treeCuesList.length.toString() + " cues </p>";
    info += "<table border='1'><tr><th>Cue</th><th>Exit on yes</th><th>Exit on no</th></tr>";
    TREE.treeCuesList.forEach(function (x) {
        info += "<tr><td>" + x.cueName + "</td><td>" + x.exitOnYes + "</td><td>" + x.exitOnNo + "</td></tr>";
    });
    info += "</table>";
    document.getElementById("btnFinalize").disabled = TREE.treeCuesList.length === 0;
    document.getElementById("treeinfo").innerHTML = info;
    document.getElementById("btnDatasetInfo").disabled = !(DATASET === undefined || DATASET === null || DATASET.records.length < 1);
}
function updateDatasetView() {
    var datasetInfo = "Dataset contains " + DATASET.records.length.toString() + " records:";
    datasetInfo += "<p><table border='1'><th>Case</th><th>Criterion: " + DATASET.criterionName + "</th>";
    DATASET.records[0].ordinaryCues.forEach(function (c) {
        datasetInfo += "<th>" + c.cueName + "</th>";
    });
    datasetInfo += "<th>Case evaluation</th>";
    datasetInfo += "</tr>";
    DATASET.records.forEach(function (k) {
        datasetInfo += "<tr>";
        datasetInfo += "<td>" + k.recordNumber.toString() + "</td>";
        datasetInfo += "<td>" + k.criterionCue.cueValue.toString() + "</td>";
        k.ordinaryCues.forEach(function (l) {
            datasetInfo += "<td>" + l.cueValue.toString() + "</td>";
        });
        datasetInfo += "<td>";
        var res = "";
        k.cueByTreeEvaluation.forEach(function (s) {
            res += s + "<br />";
        });
        datasetInfo += res + "</td>";
        datasetInfo += "</tr>";
    });
    datasetInfo += "</table>";
    document.getElementById("datasetinfo").innerHTML = datasetInfo;
    document.getElementById("btnDatasetInfo").disabled = true;
    document.getElementById("btnResultInfo").disabled = false;
}
function updateAnalysisView() {
    document.getElementById("hits").textContent = HITS.toString();
    document.getElementById("misses").textContent = MISS.toString();
    document.getElementById("falsealarms").textContent = FALSE_ALARMS.toString();
    document.getElementById("correctrejections").textContent = CORRECT_REJECTIONS.toString();
    document.getElementById("undecided_pos").textContent = UNDECIDED_POS.toString();
    document.getElementById("undecided_neg").textContent = UNDECIDED_NEG.toString();
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
//# sourceMappingURL=fftreeview.js.map