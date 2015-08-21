using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace DecisionTree.Portable
{
    [DataContract(IsReference = true)]
    public class Cue
    {
        #region relation properties
        [Key]
        [DataMember(IsRequired = true)]
        public long Id { get; set; }
        [DataMember]
        public ICollection<Tree> Trees { get; set; }
        [DataMember]
        public ICollection<Dataset> DataSet { get; set; }
        #endregion 

        #region extra properties
        [DataMember(IsRequired = true)]
        public string Name { get; set; }
        [DataMember(IsRequired = true)]
        public string yes { get; set; }
        [DataMember(IsRequired = true)]
        public string no { get; set; }
        [DataMember(IsRequired = true)]
        public double maxValue { get; set; }
        [DataMember(IsRequired = true)]
        public double minValue { get; set; }
        [DataMember(IsRequired = true)]
        public double splitValue { get; set; }
        [DataMember(IsRequired = true)]
        public bool isFlipped { get; set; }
        #endregion

        #region
        public Cue()
        {
            Trees = new List<Tree>();
            DataSet = new List<Dataset>();
        }
        #endregion
    }
}
