/**
 * Payment Controller
 * Handles Stripe and PayPal payment operations
 * @module apps/api/controllers/payment
 */

import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import * as paypal from '@paypal/checkout-server-sdk';
import { prisma } from '../server';
import {
  PaymentCreateSchema,
  PaymentMethod,
  PaymentStatus,
} from '@aistudio555/types';
import {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
} from '../middleware/error.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { createLogger } from '@aistudio555/utils';

const logger = createLogger('payment-controller');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Initialize PayPal
function createPayPalClient() {
  const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      );
  
  return new paypal.core.PayPalHttpClient(environment);
}

const paypalClient = createPayPalClient();

// ============================================
// CREATE STRIPE CHECKOUT SESSION
// ============================================
export const createStripeCheckout = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId, successUrl, cancelUrl } = req.body;
  const userId = req.user!.id;

  // Get course details
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      price: true,
      stripePriceId: true,
    },
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (existingEnrollment) {
    throw new ConflictError('You are already enrolled in this course');
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: req.user!.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: `Enrollment in ${course.title}`,
          },
          unit_amount: Math.round(course.price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      courseId,
    },
    success_url: successUrl || `${process.env.FRONTEND_URL}/courses/${courseId}/success`,
    cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/courses/${courseId}/cancel`,
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      currency: 'USD',
      method: 'STRIPE',
      status: 'PENDING',
      stripeSessionId: session.id,
    },
  });

  logger.info(`Stripe checkout session created: ${session.id} for user ${userId}`);

  // Send response
  res.status(200).json({
    success: true,
    data: {
      checkoutUrl: session.url,
      sessionId: session.id,
    },
  });
});

// ============================================
// CREATE PAYPAL ORDER
// ============================================
export const createPayPalOrder = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.body;
  const userId = req.user!.id;

  // Get course details
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      price: true,
    },
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (existingEnrollment) {
    throw new ConflictError('You are already enrolled in this course');
  }

  // Create PayPal order
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: course.price.toString(),
        },
        description: `Enrollment in ${course.title}`,
        custom_id: JSON.stringify({ userId, courseId }),
      },
    ],
  });

  const order = await paypalClient.execute(request);

  // Create payment record
  await prisma.payment.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      currency: 'USD',
      method: 'PAYPAL',
      status: 'PENDING',
      paypalOrderId: order.result.id,
    },
  });

  logger.info(`PayPal order created: ${order.result.id} for user ${userId}`);

  // Send response
  res.status(200).json({
    success: true,
    data: {
      orderId: order.result.id,
    },
  });
});

// ============================================
// CAPTURE PAYPAL ORDER
// ============================================
export const capturePayPalOrder = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.body;
  const userId = req.user!.id;

  // Get payment record
  const payment = await prisma.payment.findFirst({
    where: {
      paypalOrderId: orderId,
      userId,
      status: 'PENDING',
    },
  });

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  // Capture PayPal order
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const capture = await paypalClient.execute(request);

  if (capture.result.status === 'COMPLETED') {
    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId: payment.courseId!,
        status: 'ACTIVE',
        paymentId: payment.id,
      },
    });

    logger.info(`PayPal payment completed: ${orderId} for user ${userId}`);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Payment successful! You are now enrolled in the course.',
      data: {
        paymentId: payment.id,
        status: 'COMPLETED',
      },
    });
  } else {
    throw new AppError('Payment capture failed', 400, 'PAYMENT_FAILED');
  }
});

// ============================================
// STRIPE WEBHOOK HANDLER
// ============================================
export const handleStripeWebhook = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    logger.error(`Stripe webhook signature verification failed: ${err.message}`);
    throw new ValidationError('Invalid webhook signature');
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get payment record
      const payment = await prisma.payment.findFirst({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (payment) {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });

        // Create enrollment
        await prisma.enrollment.create({
          data: {
            userId: payment.userId,
            courseId: payment.courseId!,
            status: 'ACTIVE',
            paymentId: payment.id,
          },
        });

        logger.info(`Stripe payment completed: ${session.id}`);
      }
      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      
      await prisma.payment.updateMany({
        where: {
          stripeSessionId: expiredSession.id,
          status: 'PENDING',
        },
        data: {
          status: 'FAILED',
        },
      });

      logger.info(`Stripe session expired: ${expiredSession.id}`);
      break;

    default:
      logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  // Send response
  res.status(200).json({ received: true });
});

// ============================================
// GET USER PAYMENTS
// ============================================
export const getUserPayments = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const { status } = req.query;

  const where: any = { userId };
  
  if (status) {
    where.status = status as PaymentStatus;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Send response
  res.status(200).json({
    success: true,
    data: payments,
  });
});

// ============================================
// GET PAYMENT DETAILS
// ============================================
export const getPaymentDetails = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const payment = await prisma.payment.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      course: true,
      enrollment: true,
    },
  });

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  // Send response
  res.status(200).json({
    success: true,
    data: payment,
  });
});

// ============================================
// APPLY COUPON
// ============================================
export const applyCoupon = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code, courseId } = req.body;

  // Get coupon
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { lte: new Date() },
      validUntil: { gte: new Date() },
    },
  });

  if (!coupon) {
    throw new NotFoundError('Invalid or expired coupon code');
  }

  // Check usage limit
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new ValidationError('Coupon usage limit exceeded');
  }

  // Check if coupon is for specific course
  if (coupon.courseId && coupon.courseId !== courseId) {
    throw new ValidationError('Coupon is not valid for this course');
  }

  // Get course price
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { price: true },
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (course.price * coupon.discountValue) / 100;
  } else {
    discountAmount = coupon.discountValue;
  }

  const finalPrice = Math.max(0, course.price - discountAmount);

  // Send response
  res.status(200).json({
    success: true,
    data: {
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      originalPrice: course.price,
      finalPrice,
    },
  });
});

// ============================================
// ADMIN: GET ALL PAYMENTS
// ============================================
export const getAllPayments = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    status,
    method,
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
  } = req.query;

  // Build filter conditions
  const where: any = {};

  if (status) {
    where.status = status as PaymentStatus;
  }

  if (method) {
    where.method = method as PaymentMethod;
  }

  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Get payments with pagination
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sort as string]: order,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  // Calculate totals
  const totals = await prisma.payment.aggregate({
    where: {
      ...where,
      status: 'COMPLETED',
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  // Send response
  res.status(200).json({
    success: true,
    data: {
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      totals: {
        totalRevenue: totals._sum.amount || 0,
        totalTransactions: totals._count,
      },
    },
  });
});