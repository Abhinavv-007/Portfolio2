/**
 * File-based storage module with append-only writes and atomic updates
 */
import { readFileSync, writeFileSync, appendFileSync, renameSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
export const DEFAULT_ELECTION_ID = 'e0000000-0000-0000-0000-000000000001';
export const LEGACY_ELECTION_ID = '00000000-0000-0000-0000-000000000000';
export const DEFAULT_CANDIDATES = Object.freeze([
    {
        id: 'CAND-A',
        name: 'Progressive India Alliance',
        party: 'Progressive India Alliance',
        platform: 'Universal Digital Infrastructure, Green Energy Expansion, Education Reform.'
    },
    {
        id: 'CAND-B',
        name: 'National Democratic Front',
        party: 'National Democratic Front',
        platform: 'Economic Deregulation, Strong Border Security, Manufacturing Hub.'
    },
    {
        id: 'CAND-C',
        name: 'Independent Voice',
        party: 'Independent Voice',
        platform: 'Local Governance, Agricultural Subsidies, Healthcare Access.'
    },
]);

// In-process mutex for concurrent request safety
let lockPromise = Promise.resolve();

function cloneCandidateSlate(candidates = DEFAULT_CANDIDATES) {
    return candidates.map((candidate) => ({ ...candidate }));
}

function normalizeCandidateSlate(candidates) {
    if (!Array.isArray(candidates)) return cloneCandidateSlate();

    const normalized = candidates
        .filter((candidate) => candidate && typeof candidate.name === 'string')
        .map((candidate, index) => {
            const fallback = DEFAULT_CANDIDATES[index] || {};
            const name = candidate.name.trim() || fallback.name || `Candidate ${index + 1}`;
            return {
                id: candidate.id || fallback.id || `CAND-${index + 1}`,
                name,
                party: candidate.party?.trim() || fallback.party || name,
                platform: candidate.platform?.trim() || fallback.platform || '',
            };
        });

    return normalized.length >= 2 ? normalized : cloneCandidateSlate();
}

function buildDefaultElection(overrides = {}) {
    return {
        title: 'Glass Ballot Box Demo',
        status: 'open',
        created_at: overrides.created_at || new Date().toISOString(),
        ballot_count: Number.isFinite(overrides.ballot_count) ? overrides.ballot_count : 0,
        chain_head: overrides.chain_head || 'GENESIS',
        snapshot_hash: overrides.snapshot_hash || null,
        closed_at: overrides.closed_at || null,
        mode: overrides.mode === 'demo' ? 'demo' : 'safe',
        candidates: normalizeCandidateSlate(overrides.candidates),
    };
}

function normalizeElectionsData(data = {}) {
    const elections = {};
    const rawElections = data && typeof data.elections === 'object' && data.elections ? data.elections : {};

    for (const [id, election] of Object.entries(rawElections)) {
        elections[id] = buildDefaultElection(election || {});
    }

    if (!Object.keys(elections).length) {
        elections[DEFAULT_ELECTION_ID] = buildDefaultElection();
    }

    const requestedActiveId = typeof data.active_election_id === 'string' ? data.active_election_id : null;
    const active_election_id = elections[requestedActiveId]
        ? requestedActiveId
        : (elections[DEFAULT_ELECTION_ID] ? DEFAULT_ELECTION_ID : Object.keys(elections)[0]);

    return { active_election_id, elections };
}

export function getElectionCandidates(election) {
    return normalizeCandidateSlate(election?.candidates);
}

export function resolveElectionContext(electionsData, requestedId) {
    if (!requestedId) return null;

    const elections = electionsData?.elections || {};
    if (elections[requestedId]) {
        return {
            key: requestedId,
            requestId: requestedId,
            aliases: [requestedId],
            election: elections[requestedId],
        };
    }

    const activeId = electionsData?.active_election_id;
    const activeElection = activeId ? elections[activeId] : null;
    const requestedIsAlias = requestedId === DEFAULT_ELECTION_ID || requestedId === LEGACY_ELECTION_ID;
    const activeIsAlias = activeId === DEFAULT_ELECTION_ID || activeId === LEGACY_ELECTION_ID;

    if (activeElection && requestedIsAlias && activeIsAlias) {
        return {
            key: activeId,
            requestId: requestedId,
            aliases: [...new Set([requestedId, activeId])],
            election: activeElection,
        };
    }

    return null;
}

/**
 * Acquire a lock for atomic operations
 * @param {Function} fn - Function to execute while lock is held
 * @returns {Promise<any>} Result of the function
 */
export async function withLock(fn) {
    const prevLock = lockPromise;
    let releaseLock;
    lockPromise = new Promise((resolve) => {
        releaseLock = resolve;
    });

    await prevLock;
    try {
        return await fn();
    } finally {
        releaseLock();
    }
}

/**
 * Ensure data directory and files exist
 */
export function initStorage() {
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }

    const electionsPath = join(DATA_DIR, 'elections.json');
    if (!existsSync(electionsPath)) {
        writeFileSync(electionsPath, JSON.stringify(normalizeElectionsData(), null, 2));
    } else {
        const normalized = normalizeElectionsData(JSON.parse(readFileSync(electionsPath, 'utf8')));
        writeFileSync(electionsPath, JSON.stringify(normalized, null, 2));
    }

    // Create empty log files if they don't exist
    const ballotsPath = join(DATA_DIR, 'ballots.log');
    if (!existsSync(ballotsPath)) {
        writeFileSync(ballotsPath, '');
    }

    const revealsPath = join(DATA_DIR, 'reveals.log');
    if (!existsSync(revealsPath)) {
        writeFileSync(revealsPath, '');
    }
}

