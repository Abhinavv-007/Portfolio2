/**
 * Glass Ballot Box - Express API Server
 * Serves static files from /public and provides election API endpoints
 */
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { sha256, computeChainHash, computeSnapshotHash, generateUUID } from './hash.js';
import {
    initStorage,
    withLock,
    readElections,
    writeElections,
    appendBallot,
    readBallots,
    appendReveal,
    readReveals,
    writeTallyProof,
    readTallyProof,
    getElectionCandidates,
    resolveElectionContext
} from './storage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

// Initialize storage on startup
initStorage();

function matchesElectionAlias(recordElectionId, aliases) {
    return aliases.includes(recordElectionId);
}

function mapChoiceToCandidateId(choice, candidates) {
    if (!choice) return null;
    if (candidates.some((candidate) => candidate.id === choice)) return choice;

    const legacyIndex = { A: 0, B: 1, C: 2 }[choice];
    return Number.isInteger(legacyIndex) ? candidates[legacyIndex]?.id || null : null;
}

/**
 * POST /api/cast
 * Cast a ballot with commit + receipt_hash
 */
app.post('/api/cast', async (req, res) => {
    try {
        const { election_id, commit, receipt_hash, mode, choice, nonce } = req.body;

        if (!election_id || !commit || !receipt_hash) {
            return res.status(400).json({ ok: false, error: 'Missing required fields' });
        }

        const result = await withLock(async () => {
            const elections = readElections();
            const electionContext = resolveElectionContext(elections, election_id);
            const election = electionContext?.election;

            if (!election) {
                return { ok: false, error: 'Election not found' };
            }

            if (election.status !== 'open') {
                return { ok: false, error: 'Election is not open' };
            }

            // Check for duplicate receipt_hash
            const existingBallots = readBallots().filter((ballot) => matchesElectionAlias(ballot.election_id, electionContext.aliases));
            if (existingBallots.some(b => b.receipt_hash === receipt_hash)) {
                return { ok: false, error: 'Duplicate receipt_hash' };
            }

            const prev_hash = election.chain_head;
            const index = election.ballot_count + 1;
            const cast_at = new Date().toISOString();
            const chain_hash = computeChainHash(prev_hash, election_id, index, commit, cast_at);
            const ballot_id = generateUUID();

            // Create ballot record
            const ballot = {
                ballot_id,
                election_id,
                index,
                cast_at,
                commit,
                receipt_hash,
                prev_hash,
                chain_hash,
                mode: mode || 'safe'
            };

            // Append to ballots.log
            appendBallot(ballot);

            // Update election metadata
            election.chain_head = chain_hash;
            election.ballot_count = index;
            election.mode = mode || election.mode;
            writeElections(elections);

            // If demo mode and reveal info provided, append to reveals.log
            if (mode === 'demo' && choice && nonce) {
                appendReveal({
                    ballot_id,
                    election_id,
                    choice,
                    nonce
                });
            }

            return {
                ok: true,
                index,
                chain_hash,
                cast_at,
                head: chain_hash
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Cast error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

/**
 * GET /api/board
 * Return all ballots + election metadata
 */
app.get('/api/board', (req, res) => {
    try {
        const { election_id } = req.query;

        if (!election_id) {
            return res.status(400).json({ ok: false, error: 'Missing election_id' });
        }

        const elections = readElections();
        const electionContext = resolveElectionContext(elections, election_id);
        const election = electionContext?.election;

        if (!election) {
            return res.status(404).json({ ok: false, error: 'Election not found' });
        }

        const allBallots = readBallots();
        const ballots = allBallots.filter((ballot) => matchesElectionAlias(ballot.election_id, electionContext.aliases));

        // Return public ballot fields only
        const publicBallots = ballots.map(b => ({
            ballot_id: b.ballot_id,
            index: b.index,
            cast_at: b.cast_at,
            commit: b.commit,
            receipt_hash: b.receipt_hash,
            prev_hash: b.prev_hash,
            chain_hash: b.chain_hash
        }));

        res.json({
            ok: true,
            ballots: publicBallots,
            candidates: getElectionCandidates(election),
            election: {
                id: electionContext.requestId,
                title: election.title,
                status: election.status,
                chain_head: election.chain_head,
                ballot_count: election.ballot_count,
                snapshot_hash: election.snapshot_hash,
                mode: election.mode
            }
        });
    } catch (error) {
        console.error('Board error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

/**
 * GET /api/receipt
 * Find ballot by receipt_hash
 */
app.get('/api/receipt', (req, res) => {
    try {
        const { election_id, receipt_hash } = req.query;

        if (!election_id || !receipt_hash) {
            return res.status(400).json({ ok: false, error: 'Missing required parameters' });
        }

        const elections = readElections();
        const electionContext = resolveElectionContext(elections, election_id);
        if (!electionContext) {
            return res.status(404).json({ ok: false, error: 'Election not found' });
        }

        const allBallots = readBallots();
        const ballot = allBallots.find(
            b => matchesElectionAlias(b.election_id, electionContext.aliases) && b.receipt_hash === receipt_hash
        );

        if (!ballot) {
            return res.json({
                ok: true,
                found: false,
                ballot: null
            });
        }

        // Return public ballot fields
        res.json({
            ok: true,
            found: true,
            ballot: {
                ballot_id: ballot.ballot_id,
                index: ballot.index,
                cast_at: ballot.cast_at,
                commit: ballot.commit,
                receipt_hash: ballot.receipt_hash,
                prev_hash: ballot.prev_hash,
                chain_hash: ballot.chain_hash
            }
        });
    } catch (error) {
        console.error('Receipt error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

/**
 * GET /api/verify
 * Return verification report for chain integrity + receipt inclusion
 */
app.get('/api/verify', (req, res) => {
    try {
        const { election_id, receipt_hash } = req.query;

        if (!election_id) {
            return res.status(400).json({ ok: false, error: 'Missing election_id' });
        }

        const elections = readElections();
        const electionContext = resolveElectionContext(elections, election_id);
        const election = electionContext?.election;

        if (!election) {
            return res.status(404).json({ ok: false, error: 'Election not found' });
        }

        const allBallots = readBallots();
        const ballots = allBallots
            .filter((ballot) => matchesElectionAlias(ballot.election_id, electionContext.aliases))
            .sort((a, b) => a.index - b.index);

        const errors = [];
        let computedHead = 'GENESIS';
        let chainValid = true;
        let receiptFound = false;
        let receiptIndex = null;

        // Replay chain
        for (let i = 0; i < ballots.length; i++) {
            const ballot = ballots[i];
            const expectedIndex = i + 1;

            // Check index continuity
            if (ballot.index !== expectedIndex) {
                errors.push(`Ballot at position ${i}: expected index ${expectedIndex}, got ${ballot.index}`);
                chainValid = false;
            }

            // Check prev_hash link
            if (ballot.prev_hash !== computedHead) {
                errors.push(`Ballot ${ballot.index}: prev_hash mismatch. Expected ${computedHead.substring(0, 8)}..., got ${ballot.prev_hash.substring(0, 8)}...`);
                chainValid = false;
            }

            // Verify chain_hash formula
            const expectedChainHash = computeChainHash(
                ballot.prev_hash,
                ballot.election_id || electionContext.requestId,
                ballot.index,
                ballot.commit,
                ballot.cast_at
            );

            if (ballot.chain_hash !== expectedChainHash) {
                errors.push(`Ballot ${ballot.index}: chain_hash mismatch. Expected ${expectedChainHash.substring(0, 8)}..., got ${ballot.chain_hash.substring(0, 8)}...`);
                chainValid = false;
            }

            // Update computed head
            computedHead = ballot.chain_hash;

            // Check if receipt matches
            if (receipt_hash && ballot.receipt_hash === receipt_hash) {
                receiptFound = true;
                receiptIndex = ballot.index;
            }
        }

        // Final head check
        const headMatches = computedHead === election.chain_head;
        if (!headMatches) {
            errors.push(`Final head mismatch. Computed: ${computedHead.substring(0, 8)}..., Server: ${election.chain_head.substring(0, 8)}...`);
            chainValid = false;
        }

        res.json({
            ok: true,
            chain_valid: chainValid,
            computed_head: computedHead,
            expected_head: election.chain_head,
            head_matches: headMatches,
            ballot_count: ballots.length,
            receipt_found: receiptFound,
            receipt_index: receiptIndex,
            errors
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

/**
 * POST /api/close
 * Close election and generate tally proof (demo mode only)
 */
app.post('/api/close', async (req, res) => {
    try {
        const { election_id } = req.body;

        if (!election_id) {
            return res.status(400).json({ ok: false, error: 'Missing election_id' });
        }

        const result = await withLock(async () => {
            const elections = readElections();
            const electionContext = resolveElectionContext(elections, election_id);
            const election = electionContext?.election;

            if (!election) {
                return { ok: false, error: 'Election not found' };
            }

            if (election.status === 'closed') {
                return { ok: false, error: 'Election already closed' };
            }

            const closed_at = new Date().toISOString();
            const snapshot_hash = computeSnapshotHash(election.chain_head, election.ballot_count, closed_at);

            election.status = 'closed';
            election.closed_at = closed_at;
            election.snapshot_hash = snapshot_hash;
            writeElections(elections);

            // Generate tally proof if demo mode
            let tallyProof = null;
            if (election.mode === 'demo') {
                const candidates = getElectionCandidates(election);
                const reveals = readReveals().filter((reveal) => matchesElectionAlias(reveal.election_id, electionContext.aliases));
                const ballots = readBallots().filter((ballot) => matchesElectionAlias(ballot.election_id, electionContext.aliases));

                // Build tally
                const tally = Object.fromEntries(candidates.map((candidate) => [candidate.id, 0]));
                const verifiedVotes = [];

                for (const reveal of reveals) {
                    const ballot = ballots.find(b => b.ballot_id === reveal.ballot_id);
                    if (ballot) {
                        // Verify the commit matches: SHA256(election_id|choice|nonce) === commit
                        const expectedCommit = sha256(`${ballot.election_id || electionContext.requestId}|${reveal.choice}|${reveal.nonce}`);
                        const verified = expectedCommit === ballot.commit;
                        const choiceId = mapChoiceToCandidateId(reveal.choice, candidates);

                        if (verified && choiceId) {
                            tally[choiceId] = (tally[choiceId] || 0) + 1;
                        }

                        verifiedVotes.push({
                            ballot_id: reveal.ballot_id,
                            index: ballot.index,
                            choice: choiceId || reveal.choice,
                            choice_raw: reveal.choice,
                            commit: ballot.commit,
                            expected_commit: expectedCommit,
                            verified
                        });
                    }
                }

                tallyProof = {
                    election_id: electionContext.requestId,
                    closed_at,
                    snapshot_hash,
                    chain_head: election.chain_head,
                    ballot_count: election.ballot_count,
                    tally,
                    candidates: candidates.map(({ id, name, party, platform }) => ({ id, name, party, platform })),
                    verified_votes: verifiedVotes,
                    total_revealed: reveals.length,
                    all_verified: verifiedVotes.every(v => v.verified)
                };

                writeTallyProof(tallyProof);
            }

            return {
                ok: true,
                closed_at,
                snapshot_hash,
                tally_proof: tallyProof
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Close error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

/**
 * GET /api/tally
 * Get tally proof (demo mode only, after close)
 */
app.get('/api/tally', (req, res) => {
    try {
        const tallyProof = readTallyProof();

        if (!tallyProof) {
            return res.json({ ok: true, found: false, tally_proof: null });
        }

        res.json({ ok: true, found: true, tally_proof: tallyProof });
    } catch (error) {
        console.error('Tally error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

/**
 * POST /api/reset
 * Reset election to open state (for demo purposes)
 */
app.post('/api/reset', async (req, res) => {
    try {
        const { election_id } = req.body;

        if (!election_id) {
            return res.status(400).json({ ok: false, error: 'Missing election_id' });
        }

        const result = await withLock(async () => {
            const elections = readElections();
            const electionContext = resolveElectionContext(elections, election_id);
            const election = electionContext?.election;

            if (!election) {
                return { ok: false, error: 'Election not found' };
            }

            // Reset election state
            election.status = 'open';
            election.chain_head = 'GENESIS';
            election.ballot_count = 0;
            election.snapshot_hash = null;
            election.closed_at = null;
            election.mode = 'safe';
            writeElections(elections);

            // Clear log files by importing fs directly here
            const { writeFileSync } = await import('fs');
            const { join, dirname } = await import('path');
            const { fileURLToPath } = await import('url');
            const __dirname = dirname(fileURLToPath(import.meta.url));
            const dataDir = join(__dirname, '..', 'data');

            writeFileSync(join(dataDir, 'ballots.log'), '');
            writeFileSync(join(dataDir, 'reveals.log'), '');

            // Remove tally proof if exists
            const tallyPath = join(dataDir, 'tally_proof.json');
            const { existsSync, unlinkSync } = await import('fs');
            if (existsSync(tallyPath)) {
                unlinkSync(tallyPath);
            }

            return { ok: true, message: 'Election reset successfully' };
        });

        res.json(result);
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🗳️  Glass Ballot Box server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from /public`);
    console.log(`📊 API endpoints: /api/cast, /api/board, /api/receipt, /api/verify, /api/close`);
});
