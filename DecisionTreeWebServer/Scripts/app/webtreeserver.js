var testtree =
    {
        "tree": {
            "criterion": "infarction",
            "cues": [{
                "name": "CP",
                "yes": "exit",
                "no": "continue"
            },
            {
                "name": "ST",
                "yes": "exit",
                "no": "continue"
            },
            {
                "name": "OC",
                "yes": "exit",
                "no": "exit"
            }
        ]
        }
    };

// function to save the tree on serverside via ajax
var save = function (tree) {
    $.ajax({
        type: 'POST',
        url: 'Index/SaveTree',
        data: JSON.stringify(testtree),
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