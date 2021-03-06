/*
 * Michael Harrison.
 * 08/12/2019
 *
 * Packt The MongoDB Workshop
 * Chapter 7
 */

// Exercise code for Packt MongoDB For Begginers.
// This code can be run using NodeJS, make sure you have the MongoDB node driver installed with NPM before running.

//// TOPIC D: "Advanced Queries with the Driver."
// Exercise 4: Advanced Queries with the NodeJS Driver.
const MongoClient = require('mongodb').MongoClient;
const url =
  'mongodb+srv://user:password@server-abcde.gcp.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(url);
const databaseName = 'sample_mflix';
const collectionName = 'chapter7_exercise4';

const updateName = function (client, database, oldName, newName) {
  database
    .collection(collectionName)
    .updateOne({ name: oldName }, { $set: { name: newName } }, function (
      err,
      result
    ) {
      if (err) {
        console.log('Error updating');
        console.log(err);
        client.close();
        return false;
      }
      console.log('Updated documents #:');
      console.log(result.modifiedCount);
      client.close();
    });
};

// Open the connection using the .connect function.
client.connect(function (err) {
  if (err) {
    console.log('Failed to connect.');
    console.log(err);
    return false;
  }

  // Within the connection block, add a console.log to confirm the connection
  console.log('Connected to MongoDB with NodeJS!');

  const database = client.db(databaseName);
  if (!database) {
    console.log('Database object doesnt exist!');
    return false;
  }

  updateName(client, database, 'Ned Stark', 'Greg Stark');
  updateName(client, database, 'Robb Stark', 'Bob Stark');
  updateName(client, database, 'Bran Stark', 'Brad Stark');
});
