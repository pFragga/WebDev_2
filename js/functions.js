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

/* we assume that the URL has id={category_id} as the last search parameter */
function getCategoryId() {
  let searchParams = new URLSearchParams(window.location.href);
  for (const [key, value] of searchParams.entries()) {
    if (key.endsWith('id')) {
      return value;
    }
  }
}
