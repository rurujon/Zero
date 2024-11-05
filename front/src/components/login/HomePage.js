import React, { useState, useEffect, useContext, useCallback } from 'react';
import LoginPage from './LoginPage';
import FindIdModal from './FindIdModal';
import FindPasswordModal from './FindPasswordModal';
import PointInfoModal from './PointInfoModal';
import { AuthContext } from './context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'

const HomePage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showFindIdModal, setShowFindIdModal] = useState(false);
    const [showFindPasswordModal, setShowFindPasswordModal] = useState(false);
    const [showPointInfoModal, setShowPointInfoModal] = useState(false);

    const { token, logout, login, memId, role } = useContext(AuthContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        logout();
        setIsLoggedIn(false);
    }, [logout]);

    useEffect(() => {
        if (token) {
            try {
                jwtDecode(token);
                setIsLoggedIn(true);
            } catch (e) {
                console.error('Token decoding failed:', e);
                handleLogout();
            }
        } else {
            setIsLoggedIn(false);
        }
    }, [token, handleLogout]);

    const handleMemberInfo = () => {
        window.open('/member-info', 'MemberInfo', 'width=600,height=400,resizable=yes');
    };

    const handlePointInfo = () => {
        setShowPointInfoModal(true);
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLoginSuccess = useCallback(() => {
        setShowLogin(false);
        setIsLoggedIn(true);
    }, []);

    return (
        <div className='mini_login_wrap'>
            {!isLoggedIn ? (
                <div>
                    <h5>제로동행을 더 안전하고 편리하게 이용하세요</h5>

                    <button
                        onClick={() => setShowLogin(true)}
                        className="btn btn-primary btn-lg"
                        style={{ marginBottom: '20px' }}
                    >
                        ZERO TOGATHER 로그인
                    </button>
                    {showLogin && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100px',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 1000
                            }}
                        >
                            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}>
                                <LoginPage onLoginSuccess={handleLoginSuccess} />
                                <button onClick={() => setShowLogin(false)} className="btn btn-secondary mt-3">닫기</button>
                            </div>
                        </div>
                    )}
                    <div className="button-group">
                        <button type="button" className="btn btn-link" onClick={() => setShowFindIdModal(true)}>아이디 찾기</button>
                        <button type="button" className="btn btn-link" onClick={() => setShowFindPasswordModal(true)}>비밀번호 찾기</button>
                        <button type="button" className="btn btn-link" onClick={handleRegister}>회원가입</button>
                    </div>
                    <FindIdModal show={showFindIdModal} onHide={() => setShowFindIdModal(false)} />
                    <FindPasswordModal show={showFindPasswordModal} onHide={() => setShowFindPasswordModal(false)} />
                </div>
            ) : (
                <div>
                    <h4>안녕하세요, {memId}님.</h4>
                    <h4>오늘도 행복한 하루되세요.</h4>

                    <p>역할: {role}</p>
                    <button onClick={handleMemberInfo} className="btn btn-info">MyInfo조회</button>&nbsp;
                    <button onClick={handlePointInfo} className="btn btn-success">POINT조회</button>&nbsp;
                    <button onClick={''} className="btn btn-primary">일일QUIZ</button>&nbsp;
                    <button onClick={handleLogout} className="btn btn-danger">로그아웃</button>&nbsp;
                    {role === 'ADMIN' && (
                        <button onClick={() => navigate('/admin')} className="btn btn-warning">관리자 페이지</button>
                    )}
                    {showPointInfoModal && (
                        <PointInfoModal
                            show={showPointInfoModal}
                            onHide={() => setShowPointInfoModal(false)}
                            memId={memId}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;
