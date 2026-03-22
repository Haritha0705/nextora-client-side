/**
 * @fileoverview Election Custom Hook
 * @description Reusable hook for election module state and actions
 */
'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    // Selectors
    selectElections,
    selectSelectedElection,
    selectTotalElections,
    selectCandidates,
    selectApprovedCandidates,
    selectPendingCandidates,
    selectMyCandidacies,
    selectSelectedCandidate,
    selectElectionResults,
    selectLiveVoteCount,
    selectHasVoted,
    selectVoteVerification,
    selectVerificationToken,
    selectElectionStatistics,
    selectElectionStatisticsSummary,
    selectElectionIsLoading,
    selectElectionIsDetailLoading,
    selectElectionIsCandidateLoading,
    selectElectionIsVoteLoading,
    selectElectionIsResultsLoading,
    selectElectionIsStatsLoading,
    selectElectionIsCreating,
    selectElectionIsUpdating,
    selectElectionIsDeleting,
    selectElectionIsLifecycleLoading,
    selectElectionError,
    selectElectionSuccess,
    // Thunks
    fetchElections,
    fetchUpcomingElections,
    fetchVotableElections,
    searchElectionsAsync,
    fetchElectionById,
    fetchElectionWithCandidates,
    createElectionAsync,
    updateElectionAsync,
    deleteElectionAsync,
    openNominationsAsync,
    closeNominationsAsync,
    openVotingAsync,
    closeVotingAsync,
    publishResultsAsync,
    cancelElectionAsync,
    fetchCandidates,
    fetchApprovedCandidates,
    fetchPendingCandidates,
    fetchCandidateById,
    fetchMyCandidacies,
    nominateSelfAsync,
    updateNominationAsync,
    deleteNominationAsync,
    reviewCandidateAsync,
    withdrawCandidacyAsync,
    castVoteAsync,
    checkHasVotedAsync,
    verifyVoteAsync,
    fetchElectionResults,
    fetchLiveVoteCount,
    // Admin
    adminFetchAllElections,
    adminForceOpenNominationsAsync,
    adminForceCloseNominationsAsync,
    adminForceOpenVotingAsync,
    adminForceCloseVotingAsync,
    adminForcePublishResultsAsync,
    adminForceCancelAsync,
    adminGetCandidatesAsync,
    adminForceApproveCandidateAsync,
    adminForceRejectCandidateAsync,
    adminDisqualifyCandidateAsync,
    adminGetLiveVotesAsync,
    adminPermanentDeleteAsync,
    adminFetchStatistics,
    adminFetchStatisticsSummary,
    adminResetVotesAsync,
    adminProcessStatusUpdatesAsync,
    // Actions
    clearElectionError,
    clearElectionSuccess,
    clearSelectedElection,
    clearCandidates,
    clearResults,
    clearVoteState,
} from '@/features/election/electionSlice';
import type {
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
} from '@/features/election/types';

