
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

import {
  X,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Package,
  ScanLine,
  Truck,
  Tag,
  Check,
  CreditCard,
  MapPin,
  LockKeyhole,
  CheckCircle2,
} from 'lucide-react';

import { useCart } from '../../context/CartContext.jsx';
import './CartDrawer.scss';

const money = (amount) =>
  `PKR ${Math.round(Number(amount) || 0).toLocaleString('en-PK')}`;

const SHIPPING = {
  standard: {
    label: 'Standard Delivery',
    fee: 250,
    days: '3–5 business days',
  },
  express: {
    label: 'Express Delivery',
    fee: 600,
    days: '1–2 business days',
  },
};

const COUPONS = {
  VELOX10: {
    type: 'percent',
    value: 10,
    label: '10% OFF',
    min: 5000,
  },
  FIRST500: {
    type: 'fixed',
    value: 500,
    label: 'PKR 500 OFF',
    min: 10000,
  },
  MOTION15: {
    type: 'percent',
    value: 15,
    label: '15% OFF',
    min: 30000,
  },
};

const PAYMENT_OPTIONS = [
  {
    id: 'visa',
    name: 'Visa',
    detail: 'Credit / Debit Card',
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    detail: 'Credit / Debit Card',
  },
  {
    id: 'amex',
    name: 'American Express',
    detail: 'Credit Card',
  },
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    detail: 'Mobile Wallet',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    detail: 'Mobile Wallet',
  },
];

const initialCustomer = {
  name: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  postalCode: '',
};

function PaymentBadge({ method }) {
  const labels = {
    visa: 'VISA',
    mastercard: 'MC',
    amex: 'AMEX',
    easypaisa: 'easypaisa',
    jazzcash: 'JazzCash',
  };

  return (
    <span
      className={`vc-payment-logo vc-payment-logo--${method}`}
    >
      {labels[method] || method}
    </span>
  );
}

