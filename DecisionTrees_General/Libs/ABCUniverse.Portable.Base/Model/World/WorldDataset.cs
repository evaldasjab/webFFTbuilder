using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABCUniverse;
using System.Runtime.Serialization;
using System.IO;

namespace ABCUniverse.Portable
{
    /// <summary>
    /// WorldDataset verbindet eine Welt mit einem speziellen Datensatz. 
    /// Das zu lösende Problem besteht darin, dass Welten unabhängig von Datensätzen formuliert werden,
    /// diese Datensätze dann stattdessen auf der Grundlage der Definition einer Welt erzeugt werden
    /// (d.h. die in der Welt festgelegten AttachedAttribute werden verwendet, um Alternativen zu erzeugen
    /// und einem Datensatz zugeordnet, der anschließend in einer WorldDataset mit der World
    /// verbunden wird)
    /// Das grundsätzliche Vorgehen besteht dann darin, in einer UI-Anwendung eine World und aus den 
    /// in dieser definierten Datensätzen einen auszuwählen, um die dadurch temporär erzeugte WorldDataset 
    /// zu analysieren. Eine WorldDataset wird demzufolge nicht gespeichert, sondern besteht nur solange,
    /// wie eine Auswahl existiert
    /// </summary>
    /// 
    public class WorldDataset
    {
        Guid _uniqueWorldDatasetID;
        public Guid UniqueWorldDatasetID
        {
            get { return _uniqueWorldDatasetID; }
            set	{ _uniqueWorldDatasetID = value; }
        }

        string _name;
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }


        World _baseWorld;
        public World BaseWorld
        {
            get { return _baseWorld; }
            set { _baseWorld = value; }
        }

        List<Alternative> _alternativesList = new List<Alternative>();
        public List<Alternative> AlternativesList
        {
            get { return _alternativesList; }
            set { _alternativesList = value; }
        }

        private bool _selectedForAnalysis = false;
        public bool SelectedForAnalysis
        {
            get { return _selectedForAnalysis; }
            set { _selectedForAnalysis = value; }
        }

        private bool _defaultDataset = false;
        public bool DefaultDataset
        {
            get { return _defaultDataset; }
            set { _defaultDataset = value; }
        }

        //protected WorldDataset(SerializationInfo info, StreamingContext context)
        //{
        //	UniqueWorldDatasetID = Guid.Parse(info.GetString("UniqueWorldDatasetID"));
        //	Name = info.GetString("Name");
        //	BaseWorld = (World)info.GetValue("BaseWorld", typeof(World));
        //	AlternativesList = (List<Alternative>)info.GetValue("AlternativesList", typeof(List<Alternative>));
        //}

        //virtual public void GetObjectData(SerializationInfo info, StreamingContext context)
        //{
        //	info.AddValue("UniqueWorldDatasetID", UniqueWorldDatasetID.ToString());
        //	info.AddValue("Name", Name);
        //	info.AddValue("BaseWorld", BaseWorld);
        //	info.AddValue("AlternativesList", AlternativesList);
        //}

        public WorldDataset(World baseWorld)
        {
            _uniqueWorldDatasetID = Guid.NewGuid();
            _baseWorld = baseWorld;
        }

        public WorldDataset(World baseWorld, string name)
            : this(baseWorld)
        {
            _name = name;
        }

        public WorldDataset(World baseWorld, string name, string csvData)
            : this(baseWorld, name)
        {
            SetAlternatives(csvData);
        }

        public WorldDataset(World baseWorld, string name, List<Alternative> alternativesList)
            : this(baseWorld, name)
        {
            _alternativesList = alternativesList;
        }

        public WorldDataset CloneObject()
        {
            WorldDataset wi = new WorldDataset(this._baseWorld);
            wi._name = this._name;
            wi._uniqueWorldDatasetID = this._uniqueWorldDatasetID;

            foreach (Alternative alt in this._alternativesList)
                wi._alternativesList.Add(alt.CloneObject());

            return wi;
        }

        void SetAlternatives(string csv)
        {
            string[] csvLines = csv.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.None);

            int altCount = -1;
            foreach (string s in csvLines)
            {
                altCount++;
                if (altCount == 0)
                {
                    List<WorldAttribute> attributes = _baseWorld.AttributesList;
                    bool checkSuccessful = true;
                    string[] split = s.Split(';');
                    for (int i = 0; i < split.Length; i++)
                    {
                        if (!split[i].Equals(attributes[i].AttributeName))
                            checkSuccessful = false;
                    }

                    if (!checkSuccessful)
                        throw new Exception("attributes names not assigned correctly");
                }
                else
                {
                    Alternative alt = new Alternative(_baseWorld, altCount);
                    string[] split = s.Split(';');

                    for (int col = 0; col < alt.AttributesList.Count; col++)
                    {
                        string sub = split[col];
                        double val = 0;
                        try
                        {
                            val = Convert.ToDouble(sub);
                        }
                        catch (Exception ex)
                        {
                            val = Double.NaN;
                        }

                        if (val < alt.AttributesList[col].AttachedAttribute.MinimumValue)
                            alt.AttributesList[col].AttachedAttribute.MinimumValue = val;

                        if (val > alt.AttributesList[col].AttachedAttribute.MaximumValue)
                            alt.AttributesList[col].AttachedAttribute.MaximumValue = val;

                        alt.AttributesList[col].Value = val;
                    }
                    _alternativesList.Add(alt);
                }
            }
        }

        public string GetDataCSV()
        {
            int iRow = 0;
            StringBuilder sbCSVOutput=new StringBuilder();
            foreach (Alternative alt in _alternativesList)
            {
                iRow++;
                if (iRow == 1)
                {
                    foreach (AttributeInstance att in alt.AttributesList)
                    {
                        sbCSVOutput.AppendFormat("{0};", att.AttachedAttribute.AttributeName);
                    }
                    sbCSVOutput.Remove(sbCSVOutput.Length - 1, 1).Append(Environment.NewLine);
                }
                foreach (AttributeInstance att in alt.AttributesList)
                {
                    sbCSVOutput.AppendFormat("{0:F2};", att.Value);
                }
                sbCSVOutput.Remove(sbCSVOutput.Length - 1, 1).Append(Environment.NewLine);
            }
            sbCSVOutput.Remove(sbCSVOutput.Length - 1, 1);

            return sbCSVOutput.ToString();
        }
    }
}
