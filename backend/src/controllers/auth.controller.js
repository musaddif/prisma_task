
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
      phoneNumber,
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
      !phoneNumber ||
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

    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
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
        phoneNumber,
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
      message: 'Account created successfully',
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