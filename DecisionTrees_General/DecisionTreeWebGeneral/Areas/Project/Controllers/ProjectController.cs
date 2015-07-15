using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DecisionTreeWebGeneral.Areas.Project.Models;

namespace DecisionTreeWebGeneral.Areas.Project.Controllers
{
    /// <summary>
    /// Controller to provide different function manageing project on the server 
    /// & manageing the different pages for projects, like datasets, attributes, trees etc.
    /// </summary>
    public class ProjectController : Controller
    {
        #region linkcontrol
        public ActionResult Index()
        {
            return View("Index");
        }

        public ActionResult Dataset()
        {
            return View("Dataset");
        }

        public ActionResult Tree()
        {
            return View("Tree");
        }

        public ActionResult Analysis()
        {
            return View("Analysis");
        }
        #endregion

        #region Project fcts
        [HttpPost]
        public JsonResult ListProjects(int page)
        {
            return Json("Listing...");
        }
        [HttpPost]
        public JsonResult LoadProject(Guid g)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult CreateProject(WorldPOCO w)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult EditProject(WorldPOCO w)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult DeleteProject(Guid g)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult ListAttributes(int page)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult LoadAttribute(Guid id)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult EditAttribute(AttributePOCO att)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult AddAttributeToProject(Guid pjId, Guid attId) {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult RemoveAttributeFromProject(Guid pjId, Guid attId)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult RemoveAttribute(Guid id)
        {
            throw new NotImplementedException();
        }
        #endregion

    }
}
