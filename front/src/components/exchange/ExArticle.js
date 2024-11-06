import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../login/context/AuthContext';
import '../board/bbs.css';
import '../board/page.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ExArticle = () => {
    const { token } = useContext(AuthContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const exchangeId = queryParams.get('exchangeId');

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();   


    // token에서 memId와 role 가져오기
    const getTokenInfo = (token) => {
        if (token) { 
            const payloadBase64 = token.split('.')[1]; 
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return {
                memId: decodedPayload.sub,
                role: decodedPayload.role
            };
        }
        return { memId: null, role: null };
    };
    
    const { memId, role } = getTokenInfo(token);

    useEffect(() => {
        if (!token) { 
            alert('로그인한 사용자만 게시글을 조회 할 수 있습니다.');
            navigate('/login');
            return;
        }

        const fetchArticle = async () => {
            try {
                const response = await axios.get('/exchange/article', {
                    params: { exchangeId }
                });
                setArticle(response.data);
                
                // 권한 체크
                const { memId, role } = getTokenInfo(token);
                if (role !== 'ADMIN' && response.data.memId !== memId) {
                    alert('본인이 작성한 게시물만 조회할 수 있습니다');
                    navigate('/exchange/list');
                    return;
                }
                
                setLoading(false);
            } catch (error) {
                console.error('게시물을 가져오는 데 오류가 발생했습니다.', error);
                setLoading(false);
                navigate('/exchange/list');
            }
        };

        fetchArticle();
    }, [token, exchangeId, navigate]);



    const getAuthLabel = (auth) => {
        switch (auth) {
            case 1:
                return '승인완료';
            case 0:
                return '미승인';
            default:
                return '알 수 없음';
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/exchange/deleted`, {
                params: { exchangeId }
            });
            alert(response.data);
            navigate('/exchange/list');
        } catch (error) {
            console.error('게시물을 삭제하는 데 오류가 발생했습니다.', error);
            const errorMessage = error.response && error.response.data 
                ? error.response.data 
                : '알 수 없는 오류가 발생했습니다.';
            alert('게시물 삭제에 실패했습니다: ' + errorMessage);
        }
    };


                   
 /*  ##### 인증 승인 auth 부분  */
    const handleAuth = async () => {
        try {
            const response = await axios.post(`/exchange/auth`, null, {
                params: { exchangeId }
            });
            alert(response.data);
            
            // 게시글 데이터 다시 불러오기
            const updatedArticle = await axios.get('/exchange/article', {
                params: { exchangeId }
            });
            setArticle(updatedArticle.data);
            
        } catch (error) {
            console.error('인증 승인 시 오류가 발생했습니다.', error);
            const errorMessage = error.response && error.response.data 
                ? error.response.data 
                : '알 수 없는 오류가 발생했습니다.';
            alert('인증 승인에 실패했습니다: ' + errorMessage);
        }
    };
    
    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (!article) {
        return <p>게시물을 찾을 수 없습니다.</p>; 
    }

return (
    <div className="container" style={{ maxWidth: "900px" }}>
        <div className="card mb-4">
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-2 bg-light py-2">제목</div>
                    <div className="col-10 py-2 d-flex justify-content-between align-items-center">
                        <span>{article.title}</span>
                        {(role === 'ADMIN' || (memId === article.memId && article.auth === 0)) && (
                            <button className="btn btn-outline-danger" onClick={handleDelete}>
                                <i className="fas fa-trash-alt"></i> 삭제
                            </button>
                        )}
                    </div>
                </div>

              

                <div className="row mb-3">
                    <div className="col-2 bg-light py-2">작성자</div>
                    <div className="col-10 py-2">{article.memId}</div>
                </div>

                <div className="row mb-3">
                    <div className="col-2 bg-light py-2">작성일</div>
                    <div className="col-10 py-2">{new Date(article.created).toLocaleDateString()}</div>
                </div>
                
                <div className="row mb-3">
                    <div className="col-2 bg-light py-2">승인여부</div>
                    <div className="col-10 py-2 d-flex align-items-center">
                        {getAuthLabel(article.auth)}
                        {role === 'ADMIN' && article.auth === 0 && (
                            <button className="btn btn-outline-primary ms-3" onClick={handleAuth}>
                                <i className="fas fa-check"></i> 인증승인
                            </button>
                        )}
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-2 bg-light py-2">배송 정보</div>
                    <div className="col-10 py-2">
                        <div className="mb-2"><strong>보내는 분:</strong> {article.sender}</div>
                        <div className="mb-2"><strong>받는 분:</strong> {article.receiver}</div>
                        <div className="mb-2"><strong>우편번호:</strong> {article.post}</div>
                        <div className="mb-2"><strong>주소:</strong> {article.addr1}</div>
                        <div className="mb-2"><strong>상세주소:</strong> {article.addr2}</div>
                        <div className="mb-2"><strong>전화번호:</strong> {article.tel}</div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-2 bg-light py-2">배송 메시지</div>
                    <div className="col-10 py-2" style={{ whiteSpace: "pre-line" }}>
                        {article.content}
                    </div>
                </div>

                <div className="row">
                    <div className="col-2 bg-light py-2">선택한 상품</div>
                    <div className="col-10 py-2">
                        {article.selec && (
                            <img 
                                src={`/exchange/ex${article.selec}.png`}
                                alt={`선택된 교환 이미지 ${article.selec}`}
                                style={{ maxWidth: "50%" }}
                                className="mt-2"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="my-3 d-flex justify-content-center">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/exchange/list')}>
                <i className="fas fa-list"></i> 목록
            </button>
        </div>
    </div>
    );

};

export default ExArticle;
