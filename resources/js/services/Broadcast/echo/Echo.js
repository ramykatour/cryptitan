import context from "context";
import Echo from "laravel-echo";

let config = {};

const {driver, connection} = context.broadcast;

if (typeof window === "object") {
    const host = window.location.hostname;

    switch (driver) {
        case "pusher":
            config = {
                broadcaster: "pusher",
                key: connection.key,
                forceTLS: document.location.protocol === "https:",
                wsHost: host,
                wssPort: 2096,
                wsPort: 2095,
                cluster: connection.cluster,
                disableStats: true
            };
            break;
    }
}

export default new Echo(config);
