using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DecisionTree.Portable
{
    /// <summary>
    /// Public Interface to communicate with the Heuristicwebservice
    /// </summary>
    public interface IDecisionHeuristicService
    {
        /// <summary>
        /// Give all accessible trees.
        /// </summary>
        /// <returns>Trees</returns>
        public List<Tree> ListTrees();
        /// <summary>
        /// Give all accessible datasets
        /// </summary>
        /// <returns>Datasets</returns>
        public List<Dataset> ListDatasets();
        /// <summary>
        /// Return all accessible Cues
        /// </summary>
        /// <returns>Cues</returns>
        public List<Cue> ListCues();

        /// <summary>
        /// Updates an existing tree in the database or if not existing create one.
        /// </summary>
        /// <param name="t">valid tree</param>
        /// <returns>Status message</returns>
        public string UpdateTree(Tree t);

        /// <summary>
        /// Updates an existing dataset in the database or if not existing create one.
        /// </summary>
        /// <param name="d">valid dataset</param>
        /// <returns>Status message</returns>
        public string UpdateDataset(Dataset d);

        /// <summary>
        /// Updates an existing cue in the database or if not existing create one.
        /// </summary>
        /// <param name="c">Valid cue</param>
        /// <returns>Status message</returns>
        public string UpdateCue(Cue c);

        /// <summary>
        /// Load an exisiting tree.
        /// </summary>
        /// <param name="id">The Treeid</param>
        /// <returns>The Treeobject</returns>
        public Tree LoadTree(long id);

        /// <summary>
        /// Load exisiting trees.
        /// </summary>
        /// <param name="ids">Treeids</param>
        /// <returns>List of trees</returns>
        public List<Tree> LoadTrees(List<long> ids);

        /// <summary>
        /// Load an existing dataset.
        /// </summary>
        /// <param name="id">Datasetid.</param>
        /// <returns>The Datasetobject</returns>
        public Tree LoadDataset(long id);

        /// <summary>
        /// Load an existing datasets.
        /// </summary>
        /// <param name="ids">Datasetids</param>
        /// <returns>List of datasets</returns>
        public List<Tree> LoadDatasets(List<long> ids);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Cue LoadCue(long id);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public Cue LoadCues(List<long> ids);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cueId"></param>
        /// <param name="dsId"></param>
        /// <returns></returns>

        public bool AddCueToDataset(long cueId, long dsId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cueId"></param>
        /// <param name="tId"></param>
        /// <returns></returns>
        public bool AddCueToTree(long cueId, long tId);
    }
}
