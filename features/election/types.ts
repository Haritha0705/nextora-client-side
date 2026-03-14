/**
 * @fileoverview Election Module Types
 * @description Type definitions for elections, candidates, voting, and results
 */

// ============================================================================
// Enums
// ============================================================================

export type ElectionStatus =
    | 'DRAFT'
    | 'NOMINATIONS_OPEN'
    | 'NOMINATIONS_CLOSED'
    | 'VOTING_OPEN'
    | 'VOTING_CLOSED'
    | 'RESULTS_PUBLISHED'
    | 'CANCELLED';

export type ElectionType = 'PRESIDENTIAL' | 'GENERAL' | 'BY_ELECTION' | 'REFERENDUM';

export type CandidateStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN' | 'DISQUALIFIED';

// ============================================================================
// Election Types
// ============================================================================

export interface ElectionResponse {
    id: number;
    clubId: number;
    clubName?: string;
    title: string;
    description: string | null;
    electionType: ElectionType;
    status: ElectionStatus;
    electionDate: string;
    votingDaysLimit: number;
    electionYear: number;
    maxVotesPerCandidate: number;
    needsRevenue: boolean;
    totalCandidates?: number;
    totalApprovedCandidates?: number;
    totalVotes?: number;
    createdAt: string;
    updatedAt: string;
    cancellationReason?: string | null;
}

export interface ElectionWithCandidatesResponse extends ElectionResponse {
    candidates: CandidateResponse[];
}

export interface CreateElectionRequest {
    clubId: number;
    title: string;
    description?: string;
    electionType: ElectionType;
    electionDate: string;
    votingDaysLimit: number;
    electionYear: number;
    maxVotesPerCandidate?: number;
    needsRevenue?: boolean;
}

export interface UpdateElectionRequest {
    title?: string;
    description?: string;
    electionDate?: string;
    votingDaysLimit?: number;
}

export interface CancelElectionRequest {
    reason: string;
}

// ============================================================================
// Candidate Types
// ============================================================================

export interface CandidateResponse {
    id: number;
    electionId: number;
    userId: number;
    userName?: string;
    userEmail?: string;
    profilePictureUrl?: string | null;
    manifesto: string;
    slogan: string | null;
    qualifications: string | null;
    previousExperience: string | null;
    photoUrl: string | null;
    status: CandidateStatus;
    reviewComments: string | null;
    reviewedAt: string | null;
    reviewedBy: string | null;
    voteCount?: number;
    votePercentage?: number;
    createdAt: string;
    updatedAt: string;
}

export interface NominateCandidateRequest {
    electionId: number;
    manifesto: string;
    slogan?: string;
    qualifications?: string;
    previousExperience?: string;
    photo?: File;
}

export interface UpdateNominationRequest {
    manifesto?: string;
    slogan?: string;
    qualifications?: string;
    previousExperience?: string;
    photo?: File;
}

export interface ReviewCandidateRequest {
    candidateId: number;
    approved: boolean;
    reviewComments?: string;
}

// ============================================================================
// Voting Types
// ============================================================================

export interface CastVoteRequest {
    electionId: number;
    candidateId: number;
}

export interface VoteResponse {
    success: boolean;
    message: string;
    data: {
        verificationToken: string;
        electionId: number;
        votedAt: string;
    };
    timestamp: string;
}

export interface HasVotedResponse {
    success: boolean;
    message: string;
    data: {
        hasVoted: boolean;
    };
    timestamp: string;
}

export interface VerifyVoteResponse {
    success: boolean;
    message: string;
    data: {
        verified: boolean;
        electionId: number;
        votedAt: string;
    };
    timestamp: string;
}

// ============================================================================
// Results Types
// ============================================================================

export interface ElectionResultResponse {
    electionId: number;
    electionTitle: string;
    status: ElectionStatus;
    totalVotes: number;
    results: CandidateResultResponse[];
}

export interface CandidateResultResponse {
    candidateId: number;
    candidateName: string;
    photoUrl: string | null;
    slogan: string | null;
    voteCount: number;
    votePercentage: number;
    isWinner: boolean;
}

export interface LiveVoteCountResponse {
    electionId: number;
    totalVotes: number;
    candidateVotes: {
        candidateId: number;
        candidateName: string;
        voteCount: number;
        votePercentage: number;
    }[];
    lastUpdated: string;
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface ElectionStatisticsResponse {
    totalElections: number;
    activeElections: number;
    completedElections: number;
    cancelledElections: number;
    totalVotesCast: number;
    totalCandidates: number;
    averageTurnout: number;
}

export interface ElectionStatisticsSummaryResponse {
    totalElections: number;
    activeElections: number;
    upcomingElections: number;
    completedElections: number;
    totalVotes: number;
    totalCandidates: number;
}

// ============================================================================
// Paginated Response Types
// ============================================================================

export interface ElectionsPagedResponse {
    success: boolean;
    message: string;
    data: {
        content: ElectionResponse[];
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        first: boolean;
        last: boolean;
        empty: boolean;
    };
    timestamp: string;
}

export interface ElectionDetailResponse {
    success: boolean;
    message: string;
    data: ElectionResponse;
    timestamp: string;
}

export interface ElectionWithCandidatesDetailResponse {
    success: boolean;
    message: string;
    data: ElectionWithCandidatesResponse;
    timestamp: string;
}

export interface CandidatesPagedResponse {
    success: boolean;
    message: string;
    data: {
        content: CandidateResponse[];
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        first: boolean;
        last: boolean;
        empty: boolean;
    };
    timestamp: string;
}

export interface CandidateDetailResponse {
    success: boolean;
    message: string;
    data: CandidateResponse;
    timestamp: string;
}

export interface ElectionResultsApiResponse {
    success: boolean;
    message: string;
    data: ElectionResultResponse;
    timestamp: string;
}

export interface LiveVoteCountApiResponse {
    success: boolean;
    message: string;
    data: LiveVoteCountResponse;
    timestamp: string;
}

export interface ElectionStatisticsApiResponse {
    success: boolean;
    message: string;
    data: ElectionStatisticsResponse;
    timestamp: string;
}

export interface ElectionStatisticsSummaryApiResponse {
    success: boolean;
    message: string;
    data: ElectionStatisticsSummaryResponse;
    timestamp: string;
}

// ============================================================================
// Common Types
// ============================================================================

export interface ElectionActionResponse {
    success: boolean;
    message: string;
    data?: unknown;
    timestamp: string;
}

export interface ElectionPaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

export interface ElectionSearchParams extends ElectionPaginationParams {
    keyword?: string;
}
