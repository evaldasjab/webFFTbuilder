using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using ABCUniverse.Portable.Trees.Interfaces;

namespace ABCUniverse.Portable.Global.Model.Tree
{
    /// <summary>
    /// Decisiontree interface only for the model of a decisiontree.
    /// </summary>
    public interface IDecisionTreeModel : IDecisionTree
    {
        #region Public treeproperties
        [DataMember(IsRequired=true)]
        ulong Id { get; set; }
        [DataMember]
        string Name { get; set; }
        [DataMember]
        string Description { get; set; }
        [DataMember(IsRequired=true)]
        IDecisionTreeItem Root { get; set; }
        [DataMember(IsRequired = true)]
        List<IDecisionTreeItem> TreeObjectItemList { get; set; }
        #endregion

        #region Treemethods
        IDecisionTreeItem AddNode(IDecisionTreeItem parent, IDecisionTreeItem node);
        IDecisionTreeItem AddNode(IDecisionTreeItem parent, IDecisionTreeItem node, int childrenIdx);
        IDecisionTreeItem ReplaceNode(IDecisionTreeItem oldNode, IDecisionTreeItem newNode);
        void RemoveNode(IDecisionTreeItem node);
        #endregion
    }
}
