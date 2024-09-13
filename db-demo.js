// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'Youtube',
	dateStrings: true,
});

// A simple SELECT query
try {
	const [results, fields] = await connection.query('SELECT * FROM users');

	results.map((list) => {
		const { id, email, name, create_at } = list;
		console.log(id);
		console.log(email);
		console.log(name);
		console.log(create_at);
	});
} catch (err) {
	console.log(err);
}
