import { create } from 'zustand';
import type { Role, User } from '../types/models';

interface RoleState {
  // State
  currentRole: Role | null;
  availableRoles: Role[];
  isRoleSelected: boolean;
  
  // Actions
  selectRole: (role: Role) => void;
  clearRole: () => void;
  getAvailableRoles: (user: User) => Role[];
  canAccessRole: (role: Role, user: User) => boolean;
}

export const useRoleStore = create<RoleState>((set) => ({
  // Initial state
  currentRole: null,
  availableRoles: ['buyer', 'seller', 'broker'],
  isRoleSelected: false,

  // Actions
  selectRole: (role: Role) => {
    set({
      currentRole: role,
      isRoleSelected: true,
    });
  },

  clearRole: () => {
    set({
      currentRole: null,
      isRoleSelected: false,
    });
  },

  getAvailableRoles: (_user: User) => {
    // TODO: Implement role-based access control
    // For now, all users can access all roles
    return ['buyer', 'seller', 'broker'];
  },

  canAccessRole: (_role: Role, _user: User) => {
    // TODO: Implement role-based access control logic
    // For demo purposes, all users can access all roles
    return true;
  },
}));
