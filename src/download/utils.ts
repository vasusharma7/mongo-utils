interface document {
  [key: string]: string | number | boolean | null | document | Array<document>;
}
type documents = Array<document>;

const preprocessRecords = (records: documents): documents => {
  if (records.length === 0) return [];
  const modifiedRecords: documents = [];
  const keys: Array<string> = Object.keys(records[0]).filter(
    (key: string): boolean => typeof records[0][key] === "object",
  );
  records.forEach((record: document) => {
    keys.forEach((key: string): void => {
      try {
        record[key] = JSON.stringify(record[key]);
      } catch (err) {
        console.log(err.message);
      }
    });
    modifiedRecords.push(record);
  });
  return modifiedRecords;
};
export default { preprocessRecords };
