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
