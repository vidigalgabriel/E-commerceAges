const products = [
    { 
        id: 101, name: "Kit com 3 Camisetas Básicas", price: 149.90, img: "img/blusas.jfif",
        desc: "Essencial para o dia a dia. Confeccionadas em algodão 100% fio 30.1 penteado."
    },
    { 
        id: 102, name: "Cinto Casual Couro Eco", price: 89.90, img: "img/cinto.jfif",
        desc: "Elegância e sustentabilidade. Produzido em couro sintético de alta resistência."
    },
    { 
        id: 103, name: "Bermuda Infantil Comfort", price: 189.90, img: "img/bermudaInfantil.jfif",
        desc: "Liberdade para brincar. Tecido leve e respirável que permite total movimento."
    },
    { 
        id: 104, name: "Calça Jeans Slim Fit", price: 129.99, img: "img/calcaJeans.jfif",
        desc: "O jeans perfeito para qualquer ocasião. Modelagem Slim com elastano."
    },
    { 
        id: 105, name: "Tênis Nike Casual Run", price: 189.50, img: "img/tenis.jfif",
        desc: "Estilo esportivo para a cidade. Entressola em EVA que garante amortecimento."
    },
    { 
        id: 106, name: "Tênis Adidas Street", price: 249.90, img: "img/tenisA.jfif",
        desc: "Um clássico reinventado. Design icônico com as três listras laterais."
    },
    { 
        id: 107, name: "Óculos de Sol UV400", price: 189.90, img: "img/oculosSol.jfif",
        desc: "Proteção e estilo. Lentes polarizadas com proteção UV400."
    },
    { 
        id: 108, name: "Jaqueta Bomber Premium", price: 289.90, img: "img/jaqueta.jfif",
        desc: "A peça chave do inverno. Jaqueta estilo aviador com forro interno térmico."
    }
];

let cart = [];

window.navigateTo = function(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    
    const target = document.getElementById(screenId + '-screen');
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    
    if (screenId === 'cart') updateCartPage();
    if (screenId === 'profile') loadProfile();
    if (screenId === 'admin') loadAdminData();
    window.scrollTo(0,0);
};

window.openProductDetail = function(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;

    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');
    const modal = document.getElementById('product-modal');

    if (!modal || !modalImg) return;

    modalImg.src = p.img;
    if(modalTitle) modalTitle.innerText = p.name;
    if(modalPrice) modalPrice.innerText = `R$ ${p.price.toFixed(2)}`;
    if(modalDesc) modalDesc.innerText = p.desc;
    
    const btn = document.getElementById('modal-add-btn');
    if(btn) {
        btn.onclick = function() {
            window.addToCart(p.id);
            window.closeProductModal();
        };
    }
    
    modal.classList.remove('hidden');
};

window.closeProductModal = function() {
    const modal = document.getElementById('product-modal');
    if(modal) modal.classList.add('hidden');
};

window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    const item = cart.find(i => i.product.id === id);
    
    if(item) {
        item.quantity++;
    } else {
        cart.push({ product: p, quantity: 1 });
    }
    updateHeaderCart();
    alert('Produto adicionado ao carrinho!');
};

function renderProducts() {
    const list = document.getElementById('product-list');
    if (!list) return;
    list.innerHTML = '';

    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>R$ ${p.price.toFixed(2)}</p>
            <button onclick="window.openProductDetail(${p.id})">Ver Detalhes</button>
        `;
        list.appendChild(div);
    });
}

function updateHeaderCart() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if(el) el.innerText = count;
}

function updateCartPage() {
    const list = document.getElementById('cart-items-page');
    const totalEl = document.getElementById('cart-total-page');
    if (!list || !totalEl) return;

    list.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.product.price * item.quantity;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.product.name} (x${item.quantity})</span>
            <span>R$ ${(item.product.price * item.quantity).toFixed(2)}</span>
        `;
        list.appendChild(li);
    });
    
    totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;
}

window.openLoginModal = function() { 
    const m = document.getElementById('auth-modal');
    if(m) m.classList.remove('hidden'); 
};
window.closeAuthModal = function() { 
    const m = document.getElementById('auth-modal');
    if(m) m.classList.add('hidden'); 
};

window.checkAuth = function() {
    const userStr = localStorage.getItem('user');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const navProfile = document.getElementById('nav-profile');
    const navAdmin = document.getElementById('nav-admin');

    if (!loginBtn || !logoutBtn) return;

    if(userStr) {
        const user = JSON.parse(userStr);
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        if(navProfile) navProfile.classList.remove('hidden');
        
        if(user.email.includes('admin') || user.isAdmin) { 
            if(navAdmin) navAdmin.classList.remove('hidden');
        }
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        if(navProfile) navProfile.classList.add('hidden');
        if(navAdmin) navAdmin.classList.add('hidden');
    }
};

