import { Router } from 'express';
const router = Router();
import conn from '../mariadb.js';
import { body, param, query, validationResult } from 'express-validator';

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty()) {
		return next();
	} else {
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

router
	.route('/')
	// 채널생성
	.post(
		[
			body('user_id')
				.notEmpty()
				.isInt()
				.withMessage('아이디는 비어있지 않은 숫자로 입력하셔야 합니다.'),
			body('channelTitle')
				.notEmpty()
				.isString()
				.withMessage('채널명은 비어있지 않는 문자로 입력하셔야 합니다.'),
			validation,
		],
		async (req, res, next) => {
			const { user_id, channelTitle } = req.body;

			const [idCheck] = await conn.query(
				`SELECT * FROM users WHERE id='${user_id}'`
			);
			const [dupleChannelTitle] = await conn.query(
				`SELECT * FROM channels WHERE name='${channelTitle}'`
			);

			if (idCheck.length > 0) {
				if (dupleChannelTitle.length > 0) {
					return res.status(409).json({
						message: `${channelTitle} 이미 사용중인 채널명입니다.`,
					});
				}
				await conn.query(
					`INSERT INTO channels(name, user_id) VALUES ('${channelTitle}', '${user_id}')`
				);
				res.status(201).json({
					message: `${user_id}님 ${channelTitle}채널을 응원합니다.`,
				});
			} else if (idCheck.length === 0) {
				return res.status(404).json({
					message: `${user_id}는 찾을 수 없는 아이디입니다.`,
				});
			}
		}
	)
	// 채널전체조회
	.get(
		[
			body('user_id')
				.notEmpty()
				.isInt()
				.withMessage('아이디는 비어있지 않은 숫자로 입력하셔야 합니다.'),
			validation,
		],
		async (req, res, next) => {
			const { user_id } = req.body;
			const [userIdCheck] = await conn.query(
				`SELECT * FROM users WHERE id='${user_id}'`
			);
			const [channelIdCheck] = await conn.query(
				`SELECT * FROM channels WHERE user_id='${user_id}'`
			);

			if (userIdCheck.length === 0) {
				return res.status(404).json({
					message: `존재하지 않는 아이디입니다.`,
				});
			} else {
				if (channelIdCheck.length > 0) {
					return res.status(200).json(channelIdCheck.map((list) => list));
				} else {
					return res.status(404).json({
						message: `${user_id}님의 조회할 채널이 없습니다.`,
					});
				}
			}
		}
	);

router
	.route('/:id')
	// 채널개별수정
	.put(
		[
			body('channelTitle')
				.notEmpty()
				.isString()
				.withMessage('채널명은 비어있지 않는 문자로 입력하셔야 합니다.'),
			body('newTitle')
				.notEmpty()
				.isString()
				.withMessage('채널명은 비어있지 않는 문자로 입력하셔야 합니다.'),
			param('id')
				.notEmpty()
				.isInt()
				.withMessage('아이디는 숫자로 입력하셔야 합니다.'),
			validation,
		],
		async (req, res, next) => {
			const { channelTitle, newTitle } = req.body;
			const { id } = req.params;
			const [userIdCheck] = await conn.query(
				`SELECT * FROM users WHERE id='${id}'`
			);

			const [id_titleCheck] = await conn.query(
				`SELECT * FROM channels
			WHERE user_id = '${id}'
			AND name = '${channelTitle}'`
			);
			const [dupleChannelTitle] = await conn.query(
				`SELECT * FROM channels WHERE name='${newTitle}'`
			);

			if (userIdCheck.length === 0) {
				return res.status(404).json({
					message: `존재하지 않는 아이디입니다.`,
				});
			}
			if (id_titleCheck.length === 0) {
				return res.status(404).json({
					message: `변경할 채널명이 존재하지 않습니다.`,
				});
			} else if (dupleChannelTitle.length > 0) {
				return res.status(404).json({
					message: `${newTitle} 이미 사용중인 채널명입니다.`,
				});
			} else {
				await conn.query(
					`UPDATE channels SET name='${newTitle}' WHERE name='${channelTitle}' AND user_id='${id}'`
				);
				return res.status(200).json({
					message: `${id}님의 ${channelTitle}에서 ${newTitle}(으)로 성공적으로 수정되었습니다.`,
				});
			}
		}
	)
	// 채널개별삭제
	.delete(
		[
			body('channelTitle')
				.notEmpty()
				.isString()
				.withMessage('채널명은 비어있지 않는 문자로 입력하셔야 합니다.'),
			param('id')
				.notEmpty()
				.isInt()
				.withMessage('아이디는 숫자로 입력하셔야 합니다.'),
			validation,
		],
		async (req, res, next) => {
			const { channelTitle } = req.body;
			const { id } = req.params;
			const [userIdCheck] = await conn.query(
				`SELECT * FROM users WHERE id='${id}'`
			);
			const [titleCheck] = await conn.query(
				`SELECT * FROM channels WHERE user_id='${id}' AND name='${channelTitle}' `
			);

			if (userIdCheck.length === 0) {
				return res.status(404).json({
					message: `존재하지 않는 아이디입니다.`,
				});
			}
			if (titleCheck.length > 0) {
				await conn.query(`DELETE FROM channels WHERE user_id='${id}'`);
				return res.status(200).json({
					message: `${id}님의 ${channelTitle}채널이 삭제되었습니다.`,
				});
			} else {
				return res.status(404).json({
					message: `${id}님의 채널이 없습니다.`,
				});
			}
		}
	)
	// 채널개별조회
	.get(
		[
			param('id')
				.notEmpty()
				.isInt()
				.withMessage('아이디는 숫자로 입력하셔야 합니다.'),
			validation,
		],
		async (req, res, next) => {
			const { id } = req.params;
			const [userIdCheck] = await conn.query(
				`SELECT * FROM users WHERE id='${id}'`
			);
			const [channelIdCheck] = await conn.query(
				`SELECT * FROM channels WHERE user_id='${id}'`
			);

			if (userIdCheck.length === 0) {
				return res.status(404).json({
					message: `존재하지 않는 아이디입니다.`,
				});
			}
			if (channelIdCheck.length > 0) {
				return res.status(200).json(channelIdCheck);
			} else {
				return res.status(400).json({
					message: `${id}님의 채널이 존재하지않습니다.`,
				});
			}
		}
	);

export default router;
