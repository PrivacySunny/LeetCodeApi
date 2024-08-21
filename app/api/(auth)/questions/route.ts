import connect from "@/lib/db";
import Question from "@/lib/modals/question";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const questions = await Question.find();
    return new NextResponse(JSON.stringify(questions), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching questions " + error.message, {
      status: 400,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newQuestion = new Question(body);
    await newQuestion.save();

    return new NextResponse(
      JSON.stringify({
        message: "Questions is Added Successfully!!!",
        question: newQuestion,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in Adding Question " + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { questionId, newQuestion } = body;
    if (!questionId || !newQuestion) {
      return new NextResponse(
        JSON.stringify({ message: "ID or newQuestion is not valid" }),
        {
          status: 400,
        }
      );
    }

    if (!Types.ObjectId.isValid(questionId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid questions ID" }),
        {
          status: 400,
        }
      );
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: new ObjectId(questionId) },
      { questionname: newQuestion },
      { new: true }
    );

    if (!updatedQuestion) {
      return new NextResponse(
        JSON.stringify({ message: "Question is not found" }),
        {
          status: 400,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Question is Updated",
        question: updatedQuestion,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in Fetching " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return new NextResponse(JSON.stringify({ message: "Id not found" }), {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(questionId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid question id",
        }),
        { status: 400 }
      );
    }

    await connect();

    const deletedquestion = await Question.findByIdAndDelete(
      new Types.ObjectId(questionId)
    );

    if (!deletedquestion) {
      return new NextResponse(
        JSON.stringify({ message: "question not Found" }),
        {
          status: 400,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "question is deleted",
        question: deletedquestion,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting question" + error.message, {
      status: 500,
    });
  }
};
