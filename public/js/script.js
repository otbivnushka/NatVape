let cartArray = JSON.parse(localStorage.getItem('cartArray')) || [];
const SERVER_URL = "http://localhost:3000";

function navigate(page, params = {}) {
    const content = document.getElementById('content');
    
    fetch(`pages/${page}.html`)
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
            if (page === 'catalog-main' && params.category) {
                renderCategory(params.category);
                console.log('catalog-main');
            }
            if (page === 'cart') {
                renderCart();
            }
        })
        .catch(error => {
            content.innerHTML = '<h2>Страница не найдена</h2>';
        });
}

function parseHash() {
    const hash = location.hash.slice(1); // убираем #
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

}

function renderCategory(category) {
    const categoryTitle = document.getElementById('category-title');
    const productsContainer = document.getElementById('products-container');

    if (categoryTitle) {
        categoryTitle.textContent = decodeURIComponent(category);
    }

    if (productsContainer) {
        productsContainer.innerHTML = 'Загрузка...';

        fetch(`${SERVER_URL}/api/products?category=${encodeURIComponent(category)}`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    productsContainer.innerHTML = '<p>Товары не найдены.</p>';
                    return;
                }
                productsContainer.innerHTML = '';
                for (let item of data)
                {
                    productsContainer.innerHTML += `
                        <div class="product-card" id="product-id-${item.id}">
                            <img src="${item.image}" alt="${item.name}">
                            <h3>${item.name}</h3>
                            <p>${item.price} BYN</p>
                            <button class="product-card__button" id="product-id-btn-${item.id}">В корзину</button>
                        </div>
                    `;

                    productsContainer.addEventListener('click', e => {
                        if (e.target && e.target.id === `product-id-btn-${item.id}`) {
                            showModalAddToCart(item.id, item.name, item.price, item.image);
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

function refreshApp() {
    const { page, params } = parseHash();
    navigate(page, params);
}
refreshApp();
window.addEventListener('hashchange', () => {
    refreshApp();
    console.log("HashChange");
});

async function showModalAddToCart(id, name, price, image) {
    let options = '';
    
    // Получаем данные из API
    try {
        const res = await fetch(`${SERVER_URL}/api/product-types?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        console.log(data);
        
        data.forEach(item => {
            if (item.available) {
                options += `<option value="${item.type}" id="type-${item.id}">${item.type}</option>`;
            }
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return; // Прерываем выполнение, если произошла ошибка при запросе.
    }

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
    let amount = 1;

    const cancelButton = modal.querySelector('#modal__btn--cancel');
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    const deleteButton = modal.querySelector('#modal__btn--add');
    deleteButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        let type = modal.querySelector('#product-type').value;
        item = {
            id: id,
            name: name,
            price: +price,
            type: type,
            amount: amount,
            image: image
        };
        cartArray.push(item);
        localStorage.setItem('cartArray', JSON.stringify(cartArray));
    });

    const minusButton = modal.querySelector('#modal__btn-minus');
    minusButton.addEventListener('click', () => {
        if (amount >= 2) amount--;
        modal.querySelector('#modal__amount-num').innerText = amount;
    });

    const plusButton = modal.querySelector('#modal__btn-plus');
    plusButton.addEventListener('click', () => {
        amount++;
        modal.querySelector('#modal__amount-num').innerText = amount;
    });
}

function renderCart() {
    const totalPrice = cartArray.reduce((total, item) => total + item.price * item.amount, 0);
    const mainContainer = document.querySelector('.cart__main');
    if (totalPrice === 0) {
        mainContainer.innerHTML = `
            <div>
                <div>В корзине ничего нет</div>
            </div>
        `;
        return;
    }
    function setItems() {
        const container = document.querySelector('#cart__container');
        const priceLabel = document.querySelector('#cart__footer-total-price-number');
        
        priceLabel.innerText = totalPrice;
        container.innerHTML = '';
        if (cartArray.length === 0) {
            
            mainContainer.innerHTML = `
            <div>
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
                    <div class="cart__amount-label">${item.amount} шт.</div>
                </div>
            `;
        }
        
    }
    setItems();
    const clearBtn = document.querySelector('#cart__clear');
    const aproveBtn = document.querySelector('#cart__aprove');
    

    clearBtn.addEventListener('click', () => {
        cartArray = [];
        localStorage.setItem('cartArray', JSON.stringify(cartArray));
        setItems();
    });
    aproveBtn.addEventListener('click', () => {
        if (cartArray.length != 0)
            console.log('Отправить админу');
    });
}