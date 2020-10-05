/*
  O       o O       o O       o
  | O   o | | O   o | | O   o |
  | | O | | | | O | | | | O | |
  | o   O | | o   O | | o   O |
  o       O o       O o       O
*/

// @encapsule/holarchy - the keystone of holistic app platform
// Copyright (C) 2020 Christopher D. Russell for Encapsule Project

const packageMeta = require("./package.json");

const CellModel = require("./CellModel");
const CellProcessor = require("./CellProcessor");
const CellProcessPlane = require("./CellProcessPlane");
const AbstractProcessModel = require("./AbstractProcessModel");
const TransitionOperator = require("./TransitionOperator");
const ControllerAction = require("./ControllerAction");

// Implementation details of in-OS-process CellProcessor cellular software service runtime host environment.
const ObservableProcessController = require("./lib/ObservableProcessController"); // OPC - cellular runtime core (leveraced by CellProcessor (CP))
const ObservableControllerData = require("./lib/ObservableControllerData"); // OCD - celluar runtime memory core (leveraged by ObservableProcessController (OPC))

module.exports = {

    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    // ================================================================
    // DEVELOPER API
    // ================================================================

    /*
      CellModel (CM) is an ES6 class instantiated with operator
      new that represents a specific class of runtime "cell process"
      that associates the shared memory and process behaviors defined
      by an AbstractionProcessModel with speicfic sets of TransitionOperator
      and ControllerActions required to orchestrate cell process step
      transitions and their associated enter and exit action(s).
    */
    CellModel,

    /*
      AbstractProcessModel (APM) is an ES6 class instantiated with
      operator new that represents the shared memory and runtime
      behavior(s) of a cell process abstractly (i.e. the means by
      which anything that an AbstractProcessModel describes is actually
      orchestrated/executed is not directly specified by an
      AbstractProcessModel). APM specifically model the required/expected
      behaviors of a runtime cell process by allowing developers to
      declare orchestration rules and runtime side-effects (e.g. data
      transoformation alogorithms) in terms of a hybrid Finite State Machine
      (FSM) model.
    */
    AbstractProcessModel,

    /*
      TransitionOperator (TOP) is an ES6 class instantiated with operator
      new that implements a plug-in Boolean operator function used to
      evaluate cell process transition rules at runtime.
    */
    TransitionOperator,

    /*
      ControllerAction (ACT) is an ES6 class instantiated with operator
      new that implements a plug-in data transformation function used to
      evaluate cell process step exit and step enter actions.
    */
    ControllerAction,

    /*
      CellProcessor (CP) is an ES6 class instantiated with operator new
      that provides a runtime evaluation and execution environment for
      cellular process(es) defined by SoftwareCellModel class instances.
    */
    CellProcessor,

    /*
      CellProcessPlane is an ES6 class instantiated with operator new
      that is used to derive CellModel and AbstractProcessModel ID IRUT's
      from dot-delimited, developer-defined string constants.
    */
    CellProcessPlane,

    // ================================================================
    // IMPLEMENTATION
    // ================================================================

    /*
      ObservableProcessController (OPC) is an ES6 class instantiated with
      operator new that provides memory management, and generic evaluation
      of cellular process(es) (cellular automata). Developers do not
      typically use the OPC class directly but instead rely on CellProcessor
      (CP) to create and manage an OPC runtime instance on their behalf
      based on information derived from an CellModel (CM).
     */
    ObservableProcessController,

    /*
      ObservableControllerData (OCD) is an ES6 class instantiated with
      operator new that encapsulates a shared in-memory store data.
      OCD provides absolute and relative dot-delimited path addressing,
      type introspection, and fully abstracted I/O operations via
      its readNamespace and writeNamespace class API's that enforce
      name/type/value constraints, and provide data normalization
      (cascading default values) for all read and write operations via
      @encapsule/arccore.filter. This ensures that data written into and
      read from an OCD instance is correct at runtime, always.
      OPC uses OCD internally to to manage celluar process(es) runtime data
      on behalf of a CellProcessor (CP) instance. But, you can use it wherever
      you require strong runtime data fidelity, and addressable read/write
      facility. e.g. if you're preparing a network request you can use
      OCD to build the request and then call toJSON.
    */
    ObservableControllerData,

    // ================================================================
    // ================================================================
    // ================================================================
    // DEPRECATED: ApplicationStateController is deprecated. Use OCD.
    // ApplicationDataStore: ObservableControllerData,
    // ================================================================
    // ================================================================
    // ================================================================

    // HolarchyCore is a CellModel that encapsulates core logic and memory
    // operations for CellProcessor cell process manager process. It is
    // exported from the @encapsule/holarchy package to support low-level
    // testing of the ObservableProcessController (OPC) runtime host
    // environment mechanism and the contents of HolarchyCore itself without
    // using CellProcessor.

    HolarchyCore: require("./lib/intrinsics/HolarchyCore")

};
