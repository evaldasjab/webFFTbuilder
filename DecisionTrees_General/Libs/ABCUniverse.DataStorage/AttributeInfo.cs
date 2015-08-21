using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ABCUniverse.DataStorage
{
    [Table("AttributeInfoSet")]
    public class AttributeInfo
    {
        [Required]
        public System.Guid AttributeInfoId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required, Column(TypeName="image")]
        [MaxLength]
        public byte[] Data { get; set; }
        [Required]
        public bool Sealed { get; set; }
    }
}
