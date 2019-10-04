/*
* Michael Harrison.
* 04/10/2019
*
* Packt MongoDB For Begginers.
* Chapter 8
*/

// Excercise code for Packt MongoDB For Begginers.
// This code can be run directly against the MongoDB Shell in interactive mode, or
// Can be run as a file like below:
// mongo "mongodb+srv://myAtlasCluster-fawxo.gcp.mongodb.net/sample_mflix" --username $USERNAME --password $PASSWORD .\Excercise_3_Code.js

//// TOPIC C: Working with large data sets.
// Excercise: Working with large data sets.
var findMostCommentedMovies = function() {
    print("Finding the most commented on movies.");
    var pipeline = [
             { $sample: {size: 5000}}, 
             { $group: {
                 _id: "$movie_id",
                 "sumComments": { $sum: 1}
             }},
             { $sort: { "sumComments": -1}},
             { $limit: 5},
             { $lookup: {
                 from: "movies",
                 localField: "_id",
                 foreignField: "_id",
                 as: "movie"
             }},
             { $unwind: "$movie" },
             { $project: {
                 "movie.title": 1,
                 "movie.imdb.rating": 1,
                 "sumComments": 1,
             }},
             { $merge: {
                 into: "most_commented_movies",
                 on: "_id",
                 whenMatched: "replace",
                 whenNotMatched: "insert"
             }}
    ];
    db.comments.aggregate(pipeline).forEach(printjson);
}
findMostCommentedMovies();
