import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function statusPage() {
  return (
    <>
      <ShowPage />
    </>
  );
}

function ShowPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 1000,
  });

  let UpdatedAtText = "Carregando...";
  let DatabaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    DatabaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }
  return (
    <>
      <h1>Página de Status</h1>
      <div>{UpdatedAtText}</div>
      <h2>Database</h2>
      <div>{DatabaseStatusInformation}</div>
    </>
  );
}
