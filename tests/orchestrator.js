import retry from "async-retry";
async function waitForAllServices() {
  await awaitForWebServer();

  async function awaitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
<<<<<<< HEAD
=======
      maxTimeout: 1000,
>>>>>>> 0a637452adfaab2f32dafe63533854d5ae90b725
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
<<<<<<< HEAD
      const responseBody = await response.json();
=======
      if (response.status === 200) {
        return;
      } else {
        throw new Error("Web server not ready yet");
      }
>>>>>>> 0a637452adfaab2f32dafe63533854d5ae90b725
    }
  }
}
export default {
  waitForAllServices,
};
