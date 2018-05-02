// --------- This code has been automatically generated !!! 2018-02-08T10:26:10.753Z
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
var schema = require("../schemas/ReadResponse_schema").ReadResponse_Schema;
var getFactory = require("node-opcua-factory/src/factories_factories").getFactory;
var ResponseHeader = getFactory("ResponseHeader");
var DataValue = getFactory("DataValue");
var DiagnosticInfo = getFactory("DiagnosticInfo");
var BaseUAObject = require("node-opcua-factory/src/factories_baseobject").BaseUAObject;

/**
 * 
 * @class ReadResponse
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.responseHeader] {ResponseHeader} 
 * @param  [options.results] {DataValue[]} List of Attribute values as DataValue. The size and order of this list matches the size and order of the nodesToRead request parameter. There is one entry in this list for each Node  contained in the nodesToRead parameter.
 * @param  [options.diagnosticInfos] {DiagnosticInfo[]} 
 */
function ReadResponse(options)
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
        self.responseHeader =  null; /* new ResponseHeader(null); */
        self.results =  null; /* null array */
        self.diagnosticInfos =  null; /* null array */
        return ;
    }

    /**
      * 
      * @property responseHeader
      * @type {ResponseHeader}
      */
    self.responseHeader =  new ResponseHeader( options.responseHeader);

    /**
      * List of Attribute values as DataValue. The size and order of this list matches the size and order of the nodesToRead request parameter. There is one entry in this list for each Node  contained in the nodesToRead parameter.
      * @property results
      * @type {DataValue[]}
      */
    self.results = [];
    if (options.results) {
        assert(_.isArray(options.results));
        self.results = options.results.map(function(e){ return new DataValue(e); } );
    }

    /**
      * 
      * @property diagnosticInfos
      * @type {DiagnosticInfo[]}
      */
    self.diagnosticInfos = [];
    if (options.diagnosticInfos) {
        assert(_.isArray(options.diagnosticInfos));
        self.diagnosticInfos = options.diagnosticInfos.map(function(e){ return new DiagnosticInfo(e); } );
    }

   // Object.preventExtensions(self);
}
util.inherits(ReadResponse,BaseUAObject);
ReadResponse.prototype.encodingDefaultBinary = makeExpandedNodeId(634,0);
ReadResponse.prototype.encodingDefaultXml = makeExpandedNodeId(633,0);
ReadResponse.prototype._schema = schema;

/**
 * encode the object into a binary stream
 * @method encode
 *
 * @param stream {BinaryStream} 
 */
ReadResponse.prototype.encode = function(stream,options) {
    // call base class implementation first
    BaseUAObject.prototype.encode.call(this,stream,options);
   this.responseHeader.encode(stream,options);
    encodeArray(this.results,stream,function(obj,stream){ obj.encode(stream,options); }); 
    encodeArray(this.diagnosticInfos,stream,function(obj,stream){ obj.encode(stream,options); }); 
};
/**
 * decode the object from a binary stream
 * @method decode
 *
 * @param stream {BinaryStream} 
 * @param [option] {object} 
 */
ReadResponse.prototype.decode = function(stream,options) {
    // call base class implementation first
    BaseUAObject.prototype.decode.call(this,stream,options);
    this.responseHeader.decode(stream,options);
    this.results = decodeArray(stream, function(stream) { 
       var obj = new DataValue(null);
       obj.decode(stream,options);
       return obj; 
    });
    this.diagnosticInfos = decodeArray(stream, function(stream) { 
       var obj = new DiagnosticInfo(null);
       obj.decode(stream,options);
       return obj; 
    });
};
ReadResponse.possibleFields = [
  "responseHeader",
         "results",
         "diagnosticInfos"
];


exports.ReadResponse = ReadResponse;
var register_class_definition = require("node-opcua-factory/src/factories_factories").register_class_definition;
register_class_definition("ReadResponse",ReadResponse);