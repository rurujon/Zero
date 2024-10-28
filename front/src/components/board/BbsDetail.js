import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import CommentWrite from "../comment/CommentWrite";
import CommentList from "../comment/CommentList";

// import CommentWrite from "../comment/CommentWrite";
// import CommentList from "../comment/CommentList";

function BbsDetail() {
	const [board, setboard] = useState({});
	const { boardno } = useParams(); // 파라미터 가져오기
	const navigate = useNavigate();

	const getBbsDetail = async () => {
		await axios.get(`http://localhost:8080/board/${boardno}`, {
			params: { readerId: localStorage.getItem("memId") || "" } // 로컬 스토리지에서 readerId 가져오기
		})
		.then((resp) => {
			console.log("[BbsDetail.js] getBbsDetail() success :D");
			console.log(resp.data);

			setboard(resp.data.board);
		})
		.catch((err) => {
			console.log("[BbsDetail.js] getBbsDetail() error :<");
			console.log(err);
		});
	}

	const deleteBoard = async () => {
		await axios.get(`http://localhost:8080/board/delete/${boardno}`)
		.then((resp) => {
			console.log("[BbsDetail.js] deleteBoard() success :D");
			console.log(resp.data);

			if (resp.data.deletedRecordCount === 1) {
				alert("게시글을 성공적으로 삭제했습니다 :D");
				navigate("/board/list");
			}
		}).catch((err) => {
			console.log("[BbsDetail.js] deleteBbs() error :<");
			console.log(err);
		});
	}

	// 날짜 변환 함수
	const formatDate = (dateString) => {
		if (!dateString) return ""; // dateString이 없을 경우 빈 문자열 반환
		const date = new Date(dateString);
		return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
	};

	useEffect(() => {
		getBbsDetail();
	}, []);

	const updateBoard = {
		boardno: board.boardno,
		memId: board.memId,
		title: board.title,
		content: board.content
	}

	const parentBbs = {
		memId: board.memId,
		title: board.title
	}

	return (
		<div>
			<div className="my-3 d-flex justify-content-end">
				<Link className="btn btn-outline-secondary" to={{ pathname: `/board/answer/${board.boardno}` }} state={{ parentBbs: parentBbs }}>
					<i className="fas fa-pen"></i> 답글쓰기
				</Link> &nbsp;

				{
					/* 자신이 작성한 게시글인 경우에만 수정 삭제 가능 */
					(localStorage.getItem("memId") === board.memId) ? (
						<>
							<Link className="btn btn-outline-secondary" to={{ pathname: `/board/update/${board.boardno}` }} state={{ board: updateBoard }}>
								<i className="fas fa-edit"></i> 수정
							</Link> &nbsp;
							<button className="btn btn-outline-danger" onClick={deleteBoard}>
								<i className="fas fa-trash-alt"></i> 삭제
							</button>
						</>
					) : null
				}
			</div>

			<table className="table table-striped">
				<tbody>
					<tr>
						<th className="col-3">작성자</th>
						<td>
							<span>{board.memId}</span>
						</td>
					</tr>

					<tr>
						<th>제목</th>
						<td>
							<span>{board.title}</span>
						</td>
					</tr>

					<tr>
						<th>작성일</th>
						<td>
							<span>{formatDate(board.created)}</span> {/* 날짜 포맷 변환 함수 */}
						</td>
					</tr>

					<tr>
						<th>조회수</th>
						<td>
							<span>{board.hitcount}</span>
						</td>
					</tr>

					<tr>
						<th>내용</th>
						<td>
							<pre>{board.content}</pre>
						</td>
					</tr>
				</tbody>
			</table>

			<div className="my-3 d-flex justify-content-center">
				<Link className="btn btn-outline-secondary" to="/board/list">
					<i className="fas fa-list"></i> 글목록
				</Link>
			</div><br/><br/>

			{/* 댓글 작성 컴포넌트 */}
			{
				localStorage.getItem("memId") ? // 로그인한 사용자만 댓글 작성 가능
					<CommentWrite boardno={boardno}/>
				:
					null
			}			

			{/* 댓글 리스트 컴포넌트 */}
			<CommentList boardno={boardno}/>
            
		</div>
	);
}

export default BbsDetail;