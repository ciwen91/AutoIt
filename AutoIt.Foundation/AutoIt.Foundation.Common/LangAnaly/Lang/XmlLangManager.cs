using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common.LangAnaly.Lang
{
    public class XmlLangManager:LangManagerBase
    {
        private enum SymbolIndex
        {
            @Eof = 0,                                  // (EOF)
            @Error = 1,                                // (Error)
            @Whitespace = 2,                           // Whitespace
            @Quote = 3,                                // '"'
            @Divgt = 4,                                // '/>'
            @Questiongt = 5,                           // '?>'
            @Lt = 6,                                   // '<'
            @Ltdiv = 7,                                // '</'
            @Ltquestion = 8,                           // '<?'
            @Eq = 9,                                   // '='
            @Gt = 10,                                  // '>'
            @Charnumber = 11,                          // CharNumber
            @Name = 12,                                // Name
            @Textcharname = 13,                        // TextCharName
            @Textnormal = 14,                          // TextNormal
            @Val = 15,                                 // Val
            @Attribute = 16,                           // <Attribute>
            @Attributes = 17,                          // <Attributes>
            @Content = 18,                             // <Content>
            @Doc = 19,                                 // <Doc>
            @Elm = 20,                                 // <Elm>
            @Elms = 21,                                // <Elms>
            @Endtag = 22,                              // <End Tag>
            @Selfclosetag = 23,                        // <SelfClose Tag>
            @Starttag = 24,                            // <Start Tag>
            @Text = 25,                                // <Text>
            @Word = 26                                 // <Word>
        }

        private enum ProductionIndex
        {
            @Doc_Ltquestion_Name_Questiongt = 0,       // <Doc> ::= '<?' Name <Attributes> '?>' <Elm>
            @Doc = 1,                                  // <Doc> ::= <Elm>
            @Elm = 2,                                  // <Elm> ::= <Start Tag> <Content> <End Tag>
            @Elm2 = 3,                                 // <Elm> ::= <SelfClose Tag>
            @Elms = 4,                                 // <Elms> ::= <Elms> <Elm>
            @Elms2 = 5,                                // <Elms> ::= <Elm>
            @Starttag_Lt_Name_Gt = 6,                  // <Start Tag> ::= '<' Name <Attributes> '>'
            @Endtag_Ltdiv_Name_Gt = 7,                 // <End Tag> ::= '</' Name '>'
            @Selfclosetag_Lt_Name_Divgt = 8,           // <SelfClose Tag> ::= '<' Name <Attributes> '/>'
            @Attributes = 9,                           // <Attributes> ::= <Attributes> <Attribute>
            @Attributes2 = 10,                         // <Attributes> ::= 
            @Attribute_Name_Eq_Val = 11,               // <Attribute> ::= Name '=' Val
            @Content = 12,                             // <Content> ::= <Elms>
            @Content2 = 13,                            // <Content> ::= <Text>
            @Text = 14,                                // <Text> ::= <Text> <Word>
            @Text2 = 15,                               // <Text> ::= 
            @Word_Name = 16,                           // <Word> ::= Name
            @Word_Val = 17,                            // <Word> ::= Val
            @Word_Textnormal = 18,                     // <Word> ::= TextNormal
            @Word_Textcharname = 19,                   // <Word> ::= TextCharName
            @Word_Charnumber = 20,                     // <Word> ::= CharNumber
            @Word_Gt = 21,                             // <Word> ::= '>'
            @Word_Quote = 22,                          // <Word> ::= '"'
            @Word_Eq = 23                              // <Word> ::= '='
        }


        public XmlLangManager(string egtPath) : base(egtPath)
        {
        }


    }
}
