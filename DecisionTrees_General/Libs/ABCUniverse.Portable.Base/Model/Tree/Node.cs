using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse;
using ABCUniverse.Portable.Trees.Interfaces;
using System.Runtime.Serialization;
using ABCUniverse.Portable.Global;

namespace ABCUniverse.Portable.Trees
{

    // Alternative Wege: 
    // =================
    // Knoten aus World-Attribut ableiten; 
    // WorldAttribute-Variable
    // GUID, die einem WorldAttribut zugeordnet ist
    //...?
    //
    // Auf jeden Fall "ist" ein Knoten kein Attribut; vielmehr steht ein Knoten 
    // zu einem Attribut in einer Beziehung wie ein 50 Mark-Schein zur Zahl
    // 50 - und man würde eine Geldscheinklasse nicht aus einer Basisklasse
    // Integer, Double oder Decimal ableiten; insofern sollte der Knoten
    // auch keinesfalls aus WorldAttribute abgeleitet werden
    //
    // weiter: in welcher Beziehung sollen die Klassen NodeSettings, Node
    // und WorldAttribute stehen? NodeSettings soll dem Node variable Eigenschaften
    // für die Auswertung zur Verfügung stellen; 
    //
    // Die Grundlogik soll ungefähr sein, dass ein DecisionTree NUR aus einer Beschreibung der Beziehungen 
    // von Knoten und Blättern besteht und dazu eine Referenz auf ein WorldAttribute erhält;
    // die TreeSettings, die an einen Baum gehängt werden, bestehen dann sinnvollerweise 
    // aus einer Liste von NodeSettings, die wiederum eine Referenz auf den speziellen 
    // Knoten erhalten

    // AttachedAttribute = (WorldAttribute)info.GetValue("AttachedAttribute", typeof(WorldAttribute));
    // ConstructionLabel = info.GetString("ConstructionLabel");
    // NodeLabel = info.GetString("NodeLabel");
    // ParentNode = (Node)info.GetValue("ParentNode", typeof(Node));
    // NodeChildren = (List<IDecisionTreeItem>)info.GetValue("NodeChildren", typeof(List<IDecisionTreeItem>));
    // IsTerminalCue = info.GetBoolean("IsTerminalCue");


    [DataContract(IsReference = true)]
    [KnownType(typeof(Exit))]
    public class Node : IDecisionTreeItem
    {
        public static event EventHandler<NodeSettingsChangedEventArgs> SettingsChanged;

        public int NodeId { get; set; }

        WorldAttribute _attachedAttribute;
        [DataMember]
        public WorldAttribute AttachedAttribute
        {
            get { return _attachedAttribute; }
            set { _attachedAttribute = value; }
        }

        string _constructionLabel = "continue";
        [DataMember]
        public string ConstructionLabel
        {
            get { return _constructionLabel; }
            set { _constructionLabel = value; }
        }

        string _nodeLabel = "node";
        [DataMember]
        public string NodeLabel
        {
            get { return _nodeLabel; }
            set { _nodeLabel = value; }
        }

        Node _parentNode;
        [DataMember]
        public Node ParentNode
        {
            get { return _parentNode; }
            set { _parentNode = value; }
        }

        List<IDecisionTreeItem> _nodeChildren;
        [DataMember]
        public List<IDecisionTreeItem> NodeChildren
        {
            get { return _nodeChildren; }
            set { _nodeChildren = value; }
        }

        bool _isTerminalCue = false;
        [DataMember]
        public bool IsTerminalCue
        {
            get { return _isTerminalCue; }
            set { _isTerminalCue = value; }
        }

        public Node()
        {
            _nodeChildren = new List<IDecisionTreeItem>();
            _nodeChildren.Add(new TreeItem());
            _nodeChildren.Add(new TreeItem());
        }

        public Node(WorldAttribute attachedAttribute)
            : this()
        {
            _attachedAttribute = attachedAttribute;
            _nodeLabel = _attachedAttribute.AttributeName;
        }

        double _minExitLow = 0;
        double _maxExitLow = 0;
        double _minExitHigh = 0;
        double _maxExitHigh = 0;
        NodeSettings _nodeSettingsObject;

        public void AttachNodeSettings(NodeSettings settings)
        {
            //if (!settings.Equals(_nodeSettingsObject))
            //{
            _nodeSettingsObject = settings;
            if (SettingsChanged != null)
            {
                NodeSettingsChangedEventArgs args = new NodeSettingsChangedEventArgs()
                {
                    NodeName = _nodeSettingsObject.Name,
                    LowCriterionExitLabel = _nodeSettingsObject.LowCriterionOutcomeLabel,
                    HighCriterionExitLabel = _nodeSettingsObject.HighCriterionOutcomeLabel,
                    Settings = settings
                };
                SettingsChanged(this, args);
            }
            //}
        }

