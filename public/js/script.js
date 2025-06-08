let cartID = 0;
const SERVER_URL = window.location.origin;
let user_info = {};

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

async function getCartID() {
    if (getCookie('cart_id')) {
        cartID = +getCookie('cart_id');
    } else {    
        let temp;
        await fetch(`${SERVER_URL}/api/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( { user_id: user_info.id } )
        })
        .then(res => res.json())
        .then(data => temp = data.id);
        document.cookie = `cart_id=${temp}; max-age=3600; path=/; secure; samesite=strict`;
        cartID = temp;
    }
}

async function getUserInfo() {
    await fetch(`${SERVER_URL}/api/user/${'chinathez'}`)
    .then(res => res.json())
    .then(data => user_info = data);
}

window.addEventListener('load', async () => {
    refreshApp();
    const overlay = document.createElement('div');
    overlay.classList.add('loader-overlay');
    const logo = document.createElement('div');
    logo.classList.add('logo');
    
    overlay.appendChild(logo);
    document.body.appendChild(overlay);

    setTimeout(() => {
        document.body.removeChild(overlay);
        document.querySelector(".header").classList.remove('hiden');
    }, 1000);
    await getUserInfo();
    await getCartID();
    console.log(cartID);
    if (window.Telegram && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.expand();
        const user = tg.initDataUnsafe.user;
        user_info.login = user.nickname;
        user_info.chat_id = user.id;
        console.log('User:', user);
    } else {
        console.log('Пожалуйста, открой это приложение внутри Telegram');
    }
});

async function navigate(page, params = {}) {
    const content = document.getElementById('content');
    
    await fetch(`pages/${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Страница не найдена');
            }
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;
            if (page === 'catalog') {
                renderCatalog();
            }
            if (page === 'catalog-main' && params.category_id && params.category_name) {
                renderCategory(params.category_id, params.category_name);
                console.log('catalog-main');
            }
            if (page === 'cart') {
                renderCart();
            }
            if (page === 'profile') {
                renderCabinet();
            }
        })
        .catch(error => {
            content.innerHTML = '<h2>Страница не найдена</h2>';
        });
}

function parseHash() {
    const hash = location.hash.slice(1);
    const [page, queryString] = hash.split('?');
    const params = {};

    if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
    }

    return { page: page || 'catalog', params };
}

function renderCatalog() {
    const catalogContainer = document.querySelector("#catalog");

    if (catalogContainer) {
        catalogContainer.innerHTML = `<div style="margin: 150px auto;">Loading...</div>`;
        fetch(`${SERVER_URL}/api/category`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    productsContainer.innerHTML = '<p>Товары не найдены.</p>';
                    return;
                }
                catalogContainer.innerHTML = '';
                for (let item of data)
                {
                    if (!item.products_amount) continue;
                    catalogContainer.innerHTML += `
                        <a class="catalog-item" href="#catalog-main?category_id=${item.id}&category_name=${item.name}">
                            <img src="${item.image_url}" alt="">
                            <div class="catalog-item__info">
                                <h3 class="catalog-item__title">${item.name}</h3>
                                <h6 class="catalog-item__amount">Товаров: ${item.products_amount}</h6>
                            </div>
                        </a>
                    `;
                }
            })
    }
}

