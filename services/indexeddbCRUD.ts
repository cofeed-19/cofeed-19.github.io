export const indexeddbCRUD = () => {

    async function createIndexedTable(db: IDBDatabase, tableEnum: any) {        

        const objectStore = db.createObjectStore(tableEnum.Name, {keyPath: "ID", autoIncrement: true });

        const fieldNames = Object.values(tableEnum).splice(1) as string[];

        fieldNames.forEach( fieldName => {
            objectStore.createIndex(fieldName, fieldName, { unique: false })
        })

    }

    async function createTable(db: IDBDatabase, tableEnum: any) {        

        db.createObjectStore(tableEnum.Name, {keyPath: Object.keys(tableEnum)[1]});

    }

    async function insert(db: IDBDatabase, tableName: string, values: object[]) {

        const transaction = db.transaction(tableName, 'readwrite');        
        const objectStore = transaction.objectStore(tableName);

        values.forEach(async value => await objectStore.add(value));
    }

    async function getByColumnName(db: IDBDatabase, tableName: string, fieldNameToSearch: string, value: any) {

        var result = await new Promise(resolve => {
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);

            var indexDb = objectStore.index(fieldNameToSearch);
            var getRequest = indexDb.get(value);
            getRequest.onsuccess = () => resolve(getRequest.result);
          });

          return result;
    } 

    async function getAll(db: IDBDatabase, tableName: string) {

        var result = await new Promise(resolve => {
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);

            var getRequest = objectStore.getAll();
            getRequest.onsuccess = () => resolve(getRequest.result);
          });

          return result;
    }    

    async function deleteByID(db: IDBDatabase, tableName: string, id: number) {
        const transaction = db.transaction(tableName, 'readwrite');
        const objectStore = transaction.objectStore(tableName);
        const result = await objectStore.get(id);
        if (!result) {
            console.log('ID not found', id);
        }
        await objectStore.delete(id);
    }


    async function update(db: IDBDatabase, tableName: string, value: object) {

        const transaction = db.transaction(tableName, 'readwrite');        
        const objectStore = transaction.objectStore(tableName);

        await objectStore.put(value)
    }

    return {
        createIndexedTable,
        createTable,
        insert,
        getByColumnName,
        getAll,
        update,
        deleteByID,
    }
}
