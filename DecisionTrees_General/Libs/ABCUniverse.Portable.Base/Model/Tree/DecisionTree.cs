using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable.Trees.Interfaces;
using ABCUniverse.Portable.Trees;
using ABCUniverse;
using System.Runtime.Serialization;
using System.Xml;
using ABCUniverse.Portable.Trees.Analysis;
using System.Globalization;
using ABCUniverse.Portable.Global;

namespace ABCUniverse.Portable.Trees
{
    /// <summary>
    /// DecisionTree enthält die Beschreibung aller (abstrakten) Merkmale eines
    /// (konkreten) Baumes, der im TreeConstructionUserControl erzeugt wird
    /// </summary>

    [DataContract]
    public class DecisionTree : IDecisionTree//, ICloneable
    {
        Guid _uniqueTreeID;
        [DataMember]
        public Guid UniqueTreeID
        {
            get { return _uniqueTreeID; }
            set { _uniqueTreeID = value; }
        }

        string _name;
        [DataMember]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        private string _description;
        [DataMember]
        public string Description
        {
            get { return _description; }
            set { _description = value; }
        }

        bool _isFFTree = true;
        [DataMember]
        public bool IsFFTree
        {
            get { return _isFFTree; }
            set { _isFFTree = value; }
        }

        int _maxNodeChildren = 2;
        [DataMember]
        public int MaxNodeChildren
        {
            get { return _maxNodeChildren; }
            set { _maxNodeChildren = value; }
        }

        bool _isComplete = false;
        [DataMember]
        public bool IsComplete
        {
            get { return _isComplete; }
            set { _isComplete = value; }
        }

        string _lowCriterionExitLabel = "LOWCRIT EXIT";
        [DataMember]
        public string LowCriterionExitLabel
        {
            get { return _lowCriterionExitLabel; }
            set { _lowCriterionExitLabel = value; }
        }

        string _highCriterionExitLabel = "HIGHCRIT EXIT";
        [DataMember]
        public string HighCriterionExitLabel
        {
            get { return _highCriterionExitLabel; }
            set { _highCriterionExitLabel = value; }
        }

        WorldAttribute _selectedCriterion;
        [DataMember]
        public WorldAttribute SelectedCriterion
        {
            get { return _selectedCriterion; }
            set { _selectedCriterion = value; }
        }

        List<WorldAttribute> _listOfAttributes;
        [DataMember]
        public List<WorldAttribute> ListOfAttributes
        {
            get { return _listOfAttributes; }
            set { _listOfAttributes = value; }
        }

        Node _root;
        [DataMember]
        public Node Root
        {
            get { return _root; }
            set { _root = value; }
        }

        Node _currentNode;

        List<IDecisionTreeItem> _treeObjectsList;
        [DataMember]
        public List<IDecisionTreeItem> TreeObjectsList
        {
            get { return _treeObjectsList; }
            set { _treeObjectsList = value; }
        }

        TreeImage _treeMiniBitmap = new TreeImage();
        [DataMember]
        public TreeImage TreeMiniBitmap
        {
            get { return _treeMiniBitmap; }
            set { _treeMiniBitmap = value; }
        }

        List<TreeSettings> _treeSettingsList;
        [DataMember]
        public List<TreeSettings> TreeSettingsList
        {
            get { return _treeSettingsList; }
            set { _treeSettingsList = value; }
        }

        TreeSettings _selectedTreeSettings = null;
        [DataMember]
        public TreeSettings SelectedTreeSettings
        {
            get
            {
                return _selectedTreeSettings;
            }
            set
            {
                _selectedTreeSettings = value;
            }
        }

        bool _selectedForAnalysis = false;
        public Boolean SelectedForAnalysis
        {
            get
            {
                return _selectedForAnalysis;
            }
            set
            {
                _selectedForAnalysis = value;
            }
        }

        public DecisionTree()
        {
            _uniqueTreeID = Guid.NewGuid();
            _treeObjectsList = new List<IDecisionTreeItem>();
            _listOfAttributes = new List<WorldAttribute>();
            _treeSettingsList = new List<TreeSettings>();
            TreeSettings settings = new TreeSettings();
            _selectedTreeSettings = settings;
            settings.Number = 1;
            settings.DefaultSettings = true;
            _treeSettingsList.Add(settings);
        }

