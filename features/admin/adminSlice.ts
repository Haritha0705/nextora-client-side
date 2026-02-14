/**
 * Admin User Management Slice
 * @description Redux slice for admin user management state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RoleType, StatusType } from '@/constants';
import {
    User,
    UserStats,
    AllUsersResponse,
    UserStatsResponse,
    SearchUsersParams,
    FilterUsersParams,
    UserFilterParams,
} from './types';
import {
    getAllUsers,
    searchUsers,
    filterUsers,
    getUserStats,
} from './services';

// ============================================================================
// Types
// ============================================================================

interface AdminUsersState {
    // User list
    users: User[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;

    // Filters & Search
    searchQuery: string;
    roleFilter: RoleType | '';
    statusFilter: StatusType | '';

    // Stats
    stats: UserStats | null;

    // Loading states
    isLoading: boolean;
    isStatsLoading: boolean;

    // Error states
    error: string | null;
    statsError: string | null;

    // Timestamps
    lastFetched: string | null;
    lastStatsFetched: string | null;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: AdminUsersState = {
    users: [],
    totalUsers: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,

    searchQuery: '',
    roleFilter: '',
    statusFilter: '',

    stats: null,

    isLoading: false,
    isStatsLoading: false,

    error: null,
    statsError: null,

    lastFetched: null,
    lastStatsFetched: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

// Thunk params interface
interface FetchUsersParams {
    page?: number;
    size?: number;
    searchQuery?: string;
    roleFilter?: RoleType | '';
    statusFilter?: StatusType | '';
}

// Fetch users thunk - handles search, filter, and default pagination
export const fetchUsers = createAsyncThunk<AllUsersResponse, FetchUsersParams | void>(
    'admin/fetchUsers',
    async (params, { rejectWithValue }) => {
        try {
            const page = params?.page ?? 0;
            const size = params?.size ?? 10;
            const searchQuery = params?.searchQuery ?? '';
            const roleFilter = params?.roleFilter ?? '';
            const statusFilter = params?.statusFilter ?? '';

            let response: AllUsersResponse;

            // Use search endpoint if there's a search query
            if (searchQuery.trim()) {
                const searchParams: SearchUsersParams = {
                    keyword: searchQuery.trim(),
                    page,
                    size,
                };
                response = await searchUsers(searchParams);
            }
            // Use filter endpoint if there are filters applied
            else if (roleFilter || statusFilter) {
                const filterParams: FilterUsersParams = {
                    roles: roleFilter ? [roleFilter] : undefined,
                    statuses: statusFilter ? [statusFilter] : undefined,
                    page,
                    size,
                };
                response = await filterUsers(filterParams);
            }
            // Default: get all users
            else {
                const defaultParams: UserFilterParams = {
                    page,
                    size,
                    sortBy: 'id',
                    sortDirection: 'DESC',
                };
                response = await getAllUsers(defaultParams);
            }

            return response;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
            return rejectWithValue(errorMessage);
        }
    }
);

// Fetch user stats thunk
export const fetchUserStats = createAsyncThunk<UserStatsResponse, void>(
    'admin/fetchUserStats',
    async (_, { rejectWithValue }) => {
        try {
            return await getUserStats();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user stats';
            return rejectWithValue(errorMessage);
        }
    }
);

// ============================================================================
// Admin Slice
// ============================================================================

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // Set search query
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.currentPage = 0; // Reset to first page on search
        },

        // Set role filter
        setRoleFilter: (state, action: PayloadAction<RoleType | ''>) => {
            state.roleFilter = action.payload;
            state.currentPage = 0; // Reset to first page on filter change
        },

        // Set status filter
        setStatusFilter: (state, action: PayloadAction<StatusType | ''>) => {
            state.statusFilter = action.payload;
            state.currentPage = 0; // Reset to first page on filter change
        },

        // Set current page
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },

        // Set page size
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
            state.currentPage = 0; // Reset to first page when page size changes
        },

        // Clear all filters
        clearFilters: (state) => {
            state.searchQuery = '';
            state.roleFilter = '';
            state.statusFilter = '';
            state.currentPage = 0;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear stats error
        clearStatsError: (state) => {
            state.statsError = null;
        },

        // Reset state
        resetAdminState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success && action.payload.data) {
                    state.users = action.payload.data.content;
                    state.totalUsers = action.payload.data.totalElements;
                    state.totalPages = action.payload.data.totalPages;
                    state.currentPage = action.payload.data.pageNumber;
                } else {
                    state.users = [];
                    state.totalUsers = 0;
                    state.totalPages = 0;
                }
                state.lastFetched = new Date().toISOString();
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.users = [];
                state.totalUsers = 0;
            });

        // Fetch user stats
        builder
            .addCase(fetchUserStats.pending, (state) => {
                state.isStatsLoading = true;
                state.statsError = null;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.isStatsLoading = false;
                if (action.payload.success && action.payload.data) {
                    state.stats = action.payload.data;
                }
                state.lastStatsFetched = new Date().toISOString();
            })
            .addCase(fetchUserStats.rejected, (state, action) => {
                state.isStatsLoading = false;
                state.statsError = action.payload as string;
            });
    },
});

// ============================================================================
// Exports
// ============================================================================

export const {
    setSearchQuery,
    setRoleFilter,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    clearFilters,
    clearError,
    clearStatsError,
    resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;

// ============================================================================
// Selectors
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminUsers = (state: any) => state.admin.users as User[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminTotalUsers = (state: any) => state.admin.totalUsers as number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminCurrentPage = (state: any) => state.admin.currentPage as number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminPageSize = (state: any) => state.admin.pageSize as number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminTotalPages = (state: any) => state.admin.totalPages as number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminSearchQuery = (state: any) => state.admin.searchQuery as string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminRoleFilter = (state: any) => state.admin.roleFilter as RoleType | '';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminStatusFilter = (state: any) => state.admin.statusFilter as StatusType | '';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminStats = (state: any) => state.admin.stats as UserStats | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminIsLoading = (state: any) => state.admin.isLoading as boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminIsStatsLoading = (state: any) => state.admin.isStatsLoading as boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectAdminError = (state: any) => state.admin.error as string | null;

// Export the state type for use in other files
export type { AdminUsersState };

