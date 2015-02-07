using System;

namespace p1p.Types.DTO
{
    public class LinkDTO
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public ProjectDTO Project { get; set; }
        public string TargetUrl { get; set; }
        public string RootUrl { get; set; }
        public string RootMethod { get; set; }
        public KeyValueDTO LinkStrategy { get; set; }
        public string AnchorText { get; set; }
        public int DomainAuthority { get; set; }
        public int PageRelevance { get; set; }
        public int SiteRelevance { get; set; }
        public KeyValueDTO LinkLocation { get; set; }
        public string PublishedUrl { get; set; }
        public string LandingPage { get; set; }
        public KeyValueDTO LinkStatus { get; set; }
        public Nullable<System.DateTime> DateFound { get; set; }
        public Nullable<System.DateTime> DatePublished { get; set; }
        public string FoundBy { get; set; }
        public string LastModifiedBy { get; set; }
        public Nullable<System.DateTime> DateLastModified { get; set; }
        public string AcquiredBy { get; set; }
        public KeyValueDTO LinkBuildingMode { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string ContactUrl { get; set; }
        public string Notes { get; set; }
        public KeyValueDTO LinkType { get; set; }
        public DateTime InsertDate { get; set; }
        public ArticleDTO Article { get; set; }
        public Nullable<int> ProjectArticleXREFId { get; set; }
        public bool IsWinner { get; set; }
    }
}
