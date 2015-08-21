using ABCUniverse;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.Text;
using ABCUniverse.DataStorage;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Security.Cryptography;
using System.Data.SqlClient;
using System.Configuration;
using System.Net.NetworkInformation;
using System.IO.Compression;
using ABCUniverse.Portable;
using ABCUniverse.Portable.Trees;
using ABCUniverse.Portable.Global;

namespace ABCUniverse.DataAccess
{
    public class WorldDataManager
    {
        #region Event-Handler
        #region LOCAL EVENTS
        public static event EventHandler<LocalWorldChangedEventArgs> SendLocalWorldChangedEvent;
        public static event EventHandler<LocalTreeCollectionChangedEventArgs> SendLocalTreeCollectionChangedEvent;
        #endregion
        #region SERVER EVENTS
        public static event EventHandler<ServerWorldChangedEventArgs> SendServerWorldChangedEvent;
        public static event EventHandler<ServerTreeCollectionChangedEventArgs> SendServerTreeCollectionChangedEvent;
        #endregion
        #endregion

        #region Fields/Properties
        static string _errorLogFilePath = "";
        public static string ErrorLogPath
        {
            get { return WorldDataManager._errorLogFilePath; }
            set { WorldDataManager._errorLogFilePath = value; }
        }

        static bool _serverDBConnectionAvailable = false;
        public static bool ServerDBConnectionAvailable
        {
            get {
                WorldDataManager._serverDBConnectionAvailable = ABCServerContext.ServerConnectionAvailable();
                return WorldDataManager._serverDBConnectionAvailable; }
        }

        #region LOCAL PROPERTIES
        static List<WorldAttribute> _unboundLocalList;
        public static List<WorldAttribute> UnboundLocalList
        {
            get { return WorldDataManager._unboundLocalList; }
            set { WorldDataManager._unboundLocalList = value; }
        }

        static bool _localWorldsCollectionChanged = true;
        public static bool LocalWorldsCollectionChanged
        {
            get
            {
                return WorldDataManager._localWorldsCollectionChanged;
            }
            set
            {
                WorldDataManager._localWorldsCollectionChanged = value;
            }
        }

        static bool _localAttributesCollectionChanged = true;
        public static bool LocalAttributesCollectionChanged
        {
            get
            {
                return WorldDataManager._localAttributesCollectionChanged;
            }
            set
            {
                WorldDataManager._localAttributesCollectionChanged = value;
            }
        }

        static bool _localTreesCollectionChanged = true;
        public static bool LocalTreesCollectionChanged
        {
            get
            {
                return WorldDataManager._localTreesCollectionChanged;
            }
            set
            {
                WorldDataManager._localTreesCollectionChanged = value;
            }
        }

        static bool _localDatabaseChanged = true;
        public static bool LocalDatabaseChanged
        {
            get { return WorldDataManager._localDatabaseChanged; }
            set { WorldDataManager._localDatabaseChanged = value; }
        }

        static List<WorldAttribute> _localAttributesList;
        public static List<WorldAttribute> LocalAttributesList
        {
            get { return _localAttributesList; }
            set { _localAttributesList = value; }
        }

        static List<DecisionTree> _localTreesList;
        public static List<DecisionTree> LocalTreesList
        {
            get
            {
                return WorldDataManager._localTreesList;
            }
            set
            {
                WorldDataManager._localTreesList = value;
            }
        }

        static List<string> _localWorldNamesList;
        public static List<string> LocalWorldNamesList
        {
            get { return _localWorldNamesList; }
            set { _localWorldNamesList = value; }
        }

        static List<WorldAttribute> _serverAttributesList;
        public static List<WorldAttribute> ServerAttributesList
        {
            get { return _serverAttributesList; }
            set { _serverAttributesList = value; }
        }
        #endregion

        #region SERVER PROPERTIES
        static List<WorldAttribute> _unboundServerList;
        public static List<WorldAttribute> UnboundServerList
        {
            get { return WorldDataManager._unboundServerList; }
            set { WorldDataManager._unboundServerList = value; }
        }

        static bool _serverWorldsCollectionChanged = true;
        public static bool ServerWorldsCollectionChanged
        {
            get
            {
                return WorldDataManager._serverWorldsCollectionChanged;
            }
            set
            {
                WorldDataManager._serverWorldsCollectionChanged = value;
            }
        }

        static bool _serverAttributesCollectionChanged = true;
        public static bool ServerAttributesCollectionChanged
        {
            get
            {
                return WorldDataManager._serverAttributesCollectionChanged;
            }
            set
            {
                WorldDataManager._serverAttributesCollectionChanged = value;
            }
        }

        static bool _serverTreesCollectionChanged = true;
        public static bool ServerTreesCollectionChanged
        {
            get
            {
                return WorldDataManager._serverTreesCollectionChanged;
            }
            set
            {
                WorldDataManager._serverTreesCollectionChanged = value;
            }
        }

        static bool _serverDatabaseChanged = true;
        public static bool ServerDatabaseChanged
        {
            get { return WorldDataManager._serverDatabaseChanged; }
            set { WorldDataManager._serverDatabaseChanged = value; }
        }

        static List<DecisionTree> _serverTreesList;
        public static List<DecisionTree> ServerTreesList
        {
            get { return WorldDataManager._serverTreesList; }
            set { WorldDataManager._serverTreesList = value; }
        }

        static List<World> _localWorldsList;
        public static List<World> LocalWorldsList
        {
            get { return _localWorldsList; }
            set { _localWorldsList = value; }
        }

        static List<World> _serverWorldsList;
        public static List<World> ServerWorldsList 
        {
            get { return _serverWorldsList; }
            set { _serverWorldsList = value; }
        }

        static List<string> _serverWorldNamesList;
        public static List<string> ServerWorldNamesList
        {
            get { return WorldDataManager._serverWorldNamesList; }
            set { WorldDataManager._serverWorldNamesList = value; }
        }

        #endregion
        #endregion

        #region Start
        public static void Init(string appPath)
        {
            string dirLog=String.Format("{0}/logs", appPath);
            if (!Directory.Exists(dirLog))
                Directory.CreateDirectory(dirLog);

            _errorLogFilePath = String.Format("{0}/error.log", dirLog);
            _localWorldsList = new List<World>();
            _serverWorldsList = new List<World>();
            LoadLocalAttributesListFromDB();
            _localWorldNamesList = GetLocalWorldNamesList();

            _serverDBConnectionAvailable = ABCServerContext.ServerConnectionAvailable(); //TestServerDBConnection();
            if (_serverDBConnectionAvailable)
            {
                _serverWorldNamesList = GetServerWorldNamesList();
            }
        }

        //private static bool TestServerDBConnection()
        //{
        //    if (!System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable())
        //        return false;

        //    var csb = new SqlConnectionStringBuilder("Server=188.64.60.8;Database=dotwebresearch;user id=dotwebresearch_admin;password=ov9wG8Q;");
        //    csb.ConnectTimeout = 2;

        //    try
        //    {
        //        using (var c=new SqlConnection(csb.ToString()))
        //        {
        //            c.Open();
        //        }
        //        return true;
        //    }
        //    catch (Exception)
        //    {
        //        return false;
        //    }
        //}

        private static void InsertDestination()
        {
            
        }
        #endregion
        
        #region WorldAttribute-Management
        #region LOCAL ATTRIBUTES
        // Remove ausschließlich auf der Basis der Identität von GUIDs. Sollten 
        // mehrere identische Namen vorkommen, dann mir
        // anderen IDs; Ziel der Entfernung muß aber die Entfernung auf der Basis 
        // einer Guid bleiben, auch wenn über den Namen gesucht werden
        // kann
        public static bool RemoveAttributeFromLocalList(WorldAttribute attrib)
        {
            int originalLength = _localAttributesList.Count();
            WorldAttribute result = _localAttributesList.Find(att => 
                att.UniqueWorldAttributeID.Equals(attrib.UniqueWorldAttributeID));

            if (result != null)
                _localAttributesList.Remove(result);

            return _localAttributesList.Count == (originalLength - 1);
        }

