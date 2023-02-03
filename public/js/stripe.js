import axios from 'axios';
import { showAlert } from './alerts';
export const bookTour = async tourId => {
  try {
    const stripe = Stripe(
      'pk_test_51MVLCdH714gDKl3fxnd6RR0R20ykzOG9foLwNTia50YPoEgyWKWKBQf0Vd7U5oUNAoLgdGPpF1udkCKdQhv7XgvP00ebKxnQz6'
    );
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // Redirect to the checkout page
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
