

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const { initialiseDatabase } = require("./db/db.connect");
const Streak = require("./models/streaks.models");

app.use(express.json());
app.use(cors({ origin: "*" }));

initialiseDatabase();

async function createProductCard(newProducts) {
 try {
   const products = await Streak.insertMany(newProducts);
   console.log(products);
 } catch (error) {
   console.log("Error saving events:", error);
 }
}

app.get("/api/streaks", async (req, res) => {
 try {
   const streaks = await Streak.find();
   res.json(streaks);
 } catch (error) {
   res.status(500).json({ error: "Failed to fetch streaks" });
 }
});

app.get("/api/streaks/:id", async (req, res) => {
 try {
   const streak = await Streak.findById(req.params.id);
   if (!streak) {
     return res.status(404).json({ error: "Streak not found" });
   }
   res.json(streak);
 } catch (error) {
   res.status(500).json({ error: "Failed to fetch streak" });
 }
});

app.post("/api/streaks", async (req, res) => {
 try {
   const streaks = await Streak.insertMany(req.body);
   res.status(201).json(streaks);
 } catch (error) {
   console.error("Streak creation error:", error);
   res.status(500).json({
     error: "Failed to create streaks", 
     details: error.message
   });
 }
});

app.put("/api/streaks/:streakId", async (req, res) => {
 try {
   const updatedStreak = await Streak.findByIdAndUpdate(
     req.params.streakId,
     req.body,
     { new: true }
   );
   if (!updatedStreak) return res.status(404).json({ error: "Streak not found" });
   res.json(updatedStreak);
 } catch (error) {
   console.log(error);
   res.status(500).json({ error: "Failed to update streak" });
 }
});

app.delete("/api/streaks/:id", async (req, res) => {
 try {
   const deletedStreak = await Streak.findByIdAndDelete(req.params.id);
   if (!deletedStreak) {
     return res.status(404).json({ error: "Streak not found" });
   }
   res.json({ message: "Streak deleted successfully" });
 } catch (error) {
   res.status(500).json({ error: "Failed to delete streak" });
 }
});

app.get("/api/wakatime-stats", async (req, res) => {
 try {
   const response = await fetch(
     `https://wakatime.com/api/v1/users/current/summaries?start=today&end=today&api_key=${process.env.WAKATIME_API_KEY}`,
     {
       headers: {
         Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`
       }
     }
   );
   const data = await response.json();
   res.json(data);
 } catch (error) {
   console.error("Error:", error);
   res.status(500).json({ error: "Failed to fetch WakaTime data" });
 }
});

app.get("/api/wakatime-stats/last_7_days", async (req, res) => {
 try {
   const response = await fetch(
     `https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${process.env.WAKATIME_API_KEY}`,
     {
       headers: {
         Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`
       }
     }
   );
   const data = await response.json();
   res.json(data);
 } catch (error) {
   console.error("Error:", error);
   res.status(500).json({ error: "Failed to fetch WakaTime data" });
 }
});

app.get("/api/wakatime-stats/all_time", async (req, res) => {
 try {
   const response = await fetch(
     `https://wakatime.com/api/v1/users/current/all_time_since_today?api_key=${process.env.WAKATIME_API_KEY}`,
     {
       headers: {
         Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`
       }
     }
   );
   const data = await response.json();
   res.json(data);
 } catch (error) {
   console.error("Error:", error);
   res.status(500).json({ error: "Failed to fetch WakaTime data" });
 }
});

app.get("/api/wakatime-stats/monthly", async (req, res) => {
 try {
   const response = await fetch(
     `https://wakatime.com/api/v1/users/current/stats/last_30_days?api_key=${process.env.WAKATIME_API_KEY}`,
     {
       headers: {
         Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`
       }
     }
   );
   const data = await response.json();
   res.json(data);
 } catch (error) {
   console.error("Error:", error);
   res.status(500).json({ error: "Failed to fetch WakaTime data" });
 }
});

const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});