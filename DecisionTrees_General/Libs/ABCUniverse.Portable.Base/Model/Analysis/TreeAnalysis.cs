using ABCUniverse.Portable.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Trees.Analysis
{
    public class TreeAnalysis
    {
        public int AnalysisNumber { get; set; }
        public string AnalysisName { get; set; }
        public string TreeName { get; set; }
        public int TreeSettingsNumber { get; set; }
        public List<string> AnalysisTableInfo { get; set; }
        public TreeStatistics AnalysisTable { get; set; }
        public List<TrackingInfo> AnalysisTrackingData { get; set; }

        public TreeAnalysis()
        {
            AnalysisTableInfo = new List<string>();
            AnalysisTable = new TreeStatistics();
            AnalysisTrackingData = new List<TrackingInfo>();
        }
    }
}
