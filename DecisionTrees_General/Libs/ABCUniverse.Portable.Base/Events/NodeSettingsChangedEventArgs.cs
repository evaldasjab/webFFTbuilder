using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse.Portable.Trees;

namespace ABCUniverse.Portable.Global
{
    public class NodeSettingsChangedEventArgs: EventArgs
    {
        public string NodeName { get; set; }
        public CriterionOutcome CriterionSuccess { get; set; }
        public string LowCriterionExitLabel { get; set; }
        public string HighCriterionExitLabel { get; set; }
        public NodeSettings Settings { get; set; }
    }
}
