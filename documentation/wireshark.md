# Debugging with wireshark

If you are familiar with wireshark the following lua script could be handy.
It makes it possible to dissect OPC-UA over websocket.

```lua
local tcp_dissector_table = DissectorTable.get("tcp.port")
local opcua_dissector = tcp_dissector_table:get_dissector(4840)

local ws_dissector_table = DissectorTable.get("ws.port")
ws_dissector_table:add(4444,opcua_dissector)
```

Change the Port `4444` to your used websocket port.
