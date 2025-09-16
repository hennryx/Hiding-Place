import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import InputNumber from "../../../../components/numberInput";
import useProductsStore from "../../../../services/stores/products/productsStore";
import ICONS from "../../../../services/utilities/ICONS";
import useAuthStore from "../../../../services/stores/authStore";
import NoImage from "../../../../assets/No-Image.webp";
import { NAL } from "../../../../components/modalAlert";

const Cart = ({ cart, setCart }) => {
  const { token, auth } = useAuthStore();
  const { deducProduct } = useProductsStore();
  const [totalAmount, setTotalAmount] = useState(0);
  const { ShoppingCart, Delete } = ICONS;

  const updateQuantity = async (productId, newQuantity) => {
    const product = cart.find((item) => item.id === productId);
    if (!isNaN(newQuantity) && product && newQuantity > product.maxQuantity) {
      await NAL({
        title: "Stock Limit Reached",
        text: `Only ${product.maxQuantity} item(s) available in stock`,
        icon: "warning",
        confirmText: "Ok",
      });
      return;
    }

    if (!isNaN(newQuantity) && Number(newQuantity) < 0) {
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      await NAL({
        title: "Empty Cart",
        text: "Please add products to your cart before checkout",
        icon: "warning",
        confirmText: "Ok",
      });
      return;
    }

    // Generate receipt HTML
    const receiptDate = new Date().toLocaleString();
    const receiptNo = `RCP${Date.now().toString().slice(-6)}`;

    let receiptHTML = `
            <div style="font-family: 'Courier New', monospace; text-align: left; max-width: 400px; margin: 0 auto; background: white; padding: 20px; border: 1px solid #ccc;">
                <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                    <h2 style="margin: 0; font-size: 18px;">SALES RECEIPT</h2>
                    <p style="margin: 5px 0; font-size: 12px;">Receipt #: ${receiptNo}</p>
                    <p style="margin: 5px 0; font-size: 12px;">${receiptDate}</p>
                    <p style="margin: 5px 0; font-size: 12px;">Cashier: ${
                      auth.firstName || "Staff"
                    }</p>
                </div>
                
                <div style="border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
        `;

    let subtotal = 0;
    let totalSavings = 0;

    cart.forEach((item) => {
      const originalItemTotal = item.quantity * item.price;
      const discountedItemTotal = calculateItemTotal(item);
      const itemSavings = originalItemTotal - discountedItemTotal;

      subtotal += originalItemTotal;
      totalSavings += itemSavings;

      receiptHTML += `
                <div style="margin-bottom: 8px; font-size: 12px;">
                    <div style="font-weight: bold;">${item.name}</div>
                    <div style="display: flex; justify-content: space-between; margin-left: 10px;">
                        <span>${item.quantity} x ₱${item.price.toFixed(
        2
      )}</span>
                        <span>₱${originalItemTotal.toFixed(2)}</span>
                    </div>
            `;

      receiptHTML += `</div>`;
    });

    receiptHTML += `
                </div>
                
                <div style="font-size: 14px; line-height: 1.5;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Subtotal:</span>
                        <span>₱${subtotal.toFixed(2)}</span>
                    </div>
        `;

    if (totalSavings > 0) {
      receiptHTML += `
                    <div style="display: flex; justify-content: space-between; color: #22c55e;">
                        <span>Total Savings:</span>
                        <span>-₱${totalSavings.toFixed(2)}</span>
                    </div>
            `;
    }

    receiptHTML += `
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; border-top: 1px solid #000; padding-top: 5px; margin-top: 5px;">
                        <span>TOTAL:</span>
                        <span>₱${totalAmount.toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000; font-size: 11px;">
                    <p style="margin: 5px 0;">Thank you for your purchase!</p>
                    <p style="margin: 5px 0;">Items: ${cart.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}</p>
                    ${
                      totalSavings > 0
                        ? `<p style="margin: 5px 0; color: #22c55e; font-weight: bold;">You saved ₱${totalSavings.toFixed(
                            2
                          )} today!</p>`
                        : ""
                    }
                </div>
            </div>
        `;

    const result = await Swal.fire({
      title: "Review Receipt",
      html: receiptHTML,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Complete Sale",
      cancelButtonText: "Cancel",
      width: "500px",
      customClass: {
        popup: "receipt-popup",
      },
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    });

    if (result.isConfirmed) {
      const saleData = {
        items: cart.map((item) => {
          return {
            product: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          };
        }),
        transactionType: "SALE",
        totalAmount: totalAmount,
        notes: "",
        createdBy: auth._id,
        page: 1,
        limit: 10,
      };

      await deducProduct(saleData, token);
    }
  };

  const calculateItemTotal = (item) => {
    let itemTotal = item.quantity * item.price;
    return itemTotal;
  };

  useEffect(() => {
    let total = cart.reduce((sum, item) => {
      const itemTotal = calculateItemTotal(item);
      return sum + itemTotal;
    }, 0);

    if (isNaN(total)) total = 0;
    setTotalAmount(total);
  }, [cart]);

  return (
    <div className="w-full md:w-1/3 bg-[var(--card-color)] rounded-lg shadow-md p-4 flex flex-col max-h-[90%]">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl text-[var(--primary-color)] font-semibold">
          Orders
        </h2>
        <div className="bg-[var(--primary-color)]/10 text-[var(--primary-color)] p-2 rounded-full">
          <ShoppingCart className="h-5 w-5" />
        </div>
      </div>

      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-[var(--text-secondary)]">
          <ShoppingCart className="h-12 w-12 mb-4" />
          <p>Your cart is empty</p>
          <p className="text-sm">Click on products to add them to cart</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4">
        {cart.length > 0 &&
          cart.map((item) => {
            const originalTotal = item.quantity * item.price;
            const discountedTotal = calculateItemTotal(item);

            return (
              <div
                key={item.id}
                className="p-3 border-b border-[var(--text-secondary)] space-y-2"
              >
                {/* Product Info Row */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.image?.url || NoImage}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = NoImage;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-secondary)] text-sm">
                        ₱{item.price}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                  >
                    <Delete className="h-4 w-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-[var(--secondary-color)] rounded-md text-sm"
                    >
                      -
                    </button>
                    <InputNumber
                      updateQuantity={updateQuantity}
                      id={item.id}
                      quantity={item.quantity}
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-[var(--secondary-color)] rounded-md text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="border-t border-[var(--text-secondary)] pt-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[var(--text-secondary)]">Subtotal:</span>
          <span className="font-semibold">₱{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-[var(--text-secondary)]">Total:</span>
          <span className="font-bold text-lg">₱{totalAmount.toFixed(2)}</span>
        </div>

        <button
          onClick={completeSale}
          className="w-full py-3 bg-[var(--primary-color)] text-[var(--text-primary-color)] rounded-md font-semibold hover:bg-[var(--primary-hover-color)]"
        >
          Place order
        </button>
      </div>
    </div>
  );
};

export default Cart;
