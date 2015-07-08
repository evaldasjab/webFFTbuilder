/* namespace */ 
var GeneralDecisionTree = GeneralDecisionTree || {};

/*
   Common event class -> use to notify controller, view & model 
*/
GeneralDecisionTree.Common = {
    Event: function (s) {
        var sender = s;
        var listener = [];

        return {
            attach: function (l) {
                listener.push(l);
            },
            notify: function (args) {
                var i;
                for (i = 0; i < listener.length; i++) {
                    listener[i](sender, args);
                }
            }
        };
    }
};

GeneralDecisionTree.Project = {
    model: function () {

    }
}

GeneralDecisionTree.Project.Dataset = {
    // model for dataset
    model: function () {

    }
}

GeneralDecisionTree.Project.Tree = {
    // model for trees
    model: function () {

    }
}

GeneralDecisionTree.Project.Analysis = {
    // model for analsis
    model: function () {

    }
}