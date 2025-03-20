import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { getProfile } from '@/app/(auth)/auth/components/server';
import { Digiflazz } from '@/lib/digiflazz';
import { TRANSACTION_FLOW } from '@/types/transaction';

export const order = router({
  createManual: publicProcedure
    .input(z.object({
      orderId: z.string(),
      layananId: z.string(),
      userId: z.string(),
      serverId: z.string().optional(),
      whatsapp: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const session = await getProfile(); // Get session to check user role
        const username = process.env.DIGI_USERNAME as string;
        const DIGI_API_KEY = process.env.DIGI_API_KEY as string;
        const digi = new Digiflazz(username, DIGI_API_KEY);

        // Check if the user has admin privileges
        const user = session?.session;
        if (user?.user.role !== 'Admin') {
          return {
            status: false,
            message: 'Failed to create, insufficient permissions',
            statusCode: 401,
          };
        }

        // Fetch layanan details from the database
        const layanan = await ctx.prisma.layanan.findUnique({
          where: { id: parseInt(input.layananId) },
        });

        if (!layanan) {
          return {
            status: false,
            message: 'Layanan not available',
            statusCode: 404,
          };
        }

        // Call the Digiflazz API to create a top-up order
        const digiTrans = await digi.TopUp({
          productCode: layanan.providerId,
          whatsapp: input.whatsapp,
          userId: input.userId,
          serverId: input.serverId,
        });

        if (!digiTrans || digiTrans.data.status !== 'Sukses') {
          return {
            status: false,
            message: 'Error with Digiflazz top-up',
            statusCode: 500,
          };
        }

        // Creating a payment record in the database (using Prisma)
        const payment = await ctx.prisma.pembayaran.create({
          data: {
            orderId: input.orderId,
            harga: layanan.harga.toString(),
            noPembayaran: "-", // You can modify this to use a dynamic value
            noPembeli: parseInt(input.whatsapp),
            status: TRANSACTION_FLOW.PENDING, // Assuming pending status for manual payments
            metode: 'MANUAL',
            reference: "", // Reference can be generated or kept empty
          },
        });

        if (!payment) {
          return {
            status: false,
            message: 'Failed to create payment record',
            statusCode: 500,
          };
        }

        // If everything is successful, return the success response
        return {
          status: true,
          message: 'Manual order created successfully',
          statusCode: 200,
          data: {
            orderId: input.orderId,
            harga: layanan.harga,
            layanan: layanan.layanan,
            whatsapp: input.whatsapp,
          },
        };
      } catch (error) {
        console.error('Error:', error);

        // Catch errors and return appropriate responses
        if (error instanceof TRPCError) {
          return {
            status: false,
            message: error.message,
            statusCode: error.code,
          };
        }

        // Handle unexpected errors
        return {
          status: false,
          message: 'Internal Server Error',
          statusCode: 500,
        };
      }
    }),

});