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
        #region Properties
        [DataMember(IsRequired = true)]
        public Cue criterion { get; set; }
        [DataMember(IsRequired = true)]
        public ICollection<Cue> cues { get; set; }
        #endregion

        #region C'tor
        public Tree()
        {
            cues = new List<Cue>();
        }
        #endregion
    }
}