using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ABCUniverse.Portable.Trees;
using DecisionTreeWeb.Model;
using ABCUniverse.DataAccess;
using ABCUniverse.Portable;

namespace DecisionTreeWebServer.Controllers
{
    public class IndexController : Controller
    {
        //
        // GET: /Index/

        public ActionResult Index()
        {
            return View("Index");
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

                    // transform jsontree to decision-fft-tree
                    Node prnt = null;
                    foreach (var c in tree.cues)
                    {
                        var n = new Node(new WorldAttribute(c.name));
                        
                        if (prnt == null)
                        {
                            t.SetRoot(n);
                            prnt = n;
                        }
                        else
                        {
                            n.ParentNode = prnt;
                            if (c.yes == "exit" && c.no != "exit")
                            {
                                t.AppendChildren(new Exit(), n);
                            }
                            else if (c.yes == "exit" && c.no == "exit")
                            {
                                t.AppendChildren(new Exit(), new Exit());
                            }
                            else
                            {
                                t.AppendChildren(n, new Exit());
                            }
                            prnt = n;
                        }
                    }

                    // save to db
                    using (var ctx = new ABCDBContext())
                    {
                        string name = ctx.SaveTree(t);
                        return Json(string.Format("{0} saved!", name));
                    }
                }
                catch (Exception e)
                {
                    return Json("Error! Your tree wasn't saved!");
                }
            }

            return Json(false);
        }

        // validate Jsontree
        private bool validateTree(Tree t)
        {
            return t != null && t.cues.Count!=0;
        }
    }
}
