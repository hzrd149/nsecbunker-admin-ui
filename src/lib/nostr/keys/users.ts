import {rpc as rpcStore} from '../../stores/ndk'
import { get as getStore } from 'svelte/store';
import type { NDKRpcResponse } from '@nostr-dev-kit/ndk';

export type KeyUser = {
    name: string;
    pubkey: string;
    description: string;
    createdAt: Date;
    lastUsedAt: Date;
    revokedAt: Date;
    signingConditions: any;
};

export async function loadKeyUsers(remotePubkey: string, name: string): Promise<KeyUser[]> {
    const rpc = getStore(rpcStore);

    if (!rpc) throw new Error('RPC not initialized');

    const promise = new Promise<KeyUser[]>((resolve, reject) => {
        rpc.sendRequest(remotePubkey, 'get_key_users', [name], 24134, (response: NDKRpcResponse) => { // 24134
            const res = JSON.parse(response.result);

            if (res[0] === 'error') reject(res[1]);

            resolve(res);
        });
    });

    return promise;
}
