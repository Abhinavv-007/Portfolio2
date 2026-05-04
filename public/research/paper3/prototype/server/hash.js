/**
 * Server-side SHA256 helper using Node.js crypto module
 */
import { createHash } from 'crypto';

/**
 * Compute SHA256 hash of input string
 * @param {string} data - Input string to hash
 * @returns {string} Hex-encoded hash
 */
export function sha256(data) {
    return createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Compute chain hash: SHA256(prev_hash|election_id|index|commit|cast_at)
 * @param {string} prevHash - Previous chain head
 * @param {string} electionId - Election ID
 * @param {number} index - Ballot index
 * @param {string} commit - Ballot commit hash
 * @param {string} castAt - ISO timestamp
 * @returns {string} Hex-encoded chain hash
 */
export function computeChainHash(prevHash, electionId, index, commit, castAt) {
    const data = `${prevHash}|${electionId}|${index}|${commit}|${castAt}`;
    return sha256(data);
}

/**
 * Compute snapshot hash: SHA256(chain_head|ballot_count|closed_at)
 * @param {string} chainHead - Current chain head
 * @param {number} ballotCount - Total ballot count
 * @param {string} closedAt - ISO timestamp when closed
 * @returns {string} Hex-encoded snapshot hash
 */
export function computeSnapshotHash(chainHead, ballotCount, closedAt) {
    const data = `${chainHead}|${ballotCount}|${closedAt}`;
    return sha256(data);
}

/**
 * Generate a random UUID v4
 * @returns {string} UUID string
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
