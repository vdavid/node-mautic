const HttpQueryHelper = require('./HttpQueryHelper');
const httpQueryHelper = new HttpQueryHelper();

test('Can add basic authentication header to query', async () => {
    /* Arrange */
    const username = 'x';
    const password = 'y';
    const requestParams = {method:'GET', url:'https://test.com', body:'xyz'};

    /* Act */
    const result = httpQueryHelper.addBasicAuthenticationHeader(requestParams, username, password);

    /* Assert */
    expect(result.headers['Authorization']).toBe('Basic eDp5');
    expect(result.headers['Content-Type']).toBe('application/json');
    expect(result.method).toBe(requestParams.method);
    expect(result.url).toBe(requestParams.url);
    expect(result.body).toBe(requestParams.body);
    expect(Object.keys(result).length).toBe(4);
});

test('Can add timeout to request parameters', async () => {
    /* Arrange */
    const requestParams = {method:'GET', url:'https://test.com', body:'xyz'};
    const requestTimeoutInMilliseconds= 1;

    /* Act */
    const result = httpQueryHelper.addTimeoutToRequestParameters(requestParams, requestTimeoutInMilliseconds);

    /* Assert */
    expect(result.method).toBe(requestParams.method);
    expect(result.url).toBe(requestParams.url);
    expect(result.body).toBe(requestParams.body);
    expect(result.timeout).toBe(requestTimeoutInMilliseconds);
    expect(Object.keys(result).length).toBe(4);
});

test('Can convert query parameters to string', async () => {
    /* Arrange */
    const queryParameters = {a:1, b:2};

    /* Act */
    const result = httpQueryHelper.convertQueryParametersToString(queryParameters);

    /* Assert */
    expect(result).toBe('a=1&b=2');
});

test('Can convert query parameters to string for Mautic query', async () => {
    /* Arrange */
    const queryParameters = {a:1, b:2};

    /* Act */
    const result = httpQueryHelper.convertQueryParametersToStringForQuery(queryParameters);

    /* Assert */
    expect(result).toBe('where[0][col]=a&where[0][val]=1&where[0][expr]=eq&where[1][col]=b&where[1][val]=2&where[1][expr]=eq');
});

test('Can remove undefined values', async () => {
    /* Arrange */
    const input = {a:1, b:2, c: undefined};

    /* Act */
    const result = httpQueryHelper.removeUndefinedValues(input);

    /* Assert */
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(Object.keys(result).length).toBe(2);
});
