/**
 * @fileoverview Election Module Services
 * @description API services for elections, candidates, voting, and results
 */

import apiClient from '@/lib/api-client';
import {
    // Election Types
    ElectionsPagedResponse,
    ElectionDetailResponse,
    ElectionWithCandidatesDetailResponse,
    CreateElectionRequest,
    UpdateElectionRequest,
    CancelElectionRequest,
    // Candidate Types
    CandidatesPagedResponse,
    CandidateDetailResponse,
    NominateCandidateRequest,
    UpdateNominationRequest,
    ReviewCandidateRequest,
    // Voting Types
    CastVoteRequest,
    VoteResponse,
    HasVotedResponse,
    VerifyVoteResponse,
    // Results Types
    ElectionResultsApiResponse,
    LiveVoteCountApiResponse,
    // Statistics Types
    ElectionStatisticsApiResponse,
    ElectionStatisticsSummaryApiResponse,
    // Common Types
    ElectionActionResponse,
    ElectionPaginationParams,
    ElectionSearchParams,
    ElectionStatus,
} from './types';

// ============================================================================
// Endpoints
// ============================================================================

export const ELECTION_ENDPOINTS = {
    // Election CRUD
    ELECTIONS: '/club/election',
    ELECTION_BY_ID: (id: number) => `/club/election/${id}`,
    ELECTION_DETAILS: (id: number) => `/club/election/${id}/details`,
    ELECTIONS_BY_CLUB: (clubId: number) => `/club/election/club/${clubId}`,
    ELECTIONS_BY_STATUS: (status: ElectionStatus) => `/club/election/status/${status}`,
    ELECTIONS_UPCOMING: '/club/election/upcoming',
    ELECTIONS_VOTABLE: '/club/election/votable',
    ELECTIONS_SEARCH: '/club/election/search',

    // Election Lifecycle
    OPEN_NOMINATIONS: (id: number) => `/club/election/${id}/open-nominations`,
    CLOSE_NOMINATIONS: (id: number) => `/club/election/${id}/close-nominations`,
    OPEN_VOTING: (id: number) => `/club/election/${id}/open-voting`,
    CLOSE_VOTING: (id: number) => `/club/election/${id}/close-voting`,
    PUBLISH_RESULTS: (id: number) => `/club/election/${id}/publish-results`,
    CANCEL_ELECTION: (id: number) => `/club/election/${id}/cancel`,

    // Candidate Management
    CANDIDATE_NOMINATE: '/club/election/candidate/nominate',
    CANDIDATE_NOMINATE_BY_ID: (id: number) => `/club/election/candidate/nominate/${id}`,
    CANDIDATE_REVIEW: '/club/election/candidate/review',
    CANDIDATE_WITHDRAW: (id: number) => `/club/election/candidate/${id}/withdraw`,
    CANDIDATES_BY_ELECTION: (electionId: number) => `/club/election/${electionId}/candidate`,
    CANDIDATES_APPROVED: (electionId: number) => `/club/election/${electionId}/candidate/approved`,
    CANDIDATES_PENDING: (electionId: number) => `/club/election/${electionId}/candidate/pending`,
    CANDIDATE_BY_ID: (id: number) => `/club/election/candidate/${id}`,
    MY_CANDIDACIES: '/club/election/candidate/my',

    // Voting
    CAST_VOTE: '/club/election/vote',
    HAS_VOTED: (electionId: number) => `/club/election/${electionId}/has-voted`,
    VERIFY_VOTE: (electionId: number) => `/club/election/${electionId}/verify-vote`,

    // Results
    ELECTION_RESULTS: (electionId: number) => `/club/election/${electionId}/results`,
    LIVE_VOTE_COUNT: (electionId: number) => `/club/election/${electionId}/live-count`,

    // Club-Scoped Elections
    CLUB_ELECTIONS: (clubId: number) => `/club/${clubId}/elections`,
    CLUB_ACTIVE_ELECTIONS: (clubId: number) => `/club/${clubId}/elections/active`,
    CLUB_UPCOMING_ELECTIONS: (clubId: number) => `/club/${clubId}/elections/upcoming`,
    CLUB_COMPLETED_ELECTIONS: (clubId: number) => `/club/${clubId}/elections/completed`,

    // Admin Endpoints
    ADMIN_FORCE_OPEN_NOMINATIONS: (id: number) => `/admin/election/${id}/force-open-nominations`,
    ADMIN_FORCE_CLOSE_NOMINATIONS: (id: number) => `/admin/election/${id}/force-close-nominations`,
    ADMIN_FORCE_OPEN_VOTING: (id: number) => `/admin/election/${id}/force-open-voting`,
    ADMIN_FORCE_CLOSE_VOTING: (id: number) => `/admin/election/${id}/force-close-voting`,
    ADMIN_FORCE_PUBLISH_RESULTS: (id: number) => `/admin/election/${id}/force-publish-results`,
    ADMIN_FORCE_CANCEL: (id: number) => `/admin/election/${id}/force-cancel`,
    ADMIN_CANDIDATES: (electionId: number) => `/admin/election/${electionId}/candidates`,
    ADMIN_FORCE_APPROVE_CANDIDATE: (electionId: number, candidateId: number) =>
        `/admin/election/${electionId}/candidates/${candidateId}/force-approve`,
    ADMIN_FORCE_REJECT_CANDIDATE: (electionId: number, candidateId: number) =>
        `/admin/election/${electionId}/candidates/${candidateId}/force-reject`,
    ADMIN_DISQUALIFY_CANDIDATE: (electionId: number, candidateId: number) =>
        `/admin/election/${electionId}/candidates/${candidateId}/disqualify`,
    ADMIN_LIVE_VOTES: (electionId: number) => `/admin/election/${electionId}/live-votes`,
    ADMIN_PERMANENT_DELETE: (electionId: number) => `/admin/election/${electionId}/permanent`,
    ADMIN_STATISTICS: '/admin/election/statistics',
    ADMIN_STATISTICS_BY_CLUB: (clubId: number) => `/admin/election/statistics/clubs/${clubId}`,
    ADMIN_STATISTICS_BY_ELECTION: (electionId: number) => `/admin/election/statistics/elections/${electionId}`,
    ADMIN_STATISTICS_SUMMARY: '/admin/election/statistics/summary',
    ADMIN_PROCESS_STATUS_UPDATES: '/admin/election/process-status-updates',
    ADMIN_RESET_VOTES: (electionId: number) => `/admin/election/${electionId}/reset-votes`,
};

