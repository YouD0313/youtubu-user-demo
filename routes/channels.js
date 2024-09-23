import { Router } from 'express';
const router = Router();
import conn from '../mariadb.js';

router
	.route('/')
	// 채널생성
	.post(async (req, res) => {
		const { user_id: id, channelTitle } = req.body;
		const user_id = parseInt(id);
		const [idCheck] = await conn.query(
			`SELECT * FROM users WHERE id='${user_id}'`
		);
		const [dupleChannelTitle] = await conn.query(
			`SELECT * FROM channels WHERE name='${channelTitle}'`
		);

		if (idCheck.length > 0) {
			await conn.query(
				`INSERT INTO channels(name, user_id) VALUES ('${channelTitle}', '${user_id}')`
			);
			res.status(201).json({
				message: `${user_id}님 ${channelTitle}채널을 응원합니다.`,
			});
		} else if (idCheck.length === 0) {
			return res.status(404).json({
				message: `${id}는 찾을 수 없는 아이디입니다.`,
			});
		}
		if (dupleChannelTitle.length > 0) {
			res.status(409).json({
				message: `${channelTitle}은 이미 있는 채널명입니다.`,
			});
		}
	})
	// 채널전체조회
	.get(async (req, res) => {
		const { user_id: id } = req.body;
		const user_id = parseInt(id);
		const [idCheck] = await conn.query(
			`SELECT * FROM channels WHERE user_id='${id}'`
		);

		if (!user_id) {
			return res.status(404).json({
				message: `${id}는 찾을 수 없는 아이디입니다.`,
			});
		}

		if (idCheck.length > 0) {
			res.status(200).json(idCheck.map((list) => list));
		} else {
			res.status(404).json({
				message: `조회할 채널이 없습니다.`,
			});
		}
	});

router
	.route('/:id')
	// 채널개별수정
	.put(async (req, res) => {
		const { channelTitle, newTitle } = req.body;
		const { id } = req.params;
		const user_id = parseInt(id);
		const [idCheck] = await conn.query(
			`SELECT * FROM channels
			WHERE user_id = '${id}'
			AND name = '${channelTitle}'`
		);
		const [dupleChannelTitle] = await conn.query(
			`SELECT * FROM channels WHERE name='${newTitle}'`
		);

		if (idCheck.length === 0) {
			return res.status(404).json({
				message: `${user_id}는 찾을 수 없는 아이디입니다.`,
			});
		} else if (dupleChannelTitle.length > 0) {
			return res.status(404).json({
				message: `${newTitle}는 이미 있는 채널명입니다.`,
			});
		} else if (idCheck.length > 0) {
			await conn.query(
				`UPDATE channels SET name='${newTitle}' WHERE user_id='${id}'`
			);
			res.status(200).json({
				message: `${user_id}님의 ${channelTitle}채널명이 ${newTitle}로 성공적으로 수정되었습니다.`,
			});
		}
	})
	// 채널개별삭제
	.delete(async (req, res) => {
		const { channelTitle } = req.body;
		const { id } = req.params;
		const user_id = parseInt(id);
		const [idCheck, fields] = await conn.query(
			`SELECT * FROM channels WHERE user_id='${id}' AND name='${channelTitle}' `
		);

		if (idCheck.length > 0) {
			await conn.query(`DELETE FROM channels WHERE user_id='${id}'`);
			res.status(200).json({
				message: `${user_id}님의 ${channelTitle}채널이 삭제되었습니다.`,
			});
		} else {
			res.status(404).json({
				message: `${user_id}님의 채널이 없습니다.`,
			});
		}
	})
	// 채널개별조회
	.get(async (req, res) => {
		const { id } = req.params;
		const user_id = parseInt(id);
		const [idCheck, fields] = await conn.query(
			`SELECT * FROM channels WHERE user_id='${id}'`
		);

		if (idCheck.length > 0) {
			res.status(200).json(idCheck);
		} else {
			res.status(400).json({
				message: `${user_id}는 존재하지 않는 아이디입니다.`,
			});
		}
	});

export default router;
