export const useCRUD = () => {

    async function createTable(db: any, tableEnum: any) {
        

        const objectStore = db.createObjectStore(tableEnum.Name, {keyPath: "ID", autoIncrement: true });

        const fieldNames = Object.values(tableEnum).splice(1);

        fieldNames.forEach( fieldName => {
            objectStore.createIndex(fieldName, fieldName, { unique: false })
        })

    }

    async function insert(db: any, tableName: string, values: object[]) {

        const transaction = db.transaction(tableName, 'readwrite');        
        const objectStore = transaction.objectStore(tableName);

        values.forEach(async value => await objectStore.add(value));
    }

    async function getByColumnName(db: any, tableName: string, fieldNameToSearch: string, value: any) {

        var result = await new Promise(resolve => {
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);

            var indexDb = objectStore.index(fieldNameToSearch);
            var getRequest = indexDb.get(value);
            getRequest.onsuccess = () => resolve(getRequest.result);
          });

          return result;
    } 

    async function getAll(db: any, tableName: string) {

        var result = await new Promise(resolve => {
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);

            var getRequest = objectStore.getAll();
            getRequest.onsuccess = () => resolve(getRequest.result);
          });

          return result;
    }    

    async function deleteByID(db: any, tableName: string, id: number) {
        const transaction = db.transaction(tableName, 'readwrite');
        const objectStore = transaction.objectStore(tableName);
        const result = await objectStore.get(id);
        if (!result) {
            console.log('ID not found', id);
        }
        await objectStore.delete(id);
    }


    async function update(db: any, tableName: string, value: object) {

        const transaction = db.transaction(tableName, 'readwrite');        
        const objectStore = transaction.objectStore(tableName);

        await objectStore.put(value)
    }

    return {
        createTable,
        insert,
        getByColumnName,
        getAll,
        update,
        deleteByID,
    }
}