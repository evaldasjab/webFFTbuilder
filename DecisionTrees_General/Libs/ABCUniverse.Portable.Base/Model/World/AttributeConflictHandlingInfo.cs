using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Global
{
    public class AttributeConflictHandlingInfo
    {
        //WorldAttribute _existingLocalAttribute;
        //public WorldAttribute ExistingLocalAttribute
        //{
        //    get { return _existingLocalAttribute; }
        //    set { _existingLocalAttribute = value; }
        //}

        WorldAttribute _attributeToBeImported;
        public WorldAttribute AttributeToBeImported
        {
            get { return _attributeToBeImported; }
            set { _attributeToBeImported = value; }
        }

        ConflictHandlingStrategy _conflictHandlingStrategy;
        public ConflictHandlingStrategy HandleConflictStrategy
        {
            get { return _conflictHandlingStrategy; }
            set { _conflictHandlingStrategy = value; }
        }

        string _changedLocalName = "";

        bool _ignore = false;
        public bool Ignore
        {
            get { return _ignore; }
            set { _ignore = value; }
        }

        bool _conflictDetected = false;
        public bool ConflictDetected
        {
            get { return _conflictDetected; }
            set { _conflictDetected = value; }
        }
        
        public string ChangedLocalName
        {
            get { return _changedLocalName; }
            set { _changedLocalName = value; }
        }

        public AttributeConflictHandlingInfo()
        {
            _conflictHandlingStrategy = ConflictHandlingStrategy.UNDEFINED;
        }

        public AttributeConflictHandlingInfo(WorldAttribute serverAtt): this()
        {
            _attributeToBeImported = serverAtt;
            _changedLocalName = _attributeToBeImported.AttributeName + "_LOC";
        }

        // wenn kein Konflikt, einfach neues Attribut hinzufügen
        // wenn Konflikt -> entweder existierendes Attribut umbenennen und neues Attribut hinzufügen oder 
        //                  WorldAttribute auf zu importierendes Attribut ändern
        public WorldAttribute GetAttributeWithConflictHandling(WorldAttribute existingLocalAttribute)
        {
            WorldAttribute addAttribute = null;
            if (_conflictHandlingStrategy == ConflictHandlingStrategy.RENAME_LOCAL)
                existingLocalAttribute.AttributeName = _changedLocalName;
                
            addAttribute = _attributeToBeImported;
            return addAttribute;
        }
    }
}
