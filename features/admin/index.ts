export * from './services';
export * from './types';

// Export admin slice actions, thunks, and selectors
export {
    default as adminReducer,
    fetchUsers,
    fetchUserStats,
    setSearchQuery,
    setRoleFilter,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    clearFilters,
    clearError,
    clearStatsError,
    resetAdminState,
    selectAdminUsers,
    selectAdminTotalUsers,
    selectAdminCurrentPage,
    selectAdminPageSize,
    selectAdminTotalPages,
    selectAdminSearchQuery,
    selectAdminRoleFilter,
    selectAdminStatusFilter,
    selectAdminStats,
    selectAdminIsLoading,
    selectAdminIsStatsLoading,
    selectAdminError,
    type AdminUsersState,
} from './adminSlice';

// Explicitly export from user-management.services to avoid conflicts with services.ts
export {
    getAllUsers,
    getUserById as getUserByIdAdmin,
    createUser as createUserAdmin,
    updateUserById,
    activateUser,
    deactivateUser,
    unlockUser,
    searchUsers,
    filterUsers,
    getUserStats,
    ADMIN_USER_ENDPOINTS,
} from './services';
