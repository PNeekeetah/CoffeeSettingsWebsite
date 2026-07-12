const API_BASE = window.location.origin;

const url = (path) => `${API_BASE}/${path}`.replace(/([^:])\/\//g, '$1/');

async function request(method, path, body) {
    const opts = {method, headers: {}};
    if (body) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
    }
    console.log(url(path));
    console.log(opts);
    
    const res = await fetch(url(path), opts);
    if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}`);
    return res.status === 204 ? null : res.json();
}

export const api = {
    async listCoffees() {
        try {
            return await request('GET', 'coffee');
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    async createCoffee(coffee) {
        try {
            return await request('POST', 'coffee', coffee);
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    async createExtraction(extraction) {
        try {
            return await request('POST', 'extraction', extraction);
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    async lastExtraction() {
        try { 
            return await request('GET', 'extraction');
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    async listExtractions() {
        try {
            return await request('GET', 'extractions');
        } catch (err) {
            console.error(err);
            return [];
        }
    },
};
