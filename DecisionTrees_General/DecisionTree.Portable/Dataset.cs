using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DecisionTree.Portable
{
    [DataContract(IsReference=true)]
    public class Dataset
    {
        #region Properties
        [DataMember(IsRequired=true)]
        public long Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember(IsRequired=true)]
        public ICollection<Cue> Cues { get; set;}
        #endregion

        #region C'tor
        public Dataset()
        {
            Cues = new List<Cue>();
        }
        #endregion
    }
}
