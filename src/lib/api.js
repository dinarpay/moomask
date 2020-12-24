import Web3 from 'web3'

class APIClient {
    _client;

    set client(client) {
        this._client = client;
    }

    get client() {
        return this._client;
    }
}

const apiClient = new APIClient();

export default apiClient;
