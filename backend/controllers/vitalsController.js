exports.addVital = async (req, res, db) => {
    const { type, value, unit } = req.body;
    const userId = req.user.id;

    if (!type || !value) {
        return res.status(400).json({ error: "Type and value are required" });
    }

    try {
        await db.run(
            'INSERT INTO vitals (userId, type, value, unit) VALUES (?, ?, ?, ?)',
            [userId, type, value, unit]
        );
        res.status(201).json({ message: "Vital recorded successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to store vital data" });
    }
};

exports.getVitals = async (req, res, db) => {
    const userId = req.user.id;
    const { type, startDate, endDate } = req.query;

    let query = 'SELECT * FROM vitals WHERE userId = ?';
    let params = [userId];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }

    if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    try {
        const data = await db.all(query, params);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve vitals" });
    }
};
