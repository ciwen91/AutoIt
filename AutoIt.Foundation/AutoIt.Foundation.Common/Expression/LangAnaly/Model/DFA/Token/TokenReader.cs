﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Compiler.Egt;

namespace Compiler.Token
{
   public class TokenReader
   {
        private EgtManager _Egt;
        private string _Str;

       private int _Index = 0;
       private int _Line = 0;
       private int _Col = 0;
       
        public TokenReader(EgtManager egt,string str)
        {
            _Egt = egt;
            _Str = str;
        }

       public Token ReadToken()
       {
            if (_Index == _Str.Length)
            {
                return new Token(TokenState.End, null, null,_Line,_Col);
            }

           var index = _Index; 
            var startIndex = index;

            var state = _Egt.DFAStateGroup[0];
            Symbol acceptSymbol = null;
            int accpetIndex = -1;

            while (true)
            {
                DFAEdge edge = null;

                if (index <= _Str.Length - 1)
                {
                    var cha = _Str[index];
                    edge = state.GetEdge(cha);
                }

                if (edge != null)
                {
                    state = edge.TargetState;

                    if (state.AcceptSymbol != null)
                    {
                        acceptSymbol = state.AcceptSymbol;
                        accpetIndex = index;
                    }

                    index++;
                }
                else
                {
                    if (acceptSymbol != null)
                    {                  
                        var  token=new Token(TokenState.Accept, acceptSymbol,
                            _Str.Substring(startIndex, accpetIndex - startIndex + 1),
                            _Line,_Col);
                        Consumn(token.Value);
                        return token;
                    }
                    else
                    {
                        var token = new Token(TokenState.Error, null, _Str[startIndex].ToString(),
                            _Line,_Col);
                        Consumn(token.Value);

                        return token;
                    }
                }
            }
        }

       private void Consumn(string val)
       {
           foreach (var item in val )
           {
               if (item == '\n')
               {
                   _Line += 1;
                   _Col = 0;
               }
               else if (item == '\r')
               {

               }
               else
               {
                   _Col += 1;
               }
           }

           _Index += val.Length;
       }
    }
}
