export interface AemetLocalAlert {
    alert: Alert;
}

export interface Alert {
    identifier: _text;
    sender:     _text;
    sent:       Date;
    status:     _text;
    msgType:    _text;
    scope:      _text;
    references: _text;
    info:       Info[];
}

export interface Info {
    language:     _text;
    category:     _text;
    event:        _text;
    responseType: _text;
    urgency:      _text;
    severity:     _text;
    certainty:    _text;
    eventCode:    EventCode;
    effective:    Date;
    onset:        Date;
    expires:      Date;
    senderName:   _text;
    headline:     _text;
    description:  _text;
    instruction:  _text;
    web:          _text;
    contact:      _text;
    parameter:    EventCode[];
    area:         Area[];
}

export interface Area {
    areaDesc: _text;
    polygon:  _text[];
    geocode:  Geocode;
}

export interface Geocode {
    valueName: _text;
    value:     _text;
}

export interface EventCode {
    valueName: _text;
    value:     _text;
}

export interface _text {
    _text: string;
}