        public bool GetExitingCases(ref List<Alternative> incoming, ref List<Alternative> exitOnLowValueAlternatives,
         ref List<Alternative> exitOnHighValueAlternatives, NodeSettings nodesettings, int step)
        {
            AttachNodeSettings(nodesettings);

            exitOnLowValueAlternatives = new List<Alternative>();
            exitOnHighValueAlternatives = new List<Alternative>();

            _minExitLow = -1;
            _maxExitLow = -1;
            _minExitHigh = -1;
            _maxExitHigh = -1;

            if (nodesettings.AttributePrediction == Global.AttributePredictionDirection.REGULAR)
            {
                if (_nodeChildren[0].GetType() == typeof(Exit))
                {
                    _minExitLow = nodesettings.AttributeMinimum;
                    _maxExitLow = nodesettings.AttributeSplitValue;
                }

                if (_nodeChildren[1].GetType() == typeof(Exit))
                {
                    _minExitHigh = nodesettings.AttributeSplitValue;
                    _maxExitHigh = nodesettings.AttributeMaximum;
                }
            }
            else
            {
                if (_nodeChildren[0].GetType() == typeof(Exit))
                {
                    _minExitHigh = nodesettings.AttributeSplitValue;
                    _maxExitHigh = nodesettings.AttributeMaximum;
                }

                if (_nodeChildren[1].GetType() == typeof(Exit))
                {
                    _minExitLow = nodesettings.AttributeMinimum;
                    _maxExitLow = nodesettings.AttributeSplitValue;
                }
            }

            foreach (Alternative alt in incoming)
            {
                if (!_minExitLow.Equals(_maxExitLow) || !_minExitHigh.Equals(_maxExitHigh))
                {
                    double val = alt.GetAttributeValue(_attachedAttribute);
                    if ((!double.IsNaN(val)) && _minExitLow >= 0 && _maxExitLow >= 0 && val >= _minExitLow && val <= _maxExitLow)
                    {
                        exitOnLowValueAlternatives.Add(alt);
                        // alt.AnalysisString.Append(String.Format("{0};{1};LOW;{2};EXIT", step, AttachedAttribute.AttributeName, alt.GetAttributeValue(AttachedAttribute.AttributeName)));
                    }
                    else if ((!double.IsNaN(val)) && _minExitHigh >= 0 && _maxExitHigh >= 0 && val >= _minExitHigh && val <= _maxExitHigh)
                    {
                        exitOnHighValueAlternatives.Add(alt);
                        // alt.AnalysisString.Append(String.Format("{0};{1};HIGH;{2};EXIT", step, AttachedAttribute.AttributeName, alt.GetAttributeValue(AttachedAttribute.AttributeName)));
                    }
                    else
                    {
                        // alt.AnalysisString.Append(String.Format("{0};{1};low;{2};CONTINUE|", step, AttachedAttribute.AttributeName, alt.GetAttributeValue(AttachedAttribute.AttributeName)));
                    }
                }
            }

            foreach (Alternative alt in exitOnLowValueAlternatives)
                incoming.Remove(alt);

            foreach (Alternative alt in exitOnHighValueAlternatives)
                incoming.Remove(alt);

            return true;
        }

        //protected Node(SerializationInfo info, StreamingContext context)
        //{
        //	AttachedAttribute = (WorldAttribute)info.GetValue("AttachedAttribute", typeof(WorldAttribute));
        //	ConstructionLabel = info.GetString("ConstructionLabel");
        //	NodeLabel = info.GetString("NodeLabel");
        //	ParentNode = (Node)info.GetValue("ParentNode", typeof(Node));
        //	NodeChildren = (List<IDecisionTreeItem>)info.GetValue("NodeChildren", typeof(List<IDecisionTreeItem>));
        //	IsTerminalCue = info.GetBoolean("IsTerminalCue");
        //}

        //virtual public void GetObjectData(SerializationInfo info, StreamingContext context)
        //{
        //	info.AddValue("AttachedAttribute", AttachedAttribute, typeof(WorldAttribute));
        //	info.AddValue("ConstructionLabel", ConstructionLabel);
        //	info.AddValue("NodeLabel", NodeLabel);
        //	info.AddValue("ParentNode", ParentNode, typeof(Node));
        //	info.AddValue("NodeChildren", NodeChildren, typeof(List<IDecisionTreeItem>)); 
        //	info.AddValue("IsTerminalCue", IsTerminalCue);
        //}
    }
}
