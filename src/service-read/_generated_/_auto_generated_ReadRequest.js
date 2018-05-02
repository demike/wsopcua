// --------- This code has been automatically generated !!! 2018-02-08T10:26:10.747Z
"use strict";
/**
 * @module opcua.address_space.types
 */
var assert = require("node-opcua-assert");
var util = require("util");
var _  = require("underscore");
var makeNodeId = require("node-opcua-nodeid").makeNodeId;
var schema_helpers =  require("node-opcua-factory/src/factories_schema_helpers");
var extract_all_fields                       = schema_helpers.extract_all_fields;
var resolve_schema_field_types               = schema_helpers.resolve_schema_field_types;
var initialize_field                         = schema_helpers.initialize_field;
var initialize_field_array                   = schema_helpers.initialize_field_array;
var check_options_correctness_against_schema = schema_helpers.check_options_correctness_against_schema;
var _defaultTypeMap = require("node-opcua-factory/src/factories_builtin_types")._defaultTypeMap;
var ec = require("node-opcua-basic-types");
var encodeArray = ec.encodeArray;
var decodeArray = ec.decodeArray;
var makeExpandedNodeId = require("node-opcua-nodeid/src/expanded_nodeid").makeExpandedNodeId;
var generate_new_id = require("node-opcua-factory").generate_new_id;
var _enumerations = require("node-opcua-factory/src/factories_enumerations")._private._enumerations;
var schema = require("../schemas/ReadRequest_schema").ReadRequest_Schema;
var getFactory = require("node-opcua-factory/src/factories_factories").getFactory;
var RequestHeader = getFactory("RequestHeader");
var ReadValueId = require("./_auto_generated_ReadValueId").ReadValueId;
var BaseUAObject = require("node-opcua-factory/src/factories_baseobject").BaseUAObject;

/**
 * 
 * @class ReadRequest
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.requestHeader] {RequestHeader} 
 * @param  [options.maxAge] {Duration} Maximum age of the value to be read in milliseconds
 * @param  [options.timestampsToReturn = -1] {TimestampsToReturn} An enumeration that specifies the Timestamps to be returned for each requested Variable Value Attribute.
 * @param  [options.nodesToRead] {ReadValueId[]} List of Nodes and their Attributes to read. For each entry in this list, a StatusCode is returned, and if it indicates success, the Attribute Value is also returned.
 */
function ReadRequest(options)
{
    options = options || {};
    /* istanbul ignore next */
    if (schema_helpers.doDebug) { check_options_correctness_against_schema(this,schema,options); }
    var self = this;
    assert(this instanceof BaseUAObject); //  ' keyword "new" is required for constructor call')
    resolve_schema_field_types(schema);

    BaseUAObject.call(this,options);
    if (options === null) { 
        BaseUAObject.call(this,options);
        self.requestHeader =  null; /* new RequestHeader(null); */
        self.nodesToRead =  null; /* null array */
        return ;
    }

    /**
      * 
      * @property requestHeader
      * @type {RequestHeader}
      */
    self.requestHeader =  new RequestHeader( options.requestHeader);

    /**
      * Maximum age of the value to be read in milliseconds
      * @property maxAge
      * @type {Duration}
      */
    self.maxAge = initialize_field(schema.fields[1], options.maxAge);

    /**
      * An enumeration that specifies the Timestamps to be returned for each requested Variable Value Attribute.
      * @property timestampsToReturn
      * @type {TimestampsToReturn}
      * @default  -1
      */
    self.setTimestampsToReturn(initialize_field(schema.fields[2], options.timestampsToReturn));

    /**
      * List of Nodes and their Attributes to read. For each entry in this list, a StatusCode is returned, and if it indicates success, the Attribute Value is also returned.
      * @property nodesToRead
      * @type {ReadValueId[]}
      */
    self.nodesToRead = [];
    if (options.nodesToRead) {
        assert(_.isArray(options.nodesToRead));
        self.nodesToRead = options.nodesToRead.map(function(e){ return new ReadValueId(e); } );
    }

   // Object.preventExtensions(self);
}
util.inherits(ReadRequest,BaseUAObject);

//## Define Enumeration setters
ReadRequest.prototype.setTimestampsToReturn = function(value) {
   var coercedValue = _enumerations.TimestampsToReturn.typedEnum.get(value);
   /* istanbul ignore next */
   if (coercedValue === undefined || coercedValue === null) {
      throw new Error("value cannot be coerced to TimestampsToReturn: " + value);
   }
   this.timestampsToReturn = coercedValue;
};
ReadRequest.prototype.encodingDefaultBinary = makeExpandedNodeId(631,0);
ReadRequest.prototype.encodingDefaultXml = makeExpandedNodeId(630,0);
ReadRequest.prototype._schema = schema;

var encode_Duration = _defaultTypeMap.Duration.encode;
var decode_Duration = _defaultTypeMap.Duration.decode;
var encode_TimestampsToReturn = _enumerations.TimestampsToReturn.encode;
var decode_TimestampsToReturn = _enumerations.TimestampsToReturn.decode;
/**
 * encode the object into a binary stream
 * @method encode
 *
 * @param stream {BinaryStream} 
 */
ReadRequest.prototype.encode = function(stream,options) {
    // call base class implementation first
    BaseUAObject.prototype.encode.call(this,stream,options);
   this.requestHeader.encode(stream,options);
    encode_Duration(this.maxAge,stream);
    encode_TimestampsToReturn(this.timestampsToReturn,stream);
    encodeArray(this.nodesToRead,stream,function(obj,stream){ obj.encode(stream,options); }); 
};
/**
 * decode the object from a binary stream
 * @method decode
 *
 * @param stream {BinaryStream} 
 * @param [option] {object} 
 */
ReadRequest.prototype.decode = function(stream,options) {
    // call base class implementation first
    BaseUAObject.prototype.decode.call(this,stream,options);
    this.requestHeader.decode(stream,options);
    this.maxAge = decode_Duration(stream,options);
    this.timestampsToReturn = decode_TimestampsToReturn(stream,options);
    this.nodesToRead = decodeArray(stream, function(stream) { 
       var obj = new ReadValueId(null);
       obj.decode(stream,options);
       return obj; 
    });
};
ReadRequest.possibleFields = [
  "requestHeader",
         "maxAge",
         "timestampsToReturn",
         "nodesToRead"
];


exports.ReadRequest = ReadRequest;
var register_class_definition = require("node-opcua-factory/src/factories_factories").register_class_definition;
register_class_definition("ReadRequest",ReadRequest);
