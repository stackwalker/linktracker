using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text;

namespace p1p.Business
{
    public class DocumentUtility
    {
        public string ConvertHtmlToDocPath(Types.DTO.DocumentDTO htmlDoc)
        {
            string tempFilePath = System.Configuration.ConfigurationManager.AppSettings["TempFilePath"];

            StringBuilder sb = new System.Text.StringBuilder();
            if (htmlDoc.Content.IndexOf("<html") < 0)
            {                
                sb.Append("<html><body>");
                sb.Append(htmlDoc.Content);
                sb.Append("</body></html>");
            }
            else
            {
                sb.Append(htmlDoc.Content);
            }
            
            if (!Directory.Exists(tempFilePath))
            {
                Directory.CreateDirectory(tempFilePath);
            }

            string fileName = htmlDoc.Title + ".doc";
            string fullFileName = tempFilePath + fileName;

            System.IO.StreamWriter file = null;

            try
            {
                file = new System.IO.StreamWriter(fullFileName);
                file.Write(sb.ToString());
            }
            finally
            {
                file.Close();
            }

            return fullFileName;           
        }
    }
}
