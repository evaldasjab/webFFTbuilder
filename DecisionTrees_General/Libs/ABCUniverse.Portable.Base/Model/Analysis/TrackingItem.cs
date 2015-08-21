using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Global
{
    public class TrackingItem
    {
        string _attributeName = "";
        public string AttributeName
        {
            get { return _attributeName; }
            set { _attributeName = value; }
        }

        double _attributeSplitValue = default(double);
        public double AttributeSplitValue
        {
            get { return _attributeSplitValue; }
            set { _attributeSplitValue = value; }
        }

        AttributePredictionDirection _predictionDirection = AttributePredictionDirection.UNDEFINED;
        public AttributePredictionDirection AttributeDirection
        {
            get { return _predictionDirection; }
            set { _predictionDirection = value; }
        }

        double _attributeValue = default(double);
        public double AttributeValue
        {
            get { return _attributeValue; }
            set { _attributeValue = value; }
        }

        string _criterionName = "";
        public string CriterionName
        {
            get { return _criterionName; }
            set { _criterionName = value; }
        }

        double _criterionValue = default(double);
        public double CriterionValue
        {
            get { return _criterionValue; }
            set { _criterionValue = value; }
        }

        double _criterionSplitValue = default(double);
        public double CriterionSplitValue
        {
            get { return _criterionSplitValue; }
            set { _criterionSplitValue = value; }
        }

        CriterionOutcome _criterionSuccess = CriterionOutcome.UNDEFINED;
        public CriterionOutcome CriterionSuccess
        {
            get { return _criterionSuccess; }
            set { _criterionSuccess = value; }
        }

        string _criterionSuccessLabel = "";
        public string CriterionSuccessLabel
        {
            get { return _criterionSuccessLabel; }
            set { _criterionSuccessLabel = value; }
        }

        string _criterionFailureLabel = "";
        public string CriterionFailureLabel
        {
            get { return _criterionFailureLabel; }
            set { _criterionFailureLabel = value; }
        }

        int _step = 0;
        public int Step
        {
            get { return _step; }
            set { _step = value; }
        }

        AttributeDecision _decision = AttributeDecision.UNDEFINED;
        public AttributeDecision Decision
        {
            get { return _decision; }
            set { _decision = value; }
        }

        DecisionOutcome _outcome = DecisionOutcome.UNDEFINED;
        public DecisionOutcome Outcome
        {
            get { return _outcome; }
            set { _outcome = value; }
        }

        public TrackingItem(string attributeName, double attributeSplitValue, AttributePredictionDirection predictionDirection, double attributeValue, string criterionName,
            double criterionSplitValue, CriterionOutcome criterionSuccess, string criterionSuccessLabel, string criterionFailureLabel, double criterionValue, int step, AttributeDecision decision)
        {
            _attributeName = attributeName;
            _attributeSplitValue = attributeSplitValue;
            _predictionDirection = predictionDirection;
            _attributeValue = attributeValue;
            _criterionName = criterionName;
            _criterionSplitValue = criterionSplitValue;
            _criterionSuccess = criterionSuccess;
            _criterionSuccessLabel = criterionSuccessLabel;
            _criterionFailureLabel = criterionFailureLabel;
            _criterionValue = criterionValue;
            _step = step;
            _decision = decision;
        }
    }
}
