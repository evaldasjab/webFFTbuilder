using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ABCUniverse.Portable;
using ABCUniverse.Portable.Trees;
using ABCUniverse.Portable.Trees.Interfaces;
using DecisionTreeWebGeneral.Areas.Project.Models;

namespace DecisionTreeWebGeneral.Areas.Project.Controllers
{
    public class TreeController : Controller
    {
        //
        // GET: /Project/Tree/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveTree(Tree tree)
        {
            if (!ABCDBContext.ServerConnectionAvailable()) return Json("No connection to server! Your tree wasn't saved!");

            if (validateTree(tree))
            {
                try
                {
                    DecisionTree t = new DecisionTree();
                    t.IsFFTree = true;
                    t.SelectedCriterion = new WorldAttribute(tree.criterion);

                    // transform jsontree to decision-fft-tree
                    Node prnt = null;
                    foreach (var c in tree.cues)
                    {
                        // splitvalue in wa
                        var wa = new WorldAttribute(c.name);
                        wa.MaximumValue = c.maxValue;
                        wa.MinimumValue = c.minValue;
                        wa.BinarySplitValue = c.splitValue;
                        wa.IsFlipped = c.isFlipped;

                        var n = new Node(wa);

                        if (c.yes == "exit" && c.no != "exit")
                        {
                            n.NodeChildren = new List<IDecisionTreeItem>(2) { 
                                new Node(),
                                new Exit()
                            };
                        }
                        else if (c.yes != "exit" && c.no == "exit")
                        {
                            n.NodeChildren = new List<IDecisionTreeItem>(2) {  
                                new Exit(),
                                new Node()
                            };
                        }
                        else
                        {
                            n.NodeChildren = new List<IDecisionTreeItem>(2) { 
                                new Exit(), 
                                new Exit()
                            };
                        }

                        if (prnt != null)
                            n.ParentNode = prnt;

                        t.SetNode(n);
                        prnt = n;
                    }

                    // save to db
                    using (var ctx = new ABCDBContext())
                    {
                        string name = ctx.SaveTree(t);
                        return Json(string.Format("{0} saved!", name));
                    }
                    //return null;
                }
                catch (Exception e)
                {
                    return Json("Error! Your tree wasn't saved!");
                }
            }

            return Json(false);
        }

        private bool validateTree(Tree t)
        {
            return t != null && t.cues.Count != 0;
        }
    }
}
