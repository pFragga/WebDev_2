/* this file is for functions that are shared between html pages */

/**
 * Sends an HTTP request to the provided URL and receives the data in JSON
 * format. All other operations on that data can be abstracted into the
 * callback function.
 */
async function fetchData(url, callback) {
  let myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');

  let response = await fetch(
    url,
    {
      method: 'GET',
      headers: myHeaders
    }
  );
  let data = await response.json();
  callback(data);
}
