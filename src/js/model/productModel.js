export const productFetch = async () => {
  try {
    const res = await fetch("products location");
    if (!res.ok) throw new Error("No response from json file");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    throw err;
  }
};
