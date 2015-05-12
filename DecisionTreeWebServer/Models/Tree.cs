using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace DecisionTreeWeb.Model
{
    [DataContract]
    public class Tree
    {
        [DataMember]
        public string criterion { get; set; }
        [DataMember]
        public List<Cue> cues { get; set; }

        public Tree() 
        {
            cues = new List<Cue>();
        }
    }
}