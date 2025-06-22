// Global variables
let selectedCourses = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    generateTimetable();
    initializeEventListeners();
    loadSavedData();
    updateCreditSummary();
    updateCourseList();
});

function generateTimetable() {
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = '';

    TIMETABLE_CONFIG.days.forEach(day => {
        const row = document.createElement('tr');
        
        // Day label
        const dayCell = document.createElement('td');
        dayCell.className = 'day-label';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        // Time slots for this day - first 4 slots
        for (let timeIndex = 0; timeIndex < 4; timeIndex++) {
            const cell = document.createElement('td');
            cell.className = 'slot-cell';

            // Theory slot
            const theorySlot = TIMETABLE_CONFIG.theorySlots[day][timeIndex];
            if (theorySlot && theorySlot !== '') {
                const theoryDiv = document.createElement('div');
                theoryDiv.className = 'theory-slot';
                theoryDiv.setAttribute('data-slot', theorySlot);
                theoryDiv.setAttribute('data-day', day);
                theoryDiv.setAttribute('data-time', timeIndex);
                theoryDiv.textContent = theorySlot;
                cell.appendChild(theoryDiv);
            }

            // Lab slot
            const labSlot = TIMETABLE_CONFIG.labSlots[day][timeIndex];
            if (labSlot && labSlot !== '') {
                const labDiv = document.createElement('div');
                labDiv.className = 'lab-slot';
                labDiv.setAttribute('data-slot', labSlot);
                labDiv.setAttribute('data-day', day);
                labDiv.setAttribute('data-time', timeIndex);
                labDiv.textContent = labSlot;
                cell.appendChild(labDiv);
            }

            row.appendChild(cell);
        }

        // Add lunch cell after first 4 slots
        const lunchCell = document.createElement('td');
        lunchCell.classList.add('lunch-cell');
        lunchCell.innerHTML = '';
        row.appendChild(lunchCell);

        // Add remaining slots after lunch
        for (let timeIndex = 4; timeIndex < TIMETABLE_CONFIG.timeSlots.length; timeIndex++) {
            const cell = document.createElement('td');
            cell.className = 'slot-cell';

            // Theory slot
            const theorySlot = TIMETABLE_CONFIG.theorySlots[day][timeIndex];
            if (theorySlot && theorySlot !== '') {
                const theoryDiv = document.createElement('div');
                theoryDiv.className = 'theory-slot';
                theoryDiv.setAttribute('data-slot', theorySlot);
                theoryDiv.setAttribute('data-day', day);
                theoryDiv.setAttribute('data-time', timeIndex);
                theoryDiv.textContent = theorySlot;
                cell.appendChild(theoryDiv);
            }

            // Lab slot
            const labSlot = TIMETABLE_CONFIG.labSlots[day][timeIndex];
            if (labSlot && labSlot !== '') {
                const labDiv = document.createElement('div');
                labDiv.className = 'lab-slot';
                labDiv.setAttribute('data-slot', labSlot);
                labDiv.setAttribute('data-day', day);
                labDiv.setAttribute('data-time', timeIndex);
                labDiv.textContent = labSlot;
                cell.appendChild(labDiv);
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    });
}

function initializeEventListeners() {
    // Button event listeners
    document.getElementById('addTheoryBtn').addEventListener('click', openTheoryModal);
    document.getElementById('addLabBtn').addEventListener('click', openLabModal);
    document.getElementById('downloadBtn').addEventListener('click', downloadTimetable);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllSlots);

    // Theory modal event listeners
    document.getElementById('closeTheory').addEventListener('click', closeTheoryModal);
    document.getElementById('cancelTheory').addEventListener('click', closeTheoryModal);
    document.getElementById('confirmTheory').addEventListener('click', addTheorySlot);

    // Lab modal event listeners
    document.getElementById('closeLab').addEventListener('click', closeLabModal);
    document.getElementById('cancelLab').addEventListener('click', closeLabModal);
    document.getElementById('confirmLab').addEventListener('click', addLabSlot);

    // Conflict modal event listeners
    document.getElementById('closeConflict').addEventListener('click', closeConflictModal);
    document.getElementById('closeConflictBtn').addEventListener('click', closeConflictModal);

    // Theory credits change listener
    document.getElementById('theoryCredits').addEventListener('change', updateAvailableSlots);
    document.getElementById('theorySlotGroup').addEventListener('change', updateAvailableSlots);

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const theoryModal = document.getElementById('theoryModal');
        const labModal = document.getElementById('labModal');
        const conflictModal = document.getElementById('conflictModal');
        
        if (event.target === theoryModal || event.target.classList.contains('modal-overlay')) {
            if (event.target === theoryModal || event.target.closest('.modal-content') === null) {
                closeTheoryModal();
            }
        }
        if (event.target === labModal || event.target.classList.contains('modal-overlay')) {
            if (event.target === labModal || event.target.closest('.modal-content') === null) {
                closeLabModal();
            }
        }
        if (event.target === conflictModal || event.target.classList.contains('modal-overlay')) {
            if (event.target === conflictModal || event.target.closest('.modal-content') === null) {
                closeConflictModal();
            }
        }
    });
}

