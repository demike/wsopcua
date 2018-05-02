/*
import { ClassFile } from "./ClassFile";
import { SimpleType } from "./SimpleType";
*/
import {ClassFile,SimpleType,StructTypeFile} from './SchemaParser.module';

export class TypeRegistry {

    protected static readonly BASIC_TYPES_PATH : string = "../basic-types";

    public static typeMap : { [key:string]:ClassFile} = {}

    public static addType(name : string,type : ClassFile) {
        this.typeMap[name] = type;
    }

    public static getType(name : string) {
        let i = name.indexOf(':');
        if (i > 0) {
            name = name.substr(i+1);
        }
        return this.typeMap[name];
    }

    public static getTypes() : ClassFile[] {
        let ar : ClassFile[] = [];
        for (let key in this.typeMap) {
            ar.push(this.typeMap[key]);
        }
        return ar;
    }

    public static init() {
        let type : SimpleType;

        type = new SimpleType("DataStream");
        type.Path = this.BASIC_TYPES_PATH + "/DataStream";
        this.addType(type.Name,type);

        let structtype = new StructTypeFile("Variant");
        structtype.Path = "../variant";
        structtype.Complete = true;
        structtype.Written = true;
        this.addType(structtype.Name,structtype);

        //OPC-UA Standard Data Types - OPC-UA Specification Part 3: 8.*
        //NodeId 8.2
        type = new SimpleType("NodeId");
        //type.Path = this.BASIC_TYPES_PATH + "nodeid";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);
         
        //ExpandedNodeId: 
        type = new SimpleType("ExpandedNodeId");
//        type.Path = this.BASIC_TYPES_PATH + "nodeid";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);

        //QualifiedName 8.3
            //TODO

        // LocaleId 8.4
        type = new SimpleType("LocaleId");
//      type.Path = this.BASIC_TYPES_PATH + "localeid";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";


       type.JsType = "string";
       this.addType(type.Name,type);
        //LocalizedText 8.5
            //TODO
        //Argument 8.6
            //TODO
        //BaseDataType 8.7
            //TODO

       //Bit
       type = new SimpleType("Bit");
       type.Path = this.BASIC_TYPES_PATH + "/boolean";
       type.JsType = "boolean";
       this.addType(type.Name,type);
        
       // Boolean 8.8
       type = new SimpleType("Boolean");
//       type.Path = this.BASIC_TYPES_PATH + "boolean";
       type.Path = this.BASIC_TYPES_PATH;
       type.ImportAs = "ec";
       type.JsType = "boolean";
       this.addType(type.Name,type);

        //Byte  8.9
        type = new SimpleType("Byte");
//        type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";

        this.addType(type.Name,type);
        //UInt8
        this.addType("Uint8",type);

        //ByteString 8.10
        type = new SimpleType("ByteString");
//        type.Path = this.BASIC_TYPES_PATH + "byte_string";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type); 
        type.JsType = "Uint8Array";
        //Image: 8.19
        this.addType("Image",type);
        //ImageBMP: 8.20
        this.addType("ImageBMP",type);
        //ImageGIF: 8.21
        this.addType("ImageGIF",type);
        //ImageJPG: 8.22
        this.addType("ImageJPG",type);
        //ImagePNG: 8.23
        this.addType("ImagePNG",type);
        this.addType("ContinuationPoint",type);

        //DateTime 8.11
        type = new SimpleType("DateTime");
//        type.Path = this.BASIC_TYPES_PATH + "date_time";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);
        type.JsType = "Date";
        //UtcTime: 8.38
        this.addType("UtcTime",type);
    
        //Double: 8.12
        type = new SimpleType("Double");
//        type.Path = this.BASIC_TYPES_PATH + "floats";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type); 
        //Duration 8.13
        this.addType("Duration",type);

        //Enumeration 8.14:
            //TODO
       //Float 8.15: 
       type = new SimpleType("Float");
//       type.Path = this.BASIC_TYPES_PATH + "floats";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type); 

        //Guid: 8.16
        type = new SimpleType("Guid");
//        type.Path = this.BASIC_TYPES_PATH + "guid";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);

       //SByte: 8.17 
       type = new SimpleType("SByte");
//       type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);
       //Int8
       this.addType("Uint8",type);


       //IdType: 8.18
            //TODO

        //Integer (as base type): 8.24
            //TODO
        //Int16: 8.25
        type = new SimpleType("Int16");
//        type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);

        //Int32: 8.26
        type = new SimpleType("Int32");
//        type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);

        //Int64: 8.27
        type = new SimpleType("Int64");
//        type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type); 

        //TimeZoneDataType: 8.28
            //TODO
        //NamingRuleType: 8.29
            //TODO
        //NodeClass: 8.30
            //TODO
        //Number: 8.31 abstract type
            //TODO
        //String: 8.32
        type = new SimpleType("String");
//        type.Path = this.BASIC_TYPES_PATH + "string";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        type._jsType = "string";
        this.addType(type.Name,type); 
        //Time
        this.addType("Time",type);
        //CharArray
        this.addType("CharArray",type);

        //Structure: 8.33 (abstract)
            //TODO
        //UInteger: 8.34 (abstract)
        
        //UInt16: 8.35 
        type = new SimpleType("UInt16");
//        type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type); 

        //UInt32: 8.36
        type = new SimpleType("UInt32");
//        type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);

        //UInt64: 8.37
        type = new SimpleType("UInt64");
 //       type.Path = this.BASIC_TYPES_PATH + "integers";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);

        //XmlElement: 8.39
        type = new SimpleType("XmlElement");
        type.Path = this.BASIC_TYPES_PATH + "/xml_element";
        type.ImportAs = "ec";
        this.addType(type.Name,type); 

        //EnumValueType: 8.40
//        type = new SimpleType("EnumValueType");
//        this.addType(type.Name,type);
            //TODO

        //OptionSet: 8.41
            //TODO

        //Union (abstract): 8.42
            //TODO

        //DateString: 8.43
            //TODO
        //DecimalString: 8.44
            //TODO
        //DurationString: 8.45
            //TODO
        //NormalizedString: 8.46
            //TODO
        //TimeString: 8.47
            //TODO
        //DataTypeDefinition: 8.48
            //This abstract DataType is the base type for all DataTypes used to provide the meta data for
            //custom DataTypes like Structures and Enumerations.
            //TODO
        //StructureDefinition: 8.49 
            //TODO
        //EnumDefinition: 8.50
            //TODO
        //StructureField: 8.51
            //TODO
        //EnumField: 8.52
            //TODO
        //AudioData: 8.53
            //TODO
        //Decimal: 8.54
            //TODO
        

        //StatusCode:
        type = new SimpleType("StatusCode");
//        type.Path = this.BASIC_TYPES_PATH + "/status_code";
        type.Path = this.BASIC_TYPES_PATH;
        type.ImportAs = "ec";
        this.addType(type.Name,type);
        
        /*
QualifiedName:     20 , 
LocalizedText:     21 , 
    Structure:     22 , 
    DataValue:     23 ,
    */ 
    }
}