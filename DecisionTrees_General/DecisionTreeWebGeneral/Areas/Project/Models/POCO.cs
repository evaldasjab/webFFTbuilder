using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    public abstract class POCO
    {
        public Guid Id { get; protected set; }
    }
}