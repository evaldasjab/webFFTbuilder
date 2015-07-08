using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace ABCUniverse.Portable
{
	[DataContract]
	public class TreeImage
	{
		byte[] _treeBitmap;
		[DataMember]
		public byte[] TreeBitmap
		{
			get { return _treeBitmap; }
			set { _treeBitmap = value; }
		}

		public TreeImage()
		{
		}

		//#region Serialization support
		//protected TreeImage(SerializationInfo info, StreamingContext context)
		//{
		//	TreeBitmap = (Byte[])info.GetValue("TreeBitmap", typeof(Byte[]));
		//}

		//virtual public void GetObjectData(SerializationInfo info, StreamingContext context)
		//{
		//	info.AddValue("TreeBitmap", TreeBitmap, typeof(Byte[]));
		//}
		//#endregion
	}
}
