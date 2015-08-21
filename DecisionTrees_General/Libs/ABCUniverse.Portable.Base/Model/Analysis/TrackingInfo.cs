using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Global
{
    /// <summary>
    /// speichert im handisch generierten Baum die detailierten information zu den Splits 
    /// im baum.
    /// </summary>
    public class TrackingInfo
    {
        Guid _alternativeID = default(Guid);
        public Guid AlternativeID
        {
            get { return _alternativeID; }
            set { _alternativeID = value; }
        }

        int _alternativeNumber = 0;
        public int AlternativeNumber
        {
            get { return _alternativeNumber; }
            set { _alternativeNumber = value; }
        }

        int _steps = 0;
        public int Steps
        {
            get { return _steps; }
            set { _steps = value; }
        }

        DecisionOutcome _outcome = DecisionOutcome.UNDEFINED;
        public DecisionOutcome Outcome
        {
            get { return _outcome; }
            set { _outcome = value; }
        }

        List<TrackingItem> _trackingItems;
        public List<TrackingItem> TrackingItems
        {
            get { return _trackingItems; }
            set { _trackingItems = value; }
        }

        public TrackingInfo(Guid alternativeID, int alternativeNumber)
        {
            _alternativeID = alternativeID;
            _alternativeNumber = alternativeNumber;
            _trackingItems = new List<TrackingItem>();
        }

        public void AddTrackingItem(TrackingItem item)
        {
            _trackingItems.Add(item);
            if (item.Decision.Equals(AttributeDecision.EXIT))
            {
                _steps = item.Step;
                _outcome = item.Outcome;
            }
        }

        public TrackingInfo Clone()
        {
            TrackingInfo clone = new TrackingInfo(this._alternativeID, this._alternativeNumber);
            clone.Steps = this.Steps;
            clone.Outcome = this.Outcome;
            TrackingItem[] copy=new TrackingItem[this.TrackingItems.Count];
            this.TrackingItems.CopyTo(copy);
            clone.TrackingItems = copy.ToList();

            return clone;
        }
    }
}
