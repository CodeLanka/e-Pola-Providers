/**
 * Returns error API response JSON or ERROR
 */
// eslint-disable-next-line no-undef
const fetcher = (...args) => fetch(...args).then((response) => response.json())
export default fetcher
