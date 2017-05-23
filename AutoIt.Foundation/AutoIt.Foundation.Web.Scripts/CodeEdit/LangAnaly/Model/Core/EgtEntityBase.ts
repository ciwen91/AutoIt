namespace CodeEdit.LangAnaly.Model {
    class EgtEntityBase {
        ID:number;
    }

    class  CharSet extends  EgtEntityBase{
        public Group: List<CharSetItem> = new List<CharSetItem>(); 
    }

    class CharSetItem {
        Start: number;
        End:number;
    }

    class Group {
        Name: string;
        Container: Symbol;
        Start: Symbol;
        End: Symbol;
        AdvanceMode: AdvanceMode;
        EndingMode: EndingMode;
        NestGroup:List<Symbol>;
    }

    enum AdvanceMode {
        Token = 0,
        Character = 1
    }

    enum EndingMode {
        Open = 0,
        Close = 1
    }

    class  Symbol extends  EgtEntityBase {
        public Name: string;
        public Type:SymbolType;
    }

   enum SymbolType {
        Nonterminal = 0,
        Terminal = 1,
        Noise = 2,
        EndofFile = 3,
        GroupStart = 4,
        GroundEnd = 5,
        Error = 7
    }

    class  Produce extends EgtEntityBase {
        NonTerminal: Symbol;
        SymbolGroup:List<Symbol>;
   }

    class DFAState extends  EgtEntityBase {
        AcceptSymbol: Symbol;
        EdgGroup:List<DFAEdge>=new List<DFAEdge>();
    }

    class DFAEdge {
        CharSet: CharSet;
        TargetState:DFAState;
    }

    class LALRState extends EgtEntityBase {
        ActionGroup:List<LALRAction>=new List<LALRAction>();
    }

    class LALRAction {
        Symbol: Symbol;
        ActionType: ActionType;
        TargetState: LALRState;
        TargetRule:Produce;
    }

    enum ActionType {
        Shift = 1,
        Reduce = 2,
        Goto = 3,
        Accept = 4
    }
}