function openTheoryModal() {
    document.getElementById('theoryModal').style.display = 'block';
    document.getElementById('theoryCourseCode').value = '';
    document.getElementById('theoryCredits').value = '4';
    updateSlotGroupVisibility();
    updateAvailableSlots();
    // Focus on course code input for better UX and scroll to top
    setTimeout(() => {
        document.getElementById('theoryCourseCode').focus();
        document.querySelector('#theoryModal .modal-content').scrollTop = 0;
    }, 100);
}

function closeTheoryModal() {
    document.getElementById('theoryModal').style.display = 'none';
}

function openLabModal() {
    document.getElementById('labModal').style.display = 'block';
    document.getElementById('labCourseCode').value = '';
    document.getElementById('labSlot1').value = '';
    document.getElementById('labSlot2').value = '';
    // Focus on course code input for better UX and scroll to top
    setTimeout(() => {
        document.getElementById('labCourseCode').focus();
        document.querySelector('#labModal .modal-content').scrollTop = 0;
    }, 100);
}

function closeLabModal() {
    document.getElementById('labModal').style.display = 'none';
}

function closeConflictModal() {
    document.getElementById('conflictModal').style.display = 'none';
}

function updateSlotGroupVisibility() {
    const credits = parseInt(document.getElementById('theoryCredits').value);
    const slotGroupContainer = document.getElementById('slotGroupContainer');
    
    slotGroupContainer.style.display = 'block';
    const select = document.getElementById('theorySlotGroup');
    const currentValue = select.value; // Store current selection
    select.innerHTML = '';

    const availableGroups = Object.keys(TIMETABLE_CONFIG.slotCombinations[credits] || {});
    availableGroups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        select.appendChild(option);
    });

    // Restore previous selection if it exists, otherwise use first option
    if (availableGroups.includes(currentValue)) {
        select.value = currentValue;
    } else if (availableGroups.length > 0) {
        select.value = availableGroups[0];
    }
}

function updateAvailableSlots() {
    const credits = parseInt(document.getElementById('theoryCredits').value);
    const slotGroup = document.getElementById('theorySlotGroup').value;
    const availableSlotsDiv = document.getElementById('availableSlots');
    
    updateSlotGroupVisibility();
    
    let slotsToShow = [];
    
    if (TIMETABLE_CONFIG.slotCombinations[credits] && TIMETABLE_CONFIG.slotCombinations[credits][slotGroup]) {
        slotsToShow = TIMETABLE_CONFIG.slotCombinations[credits][slotGroup];
    }
    
    availableSlotsDiv.innerHTML = '<h4>Available Slots</h4>';
    
    if (slotsToShow.length > 0) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot-info';
        slotDiv.innerHTML = `<p><strong>${slotGroup}:</strong> ${slotsToShow.join(' + ')}</p>`;
        availableSlotsDiv.appendChild(slotDiv);
    } else {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot-info';
        slotDiv.innerHTML = `<p>No slots available for ${credits} credits with group ${slotGroup}</p>`;
        availableSlotsDiv.appendChild(slotDiv);
    }
}

