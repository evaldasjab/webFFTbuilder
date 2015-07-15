using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    public class WorldItemPOCO : ListPOCO
    {
        private int AttributeCount { get; private set; }

        public WorldItemPOCO(Guid Id, string Name) : base(Id, Name) 
        {
            AttributeCount = 0;
        }

        public WorldItemPOCO(Guid Id, string Name, int attCount)
            : base(Id, Name)
        {
            AttributeCount = attCount;
        }
    }
}