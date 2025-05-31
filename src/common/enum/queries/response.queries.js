export const responseQueries = {
  success: ({ message = "Sucess", status = 200, data = null }) => ({
    status: status,
    success: true,
    error: false,
    message,
    data
  }),
  error: ({ message = "Err", status = 500, data = null }) => ({
    status: status,
    success: false,
    error: true,
    message,
    data
  })
};