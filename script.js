const inputProduct = document.querySelector(".insert-products");
const addProduct = document.querySelector(".add");

const productsList = document.querySelector(".list");

//verifica se tem texto no input
const validateInput = () => inputProduct.value.trim().length > 0;

const handleAddProduct = () => {
    const inputIsValid = validateInput();

    //verifica se o input é valido, se não for, muda a cor do input para vermelho(erro)
    if (!inputIsValid) {
        return inputProduct.classList.add("error");
    }

    //cria uma "div" para cada produto adicionado
    const productItemList = document.createElement("div");
    productItemList.classList.add("product");

    //cria um "p" para cada produto adicionado
    const productName = document.createElement("p");
    productName.innerText = inputProduct.value;

    //EventListener para um clique no "p"
    productName.addEventListener("click", () => handleClick(productName));

    //cria um "i" com a imagem de um lixo para apagar o produtos
    const deleteProduct = document.createElement("i");
    deleteProduct.classList.add("ri-delete-bin-line");

    //EventListener para um clique no botão delete
    deleteProduct.addEventListener("click", () => 
        handleDeleteClick(productItemList, productName)
    );

    //adiciona o "p"(filho) e o "i"(filho) dentro da "div"(pai)
    productItemList.appendChild(productName);
    productItemList.appendChild(deleteProduct);

    //adiciona a "div" criada dentro do JS em uma já existente no HTML
    productsList.appendChild(productItemList);

    //limpa o imput depois de adicionar o produto
    inputProduct.value = "";

    updateLocalStorage();
};

const handleClick = (productName) => {
    //pega todos os itens dentro da div "productsList"
    const products = productsList.childNodes;

    //faz um loop nos itens selecionados para encontrar o que estamos clicando e após o clique, adiciona uma classe no escolhido
    for (const product of products) {
        if (product.firstChild == productName) { // == substitui o "isSameNode"
            product.firstChild.classList.toggle("completed");
        }
    }

    updateLocalStorage();
};

const handleDeleteClick = (productItemList, productName) => {
    //pega todos os itens dentro da div "productsList"
    const products = productsList.childNodes;

    //faz um loop nos itens selecionados para encontrar o que estamos clicando e após o clique, apaga toda a "div"
    for (const product of products)  { // == substitui o "isSameNode"
        if (product.firstChild == productName) {
            productItemList.remove()
        }
    }

    updateLocalStorage();
};

//verifica se depois do erro há texto no input para remover o erro
const handleInputChange = () => {
    const inputIsValid = validateInput();

    if (inputIsValid) {
        return inputProduct.classList.remove("error");
    }
};

//atualiza o local storage a cada adição, atualização ou exclusão de uma informação
const updateLocalStorage = () => {
    const products = productsList.childNodes;

    const localStorageProducts = [...products].map((product) => {
        const content = product.firstChild;

        //verifica se content é um elemento antes de acessar suas propriedades
        if (content && content.nodeType === Node.ELEMENT_NODE) {
            const isCompleted = content.classList.contains("completed");
            return { description: content.innerText, isCompleted };
        } else {
            //console.warn("Primeiro filho não é um elemento válido:", product);
            return null;
        }
    }).filter(product => product !== null);

    localStorage.setItem("products", JSON.stringify(localStorageProducts));
};

//puxa as infos do local storage para a visualização após um refresh
const refreshProductsUsingLocalStorage = () => {
    const productsFromLocalStorage = JSON.parse(localStorage.getItem("products"));

    if (!productsFromLocalStorage) return;

    for (const product of productsFromLocalStorage) {
        const productItemList = document.createElement("div");
        productItemList.classList.add("product");

        const productName = document.createElement("p");
        productName.innerText = product.description;

        if (product.isCompleted) {
            productName.classList.add("completed");
        };

        productName.addEventListener("click", () => handleClick(productName));

        const deleteProduct = document.createElement("i");
        deleteProduct.classList.add("ri-delete-bin-line");

        deleteProduct.addEventListener("click", () => 
            handleDeleteClick(productItemList, productName)
        );

        productItemList.appendChild(productName);
        productItemList.appendChild(deleteProduct);
        
        productsList.appendChild(productItemList);
    }
};

refreshProductsUsingLocalStorage();

addProduct.addEventListener("click", () => handleAddProduct());

inputProduct.addEventListener("change", () => handleInputChange());