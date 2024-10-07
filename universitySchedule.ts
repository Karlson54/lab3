// a) DayOfWeek type alias
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// b) TimeSlot union type
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";

// c) CourseType type alias
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";
// a) Professor type alias
type Professor = {
    id: number;
    name: string;
    department: string;
};

// b) Classroom type alias
type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

// c) Course type alias
type Course = {
    id: number;
    name: string;
    type: CourseType;
};

// d) Lesson type alias
type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Масиви даних
let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

// b) Function for adding a professor
function addProfessor(professor: Professor): void {
    professors.push(professor);
}

// c) Function for adding a lesson to the schedule
function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (!conflict) {
        schedule.push(lesson);
        return true;
    } else {
        console.log("Конфлікт розкладу:", conflict);
        return false;
    }
}

// a) Function for searching free audiences
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);

    return classrooms
        .map(classroom => classroom.number)
        .filter(classroomNumber => !occupiedClassrooms.includes(classroomNumber));
}

// b) Function for obtaining the professor's schedule
function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(lesson => lesson.professorId === professorId);
}

// a) ScheduleConflict type alias
type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// b) Activity validation function
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const professorConflict = schedule.find(
        l => l.professorId === lesson.professorId && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
    );

    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }

    const classroomConflict = schedule.find(
        l => l.classroomNumber === lesson.classroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
    );

    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }

    return null;
}

// a) Function to count audience usage
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // 5 days, 5 time slots
    const occupiedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (occupiedSlots / totalSlots) * 100;
}

// b) Function to determine the most popular type of classes
function getMostPopularCourseType(): CourseType {
    const typeCount: { [key in CourseType]?: number } = {};

    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            typeCount[course.type] = (typeCount[course.type] || 0) + 1;
        }
    });

    return Object.keys(typeCount).reduce((a, b) => (typeCount[a as CourseType]! > typeCount[b as CourseType]! ? a : b)) as CourseType;
}

// a) Function to change the audience for the class
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find(l => l.courseId === lessonId);
    if (!lesson) return false;

    const newLesson = { ...lesson, classroomNumber: newClassroomNumber };
    const conflict = validateLesson(newLesson);
    if (!conflict) {
        lesson.classroomNumber = newClassroomNumber;
        return true;
    } else {
        console.log("Не можна змінити аудиторію через конфлікт:", conflict);
        return false;
    }
}

// b) Function to cancel the class
function cancelLesson(lessonId: number): void {
    schedule = schedule.filter(lesson => lesson.courseId !== lessonId);
}

// Adding professors
addProfessor({ id: 1, name: "Dr. Smith", department: "Mathematics" });
addProfessor({ id: 2, name: "Dr. Brown", department: "Physics" });
addProfessor({ id: 3, name: "Dr. Taylor", department: "Computer Science" });

console.log("Профессора:");
console.log(professors);

// Adding audiences
classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 20, hasProjector: false });
classrooms.push({ number: "103", capacity: 40, hasProjector: true });

console.log("Аудитории:");
console.log(classrooms);

// Adding courses
courses.push({ id: 1, name: "Algebra", type: "Lecture" });
courses.push({ id: 2, name: "Quantum Physics", type: "Lecture" });
courses.push({ id: 3, name: "Data Structures", type: "Lab" });

console.log("Курсы:");
console.log(courses);

// Adding classes
addLesson({ courseId: 1, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });
addLesson({ courseId: 2, professorId: 2, classroomNumber: "102", dayOfWeek: "Tuesday", timeSlot: "10:15-11:45" });
addLesson({ courseId: 3, professorId: 3, classroomNumber: "103", dayOfWeek: "Wednesday", timeSlot: "12:15-13:45" });

console.log("Расписание:");
console.log(schedule);

// Testing the findAvailableClassrooms function
console.log("Доступные аудитории на Monday 8:30-10:00:");
console.log(findAvailableClassrooms("8:30-10:00", "Monday"));

console.log("Доступные аудитории на Wednesday 12:15-13:45:");
console.log(findAvailableClassrooms("12:15-13:45", "Wednesday"));

// Testing the getProfessorSchedule function
console.log("Расписание Dr. Smith:");
console.log(getProfessorSchedule(1));

console.log("Расписание Dr. Brown:");
console.log(getProfessorSchedule(2));

// Testing the validateLesson function
const newLesson: Lesson = {
    courseId: 1,
    professorId: 1,
    classroomNumber: "102",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};
console.log("Проверка на конфликты нового занятия:");
console.log(validateLesson(newLesson));

// Testing the reassignClassroom function
console.log("Попытка изменить аудиторию для занятия:");
const reassigned = reassignClassroom(1, "102");
console.log(reassigned ? "Аудитория изменена" : "Ошибка изменения аудитории");

console.log("Новое расписание:");
console.log(schedule);

// Testing the cancelLesson function
console.log("Отмена занятия с ID 1:");
cancelLesson(1);
console.log("Новое расписание после отмены:");
console.log(schedule);

// Testing the getClassroomUtilization function
console.log("Использование аудитории 101:");
console.log(getClassroomUtilization("101") + "%");

console.log("Использование аудитории 103:");
console.log(getClassroomUtilization("103") + "%");

// Testing the getMostPopularCourseType function
console.log("Самый популярный тип занятий:");
console.log(getMostPopularCourseType());