        // AddAttributeToList ausschließlich, wenn weder AttributName noch ID gefunden wird
        // ERST BEI FEHLER GENAUER UNTERSUCHEN, d.h. prüfen, ob Name oder Guid doppelt vorhanden sind 
        // wahrscheinlich: Name UND Guid
        // Attribut mit derselben Guid, aber anderem Namen KANN NUR auftreten, wenn ein mit 
        // einer speziellen GUID erzeugtes Attribut fehlerhaft umbenannt wurde.
        // 
        //
        // REGELN
        // 1) WENN EIN ATTRIBUT AUF DEN SERVER GESPIELT WERDEN SOLL, DORT ABER SCHON DAS VERWENDETE 
        //    ATTRIBUT VORHANDEN IST, WIRD DAS ATTRIBUT VOR DEM ÜBERTRAGEN AUF DEN SERVER UMBENANNT; 
        //    JE NACH ABHÄNGIGKEITEN IM CODE ERFORDERT DIES GGF. EINIGE MODIFIKATIONEN AN EXISTIEREN 
        //    WELTEN 
        // 2) WENN EIN ATTRIBUT VOM SERVER AUF EINEN CLIENT HERUNTERGEZOGEN WERDEN SOLL, AUF DEM EIN 
        //    ATTRIBUT DESSELBEN NAMENS EXISTIERT, WIRD DAS ATTRIBUT, DAS AUF DEM SERVER LIEGT, 
        //    BEIBEHALTEN UND DAS ENTSPRECHENDE CLIENT-ATTRIBUT UMBENANNT. JE NACH ABHÄNGIGKEITEN IM 
        //    CODE ERFORDERT ERFORDERT DIES GGF. EINIGE MODIFIKATIONEN AN EXISTIERENDEN WELTEN 
        // 3) WENN KEINE NAMENSKONFLIKTE AUFTRETEN, WERDEN NAMEN UNVERÄNDERT ÜBERNOMMEN
        // 4) NAMENSÄNDERUNGEN, DIE LOKAL DURCHGEFÜHRT WERDEN, MÜSSEN AUTOMATISCH AUF ALLE LOKAL 
        //    EXISTIERENDEN WELTEN, DATENSÄTZE UND BÄUME ANGEWENDET WERDEN.
        //
        //    DA WELTEN, DATENSÄTZE UND BÄUME NUR AUF IM "UNIVERSUM" EXISTIERENDE ATTRIBUTE (HIER EHER
        //    "LOKALES" UNIVERSUM) REFERIEREN, SICHERT DIE BEZUGNAHME AUF DIE IM ATTRIBUT GESPEICHERTE
        //    GUID DIE EINDEUTIGE IDENTIFIZIERBARKEIT
        //    (WIEDERAUFFINDBARKEIT) ALLER MERKMALE EINES ATTRIBUTS ÜBER EINEN VERGLEICH MIT DER GUID
        public static bool AddAttributeToLocalList(WorldAttribute attrib)
        {
            int originalLength = _localAttributesList.Count();

            WorldAttribute result = _localAttributesList.Find(att => 
                att.AttributeName.Equals(attrib.AttributeName) || 
                att.UniqueWorldAttributeID.Equals(attrib.UniqueWorldAttributeID));

            if (result == null)
                _localAttributesList.Add(attrib);

            return _localAttributesList.Count == (originalLength + 1);
        }

        public static bool ReplaceAttributeInLocalList(WorldAttribute _selectedAttribute)
        {
            if (RemoveAttributeFromLocalList(_selectedAttribute))
            {
                return AddAttributeToLocalList(_selectedAttribute);
            }

            return false;
        }

        public static WorldAttribute GetLocalAttributeByName(string name)
        {
            if (_localAttributesList == null)
            {
                if (!LoadLocalAttributesListFromDB())
                    return null;
            }

            WorldAttribute result = _localAttributesList.Find(att => 
                att.AttributeName.Equals(name));

            return result;
        }

        public static List<AttributeInfo> GetLocalAttributeInfoList()
        {
            List<AttributeInfo> result = new List<AttributeInfo>();
            using (var ctx = new ABCLocalContext())
            {
                result = ctx.AttributeInfos.ToList();
            }
            return result;
        }

        public static WorldAttribute GetLocalAttributeByGuid(Guid id)
        {
            if (_localAttributesList == null)
            {
                if (!LoadLocalAttributesListFromDB())
                    return null;
            }

            WorldAttribute result = _localAttributesList.Find(att => 
                att.UniqueWorldAttributeID.Equals(id));

            return result;
        }

        public static bool LoadLocalAttributesListFromDB()
        {
            if (_localAttributesCollectionChanged)
            {
                List<WorldAttribute> attList = new List<WorldAttribute>();

                try
                {
                    using (var db = new ABCLocalContext())
                    {
                        var query = from att in db.AttributeInfos
                                    orderby att.Name
                                    select att.Data;

                        DataContractSerializer dcs = 
                            new DataContractSerializer(typeof(WorldAttribute));
                        foreach (var item in query)
                        {
                            using (MemoryStream ms = new MemoryStream(item))
                            {
                                attList.Add(dcs.ReadObject(ms) as WorldAttribute);
                            }
                        }
                    }
                    _localAttributesList = attList;
                }
                catch (Exception e)
                {
                    WriteErrorToLog(e);
                    return false;
                }
            }

            return true;			
        }

        public static bool SaveLocalAttributesListToDB()
        {
            if (!_localAttributesCollectionChanged)
                return true;

            try
            {
                using (var db = new ABCLocalContext())
                {
                    var q = from oldatt in db.AttributeInfos
                            select oldatt;

                    foreach (var item in q)
                        db.AttributeInfos.Remove(item);

                    db.SaveChanges();

                    DataContractSerializer dcs = 
                        new DataContractSerializer(typeof(WorldAttribute));
                    foreach (WorldAttribute item in _localAttributesList)
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {			
                            dcs.WriteObject(ms, item);

                            AttributeInfo wa = new AttributeInfo() 
                            { 
                                AttributeInfoId = item.UniqueWorldAttributeID, 
                                Name = item.AttributeName, 
                                Data = ms.ToArray() 
                            };
                            db.AttributeInfos.Add(wa);
                        }
                    }
                    db.SaveChanges();
                }
            }
            catch (Exception)
            {
                return false;
            }				
            return true;
        }

        public static List<string> GetLocalAttributeNamesList()
        {
            List<string> attributeNamesList = new List<string>();
            foreach (WorldAttribute wa in LocalAttributesList)
                attributeNamesList.Add(wa.AttributeName);

            return attributeNamesList;
        }
        #endregion

        #region SERVER ATTRIBUTES
        // Remove ausschließlich auf der Basis der Identität von GUIDs. Sollten 
        // mehrere identische Namen vorkommen, dann mir
        // anderen IDs; Ziel der Entfernung muß aber die Entfernung auf der Basis 
        // einer Guid bleiben, auch wenn über den Namen gesucht werden
        // kann
        public static bool RemoveAttributeFromServerList(WorldAttribute attrib)
        {
            int originalLength = _serverAttributesList.Count();
            WorldAttribute result = _serverAttributesList.Find(att =>
                att.AttributeName.Equals(att.UniqueWorldAttributeID.Equals(attrib.UniqueWorldAttributeID)));

            if (result != null)
                _serverAttributesList.Remove(result);

            return _serverAttributesList.Count == (originalLength - 1);
        }

        // AddAttributeToList ausschließlich, wenn weder AttributName noch ID gefunden wird
        // ERST BEI FEHLER GENAUER UNTERSUCHEN, d.h. prüfen, ob Name oder Guid doppelt vorhanden sind 
        // wahrscheinlich: Name UND Guid
        // Attribut mit derselben Guid, aber anderem Namen KANN NUR auftreten, wenn ein mit 
        // einer speziellen GUID erzeugtes Attribut fehlerhaft umbenannt wurde.
        // 
        //
        // REGELN
        // 1) WENN EIN ATTRIBUT AUF DEN SERVER GESPIELT WERDEN SOLL, DORT ABER SCHON DAS VERWENDETE 
        //    ATTRIBUT VORHANDEN IST, WIRD DAS ATTRIBUT VOR DEM ÜBERTRAGEN AUF DEN SERVER UMBENANNT; 
        //    JE NACH ABHÄNGIGKEITEN IM CODE ERFORDERT DIES GGF. EINIGE MODIFIKATIONEN AN EXISTIEREN 
        //    WELTEN 
        // 2) WENN EIN ATTRIBUT VOM SERVER AUF EINEN CLIENT HERUNTERGEZOGEN WERDEN SOLL, AUF DEM EIN 
        //    ATTRIBUT DESSELBEN NAMENS EXISTIERT, WIRD DAS ATTRIBUT, DAS AUF DEM SERVER LIEGT, 
        //    BEIBEHALTEN UND DAS ENTSPRECHENDE CLIENT-ATTRIBUT UMBENANNT. JE NACH ABHÄNGIGKEITEN IM 
        //    CODE ERFORDERT ERFORDERT DIES GGF. EINIGE MODIFIKATIONEN AN EXISTIERENDEN WELTEN 
        // 3) WENN KEINE NAMENSKONFLIKTE AUFTRETEN, WERDEN NAMEN UNVERÄNDERT ÜBERNOMMEN
        // 4) NAMENSÄNDERUNGEN, DIE LOKAL DURCHGEFÜHRT WERDEN, MÜSSEN AUTOMATISCH AUF ALLE LOKAL 
        //    EXISTIERENDEN WELTEN, DATENSÄTZE UND BÄUME ANGEWENDET WERDEN.
        //
        //    DA WELTEN, DATENSÄTZE UND BÄUME NUR AUF IM "UNIVERSUM" EXISTIERENDE ATTRIBUTE (HIER EHER
        //    "LOKALES" UNIVERSUM) REFERIEREN, SICHERT DIE BEZUGNAHME AUF DIE IM ATTRIBUT GESPEICHERTE
        //    GUID DIE EINDEUTIGE IDENTIFIZIERBARKEIT
        //    (WIEDERAUFFINDBARKEIT) ALLER MERKMALE EINES ATTRIBUTS ÜBER EINEN VERGLEICH MIT DER GUID
        public static bool AddAttributeToServerList(WorldAttribute attrib)
        {
            int originalLength = _serverAttributesList.Count();

            WorldAttribute result = _serverAttributesList.Find(att =>
                att.AttributeName.Equals(attrib.AttributeName) ||
                att.UniqueWorldAttributeID.Equals(attrib.UniqueWorldAttributeID));

            if (result == null)
                _serverAttributesList.Add(attrib);

            return _serverAttributesList.Count == (originalLength + 1);
        }

