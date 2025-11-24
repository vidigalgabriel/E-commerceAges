// ==========================================================
// 1. DADOS INICIAIS (PRODUCTS e CART)
// ==========================================================

// Inicialização da lista de produtos com dados e caminhos de imagem
let products = [
    // Certifique-se de que esses arquivos de imagem (blusas.jfif, DonkeyKong.jpg, zeldaTears.jpg) 
    // estejam na mesma pasta que o Ages.html ou use o caminho correto.
    { id: 101, name: "Kit com 3 camisetas", price: 149.90, img: "blusas.jfif" },
    { id: 102, name: "Cinto Casual", price: 89.90, img: "cinto.jfif" },
    { id: 103, name: "Bermuda Infantil", price: 189.90, img: "bermudaInfantil.jfif" },
    { id: 104, name: "Calça Jeans Slim", price: 129.99, img: "calcaJeans.jfif" }, // Exemplo
    { id: 105, name: "Tênis nike Casual", price: 189.50, img: "tenis.jfif" },
    { id: 106, name: "Tênis Adidas Casual", price: 249.90, img: "tenisA.jfif" },
    { id: 107, name: "Óculos de Sol", price: 189.90, img: "oculosSol.jfif" },
    { id: 108, name: "Jaqueta Bomber", price: 289.90, img: "jaqueta.jfif" },
];
let cart = [];

// ==========================================================
// 2. LÓGICA DO CARROSSEL AUTOMÁTICO
// ==========================================================

let slideIndex = 0;
let slides = [];
let slideInterval;

// Função para mostrar o slide atual
function showSlides() {
  slides = document.querySelectorAll('.slider-image');
  if (slides.length === 0) return;

  // 1. Esconde todos os slides (remove a classe 'active')
  slides.forEach(slide => slide.classList.remove('active'));
  
  // 2. Ajusta o índice para loop infinito
  if (slideIndex >= slides.length) { slideIndex = 0; }
  if (slideIndex < 0) { slideIndex = slides.length - 1; }
  
  // 3. Mostra o slide atual
  slides[slideIndex].classList.add('active');
}

// Função para avançar/voltar slides manualmente (chamada no Ages.html)
function changeSlide(n) {
  clearInterval(slideInterval);
  slideIndex += n;
  showSlides();
  startAutoSlide(); // Reinicia o automático
}

// Função para iniciar o deslizamento automático
function startAutoSlide() {
  slideInterval = setInterval(() => {
    slideIndex++;
    showSlides();
  }, 5000); // Muda a cada 5 segundos
}


// ==========================================================
// 3. LÓGICA DA LOJA VIRTUAL (CRUD e CARRINHO)
// ==========================================================

// Renderizar Produtos (Cria os cards na tela)
function renderProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; // Limpa a lista

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      
      <img src="${product.img}" alt="${product.name}" width="180" height="180">

      <h3>${product.name}</h3>
      <p>R$ ${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
    `;
    productList.appendChild(div);
  });
}

// Cadastro de Produto
document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-product');
  if (addButton) {
    addButton.addEventListener('click', () => {
      const name = document.getElementById('product-name').value;
      const price = parseFloat(document.getElementById('product-price').value);

      if (name && price > 0) {
        // Usa uma imagem padrão para novos produtos
        products.push({ id: Date.now(), name, price, img: "placeholder.png" }); 
        renderProducts();
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
      } else {
        alert('Preencha o nome e preço corretamente.');
      }
    });
  }
});


// Adicionar ao Carrinho
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const item = cart.find(i => i.product.id === productId);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  updateCart();
}

// Atualizar Carrinho
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');

  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.product.price * item.quantity;
    count += item.quantity;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      ${item.product.name} - R$ ${item.product.price.toFixed(2)}
      <input type="number" min="1" value="${item.quantity}" onchange="changeQuantity(${item.product.id}, this.value)">
      <button onclick="removeFromCart(${item.product.id})">X</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  cartCount.textContent = count;
}

// Mudar quantidade
function changeQuantity(productId, newQuantity) {
  const item = cart.find(i => i.product.id === productId);
  if (item && newQuantity >= 1) {
    item.quantity = parseInt(newQuantity);
    updateCart();
  }
}

// Remover item do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  updateCart();
}

// Deletar Produto (Mantida, mas sem botão para chamá-la)
function deleteProduct(productId) {
  products = products.filter(p => p.id !== productId);
  cart = cart.filter(item => item.product.id !== productId);
  renderProducts();
  updateCart();
}

// Limpar Carrinho
document.getElementById('clear-cart').addEventListener('click', () => {
  if (confirm('Deseja limpar o carrinho?')) {
    cart = [];
    updateCart();
  }
});

// Finalizar Compra
document.getElementById('checkout').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }
  alert('Compra realizada com sucesso!');
  cart = [];
  updateCart();
  document.getElementById('cart').classList.remove('show');
});

// Abrir / Fechar Carrinho
document.getElementById('open-cart').addEventListener('click', () => {
  document.getElementById('cart').classList.add('show');
});

document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart').classList.remove('show');
});

// ==========================================================
// 4. INICIALIZAÇÃO DA PÁGINA
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Carrossel
    showSlides(); 
    startAutoSlide(); 
    
    // 2. Renderiza os Cards de Produto
    renderProducts(); 
    
    // 3. Garante que o carrinho comece vazio
    updateCart(); 
});
