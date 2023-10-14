// PricingCard.js
import React, { useEffect } from 'react';

var cbInstance, cart;

function openCheckout() {
    const planPriceId = 'diamond-USD-monthly'; // Plan price point ID is used to identify the product
    const planPriceQuantity = 1;
    const product = cbInstance.initializeProduct(planPriceId, planPriceQuantity);
    cart.replaceProduct(product);

    // Adding an addon
    product.addAddon({
        id: "silver-pass-USD-monthly",
        quantity: 2
    });

    // Adding a coupon
    product.addCoupon("fourty");

    // Dynamically changing Plan quantity using setPlanQuantity
    product.setPlanQuantity(planPriceQuantity);

    // Removing Addons using removeAddon
    product.removeAddon("silver-pass-USD-monthly"); // Addon price point ID

    // Passing values for custom fields
    product.setCustomData({ referral: "yes", corporate_agent: "no" });

    // Opening the checkout
    cart.proceedToCheckout();
}

function PricingCard({ plan, price, features }) {

    useEffect(() => {
        cbInstance = window.Chargebee.init({
            site: "getklippie-test",
            isItemsModel: true,
        });

        cbInstance.setCheckoutCallbacks(function (cart) {
            return {
                success: function (hpid) {
                    console.log('success', hpid);
                }
            };
        });

        cart = cbInstance.getCart();
    }, []);
    return (
        <div className="bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 text-white rounded-lg shadow-lg text-center p-6">
            <h2 className="text-2xl font-semibold mb-4">{plan}</h2>
            <p className="text-4xl font-extrabold mb-4">${price}</p>
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <svg
                            className="w-4 h-4 text-green-500 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                        <span className="ml-2 text-gray-200">{feature}</span>
                    </li>
                ))}
            </ul>
            <button className="mt-6 bg-yellow-400 text-blue-900 font-semibold py-2 px-4 rounded hover:bg-yellow-500 transition-colors duration-300" onClick={openCheckout}>
                Get Started
            </button>
        </div>
    );
}

export default PricingCard;
