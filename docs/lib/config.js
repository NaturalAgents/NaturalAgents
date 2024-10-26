const prefix =
  process.env.NODE_ENV !== "production"
    ? ""
    : process.env.NEXT_PUBLIC_BASE_PATH;
export default prefix;
