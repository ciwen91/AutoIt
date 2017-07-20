//<Grid base="Container">
//    <width type="int" required="true"  min="0" max="3" fraction="3" />
//   <_many>
//        <control type="Controller"/>
//         <grid  type="EasyUIGrid"/>
//    </_many> 
//</Grid>


class TypeInfo {
    Parent: TypeInfo;

}

class AtrInfo {
    Name: string;
    Type: Type;
    Required: boolean;
    ValInfo:ValInfo;
}

abstract  class ValInfo {
    Pattern: string;//
    MixLength: number;
    MaxLength: number;  
    Min: number;
    Max: number;
    Fraction: number;
}

enum Type {
    string,
    byte,
    int,
    long,
    double,
    bool,
    datetime,
    date,
    time,
    enum    
}

function getType() {
    
}

function getAttributes() {
    
}

function getSonTypes() {
    
}

function getAttrValues() {
    
}