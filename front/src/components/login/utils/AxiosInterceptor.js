import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AxiosInterceptor = ({ children }) => {
    const { refreshAccessToken, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await refreshAccessToken();
                        if (newToken) {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        } else {
                            throw new Error('토큰 갱신 실패');
                        }
                    } catch (refreshError) {
                        console.error('토큰 갱신 중 오류:', refreshError);
                        await logout();
                        navigate('/login', { state: { message: '인증 정보가 만료되었습니다. 다시 로그인해주세요.' } });
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [refreshAccessToken, logout, navigate]);

    return <>{children}</>;
};

export default AxiosInterceptor;
