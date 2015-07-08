using ABCUniverse.Portable.Trees;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace ABCUniverse.Portable
{
    [DataContract(IsReference = true)]
    public class World
    {
        public int WorldId { get; set; }

        Guid _uniqueWorldID;
        [DataMember]
        public Guid UniqueWorldID
        {
            get { return _uniqueWorldID; }
            set { _uniqueWorldID = value; }
        }

        string _name;
        [DataMember]
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        List<WorldAttribute> _attributesList = new List<WorldAttribute>();
        [DataMember]
        public List<WorldAttribute> AttributesList
        {
            get { return _attributesList; }
            set { _attributesList = value; }
        }

        List<WorldDataset> _attachedDatasets = new List<WorldDataset>();
        public List<WorldDataset> AttachedDatasets
        {
            get { return _attachedDatasets; }
            set { _attachedDatasets = value; }
        }

        public World()
        {
            _uniqueWorldID = Guid.NewGuid();
        }

        public World(string name)
            : this()
        {
            _name = name;
        }

        public World(string name, List<WorldAttribute> attributesList)
            : this(name)
        {
            if (attributesList != null)
                _attributesList = attributesList;
        }

        public World(string name, List<WorldAttribute> attributesList, List<WorldDataset> attachedDatasets)
            : this(name)
        {
            if (_attributesList != null)
                _attributesList = attributesList;
            if (attachedDatasets != null)
                _attachedDatasets = attachedDatasets;
        }

        public World(World copy)
        {
            this._name = copy._name;
            this._attributesList = copy._attributesList;
            this._attachedDatasets = copy._attachedDatasets;
        }
    }
}
