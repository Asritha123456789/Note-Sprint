// document.addEventListener('DOMContentLoaded', function () {
//     const calendarDays = document.getElementById('calendar-days');
//     const monthYear = document.getElementById('month-year');
//     const prevMonthBtn = document.getElementById('prev-month');
//     const nextMonthBtn = document.getElementById('next-month');
//     const eventSidebar = document.getElementById('event-sidebar');
//     const eventList = document.getElementById('event-list');
//     const eventForm = document.getElementById('event-form');
//     const eventTitleInput = document.getElementById('event-title');
//     const eventDateInput = document.getElementById('event-date');
//     const saveEventsBtn = document.getElementById('save-events');
//     const calendarIcon = document.getElementById('calendar-icon');

//     let currentMonth = new Date().getMonth();
//     let currentYear = new Date().getFullYear();
//     let events = {};

//     function renderCalendar(month, year) {
//         console.log('Rendering calendar for:', month, year);
//         calendarDays.innerHTML = '';
//         monthYear.innerText = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

//         const firstDay = new Date(year, month).getDay();
//         const daysInMonth = new Date(year, month + 1, 0).getDate();

//         for (let i = 0; i < firstDay; i++) {
//             const emptyCell = document.createElement('div');
//             emptyCell.classList.add('empty-cell');
//             calendarDays.appendChild(emptyCell);
//         }

//         for (let day = 1; day <= daysInMonth; day++) {
//             const dayCell = document.createElement('div');
//             dayCell.innerText = day;
//             const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//             dayCell.dataset.date = formattedDate;

//             if (events[formattedDate]) {
//                 dayCell.classList.add('event-day');
//                 events[formattedDate].forEach(event => {
//                     const eventSpan = document.createElement('span');
//                     eventSpan.innerText = event;
//                     dayCell.appendChild(eventSpan);
//                 });
//             }

//             dayCell.addEventListener('click', function () {
//                 eventDateInput.value = dayCell.dataset.date;
//                 openSidebar(dayCell.dataset.date);
//             });

//             calendarDays.appendChild(dayCell);
//         }
//     }

//     function openSidebar(date) {
//         console.log('Opening sidebar for date:', date);
//         eventSidebar.classList.add('open');
//         renderEventList(date);
//     }

//     function renderEventList(date) {
//         eventList.innerHTML = '';
//         if (events[date]) {
//             events[date].forEach((event, index) => {
//                 const eventDiv = document.createElement('div');
//                 const eventText = document.createElement('span');
//                 const deleteButton = document.createElement('button');

//                 eventText.innerText = event;
//                 deleteButton.innerText = 'Delete';
//                 deleteButton.addEventListener('click', function () {
//                     deleteEvent(date, event);
//                 });

//                 eventDiv.appendChild(eventText);
//                 eventDiv.appendChild(deleteButton);
//                 eventList.appendChild(eventDiv);
//             });
//         }
//     }

//     function deleteEvent(date, title) {
//         console.log('Deleting event:', title, 'on date:', date);
//         fetch('../php/delete_event.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ date, title })
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Delete response:', data);
//             if (data.status === 'success') {
//                 events[date] = events[date].filter(event => event !== title);
//                 if (events[date].length === 0) {
//                     delete events[date];
//                 }
//                 renderCalendar(currentMonth, currentYear);
//                 renderEventList(date);
//             }
//         });
//     }

//     function saveEvents() {
//         const eventsToSave = [];
//         for (const date in events) {
//             if (events.hasOwnProperty(date)) {
//                 events[date].forEach(title => {
//                     if (title && date) {  // Ensure both date and title are valid
//                         eventsToSave.push({ date, title });
//                     } else {
//                         console.error('Invalid event data:', { date, title });
//                     }
//                 });
//             }
//         }

//         // Logging collected events before sending
//         console.log('Events to save:', eventsToSave);

//         fetch('../php/save_events.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(eventsToSave)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Save response:', data);
//             if (data.status === 'success') {
//                 eventSidebar.classList.remove('open');
//             } else {
//                 console.error('Save error:', data.message, JSON.stringify(data));
//             }
//         })
//         .catch(error => {
//             console.error('Fetch error:', error);
//         });
//     }

//     function fetchEvents() {
//         console.log('Fetching events...');
//         fetch('../php/get_events.php')
//         .then(response => response.json())
//         .then(data => {
//             console.log('Fetched events:', data);
//             data.forEach(event => {
//                 const date = event.event_date;
//                 const title = event.event_title;

//                 if (!events[date]) {
//                     events[date] = [];
//                 }
//                 events[date].push(title);
//             });
//             renderCalendar(currentMonth, currentYear);
//         });
//     }

//     prevMonthBtn.addEventListener('click', function () {
//         currentMonth--;
//         if (currentMonth < 0) {
//             currentMonth = 11;
//             currentYear--;
//         }
//         renderCalendar(currentMonth, currentYear);
//     });

//     nextMonthBtn.addEventListener('click', function () {
//         currentMonth++;
//         if (currentMonth > 11) {
//             currentMonth = 0;
//             currentYear++;
//         }
//         renderCalendar(currentMonth, currentYear);
//     });

