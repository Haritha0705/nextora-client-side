/**
 * @fileoverview Election Module Redux Slice
 * @description State management for elections, candidates, voting, and results
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as electionServices from './services';
import {
    ElectionResponse,
    CandidateResponse,
    ElectionResultResponse,
    LiveVoteCountResponse,
    ElectionStatisticsResponse,
    ElectionStatisticsSummaryResponse,
    ElectionPaginationParams,
    ElectionSearchParams,
    CreateElectionRequest,
    UpdateElectionRequest,
    CancelElectionRequest,
    NominateCandidateRequest,
    UpdateNominationRequest,
    ReviewCandidateRequest,
    CastVoteRequest,
    ElectionStatus,
} from './types';

// ============================================================================
// State Interface
// ============================================================================

export interface ElectionState {
    elections: ElectionResponse[];
    selectedElection: ElectionResponse | null;
    totalElections: number;
    candidates: CandidateResponse[];
    approvedCandidates: CandidateResponse[];
    pendingCandidates: CandidateResponse[];
    myCandidacies: CandidateResponse[];
    selectedCandidate: CandidateResponse | null;
    totalCandidates: number;
    electionResults: ElectionResultResponse | null;
    liveVoteCount: LiveVoteCountResponse | null;
    hasVoted: boolean;
    voteVerification: { verified: boolean; votedAt: string } | null;
    verificationToken: string | null;
    statistics: ElectionStatisticsResponse | null;
    statisticsSummary: ElectionStatisticsSummaryResponse | null;
    currentPage: number;
    pageSize: number;
    isLoading: boolean;
    isElectionLoading: boolean;
    isCandidateLoading: boolean;
    isVoteLoading: boolean;
    isResultsLoading: boolean;
    isStatsLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isLifecycleLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: ElectionState = {
    elections: [],
    selectedElection: null,
    totalElections: 0,
    candidates: [],
    approvedCandidates: [],
    pendingCandidates: [],
    myCandidacies: [],
    selectedCandidate: null,
    totalCandidates: 0,
    electionResults: null,
    liveVoteCount: null,
    hasVoted: false,
    voteVerification: null,
    verificationToken: null,
    statistics: null,
    statisticsSummary: null,
    currentPage: 0,
    pageSize: 10,
    isLoading: false,
    isElectionLoading: false,
    isCandidateLoading: false,
    isVoteLoading: false,
    isResultsLoading: false,
    isStatsLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isLifecycleLoading: false,
    error: null,
    successMessage: null,
};

// ============================================================================
// Helper
// ============================================================================
const getErrorMessage = (error: unknown, fallback: string): string => {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return err?.response?.data?.message || err?.message || fallback;
};

// ============================================================================
// Async Thunks - Election CRUD
// ============================================================================

export const fetchElections = createAsyncThunk(
    'election/fetchElections',
    async (params: ElectionPaginationParams & { clubId?: number; status?: ElectionStatus }, { rejectWithValue }) => {
        try {
            const { clubId, status, ...pagination } = params;
            if (status) return await electionServices.getElectionsByStatus(status, pagination);
            if (clubId) return await electionServices.getElectionsByClub(clubId, pagination);
            return await electionServices.getUpcomingElections(pagination);
        } catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch elections')); }
    }
);

export const fetchUpcomingElections = createAsyncThunk(
    'election/fetchUpcoming',
    async (params: ElectionPaginationParams, { rejectWithValue }) => {
        try { return await electionServices.getUpcomingElections(params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch upcoming elections')); }
    }
);

export const fetchVotableElections = createAsyncThunk(
    'election/fetchVotable',
    async (params: ElectionPaginationParams, { rejectWithValue }) => {
        try { return await electionServices.getVotableElections(params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch votable elections')); }
    }
);

export const searchElectionsAsync = createAsyncThunk(
    'election/search',
    async (params: ElectionSearchParams, { rejectWithValue }) => {
        try { return await electionServices.searchElections(params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to search elections')); }
    }
);

export const fetchElectionById = createAsyncThunk(
    'election/fetchById',
    async (id: number, { rejectWithValue }) => {
        try { const r = await electionServices.getElectionById(id); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch election')); }
    }
);

export const fetchElectionWithCandidates = createAsyncThunk(
    'election/fetchWithCandidates',
    async (id: number, { rejectWithValue }) => {
        try { const r = await electionServices.getElectionWithCandidates(id); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch election details')); }
    }
);

export const createElectionAsync = createAsyncThunk(
    'election/create',
    async (data: CreateElectionRequest, { rejectWithValue }) => {
        try { return await electionServices.createElection(data); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to create election')); }
    }
);

export const updateElectionAsync = createAsyncThunk(
    'election/update',
    async ({ id, data }: { id: number; data: UpdateElectionRequest }, { rejectWithValue }) => {
        try { return await electionServices.updateElection(id, data); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to update election')); }
    }
);

export const deleteElectionAsync = createAsyncThunk(
    'election/delete',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.deleteElection(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to delete election')); }
    }
);

// ============================================================================
// Async Thunks - Lifecycle
// ============================================================================

export const openNominationsAsync = createAsyncThunk(
    'election/openNominations',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.openNominations(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to open nominations')); }
    }
);

export const closeNominationsAsync = createAsyncThunk(
    'election/closeNominations',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.closeNominations(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to close nominations')); }
    }
);

export const openVotingAsync = createAsyncThunk(
    'election/openVoting',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.openVoting(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to open voting')); }
    }
);

export const closeVotingAsync = createAsyncThunk(
    'election/closeVoting',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.closeVoting(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to close voting')); }
    }
);

export const publishResultsAsync = createAsyncThunk(
    'election/publishResults',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.publishResults(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to publish results')); }
    }
);

export const cancelElectionAsync = createAsyncThunk(
    'election/cancel',
    async ({ id, data }: { id: number; data: CancelElectionRequest }, { rejectWithValue }) => {
        try { await electionServices.cancelElection(id, data); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to cancel election')); }
    }
);

// ============================================================================
// Async Thunks - Candidates
// ============================================================================

export const fetchCandidates = createAsyncThunk(
    'election/fetchCandidates',
    async ({ electionId, params }: { electionId: number; params?: ElectionPaginationParams }, { rejectWithValue }) => {
        try { return await electionServices.getAllCandidates(electionId, params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch candidates')); }
    }
);

export const fetchApprovedCandidates = createAsyncThunk(
    'election/fetchApproved',
    async ({ electionId, params }: { electionId: number; params?: ElectionPaginationParams }, { rejectWithValue }) => {
        try { return await electionServices.getApprovedCandidates(electionId, params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch approved candidates')); }
    }
);

export const fetchPendingCandidates = createAsyncThunk(
    'election/fetchPending',
    async ({ electionId, params }: { electionId: number; params?: ElectionPaginationParams }, { rejectWithValue }) => {
        try { return await electionServices.getPendingCandidates(electionId, params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch pending candidates')); }
    }
);

export const fetchCandidateById = createAsyncThunk(
    'election/fetchCandidateById',
    async (id: number, { rejectWithValue }) => {
        try { const r = await electionServices.getCandidateById(id); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch candidate')); }
    }
);

export const fetchMyCandidacies = createAsyncThunk(
    'election/fetchMyCandidacies',
    async (params: ElectionPaginationParams, { rejectWithValue }) => {
        try { return await electionServices.getMyCandidacies(params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch candidacies')); }
    }
);

export const nominateSelfAsync = createAsyncThunk(
    'election/nominate',
    async (data: NominateCandidateRequest, { rejectWithValue }) => {
        try { return await electionServices.nominateSelf(data); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to submit nomination')); }
    }
);

export const updateNominationAsync = createAsyncThunk(
    'election/updateNomination',
    async ({ id, data }: { id: number; data: UpdateNominationRequest }, { rejectWithValue }) => {
        try { return await electionServices.updateNomination(id, data); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to update nomination')); }
    }
);

export const deleteNominationAsync = createAsyncThunk(
    'election/deleteNomination',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.deleteNomination(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to delete nomination')); }
    }
);

export const reviewCandidateAsync = createAsyncThunk(
    'election/reviewCandidate',
    async (data: ReviewCandidateRequest, { rejectWithValue }) => {
        try { return await electionServices.reviewCandidate(data); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to review candidate')); }
    }
);

export const withdrawCandidacyAsync = createAsyncThunk(
    'election/withdraw',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.withdrawCandidacy(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to withdraw candidacy')); }
    }
);

// ============================================================================
// Async Thunks - Voting
// ============================================================================

export const castVoteAsync = createAsyncThunk(
    'election/castVote',
    async (data: CastVoteRequest, { rejectWithValue }) => {
        try { return await electionServices.castVote(data); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to cast vote')); }
    }
);

export const checkHasVotedAsync = createAsyncThunk(
    'election/hasVoted',
    async (electionId: number, { rejectWithValue }) => {
        try { const r = await electionServices.checkHasVoted(electionId); return r.data.hasVoted; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to check vote status')); }
    }
);

export const verifyVoteAsync = createAsyncThunk(
    'election/verifyVote',
    async ({ electionId, token }: { electionId: number; token: string }, { rejectWithValue }) => {
        try { const r = await electionServices.verifyVote(electionId, token); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to verify vote')); }
    }
);

// ============================================================================
// Async Thunks - Results
// ============================================================================

export const fetchElectionResults = createAsyncThunk(
    'election/fetchResults',
    async (electionId: number, { rejectWithValue }) => {
        try { const r = await electionServices.getElectionResults(electionId); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch results')); }
    }
);

export const fetchLiveVoteCount = createAsyncThunk(
    'election/fetchLiveCount',
    async (electionId: number, { rejectWithValue }) => {
        try { const r = await electionServices.getLiveVoteCount(electionId); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch live count')); }
    }
);

// ============================================================================
// Async Thunks - Admin
// ============================================================================

export const adminFetchAllElections = createAsyncThunk(
    'election/adminFetchAll',
    async (params: ElectionPaginationParams, { rejectWithValue }) => {
        try { return await electionServices.adminGetAllElections(params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed to fetch elections')); }
    }
);

export const adminForceOpenNominationsAsync = createAsyncThunk(
    'election/adminForceOpenNom',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.adminForceOpenNominations(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminForceCloseNominationsAsync = createAsyncThunk(
    'election/adminForceCloseNom',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.adminForceCloseNominations(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminForceOpenVotingAsync = createAsyncThunk(
    'election/adminForceOpenVoting',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.adminForceOpenVoting(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminForceCloseVotingAsync = createAsyncThunk(
    'election/adminForceCloseVoting',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.adminForceCloseVoting(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminForcePublishResultsAsync = createAsyncThunk(
    'election/adminForcePublish',
    async (id: number, { rejectWithValue }) => {
        try { await electionServices.adminForcePublishResults(id); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminForceCancelAsync = createAsyncThunk(
    'election/adminForceCancel',
    async ({ id, reason }: { id: number; reason: string }, { rejectWithValue }) => {
        try { await electionServices.adminForceCancelElection(id, reason); return id; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminGetCandidatesAsync = createAsyncThunk(
    'election/adminGetCandidates',
    async ({ electionId, params }: { electionId: number; params?: ElectionPaginationParams }, { rejectWithValue }) => {
        try { return await electionServices.adminGetCandidates(electionId, params); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminForceApproveCandidateAsync = createAsyncThunk(
    'election/adminForceApprove',
    async ({ electionId, candidateId }: { electionId: number; candidateId: number }, { rejectWithValue }) => {
        try { await electionServices.adminForceApproveCandidate(electionId, candidateId); return candidateId; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminForceRejectCandidateAsync = createAsyncThunk(
    'election/adminForceReject',
    async ({ electionId, candidateId, reason }: { electionId: number; candidateId: number; reason?: string }, { rejectWithValue }) => {
        try { await electionServices.adminForceRejectCandidate(electionId, candidateId, reason); return candidateId; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminDisqualifyCandidateAsync = createAsyncThunk(
    'election/adminDisqualify',
    async ({ electionId, candidateId, reason }: { electionId: number; candidateId: number; reason?: string }, { rejectWithValue }) => {
        try { await electionServices.adminDisqualifyCandidate(electionId, candidateId, reason); return candidateId; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminGetLiveVotesAsync = createAsyncThunk(
    'election/adminLiveVotes',
    async (electionId: number, { rejectWithValue }) => {
        try { const r = await electionServices.adminGetLiveVotes(electionId); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminPermanentDeleteAsync = createAsyncThunk(
    'election/adminPermanentDelete',
    async (electionId: number, { rejectWithValue }) => {
        try { await electionServices.adminPermanentDeleteElection(electionId); return electionId; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminFetchStatistics = createAsyncThunk(
    'election/adminStats',
    async (_, { rejectWithValue }) => {
        try { const r = await electionServices.adminGetStatistics(); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminFetchStatisticsSummary = createAsyncThunk(
    'election/adminStatsSummary',
    async (_, { rejectWithValue }) => {
        try { const r = await electionServices.adminGetStatisticsSummary(); return r.data; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminResetVotesAsync = createAsyncThunk(
    'election/adminResetVotes',
    async (electionId: number, { rejectWithValue }) => {
        try { await electionServices.adminResetVotes(electionId); return electionId; }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);
export const adminProcessStatusUpdatesAsync = createAsyncThunk(
    'election/adminProcessStatus',
    async (_, { rejectWithValue }) => {
        try { await electionServices.adminProcessStatusUpdates(); }
        catch (error) { return rejectWithValue(getErrorMessage(error, 'Failed')); }
    }
);

// ============================================================================
// Slice
// ============================================================================

const electionSlice = createSlice({
    name: 'election',
    initialState,
    reducers: {
        clearElectionError: (state) => { state.error = null; },
        clearElectionSuccess: (state) => { state.successMessage = null; },
        clearSelectedElection: (state) => { state.selectedElection = null; },
        clearCandidates: (state) => { state.candidates = []; state.approvedCandidates = []; state.pendingCandidates = []; },
        clearResults: (state) => { state.electionResults = null; state.liveVoteCount = null; },
        clearVoteState: (state) => { state.hasVoted = false; state.voteVerification = null; state.verificationToken = null; },
        setElectionPage: (state, action: PayloadAction<number>) => { state.currentPage = action.payload; },
    },
    extraReducers: (builder) => {
        // === Elections List ===
        builder
            .addCase(fetchElections.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchElections.fulfilled, (s, a) => { s.isLoading = false; s.elections = a.payload.data.content; s.totalElections = a.payload.data.totalElements; })
            .addCase(fetchElections.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
            .addCase(fetchUpcomingElections.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchUpcomingElections.fulfilled, (s, a) => { s.isLoading = false; s.elections = a.payload.data.content; s.totalElections = a.payload.data.totalElements; })
            .addCase(fetchUpcomingElections.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
            .addCase(fetchVotableElections.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchVotableElections.fulfilled, (s, a) => { s.isLoading = false; s.elections = a.payload.data.content; s.totalElections = a.payload.data.totalElements; })
            .addCase(fetchVotableElections.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
            .addCase(searchElectionsAsync.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(searchElectionsAsync.fulfilled, (s, a) => { s.isLoading = false; s.elections = a.payload.data.content; s.totalElections = a.payload.data.totalElements; })
            .addCase(searchElectionsAsync.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
            .addCase(adminFetchAllElections.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(adminFetchAllElections.fulfilled, (s, a) => { s.isLoading = false; s.elections = a.payload.data.content; s.totalElections = a.payload.data.totalElements; })
            .addCase(adminFetchAllElections.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; });

        // === Single Election ===
        builder
            .addCase(fetchElectionById.pending, (s) => { s.isElectionLoading = true; s.error = null; })
            .addCase(fetchElectionById.fulfilled, (s, a) => { s.isElectionLoading = false; s.selectedElection = a.payload; })
            .addCase(fetchElectionById.rejected, (s, a) => { s.isElectionLoading = false; s.error = a.payload as string; })
            .addCase(fetchElectionWithCandidates.pending, (s) => { s.isElectionLoading = true; s.error = null; })
            .addCase(fetchElectionWithCandidates.fulfilled, (s, a) => { s.isElectionLoading = false; s.selectedElection = a.payload; s.approvedCandidates = a.payload.candidates || []; })
            .addCase(fetchElectionWithCandidates.rejected, (s, a) => { s.isElectionLoading = false; s.error = a.payload as string; });

        // === CRUD ===
        builder
            .addCase(createElectionAsync.pending, (s) => { s.isCreating = true; s.error = null; })
            .addCase(createElectionAsync.fulfilled, (s, a) => { s.isCreating = false; s.elections = [a.payload.data, ...s.elections]; s.successMessage = 'Election created successfully'; })
            .addCase(createElectionAsync.rejected, (s, a) => { s.isCreating = false; s.error = a.payload as string; })
            .addCase(updateElectionAsync.pending, (s) => { s.isUpdating = true; s.error = null; })
            .addCase(updateElectionAsync.fulfilled, (s, a) => { s.isUpdating = false; s.selectedElection = a.payload.data; s.elections = s.elections.map(e => e.id === a.payload.data.id ? a.payload.data : e); s.successMessage = 'Election updated successfully'; })
            .addCase(updateElectionAsync.rejected, (s, a) => { s.isUpdating = false; s.error = a.payload as string; })
            .addCase(deleteElectionAsync.pending, (s) => { s.isDeleting = true; s.error = null; })
            .addCase(deleteElectionAsync.fulfilled, (s, a) => { s.isDeleting = false; s.elections = s.elections.filter(e => e.id !== a.payload); s.successMessage = 'Election deleted successfully'; })
            .addCase(deleteElectionAsync.rejected, (s, a) => { s.isDeleting = false; s.error = a.payload as string; });

        // === Lifecycle ===
        const lifecyclePending = (s: ElectionState) => { s.isLifecycleLoading = true; s.error = null; };
        const lifecycleRejected = (s: ElectionState, a: { payload: unknown }) => { s.isLifecycleLoading = false; s.error = a.payload as string; };
        const lifecycleFulfilled = (s: ElectionState, msg: string) => { s.isLifecycleLoading = false; s.successMessage = msg; };

        builder
            .addCase(openNominationsAsync.pending, lifecyclePending)
            .addCase(openNominationsAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Nominations opened'))
            .addCase(openNominationsAsync.rejected, lifecycleRejected)
            .addCase(closeNominationsAsync.pending, lifecyclePending)
            .addCase(closeNominationsAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Nominations closed'))
            .addCase(closeNominationsAsync.rejected, lifecycleRejected)
            .addCase(openVotingAsync.pending, lifecyclePending)
            .addCase(openVotingAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Voting opened'))
            .addCase(openVotingAsync.rejected, lifecycleRejected)
            .addCase(closeVotingAsync.pending, lifecyclePending)
            .addCase(closeVotingAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Voting closed'))
            .addCase(closeVotingAsync.rejected, lifecycleRejected)
            .addCase(publishResultsAsync.pending, lifecyclePending)
            .addCase(publishResultsAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Results published'))
            .addCase(publishResultsAsync.rejected, lifecycleRejected)
            .addCase(cancelElectionAsync.pending, lifecyclePending)
            .addCase(cancelElectionAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Election cancelled'))
            .addCase(cancelElectionAsync.rejected, lifecycleRejected);

        // === Admin Lifecycle ===
        builder
            .addCase(adminForceOpenNominationsAsync.pending, lifecyclePending).addCase(adminForceOpenNominationsAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Nominations forced open')).addCase(adminForceOpenNominationsAsync.rejected, lifecycleRejected)
            .addCase(adminForceCloseNominationsAsync.pending, lifecyclePending).addCase(adminForceCloseNominationsAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Nominations forced closed')).addCase(adminForceCloseNominationsAsync.rejected, lifecycleRejected)
            .addCase(adminForceOpenVotingAsync.pending, lifecyclePending).addCase(adminForceOpenVotingAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Voting forced open')).addCase(adminForceOpenVotingAsync.rejected, lifecycleRejected)
            .addCase(adminForceCloseVotingAsync.pending, lifecyclePending).addCase(adminForceCloseVotingAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Voting forced closed')).addCase(adminForceCloseVotingAsync.rejected, lifecycleRejected)
            .addCase(adminForcePublishResultsAsync.pending, lifecyclePending).addCase(adminForcePublishResultsAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Results forced published')).addCase(adminForcePublishResultsAsync.rejected, lifecycleRejected)
            .addCase(adminForceCancelAsync.pending, lifecyclePending).addCase(adminForceCancelAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Election force cancelled')).addCase(adminForceCancelAsync.rejected, lifecycleRejected)
            .addCase(adminPermanentDeleteAsync.pending, (s) => { s.isDeleting = true; s.error = null; })
            .addCase(adminPermanentDeleteAsync.fulfilled, (s, a) => { s.isDeleting = false; s.elections = s.elections.filter(e => e.id !== a.payload); s.successMessage = 'Election permanently deleted'; })
            .addCase(adminPermanentDeleteAsync.rejected, (s, a) => { s.isDeleting = false; s.error = a.payload as string; })
            .addCase(adminResetVotesAsync.pending, lifecyclePending).addCase(adminResetVotesAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Votes reset')).addCase(adminResetVotesAsync.rejected, lifecycleRejected)
            .addCase(adminProcessStatusUpdatesAsync.pending, lifecyclePending).addCase(adminProcessStatusUpdatesAsync.fulfilled, (s) => lifecycleFulfilled(s, 'Status updates processed')).addCase(adminProcessStatusUpdatesAsync.rejected, lifecycleRejected);

        // === Candidates ===
        builder
            .addCase(fetchCandidates.pending, (s) => { s.isCandidateLoading = true; s.error = null; })
            .addCase(fetchCandidates.fulfilled, (s, a) => { s.isCandidateLoading = false; s.candidates = a.payload.data.content; s.totalCandidates = a.payload.data.totalElements; })
            .addCase(fetchCandidates.rejected, (s, a) => { s.isCandidateLoading = false; s.error = a.payload as string; })
            .addCase(fetchApprovedCandidates.pending, (s) => { s.isCandidateLoading = true; })
            .addCase(fetchApprovedCandidates.fulfilled, (s, a) => { s.isCandidateLoading = false; s.approvedCandidates = a.payload.data.content; })
            .addCase(fetchApprovedCandidates.rejected, (s, a) => { s.isCandidateLoading = false; s.error = a.payload as string; })
            .addCase(fetchPendingCandidates.pending, (s) => { s.isCandidateLoading = true; })
            .addCase(fetchPendingCandidates.fulfilled, (s, a) => { s.isCandidateLoading = false; s.pendingCandidates = a.payload.data.content; })
            .addCase(fetchPendingCandidates.rejected, (s, a) => { s.isCandidateLoading = false; s.error = a.payload as string; })
            .addCase(fetchCandidateById.pending, (s) => { s.isCandidateLoading = true; })
            .addCase(fetchCandidateById.fulfilled, (s, a) => { s.isCandidateLoading = false; s.selectedCandidate = a.payload; })
            .addCase(fetchCandidateById.rejected, (s, a) => { s.isCandidateLoading = false; s.error = a.payload as string; })
            .addCase(fetchMyCandidacies.pending, (s) => { s.isCandidateLoading = true; })
            .addCase(fetchMyCandidacies.fulfilled, (s, a) => { s.isCandidateLoading = false; s.myCandidacies = a.payload.data.content; })
            .addCase(fetchMyCandidacies.rejected, (s, a) => { s.isCandidateLoading = false; s.error = a.payload as string; })
            .addCase(nominateSelfAsync.pending, (s) => { s.isCreating = true; s.error = null; })
            .addCase(nominateSelfAsync.fulfilled, (s, a) => { s.isCreating = false; s.candidates = [...s.candidates, a.payload.data]; s.successMessage = 'Nomination submitted'; })
            .addCase(nominateSelfAsync.rejected, (s, a) => { s.isCreating = false; s.error = a.payload as string; })
            .addCase(updateNominationAsync.pending, (s) => { s.isUpdating = true; s.error = null; })
            .addCase(updateNominationAsync.fulfilled, (s, a) => { s.isUpdating = false; s.candidates = s.candidates.map(c => c.id === a.payload.data.id ? a.payload.data : c); s.successMessage = 'Nomination updated'; })
            .addCase(updateNominationAsync.rejected, (s, a) => { s.isUpdating = false; s.error = a.payload as string; })
            .addCase(deleteNominationAsync.pending, (s) => { s.isDeleting = true; })
            .addCase(deleteNominationAsync.fulfilled, (s, a) => { s.isDeleting = false; s.candidates = s.candidates.filter(c => c.id !== a.payload); s.successMessage = 'Nomination deleted'; })
            .addCase(deleteNominationAsync.rejected, (s, a) => { s.isDeleting = false; s.error = a.payload as string; })
            .addCase(reviewCandidateAsync.pending, (s) => { s.isUpdating = true; })
            .addCase(reviewCandidateAsync.fulfilled, (s, a) => { s.isUpdating = false; s.candidates = s.candidates.map(c => c.id === a.payload.data.id ? a.payload.data : c); s.pendingCandidates = s.pendingCandidates.filter(c => c.id !== a.payload.data.id); s.successMessage = 'Candidate reviewed'; })
            .addCase(reviewCandidateAsync.rejected, (s, a) => { s.isUpdating = false; s.error = a.payload as string; })
            .addCase(withdrawCandidacyAsync.pending, (s) => { s.isUpdating = true; })
            .addCase(withdrawCandidacyAsync.fulfilled, (s, a) => { s.isUpdating = false; s.candidates = s.candidates.filter(c => c.id !== a.payload); s.successMessage = 'Candidacy withdrawn'; })
            .addCase(withdrawCandidacyAsync.rejected, (s, a) => { s.isUpdating = false; s.error = a.payload as string; })
            .addCase(adminGetCandidatesAsync.pending, (s) => { s.isCandidateLoading = true; })
            .addCase(adminGetCandidatesAsync.fulfilled, (s, a) => { s.isCandidateLoading = false; s.candidates = a.payload.data.content; s.totalCandidates = a.payload.data.totalElements; })
            .addCase(adminGetCandidatesAsync.rejected, (s, a) => { s.isCandidateLoading = false; s.error = a.payload as string; })
            .addCase(adminForceApproveCandidateAsync.pending, (s) => { s.isUpdating = true; })
            .addCase(adminForceApproveCandidateAsync.fulfilled, (s) => { s.isUpdating = false; s.successMessage = 'Candidate approved'; })
            .addCase(adminForceApproveCandidateAsync.rejected, (s, a) => { s.isUpdating = false; s.error = a.payload as string; })
            .addCase(adminForceRejectCandidateAsync.pending, (s) => { s.isUpdating = true; })
            .addCase(adminForceRejectCandidateAsync.fulfilled, (s) => { s.isUpdating = false; s.successMessage = 'Candidate rejected'; })
            .addCase(adminForceRejectCandidateAsync.rejected, (s, a) => { s.isUpdating = false; s.error = a.payload as string; })
            .addCase(adminDisqualifyCandidateAsync.pending, (s) => { s.isUpdating = true; })
            .addCase(adminDisqualifyCandidateAsync.fulfilled, (s) => { s.isUpdating = false; s.successMessage = 'Candidate disqualified'; })
            .addCase(adminDisqualifyCandidateAsync.rejected, (s, a) => { s.isUpdating = false; s.error = a.payload as string; });

        // === Voting ===
        builder
            .addCase(castVoteAsync.pending, (s) => { s.isVoteLoading = true; s.error = null; })
            .addCase(castVoteAsync.fulfilled, (s, a) => { s.isVoteLoading = false; s.hasVoted = true; s.verificationToken = a.payload.data.verificationToken; s.successMessage = 'Vote cast successfully'; })
            .addCase(castVoteAsync.rejected, (s, a) => { s.isVoteLoading = false; s.error = a.payload as string; })
            .addCase(checkHasVotedAsync.pending, (s) => { s.isVoteLoading = true; })
            .addCase(checkHasVotedAsync.fulfilled, (s, a) => { s.isVoteLoading = false; s.hasVoted = a.payload; })
            .addCase(checkHasVotedAsync.rejected, (s, a) => { s.isVoteLoading = false; s.error = a.payload as string; })
            .addCase(verifyVoteAsync.pending, (s) => { s.isVoteLoading = true; })
            .addCase(verifyVoteAsync.fulfilled, (s, a) => { s.isVoteLoading = false; s.voteVerification = a.payload; s.successMessage = 'Vote verified'; })
            .addCase(verifyVoteAsync.rejected, (s, a) => { s.isVoteLoading = false; s.error = a.payload as string; });

        // === Results ===
        builder
            .addCase(fetchElectionResults.pending, (s) => { s.isResultsLoading = true; s.error = null; })
            .addCase(fetchElectionResults.fulfilled, (s, a) => { s.isResultsLoading = false; s.electionResults = a.payload; })
            .addCase(fetchElectionResults.rejected, (s, a) => { s.isResultsLoading = false; s.error = a.payload as string; })
            .addCase(fetchLiveVoteCount.pending, (s) => { s.isResultsLoading = true; })
            .addCase(fetchLiveVoteCount.fulfilled, (s, a) => { s.isResultsLoading = false; s.liveVoteCount = a.payload; })
            .addCase(fetchLiveVoteCount.rejected, (s, a) => { s.isResultsLoading = false; s.error = a.payload as string; })
            .addCase(adminGetLiveVotesAsync.pending, (s) => { s.isResultsLoading = true; })
            .addCase(adminGetLiveVotesAsync.fulfilled, (s, a) => { s.isResultsLoading = false; s.liveVoteCount = a.payload; })
            .addCase(adminGetLiveVotesAsync.rejected, (s, a) => { s.isResultsLoading = false; s.error = a.payload as string; });

        // === Statistics ===
        builder
            .addCase(adminFetchStatistics.pending, (s) => { s.isStatsLoading = true; })
            .addCase(adminFetchStatistics.fulfilled, (s, a) => { s.isStatsLoading = false; s.statistics = a.payload; })
            .addCase(adminFetchStatistics.rejected, (s, a) => { s.isStatsLoading = false; s.error = a.payload as string; })
            .addCase(adminFetchStatisticsSummary.pending, (s) => { s.isStatsLoading = true; })
            .addCase(adminFetchStatisticsSummary.fulfilled, (s, a) => { s.isStatsLoading = false; s.statisticsSummary = a.payload; })
            .addCase(adminFetchStatisticsSummary.rejected, (s, a) => { s.isStatsLoading = false; s.error = a.payload as string; });
    },
});

// ============================================================================
// Exports
// ============================================================================

export const {
    clearElectionError,
    clearElectionSuccess,
    clearSelectedElection,
    clearCandidates,
    clearResults,
    clearVoteState,
    setElectionPage,
} = electionSlice.actions;

// Selectors
export const selectElections = (state: { election: ElectionState }) => state.election.elections;
export const selectSelectedElection = (state: { election: ElectionState }) => state.election.selectedElection;
export const selectTotalElections = (state: { election: ElectionState }) => state.election.totalElections;
export const selectCandidates = (state: { election: ElectionState }) => state.election.candidates;
export const selectApprovedCandidates = (state: { election: ElectionState }) => state.election.approvedCandidates;
export const selectPendingCandidates = (state: { election: ElectionState }) => state.election.pendingCandidates;
export const selectMyCandidacies = (state: { election: ElectionState }) => state.election.myCandidacies;
export const selectSelectedCandidate = (state: { election: ElectionState }) => state.election.selectedCandidate;
export const selectElectionResults = (state: { election: ElectionState }) => state.election.electionResults;
export const selectLiveVoteCount = (state: { election: ElectionState }) => state.election.liveVoteCount;
export const selectHasVoted = (state: { election: ElectionState }) => state.election.hasVoted;
export const selectVoteVerification = (state: { election: ElectionState }) => state.election.voteVerification;
export const selectVerificationToken = (state: { election: ElectionState }) => state.election.verificationToken;
export const selectElectionStatistics = (state: { election: ElectionState }) => state.election.statistics;
export const selectElectionStatisticsSummary = (state: { election: ElectionState }) => state.election.statisticsSummary;
export const selectElectionIsLoading = (state: { election: ElectionState }) => state.election.isLoading;
export const selectElectionIsDetailLoading = (state: { election: ElectionState }) => state.election.isElectionLoading;
export const selectElectionIsCandidateLoading = (state: { election: ElectionState }) => state.election.isCandidateLoading;
export const selectElectionIsVoteLoading = (state: { election: ElectionState }) => state.election.isVoteLoading;
export const selectElectionIsResultsLoading = (state: { election: ElectionState }) => state.election.isResultsLoading;
export const selectElectionIsStatsLoading = (state: { election: ElectionState }) => state.election.isStatsLoading;
export const selectElectionIsCreating = (state: { election: ElectionState }) => state.election.isCreating;
export const selectElectionIsUpdating = (state: { election: ElectionState }) => state.election.isUpdating;
export const selectElectionIsDeleting = (state: { election: ElectionState }) => state.election.isDeleting;
export const selectElectionIsLifecycleLoading = (state: { election: ElectionState }) => state.election.isLifecycleLoading;
export const selectElectionError = (state: { election: ElectionState }) => state.election.error;
export const selectElectionSuccess = (state: { election: ElectionState }) => state.election.successMessage;

export default electionSlice.reducer;
