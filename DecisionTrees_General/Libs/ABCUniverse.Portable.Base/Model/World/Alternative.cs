using ABCUniverse.Portable.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace ABCUniverse.Portable
{
    public class Alternative
    {
        Guid _alternativeID;
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

        List<AttributeInstance> _attributesList;
        public List<AttributeInstance> AttributesList
        {
            get { return _attributesList; }
            set { _attributesList = value; }
        }

        String _dataString = "";
        public String DataString
        {
            get { return _dataString; }
            set { _dataString = value; }
        }

        TrackingInfo _trackingData = null;
        public TrackingInfo TrackingData
        {
            get { return _trackingData; }
            set { _trackingData = value; }
        }

        public Alternative()
        {
            _alternativeID = Guid.NewGuid();
            _attributesList = new List<AttributeInstance>();

        }

        public Alternative(World world, int number)
            : this()
        {
            _alternativeNumber = number;
            _trackingData = new TrackingInfo(_alternativeID, _alternativeNumber);
            foreach (WorldAttribute wa in world.AttributesList)
            {
                _attributesList.Add(new AttributeInstance(wa));
            }
        }

        public double GetAttributeValue(WorldAttribute testAttribute)
        {
            foreach (AttributeInstance instance in _attributesList)
            {
                if (instance.AttachedAttribute.AttributeName.Equals(testAttribute.AttributeName) || instance.AttachedAttribute.UniqueWorldAttributeID.Equals(testAttribute.UniqueWorldAttributeID))
                {
                    return instance.Value;
                }
            }
            return double.NaN;
        }

        public double GetAttributeValue(string attributeName)
        {
            foreach (AttributeInstance instance in _attributesList)
            {
                if (instance.AttachedAttribute.AttributeName.Equals(attributeName))
                {
                    return instance.Value;
                }
            }
            return double.NaN;
        }

        public double GetAttributeValue(Guid attributeGuid)
        {
            foreach (AttributeInstance instance in _attributesList)
            {
                if (instance.AttachedAttribute.UniqueWorldAttributeID.Equals(attributeGuid))
                {
                    return instance.Value;
                }
            }
            return double.NaN;
        }

        public Alternative CloneObject()
        {
            Alternative clonedObject = new Alternative();
            clonedObject._alternativeID = this._alternativeID;
            clonedObject._alternativeNumber = this._alternativeNumber;

            foreach (AttributeInstance ai in _attributesList)
            {
                clonedObject._attributesList.Add(ai.CloneObject());
            }

            return clonedObject;
        }
    }
}
