const express = require('express');
const app = express();
app.listen(7777);
app.use(express.json());

const users = [];

// obj length check
const isExist = (obj) => {
	const objLength = Object.keys(obj).length;
	if (objLength > 0) {
		return true;
	} else {
		return false;
	}
};

// userCheck
const idCheck = (obj, id, channelTitle) => {
	let userSearch = {};
	obj.map((user, idx) => {
		channelTitle && user.channelTitle === channelTitle ? (userSearch = 3) : '';
		if (user.channelTitle === id) {
			return (userSearch = { idx, ...user });
		}
	});
	return userSearch;
};

app
	.route('/channels')
	// 채널생성
	.post((req, res) => {
		const { channelTitle } = req.body;
		const key = users.filter((user) => user.channelTitle === channelTitle);
		if (isExist(req.body)) {
			if (key.length > 0) {
				res.status(409).json({
					message: `${channelTitle}은 이미 있는 채널명입니다.`,
				});
			} else {
				users.push({ channelTitle });
				res.status(201).json({
					message: `${channelTitle}님 채널을 응원합니다.`,
				});
			}
		} else {
			res.status(400).json({
				message: `채널명을 올바르게 입력하세요.`,
			});
		}
	})
	// 채널전체조회
	.get((req, res) => {
		let usersCheck = {};
		users.map((user, idx) => {
			usersCheck[idx] = { ...user };
		});
		const usersLength = Object.keys(usersCheck).length;
		if (usersLength > 0) {
			res.status(200).json(usersCheck);
		} else {
			res.status(500).json({
				message: `채널이 하나도 존재하지 않습니다.`,
			});
		}
	});

app
	.route('/channels/:id')
	// 채널개별수정
	.put((req, res) => {
		const { id } = req.params;
		const { channelTitle } = req.body;
		const userCheck = idCheck(users, id, channelTitle);
		const userCheckLength = Object.keys(userCheck).length;

		if (userCheckLength > 0) {
			users[userCheck.idx].channelTitle = channelTitle;
			res.status(200).json({
				message: `${id}님의 채널명이 ${channelTitle}로 성공적으로 수정되었습니다.`,
			});
		} else if (userCheck == 3) {
			res.status(404).json({
				message: `${channelTitle}는 이미 있는 채널명입니다.`,
			});
		} else {
			res.status(404).json({
				message: `${id}는 없는 채널명입니다.`,
			});
		}
	})
	// 채널개별삭제
	.delete((req, res) => {
		const { id } = req.params;
		const userCheck = idCheck(users, id);
		const userCheckLength = Object.keys(userCheck).length;

		if (userCheckLength > 0) {
			users.splice(userCheck.idx, 1);
			res.status(200).json({
				message: `${id}님의 채널이 삭제되었습니다.`,
			});
		} else {
			res.status(404).json({
				message: `${id}님의 채널이 존재하지않습니다.`,
			});
		}
	})
	// 채널개별조회
	.get((req, res) => {
		const { id } = req.params;
		const userCheck = idCheck(users, id);
		const userCheckLength = Object.keys(userCheck).length;

		if (userCheckLength > 0) {
			res.status(200).json(userCheck);
		} else {
			res.status(400).json({
				message: `${id}는 존재하지 않는 채널입니다.`,
			});
		}
	});
