document.addEventListener('DOMContentLoaded', function () {

    //Start modal popup script
    const modalButtons = document.querySelectorAll('.js-open-modal'),
        overlay = document.querySelector('.js-overlay-modal'),
        closeButtons = document.querySelectorAll('.js-modal-close');

    modalButtons.forEach(function (item) {

        item.addEventListener('click', function (e) {
            e.preventDefault();

            const modalId = this.getAttribute('data-modal'),
                modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');

            modalElem.classList.add('active');
            overlay.classList.add('active');
        });
    });

    closeButtons.forEach(function (item) {
        item.addEventListener('click', function (e) {
            const parentModal = this.closest('.modal');

            parentModal.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    document.body.addEventListener('keyup', function (e) {
        const key = e.code;
        if (key == 'Escape') {

            document.querySelector('.modal.active').classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
        };
    }, false);

    overlay.addEventListener('click', function () {
        document.querySelector('.modal.active').classList.remove('active');
        this.classList.remove('active');
    });

    //End modal popup script

    const addToCardButtons = document.querySelectorAll('.product-card__add-to-cart');
    const cardCountElem = document.querySelector('.cart-count');
    const addToBasketButton = document.querySelector('.product-card__add-to-basket');
    const modalContentElement = document.querySelector('.modal__content');
    let totalProducts = localStorage.getItem('totalProducts') || 0;

    if (addToCardButtons) {
        //Start page parsing
        addToCardButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = button.closest('.product-card');
                const id = parent.getAttribute('id');

                //Fetch DOM from page
                fetch(location.href)
                    .then(response => response.text())
                    .then(text => {
                        const parser = new DOMParser();
                        const htmlDocument = parser.parseFromString(text, 'text/html');
                        const cardElement = htmlDocument.getElementById(id);
                        renderCardModal(cardElement, id);
                    })
            })
        })
    }

    //Render card modal
    function renderCardModal(elem, id) {
        const product = {
            link: elem.querySelector('.product-card__link')?.getAttribute('href'),
            image: elem.querySelector('.product-card__link img')?.getAttribute('src'),
            title: elem.querySelector('.product-card__title')?.textContent,
            inputValue : document.getElementById(id)?.querySelector('.counter__input')?.value,
            description: elem.querySelector('.product-card__description')?.textContent,
        }

        template =
            `${product.link && product.image ? `<a href="${product.link}" class="modal__link modal__cover">
        <img src="${product.image}" alt="Изображение товара" class="modal__image">
        </a>` : ''}
        ${product.title ? `<h4 class="modal__title">${product.title}</h4>` : ''}
        <div class="counter">
            <button class="counter__decrease">-</button>
            ${product.inputValue ? `<label><input type="text" class="counter__input" value="${product.inputValue}"></label>` : ''}
            <button class="counter__increase">+</button>
        </div>
        ${product.description ? `<p class="modal__description">${product.description}</p>` : ''}`;

        modalContentElement.innerHTML = template;
        const modalWindow = document.querySelector('.modal');
        changeInputValue(modalWindow);
    }

     //Decrease input value
    const counterDecrease = value => (value > 1 ? --value : 1);

     //Increase input value
    const counterIncrease = value => ++value;

    const cards = document.querySelectorAll('.product-card');

    //Initiate change input
    cards.forEach(card => {
        changeInputValue(card);
    })

    //Change input value by clicking on plus or minus buttons
    function changeInputValue(elem) {
        const input = elem.querySelector('.counter__input');
        let counter = 1;
        elem.addEventListener('click', (e) => {
            if (e.target.classList.contains('counter__increase')) {
                counter = counterIncrease(counter);
                input.value = counter;
                input.setAttribute('value', counter);
                return;
            }
            if (e.target.classList.contains('counter__decrease')) {
                counter = counterDecrease(counter);
                input.value = counter;
                input.setAttribute('value', counter);
                return;
            }
        })
    }

    //Initiate change total product number
    changeTotalProductsNumber();

    //Change total product number by clicking on add-to-basket button
    addToBasketButton.addEventListener('click', (e) => {
        e.preventDefault();
        setTotalProductsCounter();
        changeTotalProductsNumber();
        changeAddToBasketText();
    })

    //Set total product counter
    function setTotalProductsCounter(){
        const parent = addToBasketButton.closest('.modal');
        const inputValue = parent.querySelector('.counter__input')?.getAttribute('value');
        totalProducts = +totalProducts + Number(inputValue);
        localStorage.setItem('totalProducts', totalProducts);
    }

    //Change total product number
    function changeTotalProductsNumber() {
        totalProducts > 0 ? cardCountElem.innerHTML = totalProducts : cardCountElem.innerHTML = '';
    }

    //Change add-to-basket button active view
    function changeAddToBasketText() {
        addToBasketButton.textContent = 'Товар добавлен!';
        addToBasketButton.classList.add('active');
        setTimeout(() => {
            addToBasketButton.textContent = 'Добавить в корзину';
            addToBasketButton.classList.remove('active');
        }, 2000);
    }

});