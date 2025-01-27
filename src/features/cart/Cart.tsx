import React from "react";
import styles from "./Cart.module.css";
import { useAppSelector, useAppDispatch } from "./../../app/hook";
import { getTotalPrice,removeFromCart, updateQuantity } from "./cartSlice";
import classNames from "classnames";

export function Cart() {
  const dispatch = useAppDispatch()
  const products = useAppSelector(state => state.products.products)
  const items = useAppSelector(state => state.cart.items)
  const totalPrice = useAppSelector(getTotalPrice)
  const checkoutState = useAppSelector(state => state.cart.checkoutState)

  function onQuantityChanged(e: React.FocusEvent<HTMLInputElement>, id:string)  {
    const quantity = Number(e.target.value) || 0;
    dispatch(updateQuantity({id,quantity}))
  }

  function onCheckout(e : React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    dispatch({type: " cart/checkout/pending "})
  }

  const tableClasses = classNames({
      [styles.table]:true,
      [styles.checkoutError]: checkoutState === "ERROR",
      [styles.checkoutLoading]: checkoutState === "LOADING",
  })
  
  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([id,quantity]) => (
            <tr>
              <td>{products[id].name}</td>
              <td>
                <input 
                  type="text" 
                  className={styles.input} 
                  defaultValue={quantity} 
                  onBlur={(e) => onQuantityChanged(e, id)}
                />
              </td>
              <td>${products[id].price}</td>
              <td>
                <button 
                  aria-label={`Remove ${products[id].name} from Shopping Cart`}
                  onClick = { () => dispatch(removeFromCart(id)) }
                >
                  X
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>Football Cleats</td>
            <td>
              <input type="text" className={styles.input} defaultValue={17} />
            </td> 
            <td>$25.99</td>
            <td>
              <button aria-label="Remove Football Cleats from Shopping Cart">
                X
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={onCheckout}>
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}