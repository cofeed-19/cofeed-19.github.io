import { TableSchema } from "../constants";

export async function createIndexedTable(
  db: IDBDatabase,
  tableSchema: TableSchema
) {
  const objectStore = db.createObjectStore(tableSchema.Name, {
    keyPath: "ID",
    autoIncrement: true,
  });

  const fieldNames = Object.values(tableSchema).splice(1) as string[];

  fieldNames.forEach((fieldName) => {
    objectStore.createIndex(fieldName, fieldName, { unique: false });
  });
}

export async function createTable(db: IDBDatabase, tableSchema: TableSchema) {
  db.createObjectStore(tableSchema.Name, { keyPath: tableSchema.Key });
}

export async function insert(
  db: IDBDatabase,
  tableName: string,
  values: object[]
) {
  const transaction = db.transaction(tableName, "readwrite");
  const objectStore = transaction.objectStore(tableName);

  values.forEach(async (value) => await objectStore.add(value));
}

export async function getOne(db: IDBDatabase, tableName: string, key: string) {
  return new Promise((resolve) => {
    const transaction = db.transaction([tableName], "readonly");
    const objectStore = transaction.objectStore(tableName);

    const getRequest = objectStore.get(key);
    getRequest.onsuccess = () => resolve(getRequest.result);
  });
}

export async function getAll(db: IDBDatabase, tableName: string) {
  var result = await new Promise((resolve) => {
    const transaction = db.transaction([tableName], "readonly");
    const objectStore = transaction.objectStore(tableName);

    var getRequest = objectStore.getAll();
    getRequest.onsuccess = () => resolve(getRequest.result);
  });

  return result;
}

export async function deleteByName(
  db: IDBDatabase,
  tableName: string,
  fieldName: string
) {
  const transaction = db.transaction(tableName, "readwrite");
  const objectStore = transaction.objectStore(tableName);
  const result = await objectStore.get(fieldName);
  if (!result) {
    console.log("ID not found", fieldName);
    return;
  }
  await objectStore.delete(fieldName);
}

export async function update(
  db: IDBDatabase,
  tableName: string,
  value: object
) {
  const transaction = db.transaction(tableName, "readwrite");
  const objectStore = transaction.objectStore(tableName);

  await objectStore.put(value);
}
