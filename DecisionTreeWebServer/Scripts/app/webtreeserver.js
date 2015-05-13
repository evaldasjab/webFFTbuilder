//var testtree =
//    {
//        "tree": {
//            "criterion": "infarction",
//            "cues": [{
//                "name": "CP",
//                "yes": "exit",
//                "no": "continue"
//            },
//            {
//                "name": "ST",
//                "yes": "exit",
//                "no": "continue"
//            },
//            {
//                "name": "OC",
//                "yes": "exit",
//                "no": "exit"
//            }
//        ]
//        }
//    };

// Namespace
var DecisionWebTree = DecisionWebTree || {};

DecisionWebTree.Common = {
    // simple eventclass for handling events
    Event: function (se) {
        var s = se;
        var l = [];
        return {
            attach: function (nl) {
                l.push(nl);
            },
            notify: function (a) {
                for (var i = 0; i < l.length; i++) {
                    l[i](s, a);
                }
            }
        };
    },
    // save tree to the server
    SaveTree: function (tree) {
        $.ajax({
            type: 'POST',
            url: 'Index/SaveTree',
            data: JSON.stringify(),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (msg) {
                // return true or false 
                if (msg) {
                    window.alert("Tree saved!");
                } else {
                    window.alert("Error! Tree not saved!");
                }
            },
            error: function (msg) {
                window.alert("Error in transaction! Please try again.");
            }
        });
    }
};

//$(document).ready(function () {
//    $("#btn_save").click(DecisionWebTree.Common.SaveTree(null));
//});