// ============================================================================
// Helper Functions
// ============================================================================

function buildQueryParams<T extends object>(params: T): string {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
        }
    });
    return queryParams.toString();
}

// ============================================================================
// Election CRUD Services
// ============================================================================

export async function createElection(data: CreateElectionRequest): Promise<ElectionDetailResponse> {
    const response = await apiClient.post<ElectionDetailResponse>(ELECTION_ENDPOINTS.ELECTIONS, data);
    return response.data;
}

export async function updateElection(id: number, data: UpdateElectionRequest): Promise<ElectionDetailResponse> {
    const response = await apiClient.put<ElectionDetailResponse>(ELECTION_ENDPOINTS.ELECTION_BY_ID(id), data);
    return response.data;
}

export async function getElectionById(id: number): Promise<ElectionDetailResponse> {
    const response = await apiClient.get<ElectionDetailResponse>(ELECTION_ENDPOINTS.ELECTION_BY_ID(id));
    return response.data;
}

export async function getElectionWithCandidates(id: number): Promise<ElectionWithCandidatesDetailResponse> {
    const response = await apiClient.get<ElectionWithCandidatesDetailResponse>(ELECTION_ENDPOINTS.ELECTION_DETAILS(id));
    return response.data;
}

export async function getElectionsByClub(clubId: number, params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query ? `${ELECTION_ENDPOINTS.ELECTIONS_BY_CLUB(clubId)}?${query}` : ELECTION_ENDPOINTS.ELECTIONS_BY_CLUB(clubId);
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

export async function getElectionsByStatus(status: ElectionStatus, params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query ? `${ELECTION_ENDPOINTS.ELECTIONS_BY_STATUS(status)}?${query}` : ELECTION_ENDPOINTS.ELECTIONS_BY_STATUS(status);
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

export async function getUpcomingElections(params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query ? `${ELECTION_ENDPOINTS.ELECTIONS_UPCOMING}?${query}` : ELECTION_ENDPOINTS.ELECTIONS_UPCOMING;
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

export async function getVotableElections(params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query ? `${ELECTION_ENDPOINTS.ELECTIONS_VOTABLE}?${query}` : ELECTION_ENDPOINTS.ELECTIONS_VOTABLE;
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

export async function searchElections(params: ElectionSearchParams): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const response = await apiClient.get<ElectionsPagedResponse>(`${ELECTION_ENDPOINTS.ELECTIONS_SEARCH}?${query}`);
    return response.data;
}

export async function deleteElection(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.delete<ElectionActionResponse>(ELECTION_ENDPOINTS.ELECTION_BY_ID(id));
    return response.data;
}

// ============================================================================
// Election Lifecycle Services
// ============================================================================

export async function openNominations(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.OPEN_NOMINATIONS(id));
    return response.data;
}

export async function closeNominations(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.CLOSE_NOMINATIONS(id));
    return response.data;
}

export async function openVoting(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.OPEN_VOTING(id));
    return response.data;
}

