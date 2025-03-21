import { TRANSACTION_FLOW } from "@/types/transaction";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { X } from "lucide-react";

export const adminStats = publicProcedure.query(async ({ ctx }) => {
  try {
    // Get current date
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Get total transactions
    const totalTransactions = await ctx.prisma.pembelian.count();
    
    // Get successful transactions
    const successfulTransactions = await ctx.prisma.pembelian.count({
      where: {
        status: TRANSACTION_FLOW.SUCCESS
      }
    });
    
    // Get pending transactions
    const pendingTransactions = await ctx.prisma.pembelian.count({
      where: {
        status: TRANSACTION_FLOW.PENDING
      }
    });
    
    // Get failed transactions
    const failedTransactions = await ctx.prisma.pembelian.count({
      where: {
        status:TRANSACTION_FLOW.FAILED
      }
    });
    
    // Get today's revenue
    const todayRevenue = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfToday
        }
      },
      _sum: {
        harga: true
      }
    });
    
    // Get today's profit
    const todayProfit = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfToday
        }
      },
      _sum: {
        profit: true
      }
    });
    
    // Get this month's revenue
    const thisMonthRevenue = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        harga: true
      }
    });
    
    // Get this month's profit
    const thisMonthProfit = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        profit: true
      }
    });
    
    // Get last month's revenue
    const lastMonthRevenue = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfLastMonth,
          lt: endOfLastMonth
        }
      },
      _sum: {
        harga: true
      }
    });
    
    // Get last month's profit
    const lastMonthProfit = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfLastMonth,
          lt: endOfLastMonth
        }
      },
      _sum: {
        profit: true
      }
    });
    
    // Get payment method stats
    const paymentMethodStats = await ctx.prisma.pembayaran.groupBy({
      by: ['metode'],
      _count: {
        metode: true
      },
      where: {
        status: TRANSACTION_FLOW.SUCCESS
      }
    });
    
    // Get transaction type stats
    const transactionTypeStats = await ctx.prisma.pembelian.groupBy({
      by: ['tipeTransaksi'],
      _count: {
        tipeTransaksi: true
      },
      where: {
        status: TRANSACTION_FLOW.SUCCESS
      }
    });
    
    // Recent transactions
    const recentTransactions = await ctx.prisma.pembelian.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        pembayaran: true
      }
    });

    return {
      totalTransactions,
      statusCounts: {
        successful: successfulTransactions,
        pending: pendingTransactions,
        failed: failedTransactions
      },
      revenue: {
        today: todayRevenue._sum.harga || 0,
        thisMonth: thisMonthRevenue._sum.harga || 0,
        lastMonth: lastMonthRevenue._sum.harga || 0
      },
      profit: {
        today: todayProfit._sum.profit || 0,
        thisMonth: thisMonthProfit._sum.profit || 0,
        lastMonth: lastMonthProfit._sum.profit || 0
      },
      paymentMethodStats,
      transactionTypeStats,
      recentTransactions
    };
  } catch (error) {
    
    throw new Error("Failed to fetch admin statistics");
  }
});


export const PembelianAll = router({
    getAll: publicProcedure
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().min(1).optional(),
          limit: z.number().min(1).optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        try {
          const { status, page = 1, limit = 10 } = input || {};
          const where: Prisma.PembelianWhereInput = {};
  
          // Filter by status if provided
          if (status) {
            where.status = status;
          }
  
          // Calculate skip and take for pagination
          const skip = (page - 1) * limit;
          const take = limit;
  
          // Fetch paginated data and total count
          const [transactions, totalCount] = await Promise.all([
            ctx.prisma.pembelian.findMany({
              where,
              skip,
              take,
              orderBy: { createdAt: 'desc' }, // Optional: Order by creation date
            }),
            ctx.prisma.pembelian.count({ where }),
          ]);
  
          return {
            transactions,
            totalCount,
          };
        } catch (error) {
          console.error("Error fetching pembelian data:", error);
          throw new Error("Failed to fetch pembelian data");
        }
      }),
  });