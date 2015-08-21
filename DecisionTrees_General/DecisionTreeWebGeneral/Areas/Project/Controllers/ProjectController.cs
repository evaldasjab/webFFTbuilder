using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ABCUniverse.DataAccess;
using ABCUniverse.DataStorage;
using ABCUniverse.Portable;
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
            List<WorldInfo> items = WorldDataManager.GetLocalWorldList(); 

            List<WorldItemPOCO> result = new List<WorldItemPOCO>();
            foreach (WorldInfo w in items)
            {
                result.Add(new WorldItemPOCO(w.WorldInfoId, w.Name));
            }

            return Json(result);
        }
        [HttpPost]
        public JsonResult LoadProject(Guid g)
        {
            return Json(new WorldPOCO(WorldDataManager.LoadLocalWorld(g)));
        }
        [HttpPost]
        public JsonResult CreateProject(WorldPOCO w)
        {
            World newWorld = new World(w.Name);
            foreach (var a in w.Attributes) {
                WorldAttribute attribute = WorldDataManager.GetLocalAttributeByGuid(a.Id);
                if (attribute == null)
                {
                    WorldDataManager.AddAttributeToLocalList(new WorldAttribute(a.Name));
                }                
            }
            string info = "";
            WorldDataManager.SaveLocalWorld(newWorld, ref info);

            return Json(new WorldPOCO(newWorld));
        }
        [HttpPost]
        public JsonResult EditProject(WorldPOCO w)
        {
            string info = "";
            World sw = WorldDataManager.LoadLocalWorld(w.Id);

            List<WorldAttribute> att = new List<WorldAttribute>();
            foreach (AttributePOCO ap in w.Attributes) {
                var q = sw.AttributesList.Select(x => x.UniqueWorldAttributeID.Equals(ap.Id)).FirstOrDefault();
                
                if (q != null) continue;

                AddAttributeToProject(sw.UniqueWorldID, ap.Id);
            }

            sw.AttributesList = att;
            
            bool ok = WorldDataManager.SaveLocalWorld(sw, ref info);
            if (!ok) return Json(info);

            
            return Json(w);
        }
        [HttpPost]
        public JsonResult DeleteProject(Guid g)
        {
            string info = "";
            bool ok = WorldDataManager.RemoveLocalWorld(g, ref info);
            if (!ok)
                return Json(info);

            return Json(ok);
        }
        [HttpPost]
        public JsonResult ListAttributes(int page)
        {
            var info = WorldDataManager.GetLocalAttributeInfoList();
            List<AttributeListPOCO> attlist = new List<AttributeListPOCO>();
            foreach (AttributeInfo ai in info) {
                attlist.Add(new AttributeListPOCO(ai.AttributeInfoId, ai.Name));
            }

            return Json(attlist);
        }
        [HttpPost]
        public JsonResult LoadAttribute(Guid id)
        {
            WorldAttribute att = WorldDataManager.GetServerAttributeByGuid(id);
            return Json(new AttributePOCO(att));
        }
        [HttpPost]
        public JsonResult EditAttribute(AttributePOCO att)
        {
            WorldAttribute dbatt = WorldDataManager.GetServerAttributeByGuid(att.Id);

            dbatt.AttributeDescription = att.Description;
            dbatt.AttributeName = att.Name;
            dbatt.MaximumValue = att.MaximumValue;
            dbatt.MinimumValue = att.MinimumValue;
            dbatt.Datatype = att.DataType;
            dbatt.Values = att.Values;
            return Json(att);
        }
        [HttpPost]
        public JsonResult AddAttributeToProject(Guid pjId, Guid attId) {
            WorldAttribute att = WorldDataManager.GetServerAttributeByGuid(attId);
            World pj = WorldDataManager.LoadLocalWorld(pjId);
            WorldDataManager.AddAttributeToLocalList(att);
            pj.AttributesList.Add(att);
            string info = "";
            bool ok = WorldDataManager.SaveLocalWorld(pj, ref info);

            if (!ok) return Json(info);

            return Json(new WorldPOCO(pj));
        }
        [HttpPost]
        public JsonResult RemoveAttributeFromProject(Guid pjId, Guid attId)
        {
            WorldAttribute att = WorldDataManager.GetServerAttributeByGuid(attId);
            World pj = WorldDataManager.LoadLocalWorld(pjId);
            pj.AttributesList.Remove(att);
            string info = "";
            bool ok = WorldDataManager.SaveLocalWorld(pj, ref info);

            if (!ok) return Json(info);

            return Json(new WorldPOCO(pj));
        }
        [HttpPost]
        public JsonResult RemoveAttribute(Guid id)
        {
            WorldAttribute att = WorldDataManager.GetServerAttributeByGuid(id);
            bool ok = WorldDataManager.RemoveAttributeFromLocalList(att);

            return Json(ok);
        }
        #endregion

    }
}
