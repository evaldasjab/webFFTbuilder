using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ABCUniverse.DataStorage;

namespace ABCUniverse.DataAccess
{
    class ABCLocalContext: DbContext
    {
        public DbSet<AttributeInfo> AttributeInfos { get; set; }
        public DbSet<WorldInfo> WorldInfos { get; set; }
        public DbSet<DatasetInfo> DatasetInfos { get; set; }
        public DbSet<TreeInfo> TreeInfos { get; set; }

        public ABCLocalContext()
        {
            string directoryString = String.Format("{0}\\FFTreeBuilder", Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData));
            if (!Directory.Exists(directoryString))
                Directory.CreateDirectory(directoryString);

            base.Database.Connection.ConnectionString = String.Format("Data Source={0}\\ABCLocalData.sdf", directoryString);  
        }
            
    }
}
