// Функция для получения параметров из URL
function getQueryParam(key) {
    const params = new URLSearchParams(location.hash.split('?')[1]);
    return params.get(key);
}

const category = getQueryParam('category');

if (category) {
    document.getElementById('category-title').textContent = category;

    fetch(`http://localhost:3000/api/products?category=${category}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('products-container');
            container.innerHTML = data.map(p => `
                <div class="product-card">
                    <h3>${p.name}</h3>
                    <p>${p.price} ₽</p>
                </div>
            `).join('');
        })
        .catch(err => {
            console.error(err);
            document.getElementById('products-container').innerHTML = 'Ошибка загрузки товаров.';
        });
} else {
    document.getElementById('products-container').textContent = 'Категория не указана.';
}
