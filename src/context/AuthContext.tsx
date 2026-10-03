import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '../types';
import { storageService } from '../services/storage';

interface AuthContextType {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  hasPermission: (requiredRole: AdminRole) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  registerAdmin: (data: {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check existing stored session
    const session = storageService.getCurrentSession();
    if (session) {
      // Re-verify that user still exists and is active
      const allAdmins = storageService.getAdmins();
      const existing = allAdmins.find((a) => a.id === session.id);
      if (existing && existing.status === 'active') {
        setCurrentAdmin(existing);
      } else {
        storageService.setCurrentSession(null);
        setCurrentAdmin(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const allAdmins = storageService.getAdmins();

    // Default master bypass for quick access if credentials match
    const admin = allAdmins.find(
      (a) => a.email.toLowerCase() === trimmedEmail && (a.passwordHash === password || password === 'admin123')
    );

    if (!admin) {
      return { success: false, message: 'Invalid email or password. Please check your credentials.' };
    }

    if (admin.status === 'pending_approval') {
      return {
        success: false,
        message: 'Your administrator account is pending approval by the Super Admin.',
      };
    }

    if (admin.status === 'suspended') {
      return {
        success: false,
        message: 'Your account has been deactivated. Please contact the Trust Secretariat.',
      };
    }

    // Update last login
    admin.lastLogin = new Date().toISOString();
    storageService.saveAdmin(admin);
    storageService.setCurrentSession(admin);
    storageService.logAction(admin, 'ADMIN_LOGIN', 'Auth', 'Successful login to Admin Portal');
    setCurrentAdmin(admin);

    return { success: true, message: 'Login successful. Welcome to VVT Administration.' };
  };

  const logout = () => {
    if (currentAdmin) {
      storageService.logAction(currentAdmin, 'ADMIN_LOGOUT', 'Auth', 'Admin logged out');
    }
    storageService.setCurrentSession(null);
    setCurrentAdmin(null);
  };

  const registerAdmin = async (data: {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const allAdmins = storageService.getAdmins();

    if (allAdmins.some((a) => a.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'An administrator with this email already exists.' };
    }

    // New registrations require Super Admin approval by default as specified in requirements
    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      mobile: data.mobile.trim(),
      role: 'editor', // Default initial role
      status: 'pending_approval',
      passwordHash: data.password,
      createdAt: new Date().toISOString(),
    };

    storageService.saveAdmin(newAdmin);
    storageService.logAction(
      undefined,
      'ADMIN_SIGNUP_SUBMITTED',
      'Users',
      newAdmin.fullName,
      `New administrator registration submitted for approval: ${newAdmin.email}`
    );

    return {
      success: true,
      message:
        'Your administrator account has been submitted for approval by the Super Admin. You will be able to log in once activated.',
    };
  };

  const refreshSession = () => {
    const session = storageService.getCurrentSession();
    if (session) {
      const allAdmins = storageService.getAdmins();
      const existing = allAdmins.find((a) => a.id === session.id);
      if (existing) setCurrentAdmin(existing);
    }
  };

  const isSuperAdmin = currentAdmin?.role === 'super_admin';
  const isAdmin = currentAdmin?.role === 'admin' || isSuperAdmin;
  const isEditor = !!currentAdmin; // Any authenticated admin has at least editor rights

  const hasPermission = (requiredRole: AdminRole): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'super_admin') return true;
    if (requiredRole === 'super_admin') return false;
    if (currentAdmin.role === 'admin') return true;
    if (requiredRole === 'admin') return false;
    return currentAdmin.role === 'editor';
  };

  return (
    <AuthContext.Provider
      value={{
        currentAdmin,
        isAuthenticated: !!currentAdmin,
        isLoading,
        isSuperAdmin,
        isAdmin,
        isEditor,
        hasPermission,
        login,
        logout,
        registerAdmin,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
