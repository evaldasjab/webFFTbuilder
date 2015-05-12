using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace DecisionTreeWeb.Model
{
    [DataContract(IsReference=true)]
    public class Tree
    {
        [DataMember(IsRequired=true)]
        public string criterion { get; set; }
        [DataMember(IsRequired = true)]
        public List<Cue> cues { get; set; }

        public Tree() 
        {
            cues = new List<Cue>();
        }
    }
}