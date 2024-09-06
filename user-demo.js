// express 모듈셋팅
const express = require('express');
const app = express();
app.listen(7777);
app.use(express.json());

const users = [];

// 로그인
app.post('/login', (req, res) => {
	const { id, pwd } = req.body;
	users.map((user) => {
		if (user.id === id) {
			if (user.pwd === pwd) {
				res.json({
					message: `${id}님 환영합니다.`,
				});
			} else {
				res.status(400).json({
					message: `아이디나 비밀번호를 다시 확인해주세요.`,
				});
			}
		} else {
			res.status(400).json({
				message: `아이디나 비밀번호를 다시 확인해주세요.`,
			});
		}
	});
});

// 회원가입
app.post('/join', (req, res) => {
	const { id, pwd, name } = req.body;
	const key = users.filter((user) => user.id === id);
	if (key.length === 0) {
		users.push({ id, pwd, name });
		res.json({
			message: `${id}님 가입을 환영합니다.`,
		});
	} else {
		res.json({
			message: `이미 존재하는 아이디입니다.`,
		});
	}
});

// 회원개별조회
app.get('/users/:id', (req, res) => {
	const { id } = req.params;
	if (users.length === 0) {
		res.json({
			message: `존재하지 않는 계정입니다.`,
		});
		return;
	}
	users.map((user) => {
		if (user.id === id) {
			res.json({ id: user.id, name: user.name });
		} else {
			res.json({
				message: `존재하지 않는 계정입니다.`,
			});
		}
	});
});

// 회원개별탈퇴
app.delete('/users/:id', (req, res) => {
	const { id } = req.params;
	users.map((user, idx) => {
		if (user.id === id) {
			users.splice(idx, 1);
			res.json({
				message: `${id}님의 계정이 탈퇴되었습니다.`,
			});
		}
		console.log(users);
	});
	res.json({
		message: `존재하지 않는 계정입니다.`,
	});
});
