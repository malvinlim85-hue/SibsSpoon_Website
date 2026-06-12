document.addEventListener("DOMContentLoaded", () => {

    loadAdminDashboard();

    function loadAdminDashboard() {
        fetch('get_order.php') 
            .then(response => {
                if (!response.ok) {
                    throw new Error("File PHP tidak ditemukan atau server error (Status: " + response.status + ")");
                }
                return response.json();
            })
            .then(orders => {
                const tableBody = document.getElementById('order-table-body'); 
                const totalOrdersEl = document.getElementById('total-orders'); 
                const totalRevenueEl = document.getElementById('total-revenue'); 

                if (!orders || orders.length === 0) {
                    if (tableBody) {
                        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada data pesanan masuk.</td></tr>';
                    }
                    return;
                }

                let totalOrders = orders.length;
                let totalRevenue = 0;
                let tableHtml = '';

                orders.forEach(order => {
                    const price = parseInt(order.total_price) || 0;
                    totalRevenue += price;

                    const dateFormatted = new Date(order.order_date).toLocaleDateString('id-ID', {
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit'
                    });

                    let badgeColor = "background:#e8f5e9; color:#2e7d32;"; 
                    if (order.status.toLowerCase() === 'pending') {
                        badgeColor = "background:#fff3e0; color:#e65100;"; 
                    }

                    tableHtml += `
                        <tr>
                            <td>#${order.order_id}</td>
                            <td>${order.customer_name}</td>
                            <td>${dateFormatted}</td>
                            <td>Rp ${price.toLocaleString('id-ID')}</td>
                            <td><span class="status-badge" style="${badgeColor} padding:5px 10px; border-radius:5px; font-size:12px;">${order.status}</span></td>
                            <td>
                                <button class="edit-btn" style="background:#d4a373; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="gantiStatusOrder('${order.order_id}', '${order.status}')">Edit</button>
                            </td>
                        </tr>
                    `;
                });

                if (totalOrdersEl) totalOrdersEl.innerText = totalOrders;
                if (totalRevenueEl) totalRevenueEl.innerText = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
                if (tableBody) tableBody.innerHTML = tableHtml;
            })
            .catch(error => {
                const tableBody = document.getElementById('order-table-body');
                if (tableBody) {
                    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Gagal memuat data dari database.</td></tr>';
                }
            });
    }
    
    window.gantiStatusOrder = function(orderId, currentStatus) {
        const newStatus = prompt(`Ubah status pesanan #ORD-${orderId} menjadi (Pending / Success):`, currentStatus);
        
        if (newStatus === null) return; 
        if (newStatus.trim() === "") {
            alert("Status tidak boleh kosong!");
            return;
        }

        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('status', newStatus.trim());

        fetch('update_order.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                loadAdminDashboard(); 
            } else {
                alert('Gagal mengupdate: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kendala jaringan saat memperbarui status.');
        });
    };
    
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || (this.id === 'loginNav' && localStorage.getItem('username'))) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const fadeElements = document.querySelectorAll('.section, .menu-card, .gallery-grid img, .about-grid');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you! Your message has been sent.');
            contactForm.reset();
        });
    }

    const username = localStorage.getItem('username');
    const loginNav = document.getElementById('loginNav'); 
    const loginModal = document.getElementById("loginModal");
    const closeLogin = document.getElementById("closeLogin");

    if (loginNav) {
        if (username && username !== 'null') {
            const namaKapital = username.charAt(0).toUpperCase() + username.slice(1);
            loginNav.innerHTML = `<i class="fas fa-user-circle"></i> ${namaKapital}`;
            loginNav.href = "#"; 
            
            loginNav.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm(`Halo ${namaKapital}, apakah kamu ingin logout dari akunmu?`)) {
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('username');
                    window.location.reload(); 
                }
            });
        } else {
            loginNav.addEventListener("click", (e) => {
                e.preventDefault();
                if (loginModal) {
                    loginModal.classList.add("active");
                    loginModal.style.display = "flex"; 
                }
            });
        }
    }

    if (closeLogin && loginModal) {
        closeLogin.addEventListener("click", () => {
            loginModal.classList.remove("active");
            loginModal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove("active");
                loginModal.style.display = "none";
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const role = document.getElementById("role").value;
            const inputUser = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const message = document.getElementById("loginMessage");

            message.style.color = "orange";
            message.innerHTML = "Mohon tunggu...";

            fetch('login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: role,
                    username: inputUser,
                    password: password
                })
            })
            .then(response => response.text()) 
            .then(text => {
                try {
                    return JSON.parse(text);
                } catch (err) {
                    console.error("Respon login.php bukan JSON:", text);
                    throw new Error("Respon server login tidak valid.");
                }
            })
            .then(data => {
                if (data.status === 'success') {
                    message.style.color = "green";
                    message.innerHTML = data.message;
                    
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('username', inputUser);

                    setTimeout(() => {
                        if (role === 'admin') {
                            window.location.href = 'admin.html'; 
                        } else {
                            if (loginModal) {
                                loginModal.classList.remove("active");
                                loginModal.style.display = "none";
                            }
                            window.location.reload(); 
                        }
                    }, 1500);

                } else {
                    message.style.color = "red";
                    message.innerHTML = data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                message.style.color = "red";
                message.innerHTML = error.message || "Gagal terhubung ke server login.";
            });
        });
    }

    loadMenuDariDatabase(); 
});

