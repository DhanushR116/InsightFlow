import apiclient from "./client";

export async function checkHealth(){
    const response = await apiclient.get('/health')
    return response.data
}
