using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DecisionTreeWebGeneral.Areas.Project.Models;

namespace DecisionTreeWebGeneral.Areas.Project.Controllers
{
    /// <summary>
    /// Controller to provide different function for anaylsiscalculations on the server.
    /// </summary>
    public class AnalysisController : Controller
    {
        [HttpPost]
        public JsonResult analyse(Guid treeId, Guid datasetId)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult analyse(Guid treeId, List<Guid> datasetId)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult analyse(List<Guid> treeId, List<Guid> datasetId)
        {
            throw new NotImplementedException();
        }

        
    }
}
