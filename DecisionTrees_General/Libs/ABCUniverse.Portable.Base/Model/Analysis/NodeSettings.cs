using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable.Global;
using System.Runtime.Serialization;

namespace ABCUniverse.Portable.Trees
{
    /*
     * Für jeden Knoten eines Baumes wird in einem TreeSettings-Objekt ein
     * NodeSettings-Objekt erzeugt und in der Reihenfolge des Auftretens im Baum 
     * der NodeSettings-Liste hinzugefügt; die Informationen, die in einem 
     * NodeSettings-Objekt abgelegt werden sind bis auf die Name-Eigenschaft
     * unabhängig vom Attribut, das dem Knotenobjekt zugeordnet ist; diese
     * lassen sich nicht durch NodeSettings verändern; die in den NodeSettings
     * abgelegten Informationen stellen hingegen TEMPORÄRE Werte zur Verfügung,
     * mit denen die die Auswertung eines Datensatzes durch einen Baum steuern
     * lässt und die bei der Auswertung verwendet werden, um einen konkreten
     * Baum unter verschiedenen Einstellungen hinsichtlich seiner Wirkung auf
     * die Analyse betrachten (und nachverfolgen) zu können
     * 
     * BEISPIEL
     * ========
     * 
     * Welt besteht aus Attributen A, B, C, D, E
     * Folgender Datensatz "sampledata" besteht:
     * A B C D E
     * 1 0 0 1 10
     * 1 0 1 1 12
     * 1 1 0 1 17
     * 1 0 0 0  9
     * 0 1 0 1 14
     * 0 0 0 1 16
     * 
     * Folgender Baum "sampletree" wird definiert
     * 
     *			 A
     *			/ \
     *		   X   B
     *			  / \
     *			 C   X
     *			/ \
     *		   X   X
     *		   
     * Für die Auswertung des Baumes wird ein TreeSettings-Objekt (1) definiert:
     * =========================================================================
     * 
     * Kriterium E mit temporärem Splitwert E_split (hier=13)
     * EXIT-Label für Ausgang bei E<E_split (LOW RISK)
     * EXIT-Label für Ausgang bei E>=E_split (HIGH RISK)
     * NodeSettings-Objekt für Knoten A, Split-Wert: A_split = 0.5 (aus Daten abgeleitet), Direction: Regular
     * NodeSettings-Objekt für Knoten B, Split-Wert: B_split = 0.5 (aus Daten abgeleitet), Direction: Regular
     * NodeSettings-Objekt für Knoten C, Split-Wert: C_split = 0.5 (aus Daten abgeleitet); Direction: Reverse
     * 
     * Aus diesen Informationen können wir folgende Auswertung ableiten:
     * =================================================================
     * Analyse von "sampletree" mit treesettings (1) über Datensatz "sampledata"
     * -> (a) 1 0 0 | 10 => A>0.5 -> B<0.5 -> C<0.5 (REVERSE) => EXIT => TREE PREDICTION: HIGH => OBSERVED: LOW => FA
     * -> (b) 1 0 1 | 12 => A>0.5 -> B<0.5 -> C<0.5 (REVERSE) => EXIT => TREE PREDICTION: LOW  => OBSERVED: LOW => CR
     * -> (c) 1 1 0 | 17 => A>0.5 -> B>0.5 -> EXIT => TREE PREDICTION: HIGH => OBSERVED: HIGH  => H
     * -> (d) 1 0 0 |  9 => A>0.5 -> B<0.5 -> C<0.5 (REVERSE) => EXIT => TREE PREDICTION: HIGH => OBSERVED: LOW => FA
     * -> (e) 0 1 0 | 14 => A<0.5 -> EXIT => TREE PREDICTION: LOW => OBSERVED: HIGH => MISS
     * -> (f) 0 0 0 | 16 => A>0.5 -> EXIT => TREE PREDICTION: LOW => OBSERVED: HIGH => MISS
     * 
     * Für die Auswertung des Baumes wird ein TreeSettings-Objekt (2) definiert:
     * =========================================================================
     * 
     * Kriterium E mit temporärem Splitwert E_split (hier=11)
     * EXIT-Label für Ausgang bei E<E_split (LOW RISK)
     * EXIT-Label für Ausgang bei E>=E_split (HIGH RISK)
     * NodeSettings-Objekt für Knoten A, Split-Wert: A_split = 0.5 (aus Daten abgeleitet), Direction: Regular
     * NodeSettings-Objekt für Knoten B, Split-Wert: B_split = 0.5 (aus Daten abgeleitet), Direction: Regular
     * NodeSettings-Objekt für Knoten C, Split-Wert: C_split = 0.5 (aus Daten abgeleitet); Direction: Reverse
     * 
     * Aus diesen Informationen können wir folgende Auswertung ableiten:
     * =================================================================
     * Analyse von "sampletree" mit treesettings (1) über Datensatz "sampledata"
     * -> (a) 1 0 0 | 10 => A>0.5 -> B<0.5 -> C<0.5 (REVERSE) => EXIT => TREE PREDICTION: HIGH => OBSERVED: LOW => FA
     * -> (b) 1 0 1 | 12 => A>0.5 -> B<0.5 -> C<0.5 (REVERSE) => EXIT => TREE PREDICTION: LOW  => OBSERVED: HIGH => MISS
     * -> (c) 1 1 0 | 17 => A>0.5 -> B>0.5 -> EXIT => TREE PREDICTION: HIGH => OBSERVED: HIGH  => H
     * -> (d) 1 0 0 |  9 => A>0.5 -> B<0.5 -> C<0.5 (REVERSE) => EXIT => TREE PREDICTION: HIGH => OBSERVED: LOW => FA
     * -> (e) 0 1 0 | 14 => A<0.5 -> EXIT => TREE PREDICTION: LOW => OBSERVED: HIGH => MISS
     * -> (f) 0 0 0 | 16 => A>0.5 -> EXIT => TREE PREDICTION: LOW => OBSERVED: HIGH => MISS
     * 
     * Für die Auswertung des Baumes wird ein TreeSettings-Objekt (3) definiert:
     * =========================================================================
     * 
     * Kriterium E mit temporärem Splitwert E_split (hier=13)
     * EXIT-Label für Ausgang bei E<E_split (LOW RISK)
     * EXIT-Label für Ausgang bei E>=E_split (HIGH RISK)
     * NodeSettings-Objekt für Knoten A, Split-Wert: A_split = 0.5 (aus Daten abgeleitet), Direction: Reverse
     * NodeSettings-Objekt für Knoten B, Split-Wert: B_split = 0.5 (aus Daten abgeleitet), Direction: Regular
     * NodeSettings-Objekt für Knoten C, Split-Wert: C_split = 0.5 (aus Daten abgeleitet); Direction: Regular
     * 
     * Aus diesen Informationen können wir folgende Auswertung ableiten:
     * =================================================================
     * Analyse von "sampletree" mit treesettings (1) über Datensatz "sampledata"
     * -> (a) 1 0 0 | 10 => A>0.5 (REVERSE) -> B<0.5 -> C<0.5 => EXIT => TREE PREDICTION: LOW => OBSERVED: LOW => CR
     * -> (b) 1 0 1 | 12 => A>0.5 (REVERSE) -> B<0.5 -> C<0.5 => EXIT => TREE PREDICTION: HIGH  => OBSERVED: LOW => FA
     * -> (c) 1 1 0 | 17 => A>0.5 (REVERSE) -> B>0.5 -> EXIT => TREE PREDICTION: HIGH => OBSERVED: HIGH  => H
     * -> (d) 1 0 0 |  9 => A>0.5 (REVERSE) -> B<0.5 -> C<0.5 => EXIT => TREE PREDICTION: LOW => OBSERVED: LOW => CR
     * -> (e) 0 1 0 | 14 => A<0.5 (REVERSE) -> EXIT => TREE PREDICTION: HIGH => OBSERVED: HIGH => H
     * -> (f) 0 0 0 | 16 => A>0.5 (REVERSE) -> EXIT => TREE PREDICTION: HIGH => OBSERVED: HIGH => H
    */

