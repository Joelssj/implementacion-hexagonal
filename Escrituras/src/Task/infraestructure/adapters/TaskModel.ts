/*import mongoose, { Schema, Document } from 'mongoose';

export interface TaskDocument extends Document {
    type: 'Habito' | 'Temporal';
    priority: 'Baja' | 'Media' | 'Alta';
    date: string;
    time: string;
}

const TaskSchema: Schema = new Schema({
    type: { type: String, enum: ['Habito', 'Temporal'], required: true },
    priority: { type: String, enum: ['Baja', 'Media', 'Alta'], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
});

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);
*/