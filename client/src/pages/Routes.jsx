import React, { useEffect, useState } from 'react';
import { Route, Routes as Switch, useLocation, useNavigate } from 'react-router-dom';
import NotFound from './notFound';
import ROLES from './views/roles';
import Loading from '../components/loadingPage';
import ProtectedRoute from './protectRoutes';
import useAuthStore from '../services/stores/authStore';
import Account from './account';
import AccountSettings from './settings';

const Routes = () => {
    const { role, isSuccess, message, hardReset } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const routes = ROLES[role] || [];
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(role ? false : true);
    }, [role]);

    useEffect(() => {
        if (isSuccess && message.includes("Logged out")) {
            navigate("/");
            hardReset()
        }
    }, [isSuccess, message])

    if (loading) return <Loading />;
    if (!role && loading) return <NotFound />

    return (
        <Switch location={location} key={location.pathname}>
            {role && routes.map(({ path, element, children, acceptProps }, index) => {
                if (children) {
                    return children.map((child, cIndex) => (
                        <Route
                            key={`route-${index}-${cIndex}`}
                            path={child.path}
                            element={
                                <ProtectedRoute
                                    role={role}
                                    element={child.element || <NotFound />}
                                    acceptProps={child.acceptProps}
                                />
                            }
                        />
                    ));
                }

                return (
                    <Route
                        key={`route-${index}`}
                        path={path}
                        element={
                            <ProtectedRoute
                                role={role}
                                element={element || <NotFound />}
                                acceptProps={acceptProps}
                            />
                        }
                    />
                );
            })}

            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="*" element={<NotFound />} />
        </Switch>
    );
};

export default Routes;