//     eventForm.addEventListener('submit', function (e) {
//         e.preventDefault();
//         const date = eventDateInput.value;
//         const title = eventTitleInput.value;

//         if (date && title) {
//             if (!events[date]) {
//                 events[date] = [];
//             }
//             events[date].push(title);

//             eventTitleInput.value = '';
//             renderCalendar(currentMonth, currentYear);
//             renderEventList(date);
//         } else {
//             console.error('Invalid event data:', { date, title });
//         }
//     });

//     saveEventsBtn.addEventListener('click', function() {
//         console.log("Save Events Button Clicked");
//         saveEvents();
//     });

//     calendarIcon.addEventListener('click', function () {
//         eventSidebar.classList.remove('open');
//     });

//     // Fetch and render events when the page loads
//     fetchEvents();
//     renderCalendar(currentMonth, currentYear);
// });


document.addEventListener('DOMContentLoaded', function () {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const eventSidebar = document.getElementById('event-sidebar');
    const eventList = document.getElementById('event-list');
    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const saveEventsBtn = document.getElementById('save-events');
    const calendarIcon = document.getElementById('calendar-icon');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = {}; // All events
    let fetchedEvents = {}; // Events fetched from the database

    function renderCalendar(month, year) {
        console.log('Rendering calendar for:', month, year);
        calendarDays.innerHTML = '';
        monthYear.innerText = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty-cell');
            calendarDays.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.innerText = day;
            const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dayCell.dataset.date = formattedDate;

            if (events[formattedDate]) {
                dayCell.classList.add('event-day');
                events[formattedDate].forEach(event => {
                    const eventSpan = document.createElement('span');
                    eventSpan.innerText = event;
                    dayCell.appendChild(eventSpan);
                });
            }

            dayCell.addEventListener('click', function () {
                eventDateInput.value = dayCell.dataset.date;
                openSidebar(dayCell.dataset.date);
            });

            calendarDays.appendChild(dayCell);
        }
    }

    function openSidebar(date) {
        console.log('Opening sidebar for date:', date);
        eventSidebar.classList.add('open');
        renderEventList(date);
    }

    function renderEventList(date) {
        eventList.innerHTML = '';
        if (events[date]) {
            events[date].forEach((event, index) => {
                const eventDiv = document.createElement('div');
                const eventText = document.createElement('span');
                const deleteButton = document.createElement('button');

                eventText.innerText = event;
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', function () {
                    deleteEvent(date, event);
                });

                eventDiv.appendChild(eventText);
                eventDiv.appendChild(deleteButton);
                eventList.appendChild(eventDiv);
            });
        }
    }

    function deleteEvent(date, title) {
        console.log('Deleting event:', title, 'on date:', date);
        fetch('../php/delete_event.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, title })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Delete response:', data);
            if (data.status === 'success') {
                events[date] = events[date].filter(event => event !== title);
                if (events[date].length === 0) {
                    delete events[date];
                }
                renderCalendar(currentMonth, currentYear);
                renderEventList(date);
            }
        });
    }

    function saveEvents() {
        const newEventsToSave = [];
        for (const date in events) {
            if (events.hasOwnProperty(date)) {
                events[date].forEach(title => {
                    if (title && date) {  // Ensure both date and title are valid
                        if (!fetchedEvents[date] || !fetchedEvents[date].includes(title)) {
                            newEventsToSave.push({ date, title });
                        }
                    } else {
                        console.error('Invalid event data:', { date, title });
                    }
                });
            }
        }

        // Logging new events before sending
        console.log('New events to save:', newEventsToSave);

        fetch('../php/save_events.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEventsToSave)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Save response:', data);
            if (data.status === 'success') {
                eventSidebar.classList.remove('open');
                // Update fetchedEvents to include newly saved events
                newEventsToSave.forEach(event => {
                    const { date, title } = event;
                    if (!fetchedEvents[date]) {
                        fetchedEvents[date] = [];
                    }
                    fetchedEvents[date].push(title);
                });
            } else {
                console.error('Save error:', data.message, JSON.stringify(data));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

    function fetchEvents() {
        console.log('Fetching events...');
        fetch('../php/get_events.php')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched events:', data);
            data.forEach(event => {
                const date = event.event_date;
                const title = event.event_title;

                if (!events[date]) {
                    events[date] = [];
                }
                if (!fetchedEvents[date]) {
                    fetchedEvents[date] = [];
                }
                events[date].push(title);
                fetchedEvents[date].push(title);
            });
            renderCalendar(currentMonth, currentYear);
        });
    }

    prevMonthBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const date = eventDateInput.value;
        const title = eventTitleInput.value;

        if (date && title) {
            if (!events[date]) {
                events[date] = [];
            }
            events[date].push(title);

            eventTitleInput.value = '';
            renderCalendar(currentMonth, currentYear);
            renderEventList(date);
        } else {
            console.error('Invalid event data:', { date, title });
        }
    });

    saveEventsBtn.addEventListener('click', function() {
        console.log("Save Events Button Clicked");
        saveEvents();
    });

    calendarIcon.addEventListener('click', function () {
        eventSidebar.classList.remove('open');
    });

    // Fetch and render events when the page loads
    fetchEvents();
    renderCalendar(currentMonth, currentYear);
});