window.showAdminTab = function(tab) {
    const t1 = document.getElementById('admin-sales-tab');
    const t2 = document.getElementById('admin-products-tab');
    if(t1) t1.classList.add('hidden');
    if(t2) t2.classList.add('hidden');
    
    const target = document.getElementById('admin-' + tab + '-tab');
    if(target) target.classList.remove('hidden');
};

async function loadProfile() {
    const userStr = localStorage.getItem('user');
    if(!userStr) return;
    const user = JSON.parse(userStr);
    
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    if(nameEl) nameEl.innerText = user.name;
    if(emailEl) emailEl.innerText = user.email;
    
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await res.json();
        const container = document.getElementById('my-orders-list');
        if(container) {
            container.innerHTML = '';
            if(orders.length === 0) container.innerHTML = '<p>Nenhum pedido encontrado.</p>';
            orders.forEach(o => {
                const div = document.createElement('div');
                div.className = 'order-card';
                div.style.borderBottom = '1px solid #ccc';
                div.style.padding = '10px';
                div.innerHTML = `Data: ${new Date(o.createdAt).toLocaleDateString()} | Total: R$ ${o.total.toFixed(2)} | Status: <strong>${o.status}</strong>`;
                container.appendChild(div);
            });
        }
    } catch(e) { console.log(e); }
}

async function loadAdminData() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) {
            const orders = await res.json();
            const tbody = document.querySelector('#sales-table tbody');
            if(tbody) {
                tbody.innerHTML = '';
                orders.forEach(o => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${new Date(o.createdAt).toLocaleDateString()}</td><td>${o.user?.name || 'User'}</td><td>R$ ${o.total.toFixed(2)}</td><td>${o.status}</td>`;
                    tbody.appendChild(tr);
                });
            }
        }
        const prodBody = document.querySelector('#products-table tbody');
        if(prodBody) {
            prodBody.innerHTML = '';
            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>R$ ${p.price.toFixed(2)}</td>`;
                prodBody.appendChild(tr);
            });
        }
    } catch(e) { console.log(e); }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    window.checkAuth();
    updateHeaderCart();

    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const orderId = urlParams.get('orderId');

    if (success && orderId) {
        const token = localStorage.getItem('token');
        fetch('/api/orders/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ orderId })
        }).then(() => {
            alert('Pagamento Aprovado! Seu pedido foi confirmado.');
            cart = []; 
            updateHeaderCart();
            window.history.replaceState({}, document.title, "/"); 
            window.navigateTo('profile'); 
        });
    }

    const checkoutBtn = document.getElementById('checkout-page-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if(!token) return window.openLoginModal();
            if(cart.length === 0) return alert('Carrinho vazio');
            
            const total = cart.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
            const items = cart.map(i => ({ 
                productId: i.product.id, 
                name: i.product.name, 
                price: i.product.price, 
                quantity: i.quantity 
            }));
            
            try {
                checkoutBtn.innerText = "Processando...";
                checkoutBtn.disabled = true;

                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ items, total })
                });
                const data = await res.json();
                
                if(data.ok && data.url) {
                    window.location.href = data.url; 
                } else { 
                    alert('Erro ao criar pagamento: ' + (data.error || 'Erro desconhecido')); 
                    checkoutBtn.innerText = "Finalizar Compra Segura";
                    checkoutBtn.disabled = false;
                }
            } catch(e) { 
                console.error(e);
                alert('Erro de conexão com o pagamento.');
                checkoutBtn.innerText = "Finalizar Compra Segura";
                checkoutBtn.disabled = false;
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if(data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.closeAuthModal();
                    window.checkAuth();
                    alert('Logado!');
                } else { alert(data.error || 'Erro'); }
            } catch(err) { alert('Erro conexão'); }
        });
    }

    const regForm = document.getElementById('register-form');
    if(regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if(data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.closeAuthModal();
                    window.checkAuth();
                    alert('Cadastrado!');
                } else { alert(data.error || 'Erro'); }
            } catch(err) { alert('Erro conexão'); }
        });
    }

    const showReg = document.getElementById('show-register');
    const showLog = document.getElementById('show-login');
    const logCont = document.getElementById('login-form-container');
    const regCont = document.getElementById('register-form-container');

    if(showReg && logCont && regCont) {
        showReg.onclick = (e) => { 
            e.preventDefault(); 
            logCont.classList.add('hidden'); 
            regCont.classList.remove('hidden'); 
        };
    }
    if(showLog && logCont && regCont) {
        showLog.onclick = (e) => { 
            e.preventDefault(); 
            regCont.classList.add('hidden'); 
            logCont.classList.remove('hidden'); 
        };
    }

    const logout = document.getElementById('logout-btn');
    if(logout) logout.onclick = () => { localStorage.clear(); window.location.reload(); };
});