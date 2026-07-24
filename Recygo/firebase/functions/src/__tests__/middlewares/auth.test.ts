/**
 * Tests unitaires pour le middleware d'authentification
 */

// Mock des dépendances Firebase
jest.mock('../../firebase', () => ({
  getAuth: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock('../../firebase/admin', () => ({
  admin: {
    auth: {},
  },
}));

describe('Auth Middleware', () => {
  it('devrait exporter verifyAuthToken', () => {
    const { verifyAuthToken } = jest.requireActual('../../middlewares/auth');
    expect(verifyAuthToken).toBeDefined();
    expect(typeof verifyAuthToken).toBe('function');
  });

  it('devrait exporter requireAuth', () => {
    const { requireAuth } = jest.requireActual('../../middlewares/auth');
    const middleware = requireAuth(jest.fn());
    expect(middleware).toBeInstanceOf(Function);
  });

  it('devrait exporter requireRole', () => {
    const { requireRole } = jest.requireActual('../../middlewares/auth');
    const middleware = requireRole('admin');
    const wrapped = middleware(jest.fn());
    expect(wrapped).toBeInstanceOf(Function);
  });

  it('devrait exporter requireOwner', () => {
    const { requireOwner } = jest.requireActual('../../middlewares/auth');
    const middleware = requireOwner('users');
    expect(middleware).toBeInstanceOf(Function);
  });

  it('devrait exporter AuthContext type', () => {
    const auth = jest.requireActual('../../middlewares/auth');
    expect(auth.AuthContext).toBeUndefined(); // Interface, pas une valeur
  });
});