function renderCategory(category, category_name) {
    console.log(category);
    const categoryTitle = document.getElementById('category-title');
    const productsContainer = document.getElementById('products-container');

    if (categoryTitle) {
        categoryTitle.textContent = decodeURIComponent(category_name);
    }

    if (productsContainer) {
        productsContainer.innerHTML = 'Загрузка...';

        fetch(`${SERVER_URL}/api/product?category_id=${encodeURIComponent(category)}`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    productsContainer.innerHTML = '<p>Товары не найдены.</p>';
                    return;
                }
                productsContainer.innerHTML = '';
                for (let item of data)
                {
                    if (item.product_types_amount === 0)
                        continue;
                    productsContainer.innerHTML += `
                        <div class="product-card" id="product-id-${item.id}">
                            <img src="${item.image_url}" alt="${item.name}">
                            <h3>${item.name}</h3>
                            <p>${item.price} BYN</p>
                            <button class="product-card__button" id="product-id-btn-${item.id}">В корзину</button>
                        </div>
                    `;

                    productsContainer.addEventListener('click', e => {
                        if (e.target && e.target.id === `product-id-btn-${item.id}`) {
                            showModalAddToCart(item.id, item.name, item.price, item.image_url);
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err);
                productsContainer.innerHTML = '<p>Ошибка загрузки товаров.</p>';
            });
    }
}

async function refreshApp() {
    const { page, params } = parseHash();
    await navigate(page, params);
}

window.addEventListener('hashchange', async () => {
    await refreshApp();
    console.log("HashChange");
});

async function showModalAddToCart(id, name, price, image) {
    let options = '';
    let data = [];
    
    try {
        const res = await fetch(`${SERVER_URL}/api/product/${encodeURIComponent(id)}`);
        const data1 = await res.json();
        data = data1.product_types.filter(item => item.available);
        
        data.forEach(item => {
            options += `<option value="${item.type}" id="type-${item.id}">${item.type}</option>`;
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return;
    }

    let amount = 1;
    let max_amount = data[0].amount;

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const modal = document.createElement('div');
    modal.classList.add("modal");

    modal.innerHTML = `
        <h2 class="modal__header">Добавить в корзину</h2>
        <div class="modal__img">
            <img src="${image}" alt="">
        </div>
        <h2 class="modal__header" style="margin: 10px;">${name}</h2>
        <p class="modal__price">${price} BYN</p>

        <div class="modal__product-type">
            <label for="product-type">Выбери вкус:</label>
            <select id="product-type" name="product-type">
                ${options}
            </select>
        </div>
        <div class="modal__amount">
            <label>Всего на складе: <span id="modal__max-amount-num">${max_amount}</span></label>
        </div>
        <div class="modal__amount">
            <label>Выбери количество:</label>
            <button id="modal__btn-minus">-</button>
            <span id="modal__amount-num">1</span>
            <button id="modal__btn-plus">+</button>
        </div>
        <div class="modal__btn-container">
            <button class="product-card__button" id="modal__btn--cancel">Отмена</button>
            <button class="product-card__button" id="modal__btn--add">Добавить</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const selectField = modal.querySelector('#product-type');
    selectField.addEventListener('change', () => {
        const temp = data.find(item => item.type === selectField.value);
        console.log(temp);
        max_amount = temp.amount;
        amount = 1;
        modal.querySelector('#modal__amount-num').innerText = amount;
        modal.querySelector('#modal__max-amount-num').innerText = max_amount;
    });

    const cancelButton = modal.querySelector('#modal__btn--cancel');
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    const addButton = modal.querySelector('#modal__btn--add');
    addButton.addEventListener('click', async () => {
        document.body.removeChild(overlay);
        let type = modal.querySelector('#product-type').value;
        item = {
            cart_id: cartID,
            product_type_id: data.find((item) => type === item.type).id,
            quantity: amount
        };
        const res = await fetch(`${SERVER_URL}/api/cart/add`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
    });

    const minusButton = modal.querySelector('#modal__btn-minus');
    minusButton.addEventListener('click', () => {
        if (amount >= 2) amount--;
        modal.querySelector('#modal__amount-num').innerText = amount;
    });

    const plusButton = modal.querySelector('#modal__btn-plus');
    plusButton.addEventListener('click', () => {
        if (amount < max_amount) amount++;
        modal.querySelector('#modal__amount-num').innerText = amount;
    });
}

function renderCart() {
    const mainContainer = document.querySelector('.cart__main');

    async function setItems() {
        const container = document.querySelector('#cart__container');
        const priceLabel = document.querySelector('#cart__footer-total-price-number');
        
        container.innerHTML = '';
        let cartArray;
        await fetch(`${SERVER_URL}/api/cart/${cartID}`)
            .then(res => res.json())
            .then(data => cartArray = data);
        const totalPrice = cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
        priceLabel.innerText = totalPrice;

        if (cartArray.length === 0) {
            
            mainContainer.innerHTML = `
            <div class="empty-cart">
                <div>В корзине ничего нет</div>
            </div>
        `;
        }
        for (let item of cartArray) {
            container.innerHTML += `
                <div class="cart__item">
                    <img src="${item.image}" alt="">
                    <div class="cart__name-label">${item.name}</div>
                    <div class="cart__price-label">${item.price}</div>
                    <div class="cart__type-label">${item.type}</div>
                    <div class="cart__amount-label">${item.quantity} шт.</div>
                </div>
            `;
        }
        
    }
    setItems();
    const clearBtn = document.querySelector('#cart__clear');
    const aproveBtn = document.querySelector('#cart__aprove');
    

    clearBtn.addEventListener('click', async () => {
        let cartArray = [];
        await fetch(`${SERVER_URL}/api/cart/${cartID}`)
            .then(res => res.json())
            .then(data => cartArray = data);
        for (let item of cartArray) {
            await fetch(`${SERVER_URL}/api/cart/delete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( { cart_id: item.cart_id, product_type_id: item.product_type_id } ),
            });
        }
        setItems();
    });
    aproveBtn.addEventListener('click', async () => {
        await fetch(`${SERVER_URL}/api/cart/send`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( { cart_id: cartID } ),
        });
        document.cookie = "cart_id=; max-age=0; path=/;";
        await getCartID();
        console.log(cartID);
        setItems();
        showAlert('Заказ отправлен');
    });
}

function showAlert(mes) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const modal = document.createElement('div');
    modal.classList.add("modal");

    modal.innerHTML = `
        <h2 class="modal__header">Добавить в корзину</h2>
        <h2 class="modal__header" style="margin: 10px;">${mes}</h2>
        <div class="modal__btn-container">
            <button class="product-card__button" id="modal__btn--cancel">Отмена</button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const cancelButton = modal.querySelector('#modal__btn--cancel');
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

async function renderCabinet() {
    document.querySelector('#nickname').innerText = user_info.login;
    const list = document.querySelector('#orders-list');
    list.innerHTML = '';

    try {
        const res = await fetch(`${SERVER_URL}/api/user/getcarts/${user_info.id}`);
        const data = await res.json();

        for (let item of data) {
            const orderHTML = `
                <div class="orders-item">
                    <div>
                        <p class="order-name">Заказ №${item.id}</p>
                        <p class="order-status">Статус: ${item.is_delivered ? "Доставлен" : "Ожидание"}</p>
                    </div>
                    <div>
                        <button class="product-card__button order-details-btn" data-id="${item.id}" style="margin: 0">Подробнее</button>
                    </div>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', orderHTML);
        }

        // Навешиваем обработчики после полной отрисовки
        document.querySelectorAll('.order-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.id;
                alert(`Нажат заказ ${orderId}`);
            });
        });

    } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
    }
}
