using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class ArticleDTO : ArticleSummaryDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CreatedBy { get; set; }
        public int ArticleStatusId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public ProjectDTO Project { get; set; }
        public KeyValueDTO ArticleStatus { get; set; }

    }
}
