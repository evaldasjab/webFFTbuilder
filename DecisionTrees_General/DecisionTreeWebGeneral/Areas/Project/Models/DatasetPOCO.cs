using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    public class DatasetPOCO : POCO
    {
        public string Name { get; private set; }
        public List<AlternativePOCO> Alternatives { get; private set; }

        #region C'tor
        public DatasetPOCO() { }
        public DatasetPOCO(WorldDataset set)
        {
            this.Id = set.UniqueWorldDatasetID;
            this.Name = set.Name;
            this.Alternatives = new List<AlternativePOCO>();

            foreach (Alternative a in set.AlternativesList)
            {
                Alternatives.Add(new AlternativePOCO(a));
            }
        }
        #endregion
    }
}
