using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable.Global;
using System.Runtime.Serialization;

namespace ABCUniverse.Portable.Trees
{
    [DataContract]
    public class TreeSettings
    {
        [DataMember]
        public int Number { get; set; }

        [DataMember]
        public Guid TreeSettingsID { get; set; }

        [DataMember]
        public bool DefaultSettings { get; set; }

        [DataMember]
        public Guid CriterionAttributeID { get; set; }

        [DataMember]
        public string CriterionName { get; set; }

        [DataMember]
        public bool UseCriterionCategories { get; set; }

        [DataMember]
        public int NumberOfCriterionCategories { get; set; }

        [DataMember]
        public bool CriterionCategoriesAutoSplit { get; set; }

        double _criterionAutoSplit = double.NaN;
        [DataMember]
        public double CriterionSplitValue
        {
            get
            {
                return _criterionAutoSplit;
            }
            set
            {
                _criterionAutoSplit = value;
            }
        }

        [DataMember]
        public double Minimum { get; set; }

        [DataMember]
        public double Maximum { get; set; }

        bool _selectedForAnalysis = false;
        public bool SelectedForAnalysis
        {
            get { return _selectedForAnalysis; }
            set { _selectedForAnalysis = value; }
        }

        CriterionOutcome _criterionSuccess = CriterionOutcome.HIGH;
        [DataMember]
        public CriterionOutcome CriterionSuccess
        {
            get
            {
                return _criterionSuccess;
            }
            set
            {
                _criterionSuccess = value;
            }
        }

        CriterionOutcome _criterionFailure = CriterionOutcome.LOW;
        [DataMember]
        public CriterionOutcome CriterionFailure
        {
            get
            {
                return _criterionFailure;
            }
            set
            {
                _criterionFailure = value;
            }
        }

        [DataMember]
        public bool TreeComplete { get; set; }

        string _criterionFailureLabel = "low";
        [DataMember]
        public string CriterionFailureLabel
        {
            get { return _criterionFailureLabel; }
            set { _criterionFailureLabel = value; }
        }

        string _criterionSuccessLabel = "high";
        [DataMember]
        public string CriterionSuccessLabel
        {
            get { return _criterionSuccessLabel; }
            set { _criterionSuccessLabel = value; }
        }

        private bool _selected;
        [DataMember]
        public bool Selected
        {
            get { return _selected; }
            set { _selected = value; }
        }

        List<NodeSettings> _nodeSettingsList = new List<NodeSettings>();
        [DataMember]
        public List<NodeSettings> NodeSettingsList
        {
            get { return _nodeSettingsList; }
            set { _nodeSettingsList = value; }
        }

        public void AddNodeSetting(string attributeName, double attributeMin, double attributeMax)
        {
            NodeSettings nodesetting = new NodeSettings(attributeName, attributeMin, attributeMax);
            _nodeSettingsList.Add(nodesetting);
        }

        public NodeSettings GetNodeSettings(string attributeName)
        {
            foreach (NodeSettings nodesettings in _nodeSettingsList)
            {
                if (nodesettings.Name == attributeName)
                    return nodesettings;
            }

            return null;
        }

        public TreeSettings CloneTreeSettings()
        {
            TreeSettings clone = new TreeSettings();
            clone.Number = this.Number;
            clone.CriterionAttributeID = this.CriterionAttributeID;
            clone.CriterionName = this.CriterionName;
            clone.UseCriterionCategories = this.UseCriterionCategories;
            clone.NumberOfCriterionCategories = this.NumberOfCriterionCategories;
            clone.CriterionCategoriesAutoSplit = this.CriterionCategoriesAutoSplit;
            clone.CriterionSplitValue = this.CriterionSplitValue;
            clone.Minimum = this.Minimum;
            clone.Maximum = this.Maximum;
            clone.CriterionSuccess = this.CriterionSuccess;
            clone.CriterionFailure = this.CriterionFailure;
            clone.TreeComplete = this.TreeComplete;
            clone.CriterionFailureLabel = this.CriterionFailureLabel;
            clone.CriterionSuccessLabel = this.CriterionSuccessLabel;
            clone.Selected = this.Selected;

            clone.NodeSettingsList = new List<NodeSettings>();
            foreach (NodeSettings item in this.NodeSettingsList)
                clone.NodeSettingsList.Add(item.CloneNodeSettings());

            return clone;
        }
    }
}
