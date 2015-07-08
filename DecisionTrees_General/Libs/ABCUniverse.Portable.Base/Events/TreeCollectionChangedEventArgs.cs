using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Global
{
    public class LocalTreeCollectionChangedEventArgs: EventArgs
    {
        public string TreeName { get; set; }
    }

    public class ServerTreeCollectionChangedEventArgs : EventArgs
    {
        public string TreeName { get; set; }
    }

    public class IsoStorageTreeCollectionChangedEventArgs: EventArgs
    {
        public string TreeName { get; set; }
    }
}
