using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable.Trees.Interfaces;
using System.Runtime.Serialization;

namespace ABCUniverse.Portable.Trees
{
    [DataContract]
    [KnownType(typeof(Node))]
    public class Exit : IDecisionTreeItem
    {
        string _constructionLabel = "exit";
        [DataMember]
        public string ConstructionLabel
        {
            get { return _constructionLabel; }
            set { _constructionLabel = value; }
        }

        string _assignedLabel = "none";
        [DataMember]
        public string AssignedLabel
        {
            get { return _assignedLabel; }
            set { _assignedLabel = value; }
        }

        public Exit()
        {
        }

        //protected Exit(SerializationInfo info, StreamingContext context)
        //{
        //	ConstructionLabel = info.GetString("ConstructionLabel");
        //	AssignedLabel = info.GetString("AssignedLabel");
        //}

        //virtual public void GetObjectData(SerializationInfo info, StreamingContext context)
        //{
        //	info.AddValue("ConstructionLabel", ConstructionLabel);
        //	info.AddValue("AssignedLabel", AssignedLabel);
        //}
    }
}
