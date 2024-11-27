import retry from "async-retry";
async function waitForAllServices() {
  await awaitForWebServer();

  async function awaitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,

      maxTimeout: 1000,

      maxTimeout: 1000,

    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      const responseBody = await response.json();

      if (response.status === 200) {
        return;
      } else {
        throw new Error("Web server not ready yet");
      }

    }
  }
}
export default {
  waitForAllServices,
};
