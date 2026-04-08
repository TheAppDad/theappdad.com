/**
 * Node (e.g. v25 on some macOS builds) can throw from os.networkInterfaces()
 * (uv_interface_addresses). Next.js calls that when picking a dev "network" URL.
 * This preload catches the failure and returns a minimal loopback map so `next dev`
 * can start without `-H 127.0.0.1` — avoiding localhost vs 127.0.0.1 proxy mismatches.
 */
"use strict";

const os = require("os");

const orig = os.networkInterfaces.bind(os);

os.networkInterfaces = function networkInterfacesPatched() {
  try {
    return orig();
  } catch (err) {
    const syscall = err && typeof err === "object" ? err.syscall : "";
    const code = err && typeof err === "object" ? err.code : "";
    if (
      code === "ERR_SYSTEM_ERROR" ||
      syscall === "uv_interface_addresses"
    ) {
      return {
        lo0: [
          {
            address: "127.0.0.1",
            netmask: "255.0.0.0",
            family: "IPv4",
            mac: "00:00:00:00:00:00",
            internal: true,
            cidr: "127.0.0.1/8",
          },
          {
            address: "::1",
            netmask: "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
            family: "IPv6",
            mac: "00:00:00:00:00:00",
            internal: true,
            cidr: "::1/128",
            scopeid: 0,
          },
        ],
      };
    }
    throw err;
  }
};
