using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class ArticleSummaryDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CreatedBy { get; set; }
        public int ArticleStatusId { get; set; }
        public int ProjectId { get; set; }
        public DateTime CreatedDate { get; set; }
        public KeyValueDTO ArticleStatus { get; set; }
        public ProjectDTO Project { get; set; }
    }
}
