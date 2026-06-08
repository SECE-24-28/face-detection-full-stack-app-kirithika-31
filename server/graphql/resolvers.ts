import bcrypt from "bcryptjs";
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";

export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },

    detections: async () => {
      return await prisma.detection.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  },

  Mutation: {
    signup: async (
      _: unknown,
      args: {
        name: string;
        email: string;
        password: string;
      }
    ) => {

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });

      if (existingUser) {
        throw new Error(
          "User already exists"
        );
      }

      const hashedPassword =
        await bcrypt.hash(
          args.password,
          10
        );

      const user =
        await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        });

      const token =
        generateToken(user.id);

      return {
        token,
        user,
      };
    },

    login: async (
      _: unknown,
      args: {
        email: string;
        password: string;
      }
    ) => {

      const user =
        await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });

      if (!user) {
        throw new Error(
          "User not found"
        );
      }

      const valid =
        await bcrypt.compare(
          args.password,
          user.password
        );

      if (!valid) {
        throw new Error(
          "Invalid Password"
        );
      }

      const token =
        generateToken(user.id);

      return {
        token,
        user,
      };
    },

    createDetection: async (
      _: unknown,
      args: {
        imageName: string;
        age: number;
        gender: string;
        faceCount: number;
        userId: number;
      }
    ) => {

      return await prisma.detection.create({
        data: {
          imageName: args.imageName,
          age: args.age,
          gender: args.gender,
          faceCount: args.faceCount,
          userId: args.userId,
        },
      });
    },
  },
};