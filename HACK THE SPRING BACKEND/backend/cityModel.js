const mongoose = require("mongoose");

// Define the city schema
const citySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique:true
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});


const city = mongoose.model('City', citySchema);
module.exports = city;

// // Define City model
// const City = mongoose.model("City", citySchema);

// // List of all cities in Gujarat (you need to have this data)
// const gujaratCities = [
//   { city: "Ahmedabad" },
//   { city: "Surat" },
//   { city: "Vadodara" },
//   { city: "Rajkot" },
//   { city: "Junagadh" },
//   { city: "Bhavnagar" },
//   { city: "Jamnagar" },
//   { city: "Anand" },
//   { city: "Mehsana" },
//   { city: "Bharuch" },
//   { city: "Navsari" },
//   { city: "Morbi" },
//   { city: "Porbandar" },
//   { city: "Nadiad" },
//   { city: "Gandhidham" },
// ];

// // Connect to MongoDB
// mongoose
//   .connect(
//     "mongodb+srv://testuser:0QpsAQRgpJkIJfL3@cluster0.jyiybpf.mongodb.net/"
//   )
//   .then(async () => {
//     console.log("Connected to MongoDB");

//     try {
//       // Save all cities of Gujarat to MongoDB
//       await City.insertMany(gujaratCities);

//       console.log("All cities of Gujarat saved to MongoDB");
//     } catch (error) {
//       console.error("Error saving all cities of Gujarat:", error.message);
//     }
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error.message);
//   });
