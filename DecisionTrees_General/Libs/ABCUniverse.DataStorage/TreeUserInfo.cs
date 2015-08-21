using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ABCUniverse.DataStorage
{
    [Table("TreeUserInfoSet")]
    public class TreeUserInfo
    {
        [Key]
        public string Username { get; set; }
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public bool MPIBMember { get; set; }
        public string MPIBGroup { get; set; }
        [Required]
        public bool Student { get; set; }
        [Required]
        public int Permission { get; set; }
        [Required]
        public bool Accepted { get; set; }
    }
}
