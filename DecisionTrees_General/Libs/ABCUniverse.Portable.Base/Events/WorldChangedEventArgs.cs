using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ABCUniverse.Portable.Global
{
    public class LocalWorldChangedEventArgs: EventArgs
    {
        public string WorldName { get; set; }
    }

    public class ServerWorldChangedEventArgs : EventArgs
    {
        public string WorldName { get; set; }
    }

    public class IsoStorageWorldChangedEventArgs: EventArgs
    {
        public string WorldName { get; set; }
    }
}
