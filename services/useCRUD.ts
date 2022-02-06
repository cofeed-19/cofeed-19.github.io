export const useCRUD = () => {

    async function createTable(db: any, tableName: string, fieldNames: string[] = []) {
        
        const objectStore = db.createObjectStore(tableName, {keyPath: "ID", autoIncrement: true });

        fieldNames.forEach( fieldName => {
            objectStore.createIndex(fieldName, fieldName, { unique: false })
        })

    }

    async function insertValues(db: any, tableName: string, values: object[]) {

        const transaction = db.transaction(tableName, 'readwrite');        
        const objectStore = transaction.objectStore(tableName);

        values.forEach(async value => await objectStore.add(value));
    }

    async function getValueByColumnName(db: any, tableName: string, fieldNameToSearch: string, value: string) {

        var result = await new Promise(resolve => {
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);

            var myIndex = objectStore.index(fieldNameToSearch);
            var getRequest = myIndex.get(value);
            getRequest.onsuccess = () => resolve(getRequest.result);
          });

          return result;
    } 
    // async function getValue(db: any, tableName: string, id: number){

    //     const tx = db.transaction(tableName, 'readonly');
    //     const store = tx.objectStore(tableName);
    //     const result = await store.get(id);
    //     // console.log('Get Data ', JSON.stringify(result));
    //     return result;
    // }
    
    // async function getAllValue(tableName: string) {
    //     const tx = db.transaction(tableName, 'readonly');
    //     const store = tx.objectStore(tableName);
    //     const result = await store.getAll();
    //     console.log('Get All Data', JSON.stringify(result));
    //     return result;
    // }

    // async function deleteValue(tableName: string, id: number) {
    //     const tx = db.transaction(tableName, 'readwrite');
    //     const store = tx.objectStore(tableName);
    //     const result = await store.get(id);
    //     if (!result) {
    //         console.log('Id not found', id);
    //         return result;
    //     }
    //     await store.delete(id);
    //     console.log('Deleted Data', id);
    //     return id;
    // }


    return {
        createTable,
        insertValues,
        // putValue,
        getValueByColumnName,
        // getAllValue,
        // deleteValue
    }
}