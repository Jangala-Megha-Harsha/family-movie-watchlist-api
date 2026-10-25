
import { Router } from "express";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const watchlist = getWatchlist(req.params.userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = addMovie(req.params.userId, req.body || {});

  if (!movie) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    req.params.userId,
    Number(req.params.movieId),
    req.body || {}
  );

  if (!movie) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  return res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const deleted = deleteMovie(
    req.params.userId,
    Number(req.params.movieId)
  );

  if (!deleted) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  return res.status(200).json({ message: "Movie deleted successfully" });
});

export default router;