function addTheorySlot() {
    const courseCode = document.getElementById('theoryCourseCode').value.trim().toUpperCase();
    const credits = parseInt(document.getElementById('theoryCredits').value);
    const slotGroup = document.getElementById('theorySlotGroup').value;
    
    if (!courseCode) {
        showNotification('Please enter a course code', 'error');
        return;
    }
    
    // Check if course already exists
    const existingCourse = selectedCourses.find(course => course.code === courseCode);
    if (existingCourse) {
        showNotification(`Course ${courseCode} is already added with slots: ${existingCourse.slots.join(', ')}`, 'warning');
        return;
    }
    
    let slotsToAllocate = [];
    
    if (TIMETABLE_CONFIG.slotCombinations[credits] && TIMETABLE_CONFIG.slotCombinations[credits][slotGroup]) {
        slotsToAllocate = TIMETABLE_CONFIG.slotCombinations[credits][slotGroup];
    }
    
    if (slotsToAllocate.length === 0) {
        showNotification('No slots available for the selected combination', 'error');
        return;
    }
    
    // Check for conflicts
    const conflicts = checkSlotConflicts(slotsToAllocate, 'theory');
    
    if (conflicts.length > 0) {
        showConflictModal(conflicts);
        return;
    }
    
    // Add the course
    const newCourse = {
        code: courseCode,
        credits: credits,
        type: 'theory',
        slots: slotsToAllocate,
        slotGroup: slotGroup
    };
    
    selectedCourses.push(newCourse);
    
    // Mark slots as selected with animation
    slotsToAllocate.forEach((slot, index) => {
        setTimeout(() => {
            markSlotAsSelected(slot, courseCode, 'theory');
        }, index * 100);
    });
    
    saveData();
    updateCreditSummary();
    updateCourseList();
    closeTheoryModal();
    showNotification(`Course ${courseCode} added successfully!`, 'success');
}

function addLabSlot() {
    const courseCode = document.getElementById('labCourseCode').value.trim().toUpperCase();
    const slot1 = document.getElementById('labSlot1').value.trim().toUpperCase();
    const slot2 = document.getElementById('labSlot2').value.trim().toUpperCase();
    
    if (!courseCode || !slot1 || !slot2) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (slot1 === slot2) {
        showNotification('Please select two different lab slots', 'error');
        return;
    }
    
    // Validate lab slot format
    if (!isValidLabSlot(slot1) || !isValidLabSlot(slot2)) {
        showNotification('Lab slots must be in format L1, L2, etc. (L1-L60)', 'error');
        return;
    }
    
    // Check if course already exists
    const existingCourse = selectedCourses.find(course => course.code === courseCode);
    if (existingCourse) {
        showNotification(`Course ${courseCode} is already added with slots: ${existingCourse.slots.join(', ')}`, 'warning');
        return;
    }
    
    const labSlots = [slot1, slot2];
    
    // Check for conflicts
    const conflicts = checkSlotConflicts(labSlots, 'lab');
    
    if (conflicts.length > 0) {
        showConflictModal(conflicts);
        return;
    }
    
    // Add the course
    const newCourse = {
        code: courseCode,
        credits: 1, // Lab courses typically have 1 credit
        type: 'lab',
        slots: labSlots
    };
    
    selectedCourses.push(newCourse);
    
    // Mark slots as selected with animation
    labSlots.forEach((slot, index) => {
        setTimeout(() => {
            markSlotAsSelected(slot, courseCode, 'lab');
        }, index * 150);
    });
    
    saveData();
    updateCreditSummary();
    updateCourseList();
    closeLabModal();
    showNotification(`Lab course ${courseCode} added successfully!`, 'success');
}

