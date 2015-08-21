var testtree =
    {
        "tree": {
            "criterion": "infarction",
            "cues": [{
                "name": "CP",
                "yes": "exit",
                "no": "continue",
                "splitValue": "0.5",
                "maxValue": "1.0",
                "minValue": "0.0",
                "isFlipped": "false"
            },
            {
                "name": "ST",
                "yes": "exit",
                "no": "continue",
                "splitValue": 0.5,
                "maxValue": "1.1",
                "minValue": "0.0",
                "isFlipped": "1"
            },
            {
                "name": "OC",
                "yes": "exit",
                "no": "exit",
                "splitValue": 0.5,
                "maxValue": 1,
                "minValue": 0,
                "isFlipped": "True"
            }
        ]
        }
    };

// Namespace
var DecisionWebTree = DecisionWebTree || {};

DecisionWebTree.Common = {
    // save tree to the server
    SaveTree: function (tree) {
        $.ajax({
            type: 'POST',
            url: './Index/SaveTree',/*'http://dotwebresearch.de/divapps/fftree/Index/SaveTree',*/
            data: JSON.stringify(tree),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (msg) {
                // return true or false 
                if (msg) {
                    window.alert(msg);
                } 
            },
            error: function (msg) {
                window.alert(msg);
            }
        });
    }
};

//$(document).ready(function () {
//    $("#btn_save").click(DecisionWebTree.Common.SaveTree(null));
//});