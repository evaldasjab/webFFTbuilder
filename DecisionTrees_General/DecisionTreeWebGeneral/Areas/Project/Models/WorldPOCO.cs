using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ABCUniverse.Portable;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    /// <summary>
    /// POCO class for Worlds.
    /// </summary>
    public class WorldPOCO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<AttributePOCO> Attributes { get; set; }
        // will not be saved on the server
        public List<DatasetPOCO> AttachedDataset { get; set; }

        public WorldPOCO(World w)
        {
            Id = w.UniqueWorldID;
            Name = w.Name;
        }
    }
}