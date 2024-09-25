import { Router } from 'express';
const router = Router();
import conn from '../mariadb.js';
import { body, param, query, validationResult } from 'express-validator';

// JWT 모듈
import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

// dotenv 모듈
import { config } from 'dotenv';
config();

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty()) {
		return next();
	} else {
		console.log(err.array());

		const msg = err
			.array()
			.filter((n) => n.msg !== 'Invalid value')
			.map((n) => n.msg)
			.join('');

		return res
			.status(404)
			.json({ message: msg !== '' ? msg : '입력을 제대로 하셔야합니다.' });
	}
};

// 로그인
router.post(
	'/login',
	[body('email').notEmpty().isEmail(), body('password').notEmpty(), validation],
	async (req, res, next) => {
		const { email, password } = req.body;

		const [results] = await conn.query(
			`SELECT * FROM users WHERE email='${email}' AND password=${password}`
		);

		if (results.length > 0) {
			const [user_id] = await conn.query(
				`SELECT id FROM users WHERE email='${email}'`
			);
			const [id] = user_id;

			const token = sign(
				{
					email,
					user_id: id.id,
				},
				process.env.PRIVATE_KEY,
				{
					expiresIn: '5m',
					issuer: 'YouD',
				}
			);

			res.cookie('token', token, { httpOnly: true });

			res.status(200).json({
				message: `${email}님 환영합니다.`,
			});
		} else {
			res.status(403).json({
				message: `아이디나 비밀번호를 다시 확인해주세요.`,
			});
		}
	}
);

// 회원가입
router.post(
	'/join',
	[
		body('email').notEmpty().isEmail(),
		body('name').notEmpty(),
		body('password').notEmpty(),
		body('contact').notEmpty(),
		validation,
	],
	async (req, res, next) => {
		const { email, name, password, contact } = req.body;

		const [results] = await conn.query(
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
	}
);

router
	.route('/users')
	// 회원개별조회
	.get(
		[body('email').notEmpty().isEmail(), validation],
		async (req, res, next) => {
			const { email } = req.body;

			const [results] = await conn.query(
				`SELECT * FROM users WHERE email='${email}'`
			);

			if (results.length > 0) {
				res.status(200).json(results);
			} else {
				res.status(404).json({
					message: `존재하지 않는 계정입니다.`,
				});
			}
		}
	)
	// 회원개별탈퇴
	.delete(
		[
			body('email').notEmpty().isEmail(),
			body('password').notEmpty(),
			validation,
		],
		async (req, res, next) => {
			const { email, password } = req.body;

			const [results] = await conn.query(
				`SELECT * FROM users WHERE email='${email}' AND password=${password}`
			);
			const [user_id] = await conn.query(`
				SELECT id FROM users WHERE email='${email}'`);
			const [id] = user_id;

			if (results.length > 0) {
				await conn.query(`DELETE FROM channels WHERE user_id ='${id.id}'`);
				await conn.query(
					`DELETE FROM users WHERE email ='${email}' AND password = '${password}'`
				);

				res.status(200).json({
					message: `${email}님의 계정이 탈퇴되었습니다.`,
				});
			} else {
				res.status(404).json({
					message: `존재하지 않는 계정입니다.`,
				});
			}
		}
	);

export default router;
