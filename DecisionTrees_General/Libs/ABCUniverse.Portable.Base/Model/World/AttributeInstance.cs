using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace ABCUniverse.Portable
{
    public class AttributeInstance
    {
        WorldAttribute _attachedAttribute = null;
        public WorldAttribute AttachedAttribute
        {
            get { return _attachedAttribute; }
            set { _attachedAttribute = value; }
        }

        double _value = -1;
        public double Value
        {
            get { return _value; }
            set
            {
                _value = value;
            }
        }

        double _flippedValue = -1;
        public double FlippedValue
        {
            get { return _flippedValue; }
            set
            {
                _flippedValue = value;
            }
        }

        //protected AttributeInstance(SerializationInfo info, StreamingContext context)
        //{
        //	AttachedAttribute = (WorldAttribute)info.GetValue("AttachedAttribute", typeof(WorldAttribute));
        //	Value = info.GetDouble("Value");
        //	FlippedValue = info.GetDouble("FlippedValue");
        //}

        //virtual public void GetObjectData(SerializationInfo info, StreamingContext context)
        //{
        //	info.AddValue("AttachedAttribute", AttachedAttribute, typeof(WorldAttribute));
        //	info.AddValue("Value", Value);
        //	info.AddValue("FlippedValue", FlippedValue);
        //}

        public AttributeInstance(WorldAttribute attachedAttribute)
        {
            _attachedAttribute = attachedAttribute;
        }

        public AttributeInstance(WorldAttribute attachedAttribute, double value)
            : this(attachedAttribute)
        {
            _value = value;
        }

        internal AttributeInstance CloneObject()
        {
            AttributeInstance clonedObject = new AttributeInstance(this._attachedAttribute, this._value);
            return clonedObject;
        }
    }
}