        public DecisionTree(string name)
            : this()
        {
            _name = name;
        }

        public DecisionTree(string name, WorldAttribute rootAttribute)
            : this(name)
        {
            _root = new Node(rootAttribute);
            _currentNode = _root;
        }

        public DecisionTree(string name, WorldAttribute rootAttribute, bool isFFTree, int maxNodeChildren)
            : this(name, rootAttribute)
        {
            _isFFTree = isFFTree;
            _maxNodeChildren = _isFFTree ? 2 : maxNodeChildren;
        }

        // Bäume werden formuliert, ohne dass spezielle Settings festgelegt werden; allerdings definiert die Verwendung eines
        // Attributes in einem Baum, dass dieses Attribut nurmehr als Cue festgelegt ist und nicht als Kriterium verwendet werden kann;
        // das heisst umgekehrt, als Kriterium für einen Baum können nur die Attribute einer Welt verwendet werden, die nicht in diesem
        // Baum definiert sind; ein mögliches Problem der Anwendung verschiedener Bäume auf Datensätze in unterschiedlichen Welten 
        // besteht nun darin, dass dann, wenn ein als Kriterium verwendetes Attribut nicht in allen Welten vorhanden ist, für diese Welt 
        // nicht ausgewertet werden kann; was bedeuten würde, dass im Falle des ROC-Tools, dass 
        public TreeAnalysis AnalyzeTree(ref List<Alternative> datalist, string datasetName, TreeSettings treesettings, int maxSteps, ref string info, int number, ref int error)
        {
            error = 0;
            if (datalist == null || datalist.Count <= 0)
            {
                info = "Error: No dataset found for analysis";
                error = 1;
                return null;
            }

            if (treesettings == null)
            {
                info = "Error: No treesettings found for analysis";
                error = 2;
                return null;
            }

            if (Root == null)
            {
                info = "Error: No tree node found for analysis";
                error = 3;
                return null;
            }

            int count = 0;
            foreach (Alternative a in datalist)
            {
                count++;
                if (a.TrackingData == null)
                    a.TrackingData = new TrackingInfo(a.AlternativeID, count);
                a.TrackingData.TrackingItems.Clear();
            }
            _selectedTreeSettings = treesettings;

            TreeSettings settings = _selectedTreeSettings;
            TreeAnalysis results = new TreeAnalysis();
            results.AnalysisName = this.Name;
            results.TreeSettingsNumber = settings.Number;

            Node analysisNode = Root;
            int steps = 0;



            do
            {
                steps++;
                if (steps > maxSteps)
                    return results;

                NodeSettings analysisNodeSettings = settings.GetNodeSettings(analysisNode.AttachedAttribute.AttributeName);
                List<Alternative> listLowerExits = null;
                List<Alternative> listUpperExits = null;

                if (analysisNode.GetExitingCases(ref datalist, ref listLowerExits, ref listUpperExits, analysisNodeSettings, steps))
                {
                    results.AnalysisTable.StepsSum += ((listLowerExits.Count + listUpperExits.Count) * steps);

                    // entweder ist der vorhersagende Cue normal (hoch -> besser)
                    if (analysisNodeSettings.AttributePrediction == Global.AttributePredictionDirection.REGULAR)
                    {
                        RegularHighPredictionExitCount(settings, analysisNodeSettings, steps, results, listUpperExits);
                        RegularLowPredictionExitCount(settings, analysisNodeSettings, steps, results, listLowerExits);
                    }
                    else // oder reversed (niedrig -> besser)
                    {
                        ReverseHighPredictionExitCount(settings, analysisNodeSettings, steps, results, listUpperExits);
                        ReverseLowPredictionExitCount(settings, analysisNodeSettings, steps, results, listLowerExits);
                    }

                    UndecidedCount(settings, analysisNodeSettings, steps, results, datalist);

                    foreach (Alternative alt in listLowerExits)
                        results.AnalysisTrackingData.Add(alt.TrackingData.Clone());
                    foreach (Alternative alt in listUpperExits)
                        results.AnalysisTrackingData.Add(alt.TrackingData.Clone());

                }

                if (analysisNode.NodeChildren[0].GetType() == typeof(Node))
                    analysisNode = (Node)analysisNode.NodeChildren[0];
                else if (analysisNode.NodeChildren[1].GetType() == typeof(Node))
                    analysisNode = (Node)analysisNode.NodeChildren[1];
                else
                    analysisNode = null;

            } while (analysisNode != null);

            AddAnalysisTableInfo(ref results, Name, _selectedTreeSettings.Number, datasetName, number);
            return results;
        }

