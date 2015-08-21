using System;
using System.Runtime.Serialization;

namespace ABCUniverse.Portable.Global
{
    [DataContract]
    public enum AttributeDecision
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        EXIT,
        [EnumMember]
        CONTINUE
    }

    [DataContract]
    public enum CriterionOutcome
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        HIGH,
        [EnumMember]
        LOW
    }

    [DataContract]
    public enum DataType
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        NUMBER,
        [EnumMember]
        CATEGORY
    }

    [DataContract]
    public enum AttributePredictionDirection
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        REGULAR,
        [EnumMember]
        REVERSED
    }

    [DataContract]
    public enum DecisionOutcome
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        HIT,
        [EnumMember]
        MISS,
        [EnumMember]
        FA,
        [EnumMember]
        CR
    }

    [DataContract]
    public enum EmitterLanguage
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        MATLAB,
        [EnumMember]
        OCTAVE,
        [EnumMember]
        R,
        [EnumMember]
        CSHARP,
        [EnumMember]
        JAVA
    }

    [DataContract]
    public enum ConflictHandlingStrategy
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        CREATE,
        [EnumMember]
        RENAME_NEW,
        [EnumMember]
        RENAME_LOCAL,
        [EnumMember]
        USE_LOCAL
    }

    [DataContract]
    public enum DataImportStrategy
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        EXACT,
        [EnumMember]
        INCLUSION,
        [EnumMember]
        EXTENSION,
        [EnumMember]
        CREATE
    }

    [DataContract]
    public enum ExchangeDirection
    {
        [EnumMember]
        UNDEFINED,
        [EnumMember]
        IMPORT,
        [EnumMember]
        EXPORT
    }
}