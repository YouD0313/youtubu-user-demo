const express = require('express');
const router = express.Router();

const users = [];

// idCheck
const idCheck = (obj, userId) => {
	let loginUser = {};
	obj.map((user, idx) => {
		if (user.userId === userId) {
			loginUser = { ...user, idx };
		}
	});
	return loginUser;
};

// pwdCheck
const pwdCheck = (obj, userPw, res) => {
	if (obj.userPw === userPw) {
		res.status(200).json({
			message: `${obj.userId}님 환영합니다.`,
		});
	} else {
		res.status(400).json({
			message: `pw아이디나 비밀번호를 다시 확인해주세요.`,
		});
	}
};

// 로그인
router.post('/login', (req, res) => {
	const { userId, userPw } = req.body;
	const loginUser = idCheck(users, userId);
	const userCheck = Object.keys(loginUser);

	if (userCheck.length > 0) {
		pwdCheck(loginUser, userPw, res);
	} else {
		res.status(400).json({
			message: `id아이디나 비밀번호를 다시 확인해주세요.`,
		});
	}
});

// 회원가입
router.post('/join', (req, res) => {
	const { userId } = req.body;
	const bodyData = req.body;
	const key = users.filter((user) => user.userId === userId);
	const bodyKeyCheck = Object.keys(req.body).length;

	if (bodyKeyCheck > 0) {
		if (key.length === 0) {
			users.push(bodyData);
			res.status(201).json({
				message: `${userId}님 가입을 환영합니다.`,
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

router
	.route('/users')
	// 회원개별조회
	.get((req, res) => {
		const { userId } = req.body;

		if (users.length === 0) {
			res.status(500).json({
				message: `회원이 존재하지 않습니다.`,
			});
			return;
		}
		const loginUser = idCheck(users, userId);
		const userCheck = Object.keys(loginUser);

		if (userCheck.length > 0) {
			res.status(200).json({ userId: loginUser.userId, name: loginUser.name });
		} else {
			res.status(404).json({
				message: `존재하지 않는 계정입니다.`,
			});
		}
	})
	// 회원개별탈퇴
	.delete((req, res) => {
		const { userId } = req.body;
		const loginUser = idCheck(users, userId);
		const userCheck = Object.keys(loginUser);

		if (userCheck.length > 0) {
			users.splice(loginUser.idx, 1);
			res.status(200).json({
				message: `${userId}님의 계정이 탈퇴되었습니다.`,
			});
		} else {
			res.status(404).json({
				message: `존재하지 않는 계정입니다.`,
			});
		}
	});

module.exports = router;
