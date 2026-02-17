export async function V2_migration() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Second Migration");
}
