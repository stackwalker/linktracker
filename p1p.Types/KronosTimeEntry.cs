using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.IO;

namespace p1p.Types
{
    public class KronosTimeEntry
    {
        public string Project { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Elapsed { get; set; }
        public string AbbreviatedProject { get; set; }
        public string Activity { get; set; }
        public string Note { get; set; }
        public string IsTimeOff { get; set; }

        public string toJSON()
        {                                    
            System.Runtime.Serialization.Json.DataContractJsonSerializer ser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(KronosTimeEntry));
            System.IO.MemoryStream stream = new System.IO.MemoryStream();
            ser.WriteObject(stream, this);
            stream.Position = 0;
            StreamReader rdr = new StreamReader(stream);
            return rdr.ReadToEnd();
        }
    }
}