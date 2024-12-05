import { StreakRepository } from '../../domain/StreakRepository';
import { Streak } from '../../domain/Streak';
import { getMongoDB } from '../../../database/DatabaseConnection';

export class MongoStreakRepository implements StreakRepository {
    private collection = getMongoDB().collection('streaks');

    async getStreakByUser(userUuid: string): Promise<Streak | null> {
        console.log(`[MongoStreakRepository] Buscando racha para userUuid: ${userUuid}`);
        const doc = await this.collection.findOne({ userUuid });
    
        if (!doc) {
            console.warn(`[MongoStreakRepository] No se encontró racha para userUuid: ${userUuid}`);
            return null;
        }
    
        console.log(`[MongoStreakRepository] Racha encontrada:`, doc);
        return new Streak(doc.userUuid, doc.currentStreak, doc.maxStreak, doc.protectorsLeft, doc.days);
    }
    
    
    

    async saveStreak(streak: Streak): Promise<void> {
        await this.collection.updateOne(
            { userUuid: streak.userUuid },
            {
                $set: {
                    currentStreak: streak.currentStreak,
                    maxStreak: streak.maxStreak,
                    protectorsLeft: streak.protectorsLeft,
                    days: streak.days,
                },
            },
            { upsert: true } // Crea el documento si no existe
        );
    }

    async resetStreak(userUuid: string): Promise<void> {
        await this.collection.updateOne(
            { userUuid },
            {
                $set: {
                    currentStreak: 0,
                    protectorsLeft: 2, // Reinicia protectores
                    days: [], // Limpia el historial
                },
            }
        );
    }

    async getAllUsers(): Promise<{ userUuid: string }[]> {
        const users = await this.collection
            .find({}, { projection: { userUuid: 1, _id: 0 } }) // Proyecta solo `userUuid` y excluye `_id`
            .toArray();
    
        // Asegúrate de mapear correctamente el resultado
        return users.map((doc: any) => ({ userUuid: doc.userUuid }));
    }
    
}
