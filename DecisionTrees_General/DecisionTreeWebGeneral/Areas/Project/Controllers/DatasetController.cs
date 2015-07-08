using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DecisionTreeWebGeneral.Areas.Project.Models;

namespace DecisionTreeWebGeneral.Areas.Project.Controllers
{
    public class DatasetController : Controller
    {
        //
        // GET: /Project/Dataset/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult SaveTree(Tree tree)
        {
            return null;
        }

        public JsonResult LoadTree(Guid id)
        {
            return null;
        }

        public JsonResult LoadTrees(List<Guid> ids)
        {
            return null;
        }
    }
}