let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    alert(name + ' berhasil ditambahkan ke keranjang!');
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${item.name}</span>
                <span>Rp ${item.price.toLocaleString('id-ID')}</span>
            </div>
        `;
    });
    
    if (cartCount) cartCount.innerText = cart.length;
    if (cartTotal) cartTotal.innerText = total.toLocaleString('id-ID'); 
}

function openCart() {
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong!');
        return;
    }
    closeCart();
    document.getElementById('paymentModal').style.display = 'block';
}

function closePayment() {
    document.getElementById('paymentModal').style.display = 'none';
}

function payNow() {
    const name = document.getElementById('customerName').value;
    const method = document.getElementById('paymentMethod').value;
    const totalText = document.getElementById('cart-total').innerText;
    const totalAmount = parseInt(totalText.replace(/\D/g, ""), 10);

    if (name === '') {
        alert('Silakan masukkan nama Anda');
        return;
    }
    if (method === '') {
        alert('Silakan pilih metode pembayaran');
        return;
    }

    const checkoutFormData = new FormData();
    checkoutFormData.append('customer_name', name);
    checkoutFormData.append('total_price', totalAmount);

    fetch('checkout.php', {
        method: 'POST',
        body: checkoutFormData 
    })
    .then(response => response.text()) 
    .then(text => {
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Respon dari checkout.php bukan JSON valid! Teks respons:", text);
            throw new Error("Gagal membaca respon server. Silakan periksa kembali file koneksi database Anda.");
        }
    })
    .then(data => {
        if (data.status === 'success') {
            closePayment();
            document.getElementById('successModal').style.display = 'block';
            
            cart = []; 
            updateCart();
            
            document.getElementById('customerName').value = '';
            document.getElementById('paymentMethod').value = '';
            document.getElementById('payment-info').innerHTML = ''; 
        } else {
            alert('Gagal menyimpan pesanan: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Detail Terjadinya Error:', error);
        alert(error.message);
    });
}

function closeSuccess() {
    document.getElementById('successModal').style.display = 'none';
}

function showPaymentInfo() {
    const method = document.getElementById('paymentMethod').value;
    const paymentInfo = document.getElementById('payment-info');
    
    if (!paymentInfo) return;

    if (method === 'qris') {
        paymentInfo.innerHTML = `
            <h3 style="margin-top: 15px; color: #3e2723;">Scan QRIS</h3>
            <img src="image/barcode.jpeg" class="qr-image" style="width: 200px; height: 200px; margin-top: 10px; border-radius: 10px; border: 2px solid #d4a373;">
        `;
    } else if (method === 'bank') {
        paymentInfo.innerHTML = `
            <div class="bank-info" style="background: #faf7f2; padding: 15px; border-radius: 12px; margin-top: 15px; text-align: left; border: 1px solid #e0d6cc;">
                <h3 style="color: #3e2723; margin-bottom: 8px;">Bank Transfer</h3>
                <p style="margin: 4px 0;"><strong>Bank:</strong> BCA</p>
                <p style="margin: 4px 0;"><strong>Name:</strong> SibsSpoon</p>
                <p style="margin: 4px 0;"><strong>Account:</strong> 1234567890</p>
            </div>
        `;
    } else {
        paymentInfo.innerHTML = '';
    }
}

function loadMenuDariDatabase() {
    fetch('get_products.php')
        .then(response => response.text())
        .then(text => {
            try {
                return JSON.parse(text);
            } catch (err) {
                console.error("Respon get_products.php bukan JSON:", text);
                throw new Error("Gagal mengambil data produk.");
            }
        })
        .then(products => {
            const signatureContainer = document.getElementById('produk-signature');
            const creationsContainer = document.getElementById('produk-creations');
            
            if (signatureContainer) signatureContainer.innerHTML = '';
            if (creationsContainer) creationsContainer.innerHTML = '';

            products.forEach((prod, index) => {
                const productHtml = `
                    <div class="menu-card">
                        <img src="image/${prod.image}" alt="${prod.product_name}">
                        <h3>${prod.product_name}</h3>
                        <p class="price">Rp ${parseInt(prod.price).toLocaleString('id-ID')}</p>
                        <p>${prod.description}</p>
                        <button class="cart-btn" onclick="addToCart('${prod.product_name}', ${parseInt(prod.price)})">
                            Add to Cart
                        </button>
                    </div>
                `;

                if (index < 4) {
                    if (signatureContainer) signatureContainer.innerHTML += productHtml;
                } else {
                    if (creationsContainer) creationsContainer.innerHTML += productHtml;
                }
            });
        })
        .catch(error => {
            console.error('Gagal mengambil data menu dari MySQL:', error);
        });
}