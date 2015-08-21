using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    [DataContract]
    public class ListPOCO
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }

        public ListPOCO(Guid Id, string Name)
        {
            this.Id = Id;
            this.Name = Name;
        }
    }
}