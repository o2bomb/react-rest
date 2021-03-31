import axios from "redaxios";

async function fetcher<T> (
  url: string
): Promise<T> {
  const res = await axios.get(url);
  return res.data;
}

export default fetcher;