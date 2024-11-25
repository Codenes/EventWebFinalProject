// เปิดฟอร์มลงทะเบียน
function openRegisterForm() {
    document.getElementById("registerOverlay").style.display = "block";
}

// ปิดฟอร์มลงทะเบียน
function closeRegisterForm() {
    document.getElementById("registerOverlay").style.display = "none";
}

// เปิดฟอร์มเข้าสู่ระบบ
function openLoginForm() {
    document.getElementById("loginOverlay").style.display = "block";
}

// ปิดฟอร์มเข้าสู่ระบบ
function closeLoginForm() {
    document.getElementById("loginOverlay").style.display = "none";
}

// ฟังก์ชั่นเพื่อแสดงชื่อผู้ใช้และปุ่มออกจากระบบ
function showUserProfile(username) {
    document.getElementById("authButtons").style.display = "none";  // ซ่อนปุ่มเข้าสู่ระบบและลงทะเบียน
    document.getElementById("userProfile").style.display = "block";  // แสดงโปรไฟล์ผู้ใช้
    document.getElementById("welcomeMessage").innerText = `ยินดีต้อนรับ, ${username}`;  // แสดงชื่อผู้ใช้
    document.getElementById("hamburgerMenu").style.display = "block"; // แสดงเมนู Hamburger
}

// ฟังก์ชั่นออกจากระบบ
function logout() {
    // ลบข้อมูลผู้ใช้จาก localStorage
    localStorage.removeItem("username");

    // ซ่อนโปรไฟล์ผู้ใช้และแสดงปุ่มเข้าสู่ระบบ
    document.getElementById("userProfile").style.display = "none";
    document.getElementById("authButtons").style.display = "block";
    document.getElementById("hamburgerMenu").style.display = "none"; // ซ่อนเมนู Hamburger
}

// ตรวจสอบว่าเมื่อโหลดหน้าเว็บผู้ใช้ได้ล็อกอินหรือไม่
window.onload = function() {
    const username = localStorage.getItem("username");

    if (username) {
        showUserProfile(username);
        viewBookings();
        displayEventDetails()
    } else {
        document.getElementById("authButtons").style.display = "block";  
        document.getElementById("userProfile").style.display = "none"; 
        document.getElementById("hamburgerMenu").style.display = "none"; // ซ่อนเมนู Hamburger เมื่อไม่ได้ล็อกอิน
    }
};

// การเข้าสู่ระบบ
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "เข้าสู่ระบบสำเร็จ") {
            localStorage.setItem("username", username);
            showUserProfile(username);
        } else {
            alert(data);
        }
        closeLoginForm();
    })
    .catch(error => {
        console.error('เกิดข้อผิดพลาด:', error);
        alert("ไม่สามารถเข้าสู่ระบบได้");
    });
});

// การลงทะเบียน
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "ลงทะเบียนสำเร็จ") {
            alert("ลงทะเบียนสำเร็จ");
            closeRegisterForm();
        } else {
            alert(data);
        }
    })
    .catch(error => {
        console.error('เกิดข้อผิดพลาด:', error);
        alert("ไม่สามารถลงทะเบียนได้");
    });
});

