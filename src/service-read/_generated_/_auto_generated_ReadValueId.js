// --------- This code has been automatically generated !!! 2018-02-08T10:26:10.628Z
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
var schema = require("../schemas/ReadValueId_schema").ReadValueId_Schema;
var getFactory = require("node-opcua-factory/src/factories_factories").getFactory;
var QualifiedName = getFactory("QualifiedName");
var BaseUAObject = require("node-opcua-factory/src/factories_baseobject").BaseUAObject;

/**
 * 
 * @class ReadValueId
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.nodeId] {NodeId} 
 * @param  [options.attributeId = 13] {IntegerId} 
 * @param  [options.indexRange] {NumericRange} 
 * @param  [options.dataEncoding] {QualifiedName} 
 */
function ReadValueId(options)
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
        self.dataEncoding =  null; /* new QualifiedName(null); */
        return ;
    }

    /**
      * 
      * @property nodeId
      * @type {NodeId}
      */
    self.nodeId = initialize_field(schema.fields[0], options.nodeId);

    /**
      * 
      * @property attributeId
      * @type {IntegerId}
      * @default  13
      */
    self.attributeId = initialize_field(schema.fields[1], options.attributeId);

    /**
      * 
      * @property indexRange
      * @type {NumericRange}
      */
    self.indexRange = initialize_field(schema.fields[2], options.indexRange);

    /**
      * 
      * @property dataEncoding
      * @type {QualifiedName}
      */
    self.dataEncoding =  new QualifiedName( options.dataEncoding);

   // Object.preventExtensions(self);
}
util.inherits(ReadValueId,BaseUAObject);
ReadValueId.prototype.encodingDefaultBinary = makeExpandedNodeId(628,0);
ReadValueId.prototype.encodingDefaultXml = makeExpandedNodeId(627,0);
ReadValueId.prototype._schema = schema;

var encode_NodeId = _defaultTypeMap.NodeId.encode;
var decode_NodeId = _defaultTypeMap.NodeId.decode;
var encode_IntegerId = _defaultTypeMap.IntegerId.encode;
var decode_IntegerId = _defaultTypeMap.IntegerId.decode;
var encode_NumericRange = _defaultTypeMap.NumericRange.encode;
var decode_NumericRange = _defaultTypeMap.NumericRange.decode;
/**
 * encode the object into a binary stream
 * @method encode
 *
 * @param stream {BinaryStream} 
 */
ReadValueId.prototype.encode = function(stream,options) {
    // call base class implementation first
    BaseUAObject.prototype.encode.call(this,stream,options);
    encode_NodeId(this.nodeId,stream);
    encode_IntegerId(this.attributeId,stream);
    encode_NumericRange(this.indexRange,stream);
   this.dataEncoding.encode(stream,options);
};
/**
 * decode the object from a binary stream
 * @method decode
 *
 * @param stream {BinaryStream} 
 * @param [option] {object} 
 */
ReadValueId.prototype.decode = function(stream,options) {
    // call base class implementation first
    BaseUAObject.prototype.decode.call(this,stream,options);
    this.nodeId = decode_NodeId(stream,options);
    this.attributeId = decode_IntegerId(stream,options);
    this.indexRange = decode_NumericRange(stream,options);
    this.dataEncoding.decode(stream,options);
};
ReadValueId.possibleFields = [
  "nodeId",
         "attributeId",
         "indexRange",
         "dataEncoding"
];


exports.ReadValueId = ReadValueId;
var register_class_definition = require("node-opcua-factory/src/factories_factories").register_class_definition;
register_class_definition("ReadValueId",ReadValueId);
