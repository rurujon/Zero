import React, { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import '../board/bbs.css';
import '../board/page.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../login/context/AuthContext';


//토큰 에러해결(+)
function ExList() {
    const { token } = useContext(AuthContext);

    const [exchanges, setExchanges] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 15;

    const [searchKey, setSearchKey] = useState('title');
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const fetchExchanges = async () => { 
        try {
            const response = await axios.get('/exchange/list', {
                params: {
                    page: 1,
                    size: 1000
                }
               
            }); 
            setExchanges(response.data.content);
            setSearchResults(response.data.content);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error('데이터를 찾을 수 없습니다.', error);
        }
    };

    useEffect(() => {
        fetchExchanges();
    }, []);

    // token에서 memId와 role 가져오기
    const getTokenInfo = (token) => {
        if (!token) {
            return { memId: null, role: 'GUEST' };  // 토큰이 없을 때 GUEST로 처리
        }
        try {
            const payloadBase64 = token.split('.')[1]; 
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return {
                memId: decodedPayload.sub,
                role: decodedPayload.role
            };
        } catch (error) {
            console.error('토큰 디코딩 실패:', error);
            return { memId: null, role: 'GUEST' };  // 토큰 디코딩 실패시 GUEST로 처리
        }
    };
    
    const { memId, role } = getTokenInfo(token);




    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = () => {
        const filtered = exchanges.filter(board => {
            switch (searchKey) {
                case 'memId':
                    return board.memId.includes(searchValue);
                case 'title':
                    return board.title.includes(searchValue);
                default:
                    return true;
            }
        });

        setSearchResults(filtered);
        setTotalItems(filtered.length);
        setCurrentPage(1);
    };

    const getPaginatedResults = () => {
        if (!searchResults) {
            return [];
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        return searchResults.slice(startIndex, startIndex + itemsPerPage);
    };
    
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


    return (
        <div>


            <div className="table-container">
                {/* 테이블 제목과 설명 */}
                <div className="table-header d-flex align-items-center justify-content-start">
                    <h3 className="table-title">교환신청 게시판</h3>
                    <p className="table-description ms-3">300 포인트를 장바구니로 교환해보세요.</p>
                </div>

                {/* 검색 필터 */}
                <div className="filter-container">
                    <table>
                        <tbody>
                            <tr className="category-filter">
                                <td>
                                    <select 
                                        value={searchKey} 
                                        onChange={(e) => {
                                            setSearchKey(e.target.value);
                                            setSearchValue('');
                                        }} 
                                        className="form-control"
                                        style={{ border: 0 }}
                                    >
                                        <option value="memId">작성자</option>
                                        <option value="title">제목</option>
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="검색어" 
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button type="button" className="btn btn-outline-secondary" onClick={handleSearch}>
                                        <i className="fas fa-search"></i> 검색
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <br />

                {/* 게시글 목록 */}
                <table className="table custom-table">
                    <thead>
                        <tr>
                            <th className="col-1">번호</th>
                            <th className="col-2">인증 승인</th>
                            <th></th>
                            <th className="col-5">제목</th>
                            <th className="col-2">작성자</th>
                            <th className="col-2">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedResults().map((board, index) => (
                            <tr key={`${board.exchangeId}_${index}`}>
                                <td className="table-cell-bold">{board.exchangeId}</td>
                                <td>{getAuthLabel(board.auth)}</td>
                                <td><i className="bi bi-lock-fill"></i></td>
                                <td>
                                    {
                                        // 관리자이거나 게시글 작성자인 경우
                                        (role === 'ADMIN' || memId === board.memId) ? (
                                            <Link to={`/exchange/article?exchangeId=${board.exchangeId}`} style={{ color: 'black', textDecoration: 'none' , cursor: 'pointer' }}>
                                                {board.title}
                                            </Link>
                                        ) : (
                                            <span onClick={() => alert("작성자만 조회 가능합니다.")}
                                                  style={{color: 'gray', cursor: 'not-allowed'}}>
                                                {board.title}
                                            </span>
                                        )
                                    }
                                </td>
                                <td>{board.memId}</td>
                                <td>{new Date(board.created).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 및 글쓰기 버튼 */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="mx-auto">
                    <Pagination
                        className="pagination"
                        activePage={currentPage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={totalItems}
                        pageRangeDisplayed={5}
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        onChange={handlePageChange}
                    />
                </div>
                <Link className="btn btn-outline-secondary" to="/exchange/created">
                    <i className="fas fa-pen"></i>글쓰기
                </Link>
            </div>
        </div>
    );
}

export default ExList;
