module CodeEdit.LangAnaly.Model {
    export  enum SymbolType {
        Nonterminal = 0,
        Terminal = 1,
        Noise = 2,
        EndofFile = 3,
        GroupStart = 4,
        GroundEnd = 5,
        Error = 7
    }
}