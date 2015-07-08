using ABCUniverse.Portable.Trees.Analysis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Global
{
    public class TreeAnalysisCompletedEventArgs : EventArgs
    {
        public TreeAnalysis Analysis { get; set; }
    }
}
