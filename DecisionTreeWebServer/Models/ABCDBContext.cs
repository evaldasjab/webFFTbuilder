using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using ABCUniverse.DataStorage;
using ABCUniverse.Portable.Trees;
using ABCUniverse.DataAccess;
using System.Data.SqlClient;

namespace DecisionTreeWeb.Model
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

        public static bool ServerConnectionAvailable()
        {
            if (!System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable())
                return false;

            try
            {
                using (var c = new SqlConnection(server))
                {
                    c.Open();
                }
                return true;
            }
            catch (Exception)
            {
                return false;
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