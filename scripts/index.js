const calendarPage = document.getElementById('calendarPage');
const exercisePage = document.getElementById('exercisePage');
const performancePage = document.getElementById('performancePage');
const selectedDate = document.getElementById('selectedDate');
const exerciseList = document.getElementById('exerciseList');
let performanceData = JSON.parse(localStorage.getItem('gymPerformance')) || {};

function showCalendar() {
    calendarPage.style.display = 'block';
    exercisePage.style.display = 'none';
    performancePage.style.display = 'none';
}

function showExercisePage(date) {
    calendarPage.style.display = 'none';
    performancePage.style.display = 'none';
    exercisePage.style.display = 'block';
    selectedDate.textContent = date;
    loadExercisesForDate(date);
}

function showPerformancePage() {
    calendarPage.style.display = 'none';
    exercisePage.style.display = 'none';
    performancePage.style.display = 'block';
    loadPerformanceData();
}

// Generación del Calendario
function generateCalendar() {
    const year = 2025;
    const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const colors = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const calendar = document.getElementById('calendar');
    
    months.forEach((month, monthIndex) => {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');

        // Asignar la clase de color correspondiente al mes
        const monthClass = colors[monthIndex]; // Usar la clase de color correspondiente del array 'colors'
        monthDiv.classList.add(monthClass); // Añadir la clase dinámica según el mes

        const monthHeader = document.createElement('div');
        monthHeader.classList.add('month-header');
        
        if (monthIndex === new Date().getMonth()) {
            monthHeader.classList.add('highlight');  // Resaltar el mes actual
        }

        monthHeader.innerHTML = `<h3>${month}</h3>`;
        monthDiv.appendChild(monthHeader);
        
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';
        
        // Días de la semana
        ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-header';
            dayDiv.textContent = day;
            daysGrid.appendChild(dayDiv);
        });

        // Número de días en el mes
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        // Obtener el primer día de la semana del mes
        const firstDay = new Date(year, monthIndex, 1).getDay(); // 0: Dom, 1: Lun, ..., 6: Sáb

        // Ajustar para que el primer día sea lunes (en lugar de domingo que es el valor por defecto de getDay)
        const startDay = (firstDay === 0) ? 6 : firstDay - 1;

        // Añadir los días del mes
        let dayCounter = 1;

        // Añadir celdas vacías para los días previos al primer día del mes
        for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement('div');
            daysGrid.appendChild(emptyDiv); // Celdas vacías
        }

        // Añadir los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dateDiv = document.createElement('div');
            const date = `${year}-${monthIndex + 1}-${day}`;

            // Mostrar el número del día
            dateDiv.textContent = day;
            dateDiv.className = 'day';
            dateDiv.onclick = () => showExercisePage(date);

            daysGrid.appendChild(dateDiv);
        }

        monthDiv.appendChild(daysGrid);
        calendar.appendChild(monthDiv);
    });
}

// Cargar los ejercicios para la fecha seleccionada
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

// Función para agregar un campo de ejercicio
function addExerciseField() {
    const exerciseField = document.createElement('div');
    exerciseField.className = 'input-group mb-2';
    exerciseField.innerHTML = `
        <select name="exercise" class="form-control" required>
            <option value="">Select Exercise</option>
            <option value="Squats">Squats</option>
            <option value="Bench Press">Bench Press</option>
            <option value="Deadlift">Deadlift</option>
            <option value="Pull-Ups">Pull-Ups</option>
        </select>
        <select name="series" class="form-control" required>
            <option value="">Select Series</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </select>
        <input type="number" name="weight" placeholder="Weight (kg)" class="form-control" required>
        <button type="button" class="btn btn-danger" onclick="removeExercise(this)">Remove</button>
    `;
    exerciseList.appendChild(exerciseField);
}

// Función para remover un campo de ejercicio
function removeExercise(button) {
    button.parentElement.remove();
}

// Guardar los ejercicios
document.getElementById('exerciseDataForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = selectedDate.textContent;
    const formData = new FormData(e.target);
    const exercises = [];
    for (let i = 0; i < formData.getAll('exercise').length; i++) {
        exercises.push({
            exercise: formData.getAll('exercise')[i],
            series: formData.getAll('series')[i],
            weight: formData.getAll('weight')[i]
        });
    }
    performanceData[date] = exercises;
    localStorage.setItem('gymPerformance', JSON.stringify(performanceData));
    alert('Exercises saved!');
});

// Cargar los datos de rendimiento
function loadPerformanceData() {
    const savedData = document.getElementById('savedData');
    savedData.innerHTML = '';
    for (const [date, exercises] of Object.entries(performanceData)) {
        const dateDiv = document.createElement('div');
        dateDiv.innerHTML = `<h4>${date}</h4>`;
        exercises.forEach(({ exercise, series, weight }) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.textContent = `${exercise} - ${series} series - ${weight}kg`;
            dateDiv.appendChild(exerciseDiv);
        });
        savedData.appendChild(dateDiv);
    }
}

    // Función para eliminar los registros de rendimiento de forma permanente
    function deletePerformanceRecords() {
        // Eliminar los registros de ejercicios guardados en localStorage
        localStorage.removeItem('gymPerformance');  // Usar 'gymPerformance' como clave
        
        // Actualizar la vista de Performance sin los datos eliminados
        const savedDataContainer = document.getElementById('savedData');
        savedDataContainer.innerHTML = '<p class="message">Performance records have been deleted.</p>';
        
        // Deshabilitar el botón de eliminar ya que no hay registros
        document.getElementById('deleteRecordsButton').disabled = true;
        
    }

// Inicializar el calendario
generateCalendar();

