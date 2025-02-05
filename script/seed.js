'use strict';

const {
	db,
	models: { User, Poster },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
	await db.sync({ force: true }); // clears db and matches models to tables
	console.log('db synced!');

	// Creating Users
	const users = await Promise.all([
		User.create({ username: 'cody', password: '123' }),
		User.create({ username: 'murphy', password: '123' }),
	]);

	//Creating Posters
	const posters = await Promise.all([
		Poster.create({
			name: 'groomingbymoonlight',
			creator: 'carol merle',
			description: "It's a cat, it's a moon, what more would you want",
			price: 20.0,
		}),
    Poster.create({
			name: 'groomingbysunlight',
			creator: 'amber L',
			description: "It's a cat, it's a sun, what more would you want",
			price: 40.0,
		}),
	]);
	console.log(`seeded ${users.length} users`);
	console.log(`seeded successfully`);
	return {
		users: {
			cody: users[0],
			murphy: users[1],
		},
		posters: {
			groomingbymoonlight: posters[0],
		},
	};
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
	console.log('seeding...');
	try {
		await seed();
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	} finally {
		console.log('closing db connection');
		await db.close();
		console.log('db connection closed');
	}
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
	runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
