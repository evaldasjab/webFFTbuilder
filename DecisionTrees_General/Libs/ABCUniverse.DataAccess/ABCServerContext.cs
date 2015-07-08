using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ABCUniverse.DataStorage;

namespace ABCUniverse.DataAccess
{
    public class ABCServerContext: DbContext
    {
        public DbSet<AttributeInfo> AttributeInfos { get; set; }
        public DbSet<WorldInfo> WorldInfos { get; set; }
        public DbSet<DatasetInfo> DatasetInfos { get; set; }
        public DbSet<TreeInfo> TreeInfos { get; set; }
        public DbSet<TreeUserInfo> TreeUserInfos { get; set; }
        // const string _connectionString = "Server=188.64.60.8;Database=dotwebresearch;user id=dotwebresearch_public;password=sp2Gn1m;";
		const string _connectionString = "Server=188.64.60.8;Database=dotwebresearch;user id=dotwebresearch_admin;password=ov9wG8Q;";

        public ABCServerContext()
        {
            base.Database.Connection.ConnectionString = _connectionString;  
        }

        public static bool ServerConnectionAvailable()
        {
            if (!System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable())
                return false;

            try
            {
                using (var c = new SqlConnection(_connectionString))
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

    }
}
