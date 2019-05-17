const data = async () => {
  try {
    const result = await fetch('/api');
    const table = await result.json();
    return table;
  } catch (error) {
    console.error(error);
  }
};

module.export = data;
