/* namespace */ 
var GeneralDecisionTree = GeneralDecisionTree || {};

/*
   Common class -> use to notify controller, view & model 
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
    },
    Error: function (msg) {
        var msg = msg;
        return {
            display: function () {
                window.alert(msg);
            }
        }
    }
};

GeneralDecisionTree.ProjectList = {
    model: function () {
        var projectList = [];
        var currentPage = 0;
        var maxPageCount = 0;

        var getProjectPage = function () {
            $.ajax({
                type: 'POST',
                url: './Project/ListProjects',
                data: JSON.stringify({ page : currentPage}),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    console.log("projectpage loaded!");
                    projectList = msg;
                },
                error: function (msg) {
                    new GeneralDecisionTree.Common.Error(msg.responseText).display();
                }
            });
        }

        getProjectPage();

        return {
            getMaxPageCount: function() {
                return maxPageCount;
            },
            getProjectList: function() {
                return projectList;
            },
            nextPage: function () {
                if (currentPage + 1 <= maxPageCount) {
                    currentPage++;
                    getProjectPage();
                }
            },
            previousPage: function () {
                if (currentPage - 1 >= 0) {
                    currentPage--;
                    getProjectPage();
                }
            },
            goToPage: function (page) {
                if (page >= 0 && page <= maxPageCount) {
                    currentPage = page;
                    getProjectList();
                }
            }
        }
    }
}

GeneralDecisionTree.Project = {
    model: function () {
        var project = {
            Id: 0000 - 0000 - 0000- 0000,
            Name: null,
            Description: null,
            Attributes: [],
            AttachedDataset: []
        }

        return {
            addDataset: function (dataset) {
                project.AttachedDataset.forEach(function (e) {
                    if (e.Id == msg.Id) return;
                });
                project.AttachedDataset.push(dataset);
                updateProject();
            },
            addAttribute: function(att) {
                project.Attributes.push(att);
                updateProject();
            },
            getCurrentProject: function () {
                return project;
            },
            loadProject: function (id) {
                $.ajax({
                    type: 'POST',
                    url: './Project/LoadProject',
                    data: JSON.stringify({ id : id }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("project loaded!");
                        project = msg;
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },
            updateProject: function() {
                $.ajax({
                    type: 'POST',
                    url: './Project/EditProject',
                    data: JSON.stringify({w : project}),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        project = msg;
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },
            removeDataset: function (dataset) {
                var set = project.AttachedDataset;
                var idx = set.indefOf(dataset);
                if (idx >= 0) {
                    set.splice(i);
                    updateProject();
                }
            },
            removeAttribute: function (att) {
                var set = project.Attributes;
                var idx = set.indefOf(att);
                if (idx >= 0) {
                    set.splice(i);
                    updateProject();
                }
            }
        }
    }
}

GeneralDecisionTree.DatasetList = {
    model: function () {
        var datasetList = [];
        var currentPage = 0;
        var maxPageCount = 0;

        var getDatasetPage = function () {
            $.ajax({
                type: 'POST',
                url: './Dataset/ListDatasets',
                data: JSON.stringify({ page: currentPage }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    console.log("projectpage loaded!");
                    datasetList = msg;
                },
                error: function (msg) {
                    new GeneralDecisionTree.Common.Error(msg.responseText).display();
                }
            });
        }

        getDatasetPage();

        return {
            getMaxPageCount: function () {
                return maxPageCount;
            },
            getDatasetList: function () {
                return datasetList;
            },
            nextPage: function () {
                if (currentPage + 1 <= maxPageCount) {
                    currentPage++;
                    getDatasetPage();
                }
            },
            previousPage: function () {
                if (currentPage - 1 >= 0) {
                    currentPage--;
                    getDatasetPage();
                }
            },
            goToPage: function (page) {
                if (page >= 0 && page <= maxPageCount) {
                    currentPage = page;
                    getDatasetPage();
                }
            }
        }
    }
}

GeneralDecisionTree.Dataset = {
    // model for dataset
    model: function (project) {
        var crrProject = project;
        var selectedDataSet = {
            Id: 0000 - 0000 - 0000 - 0000 - 0000,
            Name: null,
            AlternativesList: []
        };

        return {
            getSelectedDataset: function () {
                return selectedDataSet;
            },
            loadDataset: function (id) {
                $.ajax({
                    type: 'POST',
                    url: './Dataset/LoadDataset',
                    data: JSON.stringify({ id: id }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("dataset loaded!");
                        selectedDataSet = msg;
                        crrProject.addDataset(msg);
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },
            updateDataset: function () {
                $.ajax({
                    type: 'POST',
                    url: '',
                    data: "{}",
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("dataset updated!");
                        return;
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },
            addAlternative: function (alt) {
                selectedDataSet.AlternativesList.push(alt);
                updateDataset();
            },
            removeAlternative: function (alt) {
                var idx = selectedDataSet.AlternativesList.indefOf(alt);
                selectedDataSet.AlternativesList.splice(idx);
                updateDataset();
            }
        }
    }
}

GeneralDecisionTree.TreeList = {
    model: function () {
        var treeList = [];
        var currentPage = 0;
        var maxPageCount = 0;

        var getTreePage = function () {
            $.ajax({
                type: 'POST',
                url: './Tree/ListTrees',
                data: JSON.stringify({ page: currentPage }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    console.log("treepage loaded!");
                    treeList = msg;
                },
                error: function (msg) {
                    new GeneralDecisionTree.Common.Error(msg.responseText).display();
                }
            });
        }

        getTreePage();

        return {
            getMaxPageCount: function () {
                return maxPageCount;
            },
            getTreeList: function () {
                return treeList;
            },
            nextPage: function () {
                if (currentPage + 1 <= maxPageCount) {
                    currentPage++;
                    getTreePage();
                }
            },
            previousPage: function () {
                if (currentPage - 1 >= 0) {
                    currentPage--;
                    getTreePage();
                }
            },
            goToPage: function (page) {
                if (page >= 0 && page <= maxPageCount) {
                    currentPage = page;
                    getTreePage();
                }
            }
        }
    }
}

GeneralDecisionTree.Tree = {
    // model for trees
    model: function () {
        var tree = {
            Id: 0000 - 0000 - 0000 - 0000,
            Name: null,
            Description: null,
            Attributes: []            
        };

        return {
            getRoot: function () {
                return root;
            },
            loadTree: function(id) {
                $.ajax({
                    type: 'POST',
                    url: './Tree/LoadTree',
                    data: JSON.stringify({ id: id }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("dataset loaded!");
                        tree = msg;
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },
            updateTree: function () {
                $.ajax({
                    type: 'POST',
                    url: './Tree/EditTree',
                    data: JSON.stringify({tree : tree}),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("dataset loaded!");
                        tree = msg;
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },

            createTreeWithAlgorithm: function () {

            }
        };
    }
}

GeneralDecisionTree.AttributeList = {
    model: function () {
        var attributeList = [];
        var currentPage = 0;
        var maxPageCount = 0;

        var getAttributePage = function () {
            $.ajax({
                type: 'POST',
                url: './Project/ListAttributes',
                data: JSON.stringify({ page: currentPage }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    console.log("treepage loaded!");
                    attributeList = msg;
                },
                error: function (msg) {
                    new GeneralDecisionTree.Common.Error(msg.responseText).display();
                }
            });
        }

        getAttributePage();

        return {
            getMaxPageCount: function () {
                return maxPageCount;
            },
            getAttributeList: function () {
                return attributeList;
            },
            nextPage: function () {
                if (currentPage + 1 <= maxPageCount) {
                    currentPage++;
                    getAttributePage();
                }
            },
            previousPage: function () {
                if (currentPage - 1 >= 0) {
                    currentPage--;
                    getAttributePage();
                }
            },
            goToPage: function (page) {
                if (page >= 0 && page <= maxPageCount) {
                    currentPage = page;
                    getAttributePage();
                }
            }
        }
    }
}

GeneralDecisionTree.Attribute = {
    model: function (project) {
        var project = project;
        var att;

        var init = function () {
            att = {
                Id: 0000 - 0000 - 0000 - 0000,
                Name: null,
                Description: null,
                DataType: null,
                MinValue: 0.0,
                MaxValue: 0.0,
                Values: []
            };
        }

        return {
            getAttribute: function() {
                return att;
            },
            loadAttribute: function (id) {
                $.ajax({
                    type: 'POST',
                    url: './Project/LoadAttribute',
                    data: JSON.stringify({ id: id }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("dataset loaded!");
                        att = msg;
                        project.addAttribute(add);
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },
            updateAttribute: function () {
                $.ajax({
                    type: 'POST',
                    url: './Project/EditAttribute',
                    data: JSON.stringify({ att: att }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("dataset loaded!");
                        att = msg;
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            },
            removeFromProject: function () {
                project.removeAttribute(att);
                init();
            }
        };
    }
}

GeneralDecisionTree.Analysis = {
    // model for analsis
    model: function () {
        var analysisresult = {};

        return {
            getAnalyseResult: function () {
                return analysisresult;
            },
            analyse: function (treeId, datasetId) {
                $.ajax({
                    type: 'POST',
                    url: '',
                    data: JSON.stringify({ treeId: treeId, datasetId : datasetId }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (msg) {
                        console.log("dataset loaded!");
                        analysisresult = msg;
                    },
                    error: function (msg) {
                        new GeneralDecisionTree.Common.Error(msg.responseText).display();
                    }
                });
            }
        }
    }
}