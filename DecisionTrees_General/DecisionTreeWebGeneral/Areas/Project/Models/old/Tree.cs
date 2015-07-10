using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using ABCUniverse.Portable.Trees.Interfaces;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{
    [DataContract(IsReference = true)]
    public class Tree : IDecisionTree
    {
        [DataMember(IsRequired = true)]
        public Cue criterion { get; set; }
        [DataMember(IsRequired = true)]
        public List<Cue> cues { get; set; }

        public Tree()
        {
            cues = new List<Cue>();
        }
    }
}