    [DataContract]
    public class NodeSettings
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public bool UseAttributeCategories { get; set; }

        [DataMember]
        public int NumberOfAttributeCategories { get; set; }

        [DataMember]
        public bool AttributeAutoSplit { get; set; }

        [DataMember]
        public AttributePredictionDirection AttributePrediction { get; set; }

        [DataMember]
        public double AttributeSplitValue { get; set; }

        [DataMember]
        public double AttributeMinimum { get; set; }

        [DataMember]
        public double AttributeMaximum { get; set; }

        [DataMember]
        public string AttributeLowValuePredictionBranch { get; set; }

        [DataMember]
        public string AttributeHighValuePredictionBranch { get; set; }

        [DataMember]
        public string LowCriterionOutcomeLabel { get; set; }

        [DataMember]
        public string HighCriterionOutcomeLabel { get; set; }

        public NodeSettings(string attributeName, double attributeMin, double attributeMax)
        {
            Name = attributeName;
            NumberOfAttributeCategories = 2;
            AttributeAutoSplit = true;
            AttributePrediction = AttributePredictionDirection.REGULAR;
            AttributeMinimum = attributeMin;
            AttributeMaximum = attributeMax;
            AttributeSplitValue = AttributeMinimum + ((AttributeMaximum - AttributeMinimum) / 2);
            AttributeLowValuePredictionBranch = "low";
            AttributeHighValuePredictionBranch = "high";
            LowCriterionOutcomeLabel = "failure";
            HighCriterionOutcomeLabel = "success";
        }

        public NodeSettings CloneNodeSettings()
        {
            NodeSettings clone = new NodeSettings(this.Name, this.AttributeMinimum, this.AttributeMaximum);
            clone.NumberOfAttributeCategories = this.NumberOfAttributeCategories;
            clone.AttributeAutoSplit = this.AttributeAutoSplit;
            clone.AttributePrediction = this.AttributePrediction;
            clone.AttributeSplitValue = this.AttributeSplitValue;
            clone.AttributeLowValuePredictionBranch = this.AttributeLowValuePredictionBranch;
            clone.AttributeHighValuePredictionBranch = this.AttributeHighValuePredictionBranch;
            clone.LowCriterionOutcomeLabel = this.LowCriterionOutcomeLabel;
            clone.HighCriterionOutcomeLabel = this.HighCriterionOutcomeLabel;
            return clone;
        }
    }
}
