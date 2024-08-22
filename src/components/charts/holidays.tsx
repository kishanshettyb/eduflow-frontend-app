import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllHolidayPagination } from '@/services/queries/admin/attendance';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const CalendarWithEvents = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const { schoolId, academicYearId } = useSchoolContext();

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date));
  };

  const handleNextWeek = () => {
    const nextWeekStartDate = new Date(startDate);
    nextWeekStartDate.setDate(startDate.getDate() + 7);
    setStartDate(nextWeekStartDate);
  };

  const handlePreviousWeek = () => {
    const previousWeekStartDate = new Date(startDate);
    previousWeekStartDate.setDate(startDate.getDate() - 7);
    setStartDate(previousWeekStartDate);
  };

  const getWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(startDate);

  const payload = {
    page: 0,
    size: 10,
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          academicYear: {
            academicYearId: academicYearId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          school: {
            schoolId: schoolId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          leaveDate: format(selectedDate, 'yyyy-MM-dd')
        }
      }
    ]
  };

  const { data: holidayData } = useGetAllHolidayPagination(schoolId, payload);

  useEffect(() => {
    if (holidayData) {
      setEvents(holidayData.data?.content || []);
    }
  }, [holidayData]);

  return (
    <div>
      <div>
        <h2 className="text-xl text-slate-800 font-semibold">Upcoming Events</h2>
      </div>

      <div className="container mt-10">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePreviousWeek} className="p-2 rounded-full bg-gray-200">
            &lt;
          </button>
          <div className="text-xl font-semibold">{format(startDate, 'MMMM yyyy')}</div>
          <button onClick={handleNextWeek} className="p-2 rounded-full bg-gray-200">
            &gt;
          </button>
        </div>

        <div className="text-center">
          <div className="flex justify-center">
            {weekDates.map((date) => (
              <div
                key={date}
                onClick={() => handleDateChange(date)}
                className={`cursor-pointer p-2 rounded-full mx-2 transition-colors duration-200 ${
                  selectedDate.toDateString() === date.toDateString()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                <div className="text-sm">{format(date, 'EEE')}</div>
                <div className="text-lg font-semibold">{format(date, 'd')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold">Events on {format(selectedDate, 'MM/dd/yyyy')}</h3>
          <div className="mt-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-center mb-4 bg-blue-400 text-white p-4 rounded-md"
              >
                <div className="w-1/3">{format(new Date(event.leaveDate), 'MM/dd/yyyy')}</div>
                <div className="w-2/3">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWithEvents;
