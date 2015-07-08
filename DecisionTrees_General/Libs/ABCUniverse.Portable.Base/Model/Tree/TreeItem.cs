using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using ABCUniverse.Portable.Trees.Interfaces;

namespace ABCUniverse.Portable.Trees
{
    public class TreeItem: IDecisionTreeItem
    {
        string _constructionLabel = "continue";
        [DataMember]
        public string ConstructionLabel
        {
            get { return _constructionLabel; }
            set { _constructionLabel = value; }
        }
    }
}
