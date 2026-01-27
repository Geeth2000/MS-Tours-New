export const apiResponse = ({
  success = true,
  message = "",
  data = null,
  meta = {},
} = {}) => ({
  success,
  message,
  data,
  meta,
});
