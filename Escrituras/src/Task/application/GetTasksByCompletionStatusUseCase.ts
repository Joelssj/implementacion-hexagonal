/*import { TaskRepository } from '../domain/TaskRepository';
import { Task } from '../domain/Task';
import moment from 'moment';

export class GetTasksByCompletionStatusUseCase {
    constructor(private taskRepository: TaskRepository) {}

    // Este método toma el userUuid y obtiene tareas completadas y no completadas
    async execute(userUuid: string): Promise<any> {
        // Obtener tareas completadas
        const completedTasks: Task[] = await this.taskRepository.getTasksByCompletionStatus(userUuid, true);
        
        // Obtener tareas no completadas
        const incompleteTasks: Task[] = await this.taskRepository.getTasksByCompletionStatus(userUuid, false);

        // Agrupar las tareas por día de la semana
        const tasksByDay = this.groupTasksByDayOfWeek(completedTasks, incompleteTasks);

        // Devolver el resultado
        return tasksByDay;
    }

    // Método para agrupar las tareas por día de la semana
    private groupTasksByDayOfWeek(completedTasks: Task[], incompleteTasks: Task[]): any[] {
        // Los días de la semana, comenzando desde lunes hasta domingo
        const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

        // Inicializamos el objeto con los días de la semana
        const tasksGroupedByDay = daysOfWeek.map(day => ({
            day,
            completedTasksCount: 0,
            incompleteTasksCount: 0,
            date: moment().isoWeekday(daysOfWeek.indexOf(day) + 1).format('YYYY-MM-DD') // Asignamos la fecha correspondiente al día
        }));

        // Obtener todas las fechas que están en el rango de la semana pasada
        const lastWeekStart = moment().subtract(1, 'weeks').startOf('isoWeek'); // Lunes de la semana pasada
        const lastWeekEnd = moment().subtract(1, 'weeks').endOf('isoWeek'); // Domingo de la semana pasada

        // Filtrar tareas completadas
        completedTasks.forEach(task => {
            const taskDate = moment(task.date); // Asegúrate de que task.date sea un formato que se pueda comparar
            if (taskDate.isBetween(lastWeekStart, lastWeekEnd, 'day', '[]')) {
                // Encontramos el índice del día en la semana
                const dayIndex = taskDate.isoWeekday() - 1; // Convertir el día de la semana a un índice 0-6
                tasksGroupedByDay[dayIndex].completedTasksCount++;
            }
        });

        // Filtrar tareas no completadas
        incompleteTasks.forEach(task => {
            const taskDate = moment(task.date);
            if (taskDate.isBetween(lastWeekStart, lastWeekEnd, 'day', '[]')) {
                const dayIndex = taskDate.isoWeekday() - 1;
                tasksGroupedByDay[dayIndex].incompleteTasksCount++;
            }
        });

        return tasksGroupedByDay;
    }
}

*/













import { TaskRepository } from '../domain/TaskRepository';
import { Task } from '../domain/Task';

export class GetTasksByCompletionStatusUseCase {
    constructor(private taskRepository: TaskRepository) {}

    // Este método toma el userUuid y un valor booleano para determinar si se buscan tareas completadas o no completadas
    async execute(userUuid: string): Promise<any> {
        // Obtener tareas completadas
        const completedTasks: Task[] = await this.taskRepository.getTasksByCompletionStatus(userUuid, true);
        
        // Obtener tareas no completadas
        const incompleteTasks: Task[] = await this.taskRepository.getTasksByCompletionStatus(userUuid, false);

        // Agrupar las tareas por día de la semana
        const tasksByDay = this.groupTasksByDayOfWeek(completedTasks, incompleteTasks);

        // Devolver el resultado
        return tasksByDay;
    }

    // Método para agrupar las tareas por día de la semana
    private groupTasksByDayOfWeek(completedTasks: Task[], incompleteTasks: Task[]): any[] {
        // Los días de la semana, comenzando desde lunes hasta domingo
        const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

        // Inicializamos el objeto con los días de la semana
        const tasksGroupedByDay = daysOfWeek.map(day => ({
            day,
            completedTasksCount: 0,
            incompleteTasksCount: 0,
            date: ''
        }));

        // Agrupar tareas completadas por día de la semana
        completedTasks.forEach(task => {
            const dayIndex = new Date(task.date).getDay(); // Obtener el día de la semana (0=domingo, 1=lunes, ...)
            tasksGroupedByDay[dayIndex].completedTasksCount++;
            tasksGroupedByDay[dayIndex].date = task.date; // Usamos la fecha de la tarea
        });

        // Agrupar tareas no completadas por día de la semana
        incompleteTasks.forEach(task => {
            const dayIndex = new Date(task.date).getDay();
            tasksGroupedByDay[dayIndex].incompleteTasksCount++;
            tasksGroupedByDay[dayIndex].date = task.date; // Usamos la fecha de la tarea
        });

        return tasksGroupedByDay;
    }
}












/*import { TaskRepository } from '../domain/TaskRepository';
import { Task } from '../domain/Task';

export class GetTasksByCompletionStatusUseCase {
    constructor(private taskRepository: TaskRepository) {}

    // Este método toma el userUuid y un valor booleano para determinar si se buscan tareas completadas o no
    async execute(userUuid: string, completed: boolean): Promise<any> {
        // Llamar al repositorio para obtener las tareas filtradas por estado (completadas/no completadas)
        const tasks = await this.taskRepository.getTasksByCompletionStatus(userUuid, completed);
        
        // Filtramos solo las tareas completadas
        const completedTasks = tasks.filter(task => task.status === 'terminada');

        // Mapeamos los días de la semana: lunes a domingo
        const daysOfWeek = [
            { day: 'lunes', date: '', completedTasksCount: 0 },
            { day: 'martes', date: '', completedTasksCount: 0 },
            { day: 'miércoles', date: '', completedTasksCount: 0 },
            { day: 'jueves', date: '', completedTasksCount: 0 },
            { day: 'viernes', date: '', completedTasksCount: 0 },
            { day: 'sábado', date: '', completedTasksCount: 0 },
            { day: 'domingo', date: '', completedTasksCount: 0 }
        ];

        // Agrupar las tareas por día de la semana
        completedTasks.forEach(task => {
            const taskDate = new Date(task.date);
            const dayOfWeek = taskDate.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
            
            // Asignamos el día y la cantidad de tareas completadas
            const dayIndex = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; // Ajustamos para que lunes sea 0, domingo sea 6
            if (!daysOfWeek[dayIndex].date) {
                daysOfWeek[dayIndex].date = task.date; // Asignamos la fecha solo la primera vez
            }
            daysOfWeek[dayIndex].completedTasksCount++;
        });

        // Devolvemos los días de la semana con las tareas completadas por cada día
        return daysOfWeek;
    }
}*/
