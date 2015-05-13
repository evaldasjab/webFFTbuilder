using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ABCUniverse.Portable.Trees;
using DecisionTreeWeb.Model;
using ABCUniverse.DataAccess;

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
        public bool SaveTree(Tree tree)
        {
            if (!ABCDBContext.ServerConnectionAvailable()) return false;
            
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
                        var n = new Node();
                        n.NodeLabel = c.name;

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
                        ctx.SaveTree(t.Clone());
                        return true;
                    }
                }
                catch (Exception e)
                {
                    return false;
                }
            }

            return false;
        }

        // validate Jsontree
        private bool validateTree(Tree t)
        {
            return t != null;
        }
    }
}