        private static void ReverseLowPredictionExitCount(
         TreeSettings settings, NodeSettings nodeSettingsObject, int step, TreeAnalysis results, List<Alternative> lowPredictionExitCases)
        {
            foreach (Alternative alt in lowPredictionExitCases)
            {
                TrackingItem trackingItem =
                 new TrackingItem(
                  nodeSettingsObject.Name,
                  nodeSettingsObject.AttributeSplitValue,
                  nodeSettingsObject.AttributePrediction,
                  alt.GetAttributeValue(nodeSettingsObject.Name),
                  settings.CriterionName,
                  settings.CriterionSplitValue,
                  settings.CriterionSuccess,
                  settings.CriterionSuccessLabel,
                  settings.CriterionFailureLabel,
                  alt.GetAttributeValue(settings.CriterionName),
                  step,
                  AttributeDecision.EXIT);

                if (settings.CriterionSuccess == Global.CriterionOutcome.HIGH)
                {
                    // wenn Kriterium über Split-Wert: [0-1]-1
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.HITCount++;
                        trackingItem.Outcome = DecisionOutcome.HIT;
                    }
                    else // ansonsten: [0->1]-0
                    {
                        results.AnalysisTable.FACount++;
                        trackingItem.Outcome = DecisionOutcome.FA;
                    }
                }
                else // für Kriterium niedriger == besser
                {
                    // wenn Kriterium über Split-Wert: [0->1]-[1->0]
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.FACount++;
                        trackingItem.Outcome = DecisionOutcome.FA;
                    }
                    else // ansonsten: [0->1]-[0->1]
                    {
                        results.AnalysisTable.HITCount++;
                        trackingItem.Outcome = DecisionOutcome.HIT;
                    }
                }

