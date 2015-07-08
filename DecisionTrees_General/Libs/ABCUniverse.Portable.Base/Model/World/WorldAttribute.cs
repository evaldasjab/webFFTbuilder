using ABCUniverse.Portable.Global;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace ABCUniverse.Portable
{
    [DataContract]
    public class WorldAttribute : IEquatable<WorldAttribute>
    {
        Guid _uniqueWorldAttributeID;
        [DataMember]
        public Guid UniqueWorldAttributeID
        {
            get { return _uniqueWorldAttributeID; }
            set { _uniqueWorldAttributeID = value; }
        }

        bool _unbound = false;
        [DataMember]
        public bool Unbound
        {
            get { return _unbound; }
            set { _unbound = value; }
        }

        string _attributeName;
        [DataMember]
        public string AttributeName
        {
            get { return _attributeName; }
            set { _attributeName = value; }
        }

        string _attributeLabel;
        [DataMember]
        public string AttributeLabel
        {
            get { return _attributeLabel; }
            set { _attributeLabel = value; }
        }

        string _attributeDescription;
        [DataMember]
        public string AttributeDescription
        {
            get { return _attributeDescription; }
            set { _attributeDescription = value; }
        }

        DataType _datatype;
        [DataMember]
        public DataType Datatype
        {
            get { return _datatype; }
            set { _datatype = value; }
        }

        double _validity;
        [DataMember]
        public double Validity
        {
            get { return _validity; }
            set { _validity = value; }
        }

        double _minimumValue;
        [DataMember]
        public double MinimumValue
        {
            get { return _minimumValue; }
            set { _minimumValue = value; }
        }

        double _maximumValue;
        [DataMember]
        public double MaximumValue
        {
            get { return _maximumValue; }
            set { _maximumValue = value; }
        }

        bool _isFlipped = false;
        [DataMember]
        public bool IsFlipped
        {
            get { return _isFlipped; }
            set
            {
                _isFlipped = value;
            }
        }

        bool _isBinary = false;
        [DataMember]
        public bool IsBinary
        {
            get { return _isBinary; }
            set
            {
                _isBinary = value;
            }
        }

        double _binarySplitValue = 0;
        [DataMember]
        public double BinarySplitValue
        {
            get { return _binarySplitValue; }
            set
            {
                _binarySplitValue = value;
            }
        }

        bool _isCriterion = false;
        [DataMember]
        public bool IsCriterion
        {
            get { return _isCriterion; }
            set { _isCriterion = value; }
        }

        List<double> _values;
        [DataMember]
        public List<double> Values
        {
            get { return _values; }
            set { _values = value; }
        }

        //protected WorldAttribute(SerializationInfo info, StreamingContext context)
        //{
        //	UniqueWorldAttributeID = Guid.Parse(info.GetString("UniqueWorldAttributeID"));
        //	Name = info.GetString("Name");
        //	Datatype = (DataType)info.GetValue("Datatype", typeof(DataType));
        //	MinimumValue = info.GetDouble("MinimumValue");
        //	MaximumValue = info.GetDouble("MaximumValue");
        //	IsBinary = info.GetBoolean("IsBinary");
        //	BinarySplitValue = info.GetDouble("BinarySplitValue");
        //}

        //virtual public void GetObjectData(SerializationInfo info, StreamingContext context)
        //{
        //	info.AddValue("UniqueWorldAttributeID", UniqueWorldAttributeID.ToString());
        //	info.AddValue("Name", Name);
        //	info.AddValue("Datatype", Datatype, typeof(DataType));
        //	info.AddValue("MinimumValue", MinimumValue);
        //	info.AddValue("MaximumValue", MaximumValue);
        //	info.AddValue("IsBinary", IsBinary);
        //	info.AddValue("BinarySplitValue", BinarySplitValue);
        //}

        public WorldAttribute()
        {
            UniqueWorldAttributeID = Guid.NewGuid();
            AttributeName = "[name]";
            AttributeLabel = "[label]";
            AttributeDescription = "[description]";
            Datatype = DataType.UNDEFINED;
            Validity = 0;
            IsFlipped = false;
            MinimumValue = 0;
            MaximumValue = 0;
            IsBinary = false;
            BinarySplitValue = 0;
            _values = new List<double>();
            //_values = new SortedSet<double>();
        }

        public WorldAttribute(string name)
            : this()
        {
            AttributeName = name;
            AttributeLabel = name;
        }

        public WorldAttribute(string name, DataType dataType, double minimumValue, double maximumValue, bool isBinary, double binarySplitValue)
            : this(name)
        {
            Datatype = dataType;
            MinimumValue = minimumValue;
            MaximumValue = maximumValue;
            IsBinary = isBinary;
            BinarySplitValue = binarySplitValue;
        }

        public WorldAttribute(string name, DataType dataType, double minimumValue, double maximumValue, bool isBinary, double binarySplitValue, double validity, bool isFlipped, List<double> values)
            : this(name, dataType, minimumValue, maximumValue, isBinary, binarySplitValue)
        {
            _validity = validity;
            _isFlipped = isFlipped;
            _values = values;
        }

        public static long GetSize()
        {
            return GC.GetTotalMemory(false);
        }

        public WorldAttribute CloneObject()
        {
            WorldAttribute wa = new WorldAttribute();
            wa._binarySplitValue = this._binarySplitValue;
            wa._datatype = this._datatype;
            wa._isBinary = this._isBinary;
            wa._isCriterion = this._isCriterion;
            wa._isFlipped = this._isFlipped;
            wa._maximumValue = this._maximumValue;
            wa._minimumValue = this._minimumValue;
            wa._attributeName = this._attributeName;
            wa._attributeLabel = this._attributeLabel;
            wa._attributeDescription = this._attributeDescription;
            wa._unbound = this._unbound;
            wa._uniqueWorldAttributeID = this._uniqueWorldAttributeID;
            wa._validity = this._validity;
            double[] arData = new double[this._values.Count];
            this._values.CopyTo(arData);
            wa._values = arData.ToList();

            return wa;
        }

        public bool Equals(WorldAttribute other)
        {

            //Check whether the compared object is null. 
            if (Object.ReferenceEquals(other, null)) return false;

            //Check whether the compared object references the same data. 
            if (Object.ReferenceEquals(this, other)) return true;

            //Check whether the products' properties are equal. 
            return UniqueWorldAttributeID.Equals(other.UniqueWorldAttributeID) && AttributeName.Equals(other.AttributeName);
        }

        // If Equals() returns true for a pair of objects  
        // then GetHashCode() must return the same value for these objects. 

        public override int GetHashCode()
        {

            //Get hash code for the Name field if it is not null. 
            int hashProductName = AttributeName == null ? 0 : AttributeName.GetHashCode();

            //Get hash code for the Code field. 
            int hashProductCode = UniqueWorldAttributeID.GetHashCode();

            //Calculate the hash code for the product. 
            return hashProductName ^ hashProductCode;
        }
        //
    }
}
