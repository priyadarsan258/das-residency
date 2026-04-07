import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const sql = neon(process.env.DATABASE_URL);
    const s = req.body;

    try {
        await sql`
            INSERT INTO surveys (
                cleanliness, hygiene, managerbehaviour, roomboybehaviour, 
                roomnumber, roomrent, amountpaid, paymenttype, extracharges, 
                suggestions, timestamp
            ) VALUES (
                ${s.cleanliness}, ${s.hygiene}, ${s.managerBehaviour}, ${s.roomBoyBehaviour},
                ${s.roomNumber}, ${s.roomRent}, ${s.amountPaid}, ${s.paymentType}, 
                ${s.extraCharges}, ${s.suggestions}, ${s.timestamp}
            )`;
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}