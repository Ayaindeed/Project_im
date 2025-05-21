import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Dashboard from '../pages/Dashboard';
import NavBar from '../components/NavBar';

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

  if (auth.loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <>
      <NavBar isAuthenticated={auth.isAuthenticated} user={auth.user} />
      <div className="main-content">
        <Switch>
          <Route exact path="/">
            {auth.isAuthenticated ? (
              <Redirect to="/dashboard" />
            ) : (
              <Login />
            )}
          </Route>
          <Route path="/register" component={Register} />
          <Route 
            path="/dashboard"
            render={props => 
              auth.isAuthenticated ? (
                <Dashboard {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </Switch>
      </div>
    </>
  );
};

export default AppRouter;