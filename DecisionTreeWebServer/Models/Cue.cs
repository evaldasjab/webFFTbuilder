using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace DecisionTreeWeb.Model
{
    [DataContract]
    public class Cue
    {
        [DataMember]
        public string name { get; set; }
        [DataMember]
        public string yes { get; set; }
        [DataMember]
        public string no { get; set; }

        public Cue() {}
    }
}