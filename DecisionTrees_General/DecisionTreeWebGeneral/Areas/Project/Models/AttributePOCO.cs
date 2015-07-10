using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable.Global;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    public class AttributePOCO : POCO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DataType DataType { get; set; }
    }
}
