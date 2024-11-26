import { Diary } from '../domain/Diary';
import { DiaryRepository } from '../domain/DiaryRepository';

export class SaveDiaryUseCase {
    constructor(private diaryRepository: DiaryRepository) {}

    async execute(diary: Diary): Promise<void> {
        console.log("Ejecutando el caso de uso para guardar el diario...");

        try {
            // Verificar si el diario tiene los datos requeridos
            if (!diary || !diary) {
                console.log("❌ El diario está vacío o no tiene contenido.");
                return;
            }

            // Llamada al repositorio para guardar el diario
            console.log("Guardando el diario en el repositorio...");
            await this.diaryRepository.save(diary);

            // Mensaje de éxito
            console.log("✔️ Diario guardado exitosamente.");
        } catch (error) {
            // En caso de error, lo mostramos en consola
            console.log("❌ Error al guardar el diario:", error);
        }
    }
}