function highlightCourseSlots(courseCode, highlight) {
    const course = selectedCourses.find(c => c.code === courseCode);
    if (!course) return;
    
    course.slots.forEach(slot => {
        const slotElements = document.querySelectorAll(`[data-slot="${slot}"].selected`);
        slotElements.forEach(element => {
            if (highlight) {
                element.classList.add('highlighted');
            } else {
                element.classList.remove('highlighted');
            }
        });
    });
}

function isValidLabSlot(slot) {
    // Check if slot is in format L1-L60
    const match = slot.match(/^L(\d+)$/);
    if (!match) return false;
    
    const number = parseInt(match[1]);
    return number >= 1 && number <= 60;
}

function checkSlotConflicts(newSlots, type) {
    const conflicts = [];
    
    newSlots.forEach(slot => {
        // Find all slot elements with this slot name
        const slotElements = document.querySelectorAll(`[data-slot="${slot}"]`);
        
        slotElements.forEach(element => {
            // Check if this slot is already selected
            if (element.classList.contains('selected')) {
                const day = element.getAttribute('data-day');
                const timeIndex = parseInt(element.getAttribute('data-time'));
                const timeSlot = TIMETABLE_CONFIG.timeSlots[timeIndex];
                const conflictingCourse = getSlotCourse(element);
                const conflictType = element.classList.contains('theory-slot') ? 'Theory' : 'Lab';
                
                conflicts.push({
                    slot: slot,
                    day: day,
                    time: timeSlot ? `${timeSlot.start} - ${timeSlot.end}` : 'Unknown time',
                    conflictingCourse: conflictingCourse,
                    conflictType: conflictType
                });
            }
            
            // Check for cross-conflicts between theory and lab in same time slot
            const slotCell = element.closest('.slot-cell');
            if (slotCell) {
                const otherSlots = slotCell.querySelectorAll('.theory-slot.selected, .lab-slot.selected');
                otherSlots.forEach(otherSlot => {
                    if (otherSlot !== element && otherSlot.getAttribute('data-slot') !== slot) {
                        const day = element.getAttribute('data-day');
                        const timeIndex = parseInt(element.getAttribute('data-time'));
                        const timeSlot = TIMETABLE_CONFIG.timeSlots[timeIndex];
                        const conflictingCourse = getSlotCourse(otherSlot);
                        const conflictType = otherSlot.classList.contains('theory-slot') ? 'Theory' : 'Lab';
                        
                        conflicts.push({
                            slot: slot,
                            day: day,
                            time: timeSlot ? `${timeSlot.start} - ${timeSlot.end}` : 'Unknown time',
                            conflictingCourse: conflictingCourse,
                            conflictType: conflictType
                        });
                    }
                });
            }
        });
    });
    
    return conflicts;
}

function getSlotCourse(slotElement) {
    const slot = slotElement.getAttribute('data-slot');
    const course = selectedCourses.find(course => course.slots.includes(slot));
    return course ? course.code : 'Unknown';
}

function showConflictModal(conflicts) {
    const modal = document.getElementById('conflictModal');
    const detailsDiv = document.getElementById('conflictDetails');
    
    // Add conflict-modal class for enhanced styling
    modal.classList.add('conflict-modal');
    
    let conflictHtml = '<ul class="conflict-list">';
    conflicts.forEach(conflict => {
        conflictHtml += `
            <li class="conflict-item">
                <div class="conflict-slot">Slot ${conflict.slot}</div>
                <div class="conflict-details">
                    <strong>Day:</strong> ${conflict.day}<br>
                    <strong>Time:</strong> ${conflict.time}<br>
                    <strong>Type:</strong> ${conflict.conflictType || 'Unknown'}<br>
                    <strong>Already occupied by:</strong> ${conflict.conflictingCourse}
                </div>
            </li>
        `;
    });
    conflictHtml += '</ul>';
    
    detailsDiv.innerHTML = conflictHtml;
    modal.style.display = 'block';
}

