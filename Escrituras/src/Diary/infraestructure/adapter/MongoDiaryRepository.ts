
import { Diary } from '../../domain/Diary';
import { DiaryRepository } from '../../domain/DiaryRepository';
import { getMongoDB } from '../../../database/DatabaseConnection';


export class MongoDiaryRepository implements DiaryRepository {
    private collection = getMongoDB().collection('diaries');

    async save(diary: Diary): Promise<void> {
        await this.collection.insertOne({
            id: diary.id,
            userUuid: diary.userUuid,
            image: diary.image,
            comment: diary.comment,
            date: diary.date,
            time: diary.time,
        });
    }

    async getAll(): Promise<Diary[]> {
        const diaries = await this.collection.find().toArray();
        return diaries.map(
            (doc: any) =>
                new Diary(doc.id, doc.userUuid, doc.image, doc.comment, doc.date, doc.time)
        );
    }

    async getByUserUuid(userUuid: string): Promise<Diary[]> {
        const diaries = await this.collection.find({ userUuid }).toArray();
        return diaries.map(
            (doc: any) =>
                new Diary(doc.id, doc.userUuid, doc.image, doc.comment, doc.date, doc.time)
        );
    }
}
