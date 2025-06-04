import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../components/Auth/ForgotPassword';
import GoogleAuthSuccess from '../components/Auth/GoogleAuthSuccess';
import Dashboard from '../pages/Dashboard';
import InternshipList from '../pages/InternshipList';
import MyCandidatures from '../pages/MyCandidatures';
import NavBar from '../components/Navbar/NavBar'; // Updated path
import EntrepriseStages from '../pages/EntrepriseStages';
import EntrepriseCandidatures from '../pages/EntrepriseCandidatures';
import AdminRegister from '../components/Auth/AdminRegister';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminUserDetail from '../pages/AdminUserDetail';
import Profile from '../pages/Profile';
import EntrepriseDashboard from '../pages/EntrepriseDashboard';

const AppRouter = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          setAuth({
            isAuthenticated: true,
            user,
            loading: false
          });
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setAuth({
            isAuthenticated: false,
            user: null,
            loading: false
          });
        }
      } else {
        setAuth({
          isAuthenticated: false,
          user: null,
          loading: false
        });
      }
    } catch (error) {
      console.error('Auth state error:', error);
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  }, []);

  // Écouter les événements de connexion/déconnexion
  useEffect(() => {
    const handleUserLogin = (event) => {
      const { user } = event.detail;
      console.log('User login event received:', user);
      setAuth({
        isAuthenticated: true,
        user,
        loading: false
      });
    };

    const handleUserLogout = () => {
      console.log('User logout event received');
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    };

    // Ajouter les gestionnaires d'événements
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    // Nettoyer les gestionnaires à la destruction du composant
    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  if (auth.loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <>
      <NavBar isAuthenticated={auth.isAuthenticated} user={auth.user} />
      <div className="main-content">
        <Switch>
          {/* Public routes */}
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/auth/google/success" component={GoogleAuthSuccess} />
          <Route 
            path="/login" 
            render={props => 
              auth.isAuthenticated ? (
                auth.user?.role === 'admin' ? (
                  <Redirect to="/admin-dashboard" />
                ) : auth.user?.role === 'entreprise' ? (
                  <Redirect to="/entreprise-dashboard" />
                ) : (
                  <Redirect to="/dashboard" />
                )
              ) : (
                <Login {...props} />
              )
            }
          />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/admin-register" component={AdminRegister} />
          
          {/* Enterprise routes */}
          <Route 
            path="/entreprise-candidatures"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'entreprise' ? (
                <EntrepriseCandidatures {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          
          <Route 
            path="/entreprise-stages"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'entreprise' ? (
                <EntrepriseStages {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          
          <Route 
            path="/entreprise-dashboard"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'entreprise' ? (
                <EntrepriseDashboard {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          
          {/* Protected Student Routes */}
          <Route 
            path="/stages"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'etudiant' ? (
                <InternshipList {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          
          <Route 
            path="/mes-candidatures"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'etudiant' ? (
                <MyCandidatures {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />

          <Route 
            path="/dashboard"
            render={props => 
              auth.isAuthenticated ? (
                <Dashboard {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route 
            path="/profile"
            render={props => 
              auth.isAuthenticated ? (
                <Profile {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'admin' ? (
                <AdminDashboard {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route 
            path="/admin-users"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'admin' ? (
                <AdminUsers {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route 
            path="/admin-user/:userId"
            render={props => 
              auth.isAuthenticated && auth.user?.role === 'admin' ? (
                <AdminUserDetail {...props} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </div>
    </>
  );
};

export default AppRouter;