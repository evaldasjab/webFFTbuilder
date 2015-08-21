using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using ABCUniverse.Portable;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    [DataContract]
    public class AlternativePOCO : POCO
    {
        public int Number { get; private set; }
        public string DataString { get; private set; }
        public List<double> Values { get; private set; }

        #region C'tor
        public AlternativePOCO() { }
        public AlternativePOCO(Alternative a)
        {
            this.Id = a.AlternativeID;
            this.Number = a.AlternativeNumber;
            this.DataString = a.DataString;

            Values = new List<double>();
            foreach (AttributeInstance ai in a.AttributesList)
            {
                Values.Add(ai.Value);
            }
        }
        #endregion
    }
}
