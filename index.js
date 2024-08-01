const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint เพื่อดึงข้อมูลจาก API ภายนอกและเปรียบเทียบกับข้อมูลในไฟล์ data.json
app.get('/check-data', async (req, res) => {
    try {
        // ดึงข้อมูลจาก API ภายนอก
        const response = await axios.get('https://check.pa63.thistine.com/');
        const externalData = response.data;

        // อ่านข้อมูลในไฟล์ data.json
        const dataFilePath = path.join(__dirname, 'data.json');
        let localData = [];
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            if (fileData) {
                localData = JSON.parse(fileData);
            }
        }

        // เปรียบเทียบข้อมูล
        const comparisonResult = compareData(localData, externalData);

        res.json({ success: true, comparisonResult });
    } catch (error) {
        console.error('Error fetching or comparing data:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch or compare data' });
    }
});

function compareData(localData, externalData) {
    return {
        localData,
        externalData
    };
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
