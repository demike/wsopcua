/*
import { ClassFile } from "./ClassFile";
import { SimpleType } from "./SimpleType";
*/
import {ClassFile,SimpleType} from './SchemaParser.module';

export class TypeRegistry {

    protected static readonly BASIC_TYPES_PATH : string = "../../";

    public static typeMap : { [key:string]:ClassFile} = {}

    public static addType(name : string,type : ClassFile) {
        this.typeMap[name] = type;
    }

    public static getType(name : string) {
        return this.typeMap[name];
    }

    public static init() {
        let type : SimpleType;

        type = new SimpleType("DataStream");
        type.Path = this.BASIC_TYPES_PATH + "DataStream";
        this.addType(type.Name,type);


        //OPC-UA Standard Data Types - OPC-UA Specification Part 3: 8.*
        //NodeId 8.2

        //QualifiedName 8.3

       // LocaleId 8.4
       type = new SimpleType("LocaleId");
       type.Path = this.BASIC_TYPES_PATH + "localeid";
       type.JsType = "string";
       this.addType(type.Name,type);
        //LocalizedText 8.5
            //TODO
        //Argument 8.6
            //TODO
        //BaseDataType 8.7
            //TODO
        
       // Boolean 8.8
       type = new SimpleType("Boolean");
       type.Path = this.BASIC_TYPES_PATH + "boolean";
       type.JsType = "boolean";
       this.addType(type.Name,type);

        //Byte  8.9
        type = new SimpleType("Byte");
        type.Path = this.BASIC_TYPES_PATH + "integer";
        this.addType(type.Name,type);

       //ByteString 8.10
            //TODO

       //DateTime 8.11
            //TODO
        //Double: 8.12
        type = new SimpleType("Double");
        type.Path = this.BASIC_TYPES_PATH + "float";
        this.addType(type.Name,type); 

       // SByte 
       type = new SimpleType("SByte");
       type.Path = this.BASIC_TYPES_PATH + "integer";
       this.addType(type.Name,type);


        //Int16:      4 , 
        type = new SimpleType("Int16");
        type.Path = this.BASIC_TYPES_PATH + "integer";
        this.addType(type.Name,type);

        //UInt16:      5 ,
        type = new SimpleType("UInt16");
        type.Path = this.BASIC_TYPES_PATH + "integer";
        this.addType(type.Name,type); 
        //Int32:      6 ,
        type = new SimpleType("Int32");
        type.Path = this.BASIC_TYPES_PATH + "integer";
        this.addType(type.Name,type); 

        //UInt32:      7 ,
        type = new SimpleType("UInt32");
        type.Path = this.BASIC_TYPES_PATH + "integer";
        this.addType(type.Name,type);

        //Int64:      8 ,
        type = new SimpleType("Int64");
        type.Path = this.BASIC_TYPES_PATH + "integer";
        this.addType(type.Name,type); 
       
        //UInt64:      9 ,
        type = new SimpleType("UInt64");
        type.Path = this.BASIC_TYPES_PATH + "integer";
        this.addType(type.Name,type);

        //Float:     10 ,
        type = new SimpleType("Float");
        type.Path = this.BASIC_TYPES_PATH + "float";
        this.addType(type.Name,type); 
        
        
        //String:     12 ,
        type = new SimpleType("String");
        type.Path = this.BASIC_TYPES_PATH + "string";
        this.addType(type.Name,type); 
        
        //DateTime:     13 ,
        type = new SimpleType("DateTime");
        type.Path = this.BASIC_TYPES_PATH + "date_time";
        this.addType(type.Name,type);
        type.JsType = "Date";
        
        //Guid:     14 ,
        type = new SimpleType("Guid");
        type.Path = this.BASIC_TYPES_PATH + "guid";
        this.addType(type.Name,type);
        
        //ByteString:     15 ,
        type = new SimpleType("ByteString");
        type.Path = this.BASIC_TYPES_PATH + "byte_string";
        this.addType(type.Name,type); 
        type.JsType = "Uint8Array";
   
        //XmlElement:     16 ,
        type = new SimpleType("XmlElement");
        type.Path = this.BASIC_TYPES_PATH + "xml_element";
        this.addType(type.Name,type); 

        //NodeId:     17 ,
        type = new SimpleType("NodeId");
        type.Path = this.BASIC_TYPES_PATH + "nodeid";
        this.addType(type.Name,type); 

        //ExpandedNodeId:     18 ,
        type = new SimpleType("ExpandedNodeId");
        type.Path = this.BASIC_TYPES_PATH + "nodeid";
        this.addType(type.Name,type);
        
        //StatusCode:     19 ,
        type = new SimpleType("StatusCode");
        type.Path = this.BASIC_TYPES_PATH + "status_code";
        this.addType(type.Name,type);
        
        /*
QualifiedName:     20 , 
LocalizedText:     21 , 
    Structure:     22 , 
    DataValue:     23 ,
    */ 
    }
}