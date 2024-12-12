import { KittyAgent } from './kitty-agent';
import { parseAtUri } from '../utils';
import type { At } from '@atcute/client/lexicons';
import { parse as parseMime } from 'file-type-mime';
import { toString as ui8ToString, fromString as ui8FromString } from 'uint8arrays';
import { user, type Account, type User } from './signed-in-user';
import { getDidAndPds } from './pds-helpers';
import mime from 'mime';
import { filepathToRkey } from './rkey';

export class AtwebClient {
    get agent(): KittyAgent {
        return this.user.agent;
    }

    get user() {
        if (!user.value) throw new Error('Not signed in');
        return user.value;
    }

    async uploadPage(
        path: string,
        pageContents: string | Uint8Array,
        existingCid?: string,
        mimeType?: string,
    ): Promise<{ rkey: string; cid: At.CID; uri: At.Uri; }> {
        if (typeof pageContents === 'string') {
            pageContents = new TextEncoder().encode(pageContents);
            mimeType = 'text/mdx';
        }

        mimeType ??= mime.getType(path) ?? undefined;

        const blob = await this.agent.uploadBlob(new Blob([pageContents], { type: mimeType }));

        const rkey = filepathToRkey(path);

        const result = await this.agent.put({
            collection: 'io.github.atweb.file',
            repo: this.user.did,
            rkey,
            swapCommit: existingCid,
            record: {
                $type: 'io.github.atweb.file',
                body: blob,
                filePath: path,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
            }
        });

        return { ...result, rkey };
    }
}
