using System;

namespace p1p.Types.DTO
{
    public class OutreachDTO
    {
        public int Id { get; set; }
        public int LinkId { get; set; }
        public LinkDTO Link { get; set; }
        public KeyValueDTO OutreachAction { get; set; }
        public KeyValueDTO OutreachType { get; set; }
        public string OutreachNotes { get; set; }
        public string AddedBy { get; set; }
        public Nullable<System.DateTime> DateOutreached { get; set; }
        public DateTime InsertDate { get; set; }
        public string EmailBody { get; set; }
        public string EmailRecipient { get; set; }
        public string EmailSubject { get; set; }
        public int ArticleId { get; set; }
        public int PersonaId { get; set; }
    }
}
