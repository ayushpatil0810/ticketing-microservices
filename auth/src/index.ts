import express from "express";

const app = express();
app.use(express.json());

app.get("/api/users/currentuser", (req, res) => {
  res.status(200).send("Auth service is healthy");
});

app.listen(3000, () => {
  console.log("Auth service is running on port 3000");
});
