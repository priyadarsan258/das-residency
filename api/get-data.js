import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
    const sql = neon(process.env.DATABASE_URL);

    try {
        // This fetches data from your Neon table
        const data = await sql`SELECT * FROM profiles`;
        return response.status(200).json({ data });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}