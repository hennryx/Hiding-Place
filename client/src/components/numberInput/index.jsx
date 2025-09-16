import React, { useState } from 'react'

const InputNumber = ({ cl="w-8 text-center", updateQuantity, id, quantity }) => {
    const [focusedProductId, setFocusedProductId] = useState(null);

    return (
        <input
            key={id}
            value={
                focusedProductId === id
                    ? quantity || ''
                    : quantity || 1
            }
            onFocus={() => {
                setFocusedProductId(id);
                if (quantity === 1) {
                    updateQuantity(id, '');
                }
            }}
            onBlur={() => {
                setFocusedProductId(null);
                if (!quantity) {
                    updateQuantity(id, 1);
                }
            }}
            onChange={(e) => updateQuantity(id, Number(e.target.value))}
            type="text"
            className={cl}
        />
    )
}

export default InputNumber