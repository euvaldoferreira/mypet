const { exec } = require("node:child_process");
function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write("🔴");
      checkPostgres();
      return;
    }
    process.stdout.write("🟢");
    console.log("\n👌 Postgres está pronto!\n");
    process.exit(0);
  }
}
process.stdout.write("\n\n🤞 Aguardando conexão com o Postgres ");
checkPostgres();
