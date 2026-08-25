// SEARCH
 
const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-form");
 
if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", () => {
        searchPanel.classList.toggle("active");
 
        if (searchPanel.classList.contains("active") && searchInput) {
            searchInput.focus();
        }
    });
}
 
if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
 
        const searchValue = searchInput.value.trim();
 
        if (searchValue === "") return;
 
        console.log("Searching for:", searchValue);
    });
}
 
 
// CART
 
const cartToggle = document.querySelector(".cart-toggle");
const cartDrawer = document.querySelector(".cart-drawer");
const cartClose = document.querySelector(".cart-close");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total span");
const checkoutButton = document.querySelector(".checkout-btn");
 
let cart = [];
 
if (cartToggle && cartDrawer) {
    cartToggle.addEventListener("click", () => {
        cartDrawer.classList.add("active");
    });
}
 
if (cartClose && cartDrawer) {
    cartClose.addEventListener("click", () => {
        cartDrawer.classList.remove("active");
    });
}
 
 
// RENDER CART
 
function renderCart() {
 
    if (!cartItems) return;
 
    cartItems.innerHTML = "";
 
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="cart-empty">
                Your cart is empty.
            </p>
        `;
 
        updateCartTotal();
        return;
    }
 
    cart.forEach((product, index) => {
 
        const item = document.createElement("div");
 
        item.classList.add("cart-item");
 
        item.innerHTML = `
            <div class="cart-item-info">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </div>
 
            <div class="cart-item-actions">
 
                <button
                    class="quantity-btn decrease"
                    data-index="${index}"
                    type="button">
                    -
                </button>
 
                <span class="quantity">
                    ${product.quantity}
                </span>
 
                <button
                    class="quantity-btn increase"
                    data-index="${index}"
                    type="button">
                    +
                </button>
 
                <button
                    class="remove-item"
                    data-index="${index}"
                    type="button">
                    Remove
                </button>
 
            </div>
        `;
 
        cartItems.appendChild(item);
    });
 
    updateCartTotal();
}
 
 
// CART TOTAL
 
function updateCartTotal() {
 
    if (!cartTotal) return;
 
    let total = 0;
 
    cart.forEach((product) => {
        total += product.price * product.quantity;
    });
 
    cartTotal.textContent = `$${total.toFixed(2)}`;
}
 
 
// ADD TO CART (delegated so it also works for the quick-view modal)
 
function addProductToCart(name, price) {
 
    const existingProduct = cart.find(
        (product) => product.name === name
    );
 
    if (existingProduct) {
 
        existingProduct.quantity += 1;
 
    } else {
 
        cart.push({
            name,
            price,
            quantity: 1
        });
    }
 
    renderCart();
 
    if (cartDrawer) {
        cartDrawer.classList.add("active");
    }
}
 
document.addEventListener("click", (event) => {
 
    const button = event.target.closest(".add-to-cart");
 
    if (!button) return;
 
    const source = button.closest(".product-card") || button.closest(".quick-view-modal");
 
    if (!source) return;
 
    let productName;
    let productPrice;
 
    if (source.classList.contains("quick-view-modal")) {
        productName = source.dataset.name;
        productPrice = Number(source.dataset.price);
    } else {
        productName = source.dataset.name;
        productPrice = Number(source.dataset.price);
    }
 
    if (!productName) return;
 
    addProductToCart(productName, productPrice);
});
 
 
// CART QUANTITY
 
if (cartItems) {
 
    cartItems.addEventListener("click", (event) => {
 
        const button = event.target;
 
        if (button.classList.contains("increase")) {
 
            const index = Number(button.dataset.index);
 
            cart[index].quantity += 1;
 
            renderCart();
        }
 
        if (button.classList.contains("decrease")) {
 
            const index = Number(button.dataset.index);
 
            cart[index].quantity -= 1;
 
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
 
            renderCart();
        }
 
        if (button.classList.contains("remove-item")) {
 
            const index = Number(button.dataset.index);
 
            cart.splice(index, 1);
 
            renderCart();
        }
    });
}
 
 
// CHECKOUT
 
if (checkoutButton) {
 
    checkoutButton.addEventListener("click", () => {
 
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
 
        console.log("Proceeding to checkout...");
    });
}
 
 
// WISHLIST
 
let wishlist = [];
 
const wishlistLinks = document.querySelectorAll(
    'a[href="#wishlist"]'
);
 
wishlistLinks.forEach((link) => {
 
    link.addEventListener("click", (event) => {
        event.preventDefault();
 
        console.log("Wishlist clicked");
    });
});
 
document.addEventListener("click", (event) => {
 
    const button = event.target.closest(".wishlist-btn");
 
    if (!button) return;
 
    const source = button.closest(".product-card") || button.closest(".quick-view-modal");
 
    if (!source) return;
 
    const productName = source.dataset.name;
    const productPrice = Number(source.dataset.price);
 
    if (!productName) return;
 
    const existingProduct = wishlist.find(
        (product) => product.name === productName
    );
 
    if (existingProduct) {
 
        wishlist = wishlist.filter(
            (product) => product.name !== productName
        );
 
    } else {
 
        wishlist.push({
            name: productName,
            price: productPrice
        });
    }
 
    button.classList.toggle("active");
 
    // keep every wishlist button for this product in sync (card + modal)
    document
        .querySelectorAll(`.wishlist-btn`)
        .forEach((otherButton) => {
            const otherSource = otherButton.closest(".product-card") || otherButton.closest(".quick-view-modal");
 
            if (otherSource && otherSource.dataset.name === productName && otherButton !== button) {
                otherButton.classList.toggle("active", button.classList.contains("active"));
            }
        });
});
 
 
// NEWSLETTER
 
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterInput = document.querySelector(
    '.newsletter-form input[type="email"]'
);
 
if (newsletterForm) {
 
    newsletterForm.addEventListener("submit", (event) => {
 
        event.preventDefault();
 
        const email = newsletterInput.value.trim();
 
        if (email === "") {
            alert("Please enter your email.");
            return;
        }
 
        if (!email.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }
 
        alert("Thank you for subscribing!");
 
        newsletterForm.reset();
    });
}
 
 
// QUICK VIEW MODAL (used by "Quick view" and "View Product" buttons,
// keeps everything on the same page instead of opening a new file)
 
const quickViewOverlay = document.querySelector(".quick-view-overlay");
const quickViewModal = document.querySelector(".quick-view-modal");
const quickViewClose = document.querySelector(".quick-view-close");
const quickViewImage = document.querySelector(".quick-view-image img");
const quickViewCategory = document.querySelector(".quick-view-info .product-category");
const quickViewName = document.querySelector(".qv-name");
const quickViewPrice = document.querySelector(".qv-price");
const quickViewWishlist = document.querySelector(".quick-view-info .wishlist-btn");
 
function openQuickView(productCard) {
 
    if (!quickViewOverlay || !productCard) return;
 
    const name = productCard.dataset.name;
    const price = productCard.dataset.price;
    const category = productCard.dataset.category || "";
    const image = productCard.querySelector(".product-image img");
 
    quickViewModal.dataset.name = name;
    quickViewModal.dataset.price = price;
 
    if (quickViewImage && image) {
        quickViewImage.src = image.src;
        quickViewImage.alt = image.alt;
    }
 
    if (quickViewCategory) quickViewCategory.textContent = category;
    if (quickViewName) quickViewName.textContent = name;
    if (quickViewPrice) quickViewPrice.textContent = `$${price}`;
 
    if (quickViewWishlist) {
        const alreadyWished = wishlist.some((product) => product.name === name);
        quickViewWishlist.classList.toggle("active", alreadyWished);
    }
 
    quickViewOverlay.classList.add("active");
}
 
function closeQuickView() {
    if (quickViewOverlay) {
        quickViewOverlay.classList.remove("active");
    }
}
 
document.addEventListener("click", (event) => {
 
    const trigger = event.target.closest(".quick-view-btn");
 
    if (!trigger) return;
 
    const productCard = trigger.closest(".product-card");
 
    openQuickView(productCard);
});
 
if (quickViewClose) {
    quickViewClose.addEventListener("click", closeQuickView);
}
 
if (quickViewOverlay) {
    quickViewOverlay.addEventListener("click", (event) => {
        if (event.target === quickViewOverlay) {
            closeQuickView();
        }
    });
}
 
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeQuickView();
    }
});
 
 
// CATEGORY FILTERING (Women / Men / All) — stays on the same page,
// scrolls to the shop section and shows/hides matching product cards
 
const shopSection = document.getElementById("shop");
const shopProducts = document.querySelectorAll("#featured-products .product-card");
const filterButtons = document.querySelectorAll(".filter-btn");
const shopHeading = document.getElementById("shop-heading");
const navLinkEls = document.querySelectorAll(".nav-links a");
 
function applyFilter(filterValue) {
 
    shopProducts.forEach((card) => {
        const matches = filterValue === "all" || card.dataset.category === filterValue;
        card.classList.toggle("is-hidden", !matches);
    });
 
    filterButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filterValue);
    });
 
    if (shopHeading) {
        shopHeading.textContent = filterValue === "all" ? "Featured Pieces" : filterValue;
    }
}
 
function setActiveNavLink(filterValue) {
 
    navLinkEls.forEach((link) => {
        const linkFilter = link.dataset.filter;
 
        if (linkFilter === undefined) {
            link.classList.remove("active");
            return;
        }
 
        link.classList.toggle("active", linkFilter === filterValue);
    });
}
 
filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        applyFilter(btn.dataset.filter);
        setActiveNavLink(btn.dataset.filter);
    });
});
 
document.querySelectorAll("[data-filter]").forEach((el) => {
 
    el.addEventListener("click", (event) => {
 
        const filterValue = el.dataset.filter;
 
        if (!filterValue || !shopSection) return;
 
        event.preventDefault();
 
        applyFilter(filterValue);
        setActiveNavLink(filterValue);
 
        shopSection.scrollIntoView({ behavior: "smooth" });
 
        if (document.querySelector(".nav-links.active")) {
            document.querySelector(".nav-links").classList.remove("active");
        }
    });
});
 
 
// SMOOTH SCROLL (for links without a filter, e.g. #home, #sale, #new-arrivals)
 
const navigationLinks = document.querySelectorAll(
    'a[href^="#"]:not([data-filter])'
);
 
navigationLinks.forEach((link) => {
 
    link.addEventListener("click", (event) => {
 
        const targetId = link.getAttribute("href");
 
        if (
            !targetId ||
            targetId === "#" ||
            targetId === "#wishlist"
        ) {
            return;
        }
 
        const target = document.querySelector(targetId);
 
        if (!target) return;
 
        event.preventDefault();
 
        target.scrollIntoView({
            behavior: "smooth"
        });
 
        if (document.querySelector(".nav-links.active")) {
            document.querySelector(".nav-links").classList.remove("active");
        }
    });
});
 
 
// SCROLL REVEAL
 
const sections = document.querySelectorAll("section");
 
const observer = new IntersectionObserver(
    (entries) => {
 
        entries.forEach((entry) => {
 
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
 
    },
    {
        threshold: 0.15
    }
);
 
sections.forEach((section) => {
    observer.observe(section);
});
 
 
renderCart();
const backToTop = document.querySelector(".back-to-top");
 
window.addEventListener("scroll", () => {
 
    if (window.scrollY > 500) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
 
});
 
backToTop.addEventListener("click", () => {
 
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
 
});
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
 
menuToggle.addEventListener("click", () => {
 
    navLinks.classList.toggle("active");
 
});
 