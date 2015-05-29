using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace DecisionTreeWeb.Model
{
    [DataContract(IsReference = true)]
    public class Cue
    {
        [DataMember(IsRequired = true)]
        public string name { get; set; }
        [DataMember(IsRequired = true)]
        public string yes { get; set; }
        [DataMember(IsRequired = true)]
        public string no { get; set; }

        public Cue() {}
    }
}