function markSlotAsSelected(slot, courseCode, type) {
    // Find all slot elements with this slot name
    const slotElements = document.querySelectorAll(`[data-slot="${slot}"]`);
    
    slotElements.forEach(element => {
        if ((type === 'theory' && element.classList.contains('theory-slot')) ||
            (type === 'lab' && element.classList.contains('lab-slot'))) {
            
            element.classList.add('selected');
            
            // Add course code display
            const courseDisplay = document.createElement('div');
            courseDisplay.className = 'slot-course-code';
            courseDisplay.textContent = courseCode;
            element.appendChild(courseDisplay);
            
            // Keep original slot name visible
            const originalName = document.createElement('div');
            originalName.className = 'slot-original-name';
            originalName.textContent = slot;
            element.appendChild(originalName);
        }
    });
}

function clearSlotSelection(slot, type) {
    // Find all slot elements with this slot name
    const slotElements = document.querySelectorAll(`[data-slot="${slot}"]`);
    
    slotElements.forEach(element => {
        if ((type === 'theory' && element.classList.contains('theory-slot')) ||
            (type === 'lab' && element.classList.contains('lab-slot'))) {
            
            element.classList.remove('selected');
            
            // Remove course code display
            const courseDisplay = element.querySelector('.slot-course-code');
            if (courseDisplay) {
                courseDisplay.remove();
            }
            
            // Remove original name display
            const originalName = element.querySelector('.slot-original-name');
            if (originalName) {
                originalName.remove();
            }
        }
    });
}

function updateCreditSummary() {
    const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('totalCredits').textContent = totalCredits;
    document.getElementById('headerCredits').textContent = totalCredits;
    
    // Add animation to credit values
    animateNumber('totalCredits', totalCredits);
    animateNumber('headerCredits', totalCredits);
}

function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    const current = parseInt(element.textContent) || 0;
    const increment = targetNumber > current ? 1 : -1;
    const steps = Math.abs(targetNumber - current);
    let step = 0;
    
    if (steps === 0) return;
    
    const timer = setInterval(() => {
        step++;
        const value = current + (increment * step);
        element.textContent = value;
        
        if (step >= steps) {
            clearInterval(timer);
        }
    }, 50);
}

function updateCourseList() {
    const courseList = document.getElementById('courseList');
    
    if (selectedCourses.length === 0) {
        courseList.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-inbox"></i>
                <p>No courses enrolled yet.</p>
                <small>Start by adding theory or lab courses</small>
            </div>
        `;
        return;
    }
    
    courseList.innerHTML = '';
    
    selectedCourses.forEach((course, index) => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-item';
        courseDiv.style.animationDelay = `${index * 0.1}s`;
        courseDiv.style.animation = 'slideInUp 0.5s ease-out both';
        
        const slotsHTML = course.slots.map(slot => 
            `<span class="slot-tag">${slot}</span>`
        ).join('');
        
        const typeIcon = course.type === 'theory' ? 'fas fa-book' : 'fas fa-flask';
        const creditText = course.credits === 1 ? '1 Credit' : `${course.credits} Credits`;
        
        courseDiv.innerHTML = `
            <div class="course-code">
                <i class="${typeIcon}"></i>
                ${course.code}
            </div>
            <div class="course-details">
                ${creditText} • ${course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                ${course.slotGroup ? ` • Group ${course.slotGroup}` : ''}
            </div>
            <div class="course-slots">${slotsHTML}</div>
            <button class="remove-course" onclick="removeCourse('${course.code}')" title="Remove course">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add hover events for slot highlighting
        courseDiv.addEventListener('mouseenter', () => highlightCourseSlots(course.code, true));
        courseDiv.addEventListener('mouseleave', () => highlightCourseSlots(course.code, false));
        
        courseList.appendChild(courseDiv);
    });
}

