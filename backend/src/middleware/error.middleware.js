export const errorMiddleware = (err, req, res, next) => {
  const upstreamData = err.response?.data;
  const message =
    upstreamData?.message ||
    upstreamData?.error?.message ||
    (typeof upstreamData === "string" ? upstreamData : null) ||
    err.message ||
    "Internal server error";
  const statusCode = Number(err.response?.status);
  const status = statusCode >= 400 && statusCode < 600 ? statusCode : 500;

  console.error("Request failed:", { status });

  return res.status(status).json({
    success: false,
    message,
  });
};