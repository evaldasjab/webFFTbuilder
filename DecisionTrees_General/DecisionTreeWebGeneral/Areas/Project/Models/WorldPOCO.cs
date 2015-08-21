using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using ABCUniverse.Portable;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    /// <summary>
    /// POCO class for Worlds.
    /// </summary>
    [DataContract(IsReference=true)]
    public class WorldPOCO
    {        
        [DataMember(IsRequired=true)]
        public Guid Id { get; private set; }
        [DataMember(IsRequired = true)]
        public string Name { get; private set; }
        [DataMember]
        public string Description { get; private set; }
        [DataMember]
        public List<AttributePOCO> Attributes { get; private set; }
        public List<DatasetPOCO> AttachedDataset { get; private set; }

        #region C'tor
        public WorldPOCO() { }
        public WorldPOCO(World w)
        {
            Id = w.UniqueWorldID;
            Name = w.Name;

            Attributes = new List<AttributePOCO>();
            foreach (WorldAttribute wa in w.AttributesList)
            {
                Attributes.Add(new AttributePOCO(wa));
            }
        }
        #endregion
    }
}