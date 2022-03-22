import journalApi from "@/api/journalApi";

// export const myAction = async ({commit}) => {

// }

export const loadEntries = async ({ commit }) => {
  const { data } = await journalApi.get("/entries.json");

  if (!data) {
    commit("setEntries", []);
    return;
  }

  const entries = [];
  for (const id of Object.keys(data)) {
    entries.push({
      id,
      ...data[id],
    });
  }
  commit("setEntries", entries);
};

export const updateEntry = async ({ commit }, entry) => {
  const { id, date, picture, text } = entry;

  await journalApi.put(`/entries/${id}.json`, { date, picture, text });

  commit("updateEntry", { ...entry });
};

export const createEntry = async ({ commit }, entry) => {
  const { date, picture, text } = entry;

  const { data } = await journalApi.post(`/entries.json`, {
    date,
    picture,
    text,
  });

  commit("addEntry", { ...entry, id: data.name });

  return data.name;
};

export const deleteEntry = async ({ commit }, id) => {
  await journalApi.delete(`/entries/${id}.json`);

  commit("removeEntry", id);
};
