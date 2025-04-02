import { hash } from "bcrypt"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as z from "zod"

const userSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, email, password } = userSchema.parse(body)

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    const user = await db.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
      },
    })

    // Create default categories for the new user
    await db.category.createMany({
      data: [
        { name: "Salary", type: "income", userId: user.id },
        { name: "Freelance", type: "income", userId: user.id },
        { name: "Investments", type: "income", userId: user.id },
        { name: "Rent", type: "expense", userId: user.id },
        { name: "Groceries", type: "expense", userId: user.id },
        { name: "Utilities", type: "expense", userId: user.id },
        { name: "Transportation", type: "expense", userId: user.id },
        { name: "Entertainment", type: "expense", userId: user.id },
      ],
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