        public static bool ReplaceAttributeInServerList(WorldAttribute _selectedAttribute)
        {
            if (RemoveAttributeFromServerList(_selectedAttribute))
            {
                return AddAttributeToServerList(_selectedAttribute);
            }

            return false;
        }

        public static WorldAttribute GetServerAttributeByName(string name)
        {
            string info = "";
            if (_serverAttributesList == null)
            {
                if (!LoadServerAttributesListFromDB(ref info))
                {
                    WriteErrorToLog(info);
                    return null;
                }
            }

            WorldAttribute result = _serverAttributesList.Find(att =>
                att.AttributeName.Equals(name));

            return result;
        }

        public static WorldAttribute GetServerAttributeByGuid(Guid id)
        {
            string info = "";
            if (_serverAttributesList == null)
            {
                if (!LoadServerAttributesListFromDB(ref info))
                {
                    WriteErrorToLog(info);
                    return null;
                }
            }

            WorldAttribute result = _serverAttributesList.Find(att =>
                att.UniqueWorldAttributeID.Equals(id));

            return result;
        }

        public static bool LoadServerAttributesListFromDB(ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }

            if (_serverAttributesCollectionChanged)
            {
                List<WorldAttribute> attList = new List<WorldAttribute>();

                try
                {
                    using (var db = new ABCServerContext())
                    {
                        var query = from att in db.AttributeInfos
                                    orderby att.Name
                                    select att.Data;

                        DataContractSerializer dcs =
                            new DataContractSerializer(typeof(WorldAttribute));
                        foreach (var item in query)
                        {
                            using (MemoryStream ms = new MemoryStream(item))
                            {
                                attList.Add(dcs.ReadObject(ms) as WorldAttribute);
                            }
                        }
                    }
                    _serverAttributesList = attList;
                }
                catch (Exception e)
                {
                    WriteErrorToLog(e);
                    return false;
                }
            }

