// Timetable Configuration - Exact match to provided timetable
const TIMETABLE_CONFIG = {
    // Time slots configuration (excluding lunch)
    timeSlots: [
        { start: "9:00", end: "9:50" },
        { start: "10:00", end: "10:50" },
        { start: "11:00", end: "11:50" },
        { start: "12:00", end: "12:50" },
        { start: "2:00", end: "2:50" },
        { start: "3:00", end: "3:50" },
        { start: "4:00", end: "4:50" },
        { start: "5:00", end: "5:50" },
        { start: "6:00", end: "6:50" },
        { start: "6:50", end: "7:30" }
    ],

    // Lab time slots (different timing)
    labTimeSlots: [
        { start: "9:00", end: "9:50" },
        { start: "09:50", end: "10:40" },
        { start: "11:00", end: "11:50" },
        { start: "11:50", end: "12:40" },
        { start: "2:00", end: "2:50" },
        { start: "2:50", end: "3:40" },
        { start: "4:00", end: "4:50" },
        { start: "4:50", end: "5:40" },
        { start: "6:00", end: "6:50" },
        { start: "6:50", end: "7:30" }
    ],

    // Days of the week
    days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],

    // Theory slots mapping by day and time (exact from provided timetable)
    theorySlots: {
        'MON': ['TAA', 'TAA1', 'TBB', 'TBB1', 'TCC', 'TCC1', 'TD', 'TD1', 'L49', 'L50'],
        'TUE': ['TC', 'TC1', 'TA', 'TA1', 'TB', 'TB1', 'D', 'D1', 'L51', 'L52'],
        'WED': ['', 'B1', 'C1', 'A1', 'D1', 'D2', 'C2', 'A2', 'B2', ''],
        'THU': ['C', 'C1', 'B', 'B1', 'A', 'A1', 'D', 'D1', 'L55', 'L56'],
        'FRI': ['TA', 'TA1', 'TC', 'TC1', 'TB', 'TB1', 'D', 'D1', 'L57', 'L58'],
        'SAT': ['TBB', 'TBB1', 'TCC', 'TCC1', 'TAA', 'TAA1', 'TD', 'TD1', 'L59', 'L60']
    },

    // Lab slots mapping by day and time (L1-L60 from provided timetable)
    labSlots: {
        'MON': ['L1', 'L2', 'L3', 'L4', 'L25', 'L26', 'L27', 'L28', 'L49', 'L50'],
        'TUE': ['L5', 'L6', 'L7', 'L8', 'L29', 'L30', 'L31', 'L32', 'L51', 'L52'],
        'WED': ['L9', 'L10', 'L11', 'L12', 'L33', 'L34', 'L35', 'L36', 'L53', 'L54'],
        'THU': ['L13', 'L14', 'L15', 'L16', 'L37', 'L38', 'L39', 'L40', 'L55', 'L56'],
        'FRI': ['L17', 'L18', 'L19', 'L20', 'L41', 'L42', 'L43', 'L44', 'L57', 'L58'],
        'SAT': ['L21', 'L22', 'L23', 'L24', 'L45', 'L46', 'L47', 'L48', 'L59', 'L60']
    },

    // Slot combinations based on credits from the timetable bottom section
    slotCombinations: {
        4: {
            'A': ['A', 'A1', 'TA', 'TA1', 'TAA', 'TAA1'],
            'B': ['B', 'B1', 'TB', 'TB1', 'TBB', 'TBB1'],
            'C': ['C', 'C1', 'TC', 'TC1', 'TCC', 'TCC1'],
            'D': ['D', 'D1', 'TD', 'TD1']
        },
        3: {
            'A': ['A', 'A1', 'TA', 'TA1', 'TAA', 'TAA1'],
            'B': ['B', 'B1', 'TB', 'TB1', 'TBB', 'TBB1'],
            'C': ['C', 'C1', 'TC', 'TC1', 'TCC', 'TCC1'],
            'D': ['D', 'D1', 'TD', 'TD1']
        },
        2: {
            'A': ['A', 'A1','TA', 'TA1'],
            'B': ['B', 'B1','TB', 'TB1'],
            'C': ['C', 'C1','TC', 'TC1'],
            'D': ['D', 'D1'],
        },
        1: {
            'TA': ['TA', 'TA1'],
  'TAA': ['TAA', 'TAA1'],
  'TB': ['TB', 'TB1'],
  'TBB': ['TBB', 'TBB1'],
  'TC': ['TC', 'TC1'],
  'TCC': ['TCC', 'TCC1'],
  'TD': ['TD', 'TD1']
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TIMETABLE_CONFIG;
}
