using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using ABCUniverse.DataStorage;
using ABCUniverse.Portable.Trees;

namespace DecisionTreeWeb.Model
{
    public class ABCDBContext : DbContext
    {
        public DbSet<AttributeInfo> AttributeInfos { get; set; }
        public DbSet<WorldInfo> WorldInfos { get; set; }
        public DbSet<DatasetInfo> DatasetInfos { get; set; }
        public DbSet<TreeInfo> TreeInfos { get; set; }

        private string local = "Server=JOHANNES-PC\\JOHANNESWORKDB;Database=DecisionWebTest;user id=TestUser;password=testuser;";
        private string server = "Server=188.64.60.180;Database=DotWebResearch;user id=dotwebresearch_public;password=dotwebUSER#1;Trusted_Connection=False";

        public ABCDBContext()
        {
            base.Database.Connection.ConnectionString = local;            
        }

        public void SaveTree(DecisionTree tree)
        {
            try
            {
                DataContractSerializer dcs = new DataContractSerializer(typeof(DecisionTree));

                long kb = 0;

                using (MemoryStream ms = new MemoryStream())
                {
                    dcs.WriteObject(ms, tree);
                    kb = ms.Length / 1024;
                    
                    // set countnumber to treename
                    string idx = TreeInfos.Count().ToString();
                    TreeInfo t = new TreeInfo()
                    {
                        TreeInfoId = Guid.NewGuid(),
                        Name = string.Format("SommerInsitut_{0}", idx),
                        Data = ms.ToArray()
                    };

                    TreeInfos.Add(t);
                    SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
            }
        }
    }
}