            return true;
        }

        public static bool SaveServerAttributesListToDB(ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }

            if (!_serverAttributesCollectionChanged)
                return true;

            try
            {
                using (var db = new ABCServerContext())
                {
                    var q = from oldatt in db.AttributeInfos
                            select oldatt;

                    foreach (var item in q)
                        db.AttributeInfos.Remove(item);

                    db.SaveChanges();

                    DataContractSerializer dcs =
                        new DataContractSerializer(typeof(WorldAttribute));
                    foreach (WorldAttribute item in _serverAttributesList)
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            dcs.WriteObject(ms, item);
                            AttributeInfo wa = new AttributeInfo()
                            {
                                AttributeInfoId = item.UniqueWorldAttributeID,
                                Name = item.AttributeName,
                                Data = ms.ToArray()
                            };
                            db.AttributeInfos.Add(wa);
                        }
                    }
                    db.SaveChanges();
                }
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        public static List<string> GetServerAttributeNamesList()
        {
            List<string> attributeNamesList = new List<string>();
            foreach (WorldAttribute wa in ServerAttributesList)
                attributeNamesList.Add(wa.AttributeName);

            return attributeNamesList;
        }
        #endregion
        #endregion

        #region World-Management
        #region LOCAL WORLDS
        public static List<string> GetLocalWorldNamesList()
        {
            List<string> listWorldNames = new List<string>();

            try
            {
                using (var db = new ABCLocalContext())
                {
                    var query = from worlds in db.WorldInfos
                                select worlds;

                    foreach (var item in query)
                    {
                        listWorldNames.Add(item.Name);
                    }
                }
            }
            catch (Exception e)
            {
                WriteErrorToLog(e);
                listWorldNames = null;
            }

            return listWorldNames;
        }

        public static List<WorldInfo> GetLocalWorldList()
        {
            List<WorldInfo> result = new List<WorldInfo>();

            using (var db = new ABCLocalContext())
            {
                var query = from worlds in db.WorldInfos
                            select worlds;

                foreach (var item in query)
                {
                    result.Add(item);                    
                }
            }

            return result;
        }

        public static World LoadLocalWorld(Guid id)
        {
            World selectedWorld = null;

            try
                {
                    using (var db = new ABCLocalContext())
                    {
                        var query = from world in db.WorldInfos
                                    where world.WorldInfoId.Equals(id)
                                    select world.Data;

                        // BinaryFormatter bf = new BinaryFormatter();
                        DataContractSerializer dcs = 
                            new DataContractSerializer(typeof(World));
                        foreach (var item in query)
                        {
                            using (MemoryStream ms = new MemoryStream(item))
                            {
                                // selectedWorld = bf.Deserialize(ms) as World;
                                selectedWorld = dcs.ReadObject(ms) as World;
                                selectedWorld.AttachedDatasets = new List<WorldDataset>();
                            }
                        }

                        var query2 = from dataset in db.DatasetInfos
                                     where dataset.WorldID.Equals(selectedWorld.UniqueWorldID)
                                     select dataset;

                        foreach (var item in query2)
                        {
                            string csvData = DecompressString(item.Data);
                            WorldDataset instance = new WorldDataset(selectedWorld, item.Name, csvData);
                            selectedWorld.AttachedDatasets.Add(instance);
                        }
                    }
                }
                catch (Exception e)
                {
                    return null;
                }
            
                return selectedWorld;        
        }
        
        public static World LoadLocalWorld(string worldname, ref bool result, 
            ref string resultInfo)
        {
            World selectedWorld = null;

            if (_localWorldsCollectionChanged)
            {
                try
                {
                    using (var db = new ABCLocalContext())
                    {
                        var query = from world in db.WorldInfos
                                    where world.Name.Equals(worldname)
                                    select world.Data;

                        // BinaryFormatter bf = new BinaryFormatter();
                        DataContractSerializer dcs = 
                            new DataContractSerializer(typeof(World));
                        foreach (var item in query)
                        {
                            using (MemoryStream ms = new MemoryStream(item))
                            {
                                // selectedWorld = bf.Deserialize(ms) as World;
                                selectedWorld = dcs.ReadObject(ms) as World;
                                selectedWorld.AttachedDatasets = new List<WorldDataset>();
                            }
                        }

                        var query2 = from dataset in db.DatasetInfos
                                     where dataset.WorldID.Equals(selectedWorld.UniqueWorldID)
                                     select dataset;

                        foreach (var item in query2)
                        {
                            string csvData = DecompressString(item.Data);
                            WorldDataset instance = new WorldDataset(selectedWorld, item.Name, csvData);
                            selectedWorld.AttachedDatasets.Add(instance);
                        }
                    }
                }
                catch (Exception e)
                {
                    result = false;
                    selectedWorld = null;
                    WriteErrorToLog(e);
                }
            }
            else
            {
                selectedWorld = _localWorldsList.Find(w => 
                    w.Name.Equals(worldname));
            }
            return selectedWorld;
        }

        public static bool LoadAllLocalWorlds(ref string info)
        {
            if (!_localWorldsCollectionChanged)
                return true;

            _unboundLocalList = new List<WorldAttribute>();
            _localWorldsList.Clear();

            if (_localAttributesList == null || _localAttributesList.Count <= 0)
                LoadLocalAttributesListFromDB();

            long totalSize = 0;

            bool res = true;
            try
            {
                using (var db = new ABCLocalContext())
                {
                    var query = from world in db.WorldInfos
                                select world.Data;

                    // BinaryFormatter bf = new BinaryFormatter();
                    DataContractSerializer dcs =
                        new DataContractSerializer(typeof(World));

                    foreach (var item in query)
                    {
                        long kb = 0;
                        World world = null;
                        using (MemoryStream ms = new MemoryStream(item))
                        {
                            kb = ms.Length / 1024;
                            totalSize += kb;
                            // world = bf.Deserialize(ms) as World;
                            world = dcs.ReadObject(ms) as World;
                            world.AttachedDatasets = new List<WorldDataset>();
                        }

                        //foreach (WorldAttribute wa in world.AttributesList)
                        for (int i = 0; i < world.AttributesList.Count; i++)
                        {
                            WorldAttribute wa = world.AttributesList[i];

                            WorldAttribute result = _localAttributesList.Find(att =>
                                att.UniqueWorldAttributeID.Equals(wa.UniqueWorldAttributeID));

                            if (result == null) //nicht in AttributUniverse-Liste enthalten
                            {
                                WorldAttribute unboundResult = _unboundLocalList.Find(tmpAtt =>
                                    tmpAtt.AttributeName.Equals(wa.AttributeName) ||
                                    tmpAtt.UniqueWorldAttributeID.Equals(wa.UniqueWorldAttributeID));

                                if (unboundResult == null)
                                    _unboundLocalList.Add(wa);
                            }
                            else
                                world.AttributesList[i] = result;
                        }

                        var query2 = from datasets in db.DatasetInfos
                                     where datasets.WorldID.Equals(world.UniqueWorldID)
                                     select datasets;

                        foreach (DatasetInfo wd in query2)
                        {
                            string csvData = DecompressString(wd.Data);
                            WorldDataset instance = new WorldDataset(world, wd.Name, csvData);
                            if (world.AttachedDatasets == null)
                                world.AttachedDatasets = new List<WorldDataset>();
                            world.AttachedDatasets.Add(instance);
                        }

                        info += String.Format("world {0} size: {1} KB ({2} datasets)", world.Name, kb,
                            world.AttachedDatasets.Count) + Environment.NewLine;
                        _localWorldsList.Add(world);
                    }

                    info = String.Format("total data size: {0} MB",
                        ((double)totalSize / 1024).ToString("F2"));
                }
                _localWorldsCollectionChanged = false;
            }
            catch (Exception e)
            {
                res = false;
                info = e.Message;

                if (e.InnerException != null)
                    info += Environment.NewLine + e.InnerException.Message;
            }

            return res;
        }

        public static bool SaveLocalWorld(World world, ref string info)
        {
            bool res = true;
            bool resCopy = true;
            bool saved = false;
            string infoStr = "";

            World _copy = LoadLocalWorld(world.Name, ref resCopy, ref infoStr);

            try
            {
                DataContractSerializer dcs = new DataContractSerializer(typeof(World));
                long kb = 0;

                using (MemoryStream ms = new MemoryStream())
                {
                    dcs.WriteObject(ms, world);
                    kb = ms.Length / 1024;
                    using (var db = new ABCLocalContext())
                    {
                        var query = from oldworld in db.WorldInfos
                                    where oldworld.Name.Equals(world.Name)
                                    select oldworld;

                        foreach (var item in query)
                        {
                            db.WorldInfos.Remove(item);
                        }
                        db.SaveChanges();

                        WorldInfo w = new WorldInfo();
                        w.WorldInfoId = world.UniqueWorldID;
                        w.Name = world.Name;
                        w.Data = ms.ToArray();

                        db.WorldInfos.Add(w);
                        db.SaveChanges();

                        var query2 = from datasets in db.DatasetInfos
                                     where datasets.WorldID.Equals(world.UniqueWorldID)
                                     select datasets;

                        foreach (var item in query2)
                        {
                            db.DatasetInfos.Remove(item);
                        }

                        foreach (WorldDataset wd in world.AttachedDatasets)
                        {
                            DatasetInfo di = new DatasetInfo();
                            di.DatasetInfoId = wd.UniqueWorldDatasetID;
                            di.Name = wd.Name;
                            di.WorldID = world.UniqueWorldID;
                            di.Data = CompressString(wd.GetDataCSV());
                            db.DatasetInfos.Add(di);
                            db.SaveChanges();
                        }
                    }
                }

                saved = true;
                _localWorldsCollectionChanged = true;

                string resInfo = "";
                if (!LoadAllLocalWorlds(ref resInfo))
                {
                    return false;
                }
                int count = 0;
                if (world.AttachedDatasets != null)
                    count = world.AttachedDatasets.Count;

                info += String.Format("world {0} size: {1} KB ({2} datasets)",
                    world.Name, kb, count) + Environment.NewLine;


                if (SendLocalWorldChangedEvent != null)
                {
                    LocalWorldChangedEventArgs evtArgs = new LocalWorldChangedEventArgs()
                    {
                        WorldName = world.Name
                    };
                    SendLocalWorldChangedEvent(null, evtArgs);
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var validationErrors in e.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        Trace.TraceInformation("Property: {0} Error: {1}",
                            validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
            }
            catch (Exception e)
            {
                res = false;
                if (saved)
                    info += String.Format("Although some program error occurred, the world '{0}' " +
                        "has been saved correctly.{1}", world.Name, Environment.NewLine);
                else if (_copy != null)
                {
                    info +=
                        String.Format("The world '{0}' has not been saved correctly. The world " +
                        "will be reset to the last successfully saved copy.{1}",
                        world.Name, Environment.NewLine);
                    // BinaryFormatter bf = new BinaryFormatter();
                    DataContractSerializer dcs = new DataContractSerializer(typeof(World));
                    long kb = 0;

                    using (MemoryStream ms = new MemoryStream())
                    {
                        // bf.Serialize(ms, _copy);
                        dcs.WriteObject(ms, _copy);
                        kb = ms.Length / 1024;

                        using (var db = new ABCLocalContext())
                        {
                            var query = from oldworld in db.WorldInfos
                                        where oldworld.Name.Equals(_copy.Name)
                                        select oldworld;

                            foreach (var item in query)
                            {
                                db.WorldInfos.Remove(item);
                            }
                            db.SaveChanges();

                            WorldInfo w = new WorldInfo();
                            w.WorldInfoId = _copy.UniqueWorldID;
                            w.Name = _copy.Name;
                            w.Data = ms.ToArray();

                            db.WorldInfos.Add(w);
                            db.SaveChanges();
                        }
                    }
                }
                else
                {
                    info += String.Format("The world '{0}' has not been saved correctly.{1}",
                        world.Name, Environment.NewLine);
                }
                info +=
                    String.Format("{0}Message(s): {1}", Environment.NewLine,
                    e.Message);

                if (e.InnerException != null)
                    info += Environment.NewLine + e.InnerException.Message;
            }

            return res;
        }

        public static World GetWorldByName(string name)
        {
            foreach (World w in _localWorldsList)
            {
                if (w.Name.Equals(name))
                    return w;
            }

            return null;
        }

        public static bool RemoveLocalWorld(Guid id, ref string info)
        {
            bool result = true;

            List<Guid> attributesToDelete = new List<Guid>();
            List<WorldAttribute> attributeListCopy = new List<WorldAttribute>();

            World worldToDelete = LoadLocalWorld(id);

            if (worldToDelete == null)
            {
                info = "World not found";
                return false;
            }

            foreach (WorldAttribute wa in worldToDelete.AttributesList)
                attributesToDelete.Add(wa.UniqueWorldAttributeID);

            if (attributesToDelete.Count <= 0)
            {
                info = "Attribute list for world not found";
                return false;
            }

            foreach (World w in _localWorldsList)
            {
                if (w.UniqueWorldID.Equals(worldToDelete.UniqueWorldID))
                    continue;

                foreach (WorldAttribute wa in w.AttributesList)
                {
                    if (attributesToDelete.Contains(wa.UniqueWorldAttributeID))
                        attributesToDelete.Remove(wa.UniqueWorldAttributeID);
                }
            }

            try
            {
                using (var db = new ABCLocalContext())
                {
                    var query = from world in db.WorldInfos
                                where world.WorldInfoId.Equals(id)
                                select world;

                    WorldInfo removeWI = query.First();

                    if (removeWI != null)
                    {
                        db.WorldInfos.Remove(removeWI);
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception e)
            {
                if (!_localWorldsList.Contains(worldToDelete))
                    _localWorldsList.Add(worldToDelete);

                info = e.Message;
                result = false;
            }

            _localWorldsList.Remove(worldToDelete);

            try
            {
                using (var db = new ABCLocalContext())
                {
                    foreach (Guid g in attributesToDelete)
                    {

                        var query2 = from att in db.AttributeInfos
                                     where att.AttributeInfoId.Equals(g)
                                     select att;

                        AttributeInfo removeAI = query2.FirstOrDefault();

                        if (removeAI != null)
                        {
                            db.AttributeInfos.Remove(removeAI);
                            db.SaveChanges();
                        }

                        _localAttributesList.Remove(GetLocalAttributeByGuid(g));
                    }
                }
                result = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                result = false;
            }

            return result; 
        }

        public static bool RemoveLocalWorldByName(string selectedWorld, ref string info)
        {
            bool result = true;

            List<Guid> attributesToDelete = new List<Guid>();
            List<WorldAttribute> attributeListCopy = new List<WorldAttribute>();

            World worldToDelete = GetWorldByName(selectedWorld);

            if (worldToDelete == null)
            {
                info = "World " + selectedWorld + " not found";
                return false;
            }

            foreach (WorldAttribute wa in worldToDelete.AttributesList)
                attributesToDelete.Add(wa.UniqueWorldAttributeID);

            if (attributesToDelete.Count <= 0)
            {
                info = "Attribute list for world "+ selectedWorld + " not found";
                return false;
            }

            foreach (World w in _localWorldsList)
            {
                if (w.UniqueWorldID.Equals(worldToDelete.UniqueWorldID))
                    continue;

                foreach (WorldAttribute wa in w.AttributesList)
                {
                   if (attributesToDelete.Contains(wa.UniqueWorldAttributeID))
                       attributesToDelete.Remove(wa.UniqueWorldAttributeID);
                }
            }

            try
            {
                using (var db = new ABCLocalContext())
                {
                    var query = from world in db.WorldInfos
                                where world.Name.Equals(selectedWorld)
                                select world;

                    WorldInfo removeWI = query.First();

                    if (removeWI != null)
                    {
                        db.WorldInfos.Remove(removeWI);
                        db.SaveChanges();
                    }
                }
            }              
            catch (Exception e)
            {
                if (!_localWorldsList.Contains(worldToDelete))
                    _localWorldsList.Add(worldToDelete);

                info = e.Message;
                result = false;
            }
                
            _localWorldsList.Remove(worldToDelete);

            try
            {
                using (var db = new ABCLocalContext())
                {
                    foreach (Guid g in attributesToDelete)
                    {
                    
                        var query2 = from att in db.AttributeInfos
                                where att.AttributeInfoId.Equals(g)
                                select att;

                        AttributeInfo removeAI = query2.FirstOrDefault();

                        if (removeAI != null)
                        {
                            db.AttributeInfos.Remove(removeAI);
                            db.SaveChanges();
                        }
                        
                        _localAttributesList.Remove(GetLocalAttributeByGuid(g));
                    }
                }
                result = true;
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                result = false;
            }  

            return result; 
        }

        #endregion

        #region SERVER WORLDS
        public static List<string> GetServerWorldNamesList()
        {
            List<string> listWorldNames = new List<string>();
            if (!ServerDBConnectionAvailable)
                return null;

            try
            {
                using (var db = new ABCServerContext())
                {
                    var query = from world in db.WorldInfos
                                where world.Sealed
                                select world;

                    foreach (var item in query)
                    {
                        listWorldNames.Add(item.Name);
                    }
                }
            }
            catch (Exception e)
            {
                WriteErrorToLog(e);
                listWorldNames = null;
            }

            return listWorldNames;
        }

        public static World LoadServerWorld(string worldname, ref bool result,
            ref string resultInfo)
        {
            if (!ServerDBConnectionAvailable)
            {
                result = false;
                resultInfo = "Server database not accessible";
                return null;
            }

            World selectedWorld = null;

            if (_serverWorldsCollectionChanged)
            {
                try
                {
                    using (var db = new ABCServerContext())
                    {
                        var query = from world in db.WorldInfos
                                    where world.Name.Equals(worldname) && world.Sealed
                                    select world.Data;

                        // BinaryFormatter bf = new BinaryFormatter();
                        DataContractSerializer dcs =
                            new DataContractSerializer(typeof(World));
                        foreach (var item in query)
                        {
                            using (MemoryStream ms = new MemoryStream(item))
                            {
                                // selectedWorld = bf.Deserialize(ms) as World;
                                selectedWorld = dcs.ReadObject(ms) as World;
                                selectedWorld.AttachedDatasets = new List<WorldDataset>();
                            }
                        }

                        var query2 = from dataset in db.DatasetInfos
                                     where dataset.WorldID.Equals(selectedWorld.UniqueWorldID)
                                     select dataset;

                        foreach (var item in query2)
                        {
                            string csvData = DecompressString(item.Data);
                            WorldDataset instance = new WorldDataset(selectedWorld, item.Name, csvData);
                            selectedWorld.AttachedDatasets.Add(instance);
                        }
                    }
                }
                catch (Exception e)
                {
                    result = false;
                    selectedWorld = null;
                    WriteErrorToLog(e);
                }
            }
            else
            {
                selectedWorld = _serverWorldsList.Find(w =>
                    w.Name.Equals(worldname));
            }
            return selectedWorld;
        }

        public static bool LoadAllServerWorlds(ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }

            if (!_serverWorldsCollectionChanged)
                return true;

            _unboundServerList = new List<WorldAttribute>();
            _serverWorldsList.Clear();

            if (_serverAttributesList == null || _serverAttributesList.Count <= 0)
            {
                if (!LoadServerAttributesListFromDB(ref info))
                {
                    return false;
                }
            }

            //long totalSize = 0;

            bool res = true;

            List<string> serverWorldNames = GetServerWorldNamesList();
            foreach (string worldname in serverWorldNames)
            {
                bool result = true;
                string resInfo = "";
                World w = LoadServerWorld(worldname, ref result, ref resInfo);
                ServerWorldsList.Add(w);
            }
            //try
            //{
            //    using (var db = new ABCServerContext())
            //    {
            //        var query = from world in db.WorldInfos
            //                    select world.Data;

            //        // BinaryFormatter bf = new BinaryFormatter();
            //        DataContractSerializer dcs =
            //            new DataContractSerializer(typeof(World));

            //        foreach (var item in query)
            //        {
            //            long kb = 0;
            //            World world = null;
            //            using (MemoryStream ms = new MemoryStream(item))
            //            {
            //                kb = ms.Length / 1024;
            //                totalSize += kb;
            //                // world = bf.Deserialize(ms) as World;
            //                world = dcs.ReadObject(ms) as World;
            //                world.AttachedDatasets = new List<WorldDataset>();
            //            }

            //            //foreach (WorldAttribute wa in world.AttributesList)
            //            for (int i = 0; i < world.AttributesList.Count; i++)
            //            {
            //                WorldAttribute wa = world.AttributesList[i];

            //                WorldAttribute result = _serverAttributesList.Find(att =>
            //                    att.UniqueWorldAttributeID.Equals(wa.UniqueWorldAttributeID));

            //                if (result == null) //nicht in AttributUniverse-Liste enthalten
            //                {
            //                    WorldAttribute unboundResult = _unboundServerList.Find(tmpAtt =>
            //                        tmpAtt.AttributeName.Equals(wa.AttributeName) ||
            //                        tmpAtt.UniqueWorldAttributeID.Equals(wa.UniqueWorldAttributeID));

            //                    if (unboundResult == null)
            //                        _unboundServerList.Add(wa);
            //                }
            //                else
            //                    world.AttributesList[i] = result;
            //            }
                    
            //            var query2 = from datasets in db.DatasetInfos
            //                         where datasets.WorldID.Equals(world.UniqueWorldID)
            //                         select datasets;

            //            foreach (DatasetInfo wd in query2)
            //            {
            //                string csvData = DecompressString(wd.Data);
            //                WorldDataset instance = new WorldDataset(world, wd.Name, csvData);
            //                if (world.AttachedDatasets == null)
            //                    world.AttachedDatasets = new List<WorldDataset>();
            //                world.AttachedDatasets.Add(instance);
            //            }

            //            info += String.Format("world {0} size: {1} KB ({2} datasets)", world.Name, kb,
            //                world.AttachedDatasets.Count) + Environment.NewLine;
            //            _serverWorldsList.Add(world);
            //        }

            //        info = String.Format("total data size: {0} MB",
            //            ((double)totalSize / 1024).ToString("F2"));
            //    }
            //    _serverWorldsCollectionChanged = false;
            //}
            //catch (Exception e)
            //{
            //    res = false;
            //    info = e.Message;

            //    if (e.InnerException != null)
            //        info += Environment.NewLine + e.InnerException.Message;
            //}

            return res;
        }

        public static bool UploadWorld(World world, bool finalize, ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }


            bool res = true;
            bool resCopy = true;
            bool saved = false;
            string infoStr = "";

            World _copy = LoadServerWorld(world.Name, ref resCopy, ref infoStr);

            try
            {
                DataContractSerializer dcs = new DataContractSerializer(typeof(World));
                long kb = 0;

                using (MemoryStream ms = new MemoryStream())
                {
                    dcs.WriteObject(ms, world);
                    kb = ms.Length / 1024;
                    using (var db = new ABCServerContext())
                    {
                        var query = from oldworld in db.WorldInfos
                                    where oldworld.Name.Equals(world.Name)
                                    select oldworld;

                        foreach (var item in query)
                        {
                            db.WorldInfos.Remove(item);
                        }
                        db.SaveChanges();

                        WorldInfo w = new WorldInfo();
                        w.WorldInfoId = world.UniqueWorldID;
                        w.Name = world.Name;
                        w.Data = ms.ToArray();
                        w.Sealed = finalize;

                        db.WorldInfos.Add(w);
                        db.SaveChanges();

                        var query2 = from datasets in db.DatasetInfos
                                     where datasets.WorldID.Equals(world.UniqueWorldID)
                                     select datasets;

                        foreach (var item in query2)
                        {
                            db.DatasetInfos.Remove(item);
                        }

                        foreach (WorldDataset wd in world.AttachedDatasets)
                        {
                            DatasetInfo di = new DatasetInfo();
                            di.DatasetInfoId = wd.UniqueWorldDatasetID;
                            di.Name = wd.Name;
                            di.WorldID = world.UniqueWorldID;
                            di.Data = CompressString(wd.GetDataCSV());
                            di.Sealed = finalize;

                            db.DatasetInfos.Add(di);
                            db.SaveChanges();
                        }
                        WorldDataManager.ServerDatabaseChanged = true;
                    }
                }

                saved = true;

                string resInfo = "";
                if (!LoadAllServerWorlds(ref resInfo))
                {
                    return false;
                }
                int count = 0;
                if (world.AttachedDatasets != null)
                    count = world.AttachedDatasets.Count;

                info += String.Format("world {0} size: {1} KB ({2} datasets)",
                    world.Name, kb, count) + Environment.NewLine;

                _serverWorldsCollectionChanged = true;
                if (SendServerWorldChangedEvent != null)
                {
                    ServerWorldChangedEventArgs evtArgs = new ServerWorldChangedEventArgs()
                    {
                        WorldName = world.Name
                    };
                    SendServerWorldChangedEvent(null, evtArgs);
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var validationErrors in e.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        Trace.TraceInformation("Property: {0} Error: {1}",
                            validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
            }
            catch (Exception e)
            {
                res = false;
                if (saved)
                    info += String.Format("Although some program error occurred, the world '{0}' " +
                        "has been saved correctly.{1}", world.Name, Environment.NewLine);
                else if (_copy != null)
                {
                    info +=
                        String.Format("The world '{0}' has not been saved correctly. The world " +
                        "will be reset to the last successfully saved copy.{1}",
                        world.Name, Environment.NewLine);
                    // BinaryFormatter bf = new BinaryFormatter();
                    DataContractSerializer dcs = new DataContractSerializer(typeof(World));
                    long kb = 0;

                    using (MemoryStream ms = new MemoryStream())
                    {
                        // bf.Serialize(ms, _copy);
                        dcs.WriteObject(ms, _copy);
                        kb = ms.Length / 1024;

                        using (var db = new ABCServerContext())
                        {
                            var query = from oldworld in db.WorldInfos
                                        where oldworld.Name.Equals(_copy.Name)
                                        select oldworld;

                            foreach (var item in query)
                            {
                                db.WorldInfos.Remove(item);
                            }
                            db.SaveChanges();

                            WorldInfo w = new WorldInfo();
                            w.WorldInfoId = _copy.UniqueWorldID;
                            w.Name = _copy.Name;
                            w.Data = ms.ToArray();

                            db.WorldInfos.Add(w);
                            db.SaveChanges();
                        }
                    }
                }
                else
                {
                    info += String.Format("The world '{0}' has not been saved correctly.{1}",
                        world.Name, Environment.NewLine);
                }
                info +=
                    String.Format("{0}Message(s): {1}", Environment.NewLine,
                    e.Message);

                if (e.InnerException != null)
                    info += Environment.NewLine + e.InnerException.Message;
            }

            return res;
        }

        public static bool RemoveServerWorldByName(string selectedWorld, ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }

            bool result = true;

            foreach (World w in _serverWorldsList)
            {
                if (w.Name.Equals(selectedWorld))
                {
                    try
                    {
                        _serverWorldsList.Remove(w);
                        using (var db = new ABCServerContext())
                        {
                            var query = from world in db.WorldInfos
                                        where world.Name.Equals(selectedWorld)
                                        select world;

                            WorldInfo removeWI = query.First();

                            if (removeWI != null)
                            {
                                db.WorldInfos.Remove(removeWI);
                                db.SaveChanges();
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        if (!_serverWorldsList.Contains(w))
                            _serverWorldsList.Add(w);

                        info = e.Message;
                        result = false;
                    }

                    break;
                }
            }

            return result;
        }		
        #endregion
#endregion

        #region Tree-Management
        #region LOCAL TREES
        public static bool ExportDecisionTreeToFile(DecisionTree tree, string filepath, ref string info)
        {
            bool res = true;

            try
            {
                DataContractSerializer dcs =
                    new DataContractSerializer(typeof(DecisionTree));
                using (FileStream fs = new FileStream(filepath,
                    FileMode.CreateNew))
                {
                    dcs.WriteObject(fs, tree);
                }
            }
            catch (Exception ex)
            {
                info = ex.Message;
                res = false;
            }

            return res;
        }
 
        public static List<DecisionTree> GetAllLocalTrees(ref bool result, ref string resultInfo)
        {
            if (_localTreesCollectionChanged||_localDatabaseChanged)
            {
                //if (_localTreesList == null||_localDatabaseChanged)
                    _localTreesList = new List<DecisionTree>();

                try
                {
                    using (var db = new ABCLocalContext())
                    {
                        var query = from tree in db.TreeInfos
                                    select tree.Data;

                        // BinaryFormatter bf = new BinaryFormatter();
                        DataContractSerializer dcs = 
                            new DataContractSerializer(typeof(DecisionTree));
                        foreach (var item in query)
                        {
                            using (MemoryStream ms = new MemoryStream(item))
                            {
                                // _treesList.Add(bf.Deserialize(ms) as DecisionTree);
                                _localTreesList.Add(dcs.ReadObject(ms) as DecisionTree);
                            }
                        }
                    }
                    _localTreesCollectionChanged = false;
                    _localDatabaseChanged = false;
                }
                catch (Exception)
                {
                    _localTreesList = null;
                }
            }
            
            return _localTreesList;
        }

        public static DecisionTree GetSingleLocalTree(string treename, ref bool result, ref string resultInfo)
        {

            if (_localTreesCollectionChanged||_localDatabaseChanged)
            {
                GetAllLocalTrees(ref result, ref resultInfo);
            }

            if (_localTreesList == null)
                return null;
            
            DecisionTree selectedTree = _localTreesList.Find(t => 
                t.Name.Equals(treename));

            return selectedTree;
        }

        public static bool SaveLocalDecisionTree(DecisionTree tree, ref string info)
        {
            bool res = true;
            bool saved = false;
            string infoStr = "";
            DecisionTree _copy = GetSingleLocalTree(tree.Name, ref res, ref infoStr);

            try
            {
                DataContractSerializer dcs = new DataContractSerializer(typeof(DecisionTree));

                long kb = 0;

                using (MemoryStream ms = new MemoryStream())
                {
                    dcs.WriteObject(ms, tree);
                    kb = ms.Length / 1024;

                    using (var db = new ABCLocalContext())
                    {
                        var query = from oldtree in db.TreeInfos
                                    where oldtree.Name.Equals(tree.Name)
                                    select oldtree;

                        foreach (var item in query)
                        {
                            db.TreeInfos.Remove(item);
                        }
                        db.SaveChanges();

                        TreeInfo t = new TreeInfo()
                        {
                            TreeInfoId = tree.UniqueTreeID,
                            Name = tree.Name,
                            Data = ms.ToArray()
                        };

                        db.TreeInfos.Add(t);
                        db.SaveChanges();
                    }
                }
                saved = true;
                info += String.Format("tree: {0} size: {1} KB", tree.Name, kb) + Environment.NewLine;

                if (SendLocalTreeCollectionChangedEvent != null)
                {
                    LocalTreeCollectionChangedEventArgs evtArgs = new LocalTreeCollectionChangedEventArgs()
                    {
                        TreeName = tree.Name
                    };
                    SendLocalTreeCollectionChangedEvent(null, evtArgs);
                }
                _localTreesCollectionChanged = true;
            }
            catch (Exception ex)
            {
                res = false;
                if (saved)
                    info += String.Format("Although some program error occurred, the tree '{0}' " +
                        "has been saved correctly.{1}", tree.Name, Environment.NewLine);
                else if (_copy != null)
                {
                    info += String.Format("The tree '{0}' has not been saved correctly. It will be " +
                        "reset to the last successfully saved copy.{1}", tree.Name, Environment.NewLine);

                    DataContractSerializer dcs = new DataContractSerializer(typeof(DecisionTree));
                    long kb = 0;

                    using (MemoryStream ms = new MemoryStream())
                    {
                        dcs.WriteObject(ms, _copy);
                        kb = ms.Length / 1024;

                        using (var db = new ABCLocalContext())
                        {
                            var query = from oldtree in db.TreeInfos
                                        where oldtree.Name.Equals(_copy.Name)
                                        select oldtree;

                            foreach (var item in query)
                            {
                                db.TreeInfos.Remove(item);
                            }
                            db.SaveChanges();

                            TreeInfo t = new TreeInfo();
                            t.TreeInfoId = _copy.UniqueTreeID;
                            t.Name = _copy.Name;
                            t.Data = ms.ToArray();

                            db.TreeInfos.Add(t);
                            db.SaveChanges();
                        }

                    }
                }
                else
                {
                    info += String.Format("The tree '{0}' has not been saved correctly.{1}",
                        tree.Name, Environment.NewLine);
                }
                info += String.Format("{0}Message(s): {1}", Environment.NewLine, ex.Message);

                if (ex.InnerException != null)
                    info += Environment.NewLine + ex.InnerException.Message;
            }

            return res;
        }

        public static List<DecisionTree> GetCompatibleLocalTrees(World world)
        {
            return GetCompatibleLocalTrees(world.AttributesList);
        }

        public static List<DecisionTree> GetCompatibleLocalTrees(List<WorldAttribute> list)
        {
            bool result = false;
            string resultInfo = "";
            List<DecisionTree> treeList = GetAllLocalTrees(ref result, ref resultInfo);
            List<DecisionTree> compatibleTreeList = new List<DecisionTree>();

            // gehe alle Bäume durch
            foreach (DecisionTree tree in treeList)
            {
                // prüfe gegeben Baum auf Attribute
                // LINQ-Abfrage: symmetrische Mengendifferenz

                var symmetricSetDifference =
                    list.Except(tree.ListOfAttributes).Union(tree.ListOfAttributes.Except(list));

                if (symmetricSetDifference.Count() <= 0)
                    compatibleTreeList.Add(tree);

                // prüfe gegeben Baum auf Attribute
                // LINQ-Abfrage: symmetrische Mengendifferenz
                // MERKEN! Ist aber hier Blödsinn, da ich hier nur prüfen
                // will, ob es Elemente im Baum gibt die nicht in der
                // Welt enthalten sind; dass es meist Elemente gibt, die
                // in der Welt, aber nicht im Baum enthalten sind, dürfte
                // klar sein, spielt aber HIER überhaupt keine Rolle

                // AUSKOMMENTIERT. NICHT LÖSCHEN (BEVOR DER CODE NICHT IN EINER ALLGEMEIN
                // ANWENDBAREN BIBLIOTHEK STEHT
                //var symmetricSetDifference =
                //    list.Except(tree.ListOfAttributes).Union(tree.ListOfAttributes.Except(list));

                //if (symmetricSetDifference.Count() <= 0)
                //    compatibleTreeList.Add(tree);

                // NEU
                var setDifference = tree.ListOfAttributes.Except(list);

                if (setDifference.Count() <= 0)
                    compatibleTreeList.Add(tree);
            }

            return compatibleTreeList;
        }

        public static List<string> GetAllCompatibleLocalTreeNames(World world)
        {
            return GetAllCompatibleLocalTreeNames(world.AttributesList);
        }

        public static List<string> GetAllCompatibleLocalTreeNames(List<WorldAttribute> list)
        {
            bool result = false;
            string resultInfo = "";
            List<DecisionTree> treeList = GetAllLocalTrees(ref result, ref resultInfo);
            List<string> compatibleTreeNamesList = new List<string>();

            // gehe alle Bäume durch
            foreach (DecisionTree tree in treeList)
            {
                if (tree.ListOfAttributes == null)
                    continue;
                // prüfe gegeben Baum auf Attribute
                // LINQ-Abfrage: symmetrische Mengendifferenz
                // MERKEN! Ist aber hier Blödsinn, da ich hier nur prüfen
                // will, ob es Elemente im Baum gibt die nicht in der
                // Welt enthalten sind; dass es meist Elemente gibt, die
                // in der Welt, aber nicht im Baum enthalten sind, dürfte
                // klar sein, spielt aber HIER überhaupt keine Rolle

                // AUSKOMMENTIERT. NICHT LÖSCHEN (BEVOR DER CODE NICHT IN EINER ALLGEMEIN
                // ANWENDBAREN BIBLIOTHEK STEHT
                //var symmetricSetDifference =
                //    list.Except(tree.ListOfAttributes).Union(tree.ListOfAttributes.Except(list));

                //if (symmetricSetDifference.Count() <= 0)
                //    compatibleTreeNamesList.Add(tree.Name);

                // NEU
                var setDifference = tree.ListOfAttributes.Except(list);

                if (setDifference.Count() <= 0)
                    compatibleTreeNamesList.Add(tree.Name);
            }

            return compatibleTreeNamesList;
        }

        public static List<string> GetAllLocalTreeNames()
        {
            bool result = true;
            string resultInfo = "";

            List<DecisionTree> treeList = GetAllLocalTrees(ref result, ref resultInfo);
            List<string> treeNamesList = new List<string>();

            foreach (DecisionTree tree in treeList)
                treeNamesList.Add(tree.Name);

            return treeNamesList;
        }

        public static bool DeleteLocalDecisionTree(string p, ref string info)
        {
            return RemoveLocalTreeByName(p, ref info);
        }

        public static bool RemoveLocalTreeByName(string treename, ref string resultInfo)
        {
            bool result = false;
            string info = "";

            List<DecisionTree> treeList = GetAllLocalTrees(ref result, ref info);

            foreach (DecisionTree tree in treeList)
            {
                if (tree.Name.Equals(treename))
                {
                    try
                    {

                        treeList.Remove(tree);

                        using (var db = new ABCLocalContext())
                        {
                            var query = from selectedTree in db.TreeInfos
                                        where selectedTree.Name.Equals(treename)
                                        select selectedTree;

                            foreach (var item in query)
                            {
                                db.TreeInfos.Remove(item);
                            }
                            db.SaveChanges();
                        }
                        result = true;
                        resultInfo = String.Format("tree {0} deleted", treename);
                    }
                    catch (Exception e)
                    {
                        result = false;
                        resultInfo = String.Format("tree {0} not deleted\r\nError {1}",
                            treename, e.Message);
                    }
                    break;
                }
            }

            return result;
        }

        #endregion

        #region SERVER TREES
        public static List<DecisionTree> GetAllServerTrees(ref bool result, ref string resultInfo)
        {
            if (!ServerDBConnectionAvailable)
            {
                result = false;
                resultInfo = "Server database not accessible";
                return null;
            }

            if (_serverTreesCollectionChanged||_serverDatabaseChanged)
            {
                if (_serverTreesList == null||_serverDatabaseChanged)
                    _serverTreesList = new List<DecisionTree>();
                _serverTreesList.Clear();
                try
                {
                    using (var db = new ABCServerContext())
                    {
                        var query = from tree in db.TreeInfos
                                    select tree.Data;

                        // BinaryFormatter bf = new BinaryFormatter();
                        DataContractSerializer dcs = 
                            new DataContractSerializer(typeof(DecisionTree));
                        foreach (var item in query)
                        {
                            using (MemoryStream ms = new MemoryStream(item))
                            {
                                // _treesList.Add(bf.Deserialize(ms) as DecisionTree);
                                _serverTreesList.Add(dcs.ReadObject(ms) as DecisionTree);
                            }
                        }
                    }
                    _serverTreesCollectionChanged = false;
                    _serverDatabaseChanged = false;
                }
                catch (Exception)
                {
                    _serverTreesList = null;
                }
            }

            return _serverTreesList;
        }

        public static DecisionTree GetSingleServerTree(string treename, ref bool result, ref string resultInfo)
        {

            if (_localTreesCollectionChanged||_localDatabaseChanged)
            {
                GetAllServerTrees(ref result, ref resultInfo);
            }

            DecisionTree selectedTree = _serverTreesList.Find(t => 
                t.Name.Equals(treename));

            return selectedTree;
        }

        public static bool UploadCompatibleTrees(List<DecisionTree> trees, bool finalize, ref string info)
        {
            bool result = true;

            foreach (DecisionTree tree in trees)
            {
                if (!UploadDecisionTree(tree, finalize, ref info))
                    result=false;
            }

            return result;
        }

        public static bool UploadDecisionTree(DecisionTree tree, bool finalize, ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }


            bool res = true;
            bool saved = false;
            string infoStr = "";
            
            DecisionTree _copy = GetSingleServerTree(tree.Name, ref res, ref infoStr);
            
            try
            {
                DataContractSerializer dcs = new DataContractSerializer(typeof(DecisionTree));

                long kb = 0;

                using (MemoryStream ms = new MemoryStream())
                {
                    dcs.WriteObject(ms, tree);
                    kb = ms.Length / 1024;

                    using (var db = new ABCServerContext())
                    {
                        var query = from oldtree in db.TreeInfos
                                    where oldtree.Name.Equals(tree.Name)
                                    select oldtree;

                        foreach (var item in query)
                        {
                            db.TreeInfos.Remove(item);
                        }
                        db.SaveChanges();

                        TreeInfo t = new TreeInfo()
                        {
                            TreeInfoId = tree.UniqueTreeID,
                            Name = tree.Name,
                            Data = ms.ToArray(),
                            Sealed = finalize
                        };

                        db.TreeInfos.Add(t);
                        db.SaveChanges();
                        _serverTreesCollectionChanged = true;
                    }
                }
                saved = true;
                info += String.Format("tree: {0} size: {1} KB", tree.Name, kb) + Environment.NewLine;

                if (SendServerTreeCollectionChangedEvent != null)
                {
                    ServerTreeCollectionChangedEventArgs evtArgs = new ServerTreeCollectionChangedEventArgs()
                    {
                        TreeName = tree.Name
                    };
                    SendServerTreeCollectionChangedEvent(null, evtArgs);
                }
            }
            catch (Exception ex)
            {
                res = false;
                if (saved)
                    info += String.Format("Although some program error occurred, the tree '{0}' " +
                        "has been saved correctly.{1}", tree.Name, Environment.NewLine);
                else if (_copy != null)
                {
                    info += String.Format("The tree '{0}' has not been saved correctly. It will be " +
                        "reset to the last successfully saved copy.{1}", tree.Name, Environment.NewLine);

                    DataContractSerializer dcs = new DataContractSerializer(typeof(DecisionTree));
                    long kb = 0;

                    using (MemoryStream ms = new MemoryStream())
                    {
                        dcs.WriteObject(ms, _copy);
                        kb = ms.Length / 1024;

                        using (var db = new ABCServerContext())
                        {
                            var query = from oldtree in db.TreeInfos
                                        where oldtree.Name.Equals(_copy.Name)
                                        select oldtree;

                            foreach (var item in query)
                            {
                                db.TreeInfos.Remove(item);
                            }
                            db.SaveChanges();

                            TreeInfo t = new TreeInfo();
                            t.TreeInfoId = _copy.UniqueTreeID;
                            t.Name = _copy.Name;
                            t.Data = ms.ToArray();
                            t.Sealed = finalize;

                            db.TreeInfos.Add(t);
                            db.SaveChanges();
                        }

                    }
                }
                else
                {
                    info += String.Format("The tree '{0}' has not been saved correctly.{1}",
                        tree.Name, Environment.NewLine);
                }
                info += String.Format("{0}Message(s): {1}", Environment.NewLine, ex.Message);

                if (ex.InnerException != null)
                    info += Environment.NewLine + ex.InnerException.Message;
            }

            return res;
        }

        public static List<DecisionTree> GetCompatibleServerTrees(World world)
        {
            return GetCompatibleServerTrees(world.AttributesList);
        }

        public static List<DecisionTree> GetCompatibleServerTrees(List<WorldAttribute> list)
        {
            bool result = false;
            string resultInfo = "";
            List<DecisionTree> treeList = GetAllServerTrees(ref result, ref resultInfo);
            List<DecisionTree> compatibleTreeList = new List<DecisionTree>();

            // gehe alle Bäume durch
            foreach (DecisionTree tree in treeList)
            {
                // prüfe gegeben Baum auf Attribute
                // LINQ-Abfrage: symmetrische Mengendifferenz

                var symmetricSetDifference =
                    list.Except(tree.ListOfAttributes).Union(tree.ListOfAttributes.Except(list));

                if (symmetricSetDifference.Count() <= 0)
                    compatibleTreeList.Add(tree);

                // prüfe gegeben Baum auf Attribute
                // LINQ-Abfrage: symmetrische Mengendifferenz
                // MERKEN! Ist aber hier Blödsinn, da ich hier nur prüfen
                // will, ob es Elemente im Baum gibt die nicht in der
                // Welt enthalten sind; dass es meist Elemente gibt, die
                // in der Welt, aber nicht im Baum enthalten sind, dürfte
                // klar sein, spielt aber HIER überhaupt keine Rolle

                // AUSKOMMENTIERT. NICHT LÖSCHEN (BEVOR DER CODE NICHT IN EINER ALLGEMEIN
                // ANWENDBAREN BIBLIOTHEK STEHT
                //var symmetricSetDifference =
                //    list.Except(tree.ListOfAttributes).Union(tree.ListOfAttributes.Except(list));

                //if (symmetricSetDifference.Count() <= 0)
                //    compatibleTreeList.Add(tree);

                // NEU
                var setDifference = tree.ListOfAttributes.Except(list);

                if (setDifference.Count() <= 0)
                    compatibleTreeList.Add(tree);
            }

            return compatibleTreeList;
        }

        public static List<string> GetAllCompatibleServerTreeNames(World world)
        {
            return GetAllCompatibleServerTreeNames(world.AttributesList);
        }

        public static List<string> GetAllServerTreeNames()
        {
            bool result = true;
            string resultInfo = "";

            List<DecisionTree> treeList = GetAllServerTrees(ref result, ref resultInfo);
            List<string> treeNamesList = new List<string>();

            foreach (DecisionTree tree in treeList)
                treeNamesList.Add(tree.Name);

            return treeNamesList;
        }

        public static List<string> GetAllCompatibleServerTreeNames(List<WorldAttribute> list)
        {
            bool result = false;
            string resultInfo = "";
            List<DecisionTree> treeList = GetAllServerTrees(ref result, ref resultInfo);
            List<string> compatibleTreeNamesList = new List<string>();

            // gehe alle Bäume durch
            foreach (DecisionTree tree in treeList)
            {
                if (tree.ListOfAttributes == null)
                    continue;
                // prüfe gegeben Baum auf Attribute
                // LINQ-Abfrage: symmetrische Mengendifferenz
                // MERKEN! Ist aber hier Blödsinn, da ich hier nur prüfen
                // will, ob es Elemente im Baum gibt die nicht in der
                // Welt enthalten sind; dass es meist Elemente gibt, die
                // in der Welt, aber nicht im Baum enthalten sind, dürfte
                // klar sein, spielt aber HIER überhaupt keine Rolle

                // AUSKOMMENTIERT. NICHT LÖSCHEN (BEVOR DER CODE NICHT IN EINER ALLGEMEIN
                // ANWENDBAREN BIBLIOTHEK STEHT
                //var symmetricSetDifference =
                //    list.Except(tree.ListOfAttributes).Union(tree.ListOfAttributes.Except(list));

                //if (symmetricSetDifference.Count() <= 0)
                //    compatibleTreeNamesList.Add(tree.Name);

                // NEU
                var setDifference = tree.ListOfAttributes.Except(list);

                if (setDifference.Count() <= 0)
                    compatibleTreeNamesList.Add(tree.Name);
            }

            return compatibleTreeNamesList;
        }

        public static bool DeleteServerDecisionTree(string p, ref string info)
        {
            return RemoveServerTreeByName(p, ref info);
        }

        public static bool RemoveServerTreeByName(string treename, ref string resultInfo)
        {
            if (!ServerDBConnectionAvailable)
            {
                resultInfo = "Server database not accessible";
                return false;
            }

            bool result = false;
            string info = "";

            List<DecisionTree> treeList = GetAllServerTrees(ref result, ref info);

            foreach (DecisionTree tree in treeList)
            {
                if (tree.Name.Equals(treename))
                {
                    try
                    {

                        treeList.Remove(tree);

                        using (var db = new ABCServerContext())
                        {
                            var query = from selectedTree in db.TreeInfos
                                        where selectedTree.Name.Equals(treename)
                                        select selectedTree;

                            foreach (var item in query)
                            {
                                db.TreeInfos.Remove(item);
                            }
                            db.SaveChanges();
                        }
                        result = true;
                        resultInfo = String.Format("tree {0} deleted", treename);
                    }
                    catch (Exception e)
                    {
                        result = false;
                        resultInfo = String.Format("tree {0} not deleted\r\nError {1}",
                            treename, e.Message);
                    }
                    break;
                }
            }

            return result;
        }
        #endregion
        #endregion

        #region User management: Server only
        public static bool UserExists(string username)
        {
            TreeUserInfo user = null;

            using (var db = new ABCServerContext())
            {
                user = (from userinfo in db.TreeUserInfos
                        where userinfo.Username.Equals(username)
                        select userinfo).FirstOrDefault();
            }

            return user != null;
        }

        static byte[] CreateHash(string password)
        {
            MD5 _md5Hash = MD5.Create();
            return _md5Hash.ComputeHash(System.Text.Encoding.ASCII.GetBytes(password));
        }

        static string GetHashString(byte[] hashPwd)
        {
            string hashString = "";
            for (int i = 0; i < hashPwd.Length; i++)
                hashString += hashPwd[i].ToString("x2");

            return hashString;
        }

        public static bool CheckPassword(string username, string password, ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }

            TreeUserInfo user = null;

            byte[] md5 = CreateHash(password);
            string pwdHash = GetHashString(md5);

            using (var db = new ABCServerContext())
            {
                user = (from userinfo in db.TreeUserInfos
                        where userinfo.Username.Equals(username) &&
                        userinfo.Password.Equals(pwdHash)
                        select userinfo).FirstOrDefault();
            }

            if (user == null)
                info = "user or password unknown";

            return user != null;
        }

        public static void RemoveUser(string username)
        {
            throw new NotImplementedException();
        }

        public static bool AddUser(string username, string password, string email,
            bool mpibMember, string mpibGroup, bool student, int permission,
            bool accepted, ref string info)
        {
            if (!ServerDBConnectionAvailable)
            {
                info = "Server database not accessible";
                return false;
            }

            byte[] md5 = CreateHash(password);
            string pwdHash = GetHashString(md5);

            using (var db = new ABCServerContext())
            {
                TreeUserInfo user = (from userinfo in db.TreeUserInfos
                                     where userinfo.Username.Equals(username)
                                     select userinfo).FirstOrDefault();

                if (user != null)
                {
                    info = "User exists";
                    return false;
                }

                try
                {
                    TreeUserInfo newUser = new TreeUserInfo();
                    newUser.Username = username;
                    newUser.Password = pwdHash;
                    newUser.Email = email;
                    newUser.MPIBMember = mpibMember;
                    newUser.MPIBGroup = mpibGroup;
                    newUser.Student = student;
                    newUser.Permission = permission;
                    newUser.Accepted = accepted;
                    db.TreeUserInfos.Add(newUser);
                    db.SaveChanges();
                }
                catch (Exception e)
                {
                    info = String.Format("Creation failed. Error: {0}", e.Message);
                    return false;
                }
            }
            info = "OK";
            return true;
        }
        #endregion

        #region Utitility functions
        public static List<string> GetAllDatasetNames()
        {
            List<string> datasetNames = new List<string>();
            foreach(World world in _localWorldsList)
                foreach (WorldDataset wi in world.AttachedDatasets)
                    datasetNames.Add(wi.Name);

            return datasetNames;
        }

        public static List<string> GetWorldDatasetNames(World world)
        {
            List<string> datasetNames=new List<string>();
            foreach (WorldDataset wi in world.AttachedDatasets)
                datasetNames.Add(wi.Name);

            return datasetNames;
        }

        public static Byte[] CompressString(string str)
        {
            Byte[] bytes = Encoding.Unicode.GetBytes(str);
            Console.WriteLine("String has " + bytes.Length + " bytes");
            using (MemoryStream ms = new MemoryStream())
            {
                using (GZipStream gzStream = new GZipStream(ms, CompressionMode.Compress))
                {
                    gzStream.Write(bytes, 0, bytes.Length);
                }

                return ms.ToArray();
            }
        }

        public static string DecompressString(Byte[] gzData)
        {
            using (MemoryStream ms = new MemoryStream(gzData))
            {
                using (GZipStream gzStream = new GZipStream(ms, CompressionMode.Decompress))
                {
                    using (StreamReader sr = new StreamReader(gzStream, Encoding.Unicode))
                    {
                        return sr.ReadToEnd();
                    }
                }
            }
        }

        public static void WriteErrorToLog(Exception e)
        {
            string s = String.Format("Source:\r\n{0}\r\n\r\nMessage:\r\n{1}\r\n\r\nStack trace:\r\n{2}", e.Source, e.Message, e.StackTrace.ToString());
            if (e.InnerException!=null)
                s += String.Format("\r\nInner exception\r\nSource:\r\n{0}\r\n\r\nMessage:\r\n{1}\r\n\r\nStack trace:\r\n{2}", e.InnerException.Source, e.InnerException.Message, e.InnerException.StackTrace.ToString());
            WriteErrorToLog(s);
        }

        public static void WriteErrorToLog(string info)
        {
            StreamWriter sw = new StreamWriter(_errorLogFilePath, true);
            sw.WriteLine(string.Format("\r\n\r\n{0} - {1}\r\n\r\n{2}", DateTime.Today.ToShortDateString(), DateTime.Now.ToShortTimeString(), info));
            sw.Close();
        }
        #endregion
    }
}
        