function removeCourse(courseCode) {
    const courseIndex = selectedCourses.findIndex(course => course.code === courseCode);
    
    if (courseIndex === -1) return;
    
    const course = selectedCourses[courseIndex];
    
    // Clear slot selections with animation
    course.slots.forEach((slot, index) => {
        setTimeout(() => {
            clearSlotSelection(slot, course.type);
        }, index * 100);
    });
    
    // Remove from array
    selectedCourses.splice(courseIndex, 1);
    
    saveData();
    updateCreditSummary();
    updateCourseList();
    showNotification(`Course ${courseCode} removed successfully!`, 'success');
}

function clearAllSlots() {
    if (selectedCourses.length === 0) {
        showNotification('No courses to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all courses? This action cannot be undone.')) {
        // Clear all slot selections with staggered animation
        let delay = 0;
        selectedCourses.forEach(course => {
            course.slots.forEach(slot => {
                setTimeout(() => {
                    clearSlotSelection(slot, course.type);
                }, delay);
                delay += 50;
            });
        });
        
        selectedCourses = [];
        saveData();
        updateCreditSummary();
        updateCourseList();
        showNotification('All courses cleared successfully!', 'success');
    }
}

function downloadTimetable() {
    const timetableWrapper = document.getElementById('timetableWrapper');
    
    if (!timetableWrapper) {
        showNotification('Timetable not found', 'error');
        return;
    }
    
    showNotification('Preparing download...', 'info');
    
    // Use html2canvas to capture the timetable
    html2canvas(timetableWrapper, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: timetableWrapper.scrollWidth,
        height: timetableWrapper.scrollHeight
    }).then(canvas => {
        // Create download link
        const link = document.createElement('a');
        link.download = `timetable-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification('Timetable downloaded successfully!', 'success');
    }).catch(error => {
        console.error('Error generating timetable image:', error);
        showNotification('Error downloading timetable. Please try again.', 'error');
    });
}

function saveData() {
    try {
        localStorage.setItem('timetableData', JSON.stringify(selectedCourses));
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Error saving data', 'error');
    }
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('timetableData');
        if (savedData) {
            selectedCourses = JSON.parse(savedData);
            
            // Restore slot selections
            selectedCourses.forEach(course => {
                course.slots.forEach(slot => {
                    markSlotAsSelected(slot, course.code, course.type);
                });
            });
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
        selectedCourses = [];
        showNotification('Error loading saved data', 'warning');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border-left: 4px solid var(--${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'primary'}-500);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 3000;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
        color: var(--secondary-800);
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 500;
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: var(--secondary-400);
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        margin-left: auto;
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification styles to document head
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .notification-close:hover {
        background-color: var(--neutral-100) !important;
        color: var(--secondary-600) !important;
    }
    
    .notification i:first-child {
        color: var(--primary-600);
        font-size: 16px;
    }
    
    .notification-success i:first-child {
        color: var(--success-600);
    }
    
    .notification-error i:first-child {
        color: var(--danger-600);
    }
    
    .notification-warning i:first-child {
        color: var(--warning-600);
    }
`;
document.head.appendChild(notificationStyles);
(function() {
    const devToolsOpenedMessage = "Can't access DevTools 🚫";

    function showDevToolsWarning() {
        showNotification(devToolsOpenedMessage, 'error');
    }

    // Detect DevTools using window size tricks
    let threshold = 160;
    setInterval(() => {
        if (
            window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold
        ) {
            showDevToolsWarning();
        }
    }, 1000);

    // Detect F12, Ctrl+Shift+I/J/C
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            showDevToolsWarning();
        }
    });

    // Optionally block right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showNotification('Right-click is disabled', 'warning');
    });
})();

