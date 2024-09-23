import { Router } from 'express';
const router = Router();
import conn from '../mariadb.js';

// 로그인
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const [results, fields] = await conn.query(
		`SELECT * FROM users WHERE email='${email}' AND password=${password}`
	);

	if (results.length > 0) {
		res.status(200).json({
			message: `${email}님 환영합니다.`,
		});
	} else {
		res.status(400).json({
			message: `아이디나 비밀번호를 다시 확인해주세요.`,
		});
	}
});

// 회원가입
router.post('/join', async (req, res) => {
	const { email, name, password, contact } = req.body;

	const [results, fields] = await conn.query(
		`SELECT * FROM users WHERE email='${email}'`
	);
	if (results.length > 0) {
		res.status(404).json({
			message: `이미 있는 계정입니다.`,
		});
	} else {
		await conn.query(
			`INSERT INTO users(email, name, password, contact)
				VALUES( '${email}', '${name}', '${password}', '${contact}' )`
		);
		res.status(200).json({
			message: `${email}님 환영합니다.`,
		});
	}
});

router
	.route('/users')
	// 회원개별조회
	.get(async (req, res) => {
		const { email } = req.body;

		const [results, fields] = await conn.query(
			`SELECT * FROM users WHERE email='${email}'`
		);

		if (results.length > 0) {
			res.status(200).json(results);
		} else {
			res.status(404).json({
				message: `존재하지 않는 계정입니다.`,
			});
		}
	})
	// 회원개별탈퇴
	.delete(async (req, res) => {
		const { email, password } = req.body;

		const [results, fields] = await conn.query(
			`SELECT * FROM users WHERE email='${email}' AND password=${password}`
		);

		if (results.length > 0) {
			await conn.query(
				`DELETE FROM users WHERE email ='${email}' AND password = ${password}`
			);
			res.status(200).json({
				message: `${email}님의 계정이 탈퇴되었습니다.`,
			});
		} else {
			res.status(404).json({
				message: `존재하지 않는 계정입니다.`,
			});
		}
	});

export default router;
