// Get the client
// import mysql from 'mysql2/promise';
import { createConnection } from 'mysql2';

// Create the connection to database
const connection = createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	database: 'Youtube',
	dateStrings: true,
});

const db = connection.promise();

export default db;

// // A simple SELECT query
// try {
// 	const [results, fields] = await connection.query('SELECT * FROM users');

// 	results.map((list) => {
// 		const { id, email, name, create_at } = list;
// 		console.log(id);
// 		console.log(email);
// 		console.log(name);
// 		console.log(create_at);
// 	});
// } catch (err) {
// 	console.log(err);
// }
