using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using ABCUniverse.DataAccess;
using ABCUniverse.DataStorage;
using ABCUniverse.Portable.Trees;

namespace DecisionTreeWebGeneral.Areas.Project.Models
{

    public class ABCDBContext : ABCServerContext
    {
        const string local = "Server=JOHANNES-PC\\JOHANNESWORKDB;Database=DecisionWebTest;user id=TestUser;password=testuser;";
        const string server = "Server=188.64.60.180;Database=DotWebResearch;user id=dotwebresearch_public;password=dotwebUSER#1;Trusted_Connection=False";

        static ABCDBContext() {
            Database.SetInitializer<ABCDBContext>(new CustomInitliazer());
        }

        public ABCDBContext()
        {
            switch (Environment.MachineName)
            {
                //case "JOHANNES-PC":
                //    base.Database.Connection.ConnectionString = local;
                //    break;
                default:
                    base.Database.Connection.ConnectionString = server;
                    break;
            }
        }

        public string SaveTree(DecisionTree tree)
        {
            try
            {
                DataContractSerializer dcs = new DataContractSerializer(typeof(DecisionTree));

                long kb = 0;

                // set countnumber to treename
                string name = string.Format("SI_{0}", TreeInfos.Count().ToString());
                tree.Name = name;

                using (MemoryStream ms = new MemoryStream())
                {
                    dcs.WriteObject(ms, tree);
                    kb = ms.Length / 1024;
                    
                    
                    TreeInfo t = new TreeInfo()
                    {
                        TreeInfoId = Guid.NewGuid(),
                        Name = name,
                        Data = ms.ToArray()
                    };           

                    TreeInfos.Add(t);
                    SaveChanges();
                    return t.Name;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return e.Message;
            }
        }

     
        private class CustomInitliazer : IDatabaseInitializer<ABCDBContext>
        {

            public void InitializeDatabase(ABCDBContext context)
            {
                // do nothing
                if (context.Database.Exists())
                {
                    return;
                }
            }
        }
    }
}