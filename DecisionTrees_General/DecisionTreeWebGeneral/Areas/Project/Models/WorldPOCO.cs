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
        public Guid Id { get;set; }
        public string Name { get; set; }
        public List<Cue> Attributes { get; set; }

        public WorldPOCO(World w)
        {
            Id = w.UniqueWorldID;
            Name = w.Name;

            Attributes = new List<Cue>();
            foreach (WorldAttribute wa in w.AttributesList)
            {
                var c = new Cue();
                c.name = wa.AttributeName;
                c.minValue = wa.MinimumValue;
                c.maxValue = wa.MaximumValue;
                c.splitValue = wa.BinarySplitValue;

                Attributes.Add(c);
            }
            
        }
    }
}