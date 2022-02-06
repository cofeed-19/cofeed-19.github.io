export const useCRUD = () => {

    async function createTable(db: any, tableName: string, fieldNames: string[] = []) {
        
        const objectStore = db.createObjectStore(tableName, {keyPath: "ID", autoIncrement: true });

        fieldNames.forEach( fieldName => {
            objectStore.createIndex(fieldName, fieldName, { unique: false })
        })

    }

    async function insert(db: any, tableName: string, values: object[]) {

        const transaction = db.transaction(tableName, 'readwrite');        
        const objectStore = transaction.objectStore(tableName);

        values.forEach(async value => await objectStore.add(value));
    }

    async function getByColumnName(db: any, tableName: string, fieldNameToSearch: string, value: string) {

        var result = await new Promise(resolve => {
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);

            var myIndex = objectStore.index(fieldNameToSearch);
            var getRequest = myIndex.get(value);
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
        deleteByID,
        update
    }
}