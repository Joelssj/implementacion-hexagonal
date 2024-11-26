import { Diary } from './Diary';

export interface DiaryRepository {
    save(diary: Diary): Promise<void>;
    getAll(): Promise<Diary[]>;
    getByUserUuid(userUuid: string): Promise<Diary[]>;
}