export async function closeVoting(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.CLOSE_VOTING(id));
    return response.data;
}

export async function publishResults(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.PUBLISH_RESULTS(id));
    return response.data;
}

export async function cancelElection(id: number, data: CancelElectionRequest): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.CANCEL_ELECTION(id), data);
    return response.data;
}

// ============================================================================
// Candidate Services
// ============================================================================

export async function nominateSelf(data: NominateCandidateRequest): Promise<CandidateDetailResponse> {
    const formData = new FormData();
    formData.append('electionId', data.electionId.toString());
    formData.append('manifesto', data.manifesto);
    if (data.slogan) formData.append('slogan', data.slogan);
    if (data.qualifications) formData.append('qualifications', data.qualifications);
    if (data.previousExperience) formData.append('previousExperience', data.previousExperience);
    if (data.photo) formData.append('photo', data.photo);

    const response = await apiClient.post<CandidateDetailResponse>(ELECTION_ENDPOINTS.CANDIDATE_NOMINATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

export async function updateNomination(id: number, data: UpdateNominationRequest): Promise<CandidateDetailResponse> {
    const formData = new FormData();
    if (data.manifesto) formData.append('manifesto', data.manifesto);
    if (data.slogan) formData.append('slogan', data.slogan);
    if (data.qualifications) formData.append('qualifications', data.qualifications);
    if (data.previousExperience) formData.append('previousExperience', data.previousExperience);
    if (data.photo) formData.append('photo', data.photo);

    const response = await apiClient.put<CandidateDetailResponse>(ELECTION_ENDPOINTS.CANDIDATE_NOMINATE_BY_ID(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

export async function deleteNomination(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.delete<ElectionActionResponse>(ELECTION_ENDPOINTS.CANDIDATE_NOMINATE_BY_ID(id));
    return response.data;
}

export async function reviewCandidate(data: ReviewCandidateRequest): Promise<CandidateDetailResponse> {
    const response = await apiClient.post<CandidateDetailResponse>(ELECTION_ENDPOINTS.CANDIDATE_REVIEW, data);
    return response.data;
}

export async function withdrawCandidacy(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.CANDIDATE_WITHDRAW(id));
    return response.data;
}

export async function getAllCandidates(electionId: number, params: ElectionPaginationParams = {}): Promise<CandidatesPagedResponse> {
    const query = buildQueryParams(params);
    const url = query
        ? `${ELECTION_ENDPOINTS.CANDIDATES_BY_ELECTION(electionId)}?${query}`
        : ELECTION_ENDPOINTS.CANDIDATES_BY_ELECTION(electionId);
    const response = await apiClient.get<CandidatesPagedResponse>(url);
    return response.data;
}

export async function getApprovedCandidates(electionId: number, params: ElectionPaginationParams = {}): Promise<CandidatesPagedResponse> {
    const query = buildQueryParams(params);
    const url = query
        ? `${ELECTION_ENDPOINTS.CANDIDATES_APPROVED(electionId)}?${query}`
        : ELECTION_ENDPOINTS.CANDIDATES_APPROVED(electionId);
    const response = await apiClient.get<CandidatesPagedResponse>(url);
    return response.data;
}

export async function getPendingCandidates(electionId: number, params: ElectionPaginationParams = {}): Promise<CandidatesPagedResponse> {
    const query = buildQueryParams(params);
    const url = query
        ? `${ELECTION_ENDPOINTS.CANDIDATES_PENDING(electionId)}?${query}`
        : ELECTION_ENDPOINTS.CANDIDATES_PENDING(electionId);
    const response = await apiClient.get<CandidatesPagedResponse>(url);
    return response.data;
}

export async function getCandidateById(id: number): Promise<CandidateDetailResponse> {
    const response = await apiClient.get<CandidateDetailResponse>(ELECTION_ENDPOINTS.CANDIDATE_BY_ID(id));
    return response.data;
}

export async function getMyCandidacies(params: ElectionPaginationParams = {}): Promise<CandidatesPagedResponse> {
    const query = buildQueryParams(params);
    const url = query ? `${ELECTION_ENDPOINTS.MY_CANDIDACIES}?${query}` : ELECTION_ENDPOINTS.MY_CANDIDACIES;
    const response = await apiClient.get<CandidatesPagedResponse>(url);
    return response.data;
}

// ============================================================================
// Voting Services
// ============================================================================

export async function castVote(data: CastVoteRequest): Promise<VoteResponse> {
    const response = await apiClient.post<VoteResponse>(ELECTION_ENDPOINTS.CAST_VOTE, data);
    return response.data;
}

export async function checkHasVoted(electionId: number): Promise<HasVotedResponse> {
    const response = await apiClient.get<HasVotedResponse>(ELECTION_ENDPOINTS.HAS_VOTED(electionId));
    return response.data;
}

export async function verifyVote(electionId: number, token: string): Promise<VerifyVoteResponse> {
    const response = await apiClient.get<VerifyVoteResponse>(
        `${ELECTION_ENDPOINTS.VERIFY_VOTE(electionId)}?token=${encodeURIComponent(token)}`
    );
    return response.data;
}

// ============================================================================
// Results Services
// ============================================================================

export async function getElectionResults(electionId: number): Promise<ElectionResultsApiResponse> {
    const response = await apiClient.get<ElectionResultsApiResponse>(ELECTION_ENDPOINTS.ELECTION_RESULTS(electionId));
    return response.data;
}

export async function getLiveVoteCount(electionId: number): Promise<LiveVoteCountApiResponse> {
    const response = await apiClient.get<LiveVoteCountApiResponse>(ELECTION_ENDPOINTS.LIVE_VOTE_COUNT(electionId));
    return response.data;
}

// ============================================================================
// Club-Scoped Election Services
// ============================================================================

export async function getClubElections(clubId: number, params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query ? `${ELECTION_ENDPOINTS.CLUB_ELECTIONS(clubId)}?${query}` : ELECTION_ENDPOINTS.CLUB_ELECTIONS(clubId);
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

export async function getClubActiveElections(clubId: number, params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query
        ? `${ELECTION_ENDPOINTS.CLUB_ACTIVE_ELECTIONS(clubId)}?${query}`
        : ELECTION_ENDPOINTS.CLUB_ACTIVE_ELECTIONS(clubId);
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

export async function getClubUpcomingElections(clubId: number, params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query
        ? `${ELECTION_ENDPOINTS.CLUB_UPCOMING_ELECTIONS(clubId)}?${query}`
        : ELECTION_ENDPOINTS.CLUB_UPCOMING_ELECTIONS(clubId);
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

export async function getClubCompletedElections(clubId: number, params: ElectionPaginationParams = {}): Promise<ElectionsPagedResponse> {
    const query = buildQueryParams(params);
    const url = query
        ? `${ELECTION_ENDPOINTS.CLUB_COMPLETED_ELECTIONS(clubId)}?${query}`
        : ELECTION_ENDPOINTS.CLUB_COMPLETED_ELECTIONS(clubId);
    const response = await apiClient.get<ElectionsPagedResponse>(url);
    return response.data;
}

// ============================================================================
// Admin Services
// ============================================================================

export async function adminForceOpenNominations(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_FORCE_OPEN_NOMINATIONS(id));
    return response.data;
}

export async function adminForceCloseNominations(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_FORCE_CLOSE_NOMINATIONS(id));
    return response.data;
}

export async function adminForceOpenVoting(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_FORCE_OPEN_VOTING(id));
    return response.data;
}

export async function adminForceCloseVoting(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_FORCE_CLOSE_VOTING(id));
    return response.data;
}

export async function adminForcePublishResults(id: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_FORCE_PUBLISH_RESULTS(id));
    return response.data;
}

export async function adminForceCancelElection(id: number, data: CancelElectionRequest): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_FORCE_CANCEL(id), data);
    return response.data;
}

