using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable;
using ABCUniverse.Portable.Global;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    public class AttributePOCO : POCO
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public DataType DataType { get; private set; }
        public double MaximumValue { get; private set; }
        public double MinimumValue { get; private set; }
        public List<double> Values { get; private set; }

        #region C'tor
        public AttributePOCO() { }
        public AttributePOCO(WorldAttribute wa)
        {
            this.Id = wa.UniqueWorldAttributeID;
            this.Name = wa.AttributeName;
            this.Description = wa.AttributeDescription;
            this.DataType = wa.Datatype;
            this.MaximumValue = wa.MaximumValue;
            this.MinimumValue = wa.MinimumValue;
            this.Values = wa.Values;
        }
        #endregion
    }
}
