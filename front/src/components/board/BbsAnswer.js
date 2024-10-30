import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function BbsAnswer() {

	const { headers } = useContext(HttpHeadersContext);
	const navigate = useNavigate();

	const { parentno } = useParams(); // 부모 글 번호

	const location = useLocation();
	const { parentBbs } = location.state;

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const changeTitle = (event) => {
		setTitle(event.target.value);
	}

	const changeContent = (event) => {
		setContent(event.target.value);
	}


	const createBbsAnswer = async () => {

		const req = {
			memId: localStorage.getItem("memId"),
			title: title,
			content: content
		}
		
		await axios.post(`http://localhost:3000/board/${parentno}/answer`, req, {headers: headers})
		.then((resp) => {
			console.log("[BbsAnswer.js] createBbsAnswer() success :D");
			console.log(resp.data);

			alert("답글이 등록되었습니다.");
			navigate(`/board/${resp.data.boardno}`); // 새롭게 등록한 답글 상세로 이동
		})
		.catch((err) => {
			console.log("[BbsAnswer.js] createBbsAnswer() error :<");
			console.log(err);


		});

	}

	useEffect(() => {
		if (!localStorage.getItem("memId")) {
			alert("로그인 한 사용자만 게시글에 대한 답글을 작성할 수 있습니다.");
			navigate(-1);
		}
	}, []);

	const cancelWrite = () => {
		const confirmed = window.confirm("답글 작성을 취소하시겠습니까?");
    	if (!confirmed) return;
		navigate(`/board/${parentno}`);
	};

	return (
		<div>
			{/* 부모 게시글 정보 */}
			<table className="table table-striped">
				<tbody>
					<tr>
						<th className="col-3">작성자</th>
						<td>
							<span>{parentBbs.memId}</span>
						</td>
					</tr>

					<tr>
						<th>제목</th>
						<td>
							<span>{parentBbs.title}</span>
						</td>
					</tr>

					<tr>
						<th>내용</th>
						<td>
							<pre>{parentBbs.content}</pre>
						</td>
					</tr>
				</tbody>
			</table><br/><br/>
			{/* <table className="table">
				<tbody>
					<tr>
						<th className="table-primary">작성자</th>
						<td>
							<input type="text" className="form-control" value={parentBbs.memId} size="50px" readOnly />
						</td>
					</tr>

					<tr>
						<th className="table-primary">제목</th>
						<td>
							<input type="text" className="form-control" value={parentBbs.title} size="50px" readOnly />
						</td>
					</tr>

					<tr>
						<th className="table-primary">내용</th>
						<td>
							<input type="text" className="form-control" value={parentBbs.content} rows="10" readOnly />
						</td>
					</tr>
				</tbody>
			</table><br/><br/> */}
			
			{/* 답글 작성 */}
			<h3>📌 Reply</h3>
			<table className="table">
				<tbody>
					<tr>
						<th className="table-primary">작성자</th>
						<td>
							<input type="text" className="form-control"  value={localStorage.getItem("memId")} size="50px" readOnly />
						</td>
					</tr>

					<tr>
						<th className="table-primary">제목</th>
						<td>
							<input type="text" className="form-control" value={title} onChange={changeTitle} size="50px" />
						</td>
					</tr>

					<tr>
						<th className="table-primary">내용</th>
						<td>
							<textarea className="form-control" value={content} onChange={changeContent} rows="10"></textarea>
						</td>
					</tr>
				</tbody>
			</table>

			<div className="my-5 d-flex justify-content-center">
				<button className="btn btn-outline-secondary" onClick={createBbsAnswer}><i className="fas fa-pen"></i>등록하기</button>&nbsp;
				<button className="btn btn-outline-secondary" onClick={cancelWrite}><i className="fas fa-pen"></i> 취소하기</button>
			</div>
		</div>
	);
}

export default BbsAnswer;