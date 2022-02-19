export async function V2_migration(db: IDBDatabase) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Second Migration");
}
