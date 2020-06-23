const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//before every test I will delete the database
const dropCollection = async (collectionName) => {
  try {
    await mongoose.connection.collection(collectionName).drop();
  } catch (err) {
    // if we can't find the collection catch block will catch err.code 26
    if (err.code === 26) {
      console.log('namespace %s not found', collectionName); // it's no problem, so don't throw an error
    } else {
      throw new Error(err);
    }
  }
};

module.exports = {
  connect,
  disconnect,
  dropCollection,
};
