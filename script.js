// script.js - единый для всех страниц
document.addEventListener('DOMContentLoaded', () => {
  // ========== 1. Карусель (только на главной) ==========
  const carouselContainer = document.querySelector('.carousel-slides');
  if (carouselContainer) {
    let current = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const total = slides.length;
    const prevBtn = document.querySelector('.carousel .prev');
    const nextBtn = document.querySelector('.carousel .next');

    function updateCarousel() {
      carouselContainer.style.transform = `translateX(-${current * 100}%)`;
    }
    function nextSlide() { current = (current + 1) % total; updateCarousel(); }
    function prevSlide() { current = (current - 1 + total) % total; updateCarousel(); }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    setInterval(nextSlide, 5000);
  }

  // ========== 2. Загрузка товаров из data.json ==========
  const pageType = document.body.dataset.page; // bukety, gorshechnye, sad, или 'index'
  const container = document.getElementById('catalog-container');
  
  if (container && pageType && pageType !== 'index') {
    // Обычные страницы каталога
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        let items = [];
        if (pageType === 'bukety') items = data.bukety;
        else if (pageType === 'gorshechnye') items = data.gorshechnye;
        else if (pageType === 'sad') items = data.sad;
        renderCards(items, container, false);
      })
      .catch(err => {
        console.warn('Ошибка загрузки JSON', err);
        container.innerHTML = '<p style="text-align:center">⚠️ Не удалось загрузить товары, проверьте data.json</p>';
      });
  }
  
  // ========== 3. Главная страница: показываем featured товары ==========
  const featuredContainer = document.getElementById('featured-container');
  if (featuredContainer) {
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        // Отбираем товары с featured: true (или можно просто взять первые 3-4)
        const featuredBukety = data.bukety.filter(item => item.featured === true).slice(0, 4);
        const featuredGorshechnye = data.gorshechnye.filter(item => item.featured === true).slice(0, 4);
        const featuredSad = data.sad.filter(item => item.featured === true).slice(0, 4);
        
        // Рендерим три секции
        renderFeaturedSection('💐 Популярные букеты', featuredBukety, 'catalog-bukety.html', featuredContainer);
        renderFeaturedSection('🌿 Горшечные растения', featuredGorshechnye, 'catalog-gorshechnye.html', featuredContainer);
        renderFeaturedSection('🛠️ Для сада и огорода', featuredSad, 'catalog-sad.html', featuredContainer);
      })
      .catch(err => {
        console.warn('Ошибка загрузки JSON для главной', err);
        if (featuredContainer) featuredContainer.innerHTML = '<p style="text-align:center">⚠️ Не удалось загрузить товары</p>';
      });
  }

  // Функция отрисовки карточек
  function renderCards(items, containerEl, isFeaturedPage = false) {
    if (!items.length) {
      containerEl.innerHTML = '<p>Нет товаров в этой категории.</p>';
      return;
    }
    let html = '';
    items.forEach(item => {
      html += `
        <div class="product-card">
          <img class="card-img" src="${item.image}" alt="${item.name}" loading="lazy">
          <div class="card-content">
            <h3 class="card-title">${escapeHtml(item.name)}</h3>
            <p class="card-desc">${escapeHtml(item.description)}</p>
            <div class="card-price">${item.price.toLocaleString()} ₽ <small>за шт</small></div>
            <a href="#" class="btn btn-outline" onclick="alert('Свяжитесь с нами для заказа: +7 (999) 123-45-67'); return false;">Заказать</a>
          </div>
        </div>
      `;
    });
    containerEl.innerHTML = html;
  }

  function renderFeaturedSection(title, items, linkTo, parentContainer) {
    if (!items.length) return;
    
    let sectionHtml = `
      <div class="featured-category">
        <div class="featured-header">
          <h2>${title}</h2>
          <a href="${linkTo}" class="catalog-link">
            Смотреть все 
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        <div class="catalog-grid featured-grid">
    `;
    
    items.forEach(item => {
      sectionHtml += `
        <div class="product-card">
          <img class="card-img" src="${item.image}" alt="${item.name}" loading="lazy">
          <div class="card-content">
            <h3 class="card-title">${escapeHtml(item.name)}</h3>
            <p class="card-desc">${escapeHtml(item.description)}</p>
            <div class="card-price">${item.price.toLocaleString()} ₽ <small>за шт</small></div>
            <a href="#" class="btn btn-outline" onclick="alert('Свяжитесь с нами для заказа: +7 (999) 123-45-67'); return false;">Заказать</a>
          </div>
        </div>
      `;
    });
    
    sectionHtml += `</div></div>`;
    parentContainer.insertAdjacentHTML('beforeend', sectionHtml);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // Подсветка активного пункта меню
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('.nav-links a');
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html') || (currentPath === '/' && href === 'index.html') || (href === 'index.html' && currentPath.endsWith('/')))) {
      link.classList.add('active');
    } else if (href === 'index.html' && (currentPath === '/' || currentPath === '/index.html')) {
      link.classList.add('active');
    }
  });
});

(function() {
    const form = document.getElementById('tgForm');
    if (!form) return;
    
    const WORKER_URL = 'https://misty-math-a146.roikn33.workers.dev/';
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('userName').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const message = document.getElementById('userMessage').value.trim();
      
      const statusDiv = document.getElementById('formStatus');
      
      if (!name || !phone) {
        statusDiv.innerHTML = '❌ Пожалуйста, заполните имя и телефон.';
        statusDiv.style.color = '#d47e92';
        setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        return;
      }
      
      statusDiv.innerHTML = '⏳ Отправка...';
      statusDiv.style.color = '#9bc4b0';
      
      try {
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, message: message || 'Без сообщения' })
        });
        
        const data = await response.json();
        
        if (data.ok === true || response.ok) {
          statusDiv.innerHTML = '✅ Спасибо! Мы свяжемся с вами в ближайшее время.';
          statusDiv.style.color = '#6f9e82';
          form.reset();
          setTimeout(() => { statusDiv.innerHTML = ''; }, 5000);
        } else {
          statusDiv.innerHTML = '❌ Ошибка отправки. Попробуйте позже или позвоните нам.';
          statusDiv.style.color = '#d47e92';
        }
      } catch (error) {
        console.error('Form error:', error);
        statusDiv.innerHTML = '❌ Ошибка соединения. Проверьте интернет или позвоните нам.';
        statusDiv.style.color = '#d47e92';
      }
    });
  })();

// ========== БУРГЕР-МЕНЮ ==========
document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.getElementById('burgerMenu');
  const navLinks = document.getElementById('navLinks');
  const body = document.body;
  
  if (burgerMenu && navLinks) {
    // Открытие/закрытие меню
    burgerMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      burgerMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
    
    // Закрытие меню при клике на ссылку
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
      });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
      if (navLinks.classList.contains('active') && 
          !navLinks.contains(e.target) && 
          !burgerMenu.contains(e.target)) {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  }
});