export async function adminGetCandidates(electionId: number): Promise<CandidatesPagedResponse> {
    const response = await apiClient.get<CandidatesPagedResponse>(ELECTION_ENDPOINTS.ADMIN_CANDIDATES(electionId));
    return response.data;
}

export async function adminForceApproveCandidate(electionId: number, candidateId: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(
        ELECTION_ENDPOINTS.ADMIN_FORCE_APPROVE_CANDIDATE(electionId, candidateId)
    );
    return response.data;
}

export async function adminForceRejectCandidate(electionId: number, candidateId: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(
        ELECTION_ENDPOINTS.ADMIN_FORCE_REJECT_CANDIDATE(electionId, candidateId)
    );
    return response.data;
}

export async function adminDisqualifyCandidate(electionId: number, candidateId: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(
        ELECTION_ENDPOINTS.ADMIN_DISQUALIFY_CANDIDATE(electionId, candidateId)
    );
    return response.data;
}

export async function adminGetLiveVotes(electionId: number): Promise<LiveVoteCountApiResponse> {
    const response = await apiClient.get<LiveVoteCountApiResponse>(ELECTION_ENDPOINTS.ADMIN_LIVE_VOTES(electionId));
    return response.data;
}

export async function adminPermanentDeleteElection(electionId: number): Promise<ElectionActionResponse> {
    const response = await apiClient.delete<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_PERMANENT_DELETE(electionId));
    return response.data;
}

