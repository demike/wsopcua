import { assert } from 'src/assert';
import { NodeId, StatusCode } from 'src/basic-types';
import { EventEmitter } from 'src/eventemitter';
import { resolveNodeId } from 'src/nodeid';
import { lowerFirstLetter } from 'src/utils';
import { Variant } from 'src/variant';
import { ClientSession } from '../client_session';

export interface TVariant<T> extends Variant {
  value: T;
}
export interface TTwoStateStatus extends TVariant<string> {
  id: TVariant<boolean>;
}
export interface EventStuff {
  conditionId: TVariant<NodeId>;
  eventType: TVariant<NodeId>;
  eventId: TVariant<Buffer>;
  retain: TVariant<boolean>;
  activeState: TTwoStateStatus;
  ackedState: TTwoStateStatus;
  confirmedState: TTwoStateStatus;
}

export interface ClientAlarm {
  conditionId: NodeId;
  eventType: NodeId;
  fields: EventStuff;
  on(eventName: 'changed', eventHandler: () => void): this;
  acknowledge(session: ClientSession, comment: string): Promise<StatusCode>;
}

export interface ClientAlarmEvents {
  changed: () => void;
}

/**
 * describes a OPCUA Alarm as seen in the client side
 */
export class ClientAlarm extends EventEmitter<ClientAlarmEvents> {
  public conditionId: NodeId;
  public eventType: NodeId;
  public eventId: Buffer;
  public fields: EventStuff;

  public constructor(eventFields: EventStuff) {
    super();
    this.conditionId = resolveNodeId(eventFields.conditionId.value);
    this.eventType = resolveNodeId(eventFields.eventType.value);
    this.eventId = eventFields.eventId.value;
    this.fields = eventFields;
    this.update(eventFields);
  }
  public async acknowledge(session: ClientSession, comment: string): Promise<StatusCode> {
    return await (session as any).acknowledgeCondition(this.conditionId, this.eventId, comment);
  }
  public async confirm(session: ClientSession, comment: string): Promise<StatusCode> {
    return await (session as any).confirmCondition(this.conditionId, this.eventId, comment);
  }
  public update(eventFields: EventStuff) {
    assert(this.conditionId.toString() === resolveNodeId(eventFields.conditionId.value).toString());
    assert(this.eventType.toString() === resolveNodeId(eventFields.eventType.value).toString());
    this.eventId = eventFields.eventId.value;
    this.fields = eventFields;
  }
  public getRetain(): boolean {
    return this.fields.retain.value;
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
export function fieldsToJson(fields: string[], eventFields: Variant[]): EventStuff {
  function setProperty(_data: any, fieldName: string, value: Variant) {
    let name: string;
    if (!fieldName || value === null) {
      return;
    }
    const f = fieldName.split('.');
    if (f.length === 1) {
      fieldName = lowerFirstLetter(fieldName);
      _data[fieldName] = value;
    } else {
      for (let i = 0; i < f.length - 1; i++) {
        name = lowerFirstLetter(f[i]);
        _data[name] = _data[name] || {};
        _data = _data[name];
      }
      name = lowerFirstLetter(f[f.length - 1]);
      _data[name] = value;
    }
  }
  if (fields.length > eventFields.length) {
    // eslint-disable-next-line no-console
    console.log('warning fields.length !==  eventFields.length', fields.length, eventFields.length);
  }
  const data: any = {};
  for (let index = 0; index < fields.length; index++) {
    const variant = eventFields[index];
    setProperty(data, fields[index], variant);
  }
  setProperty(data, 'conditionId', eventFields[eventFields.length - 1]);
  return data;
}