export function useElection() {
    const dispatch = useAppDispatch();

    // ── Selectors ──
    const elections = useAppSelector(selectElections);
    const selectedElection = useAppSelector(selectSelectedElection);
    const totalElections = useAppSelector(selectTotalElections);
    const candidates = useAppSelector(selectCandidates);
    const approvedCandidates = useAppSelector(selectApprovedCandidates);
    const pendingCandidatesState = useAppSelector(selectPendingCandidates);
    const myCandidacies = useAppSelector(selectMyCandidacies);
    const selectedCandidate = useAppSelector(selectSelectedCandidate);
    const electionResults = useAppSelector(selectElectionResults);
    const liveVoteCount = useAppSelector(selectLiveVoteCount);
    const hasVoted = useAppSelector(selectHasVoted);
    const voteVerification = useAppSelector(selectVoteVerification);
    const verificationToken = useAppSelector(selectVerificationToken);
    const statistics = useAppSelector(selectElectionStatistics);
    const statisticsSummary = useAppSelector(selectElectionStatisticsSummary);

    // Loading
    const isLoading = useAppSelector(selectElectionIsLoading);
    const isDetailLoading = useAppSelector(selectElectionIsDetailLoading);
    const isCandidateLoading = useAppSelector(selectElectionIsCandidateLoading);
    const isVoteLoading = useAppSelector(selectElectionIsVoteLoading);
    const isResultsLoading = useAppSelector(selectElectionIsResultsLoading);
    const isStatsLoading = useAppSelector(selectElectionIsStatsLoading);
    const isCreating = useAppSelector(selectElectionIsCreating);
    const isUpdating = useAppSelector(selectElectionIsUpdating);
    const isDeleting = useAppSelector(selectElectionIsDeleting);
    const isLifecycleLoading = useAppSelector(selectElectionIsLifecycleLoading);
    const error = useAppSelector(selectElectionError);
    const successMessage = useAppSelector(selectElectionSuccess);

    // ── Election CRUD ──
    const loadElections = useCallback((params: ElectionPaginationParams & { clubId?: number; status?: ElectionStatus } = {}) => dispatch(fetchElections(params)), [dispatch]);
    const loadUpcomingElections = useCallback((params: ElectionPaginationParams = {}) => dispatch(fetchUpcomingElections(params)), [dispatch]);
    const loadVotableElections = useCallback((params: ElectionPaginationParams = {}) => dispatch(fetchVotableElections(params)), [dispatch]);
    const searchElections = useCallback((params: ElectionSearchParams) => dispatch(searchElectionsAsync(params)), [dispatch]);
    const loadElectionById = useCallback((id: number) => dispatch(fetchElectionById(id)), [dispatch]);
    const loadElectionWithCandidates = useCallback((id: number) => dispatch(fetchElectionWithCandidates(id)), [dispatch]);
    const createElection = useCallback((data: CreateElectionRequest) => dispatch(createElectionAsync(data)), [dispatch]);
    const updateElection = useCallback((id: number, data: UpdateElectionRequest) => dispatch(updateElectionAsync({ id, data })), [dispatch]);
    const deleteElection = useCallback((id: number) => dispatch(deleteElectionAsync(id)), [dispatch]);

    // ── Lifecycle ──
    const openNominations = useCallback((id: number) => dispatch(openNominationsAsync(id)), [dispatch]);
    const closeNominations = useCallback((id: number) => dispatch(closeNominationsAsync(id)), [dispatch]);
    const openVoting = useCallback((id: number) => dispatch(openVotingAsync(id)), [dispatch]);
    const closeVoting = useCallback((id: number) => dispatch(closeVotingAsync(id)), [dispatch]);
    const publishResults = useCallback((id: number) => dispatch(publishResultsAsync(id)), [dispatch]);
    const cancelElection = useCallback((id: number, data: CancelElectionRequest) => dispatch(cancelElectionAsync({ id, data })), [dispatch]);

    // ── Candidates ──
    const loadCandidates = useCallback((electionId: number, params?: ElectionPaginationParams) => dispatch(fetchCandidates({ electionId, params })), [dispatch]);
    const loadApprovedCandidates = useCallback((electionId: number, params?: ElectionPaginationParams) => dispatch(fetchApprovedCandidates({ electionId, params })), [dispatch]);
    const loadPendingCandidates = useCallback((electionId: number, params?: ElectionPaginationParams) => dispatch(fetchPendingCandidates({ electionId, params })), [dispatch]);
    const loadCandidateById = useCallback((id: number) => dispatch(fetchCandidateById(id)), [dispatch]);
    const loadMyCandidacies = useCallback((params: ElectionPaginationParams = {}) => dispatch(fetchMyCandidacies(params)), [dispatch]);
    const nominateSelf = useCallback((data: NominateCandidateRequest) => dispatch(nominateSelfAsync(data)), [dispatch]);
    const updateNomination = useCallback((id: number, data: UpdateNominationRequest) => dispatch(updateNominationAsync({ id, data })), [dispatch]);
    const deleteNomination = useCallback((id: number) => dispatch(deleteNominationAsync(id)), [dispatch]);
    const reviewCandidate = useCallback((data: ReviewCandidateRequest) => dispatch(reviewCandidateAsync(data)), [dispatch]);
    const withdrawCandidacy = useCallback((id: number) => dispatch(withdrawCandidacyAsync(id)), [dispatch]);

    // ── Voting ──
    const castVote = useCallback((data: CastVoteRequest) => dispatch(castVoteAsync(data)), [dispatch]);
    const checkHasVoted = useCallback((electionId: number) => dispatch(checkHasVotedAsync(electionId)), [dispatch]);
    const verifyVote = useCallback((electionId: number, token: string) => dispatch(verifyVoteAsync({ electionId, token })), [dispatch]);

    // ── Results ──
    const loadResults = useCallback((electionId: number) => dispatch(fetchElectionResults(electionId)), [dispatch]);
    const loadLiveVoteCount = useCallback((electionId: number) => dispatch(fetchLiveVoteCount(electionId)), [dispatch]);

    // ── Admin ──
    const adminLoadAllElections = useCallback((params: ElectionPaginationParams = {}) => dispatch(adminFetchAllElections(params)), [dispatch]);
    const adminForceOpenNominations = useCallback((id: number) => dispatch(adminForceOpenNominationsAsync(id)), [dispatch]);
    const adminForceCloseNominations = useCallback((id: number) => dispatch(adminForceCloseNominationsAsync(id)), [dispatch]);
    const adminForceOpenVoting = useCallback((id: number) => dispatch(adminForceOpenVotingAsync(id)), [dispatch]);
    const adminForceCloseVoting = useCallback((id: number) => dispatch(adminForceCloseVotingAsync(id)), [dispatch]);
    const adminForcePublishResults = useCallback((id: number) => dispatch(adminForcePublishResultsAsync(id)), [dispatch]);
    const adminForceCancel = useCallback((id: number, reason: string) => dispatch(adminForceCancelAsync({ id, reason })), [dispatch]);
    const adminGetCandidates = useCallback((electionId: number, params?: ElectionPaginationParams) => dispatch(adminGetCandidatesAsync({ electionId, params })), [dispatch]);
    const adminForceApproveCandidate = useCallback((electionId: number, candidateId: number) => dispatch(adminForceApproveCandidateAsync({ electionId, candidateId })), [dispatch]);
    const adminForceRejectCandidate = useCallback((electionId: number, candidateId: number, reason?: string) => dispatch(adminForceRejectCandidateAsync({ electionId, candidateId, reason })), [dispatch]);
    const adminDisqualifyCandidate = useCallback((electionId: number, candidateId: number, reason?: string) => dispatch(adminDisqualifyCandidateAsync({ electionId, candidateId, reason })), [dispatch]);
    const adminGetLiveVotes = useCallback((electionId: number) => dispatch(adminGetLiveVotesAsync(electionId)), [dispatch]);
    const adminPermanentDelete = useCallback((electionId: number) => dispatch(adminPermanentDeleteAsync(electionId)), [dispatch]);
    const adminLoadStatistics = useCallback(() => dispatch(adminFetchStatistics()), [dispatch]);
    const adminLoadStatisticsSummary = useCallback(() => dispatch(adminFetchStatisticsSummary()), [dispatch]);
    const adminResetVotes = useCallback((electionId: number) => dispatch(adminResetVotesAsync(electionId)), [dispatch]);
    const adminProcessStatusUpdates = useCallback(() => dispatch(adminProcessStatusUpdatesAsync()), [dispatch]);

    // ── Utility ──
    const clearError = useCallback(() => dispatch(clearElectionError()), [dispatch]);
    const clearSuccess = useCallback(() => dispatch(clearElectionSuccess()), [dispatch]);
    const resetSelectedElection = useCallback(() => dispatch(clearSelectedElection()), [dispatch]);
    const resetCandidates = useCallback(() => dispatch(clearCandidates()), [dispatch]);
    const resetResults = useCallback(() => dispatch(clearResults()), [dispatch]);
    const resetVoteState = useCallback(() => dispatch(clearVoteState()), [dispatch]);

    return {
        // State
        elections, selectedElection, totalElections,
        candidates, approvedCandidates, pendingCandidates: pendingCandidatesState,
        myCandidacies, selectedCandidate,
        electionResults, liveVoteCount,
        hasVoted, voteVerification, verificationToken,
        statistics, statisticsSummary,
        // Loading
        isLoading, isDetailLoading, isCandidateLoading, isVoteLoading,
        isResultsLoading, isStatsLoading, isCreating, isUpdating, isDeleting, isLifecycleLoading,
        error, successMessage,
        // Election CRUD
        loadElections, loadUpcomingElections, loadVotableElections, searchElections,
        loadElectionById, loadElectionWithCandidates,
        createElection, updateElection, deleteElection,
        // Lifecycle
        openNominations, closeNominations, openVoting, closeVoting, publishResults, cancelElection,
        // Candidates
        loadCandidates, loadApprovedCandidates, loadPendingCandidates, loadCandidateById,
        loadMyCandidacies, nominateSelf, updateNomination, deleteNomination,
        reviewCandidate, withdrawCandidacy,
        // Voting
        castVote, checkHasVoted, verifyVote,
        // Results
        loadResults, loadLiveVoteCount,
        // Admin
        adminLoadAllElections,
        adminForceOpenNominations, adminForceCloseNominations,
        adminForceOpenVoting, adminForceCloseVoting,
        adminForcePublishResults, adminForceCancel,
        adminGetCandidates, adminForceApproveCandidate, adminForceRejectCandidate,
        adminDisqualifyCandidate, adminGetLiveVotes, adminPermanentDelete,
        adminLoadStatistics, adminLoadStatisticsSummary, adminResetVotes,
        adminProcessStatusUpdates,
        // Utility
        clearError, clearSuccess, resetSelectedElection, resetCandidates, resetResults, resetVoteState,
    };
}
