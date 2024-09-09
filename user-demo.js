// express 모듈셋팅
const express = require('express');
const app = express();
app.listen(7777);
app.use(express.json());

const users = [];

// idCheck
const idCheck = (obj, id) => {
	let loginUser = {};
	obj.map((user, idx) => {
		if (user.id === id) {
			loginUser = { ...user, idx };
		}
	});
	return loginUser;
};

// pwdCheck
const pwdCheck = (obj, pwd, res) => {
	if (obj.pwd === pwd) {
		res.status(200).json({
			message: `${obj.id}님 환영합니다.`,
		});
	} else {
		res.status(400).json({
			message: `pw아이디나 비밀번호를 다시 확인해주세요.`,
		});
	}
};

// 로그인
app.post('/login', (req, res) => {
	const { id, pwd } = req.body;
	const loginUser = idCheck(users, id);
	const userCheck = Object.keys(loginUser);

	if (userCheck.length > 0) {
		pwdCheck(loginUser, pwd, res);
	} else {
		res.status(400).json({
			message: `id아이디나 비밀번호를 다시 확인해주세요.`,
		});
	}
});

// 회원가입
app.post('/join', (req, res) => {
	const { id, pwd, name } = req.body;
	const key = users.filter((user) => user.id === id);
	const bodyKeyCheck = Object.keys(req.body).length;
	if (bodyKeyCheck > 0) {
		if (key.length === 0) {
			users.push({ id, pwd, name });
			res.status(201).json({
				message: `${id}님 가입을 환영합니다.`,
			});
		} else {
			res.status(409).json({
				message: `이미 존재하는 아이디입니다.`,
			});
		}
	} else {
		res.status(400).json({
			message: `입력 값을 다시 확인해주세요.`,
		});
	}
});

// route 맛보기
app
	.route('/users/:id')
	// 회원개별조회
	.get((req, res) => {
		const { id } = req.params;
		if (users.length === 0) {
			res.status(500).json({
				message: `회원이 존재하지 않습니다.`,
			});
			return;
		}
		const loginUser = idCheck(users, id);
		const userCheck = Object.keys(loginUser);
		if (userCheck.length > 0) {
			res.status(200).json({ id: loginUser.id, name: loginUser.name });
		} else {
			res.status(404).json({
				message: `존재하지 않는 계정입니다.`,
			});
		}
	})
	// 회원개별탈퇴
	.delete((req, res) => {
		const { id } = req.params;
		const loginUser = idCheck(users, id);
		const userCheck = Object.keys(loginUser);

		if (userCheck.length > 0) {
			users.splice(loginUser.idx, 1);
			res.status(200).json({
				message: `${id}님의 계정이 탈퇴되었습니다.`,
			});
		} else {
			res.status(404).json({
				message: `존재하지 않는 계정입니다.`,
			});
		}
	});
