export const API = {
  AUTH_BASE_URL: '',
  BASE_URL: '/api',
  AUTH: { LOGIN: '/auth/authenticate' },
  KYC: { CREATE: '/kyc/create',
      SEARCH: '/kyc/search',
      DELETE: '/kyc/delete',
      UPDATE: '/kyc/update',
      PHOTO: (p: string) => `/kyc/photo/${p}`
  }
};
