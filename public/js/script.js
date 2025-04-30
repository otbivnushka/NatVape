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

            // Если есть параметры, например для catalog-main
            if (page === 'catalog-main' && params.category) {
                renderCategory(params.category);
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

function renderCategory(category) {
    const categoryTitle = document.getElementById('category-title');
    const productsContainer = document.getElementById('products-container');

    if (categoryTitle) {
        categoryTitle.textContent = decodeURIComponent(category);
    }

    if (productsContainer) {
        productsContainer.innerHTML = 'Загрузка...';

        fetch(`http://localhost:3000/api/products?category=${encodeURIComponent(category)}`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    productsContainer.innerHTML = '<p>Товары не найдены.</p>';
                    return;
                }

                productsContainer.innerHTML = data.map(p => `
                    <div class="product-card">
                        <img src="${p.image}" alt="${p.name}">
                        <h3>${p.name}</h3>
                        <p>${p.price} BYN</p>
                        <button class="product-card__button">В корзину<button>
                    </div>
                `).join('');
            })
            .catch(err => {
                console.error(err);
                productsContainer.innerHTML = '<p>Ошибка загрузки товаров.</p>';
            });
    }
}


window.addEventListener('load', () => {
    const { page, params } = parseHash();
    navigate(page, params);
});

window.addEventListener('hashchange', () => {
    const { page, params } = parseHash();
    navigate(page, params);
});