export async function adminGetStatistics(): Promise<ElectionStatisticsApiResponse> {
    const response = await apiClient.get<ElectionStatisticsApiResponse>(ELECTION_ENDPOINTS.ADMIN_STATISTICS);
    return response.data;
}

export async function adminGetStatisticsByClub(clubId: number): Promise<ElectionStatisticsApiResponse> {
    const response = await apiClient.get<ElectionStatisticsApiResponse>(ELECTION_ENDPOINTS.ADMIN_STATISTICS_BY_CLUB(clubId));
    return response.data;
}

export async function adminGetStatisticsByElection(electionId: number): Promise<ElectionStatisticsApiResponse> {
    const response = await apiClient.get<ElectionStatisticsApiResponse>(ELECTION_ENDPOINTS.ADMIN_STATISTICS_BY_ELECTION(electionId));
    return response.data;
}

export async function adminGetStatisticsSummary(): Promise<ElectionStatisticsSummaryApiResponse> {
    const response = await apiClient.get<ElectionStatisticsSummaryApiResponse>(ELECTION_ENDPOINTS.ADMIN_STATISTICS_SUMMARY);
    return response.data;
}

export async function adminProcessStatusUpdates(): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_PROCESS_STATUS_UPDATES);
    return response.data;
}

export async function adminResetVotes(electionId: number): Promise<ElectionActionResponse> {
    const response = await apiClient.post<ElectionActionResponse>(ELECTION_ENDPOINTS.ADMIN_RESET_VOTES(electionId));
    return response.data;
}
