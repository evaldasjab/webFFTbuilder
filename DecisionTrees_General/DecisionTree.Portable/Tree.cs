using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DecisionTree.Portable
{
    [DataContract(IsReference = true)]
    public class Tree
    {
        [DataMember]
        public List<Cue> Id { get; set; }
        [DataMember(IsRequired = true)]
        public string Name { get; set; }
        [DataMember]
        public string Description { get; set; }

        /// save all cues for the decision tree.
        /// The first fst cues is the criterion cue.
        [DataMember(IsRequired = true)]
        public ICollection<Cue> cues { get; set; }

        public Tree()
        {
            cues = new List<Cue>();
        }
    }
}
