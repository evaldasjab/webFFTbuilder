using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DecisionTreeWebGeneral.Areas.Project.Models;

namespace DecisionTreeWebGeneral.Areas.Project.Controllers
{
    /// <summary>
    /// Controller to provide different function manageing dataset on the server.
    /// </summary>
    public class DatasetController : Controller
    {
        [HttpPost]
        public JsonResult ListDatasets(int page)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult LoadDataset(Guid id)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult EditDataset(DatasetPOCO dataset)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult AddAttributeToDataset(Guid attId, Guid datasetId)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public JsonResult RemoveAttributeFromDataset(Guid attId, Guid datasetId)
        {
            throw new NotImplementedException();
        }
    }
}