/**
 * Read elections.json
 * @returns {Object} Elections data
 */
export function readElections() {
    const electionsPath = join(DATA_DIR, 'elections.json');
    const data = readFileSync(electionsPath, 'utf8');
    return normalizeElectionsData(JSON.parse(data));
}

/**
 * Write elections.json atomically (write temp + rename)
 * @param {Object} data - Elections data to write
 */
export function writeElections(data) {
    const electionsPath = join(DATA_DIR, 'elections.json');
    const tempPath = join(DATA_DIR, 'elections.json.tmp');
    writeFileSync(tempPath, JSON.stringify(normalizeElectionsData(data), null, 2));
    renameSync(tempPath, electionsPath);
}

/**
 * Append a ballot to ballots.log (JSONL)
 * @param {Object} ballot - Ballot data to append
 */
export function appendBallot(ballot) {
    const ballotsPath = join(DATA_DIR, 'ballots.log');
    appendFileSync(ballotsPath, JSON.stringify(ballot) + '\n');
}

/**
 * Read all ballots from ballots.log
 * @returns {Array} Array of ballot objects
 */
export function readBallots() {
    const ballotsPath = join(DATA_DIR, 'ballots.log');
    const data = readFileSync(ballotsPath, 'utf8').trim();
    if (!data) return [];
    return data.split('\n').map(line => JSON.parse(line));
}

/**
 * Append a reveal to reveals.log (JSONL, demo mode only)
 * @param {Object} reveal - Reveal data to append
 */
export function appendReveal(reveal) {
    const revealsPath = join(DATA_DIR, 'reveals.log');
    appendFileSync(revealsPath, JSON.stringify(reveal) + '\n');
}

/**
 * Read all reveals from reveals.log
 * @returns {Array} Array of reveal objects
 */
export function readReveals() {
    const revealsPath = join(DATA_DIR, 'reveals.log');
    const data = readFileSync(revealsPath, 'utf8').trim();
    if (!data) return [];
    return data.split('\n').map(line => JSON.parse(line));
}

/**
 * Write tally proof (demo mode only)
 * @param {Object} proof - Tally proof data
 */
export function writeTallyProof(proof) {
    const proofPath = join(DATA_DIR, 'tally_proof.json');
    writeFileSync(proofPath, JSON.stringify(proof, null, 2));
}

/**
 * Read tally proof
 * @returns {Object|null} Tally proof data or null if not exists
 */
export function readTallyProof() {
    const proofPath = join(DATA_DIR, 'tally_proof.json');
    if (!existsSync(proofPath)) return null;
    const data = readFileSync(proofPath, 'utf8');
    return JSON.parse(data);
}
