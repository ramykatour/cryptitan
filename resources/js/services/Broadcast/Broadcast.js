import Echo from "./echo";
import {tap} from "lodash";
import {useMemo} from "react";

/**
 * Use Broadcast
 *
 * @param channel
 * @returns {Channel}
 */
export function useBroadcast(channel) {
    return useMemo(() => Echo.channel(channel), [channel]);
}

/**
 * Use Private Broadcast
 *
 * @param channel
 * @returns {Channel}
 */
export function usePrivateBroadcast(channel) {
    return useMemo(() => Echo.private(channel), [channel]);
}

/**
 * Use Presence Channel
 *
 * @param channel
 * @returns {PresenceChannel}
 */
export function usePresenceBroadcast(channel) {
    return useMemo(() => {
        return tap(Echo.join(channel), (channel) => {
            // customize presence methods with unbind
        });
    }, [channel]);
}
