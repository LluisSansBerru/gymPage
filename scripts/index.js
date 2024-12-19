const calendarPage = document.getElementById('calendarPage');
const exercisePage = document.getElementById('exercisePage');
const performancePage = document.getElementById('performancePage');
const selectedDate = document.getElementById('selectedDate');
const exerciseList = document.getElementById('exerciseList');
let performanceData = JSON.parse(localStorage.getItem('gymPerformance')) || {};

// Mostrar la pagina del calendario
function showCalendar() {
    calendarPage.style.display = 'block';
    exercisePage.style.display = 'none';
    performancePage.style.display = 'none';
}

// Mostrar la pagina de ejercicios
function showExercisePage(date) {
    calendarPage.style.display = 'none';
    performancePage.style.display = 'none';
    exercisePage.style.display = 'block';
    selectedDate.textContent = date;
    loadExercisesForDate(date);
}

// Mostrar la pagina de rendimiento
function showPerformancePage() {
    calendarPage.style.display = 'none';
    exercisePage.style.display = 'none';
    performancePage.style.display = 'block';
    loadPerformanceData();
}

// Generar el calendario
function generateCalendar() {
    const year = 2025;
    const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const colors = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const calendar = document.getElementById('calendar');

    months.forEach((month, monthIndex) => {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');

        const monthClass = colors[monthIndex];
        monthDiv.classList.add(monthClass);

        const monthHeader = document.createElement('div');
        monthHeader.classList.add('month-header');
        if (monthIndex === new Date().getMonth()) {
            monthHeader.classList.add('highlight');
        }
        monthHeader.innerHTML = `<h3>${month}</h3>`;
        monthDiv.appendChild(monthHeader);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-header';
            dayDiv.textContent = day;
            daysGrid.appendChild(dayDiv);
        });

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const startDay = (firstDay === 0) ? 6 : firstDay - 1;

        for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement('div');
            daysGrid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateDiv = document.createElement('div');
            const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            dateDiv.textContent = day;
            dateDiv.className = 'day';
            dateDiv.setAttribute('data-day', date); // Agregar atributo data-day
            dateDiv.onclick = () => showExercisePage(date);

            daysGrid.appendChild(dateDiv);
        }

        monthDiv.appendChild(daysGrid);
        calendar.appendChild(monthDiv);
    });
}

// Actualizar estado de los dias
function updateDayStatus(date, status) {
    const dayElement = document.querySelector(`.day[data-day="${date}"]`);
    if (dayElement) {
        dayElement.classList.remove("done", "not-done");
        dayElement.classList.add(status);
    } else {
        alert("The selected day is not found in the calendar.");
    }
}

// Manejar el marcado de dias como "done" o "not-done"
document.getElementById("mark-done").addEventListener("click", () => {
    const selectedDate = document.getElementById("date-select").value;
    if (selectedDate) {
        updateDayStatus(selectedDate, "done");
    }
});

document.getElementById("mark-not-done").addEventListener("click", () => {
    const selectedDate = document.getElementById("date-select").value;
    if (selectedDate) {
        updateDayStatus(selectedDate, "not-done");
    }
});

// Cargar ejercicios para la fecha seleccionada
function loadExercisesForDate(date) {
    const exercises = performanceData[date] || [];
    exerciseList.innerHTML = '';
    exercises.forEach(({ exercise, series, weight }) => {
        const exerciseField = document.createElement('div');
        exerciseField.className = 'input-group mb-2';
        exerciseField.innerHTML = ` 
            <select name="exercise" class="form-control" required>
                <option value="${exercise}" selected>${exercise}</option>
                <option value="Squats">Squats</option>
                <option value="Bench Press">Bench Press</option>
                <option value="Deadlift">Deadlift</option>
                <option value="Pull-Ups">Pull-Ups</option>
            </select>
            <select name="series" class="form-control" required>
                <option value="${series}" selected>${series}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <input type="number" name="weight" value="${weight}" class="form-control" required>
            <button type="button" class="btn btn-danger" onclick="removeExercise(this)">Remove</button>
        `;
        exerciseList.appendChild(exerciseField);
    });
}

// Funcion para agregar y guardar ejercicios omitida por espacio...
// Inicializar el calendario
generateCalendar();
