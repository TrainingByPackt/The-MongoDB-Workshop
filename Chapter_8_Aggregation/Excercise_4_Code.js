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

//// TOPIC D: Getting the most from your aggregations
// Excercise: Getting the most from your aggregations
var findAwardWinningDocumentaries = function() {
    print("Finding award winning documentary Movies...");
    var pipeline = [
        { $match: {
            "awards.wins": { $gte: 1},
            genres: {$in: ["Documentary"]},
        }},
        { $sort:  {"awards.wins": -1}}, // Sort by award wins.
        { $limit: 3},
        { $project: { title: 1, genres: 1, awards: 1}},
    ];
    
    var options ={
        maxTimeMS: 30000,
        allowDiskUse: true,
        comment: "Find Award Winning Documentary Films"
    }
    db.movies.aggregate(pipeline, options).forEach(printjson);
}
findAwardWinningDocumentaries();




