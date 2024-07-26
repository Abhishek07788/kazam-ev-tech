import mongoose, { Schema, Document, Model } from "mongoose";

interface ITodo extends Document {
  title: string;
}
const collection = process.env.COLLECTION!;

const TodoSchema: Schema<ITodo> = new Schema({
  title: { type: String, required: true },
});

const Todo: Model<ITodo> = mongoose.model<ITodo>(collection, TodoSchema);

export default Todo;