// ฟังก์ชันเพื่อแสดง/ซ่อนเมนู Hamburger
function toggleMenu() {
    const menu = document.getElementById("menu");
    if (menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function displayEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const event = urlParams.get('event'); // เช่น event1, event2

    // Mock data อีเวนต์
    const events = {
        event1: { name: 'MusicConcert', description: 'รายละเอียด ราคา 10$', date: '2024-05-21', location: 'centralRama2', time: '18:00น.',image: 'images/event1.jpg' },
        event2: { name: 'UrbanMusic', description: 'รายละเอียด ราคา 1500 บาท', date: '2024-05-21', location: 'centralRama2', time: '17:00น.',image: 'images/event2.jpg' },
        event3: { name: 'spaceconcert', description: 'รายละเอียด ราคา 20000 บาท', date: '2024-06-15', location: 'Bangkok', time: '20:00น.',image: 'images/event3.jpg' },
        event4: { name: 'i pok pu chai', description: 'รายละเอียด ราคา 3 แสนบาท', date: '2024-12-01', location: 'Kmutt', time: '15:00น.',image: 'images/event4.jpg' },
        event5: { name: 'musicBar', description: 'รายละเอียด ราคา 1230 บาท', date: '2024-12-12', location: 'Bangkok', time: '21:00น.',image: 'images/event5.jpg' },
        event6: { name: 'Fujii Kaze', description: 'รายละเอียด ราคา 2400 บาท', date: '2024-12-25', location: 'Bangkok', time: '11:00น.',image: 'images/event6.jpg' },
        event7: { name: 'Onmusic', description: 'รายละเอียด ราคา 1500 บาท', date: '2024-09-01', location: 'Bangkok', time: '06:00น.',image: 'images/event7.jpg' },
        event8: { name: 'Logomusic', description: 'รายละเอียด ราคา 3000 บาท', date: '2024-12-21', location: 'Bangkok', time: '20:20น.',image: 'images/event8.jpg' },
        event9: { name: 'Fesmusic', description: 'รายละเอียด ราคา 2000 บาท', date: '2024-12-31', location: 'Bangkok', time: '20:20น.',image: 'images/event9.jpg' },
        event10: { name: 'Tynkconcert', description: 'รายละเอียด ราคา 1500 บาท', date: '2024-12-20', location: 'Bangkok', time: '11:20น.',image: 'images/event10.jpg' },
    };

    const eventDetails = events[event];

    if (eventDetails) {
        document.getElementById('eventName').innerText = eventDetails.name;
        document.getElementById('eventDescription').innerText = eventDetails.description;
        document.getElementById('eventDate').innerText = `วันที่: ${eventDetails.date}`;
        document.getElementById('eventTime').innerText = `เวลา: ${eventDetails.time}`;
        document.getElementById('eventLocation').innerText = `สถานที่: ${eventDetails.location}`;
        document.getElementById('eventImage').src = eventDetails.image;

        document.getElementById('bookButton').setAttribute('onclick', `bookEvent('${eventDetails.name}')`);
    }
}

// ฟังก์ชันจองอีเวนต์
function bookEvent(eventName) {
    const username = localStorage.getItem('username'); // ดึงชื่อผู้ใช้จาก localStorage
    if (!username) {
        alert('กรุณาเข้าสู่ระบบก่อนจอง');
        return;
    }

    // ข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์
    const bookingData = {
        username: username,
        event: eventName,
        date: document.getElementById("eventDate").innerText.replace("วันที่: ", ""),
        time: document.getElementById("eventTime").innerText.replace("เวลา: ", ""),
        location: document.getElementById("eventLocation").innerText.replace("สถานที่: ", "")
    };

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // แสดงผลลัพธ์ให้ผู้ใช้ทราบ
    })
    .catch(error => {
        console.error('เกิดข้อผิดพลาด:', error);
        alert('ไม่สามารถจองได้');
    });
}

// ฟังก์ชันดูข้อมูลการจอง
function viewBookings() {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('กรุณาเข้าสู่ระบบเพื่อดูข้อมูลการจอง');
        return;
    }

    fetch('/bookings?username=' + username, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        const bookingListContainer = document.getElementById('bookingList');
        bookingListContainer.innerHTML = '';  // เคลียร์ข้อมูลเก่า
    
        if (data.length === 0) {
            bookingListContainer.innerHTML = 'ไม่มีการจอง';
        } else {
            data.forEach(booking => {
                const bookingItem = document.createElement('ul');
    
                bookingItem.innerHTML = `
                    <div class="event">
                        <h3>${booking.event_name || 'ชื่ออีเวนต์ไม่พบ'}</h3>
                        <p>วันที่: ${booking.event_date || 'ไม่ระบุวันที่'}</p>
                        <p>เวลา: ${booking.event_time || 'ไม่ระบุเวลา'}</p>
                        <p>สถานที่: ${booking.event_location || 'ไม่ระบุสถานที่'}</p>
                    </div>
                `;
                bookingListContainer.appendChild(bookingItem);
            });
        }
    })
    .catch(error => console.error('เกิดข้อผิดพลาด:', error));
} 

// ฟังก์ชันไปยังหน้ารายละเอียดของอีเวนต์
function goToEventDetails(eventId) {
    // เปลี่ยนแปลง URL ให้ถูกต้อง
    window.location.href = `event-detail.html?event=${eventId}`;
}

// ฟังก์ชันกลับไปหน้าหลัก
function goBack() {
    window.location.href = "index.html";
}
