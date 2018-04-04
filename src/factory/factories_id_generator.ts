"use strict";

var _FIRST_INTERNAL_ID : number = 0xFFFE0000;

var _next_available_id = _FIRST_INTERNAL_ID;
export function generate_new_id () {
    _next_available_id += 1;
    return _next_available_id;
};

export function next_available_id () {
    return -1;
};
export function is_internal_id (value : number) {
    return value >= _FIRST_INTERNAL_ID;
};