                alt.TrackingData.AddTrackingItem(trackingItem);
            }
        }

        private static void ReverseHighPredictionExitCount(
         TreeSettings settings, NodeSettings nodeSettingsObject, int step, TreeAnalysis results, List<Alternative> highPredictionExitCases)
        {
            foreach (Alternative alt in highPredictionExitCases)
            {
                TrackingItem trackingItem =
                 new TrackingItem(
                  nodeSettingsObject.Name,
                  nodeSettingsObject.AttributeSplitValue,
                  nodeSettingsObject.AttributePrediction,
                  alt.GetAttributeValue(nodeSettingsObject.Name),
                  settings.CriterionName,
                  settings.CriterionSplitValue,
                  settings.CriterionSuccess,
                  settings.CriterionSuccessLabel,
                  settings.CriterionFailureLabel,
                  alt.GetAttributeValue(settings.CriterionName),
                  step,
                  AttributeDecision.EXIT);

                // für Kriterium höher == besser
                if (settings.CriterionSuccess == Global.CriterionOutcome.HIGH)
                {
                    // wenn Kriterium über Split-Wert: [1->0]-1
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.MISSCount++;
                        trackingItem.Outcome = DecisionOutcome.MISS;
                    }
                    else // ansonsten: [1->0]-0
                    {
                        results.AnalysisTable.CRCount++;
                        trackingItem.Outcome = DecisionOutcome.CR;
                    }
                }
                else // für Kriterium niedriger == besser
                {
                    // wenn Kriterium über Split-Wert: [1->0]-[1->0]
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.CRCount++;
                        trackingItem.Outcome = DecisionOutcome.CR;
                    }
                    else // ansonsten: [1->0]-[0->1]
                    {
                        results.AnalysisTable.MISSCount++;
                        trackingItem.Outcome = DecisionOutcome.MISS;
                    }
                }
                alt.TrackingData.AddTrackingItem(trackingItem);
            }
        }

        private static void RegularLowPredictionExitCount(
         TreeSettings settings, NodeSettings nodeSettingsObject, int step, TreeAnalysis results, List<Alternative> lowPredictionExitCases)
        {
            foreach (Alternative alt in lowPredictionExitCases)
            {
                TrackingItem trackingItem =
                   new TrackingItem(
                    nodeSettingsObject.Name,
                    nodeSettingsObject.AttributeSplitValue,
                    nodeSettingsObject.AttributePrediction,
                    alt.GetAttributeValue(nodeSettingsObject.Name),
                    settings.CriterionName,
                    settings.CriterionSplitValue,
                    settings.CriterionSuccess,
                    settings.CriterionSuccessLabel,
                    settings.CriterionFailureLabel,
                    alt.GetAttributeValue(settings.CriterionName),
                    step,
                    AttributeDecision.EXIT);

                // für Kriterium höher == besser
                if (settings.CriterionSuccess == Global.CriterionOutcome.HIGH)
                {
                    // wenn Kriterium über Split-Wert: 0-1
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.MISSCount++;
                        trackingItem.Outcome = DecisionOutcome.MISS;
                    }
                    else // ansonsten: 0-0
                    {
                        results.AnalysisTable.CRCount++;
                        trackingItem.Outcome = DecisionOutcome.CR;
                    }
                }
                else // für Kriterium niedriger == besser
                {
                    // wenn Kriterium über Split-Wert: 0-[1->0]
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.CRCount++;
                        trackingItem.Outcome = DecisionOutcome.CR;
                    }
                    else // ansonsten: 0-[0->1]
                    {
                        results.AnalysisTable.MISSCount++;
                        trackingItem.Outcome = DecisionOutcome.MISS;
                    }
                }
                alt.TrackingData.AddTrackingItem(trackingItem);
            }
        }

        private static void RegularHighPredictionExitCount(
         TreeSettings settings, NodeSettings nodeSettingsObject, int step, TreeAnalysis results, List<Alternative> highPredictionExitCases)
        {
            foreach (Alternative alt in highPredictionExitCases)
            {
                TrackingItem trackingItem =
                   new TrackingItem(
                    nodeSettingsObject.Name,
                    nodeSettingsObject.AttributeSplitValue,
                    nodeSettingsObject.AttributePrediction,
                    alt.GetAttributeValue(nodeSettingsObject.Name),
                    settings.CriterionName,
                    settings.CriterionSplitValue,
                    settings.CriterionSuccess,
                    settings.CriterionSuccessLabel,
                    settings.CriterionFailureLabel,
                    alt.GetAttributeValue(settings.CriterionName),
                    step,
                    AttributeDecision.EXIT);

                // für Kriterium höher == besser
                if (settings.CriterionSuccess == Global.CriterionOutcome.HIGH)
                {
                    // wenn Kriterium über Split-Wert: 1-1
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.HITCount++;
                        trackingItem.Outcome = DecisionOutcome.HIT;
                    }
                    else // ansonsten: 1-0
                    {
                        results.AnalysisTable.FACount++;
                        trackingItem.Outcome = DecisionOutcome.FA;
                    }
                }
                else // für Kriterium niedriger == besser
                {
                    // wenn Kriterium über Split-Wert: 1-[1->0]
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                    {
                        results.AnalysisTable.FACount++;
                        trackingItem.Outcome = DecisionOutcome.FA;
                    }
                    else // ansonsten: 1-[0->1]
                    {
                        results.AnalysisTable.HITCount++;
                        trackingItem.Outcome = DecisionOutcome.HIT;
                    }
                }
                alt.TrackingData.AddTrackingItem(trackingItem);
            }
        }

        private static void UndecidedCount(
            TreeSettings settings, NodeSettings nodeSettingsObject, int step, TreeAnalysis results, List<Alternative> undecidedCases)
        {
            results.AnalysisTable.UndecidedSuccessCount = 0;
            results.AnalysisTable.UndecidedFailureCount = 0;

            foreach (Alternative alt in undecidedCases)
            {
                TrackingItem trackingItem =
                   new TrackingItem(
                    nodeSettingsObject.Name,
                    nodeSettingsObject.AttributeSplitValue,
                    nodeSettingsObject.AttributePrediction,
                    alt.GetAttributeValue(nodeSettingsObject.Name),
                    settings.CriterionName,
                    settings.CriterionSplitValue,
                    settings.CriterionSuccess,
                    settings.CriterionSuccessLabel,
                    settings.CriterionFailureLabel,
                    alt.GetAttributeValue(settings.CriterionName),
                    step,
                    AttributeDecision.CONTINUE);

                if (settings.CriterionSuccess == Global.CriterionOutcome.HIGH)
                {
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                        results.AnalysisTable.UndecidedSuccessCount++;
                    else // ansonsten: 1-0
                        results.AnalysisTable.UndecidedFailureCount++;
                }
                else // für Kriterium niedriger == besser
                {
                    if (alt.GetAttributeValue(settings.CriterionName) > settings.CriterionSplitValue)
                        results.AnalysisTable.UndecidedFailureCount++;
                    else // ansonsten: 1-[0->1]
                        results.AnalysisTable.UndecidedSuccessCount++;
                }
                trackingItem.Outcome = DecisionOutcome.UNDEFINED;
                alt.TrackingData.AddTrackingItem(trackingItem);
            }
        }

        void AddAnalysisTableInfo(ref TreeAnalysis results, string treeName, int settingsNumber, string datasetName, int number)
        {
            results.AnalysisTableInfo = new List<string>();
            results.AnalysisTableInfo.Add(number.ToString());
            results.AnalysisTableInfo.Add(treeName);
            results.AnalysisTableInfo.Add(settingsNumber.ToString());
            results.AnalysisTableInfo.Add(datasetName);
            results.AnalysisTableInfo.Add(results.AnalysisTable.HITCount.ToString());
            results.AnalysisTableInfo.Add(results.AnalysisTable.MISSCount.ToString());
            results.AnalysisTableInfo.Add(results.AnalysisTable.FACount.ToString());
            results.AnalysisTableInfo.Add(results.AnalysisTable.CRCount.ToString());
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetHitsProbability().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetFalseAlarmsProbability().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetZofHitsProbability().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetZofFalseAlarmsProbability().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetDPrime().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetBias().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetBetaLog().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetBeta().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetAPrime().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetBPrime().ToString("F2", CultureInfo.InvariantCulture));
            results.AnalysisTableInfo.Add(results.AnalysisTable.GetBDoublePrime().ToString("F2", CultureInfo.InvariantCulture));
        }

        public void SetRoot(Node root)
        {
            _root = root;
            _currentNode = _root;
        }

        void AppendChildren(IDecisionTreeItem firstChild, IDecisionTreeItem lastChild)
        {
            _currentNode.NodeChildren = new List<IDecisionTreeItem>(_maxNodeChildren) { firstChild, lastChild };

            if (_currentNode.NodeChildren[0].GetType() == typeof(Node))
            {
                Node tmp = (Node)_currentNode.NodeChildren[0];
                tmp.ParentNode = _currentNode;
                _currentNode = tmp;
            }
            else if (_currentNode.NodeChildren[1].GetType() == typeof(Node))
            {
                Node tmp = (Node)_currentNode.NodeChildren[1];
                tmp.ParentNode = _currentNode;
                _currentNode = tmp;
            }
            else
                _isComplete = true;
        }
        
        public void SetNode(Node node)
        {
            _listOfAttributes.Add(node.AttachedAttribute);
            if (_root == null)
                SetRoot(node);
            else
            {
                if (_currentNode.NodeChildren[0].GetType() == typeof(Node))
                    _currentNode.NodeChildren[0] = node;
                else if (_currentNode.NodeChildren[1].GetType() == typeof(Node))
                    _currentNode.NodeChildren[1] = node;
                
                _currentNode = node;
            }
        }

        public void SetNode(Node node, IDecisionTreeItem firstChild, IDecisionTreeItem lastChild)
        {
            SetNode(node);
            AppendChildren(firstChild, lastChild);
        }

        public void SetNode(WorldAttribute nodeAttribute, IDecisionTreeItem firstChild, IDecisionTreeItem lastChild)
        {
            Node node = new Node(nodeAttribute);
            SetNode(node, firstChild, lastChild);
        }

        public string GetStructureAsText()
        {
            string res = "";

            Node node = _root;
            while (node != null)
            {
                res += node.NodeLabel + String.Format(" (left child: {0}, right child: {1})", node.NodeChildren[0].ConstructionLabel, node.NodeChildren[1].ConstructionLabel) + Environment.NewLine;

                if (node.NodeChildren[0].GetType() == typeof(Node))
                    node = node.NodeChildren[0] as Node;
                else if (node.NodeChildren[1].GetType() == typeof(Node))
                    node = node.NodeChildren[1] as Node;
                else
                    node = null;
            }

            return res;
        }

        //#region Serialization support
        //protected DecisionTree(SerializationInfo info, StreamingContext context)
        //{
        //	UniqueTreeID = Guid.Parse(info.GetString("UniqueTreeID"));
        //	Name = info.GetString("Name");
        //	Root = (Node)info.GetValue("Root", typeof(Node));
        //	MaxNodeChildren = info.GetInt32("MaxNodeChildren");
        //	IsComplete = info.GetBoolean("IsComplete");
        //	LowCriterionExitLabel = info.GetString("LowCriterionExitLabel");
        //	HighCriterionExitLabel = info.GetString("HighCriterionExitLabel");
        //	ListOfAttributes = (List<WorldAttribute>)info.GetValue("ListOfAttributes", typeof(List<WorldAttribute>));
        //	TreeObjectsList = (List<IDecisionTreeItem>)info.GetValue("TreeObjectsList", typeof(List<IDecisionTreeItem>));
        //	TreeMiniBitmap = (TreeImage)info.GetValue("TreeMiniBitmap", typeof(TreeImage));
        //	TreeSettingsList = (List<TreeSettings>)info.GetValue("TreeSettingsList", typeof(List<TreeSettings>));
        //}

        //virtual public void GetObjectData(SerializationInfo info, StreamingContext context)
        //{
        //	info.AddValue("UniqueTreeID", UniqueTreeID.ToString());
        //	info.AddValue("Name", Name);
        //	info.AddValue("Root", Root);
        //	info.AddValue("MaxNodeChildren", MaxNodeChildren);
        //	info.AddValue("IsComplete", IsComplete);
        //	info.AddValue("LowCriterionExitLabel", LowCriterionExitLabel);
        //	info.AddValue("HighCriterionExitLabel", HighCriterionExitLabel);
        //	info.AddValue("ListOfAttributes", ListOfAttributes, typeof(List<WorldAttribute>));
        //	info.AddValue("TreeObjectsList", TreeObjectsList, typeof(List<IDecisionTreeItem>));
        //	info.AddValue("TreeMiniBitmap", TreeMiniBitmap, typeof(TreeImage));
        //	info.AddValue("TreeSettingsList", TreeSettingsList, typeof(List<TreeSettings>));
        //}
        //#endregion

        public DecisionTree Clone()
        {
            DecisionTree clone = new DecisionTree();
            clone._uniqueTreeID = this._uniqueTreeID;
            clone._name = this._name;
            clone._description = this._description;
            clone._isFFTree = this._isFFTree;
            clone._maxNodeChildren = this._maxNodeChildren;
            clone._isComplete = this._isComplete;
            clone._lowCriterionExitLabel = this._lowCriterionExitLabel;
            clone._highCriterionExitLabel = this._highCriterionExitLabel;
            clone._selectedCriterion = this._selectedCriterion;
            clone._listOfAttributes = this._listOfAttributes;
            clone._root = this._root;
            clone._currentNode = this._currentNode;

            clone._treeObjectsList = this._treeObjectsList;
            clone._treeMiniBitmap = this._treeMiniBitmap;
            clone._treeSettingsList = this._treeSettingsList;
            clone._selectedTreeSettings = this._selectedTreeSettings;
            clone._selectedForAnalysis = this._selectedForAnalysis;
            return clone;
        }
    }
}
