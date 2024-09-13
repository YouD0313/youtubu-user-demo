const express = require('express');
const router = express.Router();

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
const idCheck = (obj, userId, channelTitle) => {
	let userSearch = {};
	obj.map((user, idx) => {
		channelTitle && user.channelTitle === channelTitle
			? (userSearch = false)
			: '';
		if (user.channelTitle === userId) {
			return (userSearch = { idx, ...user });
		}
	});
	return userSearch;
};

router
	.route('/')
	// 채널생성
	.post((req, res) => {
		const { channelTitle } = req.body;
		const bodyData = req.body;

		const key = users.filter((user) => user.channelTitle === channelTitle);
		if (isExist(req.body)) {
			if (key.length > 0) {
				res.status(409).json({
					message: `${channelTitle}은 이미 있는 채널명입니다.`,
				});
			} else {
				users.push(bodyData);
				res.status(201).json({
					message: `${channelTitle}님 채널을 응원합니다.`,
				});
			}
		} else {
			res.status(404).json({
				message: `채널명을 올바르게 입력하세요.`,
			});
		}
	})
	// 채널전체조회
	.get((req, res) => {
		const { userId } = req.body;
		if (!userId) {
			res.status(404).json({
				message: `아이디로 조회가 가능합니다.`,
			});
			return;
		}
		let usersCheck = {};
		users.map((user, idx) => {
			if (user.userId === userId) {
				usersCheck[idx] = { ...user };
			}
		});
		const usersLength = Object.keys(usersCheck).length;
		if (usersLength > 0) {
			res.status(200).json(usersCheck);
		} else {
			res.status(404).json({
				message: `조회할 채널이 없습니다.`,
			});
		}
	});

router
	.route('/:id')
	// 채널개별수정
	.put((req, res) => {
		const { id: userId } = req.params;
		const { channelTitle } = req.body;
		const userCheck = idCheck(users, userId, channelTitle);
		const userCheckLength = Object.keys(userCheck).length;

		if (userCheckLength > 0) {
			users[userCheck.idx].channelTitle = channelTitle;
			res.status(200).json({
				message: `${userId}님의 채널명이 ${channelTitle}로 성공적으로 수정되었습니다.`,
			});
		} else if (userCheck === false) {
			res.status(404).json({
				message: `${channelTitle}는 이미 있는 채널명입니다.`,
			});
		} else {
			res.status(404).json({
				message: `${userId}는 없는 채널명입니다.`,
			});
		}
	})
	// 채널개별삭제
	.delete((req, res) => {
		const { id: userId } = req.params;
		const userCheck = idCheck(users, userId);
		const userCheckLength = Object.keys(userCheck).length;

		if (userCheckLength > 0) {
			users.splice(userCheck.idx, 1);
			res.status(200).json({
				message: `${userId}님의 채널이 삭제되었습니다.`,
			});
		} else {
			res.status(404).json({
				message: `${userId}님의 채널이 존재하지않습니다.`,
			});
		}
	})
	// 채널개별조회
	.get((req, res) => {
		const { id: userId } = req.params;
		const userCheck = idCheck(users, userId);
		const userCheckLength = Object.keys(userCheck).length;

		if (userCheckLength > 0) {
			res.status(200).json(userCheck);
		} else {
			res.status(400).json({
				message: `${userId}는 존재하지 않는 채널입니다.`,
			});
		}
	});

module.exports = router;
