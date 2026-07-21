import { createBrowserRouter, Navigate } from 'react-router';
import RoleSelection from './screens/auth/RoleSelection';
import Register from './screens/auth/Register';
import Login from './screens/auth/Login';
import CitizenHome from './screens/citizen/CitizenHome';
import Camera from './screens/citizen/Camera';
import Analyse from './screens/citizen/Analyse';
import Argent from './screens/citizen/Argent';
import ProDashboard from './screens/pro/ProDashboard';
import Demandes from './screens/pro/Demandes';
import PointsRachat from './screens/pro/PointsRachat';
import SwitchRole from './screens/shared/SwitchRole';

export const router = createBrowserRouter([
  { path: '/', Component: RoleSelection },
  { path: '/auth/register', Component: Register },
  { path: '/auth/login', Component: Login },
  { path: '/citizen', Component: CitizenHome },
  { path: '/citizen/camera', Component: Camera },
  { path: '/citizen/analyse', Component: Analyse },
  { path: '/citizen/argent', Component: Argent },
  { path: '/pro', Component: ProDashboard },
  { path: '/pro/demandes', Component: Demandes },
  { path: '/pro/points-rachat', Component: PointsRachat },
  { path: '/shared/switch-role', Component: SwitchRole },
  { path: '*', Component: () => <Navigate to="/" replace /> },
]);
