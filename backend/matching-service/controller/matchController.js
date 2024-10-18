// Author(s): Calista, Xiu Jia, Xue Ling
const db = require("../config/firebase");
const matchCollection = db.collection("matches");

/**
 * POST /add
 *
 * Creates match and stores in firebase
 *
 * Responses:
 * - 500: Server error if something goes wrong while fetching data.
 */
const createMatch = async (user1, user2, category, complexity) => {
  try {
    const matchJson = {
      user1: user1,
      user2: user2,
      category: category,
      complexity: complexity,
      datetime: new Date().toLocaleString("en-SG")
    };

    const response = await matchCollection.doc().set(matchJson);
  
    return { status: 200, msg: "Match created successfully", response };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

module.exports = {
  createMatch
};