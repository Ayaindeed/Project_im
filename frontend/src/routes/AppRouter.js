import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Dashboard from '../pages/Dashboard';
import InternshipList from '../pages/InternshipList';
import SubmitStage from '../pages/SubmitStage';
import MyCandidatures from '../pages/MyCandidatures';
import EntrepriseCandidatures from '../pages/EntrepriseCandidatures';
import AdminUsers from '../pages/AdminUsers';
import AdminStats from '../pages/AdminStats';
import NavBar from '../components/NavBar';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => (
    <>
        <NavBar />
        <div className="container">
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/register" component={Register} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <Route path="/internships" component={InternshipList} />
                <ProtectedRoute path="/submit-stage" component={SubmitStage} />
                <ProtectedRoute path="/my-candidatures" component={MyCandidatures} />
                <ProtectedRoute path="/entreprise-candidatures" component={EntrepriseCandidatures} />
                <ProtectedRoute path="/admin-users" component={AdminUsers} />
                <ProtectedRoute path="/admin-stats" component={AdminStats} />
            </Switch>
        </div>
    </>
);

export default AppRouter;