function CartDrawer({ isOpen, onClose }) {
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);
  const contentRef = useRef(null);

  const {
    cart,
    totalItems,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [step, setStep] = useState('cart');
  const [shipping, setShipping] = useState('standard');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const [payment, setPayment] = useState('visa');

  const [customer, setCustomer] = useState(initialCustomer);
  const [formError, setFormError] = useState('');

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const coupon = COUPONS[appliedCoupon];

  const discount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(subtotal, coupon.value)
    : 0;

  const deliveryFee =
    cart.length > 0 ? SHIPPING[shipping].fee : 0;

  const total =
    Math.max(0, subtotal - discount) + deliveryFee;

  // Drawer is controlled by CSS only.
  // No GSAP transform is applied here.

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) {
        return;
      }

      const focusable = Array.from(
        drawerRef.current.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled)'
        )
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (
      appliedCoupon &&
      COUPONS[appliedCoupon] &&
      subtotal < COUPONS[appliedCoupon].min
    ) {
      setAppliedCoupon('');
      setCouponMessage(
        'Coupon removed because the minimum order value is no longer met.'
      );
    }
  }, [subtotal, appliedCoupon]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

  const applyCoupon = (event) => {
    event.preventDefault();

    const code = couponInput.trim().toUpperCase();
    const selectedCoupon = COUPONS[code];

    if (!selectedCoupon) {
      setCouponMessage('Invalid coupon code.');
      return;
    }

    if (subtotal < selectedCoupon.min) {
      setCouponMessage(
        `Minimum order required: ${money(selectedCoupon.min)}.`
      );
      return;
    }

    setAppliedCoupon(code);
    setCouponInput('');
    setCouponMessage(
      `${code} applied successfully — ${selectedCoupon.label}!`
    );
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCouponMessage('');
  };

  const changeCustomer = (event) => {
    const { name, value } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError('');
  };

  const placeOrder = (event) => {
    event.preventDefault();

    if (!cart.length) {
      setFormError('Your cart is empty.');
      return;
    }

    const requiredFields = [
      'name',
      'email',
      'phone',
      'city',
      'address',
    ];

    const missingField = requiredFields.some(
      (field) => !customer[field].trim()
    );

    if (missingField) {
      setFormError(
        'Please complete all required delivery details.'
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customer.email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const phonePattern = /^[0-9+\s()-]{10,18}$/;

    if (!phonePattern.test(customer.phone.trim())) {
      setFormError('Please enter a valid phone number.');
      return;
    }

    const selectedPayment = PAYMENT_OPTIONS.find(
      (option) => option.id === payment
    );

    const order = {
      reference: `VX-${Date.now().toString().slice(-8)}`,
      name: customer.name.trim(),
      items: totalItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      shipping: SHIPPING[shipping].label,
      payment: selectedPayment?.name || 'Not selected',
      date: new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    // Frontend-only confirmation:
    // no payment is charged or order transmitted.
    setConfirmedOrder(order);

    clearCart();

    setAppliedCoupon('');
    setCouponInput('');
    setCouponMessage('');
    setFormError('');

    setStep('success');
  };

  const resetCart = () => {
    setStep('cart');
    setConfirmedOrder(null);
    setCustomer(initialCustomer);
    setShipping('standard');
    setPayment('visa');
    setFormError('');
    setCouponInput('');
    setCouponMessage('');
    setAppliedCoupon('');
  };

  const removeAll = () => {
    if (
      window.confirm(
        'Are you sure you want to clear your cart?'
      )
    ) {
      clearCart();
      removeCoupon();
    }
  };

  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id, item.size);
    } else {
      updateQuantity(
        item.id,
        item.size,
        item.quantity - 1
      );
    }
  };

  const increaseQuantity = (item) => {
    updateQuantity(
      item.id,
      item.size,
      item.quantity + 1
    );
  };

  const goToCheckout = () => {
    setFormError('');
    setStep('checkout');
  };

  return createPortal(
    <div
      className={`vc-layer ${isOpen ? 'is-open' : ''}`}
    >
      <div
        className="vc-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        className="vc-drawer"
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        aria-label="VELOX shopping cart and checkout"
        inert={!isOpen}
      >
        {/* HEADER */}

        <div className="vc-top">
          <div className="vc-top__status">
            <span className="vc-status-dot" />

            VELOX / COMMERCE SYSTEM

            <span>ONLINE</span>
          </div>

          <div className="vc-top__heading">
            <div>
              <p className="vc-eyebrow">
                {step === 'cart'
                  ? '01 / SHOPPING CART'
                  : step === 'checkout'
                  ? '02 / CHECKOUT'
                  : '03 / CONFIRMATION'}
              </p>

              <h2>
                {step === 'cart'
                  ? 'YOUR CART'
                  : step === 'checkout'
                  ? 'CHECKOUT'
                  : 'THANK YOU'}

                <em>.</em>
              </h2>
            </div>

            <button
              ref={closeRef}
              className="vc-icon-btn"
              type="button"
              onClick={onClose}
              aria-label="Close cart"
            >
              <X size={22} />
            </button>
          </div>

          <div className="vc-progress">
            <span className="is-active">
              CART
            </span>

            <span
              className={
                step !== 'cart' ? 'is-active' : ''
              }
            >
              DETAILS
            </span>

            <span
              className={
                step === 'success' ? 'is-active' : ''
              }
            >
              COMPLETE
            </span>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}

        <div
          className="vc-content"
          ref={contentRef}
        >
          {/* SUCCESS SCREEN */}

          {step === 'success' && confirmedOrder ? (
            <div className="vc-success">
              <div className="vc-success__icon">
                <CheckCircle2 size={60} />
              </div>

              <p className="vc-eyebrow">
                ORDER CONFIRMATION
              </p>

              <h3>
                YOUR ORDER HAS BEEN PLACED!
              </h3>

              <p>
                Thank you for choosing VELOX,
                {' '}
                {confirmedOrder.name}!
                Your order details are ready.
              </p>

              <div className="vc-success__receipt">
                <div>
                  <span>ORDER REFERENCE</span>
                  <strong>
                    {confirmedOrder.reference}
                  </strong>
                </div>

                <div>
                  <span>DATE</span>
                  <strong>
                    {confirmedOrder.date}
                  </strong>
                </div>

                <div>
                  <span>TOTAL ITEMS</span>
                  <strong>
                    {confirmedOrder.items}
                  </strong>
                </div>

                <div>
                  <span>DELIVERY TYPE</span>
                  <strong>
                    {confirmedOrder.shipping}
                  </strong>
                </div>

                <div>
                  <span>PAYMENT METHOD</span>
                  <strong>
                    {confirmedOrder.payment}
                  </strong>
                </div>

                <div>
                  <span>PRODUCTS SUBTOTAL</span>
                  <strong>
                    {money(confirmedOrder.subtotal)}
                  </strong>
                </div>

                <div>
                  <span>DELIVERY CHARGES</span>
                  <strong>
                    {money(confirmedOrder.deliveryFee)}
                  </strong>
                </div>

                {confirmedOrder.discount > 0 && (
                  <div>
                    <span>DISCOUNT</span>
                    <strong>
                      - {money(confirmedOrder.discount)}
                    </strong>
                  </div>
                )}

                <div>
                  <span>ORDER TOTAL</span>
                  <strong>
                    {money(confirmedOrder.total)}
                  </strong>
                </div>
              </div>

              <p className="vc-hint">
                Checkout preview: this confirmation is
                generated in your browser. No payment was
                collected and no delivery was scheduled.
              </p>

              <button
                type="button"
                className="vc-primary"
                onClick={() => {
                  resetCart();
                  onClose();
                }}
              >
                CONTINUE SHOPPING

                <ArrowRight size={18} />
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* EMPTY CART */

            <div className="vc-empty">
              <ShoppingBag
                size={54}
                strokeWidth={1.2}
              />

              <p className="vc-eyebrow">
                NO PRODUCTS DETECTED
              </p>

              <h3>
                YOUR CART IS EMPTY.
              </h3>

              <p>
                Discover the VELOX V1 collection
                and find your next pair.
              </p>

              <Link
                to="/#collection"
                className="vc-primary"
                onClick={onClose}
              >
                EXPLORE COLLECTION

                <ArrowUpRight size={18} />
              </Link>
            </div>
          ) : step === 'cart' ? (
            /* CART ITEMS */

            <>
              <div className="vc-section-heading">
                <span>
                  <ScanLine size={15} />

                  SELECTED PRODUCTS ({totalItems})
                </span>

                <button
                  className="vc-text-button"
                  type="button"
                  onClick={removeAll}
                >
                  <Trash2 size={14} />

                  CLEAR ALL
                </button>
              </div>

              <div className="vc-items">
                {cart.map((item) => (
                  <article
                    key={`${item.id}-${item.size}`}
                    className="vc-item"
                    style={{
                      '--item-accent':
                        item.accent || '#ff641c',
                    }}
                  >
                    <Link
                      className="vc-item__image"
                      to={`/product/${item.id}`}
                      onClick={onClose}
                    >
                      <img
                        src={item.image}
                        alt={`VELOX ${item.name}`}
                      />
                    </Link>

                    <div className="vc-item__details">
                      <div className="vc-item__top">
                        <span>
                          VELOX V1
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id,
                              item.size
                            )
                          }
                          aria-label={`Remove ${item.name}`}
                        >
                          <X size={17} />
                        </button>
                      </div>

                      <Link
                        to={`/product/${item.id}`}
                        onClick={onClose}
                        className="vc-item__name"
                      >
                        {item.name}
                      </Link>

                      <p className="vc-item__color">
                        <i
                          style={{
                            background:
                              item.accent || '#ff641c',
                          }}
                        />

                        {item.colorway}
                      </p>

                      <div className="vc-item__meta">
                        <span>
                          EU {item.size}
                        </span>

                        <span>
                          {money(item.price)} / pair
                        </span>
                      </div>

                      <div className="vc-item__bottom">
                        <div className="vc-quantity">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <strong>
                            {item.quantity}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <strong>
                          {money(
                            item.price * item.quantity
                          )}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* DELIVERY */}

              <div className="vc-section">
                <div className="vc-section-heading">
                  <span>
                    <Truck size={16} />

                    DELIVERY OPTIONS
                  </span>
                </div>

                {Object.entries(SHIPPING).map(
                  ([id, option]) => (
                    <label
                      key={id}
                      className={`vc-choice ${
                        shipping === id
                          ? 'is-selected'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="vc-shipping"
                        value={id}
                        checked={shipping === id}
                        onChange={() =>
                          setShipping(id)
                        }
                      />

                      <span className="vc-choice__radio" />

                      <span className="vc-choice__copy">
                        <strong>
                          {option.label}
                        </strong>

                        <small>
                          {option.days}
                        </small>
                      </span>

                      <strong>
                        {money(option.fee)}
                      </strong>
                    </label>
                  )
                )}
              </div>

              {/* COUPON */}

              <div className="vc-section">
                <div className="vc-section-heading">
                  <span>
                    <Tag size={16} />

                    PROMO CODE
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="vc-coupon-applied">
                    <span>
                      <Check size={16} />

                      {appliedCoupon}
                      {' — '}
                      {coupon.label}
                    </span>

                    <button
                      type="button"
                      onClick={removeCoupon}
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <form
                    className="vc-coupon-form"
                    onSubmit={applyCoupon}
                  >
                    <input
                      value={couponInput}
                      onChange={(event) =>
                        setCouponInput(
                          event.target.value
                        )
                      }
                      placeholder="ENTER COUPON CODE"
                      aria-label="Coupon code"
                    />

                    <button type="submit">
                      APPLY
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p
                    className="vc-hint"
                    role="status"
                  >
                    {couponMessage}
                  </p>
                )}
              </div>
            </>
          ) : (
            /* CHECKOUT FORM */

            <form
              id="vc-checkout-form"
              onSubmit={placeOrder}
            >
              <button
                type="button"
                className="vc-back"
                onClick={() =>
                  setStep('cart')
                }
              >
                <ArrowLeft size={16} />

                BACK TO CART
              </button>

              <div className="vc-section-heading">
                <span>
                  <MapPin size={16} />

                  DELIVERY DETAILS
                </span>
              </div>

              <div className="vc-fields">
                <label>
                  FULL NAME *

                  <input
                    name="name"
                    value={customer.name}
                    onChange={changeCustomer}
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label>
                  EMAIL ADDRESS *

                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={changeCustomer}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label>
                  PHONE NUMBER *

                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={changeCustomer}
                    autoComplete="tel"
                    placeholder="+92 3XX XXXXXXX"
                    required
                  />
                </label>

                <div className="vc-fields__row">
                  <label>
                    CITY *

                    <input
                      name="city"
                      value={customer.city}
                      onChange={changeCustomer}
                      autoComplete="address-level2"
                      placeholder="Karachi"
                      required
                    />
                  </label>

                  <label>
                    POSTAL CODE

                    <input
                      name="postalCode"
                      value={customer.postalCode}
                      onChange={changeCustomer}
                      autoComplete="postal-code"
                      placeholder="Optional"
                    />
                  </label>
                </div>

                <label>
                  DELIVERY ADDRESS *

                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={changeCustomer}
                    autoComplete="street-address"
                    placeholder="House, street, area, landmark"
                    rows={3}
                    required
                  />
                </label>
              </div>

              {/* PAYMENT */}

              <div className="vc-section">
                <div className="vc-section-heading">
                  <span>
                    <CreditCard size={16} />

                    PAYMENT METHOD
                  </span>
                </div>

                <p className="vc-hint">
                  Select your preferred payment method.
                  No payment details are collected here.
                </p>

                <div className="vc-payments">
                  {PAYMENT_OPTIONS.map(
                    (option) => (
                      <label
                        key={option.id}
                        className={`vc-payment ${
                          payment === option.id
                            ? 'is-selected'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="vc-payment"
                          value={option.id}
                          checked={
                            payment === option.id
                          }
                          onChange={() =>
                            setPayment(option.id)
                          }
                        />

                        <span className="vc-choice__radio" />

                        <PaymentBadge
                          method={option.id}
                        />

                        <span className="vc-payment__copy">
                          <strong>
                            {option.name}
                          </strong>

                          <small>
                            {option.detail}
                          </small>
                        </span>
                      </label>
                    )
                  )}
                </div>

                <div className="vc-payment-info">
                  <LockKeyhole size={18} />

                  <p>
                    Your selection will appear in
                    the order summary. This checkout
                    does not process card or wallet
                    payments.
                  </p>
                </div>
              </div>

              {formError && (
                <p
                  className="vc-error"
                  role="alert"
                >
                  {formError}
                </p>
              )}
            </form>
          )}
        </div>

        {/* BILLING FOOTER */}

        {cart.length > 0 &&
          step !== 'success' && (
            <div className="vc-footer">
              <div className="vc-footer__title">
                <span>
                  ORDER SUMMARY
                </span>

                <span>
                  {totalItems} UNITS
                </span>
              </div>

              <div className="vc-bill-row">
                <span>
                  Products subtotal
                </span>

                <strong>
                  {money(subtotal)}
                </strong>
              </div>

              <div className="vc-bill-row">
                <span>
                  Delivery (
                  {SHIPPING[shipping].label})
                </span>

                <strong>
                  + {money(deliveryFee)}
                </strong>
              </div>

              {discount > 0 && (
                <div className="vc-bill-row vc-bill-row--discount">
                  <span>
                    Coupon discount (
                    {appliedCoupon})
                  </span>

                  <strong>
                    - {money(discount)}
                  </strong>
                </div>
              )}

              <div className="vc-bill-total">
                <span>
                  ORDER TOTAL
                </span>

                <strong>
                  {money(total)}
                </strong>
              </div>

              {step === 'cart' ? (
                <button
                  type="button"
                  className="vc-primary"
                  onClick={goToCheckout}
                >
                  PROCEED TO CHECKOUT

                  <ArrowRight size={19} />
                </button>
              ) : (
                <button
                  type="submit"
                  form="vc-checkout-form"
                  className="vc-primary"
                >
                  PLACE ORDER

                  <ArrowRight size={19} />
                </button>
              )}

              <p className="vc-disclaimer">
                <ShieldCheck size={14} />

                Checkout preview — no payment
                is collected.
              </p>

              <div className="vc-accepted">
                <span>
                  PAYMENT OPTIONS
                </span>

                <div>
                  {PAYMENT_OPTIONS.map(
                    (option) => (
                      <PaymentBadge
                        key={option.id}
                        method={option.id}
                      />
                    )
                  )}
                </div>
              </div>

              {step === 'cart' && (
                <Link
                  className="vc-continue"
                  to="/#collection"
                  onClick={onClose}
                >
                  <ArrowLeft size={15} />

                  CONTINUE SHOPPING
                </Link>
              )}

              <div className="vc-footer__brand">
                <Package size={13} />

                VELOX — BUILT FOR MOTION
              </div>
            </div>
          )}
      </aside>
    </div>,
    document.body
  );
}

export default CartDrawer;
