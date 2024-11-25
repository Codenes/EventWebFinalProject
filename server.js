const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost', // หรือที่อยู่ของเซิร์ฟเวอร์ MySQL ของคุณ
    user: 'root', // ชื่อผู้ใช้
    password: '', // รหัสผ่านของคุณ
    database: 'event_platform' // ชื่อฐานข้อมูลที่ถูกต้อง
});

db.connect((err) => {
    if (err) {
        console.log('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:', err);
        return;
    }
    console.log('เชื่อมต่อกับฐานข้อมูลสำเร็จ');
});

// API สำหรับการลงทะเบียน
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน');
        }

        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send('เกิดข้อผิดพลาดในการลงทะเบียน');
            }
            res.send('ลงทะเบียนสำเร็จ');
        });
    });
});

// API สำหรับการเข้าสู่ระบบ
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    db.query(query, [username], (err, result) => {
        if (err) {
            return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล');
        }

        if (result.length > 0) {
            // ตรวจสอบรหัสผ่าน
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) {
                    return res.status(500).send('เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน');
                }

                if (isMatch) {
                    res.send('เข้าสู่ระบบสำเร็จ');
                } else {
                    res.send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                }
            });
        } else {
            res.send('ชื่อผู้ใช้ไม่ถูกต้อง');
        }
    });
});

// API สำหรับการจอง Event
app.post('/book', (req, res) => {
    const { username, event, date, time, location } = req.body;

    if (!username || !event || !date || !location || !time) {
        return res.status(400).send('ข้อมูลไม่ครบถ้วน'); // แจ้งเตือนหากข้อมูลไม่ครบ
    }

    const query = `
        INSERT INTO bookings (username, event_name, event_date, event_time, event_location) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [username, event, date, time || 'ไม่ระบุเวลา', location], (err, result) => {
        if (err) {
            console.error('เกิดข้อผิดพลาด:', err); // Log error
            return res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
        res.send('จองสำเร็จ');
    });
});

// API สำหรับการดูข้อมูลการจองของผู้ใช้
app.get('/bookings', (req, res) => {
    const username = req.query.username;
    const query = 'SELECT * FROM bookings WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) {
            return res.status(500).send('Error retrieving bookings');
        }
        res.json(result);
    });
});


app.listen(5500, () => {
    console.log('http://localhost:5500');
}); 