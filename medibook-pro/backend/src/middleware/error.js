export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err?.code === 11000) {
    return res.status(409).json({ message: "A record with those details already exists." });
  }

  if (err?.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors).map((e) => e.message).join(", ")
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong on the server"
  });
}
