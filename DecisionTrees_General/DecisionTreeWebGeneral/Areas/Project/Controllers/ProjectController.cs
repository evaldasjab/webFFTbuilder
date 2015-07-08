using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DecisionTreeWebGeneral.Areas.Project.Controllers
{
    public class ProjectController : Controller
    {
        //
        // GET: /Project/Project/

        public ActionResult Index()
        {
            return View("Index");
        }

        public ActionResult CreateProject()
        {
            return View("Index");
        }

        
    }
}
